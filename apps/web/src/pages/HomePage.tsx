/**
 * @file HomePage.tsx
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@palmistry/ui';
import { Terminal, Fingerprint, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const headline = "Reveal What Your Hands Say";

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      {/* Animated Headline */}
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight max-w-3xl">
        {headline.split(" ").map((word, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.8 }}
            className="inline-block mr-3 bg-gradient-to-r from-primary-neon to-secondary-glow bg-clip-text text-transparent"
          >
            {word}
          </motion.span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="text-lg md:text-xl text-muted mb-10 max-w-lg"
      >
        Your palm is a biological blueprint. Unlock the ancient secrets of your destiny with advanced AI vision.
      </motion.p>

      {/* Hero CTAs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="flex flex-wrap gap-4 justify-center"
      >
        <Button 
          variant="primary" 
          size="lg" 
          className="neon-glow"
          onClick={() => navigate('/scan')}
        >
          Scan Palm Now
        </Button>
        <Button variant="ghost" size="lg">
          Upload Photo
        </Button>
      </motion.div>

      {/* Features / How it works */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {[
          { icon: <Fingerprint />, title: "Precision Mapping", desc: "AI identifies major lines, mounts, and unique hand geometry." },
          { icon: <Terminal />, title: "Line Analysis", desc: "Depth readings of Heart, Head, and Life lines for future insights." },
          { icon: <Sparkles />, title: "Personal Guidance", desc: "Detailed personality and career advice based on palmistry." },
        ].map((feat, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="glass p-8 text-left"
          >
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary-neon mb-4">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
            <p className="text-muted">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
};
