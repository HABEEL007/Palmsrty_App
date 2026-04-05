/**
 * @file i18n/index.ts
 * @description Internationalization configuration for Palmistry AI.
 * Supports: English (default), Urdu, Arabic, Hindi.
 * Features: Automatic language detection, persistent storage, and RTL/LTR switching.
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ur from './locales/ur.json';
import ar from './locales/ar.json';
import hi from './locales/hi.json';

/** Initialization and plugin orchestration */
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
      escapeValue: false // React already escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

/**
 * Global Side-effect: Synchronize HTML accessibility attributes with active language.
 * Handles RTL (Right-to-Left) direction for Arabic and Urdu.
 */
i18n.on('languageChanged', (lng) => {
  const rtlLanguages = ['ar', 'ur'];
  document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
