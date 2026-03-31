/**
 * @file NavigationShell.tsx
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, History, User, Camera, Layers } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${active ? 'text-primary-neon scale-110' : 'text-muted hover:text-white'}`}
  >
    <div className={`relative p-2 rounded-xl ${active ? 'bg-primary/10' : 'bg-transparent'}`}>
       {icon}
       {active && <motion.div layoutId="nav-dot" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-neon rounded-full" />}
    </div>
    <span className="text-[10px] uppercase font-bold tracking-tighter">{label}</span>
  </button>
);

export const NavigationShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide nav on scanning or processing views for immersion
  const isHidden = ['/scan', '/processing'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background text-text overflow-x-hidden">
      {/* App Header (Logo) */}
      {!isHidden && (
        <header className="fixed top-0 inset-x-0 h-20 px-6 flex items-center justify-between z-40 bg-gradient-to-b from-background to-transparent pointer-events-none">
           <div className="flex items-center gap-2 pointer-events-auto cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-primary-neon rounded-lg flex items-center justify-center shadow-neon-primary">
                 <Layers size={18} className="text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tighter italic">PALMSTRY <span className="text-primary-neon">AI</span></span>
           </div>
           
           <div className="p-2 glass border-white/5 pointer-events-auto cursor-pointer">
              <User size={20} className="text-muted" />
           </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ${!isHidden ? 'pt-20 pb-28' : ''}`}>
        {children}
      </div>

      {/* Bottom Navigation */}
      {!isHidden && (
        <nav className="fixed bottom-6 inset-x-6 h-20 glass border-white/5 z-50 flex items-center justify-around px-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <NavItem 
             icon={<Home size={22} />} 
             label="Home" 
             path="/" 
             active={location.pathname === '/'} 
             onClick={() => navigate('/')} 
           />
           
           <NavItem 
             icon={<History size={22} />} 
             label="History" 
             path="/history" 
             active={location.pathname === '/history'} 
             onClick={() => navigate('/history')} 
           />

           {/* Central Scan Pulse */}
           <div className="relative -top-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/scan')}
                className="w-16 h-16 rounded-full bg-primary-neon flex items-center justify-center text-white shadow-neon-primary border-4 border-background"
              >
                 <Camera size={28} />
              </motion.button>
              <div className="absolute inset-0 rounded-full animate-ping bg-primary-neon/20 -z-10" />
           </div>

           <NavItem 
             icon={<Layers size={22} />} 
             label="Traits" 
             path="/traits" 
             active={location.pathname === '/traits'} 
             onClick={() => navigate('/traits')} 
           />

           <NavItem 
             icon={<User size={22} />} 
             label="Profile" 
             path="/profile" 
             active={location.pathname === '/profile'} 
             onClick={() => navigate('/profile')} 
           />
        </nav>
      )}
    </div>
  );
};
