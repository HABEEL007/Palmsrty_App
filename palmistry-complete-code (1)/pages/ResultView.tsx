/**
 * @file ResultView.tsx
 * @description Palm reading results with expandable cards
 */

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useReadingStore } from '../store/reading-store';
import { useAuth } from '../features/auth/hooks/useAuth';

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const ITEM = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const ResultView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { readingResult, clearReading } = useReadingStore();
  const [expanded, setExpanded] = useState<string | null>(null);

  const sections = readingResult?.sections ?? [];

  const toggleSection = useCallback((id: string) => {
    setExpanded(prev => prev === id ? null : id);
  }, []);

  const handleNewReading = () => {
    clearReading();
    navigate('/scan', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] relative overflow-hidden"
      style={{ maxWidth: 480, margin: '0 auto' }}>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%)' }}/>

      <div style={{ padding: '20px 20px 100px' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center text-2xl flex-shrink-0"
            style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
            🔮
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-200">
              {user?.fullName?.split(' ')[0] ?? 'Your'}'s Reading
            </h2>
            <p className="text-xs text-gray-600">
              {readingResult?.handShape ?? 'Fire Hand'} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Reading cards */}
        <motion.div variants={STAGGER} initial="hidden" animate="visible"
          className="flex flex-col gap-3 mb-4">
          {sections.map((section: any) => (
            <motion.div key={section.id} variants={ITEM}>
              <motion.div
                onClick={() => toggleSection(section.id)}
                whileTap={{ scale: 0.99 }}
                className="rounded-2xl px-4 py-4 cursor-pointer transition-all duration-200"
                style={{
                  background: section.id === 'personality' ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${section.id === 'personality' ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full"
                      style={{ background: section.color, boxShadow: `0 0 8px ${section.color}60` }}/>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {section.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 transition-transform duration-300"
                    style={{ transform: expanded === section.id ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>
                    ▾
                  </span>
                </div>

                {/* Text */}
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  {expanded === section.id ? section.text : `${section.text.slice(0, 85)}...`}
                </p>

                {/* Score bar */}
                <div className="h-0.5 rounded-full overflow-hidden" style={{ background: '#1E2840' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${section.score}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: section.fillColor }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Meta ad slot */}
        <div className="rounded-xl px-3 py-2 flex items-center justify-between mb-4"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="text-xs text-gray-700">Sponsored</span>
          <span className="text-xs text-gray-600 px-2 py-1 rounded-md"
            style={{ border: '1px solid #1E2840' }}>Learn more</span>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full"
        style={{ maxWidth: 480, background: 'rgba(11,15,26,0.92)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 20px 28px' }}>
        <div className="flex gap-2">
          <motion.button whileTap={{ scale: 0.97 }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)' }}>
            Share ✦
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }}
            className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8' }}>
            Save PDF
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleNewReading}
            className="flex-1 py-3 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8' }}>
            New
          </motion.button>
        </div>
      </div>
    </div>
  );
};
