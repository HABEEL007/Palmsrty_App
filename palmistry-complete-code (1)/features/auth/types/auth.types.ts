/**
 * @file auth.types.ts
 * @description All authentication-related TypeScript interfaces and enums
 */

export type AuthProvider = 'google' | 'apple';

export interface AuthUser {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  provider: AuthProvider | null;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: AuthError | null;
}

export interface AuthError {
  code: string;
  message: string;
}
