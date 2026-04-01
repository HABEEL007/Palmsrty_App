/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Ad Service - manages ad display logic and tracking.
 */

import express, { Express, Request, Response } from 'express';
import { logger } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';

// Validate Env at startup
const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.AD_SERVICE_PORT || env.PORT || 3007;

app.use(express.json());

/**
 * Get Meta Ads Placement Configuration
 */
app.get('/config', (_req: Request, res: Response): void => {
  const config = {
    meta_app_id: process.env['META_APP_ID'] || '123456789',
    placements: {
      banner: 'YOUR_BANNER_PLACEMENT_ID',
      interstitial: 'YOUR_INTERSTITIAL_PLACEMENT_ID',
      rewarded: 'YOUR_REWARDED_PLACEMENT_ID'
    },
    rules: {
      interstitial_frequency: 2, // Every 2 readings
      min_time_between_ads: 60000 // 60 seconds
    }
  };
  res.json({ success: true, data: config });
});

/**
 * Track Ad Activity (Impression/Click)
 */
app.post('/track', async (req: Request, res: Response): Promise<void> => {
  const { type, placement_id, userId } = req.body;
  
  logger.info({ type, placement_id, userId }, 'Ad activity tracked');
  
  // Here we would typically save to Supabase ad_stats table
  // For now we log it and return success
  res.json({ success: true, message: 'Tracked successfully' });
});

/**
 * Health Check.
 */
app.get('/health', (_req: Request, res: Response): void => {
  res.json({ status: 'OK', service: 'ad-service' });
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'Ad Service started');
});
