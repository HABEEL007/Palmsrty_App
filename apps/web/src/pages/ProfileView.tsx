/**
 * @file ProfileView.tsx
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../features/auth/hooks/useAuth';
import { Typography, Card, Button } from '@palmistry/ui';
import { User, Mail, Shield, LogOut, Settings, Bell, HelpCircle } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-700 pb-32">
       {/* User Profile Info */}
       <header className="flex flex-col items-center text-center gap-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
             <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-neon to-secondary-glow p-1">
                <div className="w-full h-full rounded-full bg-background overflow-hidden flex items-center justify-center">
                   {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName || 'Seeker'} className="w-full h-full object-cover" />
                   ) : (
                      <User size={40} className="text-muted" />
                   )}
                </div>
             </div>
             <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary-glow rounded-full flex items-center justify-center border-2 border-background">
                <Shield size={12} className="text-black" />
             </div>
          </motion.div>

          <div className="space-y-1">
             <Typography variant="h2" className="text-2xl font-bold tracking-tight text-white capitalize">
                {user.fullName || 'Seeker'}
             </Typography>
             <div className="flex items-center gap-2 text-muted text-sm justify-center">
                <Mail size={12} />
                {user.email}
             </div>
          </div>
       </header>

       {/* Fast Stats Card */}
       <section className="grid grid-cols-2 gap-4">
           <Card variant="glass" className="p-4 border-white/5 flex flex-col items-center gap-1">
               <Typography variant="caption" className="text-secondary-glow uppercase font-bold tracking-widest text-[9px]">Membership</Typography>
               <Typography variant="body" className="font-bold text-white uppercase tracking-tight">Premium Pro</Typography>
           </Card>
           <Card variant="glass" className="p-4 border-white/5 flex flex-col items-center gap-1">
               <Typography variant="caption" className="text-primary-neon uppercase font-bold tracking-widest text-[9px]">Status</Typography>
               <Typography variant="body" className="font-bold text-white uppercase tracking-tight">Verified</Typography>
           </Card>
       </section>

       {/* Settings Navigation */}
       <section className="space-y-3">
          <Typography variant="h4" className="font-bold tracking-tight text-lg mb-4">Settings</Typography>
          
          {[
            { icon: <Bell size={20} />, label: "Notifications", sub: "Control alerts & updates" },
            { icon: <Settings size={20} />, label: "Preferences", sub: "Units, theme, and language" },
            { icon: <HelpCircle size={20} />, label: "Support", sub: "F.A.Q & Contact us" }
          ].map((item, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               className="flex items-center gap-4 p-4 glass border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
             >
                <div className="text-muted group-hover:text-primary-neon transition-colors">
                   {item.icon}
                </div>
                <div className="flex-1">
                   <Typography variant="body" className="font-bold text-sm text-white">{item.label}</Typography>
                   <Typography variant="caption" className="text-muted text-[10px] uppercase font-bold tracking-tighter opacity-60">
                      {item.sub}
                   </Typography>
                </div>
             </motion.div>
          ))}
       </section>

       {/* Actions */}
       <section className="pt-4 space-y-4">
          <Button 
            variant="ghost" 
            className="w-full gap-3 h-14 bg-red-500/5 hover:bg-red-500/10 text-red-500 border-red-500/20"
            onClick={signOut}
          >
             <LogOut size={20} />
             Log Out Account
          </Button>

          <Typography variant="caption" className="text-center block text-muted text-[10px] uppercase tracking-widest opacity-40">
             Palmistry AI v1.0.0 Stable Build
          </Typography>
       </section>
    </main>
  );
};
