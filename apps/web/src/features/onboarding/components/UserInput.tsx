/**
 * @component UserInput
 * @description Dynamic input component for onboarding flow based on step configuration.
 * Orchestrates localized data capture and specialized form controls.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import type { OnboardingStepConfig } from '../types/onboarding.types';

interface UserInputProps {
  /** Config object defining current capture step requirements */
  step: OnboardingStepConfig;
  /** Action handler when user confirms their answer */
  onSubmit: (value: string) => void;
  /** Active validation error if present */
  error: string | null;
  /** Loading state during profile saving */
  isLoading: boolean;
}

/**
 * Standardized input control with stateful feedback and localized placeholders.
 * Supports: text, number, and date input types.
 */
export const UserInput: React.FC<UserInputProps> = ({ 
  step, 
  onSubmit, 
  error, 
  isLoading 
}) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input on every new step for seamless conversational flow
  useEffect(() => {
    inputRef.current?.focus();
    setValue(''); // Reset internal state for new step
  }, [step]);

  /** Form submission handler with prevention of empty values */
  const handleConfirm = (event: React.FormEvent) => {
    event.preventDefault();
    if (value.trim() && !isLoading) {
      onSubmit(value);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 12, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
      className="flex flex-col items-end space-y-4 w-full"
    >
      <form onSubmit={handleConfirm} className="w-full max-w-[85%] space-y-2">
        <label htmlFor="onboarding-input" className="sr-only">
          {step.placeholder}
        </label>
        
        <div className="relative group">
          <input
            id="onboarding-input"
            ref={inputRef}
            type={step.inputType}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={isLoading}
            placeholder={step.placeholder}
            className="w-full px-6 py-4 bg-white/5 border border-white/10 
                       rounded-2xl rounded-tr-none text-white text-sm font-medium
                       placeholder:text-gray-600 focus:outline-none focus:border-purple-500/40 
                       focus:ring-2 focus:ring-purple-500/10 transition-all 
                       disabled:opacity-50 disabled:pointer-events-none pr-14"
          />
          
          <button
            type="submit"
            disabled={!value.trim() || isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-3
                       bg-purple-600/20 text-purple-400 border border-purple-500/20 
                       rounded-xl hover:bg-purple-600 transition-all duration-300
                       disabled:opacity-20 disabled:pointer-events-none group-hover:border-purple-500/40"
            aria-label="Confirm choice"
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Validation Error representation */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="px-4 py-2 bg-red-400/10 rounded-lg border border-red-400/20"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <Star size={12} className="text-red-400" />
                <span className="text-red-400 text-xs font-semibold leading-none">
                  {error}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
};
