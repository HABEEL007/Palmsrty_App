/**
 * @file auth.service.ts
 * @description Authentication business logic — Supabase OAuth
 */

import { supabase } from '../../../lib/supabase';
import type { AuthProvider, AuthUser } from '../types/auth.types';

export class AuthService {
  /**
   * Signs up a new user with email and password.
   */
  async signUp(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw new Error(`AUTH_SIGNUP_FAILED: ${error.message}`);
  }

  /**
   * Signs in an existing user with email and password.
   */
  async signInWithEmail(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(`AUTH_SIGNIN_FAILED: ${error.message}`);
  }

  /**
   * Initiate OAuth sign-in with Google or Apple
   */
  async signInWithProvider(provider: AuthProvider): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (error) throw new Error(`AUTH_${provider.toUpperCase()}_FAILED: ${error.message}`);
  }

  /** Sign out current user */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`AUTH_SIGNOUT_FAILED: ${error.message}`);
  }

  /** Map raw Supabase user to AuthUser */
  async mapToAuthUser(supabaseUser: any): Promise<AuthUser> {
    // Check if onboarding is complete
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed_at')
      .eq('id', supabaseUser.id)
      .single();

    return {
      id: supabaseUser.id,
      email: supabaseUser.email ?? null,
      fullName: supabaseUser.user_metadata?.full_name ?? null,
      avatarUrl: supabaseUser.user_metadata?.avatar_url ?? null,
      provider: supabaseUser.app_metadata?.provider ?? null,
      onboardingCompleted: !!profile?.onboarding_completed_at,
      createdAt: supabaseUser.created_at,
    };
  }
}

export const authService = new AuthService();
