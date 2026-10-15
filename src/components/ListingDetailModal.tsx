import React, { useState } from 'react';
import { Listing, SEEKING_CATEGORIES } from '../types';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { formatDistance } from '../utils/geo';
import { AdPublicLocationBlock } from './AdPublicLocationBlock';
import {
  X,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Flag,
  Share2,
  ShieldAlert,
  Send,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({ listing, onClose }) => {
  const { lang } = useI18n();
  const isZh = lang === 'zh';

  const {
    startConversation,
    submitReport,
    selectedCity,
    favorites,
    toggleFavorite,
    toggleLikeListing,
    likedProfileIds,
  } = useApp();

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [quickMessage, setQuickMessage] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState<'spam' | 'fake' | 'underage' | 'fraud' | 'other'>('spam');
  const [reportComment, setReportComment] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = listing.images && listing.images.length > 0
    ? listing.images
    : ['/src/assets/images/category_incontri_evening_1792082231469.jpg'];

  const currentPhoto = images[activePhotoIndex] || images[0];

  const isFavorite = favorites.includes(listing.id);
  const isLiked = likedProfileIds.includes(listing.id) || !!listing.isLiked;

  const seekingOpt = SEEKING_CATEGORIES.find((c) => c.id === listing.seekingCategory);
  const seekingLabel = seekingOpt
    ? (isZh ? seekingOpt.zh : seekingOpt.label)
    : (listing.subcategoryId || (isZh ? '女子寻男' : 'Donna cerca Uomo'));

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;
    startConversation(listing.authorId || listing.id, listing.authorName, quickMessage);
    setQuickMessage('');
    onClose();
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport('listing', listing.id, listing.title, reportReason, reportComment);
    setReportSubmitted(true);
    setTimeout(() => {
      setIsReportOpen(false);
      setReportSubmitted(false);
    }, 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E5E7E1] rounded-3xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-[#777B76] hover:text-[#202522] border border-[#E5E7E1] shadow-xs transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Image Preview Banner & Photo Gallery Carousel */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-[#1A1E1B] overflow-hidden select-none">
          <img
            src={currentPhoto}
            alt={listing.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-300"
          />

          {listing.promotionTier === 'top_city' && (
            <div className="absolute top-4 left-4 z-20 bg-[#193C32] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Top di Città · In Evidenza</span>
            </div>
          )}

          {/* Carousel Next / Prev Arrows */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) => (prev - 1 + images.length) % images.length);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer"
                title={isZh ? '上一张' : 'Foto precedente'}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePhotoIndex((prev) => (prev + 1) % images.length);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all cursor-pointer"
                title={isZh ? '下一张' : 'Foto successiva'}
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Photo counter index badge */}
              <div className="absolute bottom-3 right-3 z-20 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/20">
                {activePhotoIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Bar for Multiple Photos */}
        {images.length > 1 && (
          <div className="flex gap-2 p-2 bg-[#F8F8F5] border-b border-[#E5E7E1] overflow-x-auto no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activePhotoIndex
                    ? 'border-[#E11D48] ring-2 ring-[#E11D48]/30 scale-102'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 md:p-8 space-y-6">
          
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E5E7E1] text-xs text-[#777B76]">
            <div className="flex items-center gap-2">
              <span className="text-[#193C32] font-semibold">{listing.adCity || selectedCity.name}</span>
              <span>·</span>
              <span className="text-[#202522]">{listing.adLocation || listing.district || selectedCity.name}</span>
              <span>·</span>
              <span className="text-[#193C32] font-medium">{seekingLabel}</span>
              {listing.distanceKm != null && (
                <>
                  <span>·</span>
                  <span className="font-mono text-[#193C32] font-medium">{formatDistance(listing.distanceKm)}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="hover:text-[#202522] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? (isZh ? '已复制！' : 'Copiato!') : (isZh ? '分享' : 'Condividi')}</span>
              </button>

              <button
                onClick={() => setIsReportOpen(!isReportOpen)}
                className="hover:text-rose-600 transition-colors flex items-center gap-1 text-[#777B76] cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{isZh ? '举报' : 'Segnala'}</span>
              </button>
            </div>
          </div>

          {/* Report Drawer if triggered */}
          {isReportOpen && (
            <form
              onSubmit={handleReportSubmit}
              className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs space-y-3 animate-in fade-in"
            >
              <div className="font-bold text-rose-800">
                {isZh ? '举报此交友广告' : 'Segnala annuncio al team di sicurezza'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'spam', label: 'Spam / Commerciale' },
                  { id: 'fake', label: isZh ? '虚假照片 / 资料' : 'Profilo / Foto Fake' },
                  { id: 'underage', label: isZh ? '未成年人违规' : 'Minorenne' },
                  { id: 'fraud', label: isZh ? '诈骗 / 要求预付款' : 'Richiesta di anticipo / Truffa' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setReportReason(item.id as any)}
                    className={`p-2 rounded-lg border text-center transition-colors cursor-pointer ${
                      reportReason === item.id
                        ? 'bg-rose-600 text-white border-rose-600 font-bold'
                        : 'bg-white text-[#202522] border-[#E5E7E1]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={reportComment}
                onChange={(e) => setReportComment(e.target.value)}
                placeholder={isZh ? '补充详情给审核团队...' : 'Dettagli per il team di moderazione...'}
                className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg text-[#202522] placeholder-[#777B76]"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="px-3 py-1.5 text-[#777B76] hover:text-[#202522] cursor-pointer"
                >
                  {isZh ? '取消' : 'Annulla'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  {reportSubmitted ? (isZh ? '已发送！' : 'Inviato!') : (isZh ? '发送' : 'Invia')}
                </button>
              </div>
            </form>
          )}

          {/* Title and Author Header: Anna · 29岁 */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base sm:text-lg font-bold text-[#202522]">
                {listing.authorName}
                {listing.age ? ` · ${listing.age}${isZh ? '岁' : ' anni'}` : ''}
              </span>
              {listing.verified && (
                <span className="flex items-center gap-1 text-xs text-[#193C32] font-semibold bg-[#E8EFEA] px-2 py-0.5 rounded-md" title="Identità e foto verificate">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verificato</span>
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-[#202522] leading-tight">
              {listing.title}
            </h2>

            {listing.ratePerHour != null && listing.ratePerHour > 0 && (
              <div className="mt-2 text-base font-bold text-[#193C32] font-mono">
                €{listing.ratePerHour} <span className="text-xs text-[#777B76] font-sans font-normal">/ ora tariffa indicativa</span>
              </div>
            )}
          </div>

          {/* 寻找 (Seeking Category) */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-[#202522]">{isZh ? '寻找：' : 'In cerca di:'}</span>
            <span className="px-3 py-1 rounded-xl bg-[#E8EFEA] text-[#193C32] font-semibold border border-[#193C32]/20">
              {seekingLabel}
            </span>
          </div>

          {/* 关于我 (About Me Description) */}
          <div>
            <div className="text-xs font-bold text-[#193C32] uppercase tracking-wider mb-1.5">
              {isZh ? '关于我' : 'Chi sono'}
            </div>
            <div className="bg-[#F8F8F5] p-5 rounded-2xl border border-[#E5E7E1] text-xs sm:text-sm text-[#202522] leading-relaxed whitespace-pre-line font-normal">
              {listing.description}
            </div>
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-bold text-[#202522] mr-1">{isZh ? '特征标签：' : 'Caratteristiche:'}</span>
              {listing.tags.map((tag, idx) => (
                <span key={idx} className="bg-[#F8F8F5] border border-[#E5E7E1] px-2.5 py-0.5 rounded-lg text-[#202522] text-[11px] font-medium">
                  {tag.startsWith('#') ? tag : `#${tag}`}
                </span>
              ))}
            </div>
          )}

          {/* 📍 广告位置 + 地图 + 导航 Block */}
          <div className="pt-1">
            <AdPublicLocationBlock listing={listing} />
          </div>

          {/* Action Row: ❤️ 喜欢 · ⭐ 收藏 · 💬 发消息 */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              type="button"
              onClick={() => toggleLikeListing(listing.id)}
              className={`py-3 px-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                isLiked
                  ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-sm'
                  : 'bg-[#F8F8F5] hover:bg-rose-50 text-[#202522] hover:text-[#E11D48] border-[#E5E7E1]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isZh ? '喜欢' : 'Mi Piace'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleFavorite(listing.id)}
              className={`py-3 px-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                isFavorite
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-[#F8F8F5] hover:bg-amber-50 text-[#202522] hover:text-amber-600 border-[#E5E7E1]'
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span>{isZh ? '收藏' : 'Salva'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                startConversation(
                  listing.authorId || listing.id,
                  listing.authorName,
                  isZh ? `你好 ${listing.authorName}！` : `Ciao ${listing.authorName}!`
                );
                onClose();
              }}
              className="py-3 px-3 rounded-2xl bg-[#193C32] hover:bg-[#244D40] text-white border border-[#193C32] flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isZh ? '发消息' : 'Messaggio'}</span>
            </button>
          </div>

          {/* Contact Block (if phone / whatsapp provided) */}
          {(listing.phone || listing.whatsapp) && (
            <div className="p-4 rounded-2xl bg-[#F8F8F5] border border-[#E5E7E1] space-y-3">
              <div className="text-xs font-bold text-[#202522] uppercase tracking-wider">
                {isZh ? '联系方式：' : 'Contatti:'}
              </div>

              {listing.phone && (
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-mono text-[#202522] font-semibold">
                    {phoneRevealed ? listing.phone : listing.phone.slice(0, 7) + '•••'}
                  </div>
                  {!phoneRevealed ? (
                    <button
                      onClick={() => setPhoneRevealed(true)}
                      className="px-3 py-1.5 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl transition-colors shadow-xs cursor-pointer"
                    >
                      {isZh ? '显示号码' : 'Mostra Numero'}
                    </button>
                  ) : (
                    <a
                      href={`tel:${listing.phone}`}
                      className="px-3 py-1.5 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> {isZh ? '拨打' : 'Chiama'}
                    </a>
                  )}
                </div>
              )}

              {listing.whatsapp && (
                <a
                  href={`https://wa.me/${listing.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full py-2 px-3 bg-white hover:bg-[#E8EFEA] text-[#193C32] border border-[#E5E7E1] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#193C32]" />
                  <span>WhatsApp Diretto</span>
                </a>
              )}
            </div>
          )}

          {/* Quick Message Form */}
          <form
            onSubmit={handleSendQuickMessage}
            className="p-4 rounded-2xl bg-[#F8F8F5] border border-[#E5E7E1] space-y-3"
          >
            <div className="text-xs font-semibold text-[#202522]">
              {isZh ? `给 ${listing.authorName} 发送私信：` : `Invia un messaggio privato a ${listing.authorName}:`}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                placeholder={isZh ? `打个招呼吧，例如：你好 ${listing.authorName}，今天有空喝咖啡吗？` : 'Scrivi qui il tuo messaggio (es. Buongiorno, sei disponibile oggi?)...'}
                className="flex-1 px-4 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522] placeholder-[#777B76] focus:outline-none focus:border-[#193C32]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isZh ? '发送' : 'Invia'}</span>
              </button>
            </div>
          </form>

          {/* Legal / Safety Advisory */}
          <div className="p-4 rounded-2xl bg-[#E8EFEA] border border-[#193C32]/20 text-xs text-[#202522] space-y-1">
            <div className="flex items-center gap-1.5 text-[#193C32] font-semibold">
              <ShieldAlert className="w-4 h-4 text-[#193C32] shrink-0" />
              <span>Avviso di Sicurezza (18+)</span>
            </div>
            <p className="text-[11px] text-[#777B76] leading-relaxed">
              I servizi e gli incontri pubblicati sono destinati a persone maggiorenni consenzienti. È vietata la pubblicazione di contenuti non autorizzati, truffe o minori. Segnala tempestivamente qualsiasi anomalia.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
