/**
 * @hook useOnboarding
 * @description State machine for the conversational onboarding journey.
 * Orchestrates step transitions, validation, and profile submission logic.
 */

import { useState, useCallback } from 'react';
import { profileService } from '../services/profile.service';
import { ONBOARDING_STEPS } from '../types/onboarding.types';
import type { OnboardingStepConfig, UserProfile } from '../types/onboarding.types';

/** Main state interface managing the flow progression */
interface OnboardingState {
  currentStepIndex: number;
  answers: Record<string, string>;
  isSubmitting: boolean;
  error: string | null;
}

/**
 * Custom hook providing robust onboarding control logic.
 * 
 * @param userId - Target user ID for profile persistence
 */
export function useOnboarding(userId: string) {
  const [state, setState] = useState<OnboardingState>({
    currentStepIndex: 0,
    answers: {},
    isSubmitting: false,
    error: null,
  });

  const currentStep: OnboardingStepConfig = ONBOARDING_STEPS[state.currentStepIndex];
  const isLastStep = state.currentStepIndex === ONBOARDING_STEPS.length - 1;

  /**
   * Action handler for step progression.
   * Runs strict validation before advancing or submitting.
   * 
   * @param value - User-provided answer string
   */
  const submitAnswer = useCallback(async (value: string) => {
    // 1. Initial local validation check
    const validationError = currentStep.validate(value);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return;
    }

    // 2. State accumulation for final submission
    const updatedAnswers = { 
      ...state.answers, 
      [currentStep.step]: value 
    };

    // 3. Sequential flow logic: Final Submission vs Next Step
    if (isLastStep) {
      setState(prev => ({ ...prev, isSubmitting: true, error: null }));
      try {
        const profile: UserProfile = {
          userId,
          name: updatedAnswers.name,
          age: parseInt(updatedAnswers.age),
          dateOfBirth: updatedAnswers.dob,
          onboardingCompletedAt: new Date().toISOString(),
        };
        
        await profileService.saveProfile(profile);
        
        // Final transition on success
        setState(prev => ({ 
          ...prev, 
          answers: updatedAnswers,
          currentStepIndex: prev.currentStepIndex + 1,
          isSubmitting: false,
          error: null
        }));
      } catch (err) {
        setState(prev => ({ 
          ...prev, 
          isSubmitting: false,
          error: (err as Error).message || 'Failed to save profile. Please try again.' 
        }));
      }
    } else {
      // Linear step advancement
      setState(prev => ({
        ...prev,
        answers: updatedAnswers,
        currentStepIndex: prev.currentStepIndex + 1,
        error: null,
      }));
    }
  }, [currentStep, isLastStep, state.answers, userId]);

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
