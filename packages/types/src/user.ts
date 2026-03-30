/**
 * @file user.ts
 * @author Antigravity
 * @date 2026-03-30
 * @description Strict TypeScript interfaces for User entities.
 */

/**
 * Subscription tiers for users.
 */
export enum SubscriptionTier {
  GUEST = 'guest',
  FREE = 'free',
  PREMIUM = 'premium',
}

/**
 * User entity interface.
 * No optional fields allowed.
 */
export interface User {
  /** UUID v4 */
  id: string;
  /** Email address, null for guest users */
  email: string | null;
  /** Unique device identifier */
  deviceId: string;
  /** Current subscription level */
  subscriptionTier: SubscriptionTier;
  /** Account creation date */
  createdAt: Date;
  /** Last activity timestamp */
  lastActiveAt: Date;
}
