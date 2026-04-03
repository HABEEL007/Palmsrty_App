/**
 * @module ProfileService
 * @description Handles user profile persistence via Supabase.
 * Repository layer — database operations only, no business logic.
 */

import { supabase } from '@palmistry/utils/supabase';
import type { UserProfile } from '../types/onboarding.types';

export class ProfileService {
  /**
   * Saves the completed onboarding profile to Supabase profiles table.
   * Uses upsert to handle re-onboarding scenarios gracefully.
   * @param profile - Complete user profile from onboarding flow
   * @throws {Error} When the database write operation fails
   */
  async saveProfile(profile: UserProfile): Promise<void> {
    const { error } = await supabase.from('profiles').upsert(
      {
        id: profile.userId,
        name: profile.name,
        age: profile.age,
        date_of_birth: profile.dateOfBirth,
        onboarding_completed_at: profile.onboardingCompletedAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );

    if (error) {
      throw new Error(`PROFILE_SAVE_FAILED: ${error.message}`);
    }
  }

  /**
   * Fetches the user profile to check if onboarding is complete.
   * @param userId - Supabase auth user UUID
   * @returns UserProfile if found, null if onboarding not completed yet
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, age, date_of_birth, onboarding_completed_at')
      .eq('id', userId)
      .single();

    if (error ?? !data) {
      return null;
    }

    return {
      userId: data.id as string,
      name: data.name as string,
      age: data.age as number,
      dateOfBirth: data.date_of_birth as string,
      onboardingCompletedAt: data.onboarding_completed_at as string,
    };
  }
}

/** Singleton profile service instance */
export const profileService = new ProfileService();
