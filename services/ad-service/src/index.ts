/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Ad Service - manages ad display logic and tracking.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { logger } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';

// Validate Env at startup
const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.PORT || 3004;

app.use(express.json());

/**
 * Get relevant ad based on user context.
 */
app.get('/ads', (req: Request, res: Response): void => {
  const ads = [
    { id: '1', title: 'Premium Palmistry PDF', link: '/premium' },
    { id: '2', title: 'Unlock Ancestors Reading', link: '/ancestors' },
  ];
  res.json({ success: true, data: ads });
});

/**
 * Health Check.
 */
app.get('/health', (req: Request, res: Response): void => {
  res.json({ status: 'OK', service: 'ad-service' });
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'Ad Service started');
});
