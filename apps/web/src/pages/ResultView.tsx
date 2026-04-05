import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Share2, Download, RefreshCw, ChevronRight, Star } from 'lucide-react';
import { useReadingStore } from '../store/reading-store';
import { useAuth } from '../features/auth/hooks/useAuth';

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const ITEM = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } },
};

export const ResultView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { readingResult, clearReading } = useReadingStore();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const sections = readingResult?.sections ?? [];

  const toggleSection = useCallback((id: string) => {
    setExpanded(prev => prev === id ? null : id);
  }, []);

  const handleNewReading = () => {
    clearReading();
    navigate('/scan', { replace: true });
  };

  /** 📂 Share result using native OS API */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Palmistry AI Reading',
          text: `Just got my future revealed by Palmistry AI! My hand shape is ${readingResult?.handShape}. Check yours!`,
          url: window.location.origin
        });
      } catch (err) {
        console.error('SHARE_FAILED:', err);
      }
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  /** 📄 Export Premium PDF */
  const handleExportPDF = () => {
    setIsExporting(true);
    const doc = new jsPDF();
    const title = `Destiny Map: ${user?.fullName || 'Mystic Traveler'}`;
    const date = new Date().toLocaleDateString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("PALMSTRY AI - REPORT", 20, 20);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(title, 20, 30);
    doc.text(`Generated on: ${date}`, 20, 37);

    let y = 50;
    sections.forEach(s => {
      doc.setFont("helvetica", "bold");
      doc.text(`${s.label.toUpperCase()} (${s.score}%)`, 20, y);
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(s.text, 170);
      doc.text(lines, 20, y + 7);
      y += (lines.length * 7) + 15;
    });

    doc.save(`Palmistry_Reading_${user?.fullName || 'User'}.pdf`);
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <div className="max-w-md mx-auto px-6 pt-10 pb-32 relative">
        
        {/* Mystic Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Header Branding */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-xl">
              🔮
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Your Destiny</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{readingResult?.handShape || 'Ancient Soul'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase">
              AI ANALYZED
            </div>
          </div>
        </motion.div>

        {/* Result Cards */}
        <motion.div variants={STAGGER} initial="hidden" animate="visible" className="space-y-4">
          {sections.map((section: any) => (
            <motion.div key={section.id} variants={ITEM}>
              <button 
                onClick={() => toggleSection(section.id)}
                className={`w-full text-left p-5 rounded-3xl transition-all duration-300 group
                  ${expanded === section.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'} border`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#0F1423]" style={{ color: section.color }}>
                       <Star size={16} fill={section.color} className="opacity-80" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wide text-gray-200">
                      {section.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-bold" style={{ color: section.color }}>{section.score}%</span>
                    <ChevronRight size={16} className={`text-gray-600 transform transition-transform ${expanded === section.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Text Content */}
                <p className={`text-sm text-gray-400 leading-relaxed transition-all duration-300 ${expanded === section.id ? '' : 'line-clamp-2 opacity-60'}`}>
                  {section.text}
                </p>

                {/* Score Bar */}
                <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${section.score}%` }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${section.color}, ${section.fillColor})` }}
                  />
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="mt-8 p-6 rounded-[32px] bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 text-center">
          <p className="text-sm text-purple-200/80 mb-4 block">
            Unlock deeper spiritual insights with our premium version coming soon.
          </p>
          <span className="text-[10px] font-bold uppercase text-purple-400 tracking-[0.2em] animate-pulse">PRO VERSION SOON</span>
        </motion.div>

      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <div className="max-w-md mx-auto glass p-4 rounded-[40px] flex gap-3 shadow-2xl shadow-black/80">
          <button 
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-[#0B0F1A] py-4 rounded-3xl font-bold text-sm active:scale-95 transition-transform"
          >
            <Share2 size={18} /> Share
          </button>
          <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-shrink-0 w-16 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/5 rounded-3xl active:scale-90 transition-all disabled:opacity-50"
          >
            {isExporting ? <RefreshCw className="animate-spin" size={20} /> : <Download size={20} />}
          </button>
          <button 
            onClick={handleNewReading}
            className="flex-shrink-0 w-16 flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/5 rounded-3xl active:scale-90 transition-all"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
