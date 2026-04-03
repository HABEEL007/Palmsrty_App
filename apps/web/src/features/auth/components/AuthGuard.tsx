/**
 * @component AuthGuard
 * @description Route protection wrapper that redirects unauthenticated users
 * to the login page. Shows a loader during session hydration.
 */

import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  /** Protected route content to render when authenticated */
  children: ReactNode;
}

/**
 * Route guard component enforcing authentication.
 * - Loading: Shows animated spinner while session is determined
 * - Unauthenticated: Redirects to /login
 * - Authenticated: Renders children
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Checking authentication"
        className="min-h-screen bg-[#0B0F1A] flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-500"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
