/**
 * @file index.ts
 * @description AI Service entry point - real analysis engine using Gemini 1.5 Flash.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { Redis } from '@upstash/redis';
import { PalmAnalysisResult, HandShape } from '@palmistry/types';
import { ErrorCode, AppError, createErrorResponse, logger, logError, supabase } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';

const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.AI_SERVICE_PORT || 3002;

// Initialize AI & Cache
const genAI = env.GEMINI_API_KEY ? new GoogleGenerativeAI(env.GEMINI_API_KEY) : null;
const redis = env.UPSTASH_REDIS_REST_URL ? new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN!,
}) : null;

app.use(express.json());

const analyzeSchema = z.object({
  userId: z.string().uuid(),
  leftHandImage: z.string().url().optional(),
  rightHandImage: z.string().url().optional(),
});

/**
 * Utility to fetch and convert image for Gemini
 */
async function fileToGenerativePart(url: string): Promise<Part> {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType: response.headers.get('content-type') || 'image/jpeg',
    },
  };
}

const PALMISTRY_PROMPT = `
You are an expert palmist with 30 years of experience in Chiromancy. 
Analyze the provided palm images (left for potential, right for current path).
Be specific, empathetic, and insightful.

Return ONLY a raw JSON object matching this structure EXACTLY:
{
  "handShape": "earth" | "air" | "fire" | "water",
  "majorLines": {
    "lifeLine": "short description of vitality and path",
    "heartLine": "insight into emotional nature",
    "headLine": "analysis of mental focus and logic",
    "fateLine": "career trajectory or null if not visible"
  },
  "mounts": {
    "jupiter": "N" | "H" | "L",
    "saturn": "N" | "H" | "L",
    "apollo": "N" | "H" | "L",
    "mercury": "N" | "H" | "L",
    "venus": "N" | "H" | "L",
    "mars": "N" | "H" | "L",
    "luna": "N" | "H" | "L"
  },
  "personality": {
    "traits": ["string"],
    "strengths": ["string"],
    "weaknesses": ["string"]
  },
  "career": {
    "suitability": "main industry",
    "potentialPaths": ["string"],
    "advice": "specific career tip"
  },
  "relationships": {
    "compatibility": "string",
    "approach": "string",
    "advice": "relationship tip"
  },
  "health": {
    "vitality": "string",
    "concerns": "string or null",
    "advice": "lifestyle tip"
  },
  "advice": "one major takeaway for their life journey"
}

Notes for Analysis:
- Jupiter: Ambition, leadership.
- Saturn: Responsibility, wisdom.
- Apollo: Creativity, success.
- Venus: Love, vitality.
- Mercury: Communication, business.
- Codes for mounts: N (Normal), H (High/Prominent), L (Low/Flat).
`;

/**
 * Perform AI analysis
 */
app.post('/analyze', async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  try {
    const validation = analyzeSchema.safeParse(req.body);
    if (!validation.success) {
      throw new AppError(ErrorCode.BAD_REQUEST, 'Validation failed', validation.error.format());
    }

    const { userId, leftHandImage, rightHandImage } = validation.data;

    if (!leftHandImage && !rightHandImage) {
      throw new AppError(ErrorCode.BAD_REQUEST, 'At least one hand image is required');
    }

    const cacheKey = `analysis:${userId}:${leftHandImage || 'na'}:${rightHandImage || 'na'}`;

    // 1. Check Cache
    if (redis) {
      const cached = await redis.get<PalmAnalysisResult>(cacheKey);
      if (cached) {
        logger.info({ userId, cache: 'HIT' }, 'Returning cached analysis');
        res.status(200).json({ success: true, data: cached });
        return;
      }
    }

    if (!genAI) {
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'Gemini API not configured');
    }

    logger.info({ userId, cache: 'MISS' }, 'Starting Gemini analysis');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imageParts: Part[] = [];

    if (leftHandImage) imageParts.push(await fileToGenerativePart(leftHandImage));
    if (rightHandImage) imageParts.push(await fileToGenerativePart(rightHandImage));

    const result = await model.generateContent([PALMISTRY_PROMPT, ...imageParts]);
    const text = result.response.text();
    
    // Improved JSON parsing (handling markdown blocks)
    let analysisResult: PalmAnalysisResult;
    try {
      const cleanJson = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      analysisResult = JSON.parse(cleanJson);
      
      // 1. Cache the result for 7 days
      if (redis) {
        await redis.set(cacheKey, JSON.stringify(analysisResult), { ex: 604800 });
      }

      // 2. Persist to Supabase for History
      try {
        const { error: dbError } = await supabase.from('palm_readings').insert({
          user_id: userId,
          image_url: leftHandImage || rightHandImage, // Primary image
          analysis_result: analysisResult,
          hand_shape: analysisResult.handShape
        });

        if (dbError) logger.error({ dbError }, 'Failed to persist reading to Supabase');
        else logger.info({ userId }, 'Reading persisted to history');

      } catch (dbEx) {
        logger.error({ dbEx }, 'Database exception during persistence');
      }

    } catch (e) {
      logger.error({ text, error: e }, 'Gemini result parse failed');
      throw new AppError(ErrorCode.INTERNAL_ERROR, 'AI produced unreadable data');
    }

    res.status(200).json({ success: true, data: analysisResult });

  } catch (error: unknown) {
    logError('AI analysis failed', { service: 'ai-service', error });
    _next(error);
  }
});

// Error Handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  const status = err instanceof AppError ? 400 : 500;
  const message = err instanceof AppError ? err.message : 'AI service failure';
  const code = err instanceof AppError ? err.code : ErrorCode.INTERNAL_ERROR;
  
  res.status(status).json(createErrorResponse(code, message));
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'AI Service optimized for Vision processing');
});
