/**
 * @file index.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Report Service entry point - PDF generation and sharing.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import { jsPDF } from 'jspdf';
import { PalmReading } from '@palmistry/types';
import { ErrorCode, createErrorResponse, logger } from '@palmistry/utils';
import { validateEnv } from '@palmistry/config/env';

// Validate Env at startup
const env = validateEnv(process.env);
const app: Express = express();
const PORT: number = env.REPORT_SERVICE_PORT || env.PORT || 3006;

app.use(express.json());

/**
 * Generate Professional PDF report for a palm reading.
 */
app.post('/generate', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reading } = req.body;
    
    if (!reading) {
      res.status(400).json(createErrorResponse(ErrorCode.BAD_REQUEST, 'Missing reading data.'));
      return;
    }

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const analysis = reading.analysis_result;

    // Background decoration or header
    doc.setFillColor(11, 15, 26); // Background color #0B0F1A
    doc.rect(0, 0, 210, 60, 'F');
    doc.setTextColor(124, 58, 237); // Primary color #7C3AED
    doc.setFontSize(32);
    doc.text('PALMSTRY', 20, 30);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Advanced AI Destiny Report', 20, 40);

    // Metadata
    doc.setTextColor(150, 150, 150);
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 160, 30);
    doc.text(`ID: ${reading.id.slice(0, 8)}...`, 160, 35);

    // Sections
    let y = 80;
    const sections = [
      { title: 'Hand Shape', content: reading.hand_shape || 'Earth Type' },
      { title: 'Personality', content: analysis.personality || 'Highly analytical and intuitive spirit.' },
      { title: 'Career', content: analysis.career || 'Potential for leadership in creative fields.' },
      { title: 'Relationships', content: analysis.relationships || 'Value deep connections and harmony.' },
      { title: 'Health', content: analysis.health || 'Vitality is strong; focus on mental rest.' },
      { title: 'Expert Advice', content: analysis.advice || 'Follow your instincts for upcoming transitions.' }
    ];

    sections.forEach((sec) => {
      doc.setTextColor(124, 58, 237);
      doc.setFontSize(14);
      doc.text(sec.title.toUpperCase(), 20, y);
      
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(sec.content, 170);
      doc.text(lines, 20, y + 8);
      y += 12 + (lines.length * 6);
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(200, 200, 200);
    doc.text('This analysis is based on AI algorithms and is for entertainment purposes only.', 105, 285, { align: 'center' });

    const pdfOutput = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Palmistry_Report_${reading.id.slice(0, 5)}.pdf`);
    res.send(Buffer.from(pdfOutput));
  } catch (error: unknown) {
    next(error);
  }
});

// Generic Error Handler
app.use((err: unknown, _req: Request, res: Response): void => {
  console.error('[REPORT-SERVICE ERROR]', err);
  res.status(500).json(createErrorResponse(ErrorCode.INTERNAL_ERROR, 'Internal report-service error.'));
});

app.listen(PORT, (): void => {
  logger.info({ port: PORT }, 'Report Service started');
});
