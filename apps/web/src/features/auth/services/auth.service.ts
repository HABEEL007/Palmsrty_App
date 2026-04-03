/**
 * @module AuthService
 * @description Handles all authentication operations via Supabase OAuth.
 * Follows Single Responsibility Principle — auth business logic only, no UI.
 */

import { supabase } from '@palmistry/utils/supabase';
import type { AuthProvider, AuthUser } from '../types/auth.types';

export class AuthService {
  /**
   * Initiates OAuth sign-in flow by redirecting to provider.
   * @param provider - OAuth provider ('google' | 'apple')
   * @throws {Error} When OAuth initiation fails
   */
  async signInWithProvider(provider: AuthProvider): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      throw new Error(`AUTH_${provider.toUpperCase()}_FAILED: ${error.message}`);
    }
  }

  /**
   * Signs out the current user and clears the active session.
   * @throws {Error} When sign-out operation fails
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`AUTH_SIGNOUT_FAILED: ${error.message}`);
    }
  }

  /**
   * Maps a raw Supabase user object to the application's AuthUser type.
   * Provides a clean adapter layer between Supabase and application models.
   * @param supabaseUser - Raw Supabase user object from session
   * @returns Normalized AuthUser for UI consumption
   */
  mapToAuthUser(supabaseUser: Record<string, unknown>): AuthUser {
    const metadata = (supabaseUser.user_metadata as Record<string, string>) ?? {};
    const appMeta = (supabaseUser.app_metadata as Record<string, string>) ?? {};

    return {
      id: supabaseUser.id as string,
      email: (supabaseUser.email as string) ?? null,
      fullName: metadata.full_name ?? null,
      avatarUrl: metadata.avatar_url ?? null,
      provider: (appMeta.provider as AuthProvider) ?? null,
      createdAt: supabaseUser.created_at as string,
    };
  }
}

/** Singleton auth service instance */
export const authService = new AuthService();
