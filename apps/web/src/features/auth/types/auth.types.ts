/**
 * @file auth.types.ts
 * @description Strict type definitions for authentication module.
 * Follows Single Responsibility Principle — types only.
 */

/** OAuth provider identifiers supported by the application */
export type AuthProvider = 'google' | 'apple';

/**
 * Normalized user object mapped from Supabase auth session.
 */
export interface AuthUser {
  /** Unique user identifier (UUID) */
  id: string;
  /** User email address, null for anonymous sessions */
  email: string | null;
  /** Full display name from OAuth provider */
  fullName: string | null;
  /** Profile avatar URL from OAuth provider */
  avatarUrl: string | null;
  /** OAuth provider used for last sign-in */
  provider: AuthProvider | null;
  /** ISO timestamp of account creation */
  createdAt: string;
}

/**
 * Complete authentication state for UI consumption.
 */
export interface AuthState {
  /** Currently authenticated user, null when unauthenticated */
  user: AuthUser | null;
  /** True during async auth operations */
  isLoading: boolean;
  /** True when a valid session exists */
  isAuthenticated: boolean;
  /** Last authentication error, null when no error */
  error: AuthError | null;
}

/**
 * Structured authentication error for user-facing display.
 */
export interface AuthError {
  /** Machine-readable error code */
  code: string;
  /** Human-readable error message */
  message: string;
}
