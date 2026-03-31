/**
 * @file ResultView.tsx
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import type { PalmAnalysisResult } from '@palmistry/types';
import { Card, Typography, Button } from '@palmistry/ui';
import { Share2, FileDown, Plus, Heart, Zap, Shield, HelpCircle } from 'lucide-react';

export const ResultView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as PalmAnalysisResult;
  const imageUrl = location.state?.imageUrl;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div className="glass p-8 space-y-4">
          <Typography variant="body">No analysis results found.</Typography>
          <Button variant="primary" onClick={() => navigate('/scan')}>Go Back to Scan</Button>
        </div>
      </div>
    );
  }

  const cards = [
    { title: "Personality", icon: <Zap className="text-secondary-glow" />, text: result.personality.traits.join(", ") + ". " + result.personality.strengths.join(", ") },
    { title: "Career", icon: <Shield className="text-primary-neon" />, text: result.career.suitability + ": " + result.career.advice },
    { title: "Love", icon: <Heart className="text-red-500" />, text: result.relationships.approach + ". " + result.relationships.advice },
    { title: "Health", icon: <Zap className="text-green-500" />, text: result.health.vitality + ". " + (result.health.concerns || "No major concerns.") },
    { title: "Expert Advice", icon: <HelpCircle className="text-accent" />, text: result.advice },
  ];

  return (
    <main className="min-h-screen pt-20 pb-32 px-6">
      {/* Annotated Palm Image */}
      <div className="relative w-full max-w-md mx-auto aspect-[4/5] glass border-secondary-glow/30 mb-8 overflow-hidden group">
         <div 
           className="absolute inset-0 bg-cover bg-center grayscale-50 opacity-80 group-hover:grayscale-0 transition-all duration-700" 
           style={{ backgroundImage: `url(${imageUrl})` }}
         />
         
         {/* Dynamic SVG Line Annotations */}
         <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 120">
             {/* Heart Line (Red) */}
             <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 1 }}
                d="M20 50 Q 50 25, 80 45" 
                stroke="#FF3B30" 
                strokeWidth={result.majorLines.heartLine.toLowerCase().includes('deep') ? "0.8" : "0.4"} 
                strokeDasharray={result.majorLines.heartLine.toLowerCase().includes('faded') ? "2 1" : "0"}
                fill="none" 
                className="drop-shadow-[0_0_8px_#FF3B30]"
             />
             
             {/* Head Line (Cyan) */}
             <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
                d="M25 65 Q 50 60, 75 75" 
                stroke="#06B6D4" 
                strokeWidth={result.majorLines.headLine.toLowerCase().includes('straight') ? "0.6" : "0.4"} 
                fill="none" 
                className="drop-shadow-[0_0_8px_#06B6D4]"
             />

             {/* Life Line (Gold) */}
             <motion.path 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: 2 }}
                d="M35 110 Q 50 40, 75 100" 
                stroke="#F59E0B" 
                strokeWidth={result.majorLines.lifeLine.toLowerCase().includes('strong') ? "0.8" : "0.4"} 
                fill="none" 
                className="drop-shadow-[0_0_8px_#F59E0B]"
             />
          </svg>
         
         {/* Mount Pulsing Points */}
         <div className="absolute inset-0 pointer-events-none">
            {/* Apollo Mount Example */}
            <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute top-[35%] right-[25%] w-3 h-3 bg-secondary-glow rounded-full shadow-neon-secondary"
            />
            <div className="absolute top-[35%] right-[20%] text-[8px] font-bold text-secondary-glow opacity-60">APOLLO</div>
         </div>

         <div className="absolute bottom-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs font-mono tracking-tighter border border-white/10 uppercase">
            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
         </div>
      </div>

      {/* Result Cards Staggered */}
      <div className="max-w-xl mx-auto space-y-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 + 2.5, duration: 0.6 }}
          >
            <Card variant="glass" isGlow className="border-secondary-glow/10 hover:border-secondary-glow/40">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center">
                  {card.icon}
                </div>
                <Typography variant="h4" className="font-bold tracking-tight">{card.title}</Typography>
              </div>
              <Typography variant="body" className="text-muted leading-relaxed text-sm">
                {card.text}
              </Typography>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Meta Ad Banner Mockup */}
      <div className="max-w-xl mx-auto mt-8 h-24 glass border-white/5 flex items-center justify-center text-muted font-mono text-[10px] uppercase tracking-[0.4em] opacity-30">
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
         <Button variant="primary" className="gap-2 neon-glow" onClick={() => navigate('/scan')}>
            <Plus size={18} />
            New Reading
         </Button>
      </div>
    </main>
  );
};
