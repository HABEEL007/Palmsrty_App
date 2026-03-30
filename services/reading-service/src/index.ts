/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Reading Service - manages palm reading history and metadata.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { logger } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';

// Validate Env at startup
const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.READING_SERVICE_PORT || env.PORT || 3005;

app.use(express.json());

app.get('/readings/:userId', (req: Request, res: Response): void => {
  res.json({ success: true, data: [] });
});

app.get('/health', (req: Request, res: Response): void => {
  res.json({ status: 'OK', service: 'reading-service' });
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'Reading Service started');
});
