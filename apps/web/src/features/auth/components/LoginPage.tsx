/**
 * @component LoginPage
 * @description Production login page with Google and Apple OAuth providers.
 * Design: Dark glassmorphism theme with staggered entrance animations.
 * Accessibility: WCAG 2.1 AA compliant — keyboard navigable, ARIA labels present.
 */

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { AuthButton } from './AuthButton';

/** Framer Motion stagger animation variants for entrance sequence */
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  },
} as const;

/**
 * Primary login page for unauthenticated users.
 * Provides Google and Apple OAuth entry points with loading and error states.
 */
export function LoginPage() {
  const { signIn, isLoading, error } = useAuth();
  const { t } = useTranslation();

  return (
    <main
      className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-4"
      aria-label="Login page"
    >
      {/* Ambient glow background — decorative only */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <motion.div
        variants={ANIMATION_VARIANTS.container}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-sm"
      >
        {/* Brand header */}
        <motion.div variants={ANIMATION_VARIANTS.item} className="text-center mb-8">
          <div className="text-6xl mb-4" role="img" aria-label="Crystal ball emoji">
            🔮
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-[Outfit]">
            {t('app.name')}
          </h1>
          <p className="text-gray-400 mt-2 text-sm">{t('app.tagline')}</p>
        </motion.div>

        {/* Auth card */}
        <motion.div
          variants={ANIMATION_VARIANTS.item}
          className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl"
        >
          <h2 className="text-white text-xl font-semibold mb-6 text-center">
            {t('auth.welcomeBack')}
          </h2>

          <div className="space-y-3" role="group" aria-label="Sign in options">
            <AuthButton
              provider="google"
              label={t('auth.continueWithGoogle')}
              icon="/icons/google.svg"
              onClick={() => signIn('google')}
              isLoading={isLoading}
            />
            <AuthButton
              provider="apple"
              label={t('auth.continueWithApple')}
              icon="/icons/apple.svg"
              onClick={() => signIn('apple')}
              isLoading={isLoading}
            />
          </div>

          {/* Error state */}
          {error && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-sm text-center mt-4"
            >
              {t('errors.authFailed')}
            </motion.p>
          )}

          <p className="text-gray-500 text-xs text-center mt-6 leading-relaxed">
            {t('auth.termsNote')}
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}
