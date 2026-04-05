/**
 * @file useAuth.ts
 * @description Single source of truth for authentication state
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../lib/supabase';
import { authService } from '../services/auth.service';
import type { AuthState, AuthProvider } from '../types/auth.types';

const INITIAL_STATE: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

export function useAuth() {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const user = await authService.mapToAuthUser(session.user);
        setState({ user, isLoading: false, isAuthenticated: true, error: null });
      } else {
        setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const user = await authService.mapToAuthUser(session.user);
          setState({ user, isLoading: false, isAuthenticated: true, error: null });
        } else {
          setState({ user: null, isLoading: false, isAuthenticated: false, error: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.signUp(email, password);
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: { code: 'SIGNUP_FAILED', message: (err as Error).message },
      }));
    }
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.signInWithEmail(email, password);
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: { code: 'SIGNIN_FAILED', message: (err as Error).message },
      }));
    }
  }, []);

  const signIn = useCallback(async (provider: AuthProvider) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await authService.signInWithProvider(provider);
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: { code: 'AUTH_FAILED', message: (err as Error).message },
      }));
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setState(INITIAL_STATE);
  }, []);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const user = await authService.mapToAuthUser(session.user);
      setState({ user, isLoading: false, isAuthenticated: true, error: null });
    }
  }, []);

  return { ...state, signIn, signOut, signUp, signInEmail, refreshUser };
}
