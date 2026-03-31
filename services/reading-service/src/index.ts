/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Reading Service - manages palm reading history and metadata.
 */

import express, { Express, Request, Response } from 'express';
import { logger, supabase, ErrorCode, createErrorResponse } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';

// Validate Env at startup
const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.READING_SERVICE_PORT || env.PORT || 3005;

app.use(express.json());

app.get('/readings/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('palm_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error({ error }, 'Failed to fetch readings from Supabase');
      res.status(500).json(createErrorResponse(ErrorCode.INTERNAL_ERROR, 'Database fetch failed'));
      return;
    }

    res.json({ success: true, data });
  } catch (error) {
    logger.error({ error }, 'Reading service exception');
    res.status(500).json(createErrorResponse(ErrorCode.INTERNAL_ERROR, 'Service exception'));
  }
});

app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'OK', service: 'reading-service' });
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'Reading Service started');
});
