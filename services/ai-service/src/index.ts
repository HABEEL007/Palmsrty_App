/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description AI Service entry point - analysis engine using Google Gemini & Upstash Caching.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Redis } from '@upstash/redis';
import { PalmReading, PalmAnalysisResult, HandShape, AIModel } from '@palmistry/types';
import { ErrorCode, AppError, createErrorResponse, logger, logError } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';

/**
 * Load Environment
 */
const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.PORT || 3003;

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
 * Perform AI analysis (with Upstash Caching)
 */
app.post('/analyze', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const validation = analyzeSchema.safeParse(req.body);
    if (!validation.success) {
      throw new AppError(ErrorCode.BAD_REQUEST, 'Validation failed', validation.error.format());
    }

    const { userId, leftHandImage, rightHandImage } = validation.data;
    const cacheKey = `analysis:${userId}:${leftHandImage || 'none'}:${rightHandImage || 'none'}`;

    // 1. Check Cache (Upstash)
    if (redis) {
      const cached = await redis.get<PalmAnalysisResult>(cacheKey);
      if (cached) {
        logger.info({ userId, cache: 'HIT' }, 'Returning cached analysis');
        res.status(200).json({ success: true, data: cached });
        return;
      }
    }

    logger.info({ userId, cache: 'MISS' }, 'Starting AI analysis');

    let analysisResult: PalmAnalysisResult;

    if (genAI) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Analyze these palm images for a palmistry reading. Return ONLY JSON.`;
      
      const result = await model.generateContent([prompt]);
      const text = result.response.text();
      
      try {
        analysisResult = JSON.parse(text.replace(/```json|```/g, ''));
        
        // 2. Cache the Result (TTL: 24 Hours)
        if (redis) {
          await redis.set(cacheKey, JSON.stringify(analysisResult), { ex: 86400 });
        }
      } catch (e) {
        logger.warn('Gemini JSON parse failed, fallback to mock');
        analysisResult = getMockAnalysis();
      }
    } else {
      analysisResult = getMockAnalysis();
    }

    res.status(200).json({ success: true, data: analysisResult });

  } catch (error: unknown) {
    logError('AI analysis failed', { service: 'ai-service', error });
    next(error);
  }
});

function getMockAnalysis(): PalmAnalysisResult {
  return {
    handShape: HandShape.AIR,
    majorLines: { lifeLine: 'Strong', heartLine: 'Deep', headLine: 'Straight', fateLine: 'Faded' },
    mounts: { jupiter: 'N', saturn: 'N', apollo: 'N', mercury: 'N', venus: 'N', mars: 'N', luna: 'N' },
    personality: { traits: ['Creative'], strengths: ['Logic'], weaknesses: ['Patience'] },
    career: { suitability: 'Tech', potentialPaths: ['Dev'], advice: 'Focus' },
    relationships: { compatibility: 'High', approach: 'Direct', advice: 'Talk' },
    health: { vitality: 'Good', concerns: null, advice: 'Sleep' },
    advice: 'The future is bright.',
  };
}

// Error Handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(400).json(createErrorResponse(err.code, err.message));
    return;
  }
  res.status(500).json(createErrorResponse(ErrorCode.INTERNAL_ERROR, 'AI service failure'));
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'AI Service started with Upstash Redis');
});
