/**
 * @file LoginPage.tsx
 * @description Premium dark login page with Google and Apple OAuth
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const ITEM = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const LoginPage: React.FC = () => {
  const { signIn, isLoading, error } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-5 relative overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[5%] right-[-10%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />

      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <motion.div variants={ITEM} className="text-center mb-8">
          <motion.div
            animate={{ boxShadow: ['0 0 20px rgba(124,58,237,0.3)', '0 0 40px rgba(124,58,237,0.6)', '0 0 20px rgba(124,58,237,0.3)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-18 h-18 rounded-2xl flex items-center justify-center mx-auto mb-5 text-4xl"
            style={{
              width: 72, height: 72,
              background: 'linear-gradient(135deg, #7C3AED, #06B6D4)',
              borderRadius: 20,
            }}
          >
            🔮
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-2">Palmistry AI</h1>
          <p className="text-sm text-gray-500 leading-relaxed">Discover what your hands reveal about your destiny</p>
        </motion.div>

        {/* Card */}
        <motion.div
          variants={ITEM}
          className="rounded-3xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <h2 className="text-base font-semibold text-slate-200 text-center mb-5">
            Continue to your reading
          </h2>

          {/* Google */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn('google')}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-3 cursor-pointer transition-all duration-200 disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-300">Continue with Google</span>
          </motion.button>

          {/* Apple */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => signIn('apple')}
            disabled={isLoading}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 disabled:opacity-50"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#1a1a1a', border: '1px solid #333' }}>
              <svg width="12" height="14" viewBox="0 0 814 1000" fill="white">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.9 268.9-317.9 86.1 0 157.4 58.4 200.9 58.4 42 0 124.8-61.6 210.9-61.6l-.2.2zm-201.7-105.1c-41 43.1-87.9 62.2-144.9 62.2-5.5 0-11-.3-16.5-1.1 1.4-44.2 18.5-87.9 52.6-118.8C513.3 149.3 570.8 123 623.4 123c3 0 6.1.2 9.1.4-1.7 42.3-13.2 88.2-46.1 112.4z"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-300">Continue with Apple</span>
          </motion.button>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-400 text-xs text-center mt-4">
              {error.message}
            </motion.p>
          )}

          <p className="text-xs text-gray-600 text-center mt-5 leading-relaxed">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
