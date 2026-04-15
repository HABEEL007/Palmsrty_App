/**
 * @file CaptureView.tsx
 * @description Palm capture screen with real camera and quality checks
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useReadingStore } from '../store/reading-store';

interface QualityCheck { 
  hand: boolean; 
  light: boolean; 
  focus: boolean; 
}

export const CaptureView: React.FC = () => {
  const navigate = useNavigate();
  const { setImageData } = useReadingStore();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [checks, setChecks] = useState<QualityCheck>({ hand: false, light: false, focus: false });
  const [error, setError] = useState<string | null>(null);

  const allClear = checks.hand && checks.light && checks.focus;

  /** 🎥 Initialize Camera */
  useEffect(() => {
    const startCamera = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          } 
        });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        console.error('CAMERA_ERROR:', err);
        setError('Could not access camera. Please check permissions or upload from gallery.');
      }
    };
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  /** 🔍 Simulate AI-powered quality checks */
  useEffect(() => {
    const t1 = setTimeout(() => setChecks(c => ({ ...c, hand: true })), 1500);
    const t2 = setTimeout(() => setChecks(c => ({ ...c, light: true })), 2800);
    const t3 = setTimeout(() => setChecks(c => ({ ...c, focus: true })), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  /** 📸 Take Snapshot */
  const handleCapture = () => {
    if (!allClear || !videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setImageData(dataUrl);
    navigate('/processing');
  };

  /** 📁 Handle Gallery Upload */
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result as string);
      navigate('/processing');
    };
    reader.readAsDataURL(file);
  };

  const CHECK_ITEMS = [
    { key: 'hand' as const, label: 'Hand detected' },
    { key: 'light' as const, label: 'Good lighting' },
    { key: 'focus' as const, label: 'Clear focus' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col px-6 py-8 relative overflow-hidden">
      
      {/* Decorative Aura */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <motion.button 
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500 mb-8 relative z-10 w-fit"
      >
        ← Back to Portal
      </motion.button>

      {/* Header */}
      <div className="text-center mb-10 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">Scan Your Palm</h2>
        <p className="text-sm text-gray-400">Alignment: Place your hand within the frame</p>
      </div>

      {/* Camera Viewport */}
      <div className="relative w-full max-w-sm mx-auto mb-10 group overflow-hidden rounded-[48px] shadow-2xl z-10 aspect-[3/4] bg-black border-4 border-white/5">
        
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-red-500/5">
             <span className="text-3xl mb-4">⚠️</span>
             <p className="text-sm text-red-400 leading-relaxed font-medium">{error}</p>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover grayscale-[0.2] contrast-125"
          />
        )}

        {/* Scan Animation Overlay */}
        <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none overflow-hidden">
           <motion.div 
             animate={{ top: ['0%', '100%', '0%'] }}
             transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
             className="absolute left-0 right-0 h-1 bg-purple-500 shadow-[0_0_30px_rgba(168,85,247,1)] z-20"
           />
        </div>

        {/* Guides */}
        <div className="absolute inset-10 border-2 border-white/10 rounded-[32px] pointer-events-none border-dashed animate-pulse" />
      </div>

      {/* Quality Check Badges */}
      <div className="flex flex-col gap-4 max-w-sm mx-auto w-full mb-10 z-10">
        {CHECK_ITEMS.map((item, i) => (
          <motion.div 
            key={item.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-4 px-4 py-3 rounded-2xl border border-white/5 bg-white/[0.02]"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${checks[item.key] ? 'bg-purple-500 shadow-[0_0_10px_purple]' : 'bg-white/5'}`}>
               {checks[item.key] && <span className="text-white text-[10px]">✓</span>}
            </div>
            <span className={`text-sm font-medium transition-colors ${checks[item.key] ? 'text-white' : 'text-gray-600'}`}>
               {checks[item.key] ? item.label : `Optimizing ${item.label.toLowerCase()}...`}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Action Area */}
      <div className="max-w-sm mx-auto w-full relative z-10">
        <motion.button
          disabled={!allClear || !!error}
          whileTap={{ scale: 0.95 }}
          onClick={handleCapture}
          className="w-full py-5 rounded-[28px] text-base font-bold text-white mb-4 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl"
          style={{
            background: allClear ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'rgba(255,255,255,0.05)',
          }}
        >
          {allClear ? 'CONTINUE ANALYSIS' : 'WAIT FOR CALIBRATION...'}
        </motion.button>

        <input 
          ref={fileInputRef} 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          className="hidden"
        />
        
        <button 
          onClick={() => {
            setImageData('https://images.unsplash.com/photo-1539627831859-a911cf04d3cd?q=80&w=1000&auto=format&fit=crop'); 
            navigate('/processing');
          }}
          className="w-full text-xs font-bold text-purple-500 hover:text-purple-400 uppercase tracking-widest transition-colors py-2 border border-purple-500/20 rounded-xl mb-4"
        >
          Demo Scan (No camera needed)
        </button>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full text-xs font-bold text-gray-500 hover:text-purple-400 uppercase tracking-widest transition-colors py-2"
        >
          Manual Upload
        </button>
      </div>
    </div>
  );
};
