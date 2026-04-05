/**
 * @file HistoryView.tsx
 * @description Past readings history screen
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../features/auth/hooks/useAuth';

interface HistoryItem {
  id: string;
  hand_shape: string;
  created_at: string;
  analysis_result: any;
}

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const ITEM = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export const HistoryView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [readings, setReadings] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('readings')
      .select('id, created_at, analysis_result')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setReadings(data ?? []);
        setIsLoading(false);
      });
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col px-5 py-6 relative overflow-hidden"
      style={{ maxWidth: 480, margin: '0 auto' }}>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)' }}/>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
          ← Back
        </motion.button>
        <h2 className="text-lg font-bold text-slate-200">Past Readings</h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="w-8 h-8 rounded-full"
            style={{ border: '2px solid rgba(124,58,237,0.2)', borderTopColor: '#7C3AED', animation: 'spin 0.9s linear infinite' }}/>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : readings.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10">
          <div className="text-5xl mb-4">🖐️</div>
          <p className="text-slate-400 font-medium mb-2">No readings yet</p>
          <p className="text-sm text-gray-600 mb-6">Start your first palm reading today</p>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => navigate('/scan')}
            className="px-6 py-3 rounded-2xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#6D28D9)' }}>
            Scan My Palm
          </motion.button>
        </div>
      ) : (
        <motion.div variants={STAGGER} initial="hidden" animate="visible"
          className="flex flex-col gap-3 relative z-10">
          {readings.map(reading => (
            <motion.div key={reading.id} variants={ITEM}>
              <div className="rounded-2xl px-4 py-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔮</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-300">
                        {reading.analysis_result?.handShape ?? 'Palm Reading'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(reading.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600">›</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};
