/**
 * @file result.ts
 * @description Standardized Result pattern for error handling.
 */

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export const ok = <T, E>(data: T): Result<T, E> => ({
  success: true,
  data,
});

export const err = <T, E>(error: E): Result<T, E> => ({
  success: false,
  error,
});

/**
 * Handle Result synchronously and return data or default.
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  return result.success ? result.data : defaultValue;
};
