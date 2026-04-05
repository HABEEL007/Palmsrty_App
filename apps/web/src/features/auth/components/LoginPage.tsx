import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react';

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const ITEM = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const LoginPage: React.FC = () => {
  const { signIn, signUp, signInEmail, isLoading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (isSignUp) {
      await signUp(email, password);
    } else {
      await signInEmail(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-5 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[5%] right-[-10%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />

      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm relative z-10"
      >
        <motion.div variants={ITEM} className="text-center mb-8">
          <div className="w-18 h-18 rounded-2xl flex items-center justify-center mx-auto mb-5 text-4xl shadow-[0_0_20px_rgba(124,58,237,0.3)]"
            style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', borderRadius: 20 }}>
            🔮
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight mb-2">Palmistry AI</h1>
          <p className="text-sm text-gray-500 leading-relaxed uppercase tracking-widest">Discover Your Future</p>
        </motion.div>

        <motion.div
          variants={ITEM}
          className="rounded-3xl p-8 glass shadow-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'login'}
              initial={{ opacity: 0, x: isSignUp ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignUp ? -20 : 20 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-slate-100 text-xl font-bold mb-6 flex items-center gap-2">
                {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>

              <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 transition-all text-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 transition-all text-sm"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Continue')}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#141827] px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
             <button
                onClick={() => signIn('google')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <img src="/icons/google.svg" alt="G" className="w-4 h-4" />
                <span className="text-slate-300 text-sm font-medium">Google</span>
             </button>
             <button
                onClick={() => signIn('apple')}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <img src="/icons/apple.svg" alt="A" className="w-4 h-4" />
                <span className="text-slate-300 text-sm font-medium">Apple</span>
             </button>
          </div>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-sm text-gray-500 hover:text-white transition-colors"
          >
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </motion.div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-400 text-xs text-center mt-6 p-4 bg-red-400/10 rounded-xl border border-red-400/20">
            {error.message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
