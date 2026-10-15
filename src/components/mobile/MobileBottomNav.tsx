import React from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { MobileTab } from '../../types';
import { Home, Users, Plus, MessageSquare, User as UserIcon } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { t } = useI18n();
  const {
    mobileTab,
    setMobileTab,
    unreadMessagesCount,
    unreadNotificationsCount,
    currentUser,
  } = useApp();

  const totalUnread = unreadMessagesCount + unreadNotificationsCount;

  return (
    <nav
      aria-label="Navigazione Principale Mobile"
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 text-white select-none pb-[env(safe-area-inset-bottom)]"
    >
      <div className="max-w-md mx-auto h-14 flex items-center justify-around px-2">
        {/* 1. 首页 Home */}
        <button
          onClick={() => setMobileTab('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 active:scale-95 ${
            mobileTab === 'home' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Home className={`w-5 h-5 transition-transform ${mobileTab === 'home' ? 'stroke-[2.5] scale-105' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] mt-0.5 tracking-tight ${mobileTab === 'home' ? 'font-bold text-white' : 'font-medium'}`}>
            {t('nav.home')}
          </span>
          {mobileTab === 'home' && (
            <span className="w-1 h-1 rounded-full bg-[#E11D48] mt-0.5" />
          )}
        </button>

        {/* 2. 好友 Friends */}
        <button
          onClick={() => setMobileTab('friends')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 active:scale-95 ${
            mobileTab === 'friends' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Users className={`w-5 h-5 transition-transform ${mobileTab === 'friends' ? 'stroke-[2.5] scale-105 text-[#E11D48]' : 'stroke-[1.8]'}`} />
          <span className={`text-[10px] mt-0.5 tracking-tight ${mobileTab === 'friends' ? 'font-bold text-white' : 'font-medium'}`}>
            {t('nav.friends')}
          </span>
          {mobileTab === 'friends' && (
            <span className="w-1 h-1 rounded-full bg-[#E11D48] mt-0.5" />
          )}
        </button>

        {/* 3. 发布 Create (TikTok-style prominent center button) */}
        <div className="flex-1 flex items-center justify-center h-full">
          <button
            onClick={() => setMobileTab('create')}
            aria-label="Crea nuovo post o annuncio"
            className="group relative flex items-center justify-center w-11 h-8 rounded-xl transition-all duration-200 active:scale-90 hover:scale-105"
          >
            {/* Magenta #E11D48 background glow */}
            <span className="absolute inset-0 bg-[#E11D48] rounded-xl shadow-[0_0_12px_rgba(204,9,230,0.5)]" />
            {/* Center black button */}
            <span className="relative z-10 w-10 h-7 bg-black rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-neutral-900 transition-colors">
              <Plus className="w-4 h-4 text-white stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
            </span>
          </button>
        </div>

        {/* 4. 收件箱 Inbox */}
        <button
          onClick={() => setMobileTab('inbox')}
          className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 active:scale-95 ${
            mobileTab === 'inbox' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 transition-transform ${mobileTab === 'inbox' ? 'stroke-[2.5] scale-105 text-[#E11D48]' : 'stroke-[1.8]'}`} />
            {totalUnread > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#E11D48] text-white text-[9px] font-bold flex items-center justify-center shadow-md animate-pulse">
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${mobileTab === 'inbox' ? 'font-bold text-white' : 'font-medium'}`}>
            {t('nav.inbox')}
          </span>
          {mobileTab === 'inbox' && (
            <span className="w-1 h-1 rounded-full bg-[#E11D48] mt-0.5" />
          )}
        </button>

        {/* 5. 主页 Profile */}
        <button
          onClick={() => setMobileTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-200 active:scale-95 ${
            mobileTab === 'profile' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <div className={`w-5 h-5 rounded-full overflow-hidden border transition-all ${
            mobileTab === 'profile' ? 'border-[#E11D48] ring-2 ring-[#E11D48]/30 scale-105' : 'border-white/30'
          }`}>
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-full h-full p-0.5 text-neutral-300" />
            )}
          </div>
          <span className={`text-[10px] mt-0.5 tracking-tight ${mobileTab === 'profile' ? 'font-bold text-white' : 'font-medium'}`}>
            {t('nav.profile')}
          </span>
          {mobileTab === 'profile' && (
            <span className="w-1 h-1 rounded-full bg-[#E11D48] mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
