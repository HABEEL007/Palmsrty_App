/**
 * @module i18n
 * @description Internationalization configuration for the Palmistry AI application.
 * Supports: English (en), Urdu (ur), Arabic (ar), Hindi (hi).
 * Auto-detects browser language and persists selection in localStorage.
 * Sets RTL document direction for Arabic and Urdu automatically.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';

/** Languages that require right-to-left text direction */
const RTL_LANGUAGES = ['ar', 'ur'] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ur: { translation: ur },
      ar: { translation: ar },
      hi: { translation: hi },
    },
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'palmistry_lang',
    },
  });

/**
 * Applies RTL or LTR document direction based on the active language.
 * Also sets the HTML lang attribute for SEO and screen readers.
 * @param lng - BCP 47 language code (e.g., 'ar', 'ur', 'en')
 */
function applyLanguageDirection(lng: string): void {
  const isRtl = (RTL_LANGUAGES as readonly string[]).includes(lng);
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
}

// Apply on language change
i18n.on('languageChanged', applyLanguageDirection);

// Apply on initial load
applyLanguageDirection(i18n.language);

export default i18n;
