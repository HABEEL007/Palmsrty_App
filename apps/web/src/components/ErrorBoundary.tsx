/**
 * @component ErrorBoundary
 * @description Class-based React error boundary for catching and displaying
 * uncaught runtime errors gracefully without crashing the entire app.
 * Integrates with external monitoring services (ready for Sentry).
 */

import { Component, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  /** Child tree to protect */
  children: ReactNode;
}

interface State {
  /** Whether an error has been caught */
  hasError: boolean;
  /** The caught error instance */
  error: Error | null;
}

/** Initial boundary state — no error, pass-through rendering */
const INITIAL_STATE: State = { hasError: false, error: null };

/**
 * Application-level error boundary.
 * Catches all unhandled errors in the component tree below it.
 * Displays a user-friendly fallback UI with a reload option.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = INITIAL_STATE;

  /**
   * Derives error state from a caught error.
   * Called by React during the render phase when an error is thrown.
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * Side-effect hook after an error is caught.
   * Forward to monitoring service (e.g., Sentry) when integrated.
   * @param error - The thrown error object
   */
  componentDidCatch(error: Error): void {
    // TODO: Replace with Sentry.captureException(error) in production
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary] Unhandled error caught:', error);
    }
  }

  /** Resets boundary state to allow recovery without full page reload */
  private handleReset = (): void => {
    this.setState(INITIAL_STATE);
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-4"
          role="alert"
          aria-live="assertive"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-sm"
          >
            <div className="text-5xl mb-4" role="img" aria-label="Warning icon">
              ⚠️
            </div>
            <h2 className="text-white text-xl font-semibold mb-2 font-[Outfit]">
              Something went wrong
            </h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                id="error-boundary-reset-btn"
                onClick={this.handleReset}
                className="
                  bg-white/10 hover:bg-white/15 border border-white/10
                  text-white px-5 py-2.5 rounded-xl text-sm font-medium
                  transition-colors duration-200 min-h-[44px]
                "
              >
                Try Again
              </button>
              <button
                id="error-boundary-reload-btn"
                onClick={() => window.location.reload()}
                className="
                  bg-purple-600 hover:bg-purple-500 text-white
                  px-5 py-2.5 rounded-xl text-sm font-medium
                  transition-colors duration-200 min-h-[44px]
                "
              >
                Reload App
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
