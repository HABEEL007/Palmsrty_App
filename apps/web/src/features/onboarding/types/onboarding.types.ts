/**
 * @file onboarding.types.ts
 * @description Strict type definitions for the conversational onboarding journey.
 */

export type OnboardingStep = 'name' | 'age' | 'dob' | 'complete';

/** Configuration for each individual onboarding agent interaction */
export interface OnboardingStepConfig {
  step: OnboardingStep;
  agentMessage: string;
  placeholder: string;
  inputType: 'text' | 'number' | 'date';
  validate: (value: string) => string | null; // null represents valid state
}

/** Production user profile after successful completion */
export interface UserProfile {
  userId: string;
  name: string;
  age: number;
  dateOfBirth: string;
  onboardingCompletedAt: string;
}

/** 
 * Static configuration for the onboarding flow. 
 * Defines the progression and strict validation rules.
 */
export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    step: 'name',
    agentMessage: "👋 Welcome! Before we reveal your destiny, I need to know you better. What's your name?",
    placeholder: 'Enter your full name...',
    inputType: 'text',
    validate: (v) => v.trim().length < 2 
      ? 'Name must be at least 2 characters' : null,
  },
  {
    step: 'age',
    agentMessage: "✨ Beautiful name! How old are you?",
    placeholder: 'Your age...',
    inputType: 'number',
    validate: (v) => {
      const age = parseInt(v);
      if (isNaN(age) || age < 18 || age > 120) 
        return 'Please enter a valid age (18-120)';
      return null;
    },
  },
  {
    step: 'dob',
    agentMessage: "🌟 Almost there! What is your date of birth? This helps me align the stars with your palm reading.",
    placeholder: 'Date of birth...',
    inputType: 'date',
    validate: (v) => !v ? 'Please select your date of birth' : null,
  },
];
