/**
 * @file logger.ts
 * @description Centralized Pino logger with engineering standards.
 */

import pino from "pino";

const isProduction = process.env["NODE_ENV"] === "production";
const serviceName = process.env["SERVICE_NAME"] || "api-gateway";
const logLevel = process.env["LOG_LEVEL"] || "info";

export const logger = pino({
  level: logLevel,
  formatters: {
    level: (label) => ({ level: label.toUpperCase() }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  base: {
    service: serviceName,
  },
  // Use pino-pretty for development
  transport: !isProduction
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "service,hostname",
        },
      }
    : undefined,
});

/**
 * Log structured error with context.
 */
export const logError = (
  msg: string,
  context: {
    service: string;
    function: string;
    userId?: string;
    error: unknown;
  },
): void => {
  logger.error({ ...context }, msg);
};
