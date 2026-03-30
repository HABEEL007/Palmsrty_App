import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show after 30 seconds on site
      setTimeout(() => setShowPrompt(true), 30000);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50
                     bg-[#1a1f2e] border border-primary-neon/30 
                     rounded-2xl p-4 backdrop-blur-xl
                     shadow-lg"
        >
          <p className="text-white font-medium">
            📱 Install Palmistry AI on your phone
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Access offline, faster loading, fullscreen experience
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-primary-neon text-white 
                         rounded-xl py-2 font-medium
                         shadow-glow hover:shadow-lg
                         transition-all duration-200"
            >
              Install Free
            </button>
            <button
              onClick={() => setShowPrompt(false)}
              className="px-4 text-gray-400"
            >
              Later
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
