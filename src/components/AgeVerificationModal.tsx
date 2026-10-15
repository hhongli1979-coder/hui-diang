import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, CheckCircle2, Lock } from 'lucide-react';

export const AgeVerificationModal: React.FC = () => {
  const { isAgeVerified, verifyAge } = useApp();

  if (isAgeVerified) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white border border-[#E5E7E1] rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Shield Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#E8EFEA] border border-[#193C32]/20 text-[#193C32] flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        {/* Warning Title */}
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#193C32] bg-[#E8EFEA] px-3 py-1 rounded-full">
            Avviso ai sensi della legge italiana (D.Lgs. 70/2003)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#202522] mt-3">
            Accesso Riservato ad un Pubblico Adulto (18+)
          </h2>
        </div>

        {/* Disclaimer text */}
        <p className="text-xs text-[#777B76] leading-relaxed text-justify">
          Il sito <strong className="text-[#202522]">AMICA</strong> ospita annunci personali per adulti, incontri e servizi benessere inseriti da utenti e inserzionisti autonomi. Proseguendo nella navigazione, dichiari sotto la tua personale responsabilità di avere almeno <strong>18 anni compiuti</strong> e di acconsentire alla visione di contenuti riservati a persone maggiorenni.
        </p>

        <div className="p-3.5 bg-[#F8F8F5] rounded-2xl border border-[#E5E7E1] text-[11px] text-[#777B76] flex items-start gap-2.5 text-left">
          <Lock className="w-4 h-4 text-[#193C32] shrink-0 mt-0.5" />
          <span>
            Rispettiamo la tua privacy: utilizziamo cookie tecnici essenziali per ricordare il tuo consenso nel rispetto del Regolamento Europeo GDPR (UE 2016/679). Nessun dato sensibile viene ceduto a terzi.
          </span>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            onClick={verifyAge}
            className="flex-1 py-3 px-5 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Ho più di 18 Anni ed Accetto</span>
          </button>

          <a
            href="https://www.google.it"
            className="py-3 px-5 bg-[#F8F8F5] hover:bg-[#E8EFEA] text-[#777B76] hover:text-[#202522] font-semibold text-xs rounded-xl border border-[#E5E7E1] transition-colors text-center"
          >
            Esci dal Sito
          </a>
        </div>
      </div>
    </div>
  );
};
