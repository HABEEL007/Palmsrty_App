/**
 * @file validationUtils.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Input validation utilities.
 */

/**
 * Validates an email address using a strict regex.
 * @param email - The email to validate.
 * @returns True if valid.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates a UUID v4 string.
 * @param uuid - The UUID to check.
 * @returns True if valid.
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
