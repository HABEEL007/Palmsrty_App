/**
 * @hook useOnboarding
 * @description State machine for the conversational onboarding flow.
 * Manages step progression, answer collection, and profile persistence.
 */

import { useState, useCallback } from 'react';
import { profileService } from '../services/profile.service';
import { ONBOARDING_STEPS } from '../types/onboarding.types';
import type { OnboardingStep, UserProfile } from '../types/onboarding.types';

interface OnboardingState {
  currentStepIndex: number;
  answers: Partial<Record<OnboardingStep, string>>;
  isSubmitting: boolean;
  error: string | null;
}

const INITIAL_STATE: OnboardingState = {
  currentStepIndex: 0,
  answers: {},
  isSubmitting: false,
  error: null,
};

/**
 * Onboarding state machine hook.
 * @param userId - Supabase auth user UUID to associate the profile with
 * @returns Current step state and submitAnswer action
 */
export function useOnboarding(userId: string) {
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

  const currentStep = ONBOARDING_STEPS[state.currentStepIndex];
  const isLastStep = state.currentStepIndex === ONBOARDING_STEPS.length - 1;

  /**
   * Validates and submits the user's answer for the current step.
   * Advances to the next step or saves profile on final step.
   * @param value - Raw string value from the input field
   */
  const submitAnswer = useCallback(
    async (value: string) => {
      const validationError = currentStep.validate(value);
      if (validationError) {
        setState((prev) => ({ ...prev, error: validationError }));
        return;
      }

      const updatedAnswers = {
        ...state.answers,
        [currentStep.step]: value,
      };

      if (isLastStep) {
        setState((prev) => ({ ...prev, isSubmitting: true, error: null }));
        try {
          const profile: UserProfile = {
            userId,
            name: updatedAnswers.name ?? '',
            age: parseInt(updatedAnswers.age ?? '0', 10),
            dateOfBirth: updatedAnswers.dob ?? '',
            onboardingCompletedAt: new Date().toISOString(),
          };
          await profileService.saveProfile(profile);
          setState((prev) => ({
            ...prev,
            answers: updatedAnswers,
            currentStepIndex: prev.currentStepIndex + 1,
            isSubmitting: false,
          }));
        } catch {
          setState((prev) => ({
            ...prev,
            isSubmitting: false,
            error: 'Failed to save profile. Please try again.',
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          answers: updatedAnswers,
          currentStepIndex: prev.currentStepIndex + 1,
          error: null,
        }));
      }
    },
    [currentStep, isLastStep, state.answers, userId],
  );

  return {
    currentStep,
    currentStepIndex: state.currentStepIndex,
    totalSteps: ONBOARDING_STEPS.length,
    isSubmitting: state.isSubmitting,
    error: state.error,
    isComplete: state.currentStepIndex >= ONBOARDING_STEPS.length,
    submitAnswer,
  };
}
