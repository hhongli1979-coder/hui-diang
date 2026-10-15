import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';

export const MessagesDrawer: React.FC = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    sendMessage,
    isMessagesDrawerOpen,
    setIsMessagesDrawerOpen,
  } = useApp();

  const [inputText, setInputText] = useState('');

  if (!isMessagesDrawerOpen) return null;

  const currentConv = activeConversation || (conversations.length > 0 ? conversations[0] : null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentConv) return;
    sendMessage(currentConv.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="relative w-full max-w-md bg-white border-l border-[#E5E7E1] h-full flex flex-col shadow-xl animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-4 bg-[#F8F8F5] border-b border-[#E5E7E1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#193C32]" />
            <h2 className="text-sm font-bold text-[#202522]">Messaggi & Richieste</h2>
          </div>
          <button
            onClick={() => setIsMessagesDrawerOpen(false)}
            className="p-1 rounded-lg text-[#777B76] hover:text-[#202522] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          
          {/* Conversation picker if multiple */}
          {conversations.length > 1 && (
            <div className="p-2 bg-[#F8F8F5] border-b border-[#E5E7E1] flex gap-2 overflow-x-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConversation(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    currentConv?.id === c.id
                      ? 'bg-[#193C32] text-white font-bold'
                      : 'bg-white text-[#777B76] hover:text-[#202522] border border-[#E5E7E1]'
                  }`}
                >
                  <UserIcon className="w-3 h-3" />
                  <span>{c.partnerName}</span>
                </button>
              ))}
            </div>
          )}

          {/* Active Conversation */}
          {currentConv ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              
              {/* Partner Banner */}
              <div className="px-4 py-2.5 bg-white border-b border-[#E5E7E1] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#E8EFEA] text-[#193C32] flex items-center justify-center font-bold">
                    {currentConv.partnerName[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-[#202522]">{currentConv.partnerName}</div>
                    <div className="text-[10px] text-[#777B76]">Canale sicuro riservato</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#193C32] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Attivo</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8F8F5]">
                {currentConv.messages.length === 0 ? (
                  <div className="text-center text-[#777B76] text-xs py-10">
                    Nessun messaggio ancora. Scrivi il tuo primo messaggio qui sotto.
                  </div>
                ) : (
                  currentConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                          msg.isMine
                            ? 'bg-[#193C32] text-white font-normal rounded-br-none'
                            : 'bg-white text-[#202522] rounded-bl-none border border-[#E5E7E1] shadow-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-[#777B76] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E5E7E1]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Scrivi un messaggio sicuro..."
                    className="flex-1 px-3.5 py-2.5 bg-[#F8F8F5] border border-[#E5E7E1] rounded-xl text-xs text-[#202522] placeholder-[#777B76] focus:outline-none focus:border-[#193C32]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#193C32] hover:bg-[#244D40] text-white rounded-xl font-bold transition-colors shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-center text-[#777B76] text-xs">
              <div>
                <MessageSquare className="w-8 h-8 text-[#777B76] mx-auto mb-2 opacity-50" />
                <p>Nessuna conversazione attiva.</p>
                <p className="text-[11px] text-[#777B76] mt-1">
                  Clicca su "Messaggio" in qualsiasi annuncio per avviare una chat.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
