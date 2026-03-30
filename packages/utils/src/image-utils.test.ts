import { describe, it, expect } from "vitest";
import { isValidImageType, normalizeFilename } from "./image-utils";

describe("image-utils", () => {
  describe("isValidImageType", () => {
    it("returns true for supported types", () => {
      expect(isValidImageType("image/jpeg")).toBe(true);
      expect(isValidImageType("image/png")).toBe(true);
      expect(isValidImageType("image/webp")).toBe(true);
    });

    it("returns false for unsupported types", () => {
      expect(isValidImageType("application/pdf")).toBe(false);
      expect(isValidImageType("text/plain")).toBe(false);
    });
  });

  describe("normalizeFilename", () => {
    it("converts to lowercase and replaces spaces", () => {
      expect(normalizeFilename("My Photo.jpg")).toBe("my_photo.jpg");
      expect(normalizeFilename("SPACE  IMAGE.PNG")).toBe("space_image.png");
    });
  });
});
