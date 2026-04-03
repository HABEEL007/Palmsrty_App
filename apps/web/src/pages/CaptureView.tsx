/**
 * @file CaptureView.tsx
 */

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@palmistry/ui';
import { Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../features/auth/hooks/useAuth';

export const CaptureView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('low');
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          } 
        });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
        setQuality('high');
      } catch (e) {
        console.error("Camera access denied", e);
      }
    }
    setupCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return;

    setIsCapturing(true);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      try {
        // 1. Upload to Image Service
        const response = await apiClient.post('/api/image/upload', {
          image: imageData,
          userId: user?.id || '00000000-0000-0000-0000-000000000000'
        });

        if (response.data.success) {
          const { imageUrl } = response.data.data;
          // 2. Navigate to processing with the image URL
          navigate('/processing', { state: { imageUrl } });
        }
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center">
      <div className="relative w-full h-full max-w-md bg-black">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover opacity-80"
        />
        
        {/* Hidden Canvas for Capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* SVG Guide Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-40">
            <path 
              d="M30 90 Q 50 10, 70 90" 
              stroke="var(--color-primary)" 
              strokeWidth="0.5" 
              fill="transparent" 
              strokeDasharray="4 2"
            />
          </svg>
        </div>

        {/* Quality Indicator */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${quality === 'high' ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-yellow-500'}`} />
            <span className="text-sm font-medium tracking-wide">
              {quality === 'high' ? 'IDEAL LIGHTING' : 'IMPROVING LIGHTING...'}
            </span>
          </div>
          {isCapturing && <Loader2 className="animate-spin text-primary w-5 h-5" />}
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-6 px-6">
          <div className="flex items-center gap-4">
             <button 
               onClick={handleCapture}
               disabled={isCapturing}
               className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:scale-95 transition-transform disabled:opacity-50"
             >
               <div className="w-16 h-16 rounded-full bg-white scale-90" />
             </button>
          </div>
          
          <Button variant="ghost" className="w-full text-white/60">
             Upload from photo library
          </Button>
        </div>
      </div>
    </div>
  );
};
