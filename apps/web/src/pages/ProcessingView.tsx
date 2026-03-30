/**
 * @file ProcessingView.tsx
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@palmistry/ui';

const FACTS = [
  "Your life line's length actually indicates your vitality, not lifespan.",
  "The 'M' shape on a palm is a sign of good fortune and intuition.",
  "Mounts of the palm represent different planets and energy centers.",
  "Left hand shows potential, while the right hand shows what you've done with it."
];

const STEPS = [
  "Scanning your palm lines...",
  "Analyzing life path indicators...",
  "Reading energy signatures...",
  "Compiling your destiny map..."
];

export const ProcessingView: React.FC = () => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % STEPS.length);
    }, 2000);

    const factInterval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % FACTS.length);
    }, 3000);

    const timer = setTimeout(() => {
      navigate('/reading/123'); // Simulation redirect
    }, 8000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(factInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      {/* Custom Circular Arc Animation */}
      <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-t-2 border-primary-neon rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-primary/20 rounded-full blur-2xl border-primary-neon border"
        />
        <div className="relative text-primary-neon font-bold text-xl uppercase tracking-widest">
           AI EYE
        </div>
      </div>

      <Typography variant="h3" className="mb-8 font-mono min-h-[1.5em] text-primary-neon">
        {STEPS[stepIndex]}
      </Typography>

      {/* Palmistry Fact Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={factIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass p-6 max-w-sm text-center border-secondary-glow/20"
        >
          <Typography variant="caption" className="uppercase tracking-widest text-secondary-glow mb-2 block">
             Did you know?
          </Typography>
          <Typography variant="body" className="italic">
            "{FACTS[factIndex]}"
          </Typography>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
