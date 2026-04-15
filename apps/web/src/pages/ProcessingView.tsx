/**
 * @file ProcessingView.tsx
 * @description Animated AI processing screen
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useReadingStore } from '../store/reading-store';
import { readingApi } from '../api/reading-api';
import { useAuth } from '../features/auth/hooks/useAuth';
import { supabase } from '../lib/supabase';

const MESSAGES = [
  'Scanning your palm lines...',
  'Reading life path indicators...',
  'Analyzing energy signatures...',
  'Decoding heart line patterns...',
  'Compiling your destiny map...',
];

const FACTS = [
  'The heart line reveals emotional intelligence. A deeply curved line indicates strong empathy.',
  'The fate line shows career destiny. A clear, deep line signals a purposeful life path.',
  'The life line does NOT predict lifespan — it shows vitality and life quality.',
  'The head line reflects thinking style. Straight = analytical; curved = creative.',
];

export const ProcessingView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { imageData, setReadingResult } = useReadingStore();
  const [msgIndex, setMsgIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgTimer = setInterval(() => setMsgIndex(i => (i + 1) % MESSAGES.length), 1600);
    const factTimer = setInterval(() => setFactIndex(i => (i + 1) % FACTS.length), 3000);
    const progressTimer = setInterval(() => {
      setProgress(p => { if (p >= 100) return 100; return p + 0.8; });
    }, 100);

    const mapToReadingResult = (analysis: any) => {
      return {
        handShape: analysis.handShape.charAt(0).toUpperCase() + analysis.handShape.slice(1) + ' Hand',
        sections: [
          {
            id: 'personality',
            label: 'Personality',
            color: '#7C3AED',
            fillColor: 'linear-gradient(90deg,#7C3AED,#06B6D4)',
            score: 85,
            text: analysis.personality.traits.join(', ') + '. ' + analysis.advice,
          },
          {
            id: 'career',
            label: 'Career',
            color: '#F59E0B',
            fillColor: 'linear-gradient(90deg,#F59E0B,#EF4444)',
            score: 75,
            text: analysis.career.suitability + ' ' + analysis.career.advice,
          },
          {
            id: 'love',
            label: 'Love & Relationships',
            color: '#EC4899',
            fillColor: 'linear-gradient(90deg,#EC4899,#7C3AED)',
            score: 90,
            text: analysis.relationships.compatibility + ' ' + analysis.relationships.advice,
          },
          {
            id: 'health',
            label: 'Health & Vitality',
            color: '#10B981',
            fillColor: 'linear-gradient(90deg,#10B981,#06B6D4)',
            score: 80,
            text: analysis.health.vitality + ' ' + (analysis.health.concerns || ''),
          }
        ]
      };
    };

    const runAnalysis = async () => {
      if (!imageData || !user?.id) {
        navigate('/scan');
        return;
      }

      try {
        const response = await fetch(imageData);
        const blob = await response.blob();
        const file = new File([blob], 'palm_scan.jpg', { type: 'image/jpeg' });

        // 1. Call AI Analysis API
        const apiResponse = await readingApi.analyze(user.id, file, null);
        const savedReading = apiResponse.data;
        const analysis = savedReading?.analysisResult; 
        
        if (!analysis) throw new Error('No analysis data received');

        // 2. Map complex result to UI Store
        const resultForStore = mapToReadingResult(analysis);
        setReadingResult(resultForStore as any);
        
        setProgress(100);
        setTimeout(() => navigate('/reading/result', { replace: true }), 1000);
        
      } catch (err) {
        console.error('ANALYSIS_FAILED:', err);
        setReadingResult(DEMO_RESULT as any);
        setProgress(100);
        setTimeout(() => navigate('/reading/result', { replace: true }), 2000);
      }
    };

    runAnalysis();
    return () => { clearInterval(msgTimer); clearInterval(factTimer); clearInterval(progressTimer); };
  }, [navigate, imageData, setReadingResult, user?.id]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' }}/>
      <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)' }}/>

      {/* Triple ring loader */}
      <div className="relative mb-8" style={{ width: 110, height: 110 }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid transparent', borderTopColor: '#7C3AED', borderRightColor: 'rgba(124,58,237,0.2)' }}/>
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 1.0, repeat: Infinity, ease: 'linear' }}
          className="absolute rounded-full"
          style={{ inset: 14, border: '2px solid transparent', borderBottomColor: '#06B6D4', borderLeftColor: 'rgba(6,182,212,0.2)' }}/>
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.8, repeat: Infinity }}
          className="absolute flex items-center justify-center text-2xl"
          style={{ inset: 28, borderRadius: '50%', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.3)' }}>
          🔮
        </motion.div>
      </div>

      <h2 className="text-xl font-bold text-slate-200 mb-2 text-center">Reading your destiny...</h2>

      <AnimatePresence mode="wait">
        <motion.p key={msgIndex}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="text-sm mb-8 text-center"
          style={{ color: '#7C3AED' }}>
          {MESSAGES[msgIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="w-full max-w-xs h-1 rounded-full mb-8 overflow-hidden"
        style={{ background: '#1E2840' }}>
        <div className="h-full rounded-full transition-all duration-100"
          style={{ width: `${Math.min(progress, 100)}%`, background: 'linear-gradient(90deg,#7C3AED,#06B6D4)' }}/>
      </div>

      {/* Fact card */}
      <div className="w-full max-w-sm rounded-2xl px-5 py-4"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Did you know</p>
        <AnimatePresence mode="wait">
          <motion.p key={factIndex}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-slate-400 leading-relaxed">
            {FACTS[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Demo result for testing — replace with real API response
const DEMO_RESULT = {
  handShape: 'Fire Hand',
  sections: [
    { id: 'personality', label: 'Personality', color: '#7C3AED', fillColor: 'linear-gradient(90deg,#7C3AED,#06B6D4)', score: 82, text: 'Deeply intuitive with strong creative energy. You lead with passion and inspire others naturally. Your Fire hand reveals a dynamic, ambitious nature that thrives under challenge.' },
    { id: 'career', label: 'Career', color: '#F59E0B', fillColor: 'linear-gradient(90deg,#F59E0B,#EF4444)', score: 70, text: 'Strong fate line signals a purposeful career path with breakthroughs around age 32–35. Creative fields and leadership roles align well with your palm structure.' },
    { id: 'love', label: 'Love & Relationships', color: '#EC4899', fillColor: 'linear-gradient(90deg,#EC4899,#7C3AED)', score: 90, text: 'Heart line curves deeply — you love wholeheartedly and seek genuine emotional connection. Loyalty is your greatest relationship strength.' },
    { id: 'health', label: 'Health', color: '#10B981', fillColor: 'linear-gradient(90deg,#10B981,#06B6D4)', score: 75, text: 'Life line shows strong vitality. Your energy reserves are high but the line suggests periods of rest are essential for sustained performance.' },
    { id: 'advice', label: 'Personal Advice', color: '#06B6D4', fillColor: 'linear-gradient(90deg,#06B6D4,#7C3AED)', score: 88, text: 'Balance your analytical mind with intuition. Your head and heart lines are nearly parallel — a rare sign of someone who can unite logic and emotion masterfully.' },
  ],
};
