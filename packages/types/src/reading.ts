/**
 * @file reading.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Strict TypeScript interfaces for Palm Reading entities.
 */

import { PalmAnalysisResult } from './analysis';

/**
 * AI Models used for processing.
 */
export enum AIModel {
  GPT_4O = 'gpt-4o',
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet',
  PALM_VISION_V1 = 'palm-vision-v1',
}

/**
 * Palm reading entry.
 */
export interface PalmReading {
  /** UUID v4 identifier */
  id: string;
  /** Reference to the user who owns this reading */
  userId: string;
  /** Storage URL for the right hand image */
  rightHandImageUrl: string | null;
  /** Storage URL for the left hand image */
  leftHandImageUrl: string | null;
  /** The detailed AI analysis result */
  analysisResult: PalmAnalysisResult;
  /** AI model used for this specific reading */
  modelUsed: AIModel;
  /** AI processing time in milliseconds */
  processingTimeMs: number;
  /** Reading creation date */
  createdAt: Date;
}
