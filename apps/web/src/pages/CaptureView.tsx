/**
 * @file CaptureView.tsx
 */

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PalmImageUploader, Button } from '@palmistry/ui';
import { Camera, RefreshCcw } from 'lucide-react';

export const CaptureView: React.FC = () => {
  const navigate = useNavigate();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('low');

  useEffect(() => {
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (e) {
        console.error("Camera access denied", e);
      }
    }
    setupCamera();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, []);

  const handleCapture = () => {
    // Simulation: capture image and go to processing
    navigate('/processing');
  };

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center">
      <div className="relative w-full h-full max-w-md bg-black">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* SVG Guide Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-12 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
            <path 
              d="M30 90 Q 50 10, 70 90" 
              stroke="var(--color-primary)" 
              strokeWidth="1" 
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
          <div className="text-xs text-muted flex flex-col items-end">
            <span>✓ Hand detected</span>
            <span>⟳ Align frame</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-6 px-6">
          <div className="flex items-center gap-4">
             <button 
               onClick={handleCapture}
               className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent active:scale-95 transition-transform"
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
