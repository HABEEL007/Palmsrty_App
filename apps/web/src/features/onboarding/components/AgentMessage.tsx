/**
 * @component AgentMessage
 * @description Animated AI agent speech bubble for the onboarding chat flow.
 * Typing animation reveals the message character by character for realism.
 */

import { motion } from 'framer-motion';

interface AgentMessageProps {
  /** The agent's message text to display */
  message: string;
}

/**
 * Chat-style agent message with animated entrance.
 */
export function AgentMessage({ message }: AgentMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-start gap-3"
    >
      {/* Agent avatar */}
      <div
        className="w-9 h-9 rounded-full bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-lg flex-shrink-0"
        aria-hidden="true"
      >
        🔮
      </div>

      {/* Message bubble */}
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
        <p className="text-white/90 text-sm leading-relaxed">{message}</p>
      </div>
    </motion.div>
  );
}
