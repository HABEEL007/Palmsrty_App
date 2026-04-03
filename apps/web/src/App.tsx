/**
 * @file App.tsx
 * @description Root application component.
 * Integrates: routing, auth guards, onboarding flow, i18n, and error boundary.
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { CaptureView } from './pages/CaptureView';
import { ProcessingView } from './pages/ProcessingView';
import { ResultView } from './pages/ResultView';
import { HistoryView } from './pages/HistoryView';
import { ProfileView } from './pages/ProfileView';
import { NavigationShell } from './components/NavigationShell';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoginPage } from './features/auth/components/LoginPage';
import { AuthGuard } from './features/auth/components/AuthGuard';
import { OnboardingFlow } from './features/onboarding/components/OnboardingFlow';
import { useAuth } from './features/auth/hooks/useAuth';

// Initialize i18n side-effects (language detection, RTL, etc.)
import './i18n';

/** Full-screen spinner shown during lazy route resolution */
function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
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

/**
 * Smart routing gate that handles auth + onboarding redirect logic.
 * Determines which root route to serve based on session and profile state.
 */
function AppRoutes() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Onboarding route — only for authenticated users missing profile */}
      <Route
        path="/onboarding"
        element={
          <AuthGuard>
            {user ? <OnboardingFlow userId={user.id} /> : <Navigate to="/login" replace />}
          </AuthGuard>
        }
      />

      {/* Auth callback route — Supabase redirects here after OAuth */}
      <Route
        path="/auth/callback"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Protected app routes */}
      <Route
        path="/*"
        element={
          <AuthGuard>
            <NavigationShell>
              <div className="relative min-h-full overflow-x-hidden">
                {/* Floating Particles Background */}
                <div className="particles-container" aria-hidden="true">
                  <div className="particle w-1 h-1 left-[10%] top-[20%]" />
                  <div className="particle w-2 h-2 left-[30%] top-[50%]" />
                  <div className="particle w-1 h-1 left-[70%] top-[10%]" />
                  <div className="particle w-3 h-3 left-[85%] top-[80%]" />
                  <div className="particle w-1 h-1 left-[50%] top-[40%]" />
                </div>

                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/scan" element={<CaptureView />} />
                  <Route path="/processing" element={<ProcessingView />} />
                  <Route path="/reading/result" element={<ResultView />} />
                  <Route path="/history" element={<HistoryView />} />
                  <Route path="/profile" element={<ProfileView />} />
                  {/* Fallback for unknown routes */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </NavigationShell>
          </AuthGuard>
        }
      />
    </Routes>
  );
}

/**
 * Root application component.
 * Wraps the entire app with ErrorBoundary and Suspense for resilient rendering.
 */
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
