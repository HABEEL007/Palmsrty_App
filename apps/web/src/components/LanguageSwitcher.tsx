/**
 * @file LanguageSwitcher.tsx
 * @description A premium, accessible language switcher component.
 * Allows users to toggle between English, Urdu, Arabic, and Hindi.
 * Handles both visual feedback and i18n logic.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Check, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ur', label: 'Urdu', native: 'اردو' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
];

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 glass border-white/5 bg-white/5 rounded-2xl group hover:border-primary-neon/30 transition-all pointer-events-auto"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Languages size={14} className="text-muted group-hover:text-primary-neon transition-colors" />
        <span className="text-[10px] font-bold text-white tracking-widest leading-none uppercase">
          {currentLang.code}
        </span>
        <ChevronDown 
          size={12} 
          className={`text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute top-12 right-0 w-48 glass border-white/10 bg-[#0B0F1A]/90 backdrop-blur-2xl rounded-2xl overflow-hidden shadow-2xl z-50 pointer-events-auto"
          >
            <div className="p-2 space-y-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    i18n.language === lang.code 
                      ? 'bg-primary/20 text-white' 
                      : 'hover:bg-white/5 text-muted hover:text-white'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-bold">{lang.label}</span>
                    <span className="text-[10px] opacity-60 font-medium">{lang.native}</span>
                  </div>
                  {i18n.language === lang.code && (
                    <Check size={14} className="text-primary-neon" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
