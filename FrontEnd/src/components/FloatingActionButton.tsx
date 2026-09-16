import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export const FloatingActionButton: React.FC = () => {
  const { setActiveModal } = useApp();

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 lg:right-8 z-30">
      <motion.button
        id="fab-report-problem"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setActiveModal('problem')}
        className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all border-2 border-white/40 focus:outline-none focus:ring-4 focus:ring-amber-300/50 cursor-pointer"
        aria-label="Signaler un problème dans ma commune"
      >
        <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-white" />
        </span>
        <span className="text-xs sm:text-sm whitespace-nowrap drop-shadow-xs">
          Signaler un problème
        </span>
      </motion.button>
    </div>
  );
};
