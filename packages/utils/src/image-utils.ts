/**
 * @file image-utils.ts
 * @description Image processing and validation utilities.
 */

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 10;

/**
 * Validates if the given file type is a supported image format.
 * @param mimeType - The MIME type to check.
 * @returns True if supported, false otherwise.
 */
export const isValidImageType = (mimeType: string): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(mimeType);
};

/**
 * Validates if the file size is within limits.
 * @param sizeInBytes - File size in bytes.
 * @param maxSizeMB - Optional max size in MB, defaults to 10.
 * @returns True if valid, false if too large.
 */
export const isValidFileSize = (
  sizeInBytes: number,
  maxSizeMB: number = MAX_FILE_SIZE_MB
): boolean => {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB <= maxSizeMB;
};

/**
 * Extracts the extension from a filename.
 * @param filename - Name of the file.
 * @returns The extension (e.g., "jpg") or an empty string.
 */
export const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
};

/**
 * Normalizes an image filename by:
 * - Converting to lowercase
 * - Trimming whitespace
 * - Replacing multiple spaces with a single underscore
 * - Removing non-alphanumeric characters (except dots and underscores)
 * @param filename - Original filename.
 * @returns Normalized filename.
 */
export const normalizeFilename = (filename: string): string => {
  const extension = getFileExtension(filename);
  const nameWithoutExtension = filename.substring(
    0,
    filename.lastIndexOf(".") === -1 ? filename.length : filename.lastIndexOf(".")
  );

  const cleanName = nameWithoutExtension
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_-]/g, "");

  return extension ? `${cleanName}.${extension.toLowerCase()}` : cleanName;
};
