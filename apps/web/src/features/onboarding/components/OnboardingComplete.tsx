/**
 * @component OnboardingComplete
 * @description Success screen displayed after all onboarding steps are finished.
 * Provides animated confirmation and CTA to start first palm reading.
 */

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Celebratory completion screen shown at the end of onboarding.
 * Redirects user to the palm scan flow.
 */
export function OnboardingComplete() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center space-y-6 py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
        className="text-7xl"
        role="img"
        aria-label="Stars emoji indicating success"
      >
        🌟
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-white text-2xl font-bold font-[Outfit]">
          You&apos;re all set!
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
          Your profile is ready. Let&apos;s reveal what your palm lines say about your destiny.
        </p>
      </div>

      <motion.button
        id="start-reading-btn"
        onClick={() => navigate('/scan')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="
          bg-gradient-to-r from-purple-600 to-indigo-600
          hover:from-purple-500 hover:to-indigo-500
          text-white font-semibold py-4 px-8 rounded-2xl
          shadow-lg shadow-purple-900/40
          transition-all duration-200
          min-h-[44px]
        "
      >
        {t('capture.title')} →
      </motion.button>
    </motion.div>
  );
}
