/**
 * @file ResultView.tsx
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, Typography, Button } from '@palmistry/ui';
import { Share2, FileDown, Plus, Heart, Brain, Zap, Shield, HelpCircle } from 'lucide-react';

export const ResultView: React.FC = () => {
  const cards = [
    { title: "Personality", icon: <Zap className="text-secondary-glow" />, text: "You possess a dynamic and adaptable personality. Your curiosity drives you toward new experiences, making you a natural explorer." },
    { title: "Career", icon: <Shield className="text-primary-neon" />, text: "Your career path is likely to be marked by leadership and innovation. You thrive in environments that challenge your analytical mind." },
    { title: "Love", icon: <Heart className="text-red-500" />, text: "You value emotional depth and sincere connections. Your ability to empathize creates strong bonds with those who share your values." },
    { title: "Health", icon: <Zap className="text-green-500" />, text: "Your energy levels are generally high, but ensure you manage stress through creative outlets or physical movement." },
    { title: "Advice", icon: <HelpCircle className="text-accent" />, text: "Trust your intuition when facing major crossroads. Your hands suggest that your first instinct is often aligned with your true path." },
  ];

  return (
    <main className="min-h-screen pt-20 pb-32 px-6">
      {/* Annotated Palm Image */}
      <div className="relative w-full max-w-md mx-auto aspect-[4/5] glass border-secondary-glow/30 mb-8 overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542332213-9b5a5a3fab35?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center grayscale opacity-40 group-hover:grayscale-0 transition-all duration-700" />
         
         {/* Line Annotations (Heart Line example) */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 120">
            <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 2, delay: 1 }}
               d="M20 50 Q 50 30, 80 50" 
               stroke="red" 
               strokeWidth="0.5" 
               fill="none" 
               className="drop-shadow-[0_0_5px_red]"
            />
            <motion.path 
               initial={{ pathLength: 0 }}
               animate={{ pathLength: 1 }}
               transition={{ duration: 2, delay: 1.5 }}
               d="M30 90 Q 50 40, 70 90" 
               stroke="#06B6D4" 
               strokeWidth="0.5" 
               fill="none" 
               className="drop-shadow-[0_0_5px_#06B6D4]"
            />
         </svg>
         
         <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs font-mono tracking-tighter border border-white/10 uppercase">
            Captured: 30 Mar 2026
         </div>
      </div>

      {/* Result Cards Staggered */}
      <div className="max-w-xl mx-auto space-y-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 + 0.5, duration: 0.6 }}
          >
            <Card variant="glass" isGlow className="border-secondary-glow/10 hover:border-secondary-glow/40">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                  {card.icon}
                </div>
                <Typography variant="h4" className="font-bold">{card.title}</Typography>
              </div>
              <Typography variant="body" className="text-muted leading-relaxed">
                {card.text}
              </Typography>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Meta Ad Banner Mockup */}
      <div className="max-w-xl mx-auto mt-8 h-24 glass border-white/5 flex items-center justify-center text-muted font-mono text-xs uppercase tracking-widest opacity-50">
         Advertisement
      </div>

      {/* Bottom Sticky Bar */}
      <div className="fixed bottom-0 inset-x-0 h-24 bg-background/80 backdrop-blur-xl border-t border-white/10 px-6 flex items-center justify-between z-50">
         <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 size={18} />
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <FileDown size={18} />
            </Button>
         </div>
         <Button variant="primary" className="gap-2 neon-glow">
            <Plus size={18} />
            New Reading
         </Button>
      </div>
    </main>
  );
};
