import { describe, it, expect } from "vitest";
import {
  isValidImageType,
  normalizeFilename,
  getFileExtension,
  isValidFileSize,
} from "./image-utils";

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

  describe("isValidFileSize", () => {
    it("returns true if size is within limits", () => {
      const fiveMB = 5 * 1024 * 1024;
      expect(isValidFileSize(fiveMB)).toBe(true);
      expect(isValidFileSize(fiveMB, 10)).toBe(true);
    });

    it("returns false if size exceeds limits", () => {
      const fifteenMB = 15 * 1024 * 1024;
      expect(isValidFileSize(fifteenMB)).toBe(false);
      expect(isValidFileSize(fifteenMB, 20)).toBe(true);
    });
  });

  describe("getFileExtension", () => {
    it("extracts extension correctly", () => {
      expect(getFileExtension("photo.jpg")).toBe("jpg");
      expect(getFileExtension("IMAGE.PNG")).toBe("png");
      expect(getFileExtension("no-extension")).toBe("");
      expect(getFileExtension("double.extension.webp")).toBe("webp");
    });
  });

  describe("normalizeFilename", () => {
    it("converts to lowercase and replaces spaces", () => {
      expect(normalizeFilename("My Photo.jpg")).toBe("my_photo.jpg");
      expect(normalizeFilename("SPACE  IMAGE.PNG")).toBe("space_image.png");
    });

    it("removes special characters but keeps extension", () => {
      expect(normalizeFilename("my!@#photo.jpg")).toBe("myphoto.jpg");
      expect(normalizeFilename("hello world!! 2024.png")).toBe(
        "hello_world_2024.png"
      );
    });

    it("handles files without extension", () => {
      expect(normalizeFilename("FILENAME")).toBe("filename");
    });
  });
});
