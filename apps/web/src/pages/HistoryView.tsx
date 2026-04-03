/**
 * @file HistoryView.tsx
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Typography, Card, Button } from '@palmistry/ui';
import { Calendar, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuth } from '../features/auth/hooks/useAuth';

interface ReadingItem {
  id: string;
  created_at: string;
  analysis_result: any;
  image_url: string;
}

export const HistoryView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [readings, setReadings] = useState<ReadingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const response = await apiClient.get(`/api/user/readings/${user.id}`);
        if (response.data.success) {
          setReadings(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary-neon w-10 h-10" />
        <Typography variant="caption" className="uppercase tracking-widest text-muted">
           Accessing your destiny logs...
        </Typography>
      </div>
    );
  }

  return (
    <main className="p-6 space-y-6 max-w-2xl mx-auto pb-32">
      <section className="space-y-1">
        <Typography variant="h2" className="text-3xl font-extrabold tracking-tighter">
           Past <span className="text-secondary-glow">Insights</span>
        </Typography>
        <Typography variant="body" className="text-muted text-sm italic">
           The universe remembers your path. Review your journey below.
        </Typography>
      </section>

      {readings.length === 0 ? (
        <div className="pt-20 text-center space-y-6">
           <div className="glass p-12 inline-block border-white/5 opacity-50">
              <Calendar size={48} className="mx-auto mb-4 text-muted" />
              <Typography variant="body">No readings found yet.</Typography>
           </div>
           <Button variant="primary" onClick={() => navigate('/scan')} className="mx-auto neon-glow">
              Start Your First Reading
           </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {readings.map((reading, i) => (
            <motion.div
              key={reading.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                variant="glass" 
                className="p-4 border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
                onClick={() => navigate(`/reading/result`, { state: { result: reading.analysis_result, imageUrl: reading.image_url } })}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-surface border border-white/5 overflow-hidden flex-shrink-0">
                    <img 
                      src={reading.image_url} 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                      alt="reading thumbnail"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Typography variant="body" className="font-bold truncate">
                       {reading.analysis_result.handShape.toUpperCase()} Hand Analysis
                    </Typography>
                    <div className="flex items-center gap-2 text-muted text-xs mt-1">
                       <Calendar size={12} />
                       {new Date(reading.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                     <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary-neon opacity-0 group-hover:opacity-100 transition-all">
                        <ChevronRight size={18} />
                     </div>
                     <div className="flex items-center gap-1 text-[10px] font-bold text-secondary-glow bg-secondary/5 px-2 py-0.5 rounded-full border border-secondary/10">
                        <Zap size={10} />
                        AI 1.5
                     </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
};
