/**
 * @component AgentMessage
 * @description Renders a conversational chat bubble representing the AI onboarding agent.
 * Features specialized typography and premium glass styling.
 */

import React from 'react';
import { motion } from 'framer-motion';

interface AgentMessageProps {
  /** The message text to display in the bubble */
  message: string;
}

/**
 * Message bubble with specialized animation entrance.
 */
export const AgentMessage: React.FC<AgentMessageProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-start space-y-2 max-w-[85%]"
    >
      {/* Agent Avatar Circle */}
      <div 
        className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 
                   flex items-center justify-center text-lg shadow-sm"
        aria-hidden="true"
      >
        ✨
      </div>

      {/* Message Bubble */}
      <div 
        className="px-5 py-4 bg-white/5 border border-white/10 rounded-2xl 
                   rounded-tl-none shadow-xl backdrop-blur-md"
      >
        <p className="text-white text-sm font-medium leading-relaxed tracking-tight">
          {message}
        </p>
      </div>
    </motion.div>
  );
};
