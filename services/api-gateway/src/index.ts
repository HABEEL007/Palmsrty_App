/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description API Gateway entry point - routing, auth, and rate limiting.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ErrorCode, createErrorResponse, logger } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';
import { v4 as uuidv4 } from 'uuid';

/**
 * Load Environment
 */
const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.GATEWAY_PORT || env.PORT || 3001;

// Request ID Middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  const requestId = (req.headers as any)['x-request-id'] || uuidv4();
  (req.headers as any)['x-request-id'] = requestId;
  (req as any).requestId = requestId;
  next();
});

// Structured Logging Middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info({ 
    method: req.method, 
    url: req.url, 
    requestId: (req as any).requestId 
  }, 'Incoming Request');
  next();
});

// Security Middleware
app.use(helmet());
app.use(cors()); 

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: createErrorResponse(ErrorCode.BAD_REQUEST, 'Too many requests, please try again later.'),
});
app.use('/api/', limiter);

/**
 * Health & Keep-Alive endpoints
 */
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'healthy',
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
});

/**
 * @route GET /keep-alive
 * @description Used by external cron to prevent Render.com spin-down.
 */
app.get('/keep-alive', (req: Request, res: Response): void => {
  logger.info({ requestId: (req as any).requestId }, 'Keep-Alive heartbeat received');
  res.status(200).send('STAYIN_ALIVE');
});

/**
 * Service Proxies (Render Internal URLs)
 */
const IMAGE_SERVICE_URL = (env as any)['IMAGE_SERVICE_URL'] || 'http://palmistry-image-service:10000';
const AI_SERVICE_URL = (env as any)['AI_SERVICE_URL'] || 'http://palmistry-ai-service:10000';

app.use('/api/image', createProxyMiddleware({ target: IMAGE_SERVICE_URL, changeOrigin: true }));
app.use('/api/ai', createProxyMiddleware({ target: AI_SERVICE_URL, changeOrigin: true }));

// Global Error Handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('[API-GATEWAY ERROR]', err);
  res.status(500).json(createErrorResponse(ErrorCode.INTERNAL_ERROR, 'An unexpected error occurred in the gateway.'));
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'API Gateway started');
});
