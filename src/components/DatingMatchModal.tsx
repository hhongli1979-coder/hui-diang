import React from 'react';
import { DatingMatch } from '../types';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { Heart, MessageCircle, X, Sparkles } from 'lucide-react';

interface DatingMatchModalProps {
  match: DatingMatch;
  onClose: () => void;
  onStartChat: () => void;
}

export const DatingMatchModal: React.FC<DatingMatchModalProps> = ({
  match,
  onClose,
  onStartChat,
}) => {
  const { currentUser } = useApp();
  const { lang } = useI18n();
  const isZh = lang === 'zh';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-3xl p-6 text-center shadow-[0_0_50px_rgba(225,29,72,0.25)] overflow-hidden">
        
        {/* Glow ambient background circles */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#E11D48]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E11D48]/20 border border-[#E11D48]/40 text-[#E11D48] text-xs font-bold mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isZh ? '互相喜欢' : 'Nuovo Match'}</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-white tracking-tight mb-1">
          {isZh ? '匹配成功！' : 'È un Match!'}
        </h2>
        <p className="text-xs text-neutral-300 mb-6">
          {isZh ? (
            <>你和 <span className="text-white font-bold">{match.partnerName}</span> 互相喜欢！</>
          ) : (
            <>Tu e <span className="text-white font-bold">{match.partnerName}</span> vi piacete!</>
          )}
        </p>

        {/* Intersecting Avatars */}
        <div className="flex items-center justify-center relative mb-6">
          {/* User Avatar */}
          <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#E11D48] to-white/40 shadow-xl z-10 -mr-4 transform -rotate-6">
            <img
              src={currentUser.avatar || '/src/assets/images/category_incontri_evening_1792082231469.jpg'}
              alt={currentUser.name}
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />
          </div>

          {/* Heart Badge in Center */}
          <div className="w-10 h-10 rounded-full bg-[#E11D48] border-2 border-black flex items-center justify-center text-white z-20 shadow-lg animate-bounce">
            <Heart className="w-5 h-5 fill-white" />
          </div>

          {/* Partner Avatar */}
          <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-white/40 to-[#E11D48] shadow-xl z-10 -ml-4 transform rotate-6">
            <img
              src={match.partnerAvatar || '/src/assets/images/discover_fashion_milan_1792084200282.jpg'}
              alt={match.partnerName}
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />
          </div>
        </div>

        {/* Compatibility Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
          <span>{isZh ? '匹配度：' : 'Affinità: '} <strong className="text-[#E11D48]">{match.compatibilityScore}%</strong></span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={onStartChat}
            className="w-full py-3 px-4 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#E11D48]/30 transition-all active:scale-98 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-white/20" />
            <span>{isZh ? `发送消息给 ${match.partnerName}` : `Invia Messaggio a ${match.partnerName}`}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors border border-neutral-800"
          >
            {isZh ? '继续寻找' : 'Continua a cercare'}
          </button>
        </div>

      </div>
    </div>
  );
};
