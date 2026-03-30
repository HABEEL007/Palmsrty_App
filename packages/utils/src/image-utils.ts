/**
 * @file imageUtils.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Image processing and validation utilities.
 */

/**
 * Validates if the given file type is a supported image format.
 * @param mimeType - The MIME type to check.
 * @returns True if supported, false otherwise.
 * @example isValidImageType('image/jpeg') // returns true
 */
export const isValidImageType = (mimeType: string): boolean => {
  const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
  return supportedTypes.includes(mimeType);
};

/**
 * Normalizes an image filename by converting to lowercase and replacing spaces.
 * @param filename - Original filename.
 * @returns Normalized filename.
 */
export const normalizeFilename = (filename: string): string =>
  filename.toLowerCase().trim().replace(/\s+/g, "_");
