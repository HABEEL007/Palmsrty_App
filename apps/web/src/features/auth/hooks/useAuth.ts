/**
 * @hook useAuth
 * @description Provides authentication state and actions.
 * Single source of truth for all auth-related UI state across the application.
 * Subscribes to Supabase auth state changes for real-time session updates.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@palmistry/utils/supabase';
import { authService } from '../services/auth.service';
import type { AuthState, AuthProvider } from '../types/auth.types';

/** Initial auth state while session is being determined */
const INITIAL_STATE: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

/**
 * Authentication hook providing state and session management.
 * Automatically syncs with Supabase auth state changes.
 *
 * @returns AuthState extended with signIn and signOut action callbacks
 *
 * @example
 * const { user, isAuthenticated, signIn, signOut } = useAuth();
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  useEffect(() => {
    // Hydrate state from existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState({
        user: session?.user
          ? authService.mapToAuthUser(session.user as unknown as Record<string, unknown>)
          : null,
        isLoading: false,
        isAuthenticated: !!session?.user,
        error: null,
      });
    });

    // Subscribe to future auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user
          ? authService.mapToAuthUser(session.user as unknown as Record<string, unknown>)
          : null,
        isLoading: false,
        isAuthenticated: !!session?.user,
        error: null,
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Initiates OAuth sign-in with the specified provider.
   * @param provider - OAuth provider to authenticate with
   */
  const signIn = useCallback(async (provider: AuthProvider) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.signInWithProvider(provider);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: {
          code: 'AUTH_FAILED',
          message: (err as Error).message,
        },
      }));
    }
  }, []);

  /**
   * Signs out the current user and resets auth state.
   */
  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    await authService.signOut();
  }, []);

  return { ...state, signIn, signOut };
}
