/**
 * @file dateUtils.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Date formatting and manipulation utilities.
 */

/**
 * Formats a date into an ISO string without milliseconds.
 * @param date - The date to format.
 * @returns Formatted date string.
 */
export const formatISOSimple = (date: Date): string => {
  return date.toISOString().split('.')[0] + 'Z';
};

/**
 * Calculates time difference in milliseconds.
 * @param start - Start date.
 * @param end - End date.
 * @returns Milliseconds difference.
 */
export const getProcessingTime = (start: Date, end: Date): number => {
  return end.getTime() - start.getTime();
};
