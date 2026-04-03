/**
 * @component AuthButton
 * @description Reusable OAuth provider button with loading state animation.
 * Follows accessibility guidelines: minimum 44px touch target, ARIA labels.
 */

import { motion } from 'framer-motion';
import type { AuthProvider } from '../types/auth.types';

interface AuthButtonProps {
  /** OAuth provider this button represents */
  provider: AuthProvider;
  /** Visible button label text */
  label: string;
  /** Path to provider icon (SVG) */
  icon: string;
  /** Click handler initiating the OAuth flow */
  onClick: () => void;
  /** Disables button during any auth loading state */
  isLoading: boolean;
}

/**
 * OAuth provider sign-in button component.
 * Renders a glassmorphism-styled button with smooth hover/tap animations.
 */
export function AuthButton({ provider, label, icon, onClick, isLoading }: AuthButtonProps) {
  return (
    <motion.button
      id={`auth-btn-${provider}`}
      aria-label={label}
      disabled={isLoading}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="
        w-full flex items-center justify-center gap-3 
        py-3.5 px-5 rounded-2xl font-medium text-sm
        bg-white/10 hover:bg-white/15 border border-white/10 
        hover:border-white/25 text-white
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        min-h-[44px]
      "
    >
      {isLoading ? (
        <span
          className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
          aria-hidden="true"
        />
      ) : (
        <img src={icon} alt="" className="w-5 h-5" aria-hidden="true" />
      )}
      <span>{label}</span>
    </motion.button>
  );
}
