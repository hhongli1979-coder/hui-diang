import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Conversation, MessageItem } from '../../types';
import {
  MessageSquare,
  Bell,
  ShieldCheck,
  Search,
  ArrowLeft,
  Send,
  MoreVertical,
  CheckCheck,
  Check,
  ShieldAlert,
  Ban,
  Flag,
  UserCheck,
  Sparkles,
  Phone,
  Image as ImageIcon,
  Trash2,
  Paperclip,
  Flame,
  X,
} from 'lucide-react';

export const MobileInboxView: React.FC = () => {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    sendMessage,
    sendImageMessage,
    markConversationRead,
    deleteConversation,
    currentUser,
    notifications,
    markAllNotificationsRead,
    unreadNotificationsCount,
    unreadMessagesCount,
    openUserProfileById,
    toggleBlockUser,
    submitReport,
    isUserBlocked,
    datingMatches,
  } = useApp();

  // Active top tab: 'messages' (Messaggi) | 'activity' (Attività) | 'system' (Sistema)
  const [inboxTab, setInboxTab] = useState<'messages' | 'activity' | 'system'>('messages');
  const [chatInputText, setChatInputText] = useState('');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('spam');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mark conversation read on active change
  useEffect(() => {
    if (activeConversation && activeConversation.unreadCount > 0) {
      markConversationRead(activeConversation.id);
    }
  }, [activeConversation, markConversationRead]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (activeConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    if (chatSearchQuery.trim()) {
      const q = chatSearchQuery.toLowerCase();
      return (
        c.partnerName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConversation || !chatInputText.trim()) return;

    sendMessage(activeConversation.id, chatInputText.trim());
    setChatInputText('');
  };

  const handleSendQuickReply = (text: string) => {
    if (!activeConversation) return;
    sendMessage(activeConversation.id, text);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversation) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      sendImageMessage(activeConversation.id, result, 'Foto condivisa');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleBlockPartner = () => {
    if (!activeConversation) return;
    toggleBlockUser(activeConversation.id);
    setIsOptionsMenuOpen(false);
    setActiveConversation(null);
  };

  const handleDeleteChat = () => {
    if (!activeConversation) return;
    deleteConversation(activeConversation.id);
    setIsOptionsMenuOpen(false);
    setActiveConversation(null);
  };

  const handleReportPartner = () => {
    if (!activeConversation) return;
    submitReport(
      'message',
      activeConversation.id,
      activeConversation.partnerName,
      reportReason as any,
      'Segnalazione inviata dal centro messaggi AMICA mobile.'
    );
    setReportModalOpen(false);
    setIsOptionsMenuOpen(false);
  };

  // If inside a single conversation chat room
  if (activeConversation) {
    const isBlocked = isUserBlocked(activeConversation.id);
    const isMatch = datingMatches.some((m) => m.partnerId === activeConversation.id || m.partnerName === activeConversation.partnerName);

    const quickReplies = [
      'Ciao! Come stai? 😊',
      'Sei libera/o per un aperitivo oggi?',
      'Piacere di conoscerti su AMICA!',
      'Che zona frequenti di solito?',
    ];

    return (
      <div className="relative w-full h-[calc(100dvh-3.5rem)] bg-neutral-950 text-white flex flex-col justify-between pb-14 select-none">
        
        {/* Chat Room Top Bar */}
        <div className="px-3 py-2.5 bg-neutral-900 border-b border-white/10 flex items-center justify-between z-30">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setActiveConversation(null);
                setIsOptionsMenuOpen(false);
              }}
              className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Avatar & Online status */}
            <div
              onClick={() => openUserProfileById(activeConversation.partnerName, activeConversation.partnerName, activeConversation.partnerAvatar)}
              className="relative cursor-pointer flex items-center gap-2 group"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-800 border border-white/15">
                <img
                  src={activeConversation.partnerAvatar || '/src/assets/images/discover_fashion_milan_1792084200282.jpg'}
                  alt={activeConversation.partnerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute bottom-0 left-7 border-2 border-neutral-900" />

              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-white group-hover:text-[#CC09E6] transition-colors">
                    {activeConversation.partnerName}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CC09E6]" />
                </div>
                <span className="text-[10px] text-neutral-400 block">Online adesso</span>
              </div>
            </div>
          </div>

          {/* Right Action Menu */}
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Options Dropdown */}
            {isOptionsMenuOpen && (
              <div className="absolute right-0 top-10 w-48 bg-neutral-900 border border-white/15 rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => {
                    openUserProfileById(activeConversation.partnerName, activeConversation.partnerName, activeConversation.partnerAvatar);
                    setIsOptionsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-neutral-200"
                >
                  <UserCheck className="w-4 h-4 text-[#E11D48]" />
                  <span>Vedi profilo</span>
                </button>

                <button
                  onClick={handleDeleteChat}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-neutral-300"
                >
                  <Trash2 className="w-4 h-4 text-neutral-400" />
                  <span>Elimina conversazione</span>
                </button>

                <button
                  onClick={() => {
                    setReportModalOpen(true);
                    setIsOptionsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-amber-400"
                >
                  <Flag className="w-4 h-4" />
                  <span>Segnala utente</span>
                </button>

                <button
                  onClick={handleBlockPartner}
                  className="w-full px-3 py-2 text-left hover:bg-white/10 flex items-center gap-2 text-rose-400 border-t border-white/5"
                >
                  <Ban className="w-4 h-4" />
                  <span>{isBlocked ? 'Sblocca utente' : 'Blocca utente'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dating Match Badge if applicable */}
        {isMatch && (
          <div className="bg-gradient-to-r from-[#E11D48]/25 to-pink-500/25 border-b border-pink-500/30 px-3 py-1.5 text-[11px] text-pink-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#00F2FE]" />
              <span className="font-semibold">Siete un Match su AMICA! Vi piacete a vicenda ✨</span>
            </div>
          </div>
        )}

        {/* Safety Advisory Banner */}
        <div className="bg-[#E11D48]/10 border-b border-[#E11D48]/20 px-3 py-1.5 text-[10px] text-neutral-300 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
            <span>Chat protetta: non inviare mai bonifici o pagamenti anticipati a sconosciuti.</span>
          </div>
        </div>

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
          {activeConversation.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                msg.isMine ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              {/* Optional Photo Attachment */}
              {msg.imageUrl && (
                <div
                  onClick={() => setPreviewImage(msg.imageUrl || null)}
                  className="mb-1 rounded-2xl overflow-hidden border border-white/15 max-w-[220px] max-h-[220px] cursor-pointer shadow-md"
                >
                  <img
                    src={msg.imageUrl}
                    alt="attachment"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {msg.text && (
                <div
                  className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.isMine
                      ? 'bg-[#E11D48] text-white rounded-br-xs shadow-md shadow-[#E11D48]/20'
                      : 'bg-neutral-800 text-neutral-200 rounded-bl-xs border border-white/10'
                  }`}
                >
                  {msg.text}
                </div>
              )}

              <div className="flex items-center gap-1 text-[9px] text-neutral-500 mt-1 px-1">
                <span>{msg.timestamp}</span>
                {msg.isMine && (
                  <CheckCheck className="w-3 h-3 text-[#00F2FE]" />
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />

          {isBlocked && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs text-center">
              Hai bloccato questo utente. Non puoi inviare o ricevere altri messaggi.
            </div>
          )}
        </div>

        {/* Quick Reply Chips */}
        {!isBlocked && (
          <div className="px-3 py-1.5 bg-neutral-950 border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickReplies.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSendQuickReply(chip)}
                className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-2.5 py-1 rounded-full border border-white/10 shrink-0 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-neutral-900 border-t border-white/10 flex items-center gap-2"
        >
          {/* Photo upload button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={isBlocked}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-full text-neutral-400 hover:text-[#00F2FE] hover:bg-white/10 transition-colors"
            title="Invia foto"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <input
            type="text"
            disabled={isBlocked}
            value={chatInputText}
            onChange={(e) => setChatInputText(e.target.value)}
            placeholder={isBlocked ? 'Utente bloccato' : 'Scrivi un messaggio su AMICA...'}
            className="flex-1 bg-neutral-950 text-white text-xs px-3.5 py-2.5 rounded-full border border-white/15 focus:outline-hidden focus:border-[#E11D48] placeholder:text-neutral-500 transition-colors"
          />

          <button
            type="submit"
            disabled={isBlocked || !chatInputText.trim()}
            className="w-9 h-9 rounded-full bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-40 text-white flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-md shadow-[#E11D48]/30 cursor-pointer"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>

        {/* Full Image Preview Modal */}
        {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-lg max-h-[80vh]">
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewImage}
                alt="fullscreen"
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>
          </div>
        )}

        {/* Report Dialog */}
        {reportModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-neutral-900 border border-white/15 rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold text-white">Segnala questo profilo</h3>
              <p className="text-xs text-neutral-400">
                Seleziona il motivo per inviare una segnalazione anonima al team di moderazione AMICA:
              </p>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full bg-neutral-950 text-xs text-white p-2 rounded-xl border border-white/20"
              >
                <option value="spam">Spam / Contatto commerciale molesto</option>
                <option value="fake">Profilo falso o foto rubate</option>
                <option value="underage">Sospetto minore di 18 anni</option>
                <option value="fraud">Tentativo di frode o richiesta denaro</option>
                <option value="other">Altra violazione dei termini</option>
              </select>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                >
                  Annulla
                </button>
                <button
                  type="button"
                  onClick={handleReportPartner}
                  className="px-4 py-1.5 text-xs font-bold bg-[#E11D48] text-white rounded-lg hover:bg-[#BE123C]"
                >
                  Invia Segnalazione
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // Main Inbox Directory View (Tabs: Messages, Activity, System)
  return (
    <div className="w-full min-h-[calc(100dvh-3.5rem)] bg-neutral-950 text-white pb-20 select-none">
      
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-white/10 px-4 pt-3 pb-2.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#E11D48]" />
            <h1 className="text-base font-bold tracking-tight text-white">
              Centro Notifiche & Chat
            </h1>
          </div>

          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-[#E11D48] hover:underline font-semibold"
            >
              Segna tutti come letti
            </button>
          )}
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 border-b border-white/10 text-xs font-semibold">
          <button
            onClick={() => setInboxTab('messages')}
            className={`pb-2.5 px-2 transition-all relative ${
              inboxTab === 'messages'
                ? 'text-white border-b-2 border-[#E11D48] font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Messaggi</span>
            {unreadMessagesCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[#E11D48] text-[9px] font-bold text-white">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setInboxTab('activity')}
            className={`pb-2.5 px-2 transition-all relative ${
              inboxTab === 'activity'
                ? 'text-white border-b-2 border-[#E11D48] font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Attività & Like</span>
            {unreadNotificationsCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[#00F2FE] text-[9px] font-bold text-black">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setInboxTab('system')}
            className={`pb-2.5 px-2 transition-all ${
              inboxTab === 'system'
                ? 'text-white border-b-2 border-[#E11D48] font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Sistema AMICA</span>
          </button>
        </div>

        {/* Chat search (only on messages tab) */}
        {inboxTab === 'messages' && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={chatSearchQuery}
              onChange={(e) => setChatSearchQuery(e.target.value)}
              placeholder="Cerca conversazione..."
              className="w-full bg-neutral-900 text-xs text-white pl-9 pr-4 py-2 rounded-xl border border-white/15 focus:outline-hidden focus:border-[#E11D48] transition-colors placeholder:text-neutral-500"
            />
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div className="p-3">
        {/* Tab 1: Messages List */}
        {inboxTab === 'messages' && (
          <div className="space-y-2">
            {filteredConversations.length === 0 ? (
              <div className="py-16 text-center text-neutral-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#E11D48]" />
                <h3 className="text-sm font-bold text-white">Nessuna conversazione attiva</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                  Inizia una chat visitando un profilo nella sezione Home o Amici!
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className="bg-neutral-900/80 hover:bg-neutral-900 border border-white/10 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all active:scale-98 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-white/15 relative">
                    <img
                      src={conv.partnerAvatar || '/src/assets/images/discover_fashion_milan_1792084200282.jpg'}
                      alt={conv.partnerName}
                      className="w-full h-full object-cover"
                    />
                    {conv.unreadCount > 0 && (
                      <span className="w-3 h-3 rounded-full bg-[#E11D48] absolute top-0 right-0 border-2 border-neutral-900 animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-white truncate">
                        {conv.partnerName}
                      </span>
                      <span className="text-[10px] text-neutral-400 shrink-0">
                        {conv.lastTimestamp}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 truncate font-normal">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="min-w-[18px] h-4 px-1 rounded-full bg-[#E11D48] text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Activity & Like Notifications */}
        {inboxTab === 'activity' && (
          <div className="space-y-2">
            {notifications
              .filter((n) => n.type !== 'system')
              .map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-2xl border transition-all flex items-start gap-3 text-left ${
                    !notif.isRead
                      ? 'bg-[#E11D48]/10 border-[#E11D48]/40'
                      : 'bg-neutral-900/70 border-white/10 text-neutral-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-white/15">
                    <img
                      src={notif.avatar || '/src/assets/images/discover_lounge_bologna_1792084200626.jpg'}
                      alt="notif"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-neutral-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-neutral-200 mt-0.5 leading-relaxed">
                      {notif.text}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Tab 3: System Notifications */}
        {inboxTab === 'system' && (
          <div className="space-y-2">
            {notifications
              .filter((n) => n.type === 'system')
              .map((notif) => (
                <div
                  key={notif.id}
                  className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex items-start gap-3 text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#E11D48]/20 border border-[#E11D48]/40 flex items-center justify-center text-[#E11D48] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{notif.title}</span>
                      <span className="text-[10px] text-neutral-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      {notif.text}
                    </p>
                  </div>
                </div>
              ))}

            {/* Default Safety Guidelines info card */}
            <div className="p-3.5 rounded-2xl bg-neutral-900/60 border border-white/10 text-neutral-300 text-left">
              <div className="flex items-center gap-2 mb-1 text-white text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#00F2FE]" />
                <span>Norme di Sicurezza della Community</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-400">
                La sicurezza degli utenti è la priorità di AMICA. Puoi bloccare e segnalare in qualsiasi momento qualsiasi profilo molesto attraverso il pulsante opzioni della chat.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
