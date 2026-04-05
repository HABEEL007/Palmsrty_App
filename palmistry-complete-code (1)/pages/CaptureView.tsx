/**
 * @file CaptureView.tsx
 * @description Palm capture screen with quality checks
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useReadingStore } from '../store/reading-store';

interface QualityCheck { hand: boolean; light: boolean; focus: boolean; }

export const CaptureView: React.FC = () => {
  const navigate = useNavigate();
  const { setImageData } = useReadingStore();
  const [checks, setChecks] = useState<QualityCheck>({ hand: false, light: false, focus: false });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const allClear = checks.hand && checks.light && checks.focus;

  // Simulate progressive quality checks
  useEffect(() => {
    const t1 = setTimeout(() => setChecks(c => ({ ...c, hand: true })), 1200);
    const t2 = setTimeout(() => setChecks(c => ({ ...c, light: true })), 2200);
    const t3 = setTimeout(() => setChecks(c => ({ ...c, focus: true })), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const handleCapture = () => {
    if (!allClear) return;
    navigate('/processing');
  };

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
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col px-5 py-6 relative overflow-hidden"
      style={{ maxWidth: 480, margin: '0 auto' }}>

      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%)' }} />

      {/* Back */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm text-gray-500 mb-6 relative z-10 w-fit"
      >
        ← Back
      </motion.button>

      {/* Header */}
      <div className="text-center mb-5 relative z-10">
        <h2 className="text-xl font-bold text-slate-200 mb-1">Scan Your Palm</h2>
        <p className="text-sm text-gray-500">Place your hand flat, fingers slightly apart</p>
      </div>

      {/* Camera frame */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-3xl mb-5 overflow-hidden flex items-center justify-center relative z-10"
        style={{
          height: 260,
          background: '#060A12',
          border: `1.5px solid ${allClear ? 'rgba(6,182,212,0.5)' : 'rgba(124,58,237,0.35)'}`,
          transition: 'border-color 0.5s',
        }}
      >
        {/* Corners */}
        {(['tl','tr','bl','br'] as const).map(pos => (
          <div key={pos} style={{
            position: 'absolute', width: 22, height: 22,
            top: pos.startsWith('t') ? 14 : undefined,
            bottom: pos.startsWith('b') ? 14 : undefined,
            left: pos.endsWith('l') ? 14 : undefined,
            right: pos.endsWith('r') ? 14 : undefined,
            borderColor: allClear ? '#06B6D4' : '#7C3AED',
            borderStyle: 'solid', borderWidth: 0,
            borderTopWidth: pos.startsWith('t') ? 2 : 0,
            borderBottomWidth: pos.startsWith('b') ? 2 : 0,
            borderLeftWidth: pos.endsWith('l') ? 2 : 0,
            borderRightWidth: pos.endsWith('r') ? 2 : 0,
            borderRadius: pos==='tl'?'4px 0 0 0':pos==='tr'?'0 4px 0 0':pos==='bl'?'0 0 0 4px':'0 0 4px 0',
            transition: 'border-color 0.5s',
          }}/>
        ))}

        {/* Scan line */}
        <motion.div
          animate={{ top: ['25%','72%','25%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          style={{ position: 'absolute', left: '8%', right: '8%', height: 2,
            background: 'linear-gradient(90deg,transparent,#7C3AED,#06B6D4,transparent)', opacity: 0.7 }}
        />

        {/* Hand guide */}
        <svg width="110" height="120" viewBox="0 0 110 120" fill="none" opacity={0.3}>
          <path d="M55 110 C35 110 22 95 22 78 L22 32 C22 27 26 23 31 23 C36 23 40 27 40 32 L40 58 C40 54 44 51 49 51 C54 51 57 54 57 58 L57 54 C57 49 61 46 66 46 C71 46 74 49 74 54 L74 58 C74 54 78 51 83 53 C88 55 88 61 88 64 L88 78 C88 95 75 110 55 110Z"
            stroke="#7C3AED" strokeWidth="1.5" fill="rgba(124,58,237,0.08)"/>
        </svg>
      </motion.div>

      {/* Quality checks */}
      <div className="flex flex-col gap-3 mb-6 relative z-10">
        {CHECK_ITEMS.map((item, i) => (
          <motion.div key={item.key}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-400"
              style={{
                background: checks[item.key] ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${checks[item.key] ? 'rgba(6,182,212,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}>
              {checks[item.key] ? (
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M2 5l2.5 2.5L8 3" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
              ) : (
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-gray-600" />
              )}
            </div>
            <span className="text-sm transition-colors duration-400"
              style={{ color: checks[item.key] ? '#06B6D4' : '#4B5563' }}>
              {checks[item.key] ? item.label : `Checking ${item.label.toLowerCase()}...`}
            </span>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="relative z-10">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleCapture}
          disabled={!allClear}
          className="w-full py-4 rounded-2xl text-sm font-semibold text-white mb-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: allClear ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : 'rgba(124,58,237,0.3)',
            boxShadow: allClear ? '0 4px 24px rgba(124,58,237,0.4)' : 'none',
          }}
        >
          {allClear ? 'Capture Reading ✦' : 'Preparing...'}
        </motion.button>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden"/>
        <button onClick={() => fileInputRef.current?.click()}
          className="w-full text-sm text-center text-gray-600 hover:text-gray-400 transition-colors py-2">
          or upload from gallery
        </button>
      </div>
    </div>
  );
};
