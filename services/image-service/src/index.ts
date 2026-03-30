/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Image Service - handles palm photo processing and storage via Cloudinary.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { logger, logError, ErrorCode, AppError, createErrorResponse } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';

/**
 * Load Environment
 */
const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.IMAGE_SERVICE_PORT || env.PORT || 3003;

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: env.CLOUDINARY_URL,
});

app.use(express.json());

/**
 * Upload Palm Image (to Cloudinary)
 */
app.post('/upload', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { image, userId } = req.body; // base64 or URL

    if (!image) throw new AppError(ErrorCode.BAD_REQUEST, 'Image data is required');

    logger.info({ userId }, 'Uploading image to Cloudinary');

    const result = await cloudinary.uploader.upload(image, {
      folder: 'palmistry/uploads',
      tags: ['temporary_upload', userId],
      resource_type: 'image',
    });

    res.json({ 
      success: true, 
      data: {
        publicId: result.public_id,
        imageUrl: result.secure_url,
        format: result.format,
        createdAt: result.created_at
      }
    });

  } catch (error: unknown) {
    logError('Image upload failed', { service: 'image-service', function: 'upload', error });
    next(error);
  }
});

app.get('/health', (req: Request, res: Response): void => {
  res.json({ status: 'OK', service: 'image-service' });
});

// Error Handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof AppError) {
    res.status(400).json(createErrorResponse(err.code, err.message));
    return;
  }
  res.status(500).json(createErrorResponse(ErrorCode.INTERNAL_ERROR, 'Image service failure'));
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'Image Service started with Cloudinary');
});
