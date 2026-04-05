/**
 * @file HomePage.tsx
 * @description Home screen — hero + start reading CTA
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col relative overflow-hidden"
      style={{ maxWidth: 480, margin: '0 auto' }}>

      {/* Glows */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-[-10%] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)' }} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl">🔮</span>
          <span className="text-sm font-semibold text-slate-300">Palmistry AI</span>
        </div>
        <button onClick={signOut} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
          Sign out
        </button>
      </div>

      {/* Hero */}
      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="visible"
        className="flex-1 flex flex-col items-center justify-center px-5 text-center py-12 relative z-10"
      >
        <motion.div variants={ITEM}>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl mb-6"
          >
            🖐️
          </motion.div>
        </motion.div>

        <motion.div variants={ITEM} className="mb-3">
          <span className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: '#7C3AED' }}>
            AI Palm Reading
          </span>
        </motion.div>

        <motion.h1 variants={ITEM}
          className="text-4xl font-bold text-slate-100 leading-tight mb-4 tracking-tight">
          Reveal What Your<br />Hands Say
        </motion.h1>

        <motion.p variants={ITEM} className="text-sm text-gray-500 leading-relaxed mb-10 max-w-xs">
          Advanced AI analyzes your palm lines, mounts, and hand shape to reveal deep insights about your life path.
        </motion.p>

        {user && (
          <motion.p variants={ITEM} className="text-xs text-gray-600 mb-6">
            Welcome back, <span style={{ color: '#C4B5FD' }}>{user.fullName?.split(' ')[0] ?? 'Friend'}</span>
          </motion.p>
        )}

        <motion.div variants={ITEM} className="w-full max-w-xs flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/scan')}
            className="w-full py-4 rounded-2xl text-sm font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
              boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
            }}
          >
            ✦ Scan My Palm
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/history')}
            className="w-full py-4 rounded-2xl text-sm font-semibold transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#94A3B8',
            }}
          >
            View Past Readings
          </motion.button>
        </motion.div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="px-5 pb-10 relative z-10"
      >
        <p className="text-xs text-gray-600 text-center mb-4 uppercase tracking-widest">How it works</p>
        <div className="flex gap-3">
          {[
            { icon: '📸', label: 'Scan', desc: 'Take a photo of both palms' },
            { icon: '🤖', label: 'Analyze', desc: 'AI reads your lines in seconds' },
            { icon: '✨', label: 'Reveal', desc: 'Get your personalized reading' },
          ].map((step, i) => (
            <div key={i} className="flex-1 rounded-2xl p-3 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xl mb-1">{step.icon}</div>
              <div className="text-xs font-semibold text-slate-400 mb-1">{step.label}</div>
              <div className="text-xs text-gray-600 leading-snug">{step.desc}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
