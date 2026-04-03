/**
 * @component OnboardingFlow
 * @description Main orchestrator for the conversational onboarding experience.
 * Renders step-by-step agent messages and user input fields in a chat-like UI.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useOnboarding } from '../hooks/useOnboarding';
import { AgentMessage } from './AgentMessage';
import { UserInput } from './UserInput';
import { OnboardingComplete } from './OnboardingComplete';

interface OnboardingFlowProps {
  /** Authenticated user's Supabase UUID */
  userId: string;
}

/**
 * Full onboarding flow orchestrator.
 * Manages the chat-style UI state machine for collecting user profile data.
 */
export function OnboardingFlow({ userId }: OnboardingFlowProps) {
  const { t } = useTranslation();
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    isSubmitting,
    error,
    isComplete,
    submitAnswer,
  } = useOnboarding(userId);

  if (isComplete) {
    return <OnboardingComplete />;
  }

  return (
    <main
      className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4"
      aria-label="Onboarding flow"
    >
      {/* Ambient decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-700/15 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-white font-bold text-xl font-[Outfit]">
            {t('onboarding.title')}
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            {t('onboarding.stepOf', {
              current: currentStepIndex + 1,
              total: totalSteps,
            })}
          </p>

          {/* Progress bar */}
          <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
              }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Chat messages and input */}
        <div
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <AgentMessage message={currentStep.agentMessage} />
              <UserInput
                step={currentStep}
                onSubmit={submitAnswer}
                error={error}
                isLoading={isSubmitting}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
