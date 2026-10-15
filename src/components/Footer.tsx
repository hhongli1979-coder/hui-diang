import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowRight, Globe, Lock, X, CheckCircle2 } from 'lucide-react';

interface LegalModalState {
  title: string;
  category: string;
  content: string[];
}

export const Footer: React.FC = () => {
  const { setIsPostModalOpen, setIsAdminModalOpen, setIsAiAssistantOpen } = useApp();
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [legalModal, setLegalModal] = useState<LegalModalState | null>(null);

  const openLegal = (title: string, category: string, content: string[]) => {
    setLegalModal({ title, category, content });
  };

  return (
    <footer className="bg-[#F2F4F0] border-t border-[#E5E7E1] text-[#777B76] text-xs">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12">
        
        {/* Brand Description & 18+ Adult Badge */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-8 border-b border-[#E5E7E1]">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-[#193C32] tracking-tight">AMICA</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#E8EFEA] text-[#193C32] border border-[#193C32]/20 shadow-xs">
                <ShieldAlert className="w-3.5 h-3.5 text-[#193C32]" />
                <span>SOLO PER ADULTI 18+</span>
              </span>
            </div>
            <p className="text-xs text-[#202522] leading-relaxed font-normal">
              AMICA è la piattaforma leader in Italia per annunci di accompagnatrici indipendenti. Esplora migliaia di annunci aggiornati in tutto il paese.
            </p>
          </div>

          {/* Quick CTA to Publish */}
          <div className="shrink-0">
            <button
              onClick={() => setIsPostModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <span>Pubblica Annuncio Ora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Columns Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
          
          {/* Col 1: Legale */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#202522] text-xs uppercase tracking-wider">
              Legale
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() =>
                    openLegal('Termini e Condizioni di Utilizzo', 'Legale', [
                      'L\'accesso e l\'utilizzo della piattaforma AMICA sono riservati esclusivamente ad utenti che abbiano compiuto il 18° anno di età.',
                      'Tutti gli annunci pubblicati sono inseriti da persone maggiorenni consenzienti e indipendenti.',
                      'È severamente vietata la pubblicazione di contenuti che coinvolgano minori, coercizione, sfruttamento o qualsiasi violazione della legge italiana ed europea.',
                      'AMICA opera nel pieno rispetto della normativa applicabile e coopera attivamente con le autorità competenti per la tutela della sicurezza pubblica.',
                    ])
                  }
                  className="hover:text-[#193C32] transition-colors text-left"
                >
                  Termini e condizioni
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openLegal('Informativa sulla Privacy (GDPR UE 2016/679)', 'Privacy', [
                      'I dati personali raccolti sono trattati in conformità al Regolamento Generale sulla Protezione dei Dati (GDPR UE 2016/679).',
                      'Non vendiamo né cediamo a terzi i recapiti telefonici, gli indirizzi email o le informazioni fornite dagli inserzionisti.',
                      'Le coordinate geografiche utilizzate per la funzionalità Radar sono approssimate a livello di quartiere e non memorizzano i movimenti in tempo reale.',
                      'Ogni utente ha diritto di richiedere la rettifica, la cancellazione immediata (diritto all\'oblio) o l\'esportazione dei propri dati.',
                    ])
                  }
                  className="hover:text-[#193C32] transition-colors text-left"
                >
                  Informativa sulla privacy
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openLegal('Politica sui Cookie', 'Cookie', [
                      'AMICA utilizza unicamente cookie tecnici essenziali necessari a garantire la navigazione, la sessione e la verifica della maggiore età.',
                      'Non vengono utilizzati cookie di profilazione invasiva di terze parti per tracciare gli utenti su siti esterni.',
                      'È possibile cancellare in qualsiasi momento le preferenze di navigazione attraverso le impostazioni del proprio browser.',
                    ])
                  }
                  className="hover:text-[#193C32] transition-colors text-left"
                >
                  Politica sui cookie
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Supporto */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#202522] text-xs uppercase tracking-wider">
              Supporto
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsAiAssistantOpen(true)}
                  className="hover:text-[#193C32] transition-colors text-left"
                >
                  Centro assistenza
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="hover:text-[#193C32] transition-colors text-left"
                >
                  Invia una segnalazione
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openLegal('Linee Guida sulla Sicurezza', 'Sicurezza', [
                      'Non effettuare mai pagamenti anticipati tramite ricariche prepagate, buoni regalo o canali non tracciabili.',
                      'Verifica sempre il badge "Profilo Verificato" con controllo documentale o fotografico.',
                      'In caso di comportamento scorretto o tentativo di frode, utilizza il pulsante di segnalazione presente in ogni scheda annuncio.',
                    ])
                  }
                  className="hover:text-[#193C32] transition-colors text-left"
                >
                  Sicurezza
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    openLegal('Come Segnalare una Truffa o Profilo Falso', 'Protezione Utenti', [
                      'Se identifichi un annuncio con foto rubate o recapiti fraudolenti, clicca sul pulsante "Segnala abuso" nella scheda.',
                      'Il nostro team di moderazione esamina le segnalazioni entro 2 ore operative ed applica l\'immediato blocco dell\'account.',
                      'In caso di violazioni gravi, le evidenze vengono trasmesse agli organi di polizia postale preposti.',
                    ])
                  }
                  className="hover:text-[#193C32] transition-colors text-left"
                >
                  Come segnalare una truffa
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Network */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#202522] text-xs uppercase tracking-wider">
              Network
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-[#202522] font-medium">Bakeca Incontri</span>
              </li>
              <li>
                <span className="text-[#202522] font-medium">Skokka Network</span>
              </li>
              <li>
                <span className="text-[#202522] font-medium">Portale Italia</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Paese & Visibilità */}
          <div className="space-y-3">
            <h4 className="font-bold text-[#202522] text-xs uppercase tracking-wider">
              Aumenta la tua visibilità
            </h4>
            <p className="text-xs text-[#777B76] leading-relaxed">
              Posiziona il tuo profilo in cima alla tua città e su mappa radar con AMICA Ads.
            </p>

            {/* Country selector */}
            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-[#202522] mb-1">
                Paese e Mercato:
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsCountryOpen(!isCountryOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522] font-semibold shadow-xs hover:border-[#193C32]/40 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none">🇮🇹</span>
                    <span>Italia</span>
                  </span>
                  <Globe className="w-3.5 h-3.5 text-[#777B76]" />
                </button>

                {isCountryOpen && (
                  <div
                    className="absolute bottom-full mb-1 left-0 right-0 bg-white border border-[#E5E7E1] rounded-xl shadow-lg p-1 z-20"
                    onMouseLeave={() => setIsCountryOpen(false)}
                  >
                    <div className="p-2 text-xs font-semibold text-[#193C32] bg-[#E8EFEA] rounded-lg flex items-center gap-2">
                      <span>🇮🇹</span>
                      <span>Italia (Attivo)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Discreet Admin Access */}
        <div className="pt-6 border-t border-[#E5E7E1] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#777B76]">
          <div>
            © {new Date().getFullYear()} AMICA Italia. Tutti i diritti riservati. Solo per adulti (18+).
          </div>

          <div className="flex items-center gap-4">
            {/* Discreet operational admin backend entrance for testing */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="text-[#777B76] hover:text-[#193C32] transition-colors flex items-center gap-1 font-medium"
              title="Accesso pannello gestionale e moderazione"
            >
              <Lock className="w-3 h-3 text-[#193C32]" />
              <span>Accesso Gestionale</span>
            </button>
            <span className="text-[#E5E7E1]">·</span>
            <span>Milano · Roma · Bologna · Firenze</span>
          </div>
        </div>

      </div>

      {/* Clean Legal & Safety Information Modal (Replaces window.alert) */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#E5E7E1] rounded-2xl max-w-lg w-full p-6 shadow-xl relative text-left">
            <button
              onClick={() => setLegalModal(null)}
              className="absolute top-4 right-4 p-1.5 text-[#777B76] hover:text-[#202522] rounded-lg hover:bg-[#F8F8F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[11px] font-bold text-[#193C32] uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#193C32]" />
              <span>{legalModal.category}</span>
            </div>

            <h3 className="text-base font-bold text-[#202522] mb-4">
              {legalModal.title}
            </h3>

            <div className="space-y-3 text-xs text-[#202522] leading-relaxed">
              {legalModal.content.map((paragraph, index) => (
                <p key={index} className="border-l-2 border-[#193C32]/30 pl-3 py-0.5">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E5E7E1] flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
