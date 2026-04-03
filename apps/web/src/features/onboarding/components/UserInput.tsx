/**
 * @component UserInput
 * @description Controlled input component for each onboarding step.
 * Handles text, number, and date input types with validation error display.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { OnboardingStepConfig } from '../types/onboarding.types';

interface UserInputProps {
  /** Current step configuration with input type and placeholder */
  step: OnboardingStepConfig;
  /** Submission handler called with the validated value */
  onSubmit: (value: string) => void;
  /** Inline validation or server error message */
  error: string | null;
  /** Disables input during async profile save */
  isLoading: boolean;
}

/**
 * Single-step input component for the onboarding chat flow.
 * Submits on Enter key press or Continue button click.
 */
export function UserInput({ step, onSubmit, error, isLoading }: UserInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut', delay: 0.2 }}
      className="space-y-2"
    >
      <div className="flex gap-2">
        <input
          id={`onboarding-input-${step.step}`}
          type={step.inputType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={step.placeholder}
          disabled={isLoading}
          aria-label={step.placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `error-${step.step}` : undefined}
          className="
            flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3
            text-white text-sm placeholder-gray-500
            focus:outline-none focus:border-purple-500/60 focus:bg-white/8
            disabled:opacity-50 transition-colors duration-200
            min-h-[44px]
          "
        />
        <motion.button
          onClick={handleSubmit}
          disabled={isLoading || !value.trim()}
          whileTap={{ scale: 0.95 }}
          aria-label="Continue to next step"
          className="
            bg-purple-600 hover:bg-purple-500 text-white
            px-5 py-3 rounded-xl text-sm font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200 min-h-[44px]
          "
        >
          {isLoading ? (
            <span
              className="block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
              aria-hidden="true"
            />
          ) : (
            '→'
          )}
        </motion.button>
      </div>

      {error && (
        <motion.p
          id={`error-${step.step}`}
          role="alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-xs px-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
