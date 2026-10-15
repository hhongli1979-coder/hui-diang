import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, Business } from '../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Info,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  Grid,
  Map as MapIcon,
  Phone,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { formatDistance } from '../utils/geo';

interface ImmersiveDiscoverFeedProps {
  onOpenListing: (listing: Listing) => void;
  onOpenBusiness: (business: Business) => void;
}

export const ImmersiveDiscoverFeed: React.FC<ImmersiveDiscoverFeedProps> = ({
  onOpenListing,
  onOpenBusiness,
}) => {
  const {
    filteredListings,
    filteredBusinesses,
    selectedCity,
    selectedCategory,
    setSelectedCategory,
    categories,
    setViewMode,
    toggleLikeListing,
    toggleFavorite,
    favorites,
    startConversationWithListing,
    startConversationWithBusiness,
    setIsPostModalOpen,
    setIsMerchantDashboardOpen,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});
  const [copiedToast, setCopiedToast] = useState(false);
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Combine listings with business entries for an all-encompassing discovery stream
  const feedItems = React.useMemo(() => {
    const combined: Array<
      | { type: 'listing'; data: Listing }
      | { type: 'business'; data: Business }
    > = [];

    filteredListings.forEach((l) => combined.push({ type: 'listing', data: l }));
    
    // Inject spa businesses if in all or wellness category
    if (selectedCategory === 'all' || selectedCategory === 'massaggi_spa') {
      filteredBusinesses.forEach((b) => combined.push({ type: 'business', data: b }));
    }

    // Prioritize promoted items
    return combined.sort((a, b) => {
      const aPromoted = a.type === 'listing' ? a.data.promotionTier !== 'none' : a.data.isPromoted;
      const bPromoted = b.type === 'listing' ? b.data.promotionTier !== 'none' : b.data.isPromoted;
      if (aPromoted && !bPromoted) return -1;
      if (!aPromoted && bPromoted) return 1;
      return 0;
    });
  }, [filteredListings, filteredBusinesses, selectedCategory]);

  const totalCards = feedItems.length;

  const currentItem = feedItems[currentIndex];

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsExpandedDesc(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsExpandedDesc(false);
    }
  };

  // Keyboard navigation (ArrowUp, ArrowDown, PageUp, PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, totalCards]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartY.current = null;
  };

  // Cycle through photos of current card
  const handleNextPhoto = (itemId: string, imagesCount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) + 1) % imagesCount,
    }));
  };

  const handlePrevPhoto = (itemId: string, imagesCount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIndices((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] || 0) - 1 + imagesCount) % imagesCount,
    }));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  if (totalCards === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-12 h-12 text-[#193C32] mb-3" />
        <h3 className="text-xl font-bold text-[#202522]">Nessun contenuto in questo raggio</h3>
        <p className="text-sm text-[#777B76] mt-1 max-w-md">
          Prova ad allargare il raggio di ricerca chilometrico o a selezionare un'altra categoria per visualizzare più profili e attività.
        </p>
        <button
          onClick={() => setViewMode('grid')}
          className="mt-6 px-5 py-2.5 bg-[#193C32] text-white rounded-xl text-xs font-semibold hover:bg-[#244D40] transition-colors"
        >
          Torna al Catalogo
        </button>
      </div>
    );
  }

  const isListing = currentItem.type === 'listing';
  const listingData = isListing ? (currentItem.data as Listing) : null;
  const businessData = !isListing ? (currentItem.data as Business) : null;

  const id = isListing ? listingData!.id : businessData!.id;
  const title = isListing ? listingData!.title : businessData!.name;
  const description = isListing ? listingData!.description : businessData!.description;
  const images = (isListing ? listingData!.images : businessData!.images) || [];
  const currentPhotoIndex = activePhotoIndices[id] || 0;
  const mainImage = images[currentPhotoIndex] || images[0] || '/src/assets/images/category_incontri_evening_1792082231469.jpg';
  const authorName = isListing ? listingData!.authorName : businessData!.name;
  const district = isListing ? listingData!.district : businessData!.district;
  const verified = isListing ? listingData!.verified : businessData!.verified;
  const isPromoted = isListing ? listingData!.promotionTier !== 'none' : businessData!.isPromoted;
  const isLiked = isListing ? !!listingData!.isLiked : favorites.includes(id);
  const likesCount = isListing ? (listingData!.likesCount ?? 120) : businessData!.reviewsCount * 4;

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] bg-black md:bg-[#121614] flex flex-col items-center justify-center py-2 md:py-6 overflow-hidden select-none">
      
      {/* Top Floating Viewport Control Bar */}
      <div className="absolute top-4 left-0 right-0 z-30 max-w-4xl mx-auto px-4 flex items-center justify-between pointer-events-none">
        
        {/* Category & City Pills */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 font-medium shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
            <span>Discover · {selectedCity.name}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/20">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'all' : cat.id)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#193C32] text-white font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Switch View Mode & Index Count */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-md text-white/90 text-xs px-3 py-1.5 rounded-full border border-white/20 font-mono">
            {currentIndex + 1} / {totalCards}
          </div>

          <button
            onClick={() => setViewMode('grid')}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-[#193C32] transition-colors shadow-sm"
            title="Passa a Griglia Catalogo"
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewMode('map')}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-[#193C32] transition-colors shadow-sm"
            title="Passa a Radar Mappa"
          >
            <MapIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main TikTok-Style Card Container (Mobile Fullscreen / Desktop Phone Aspect 9:16) */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-[calc(100vh-4.5rem)] md:h-[84vh] md:max-w-[440px] md:rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl flex flex-col justify-between border md:border-white/10"
      >
        {/* Full-bleed Background Image with smooth transition */}
        <div className="absolute inset-0 z-0 bg-neutral-950">
          <img
            key={`${id}-${currentPhotoIndex}`}
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-300"
          />

          {/* Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none h-28" />
        </div>

        {/* Card Top Information */}
        <div className="relative z-10 pt-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPromoted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#E8EFEA] text-[#193C32] shadow-xs">
                <Sparkles className="w-3 h-3 text-[#193C32]" />
                <span>Sponsorizzato</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/50 backdrop-blur-md text-white/90 border border-white/20">
              <MapPin className="w-3 h-3 text-[#E8EFEA]" />
              <span>{district}, {selectedCity.name}</span>
            </span>
          </div>

          {/* Photos count indicator */}
          {images.length > 1 && (
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] text-white font-mono border border-white/20">
              <span>{currentPhotoIndex + 1} / {images.length}</span>
            </div>
          )}
        </div>

        {/* Horizontal Tap zones for cycling multi-photos */}
        {images.length > 1 && (
          <div className="absolute inset-y-24 inset-x-0 z-10 flex">
            <div
              onClick={(e) => handlePrevPhoto(id, images.length, e)}
              className="w-1/2 h-full cursor-pointer flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="p-2 rounded-full bg-black/40 text-white backdrop-blur-xs">
                <ChevronLeft className="w-5 h-5" />
              </div>
            </div>
            <div
              onClick={(e) => handleNextPhoto(id, images.length, e)}
              className="w-1/2 h-full cursor-pointer flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="p-2 rounded-full bg-black/40 text-white backdrop-blur-xs">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* Right Vertical TikTok Action Bar */}
        <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4">
          
          {/* Avatar Profile */}
          <div
            onClick={() => {
              if (isListing) onOpenListing(listingData!);
              else onOpenBusiness(businessData!);
            }}
            className="relative cursor-pointer group"
            title="Visualizza profilo completo"
          >
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#193C32] to-[#34D399] shadow-lg">
              <img
                src={mainImage}
                alt={authorName}
                className="w-full h-full rounded-full object-cover border-2 border-white"
              />
            </div>
            {verified && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#193C32] rounded-full border border-white flex items-center justify-center text-white">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Like / Heart Button */}
          <button
            onClick={() => {
              if (isListing) toggleLikeListing(id);
              else toggleFavorite(id);
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all active:scale-125 ${
                isLiked
                  ? 'bg-rose-500/90 text-white border-rose-400 shadow-rose-500/30 shadow-lg'
                  : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow-md">
              {likesCount}
            </span>
          </button>

          {/* Direct Chat / Inquiry Button */}
          <button
            onClick={() => {
              if (isListing) startConversationWithListing(listingData!);
              else startConversationWithBusiness(businessData!);
            }}
            className="flex flex-col items-center gap-1 group"
            title="Chatta ora con questo inserzionista"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-[#193C32] transition-all flex items-center justify-center active:scale-125">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow-md">
              Chatta
            </span>
          </button>

          {/* Full Details Modal Button */}
          <button
            onClick={() => {
              if (isListing) onOpenListing(listingData!);
              else onOpenBusiness(businessData!);
            }}
            className="flex flex-col items-center gap-1 group"
            title="Dettagli e contatti telefonici"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-[#193C32] transition-all flex items-center justify-center active:scale-125">
              <Info className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow-md">
              Scheda
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1 group"
            title="Condividi annuncio"
          >
            <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition-all flex items-center justify-center active:scale-125">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-white drop-shadow-md">
              Condividi
            </span>
          </button>

        </div>

        {/* Bottom Left Content Overlay */}
        <div className="relative z-10 p-4 pb-6 max-w-[80%] text-left">
          
          {/* Author & Verification */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base font-bold text-white tracking-tight drop-shadow-md">
              @{authorName}
            </span>
            {verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8EFEA]/90 text-[#193C32] backdrop-blur-xs">
                <ShieldCheck className="w-3 h-3 text-[#193C32]" />
                <span>Verificato</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-sm font-semibold text-white/95 line-clamp-2 leading-snug drop-shadow-md">
            {title}
          </h2>

          {/* Rate / Price badge */}
          <div className="mt-2 flex items-center gap-2">
            {isListing && listingData?.ratePerHour ? (
              <span className="text-xs font-bold text-emerald-300 font-mono bg-black/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                €{listingData.ratePerHour} / ora
              </span>
            ) : businessData ? (
              <span className="text-xs font-bold text-emerald-300 font-mono bg-black/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                Massaggi da €{businessData.services[0]?.priceEur || 60}
              </span>
            ) : null}

            {listingData?.phone && (
              <a
                href={`tel:${listingData.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-[#193C32] hover:bg-[#244D40] px-2.5 py-1 rounded-lg transition-colors shadow-xs"
              >
                <Phone className="w-3 h-3" />
                <span>Chiama</span>
              </a>
            )}
          </div>

          {/* Description snippet with expand toggle */}
          <div className="mt-2 text-xs text-white/80 leading-relaxed drop-shadow-sm">
            <p className={isExpandedDesc ? 'block' : 'line-clamp-2'}>
              {description}
            </p>
            {description.length > 90 && (
              <button
                onClick={() => setIsExpandedDesc(!isExpandedDesc)}
                className="text-[11px] font-semibold text-emerald-400 hover:underline mt-0.5"
              >
                {isExpandedDesc ? 'Meno' : 'Altro...'}
              </button>
            )}
          </div>

        </div>

        {/* Multi-photo Progress Bar at bottom */}
        {images.length > 1 && (
          <div className="absolute bottom-1 left-4 right-4 z-20 flex gap-1.5 h-1">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  idx === currentPhotoIndex ? 'bg-white h-1' : 'bg-white/30 h-1'
                }`}
              />
            ))}
          </div>
        )}

      </div>

      {/* Desktop Accessible Prev / Next Vertical Navigation Buttons */}
      <div className="hidden md:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#193C32] disabled:opacity-30 disabled:hover:bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
          title="Annuncio precedente (Freccia Su)"
        >
          <ChevronUp className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-[#193C32] disabled:opacity-30 disabled:hover:bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all flex items-center justify-center shadow-lg hover:scale-105 active:scale-95"
          title="Annuncio successivo (Freccia Giù)"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Floating CTA for Merchants to promote in the Discover feed */}
      <div className="hidden lg:block absolute left-8 bottom-8 z-30">
        <button
          onClick={() => setIsMerchantDashboardOpen(true)}
          className="bg-black/70 hover:bg-[#193C32] text-white text-xs font-semibold px-4 py-2.5 rounded-2xl border border-white/20 backdrop-blur-md transition-all shadow-lg flex items-center gap-2 group"
        >
          <span>Sei un inserzionista? Promuovi qui</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Copied Link Toast notification */}
      {copiedToast && (
        <div className="fixed bottom-20 z-50 bg-[#193C32] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xl animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>Link annuncio copiato negli appunti!</span>
        </div>
      )}

    </div>
  );
};
