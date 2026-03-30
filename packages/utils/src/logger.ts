/**
 * @file logger.ts
 * @description Centralized Pino logger with engineering standards.
 */

import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: process.env.SERVICE_NAME || 'unknown',
  },
  // Use pino-pretty for development
  transport: !isProduction 
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'service,hostname',
        },
      }
    : undefined,
});

/**
 * Log structured error with context.
 */
export const logError = (msg: string, context: { service: string; function: string; userId?: string; error: unknown }) => {
  logger.error({ ...context }, msg);
};
