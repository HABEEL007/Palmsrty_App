/**
 * @file App.tsx
 * @description Root application component with complete routing flow
 * @version 2.0.0
 */

import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './features/auth/hooks/useAuth';
import { LoginPage } from './features/auth/components/LoginPage';
import { OnboardingFlow } from './features/onboarding/components/OnboardingFlow';
import './i18n';

// ── Lazy loaded pages ─────────────────────────────────────────────────────────
const HomePage      = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CaptureView   = lazy(() => import('./pages/CaptureView').then(m => ({ default: m.CaptureView })));
const ProcessingView = lazy(() => import('./pages/ProcessingView').then(m => ({ default: m.ProcessingView })));
const ResultView    = lazy(() => import('./pages/ResultView').then(m => ({ default: m.ResultView })));
const HistoryView   = lazy(() => import('./pages/HistoryView').then(m => ({ default: m.HistoryView })));

// ── Page loader ───────────────────────────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '2px solid rgba(124,58,237,0.2)',
        borderTopColor: '#7C3AED',
        animation: 'spin 0.9s linear infinite',
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// ── Route guards ──────────────────────────────────────────────────────────────
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresOnboarding = false,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiresOnboarding && user && !user.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

// ── App ───────────────────────────────────────────────────────────────────────
export const App: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-[#0B0F1A]">
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* ── Public ─────────────────────────────────────────── */}
                <Route
                  path="/login"
                  element={
                    isAuthenticated
                      ? <Navigate to={user?.onboardingCompleted ? '/' : '/onboarding'} replace />
                      : <LoginPage />
                  }
                />

                {/* ── Onboarding ─────────────────────────────────────── */}
                <Route
                  path="/onboarding"
                  element={
                    !isAuthenticated
                      ? <Navigate to="/login" replace />
                      : user?.onboardingCompleted
                        ? <Navigate to="/" replace />
                        : <OnboardingFlow userId={user!.id} />
                  }
                />

                {/* ── Protected ──────────────────────────────────────── */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute requiresOnboarding>
                      <HomePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/scan"
                  element={
                    <ProtectedRoute requiresOnboarding>
                      <CaptureView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/processing"
                  element={
                    <ProtectedRoute requiresOnboarding>
                      <ProcessingView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reading/result"
                  element={
                    <ProtectedRoute requiresOnboarding>
                      <ResultView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute requiresOnboarding>
                      <HistoryView />
                    </ProtectedRoute>
                  }
                />

                {/* ── Fallback ───────────────────────────────────────── */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
};
