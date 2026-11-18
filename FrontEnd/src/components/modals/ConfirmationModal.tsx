import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ShieldCheck, HeartHandshake, X } from 'lucide-react';

export const ConfirmationModal: React.FC = () => {
  const { confirmationData, setConfirmationData } = useApp();

  if (!confirmationData) return null;

  const isIdea = confirmationData.type === 'idea';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-[#38B6FF]/30 text-center relative overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={() => setConfirmationData(null)}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Visual Icon */}
        <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg mb-5 ${
          isIdea
            ? 'bg-gradient-to-br from-[#FADB58] to-[#f5cb25] text-[#08233C]'
            : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
        }`}>
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-3 bg-[#08233C] text-[#FADB58]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#38B6FF]" />
          <span>{isIdea ? "Idée citoyenne enregistrée" : "Signalement pris en compte"}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-[#08233C] mb-3 leading-tight">
          {confirmationData.title}
        </h3>

        <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-normal">
          {confirmationData.message}
        </p>

        <div className="bg-[#EFF8FF] rounded-2xl p-4 border border-[#38B6FF]/30 mb-6 text-xs text-slate-700 flex items-start gap-3 text-left">
          <HeartHandshake className="w-5 h-5 text-[#38B6FF] flex-shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            La plateforme <strong>InnovSahel</strong> et les services municipaux vous remercient pour votre contribution active au bien-être de votre commune.
          </span>
        </div>

        <button
          id="confirmation-modal-close"
          onClick={() => setConfirmationData(null)}
          className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm bg-[#08233C] text-white hover:bg-[#0B3B60] transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Parfait, continuer ma navigation</span>
        </button>
      </div>
    </div>
  );
};
