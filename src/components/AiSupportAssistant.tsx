import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Bot, Send, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiSupportAssistant: React.FC = () => {
  const { isAiAssistantOpen, setIsAiAssistantOpen, selectedCity } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Ciao! Sono l'assistente virtuale di AMICA. Posso aiutarti a trovare annunci a ${selectedCity.name}, spiegarti come pubblicare un'inserzione in modo sicuro, o mostrarti come prenotare una seduta in un centro benessere. Come posso esserti utile?`,
      timestamp: 'Adesso',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isAiAssistantOpen) return null;

  const quickQuestions = [
    'Come funziona la ricerca per raggio GPS?',
    'Come pubblicare un annuncio verificato?',
    'Come prenotare un massaggio in una SPA?',
    'Quali sono le regole di sicurezza e privacy?',
  ];

  const handleSend = (userQuery: string) => {
    if (!userQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: userQuery.trim(),
      timestamp: 'Adesso',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = userQuery.toLowerCase();

      if (q.includes('gps') || q.includes('raggio') || q.includes('distanza') || q.includes('mappa')) {
        reply = `Per cercare con il GPS, premi il pulsante "Vicino" o attiva la vista "Vicino a te". Il sistema calcolerà la distanza reale in chilometri tramite formula geodetica di Haversine (1, 5, 10, 25 o 50 km). I tuoi dati di posizione non vengono condivisi con terzi.`;
      } else if (q.includes('pubblica') || q.includes('annuncio') || q.includes('inserisci')) {
        reply = `Per pubblicare, clicca su "Pubblica" in alto a destra. Puoi scegliere la categoria, inserire fotografie, contatti e persino usare l'assistente AI per comporre automaticamente un testo curato ed elegante.`;
      } else if (q.includes('massaggi') || q.includes('spa') || q.includes('prenota')) {
        reply = `Nella sezione "Massaggi & SPA" trovi i centri benessere verificati con listino prezzi ufficiale. Cliccando su "Richiedi Prenotazione", puoi indicare data e orario: il centro riceverà la tua richiesta per concordare la seduta.`;
      } else if (q.includes('sicurezza') || q.includes('segnala') || q.includes('privacy') || q.includes('truffa')) {
        reply = `AMICA rispetta la normativa italiana per i servizi riservati a maggiorenni (18+) e il regolamento GDPR europeo. Se individui un annuncio scorretto o sospetto, usa il tasto "Segnala" per l'immediata revisione del nostro team.`;
      } else {
        reply = `Grazie per la tua domanda! Puoi esplorare la bacheca di ${selectedCity.name} usando la barra di ricerca o passando alla visualizzazione Mappa. Per contattare l'amministrazione, puoi accedere all'area di moderazione.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: 'Adesso',
        },
      ]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white border border-[#E5E7E1] rounded-3xl shadow-xl overflow-hidden flex flex-col h-[480px] animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Header */}
      <div className="p-4 bg-[#F8F8F5] border-b border-[#E5E7E1] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#E8EFEA] text-[#193C32] rounded-xl border border-[#193C32]/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#202522] flex items-center gap-1.5">
              <span>AMICA AI Assistant</span>
              <Sparkles className="w-3 h-3 text-[#193C32]" />
            </h3>
            <div className="text-[10px] text-[#777B76]">Guida alla ricerca e servizi</div>
          </div>
        </div>

        <button
          onClick={() => setIsAiAssistantOpen(false)}
          className="p-1 text-[#777B76] hover:text-[#202522] rounded-lg hover:bg-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#193C32] text-white font-medium rounded-br-none'
                  : 'bg-[#F8F8F5] text-[#202522] border border-[#E5E7E1] rounded-bl-none'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-[#777B76] mt-1 px-1">{m.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="p-2.5 bg-[#F8F8F5] text-[#777B76] rounded-xl text-xs inline-flex items-center gap-1.5">
            <span className="animate-pulse">Risposta in corso...</span>
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="px-3 py-2 bg-[#F8F8F5] border-t border-[#E5E7E1] flex gap-1.5 overflow-x-auto text-[10px]">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-white hover:bg-[#E8EFEA] text-[#777B76] hover:text-[#193C32] rounded-lg whitespace-nowrap border border-[#E5E7E1] shrink-0 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputText);
        }}
        className="p-3 bg-white border-t border-[#E5E7E1] flex gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Chiedi ad AMICA..."
          className="flex-1 px-3 py-2 bg-[#F8F8F5] border border-[#E5E7E1] rounded-xl text-xs text-[#202522] placeholder-[#777B76] focus:outline-none focus:border-[#193C32]"
        />
        <button
          type="submit"
          className="p-2 bg-[#193C32] hover:bg-[#244D40] text-white rounded-xl font-bold transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
