/**
 * @file onboarding.types.ts
 * @description Type definitions and step configuration for the
 * conversational onboarding flow.
 */

/** Possible steps in the onboarding flow state machine */
export type OnboardingStep = 'name' | 'age' | 'dob' | 'complete';

/**
 * Configuration for a single onboarding step.
 * Includes agent message, input config, and validation logic.
 */
export interface OnboardingStepConfig {
  /** Step identifier */
  step: OnboardingStep;
  /** AI agent's conversational message for this step */
  agentMessage: string;
  /** HTML input placeholder text */
  placeholder: string;
  /** HTML input type */
  inputType: 'text' | 'number' | 'date';
  /**
   * Validates the user's input.
   * @param value - Raw string value from input
   * @returns null if valid, error message string if invalid
   */
  validate: (value: string) => string | null;
}

/**
 * User profile data collected during onboarding.
 */
export interface UserProfile {
  /** Supabase auth user UUID */
  userId: string;
  /** User's full name */
  name: string;
  /** User's age in years */
  age: number;
  /** Date of birth in ISO format (YYYY-MM-DD) */
  dateOfBirth: string;
  /** ISO timestamp when onboarding was completed */
  onboardingCompletedAt: string;
}

/** Minimum valid user age */
const MIN_AGE = 18;
/** Maximum valid user age */
const MAX_AGE = 120;
/** Minimum name length */
const MIN_NAME_LENGTH = 2;

/**
 * Ordered array of onboarding step configurations.
 * Steps are executed sequentially in array order.
 */
export const ONBOARDING_STEPS: OnboardingStepConfig[] = [
  {
    step: 'name',
    agentMessage:
      "👋 Welcome! Before we reveal your destiny, I need to know you better. What's your name?",
    placeholder: 'Enter your full name...',
    inputType: 'text',
    validate: (v) =>
      v.trim().length < MIN_NAME_LENGTH
        ? `Name must be at least ${MIN_NAME_LENGTH} characters`
        : null,
  },
  {
    step: 'age',
    agentMessage: '✨ Beautiful name! How old are you?',
    placeholder: 'Your age...',
    inputType: 'number',
    validate: (v) => {
      const age = parseInt(v, 10);
      if (Number.isNaN(age) || age < MIN_AGE || age > MAX_AGE) {
        return `Please enter a valid age (${MIN_AGE}–${MAX_AGE})`;
      }
      return null;
    },
  },
  {
    step: 'dob',
    agentMessage:
      '🌟 Almost there! What is your date of birth? This helps me align the stars with your palm reading.',
    placeholder: 'Date of birth...',
    inputType: 'date',
    validate: (v) => (!v ? 'Please select your date of birth' : null),
  },
];
