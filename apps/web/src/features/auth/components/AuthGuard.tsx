/**
 * @component AuthGuard
 * @description Production route protection wrapper that redirects unauthenticated users
 * to the login page. Shows a premium loader during session hydration phases.
 */

import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  /** Protected route content to render when authenticated */
  children: ReactNode;
}

/**
 * Centered application loading experience with animated spinner.
 * Standardized across the application for visual consistency.
 */
const PageLoader = () => (
  <div 
    role="status" 
    aria-label="Checking authentication status"
    className="min-h-screen bg-[#0B0F1A] flex items-center justify-center"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500"
      aria-hidden="true" 
    />
  </div>
);

/**
 * High-order layout for route protection. 
 * Prevents unauthorized access and handles automatic session recovery redirects.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();

  // Handle various states of auth lifecycle
  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Use fragment to ensure proper layout handling of child components
  return <>{children}</>;
};
