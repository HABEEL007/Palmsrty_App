import { describe, it, expect, vi } from 'vitest';
import { generateReadingId, validateImageUrl } from './imageUtils';

describe('imageUtils', () => {
  describe('generateReadingId', () => {
    it('returns a string of length 36 (UUID v4)', () => {
      // Arrange
      // Act
      const id = generateReadingId();
      // Assert
      expect(id).toHaveLength(36);
      expect(typeof id).toBe('string');
    });

    it('returns unique IDs on consecutive calls', () => {
      const id1 = generateReadingId();
      const id2 = generateReadingId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('validateImageUrl', () => {
    it('returns true for valid https data URLs', () => {
      // Arrange
      const validUrl = 'https://palmistry.ai/images/test.jpg';
      // Act & Assert
      expect(validateImageUrl(validUrl)).toBe(true);
    });

    it('returns false for non-https URLs', () => {
      const invalidUrl = 'http://unsecure.com/palm.png';
      expect(validateImageUrl(invalidUrl)).toBe(false);
    });

    it('returns false for malformed strings', () => {
      expect(validateImageUrl('not-a-url')).toBe(false);
    });
  });
});
