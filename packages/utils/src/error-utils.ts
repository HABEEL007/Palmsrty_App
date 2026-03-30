/**
 * @file errorUtils.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Standardized error handling utilities.
 */

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

/**
 * Custom application error class.
 */
export class AppError extends Error {
  public constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly details: unknown = null,
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Factory to create standardized error responses.
 */
export const createErrorResponse = (code: ErrorCode, message: string, details: unknown = null) => {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
};
