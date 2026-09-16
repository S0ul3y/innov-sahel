import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, HeartHandshake, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ConfirmationModal: React.FC = () => {
  const { confirmationData, setConfirmationData } = useApp();

  if (!confirmationData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-[#FADB58] text-center relative overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => setConfirmationData(null)}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Visual Icon */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#FADB58] to-[#f5cb25] flex items-center justify-center shadow-lg mb-5 rotate-2">
            <CheckCircle2 className="w-10 h-10 text-[#08233C]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-[#08233C] mb-3 leading-tight">
            {confirmationData.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-medium">
            {confirmationData.message}
          </p>

          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-6 text-xs text-slate-600 flex items-center gap-2 text-left">
            <HeartHandshake className="w-5 h-5 text-[#38B6FF] flex-shrink-0" />
            <span>
              La plateforme <strong>InnovSahel</strong> remercie chaque citoyen pour sa contribution active au développement de notre capitale.
            </span>
          </div>

          <button
            id="confirmation-modal-close"
            onClick={() => setConfirmationData(null)}
            className="w-full py-3.5 px-6 rounded-xl font-bold bg-[#0B3B60] text-white hover:bg-[#08233C] transition-all shadow-md active:scale-98 cursor-pointer"
          >
            Compris, continuer ma visite
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
