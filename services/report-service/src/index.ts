/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Report Service entry point - PDF generation and sharing.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { jsPDF } from 'jspdf';
import { PalmReading } from '@palmistry/types';
import { ErrorCode, createErrorResponse, logger, logError } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';

// Validate Env at startup
const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.REPORT_SERVICE_PORT || env.PORT || 3006;

app.use(express.json());

/**
 * Generate PDF report for a palm reading.
 */
app.post('/generate-pdf', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reading: PalmReading = req.body;
    
    // Minimal PDF generation logic for boilerplate
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('PALMSTRY Analysis Report', 20, 20);
    doc.setFontSize(14);
    doc.text(`Reading ID: ${reading.id}`, 20, 40);
    doc.text(`Hand Shape: ${reading.analysisResult.handShape}`, 20, 50);
    
    const pdfOutput = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfOutput));
  } catch (error: unknown) {
    next(error);
  }
});

// Generic Error Handler
app.use((err: unknown, req: Request, res: Response): void => {
  console.error('[REPORT-SERVICE ERROR]', err);
  res.status(500).json(createErrorResponse(ErrorCode.INTERNAL_ERROR, 'Internal report-service error.'));
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'Report Service started');
});
