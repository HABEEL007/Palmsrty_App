/**
 * @component ErrorBoundary
 * @description Global application error interceptor that prevents blank white screens.
 * Provides a production-grade fallback UI with recovery actions.
 */

import { Component, type ReactNode } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props { 
  /** Nested application components to observe */
  children: ReactNode; 
}

interface State { 
  /** Current error state status */
  hasError: boolean; 
  /** Captured error object for diagnostic display */
  error: Error | null; 
}

/**
 * Class-based Error Boundary (required by React for error lifecycle methods).
 */
export class ErrorBoundary extends Component<Props, State> {
  // eslint-disable-next-line react/state-in-constructor
  state: State = { hasError: false, error: null };

  /** Update local state so the next render will show the fallback UI. */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /** Supplemental catch phase for side-effects (e.g., logging to observability services) */
  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('[Application Fault Intercepted]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          className="min-h-screen bg-[#0B0F1A] flex items-center justify-center p-6 text-center"
          role="alert"
          aria-live="assertive"
        >
          {/* Ambient Glow Atmosphere (Consistent with Branding) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative glass border-red-500/20 p-10 max-w-sm rounded-[40px] space-y-6">
            {/* Visual Error Icon */}
            <div 
              className="w-16 h-16 rounded-full bg-red-400/10 flex items-center justify-center mx-auto"
              aria-hidden="true" 
            >
              <AlertTriangle className="text-red-400" size={32} />
            </div>

            {/* Error messaging */}
            <div className="space-y-2">
              <h2 className="text-white text-2xl font-extrabold tracking-tight">
                Cosmic Interference
              </h2>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">
                The spirits encountered a disruption while calculating your destiny. 
                {this.state.error && (
                  <span className="block mt-2 font-mono text-[10px] opacity-60">
                    ID: {this.state.error.name}
                  </span>
                )}
              </p>
            </div>

            {/* Application Recovery action */}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="group flex items-center justify-center gap-3 w-full px-6 py-4
                         bg-purple-600 hover:bg-purple-500 text-white rounded-2xl 
                         font-bold transition-all duration-300 shadow-xl"
            >
              <RefreshCcw className="group-hover:rotate-180 transition-transform duration-700" size={20} />
              Reconnect to Destiny
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
