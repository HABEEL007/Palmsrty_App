/**
 * @file ProcessingView.tsx
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography } from '@palmistry/ui';
import { apiClient } from '../api/client';

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
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const analysisStarted = useRef(false);

  const imageUrl = location.state?.imageUrl;

  useEffect(() => {
    // 1. Visual Animations
    const stepInterval = setInterval(() => {
      setStepIndex(prev => (prev + 1) % STEPS.length);
    }, 2000);

    const factInterval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % FACTS.length);
    }, 3500);

    // 2. AI Analysis Call
    const performAnalysis = async () => {
      if (analysisStarted.current) return;
      analysisStarted.current = true;

      try {
        if (!imageUrl) {
          throw new Error("No image found to analyze");
        }

        const response = await apiClient.post('/api/ai/analyze', {
          userId: '00000000-0000-0000-0000-000000000000',
          leftHandImage: imageUrl // For now using one photo as the primary source
        });

        if (response.data.success) {
          // Add a small delay to ensure the user sees the last step
          setTimeout(() => {
            navigate(`/reading/result`, { state: { result: response.data.data, imageUrl } });
          }, 1500);
        }
      } catch (error) {
        console.error("Analysis failed", error);
        alert("The AI had trouble reading your palm. Please try again with better lighting.");
        navigate('/scan');
      }
    };

    performAnalysis();

    return () => {
      clearInterval(stepInterval);
      clearInterval(factInterval);
    };
  }, [imageUrl, navigate]);

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
        <div className="relative text-primary-neon font-bold text-xl uppercase tracking-widest text-center">
           AI EYE<br/><span className="text-[10px] opacity-60">Scanning...</span>
        </div>
      </div>

      <Typography variant="h3" className="mb-8 font-mono min-h-[1.5em] text-primary-neon text-center">
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
          <Typography variant="body" className="italic text-muted">
            "{FACTS[factIndex]}"
          </Typography>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
