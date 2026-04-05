/**
 * @file OnboardingFlow.tsx
 * @description Chat-style agent onboarding — collects name, age, DOB
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../services/profile.service';

interface StepConfig {
  step: 'name' | 'age' | 'dob';
  message: string;
  placeholder: string;
  type: string;
  hint: string;
  validate: (v: string) => string | null;
}

const STEPS: StepConfig[] = [
  {
    step: 'name',
    message: "👋 Welcome! Before we reveal your destiny, I need to know you better. What's your name?",
    placeholder: 'Enter your full name...',
    type: 'text',
    hint: 'At least 2 characters',
    validate: (v) => v.trim().length < 2 ? 'Name must be at least 2 characters.' : null,
  },
  {
    step: 'age',
    message: '✨ Beautiful name! Now tell me your age so I can align the cosmic timeline.',
    placeholder: 'Your age...',
    type: 'number',
    hint: 'Must be 18 or older',
    validate: (v) => {
      const n = parseInt(v);
      return isNaN(n) || n < 18 || n > 120 ? 'Please enter a valid age (18–120).' : null;
    },
  },
  {
    step: 'dob',
    message: '🌟 Almost there! Your date of birth helps align the stars with your reading.',
    placeholder: '',
    type: 'date',
    hint: 'Day / Month / Year',
    validate: (v) => !v ? 'Please select your date of birth.' : null,
  },
];

interface OnboardingFlowProps {
  userId: string;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({ name: '', age: '', dob: '' });
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStep = STEPS[stepIndex];

  useEffect(() => {
    setIsTyping(true);
    setInputValue('');
    setError(null);
    const t = setTimeout(() => {
      setIsTyping(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, 1200);
    return () => clearTimeout(t);
  }, [stepIndex]);

  const handleNext = useCallback(async () => {
    const validationError = currentStep.validate(inputValue);
    if (validationError) { setError(validationError); return; }

    const updated = { ...answers, [currentStep.step]: inputValue };
    setAnswers(updated);
    setError(null);

    if (stepIndex === STEPS.length - 1) {
      setIsSubmitting(true);
      try {
        await profileService.saveProfile({
          userId,
          name: updated.name,
          age: parseInt(updated.age),
          dateOfBirth: updated.dob,
          onboardingCompletedAt: new Date().toISOString(),
        });
        navigate('/', { replace: true });
      } catch {
        setError('Failed to save profile. Please try again.');
        setIsSubmitting(false);
      }
    } else {
      setStepIndex(prev => prev + 1);
    }
  }, [currentStep, inputValue, answers, stepIndex, userId, navigate]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col px-5 py-8 relative overflow-hidden"
      style={{ maxWidth: 480, margin: '0 auto' }}>

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />

      {/* Progress */}
      <div className="flex gap-2 mb-8 relative z-10">
        {STEPS.map((s, i) => (
          <div key={s.step} className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ background: i < stepIndex ? '#06B6D4' : i === stepIndex ? '#7C3AED' : '#1E2840' }} />
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col gap-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex gap-3 items-start"
          >
            {/* Agent avatar */}
            <motion.div
              animate={{ boxShadow: ['0 0 0px rgba(124,58,237,0)', '0 0 16px rgba(124,58,237,0.5)', '0 0 0px rgba(124,58,237,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}
            >
              ✦
            </motion.div>

            {/* Bubble */}
            <div className="rounded-tr-2xl rounded-br-2xl rounded-bl-2xl px-4 py-3"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', maxWidth: 280 }}>
              {isTyping ? (
                <div className="flex gap-1 items-center py-1">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: '#7C3AED' }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-relaxed" style={{ color: '#C4B5FD' }}>
                  {currentStep.message}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Input area */}
        {!isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              ref={inputRef}
              type={currentStep.type}
              value={inputValue}
              onChange={e => { setInputValue(e.target.value); setError(null); }}
              onKeyDown={e => e.key === 'Enter' && !isSubmitting && handleNext()}
              placeholder={currentStep.placeholder}
              max={currentStep.step === 'dob' ? new Date().toISOString().split('T')[0] : undefined}
              className="w-full px-4 py-4 rounded-2xl text-sm outline-none text-slate-200"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(124,58,237,0.3)'}`,
              }}
            />
            {error && <p className="text-xs text-red-400 mt-2 ml-1">{error}</p>}
            <p className="text-xs text-gray-600 mt-2 ml-1">{currentStep.hint}</p>
          </motion.div>
        )}
      </div>

      {/* CTA */}
      <div className="relative z-10 pt-4">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNext}
          disabled={isTyping || !inputValue.trim() || isSubmitting}
          className="w-full py-4 rounded-2xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
            boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
          }}
        >
          {isSubmitting ? 'Saving...' : stepIndex === STEPS.length - 1 ? 'Begin My Reading →' : 'Continue →'}
        </motion.button>
        <p className="text-xs text-gray-600 text-center mt-3">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
};
