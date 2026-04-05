/**
 * @file profile.service.ts
 * @description Supabase profile persistence service
 */

import { supabase } from '../../../lib/supabase';

export interface UserProfile {
  userId: string;
  name: string;
  age: number;
  dateOfBirth: string;
  onboardingCompletedAt: string;
}

export class ProfileService {
  async saveProfile(profile: UserProfile): Promise<void> {
    const { error } = await supabase.from('profiles').upsert({
      id: profile.userId,
      name: profile.name,
      age: profile.age,
      date_of_birth: profile.dateOfBirth,
      onboarding_completed_at: profile.onboardingCompletedAt,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(`PROFILE_SAVE_FAILED: ${error.message}`);
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error || !data) return null;
    return {
      userId: data.id,
      name: data.name,
      age: data.age,
      dateOfBirth: data.date_of_birth,
      onboardingCompletedAt: data.onboarding_completed_at,
    };
  }
}

export const profileService = new ProfileService();
