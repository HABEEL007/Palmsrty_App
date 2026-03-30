/**
 * @file PalmImageUploader.tsx
 */

import React, { useState } from "react";
import { Camera, Upload, CheckCircle, Smartphone } from "lucide-react";
import { Button } from "../primitives/Button";
import "./PalmImageUploader.css";

export interface PalmImageUploaderProps {
  side: "left" | "right";
  onImageCaptured: (file: File) => void;
}

/**
 * Advanced palm image uploader with drag & drop and camera simulation.
 */
export const PalmImageUploader: React.FC<PalmImageUploaderProps> = ({
  side,
  onImageCaptured,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageCaptured(file);
    }
  };

  return (
    <div
      className={`palm-uploader glass ${isHovered ? "palm-uploader--hover" : ""}`}
      onDragOver={() => setIsHovered(true)}
      onDragLeave={() => setIsHovered(false)}
    >
      {preview ? (
        <div className="palm-uploader__preview">
          <img src={preview} alt={`${side} hand`} />
          <div className="palm-uploader__overlay">
            <CheckCircle className="palm-uploader__check" />
            <span>Image Captured</span>
            <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>
              Retake
            </Button>
          </div>
        </div>
      ) : (
        <div className="palm-uploader__content">
          <div className="palm-uploader__icons">
            <div className="palm-uploader__icon-bg">
              {side === "left" ? (
                <Smartphone className="palm-icon" />
              ) : (
                <Camera className="palm-icon" />
              )}
            </div>
            <Upload className="palm-uploader__upload-icon" />
          </div>
          <h3>Scan Your {side.charAt(0).toUpperCase() + side.slice(1)} Hand</h3>
          <p>Place your hand flat in good lighting for clear results.</p>

          <div className="palm-uploader__actions">
            <Button
              variant="primary"
              onClick={() =>
                document.getElementById(`palm-input-${side}`)?.click()
              }
            >
              Upload Photo
            </Button>
            <input
              id={`palm-input-${side}`}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      )}

      {/* Visual Guide Overlay (Simplified) */}
      {!preview && (
        <div className="palm-uploader__guide">
          <div className="palm-guide-lines" />
        </div>
      )}
    </div>
  );
};
