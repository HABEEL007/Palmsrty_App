import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Button, Card, Typography } from '@palmistry/ui';
import { Camera, Zap, Brain, Layers, Star } from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const quickStats = [
    { label: t('home.stats.readings'), value: "12", icon: <Layers size={18} /> },
    { label: t('home.stats.accuracy'), value: "98%", icon: <Zap size={18} /> },
    { label: t('home.stats.insights'), value: "45", icon: <Brain size={18} /> },
  ];

  return (
    <main className="p-6 space-y-8 animate-in fade-in duration-700 max-w-2xl mx-auto">
      {/* Greeting Section */}
      <section className="space-y-2 mt-4">
        <Typography variant="caption" className="uppercase tracking-[0.3em] text-primary-neon font-bold">
           {t('home.welcome')}
        </Typography>
        <Typography variant="h1" className="text-4xl font-extrabold tracking-tighter leading-tight">
           <Trans i18nKey="home.headline">
              Your Destiny is <br/>
              <span className="text-secondary-glow italic">in your hands.</span>
           </Trans>
        </Typography>
      </section>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-3 gap-3">
        {quickStats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-4 flex flex-col items-center gap-1 border-white/5 active:scale-95 transition-transform"
          >
             <div className="text-primary-neon opacity-70 mb-1">{stat.icon}</div>
             <span className="text-xl font-bold tracking-tight">{stat.value}</span>
             <span className="text-[9px] uppercase font-bold text-muted">{stat.label}</span>
          </motion.div>
        ))}
      </section>

      {/* Call to Action Card */}
      <section>
        <Card variant="glass" isGlow className="p-0 relative overflow-hidden group border-primary/20">
           <div className="p-8 relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-secondary-glow text-xs font-bold uppercase tracking-widest">
                 <Star size={14} fill="currentColor" />
                 {t('home.premiumFeature')}
              </div>
              <Typography variant="h3" className="font-bold tracking-tight text-2xl">
                <Trans i18nKey="home.ctaTitle">Ready for a <br/>New Reading?</Trans>
              </Typography>
              <Typography variant="body" className="text-muted text-sm max-w-[220px] leading-relaxed">
                 {t('home.ctaBody')}
              </Typography>
              <Button 
                variant="primary" 
                className="w-full gap-3 neon-glow mt-2 h-14 text-base font-bold"
                onClick={() => navigate('/scan')}
              >
                 <Camera size={20} />
                 {t('home.ctaButton')}
              </Button>
           </div>
           
           {/* Decorative Elements */}
           <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
           <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Camera size={160} strokeWidth={0.5} />
           </div>
        </Card>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
         <div className="flex justify-between items-end">
            <Typography variant="h4" className="font-bold tracking-tight text-lg">{t('home.recentTitle')}</Typography>
            <Typography variant="caption" className="text-primary-neon font-bold cursor-pointer hover:underline">{t('home.viewAll')}</Typography>
         </div>
         
         <div className="space-y-3">
            {[
              { date: "Yesterday", type: "Career Path", img: "https://images.unsplash.com/photo-1542332213-9b5a5a3fab35" },
              { date: "3 Days ago", type: "Love & Harmony", img: "https://images.unsplash.com/photo-1510673422415-38c538ced987" }
            ].map((reading, i) => (
               <motion.div 
                 key={i} 
                 whileTap={{ scale: 0.98 }}
                 className="flex items-center gap-4 p-4 glass border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
               >
                  <div className="w-14 h-14 rounded-xl bg-surface border border-white/5 flex items-center justify-center overflow-hidden">
                     <img 
                       src={`${reading.img}?auto=format&fit=crop&q=80&w=100`} 
                       className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                       alt="past reading"
                     />
                  </div>
                  <div className="flex-1">
                     <Typography variant="body" className="font-bold text-sm">{reading.type}</Typography>
                     <Typography variant="caption" className="text-muted text-[10px]">{reading.date} • High Confidence</Typography>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-full text-primary-neon opacity-0 group-hover:opacity-100 transition-opacity">
                     <Zap size={14} />
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Pro Tip Banner */}
      <section className="p-5 glass border-accent/20 bg-accent/5 rounded-2xl">
         <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
               <Star size={18} fill="currentColor" />
            </div>
            <Typography variant="body" className="text-muted text-xs leading-tight">
               <span className="text-white font-bold block mb-1">{t('home.proTip')}</span>
               "{t('home.proTipText')}"
            </Typography>
         </div>
      </section>
      
      <div className="h-10" /> {/* Bottom Spacer */}
    </main>
  );
};
