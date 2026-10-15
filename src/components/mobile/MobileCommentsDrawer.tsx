import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Heart, MessageCircle } from 'lucide-react';

interface MobileCommentsDrawerProps {
  targetId: string;
  onClose: () => void;
}

export const MobileCommentsDrawer: React.FC<MobileCommentsDrawerProps> = ({ targetId, onClose }) => {
  const { comments, addComment, currentUser } = useApp();
  const [inputText, setInputText] = useState('');
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);

  const postComments = comments[targetId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    addComment(targetId, inputText.trim());
    setInputText('');
  };

  const toggleLikeComment = (commentId: string) => {
    setLikedCommentIds((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md mx-auto bg-neutral-900 border-t border-white/10 rounded-t-3xl flex flex-col max-h-[75vh] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Drawer Header */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-[#E11D48]" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              Commenti ({postComments.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {postComments.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#E11D48]" />
              <p className="text-sm font-medium">Nessun commento finora.</p>
              <p className="text-xs text-neutral-500 mt-1">Sii il primo a lasciare un saluto o un feedback!</p>
            </div>
          ) : (
            postComments.map((item) => {
              const isLiked = likedCommentIds.includes(item.id);
              const likes = (item.likesCount || 0) + (isLiked ? 1 : 0);

              return (
                <div key={item.id} className="flex gap-3 text-left">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-white/10">
                    <img
                      src={item.userAvatar || '/src/assets/images/verified_profile_preview_1792082231358.jpg'}
                      alt={item.userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/90">
                        {item.userName}
                      </span>
                      <span className="text-[10px] text-neutral-500">{item.createdAt}</span>
                    </div>
                    <p className="text-xs text-neutral-200 mt-1 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleLikeComment(item.id)}
                    className="flex flex-col items-center justify-start pt-1 text-neutral-400 hover:text-rose-400 transition-colors"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {likes > 0 && (
                      <span className={`text-[10px] mt-0.5 ${isLiked ? 'text-rose-400 font-bold' : ''}`}>
                        {likes}
                      </span>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Sticky Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-white/10 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 shrink-0 border border-white/10">
            <img
              src={currentUser.avatar || '/src/assets/images/discover_fashion_milan_1792084200282.jpg'}
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Aggiungi un commento su AMICA..."
            className="flex-1 bg-neutral-900 text-white text-xs px-3.5 py-2.5 rounded-full border border-white/15 focus:outline-hidden focus:border-[#E11D48] transition-colors placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-9 h-9 rounded-full bg-[#E11D48] hover:bg-[#BE123C] disabled:opacity-40 disabled:hover:bg-[#E11D48] text-white flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-md shadow-[#E11D48]/30"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
