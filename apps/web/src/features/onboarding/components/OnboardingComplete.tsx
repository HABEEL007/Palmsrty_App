/**
 * @component OnboardingComplete
 * @description Final success state for the conversational onboarding flow. 
 * Provides a seamless transition to the main application environment.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

/**
 * Success visualizer with premium entrance animation.
 */
export const OnboardingComplete: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center space-y-12">
      {/* Animated Success Visual */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 
                   flex items-center justify-center text-4xl shadow-2xl relative group"
        aria-hidden="true"
      >
        🌟
        <Sparkles 
          className="absolute -top-2 -right-2 text-indigo-400 group-hover:animate-pulse" 
          size={32} 
        />
      </motion.div>

      {/* Success Messages Staggered */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h2 className="text-white text-3xl font-extrabold tracking-tight">
          Destiny Aligned
        </h2>
        <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-xs mx-auto">
          Your profiles are now integrated with the stars. 
          The spirits are ready for your first palm reading.
        </p>
      </motion.div>

      {/* Call-to-action transition button */}
      <motion.button
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onClick={() => navigate('/')}
        className="group flex items-center justify-between w-full max-w-sm px-8 py-5
                   bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10
                   transition-all duration-300 backdrop-blur-xl"
        aria-label="Enter application"
      >
        <span className="text-white font-bold text-lg leading-none">
          Reveal My Destiny
        </span>
        <div 
          className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center 
                     justify-center text-white group-hover:translate-x-1 
                     transition-transform shadow-lg"
        >
          <ArrowRight size={22} strokeWidth={2.5} />
        </div>
      </motion.button>
    </div>
  );
};
