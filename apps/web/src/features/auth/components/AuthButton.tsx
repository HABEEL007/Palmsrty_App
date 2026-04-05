/**
 * @file AuthButton.tsx
 * @description Specialized button component for OAuth authentication actions.
 */

import React from 'react';
import { motion } from 'framer-motion';
import type { AuthProvider } from '../types/auth.types';

interface AuthButtonProps {
  provider: AuthProvider;
  label: string;
  icon: string;
  onClick: () => void;
  isLoading: boolean;
}

/**
 * Standardized OAuth button with hover effects and accessible labels.
 * 
 * @param props - Configuration object containing provider and handler details
 */
export const AuthButton: React.FC<AuthButtonProps> = ({ 
  label, 
  icon, 
  onClick, 
  isLoading 
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isLoading}
      className="flex items-center w-full gap-4 px-6 py-4 transition-all 
                 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10
                 group disabled:opacity-50 disabled:pointer-events-none"
    >
      <img 
        src={icon} 
        alt="" 
        className="w-6 h-6 grayscale group-hover:grayscale-0 transition-all"
        aria-hidden="true" 
      />
      <span className="text-white font-medium text-sm">
        {isLoading ? 'Processing...' : label}
      </span>
    </motion.button>
  );
};
