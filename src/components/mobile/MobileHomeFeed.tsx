import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Listing, Business, SEEKING_CATEGORIES } from '../../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Plus,
  Check,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Send,
  UserCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { MobileCommentsDrawer } from './MobileCommentsDrawer';
import { ItalianComunePickerModal } from '../ItalianComunePickerModal';

interface MobileHomeFeedProps {
  onOpenListingModal?: (listing: Listing) => void;
  onOpenBusinessModal?: (business: Business) => void;
}

export const MobileHomeFeed: React.FC<MobileHomeFeedProps> = ({
  onOpenListingModal,
  onOpenBusinessModal,
}) => {
  const {
    filteredListings,
    filteredBusinesses,
    selectedCity,
    setSelectedCity,
    cities,
    followingUserIds,
    toggleFollowUser,
    isFollowingUser,
    toggleLikeListing,
    toggleFavorite,
    favorites,
    comments,
    startConversationWithListing,
    startConversationWithBusiness,
    openUserProfileById,
    setMobileTab,
    swipeProfile,
    addressSearchQuery,
    setAddressSearchQuery,
    requestUserLocation,
    locationStatus,
    selectedSeekingCategory,
    setSelectedSeekingCategory,
    searchRadiusKm,
    setSearchRadiusKm,
  } = useApp();

  // Top Channels: 'nearby' (Vicini / 附近 - CORE), 'following' (Seguiti / 关注), 'for_you' (Per Te / 推荐)
  const [activeChannel, setActiveChannel] = useState<'nearby' | 'following' | 'for_you'>('nearby');
  const [isComunePickerOpen, setIsComunePickerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCommentTarget, setActiveCommentTarget] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  const touchStartY = useRef<number | null>(null);

  // Build the content stream based on activeChannel and search
  const channelItems = useMemo(() => {
    let combined: Array<
      | { type: 'listing'; data: Listing }
      | { type: 'business'; data: Business }
    > = [];

    // Filter by channel
    if (activeChannel === 'following') {
      filteredListings
        .filter((l) => followingUserIds.includes(l.authorId))
        .forEach((l) => combined.push({ type: 'listing', data: l }));
    } else if (activeChannel === 'nearby') {
      // Sort by closest distance
      const sortedListings = [...filteredListings].sort(
        (a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999)
      );
      sortedListings.forEach((l) => combined.push({ type: 'listing', data: l }));
      filteredBusinesses.forEach((b) => combined.push({ type: 'business', data: b }));
    } else {
      // 'for_you' - Curated recommended stream
      filteredListings.forEach((l) => combined.push({ type: 'listing', data: l }));
      filteredBusinesses.forEach((b) => combined.push({ type: 'business', data: b }));
    }

    // Filter by search keyword if present
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      combined = combined.filter((item) => {
        const title = item.type === 'listing' ? item.data.title : item.data.name;
        const author = item.type === 'listing' ? item.data.authorName : item.data.name;
        const district = item.data.district;
        const desc = item.data.description;
        return (
          title.toLowerCase().includes(q) ||
          author.toLowerCase().includes(q) ||
          district.toLowerCase().includes(q) ||
          desc.toLowerCase().includes(q)
        );
      });
    }

    return combined;
  }, [
    activeChannel,
    filteredListings,
    filteredBusinesses,
    followingUserIds,
    searchKeyword,
  ]);

  const totalCards = channelItems.length;

  // Ensure index stays in valid range when channel changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsBioExpanded(false);
  }, [activeChannel, searchKeyword]);

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsBioExpanded(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsBioExpanded(false);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentIndex, totalCards]);

  // Touch Swipe gestures
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (Math.abs(diff) > 45) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartY.current = null;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: 'AMICA Incontri e Annunci',
        text: 'Guarda questo profilo su AMICA Italia',
        url: window.location.href,
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const currentItem = channelItems[currentIndex];

  if (!currentItem || totalCards === 0) {
    return (
      <div className="relative w-full h-[calc(100dvh-3.5rem)] bg-neutral-950 flex flex-col justify-between text-white pb-16">
        {/* Top Channel Bar */}
        <div className="pt-3 px-4 flex items-center justify-center">
          <div className="flex items-center gap-5 text-sm font-semibold tracking-wide">
            <button
              onClick={() => setActiveChannel('nearby')}
              className={`pb-1 transition-all ${
                activeChannel === 'nearby'
                  ? 'text-white border-b-2 border-[#E11D48]'
                  : 'text-neutral-400'
              }`}
            >
              Vicini
            </button>
            <button
              onClick={() => setActiveChannel('following')}
              className={`pb-1 transition-all ${
                activeChannel === 'following'
                  ? 'text-white border-b-2 border-[#E11D48]'
                  : 'text-neutral-400'
              }`}
            >
              Seguiti
            </button>
            <button
              onClick={() => setActiveChannel('for_you')}
              className={`pb-1 transition-all ${
                activeChannel === 'for_you'
                  ? 'text-white border-b-2 border-[#E11D48]'
                  : 'text-neutral-400'
              }`}
            >
              Per Te
            </button>
          </div>
        </div>

        {/* Empty Content Message (Compliant with AMICA Nearby Rules) */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-[#E11D48] mb-3 shadow-lg">
            <MapPin className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">
            附近暂时没有更多符合条件的人
          </h3>
          <p className="text-xs text-neutral-400 mt-1.5 max-w-xs leading-relaxed">
            Nessun altro utente trovato nel raggio di{' '}
            <strong className="text-white font-mono">{searchRadiusKm} km</strong> a{' '}
            <strong className="text-white">{selectedCity.name}</strong> con i filtri attuali.
          </p>

          <div className="mt-5 flex flex-col gap-2 w-full max-w-xs">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSearchRadiusKm(50)}
                className="py-2.5 px-3 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-semibold rounded-xl shadow-md transition-all text-center"
              >
                扩大到 50 km
              </button>
              <button
                onClick={() => setSearchRadiusKm(100)}
                className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-white/15 transition-all text-center"
              >
                扩大到 100 km
              </button>
            </div>
            <button
              onClick={() => setIsComunePickerOpen(true)}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-850 text-neutral-200 hover:text-white text-xs font-medium rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>Scegli Comune Italiano</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isListing = currentItem.type === 'listing';
  const listingData = isListing ? (currentItem.data as Listing) : null;
  const businessData = !isListing ? (currentItem.data as Business) : null;

  const id = isListing ? listingData!.id : businessData!.id;
  const authorId = isListing ? listingData!.authorId : businessData!.authorId;
  const title = isListing ? listingData!.title : businessData!.name;
  const authorName = isListing ? listingData!.authorName : businessData!.name;
  const description = isListing ? listingData!.description : businessData!.description;
  const images = (isListing ? listingData!.images : businessData!.images) || [];
  const currentPhotoIndex = activePhotoIndices[id] || 0;
  const activeImage = images[currentPhotoIndex] || images[0] || '/src/assets/images/category_incontri_evening_1792082231469.jpg';
  const district = isListing ? listingData!.district : businessData!.district;
  const verified = isListing ? listingData!.verified : businessData!.verified;
  const isLiked = isListing ? !!listingData!.isLiked : favorites.includes(id);
  const isBookmarked = favorites.includes(id);
  const likesCount = isListing ? (listingData!.likesCount ?? 84) : businessData!.reviewsCount * 5;
  const isFollowing = isFollowingUser(authorId);
  const postCommentsCount = (comments[id] || []).length;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setActivePhotoIndices((prev) => ({
        ...prev,
        [id]: ((prev[id] || 0) + 1) % images.length,
      }));
    }
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setActivePhotoIndices((prev) => ({
        ...prev,
        [id]: ((prev[id] || 0) - 1 + images.length) % images.length,
      }));
    }
  };

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative w-full h-[calc(100dvh-3.5rem)] bg-black overflow-hidden select-none pb-14 text-white flex flex-col justify-between"
    >
      {/* 1. Full-bleed Media Layer */}
      <div className="absolute inset-0 z-0 bg-neutral-950">
        <img
          key={`${id}-${currentPhotoIndex}`}
          src={activeImage}
          alt={title}
          className="w-full h-full object-cover animate-in fade-in duration-200"
        />
        {/* Gradients to ensure text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-black/50 pointer-events-none" />
      </div>

      {/* 2. Top Header Navigation Bar (Channels + Search) */}
      <div className="relative z-30 pt-3 px-4 flex items-center justify-between">
        {/* City Indicator (Clickable to open Italian Comune Picker) */}
        <button
          onClick={() => setIsComunePickerOpen(true)}
          className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 hover:border-[#E11D48] transition-all text-left"
          title="Cambia Comune Italiano e Raggio"
        >
          <span className="w-2 h-2 rounded-full bg-[#E11D48] shadow-[0_0_8px_#E11D48] animate-pulse" />
          <span className="text-xs font-bold tracking-tight text-white drop-shadow-md">
            {selectedCity.name} · {searchRadiusKm} km
          </span>
          <ChevronRight className="w-3 h-3 text-neutral-400" />
        </button>

        {/* Channels: Vicini / Seguiti / Per Te */}
        <div className="flex items-center gap-4 text-xs font-semibold drop-shadow-md">
          <button
            onClick={() => setActiveChannel('nearby')}
            className={`transition-all pb-0.5 ${
              activeChannel === 'nearby'
                ? 'text-white border-b-2 border-[#E11D48] font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Vicini
          </button>
          <button
            onClick={() => setActiveChannel('following')}
            className={`transition-all pb-0.5 ${
              activeChannel === 'following'
                ? 'text-white border-b-2 border-[#E11D48] font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Seguiti
          </button>
          <button
            onClick={() => setActiveChannel('for_you')}
            className={`transition-all pb-0.5 ${
              activeChannel === 'for_you'
                ? 'text-white border-b-2 border-[#E11D48] font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Per Te
          </button>
        </div>

        {/* Search Icon */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/15 active:scale-95 transition-all"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>



      {/* Expandable Search Input Overlay (Keywords + Italian Address / CAP) */}
      {isSearchOpen && (
        <div className="relative z-30 px-4 pt-2 pb-1 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 shadow-xl">
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Cerca per nome, CAP (es. 40121) o via..."
              className="bg-transparent text-xs text-white placeholder:text-neutral-400 focus:outline-hidden flex-1"
              autoFocus
            />
            {searchKeyword && (
              <button onClick={() => setSearchKeyword('')} className="text-neutral-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between px-2 text-[10px] text-neutral-300">
            <button
              onClick={() => {
                requestUserLocation();
                setActiveChannel('nearby');
              }}
              className="text-[#E11D48] hover:underline flex items-center gap-1 font-semibold"
            >
              <MapPin className="w-3 h-3" />
              <span>{locationStatus === 'granted' ? 'GPS Connesso ✓' : 'Attiva GPS per profili vicini'}</span>
            </button>
            <span className="text-neutral-400">Raggio geodetico</span>
          </div>
        </div>
      )}

      {/* Tap Zones for multi-photo navigation */}
      {images.length > 1 && (
        <div className="absolute inset-y-20 inset-x-0 z-10 flex">
          <div
            onClick={handlePrevPhoto}
            className="w-1/2 h-full cursor-pointer flex items-center justify-start pl-3 opacity-0 active:opacity-100 hover:opacity-80 transition-opacity"
          >
            <div className="p-1.5 rounded-full bg-black/50 text-white backdrop-blur-xs">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </div>
          <div
            onClick={handleNextPhoto}
            className="w-1/2 h-full cursor-pointer flex items-center justify-end pr-3 opacity-0 active:opacity-100 hover:opacity-80 transition-opacity"
          >
            <div className="p-1.5 rounded-full bg-black/50 text-white backdrop-blur-xs">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* 3. Right Vertical Action Column (Avatar, Follow, Like, Comment, Bookmark, Share, Contact) */}
      <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4">
        
        {/* Creator Avatar & Quick Follow "+" Button */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => openUserProfileById(authorId, authorName, activeImage)}
            className="w-12 h-12 rounded-full p-0.5 bg-[#E11D48] shadow-lg active:scale-95 transition-all"
            title="Apri profilo pubblico"
          >
            <img
              src={activeImage}
              alt={authorName}
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />
          </button>

          {/* Quick Follow "+" or "Check" badge under avatar */}
          <button
            onClick={() => toggleFollowUser(authorId)}
            className={`absolute -bottom-2 w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-black shadow-md transition-all active:scale-125 ${
              isFollowing
                ? 'bg-neutral-800 text-[#E11D48]'
                : 'bg-[#E11D48] hover:bg-[#BE123C] animate-bounce'
            }`}
            title={isFollowing ? 'Stai seguendo' : 'Segui'}
          >
            {isFollowing ? (
              <Check className="w-3 h-3 stroke-[3]" />
            ) : (
              <Plus className="w-3 h-3 stroke-[3]" />
            )}
          </button>
        </div>

        {/* Like / Heart - Triggers real like & dating match */}
        <button
          onClick={() => {
            if (isListing && listingData) {
              swipeProfile(listingData, 'like');
            } else {
              toggleFavorite(id);
            }
          }}
          className="flex flex-col items-center gap-1 group active:scale-125 transition-transform"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isLiked
                ? 'bg-rose-500/90 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
            {likesCount}
          </span>
        </button>

        {/* Comment Drawer Trigger */}
        <button
          onClick={() => setActiveCommentTarget(id)}
          className="flex flex-col items-center gap-1 group active:scale-125 transition-transform"
        >
          <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-[#E11D48]/40 transition-all flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
            {postCommentsCount > 0 ? postCommentsCount : 'Commenti'}
          </span>
        </button>

        {/* Bookmark / Favorite */}
        <button
          onClick={() => toggleFavorite(id)}
          className="flex flex-col items-center gap-1 group active:scale-125 transition-transform"
        >
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
              isBookmarked
                ? 'bg-[#E11D48] text-white border-[#E11D48] shadow-[0_0_15px_rgba(204,9,230,0.6)]'
                : 'bg-black/50 text-white border-white/20 hover:bg-black/70'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
            {isBookmarked ? 'Salvato' : 'Salva'}
          </span>
        </button>

        {/* Direct Chat / Contact button */}
        <button
          onClick={() => {
            if (isListing) startConversationWithListing(listingData!);
            else startConversationWithBusiness(businessData!);
            setMobileTab('inbox');
          }}
          className="flex flex-col items-center gap-1 group active:scale-125 transition-transform"
          title="Contatta in privato"
        >
          <div className="w-11 h-11 rounded-full bg-[#E11D48] text-white shadow-[0_0_14px_rgba(204,9,230,0.5)] flex items-center justify-center hover:bg-[#BE123C] transition-all">
            <Send className="w-4 h-4 ml-0.5" />
          </div>
          <span className="text-[11px] font-bold text-[#E11D48] drop-shadow-md">
            Contatta
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group active:scale-125 transition-transform"
        >
          <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md text-white border border-white/20 hover:bg-black/70 transition-all flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow-md">
            Condividi
          </span>
        </button>

      </div>

      {/* 4. Bottom Content Overlay (Nickname, Age, City, Bio, Tags, Full Profile Link) */}
      <div className="relative z-20 px-4 pb-4 max-w-[80%] text-left">
        
        {/* Creator Name & Badges */}
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={() => openUserProfileById(authorId, authorName, activeImage)}
            className="text-base font-bold text-white tracking-tight drop-shadow-md hover:underline flex items-center gap-1"
          >
            <span>@{authorName}</span>
          </button>

          {verified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E11D48]/90 text-white backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3" />
              <span>Verificato</span>
            </span>
          )}

          {isFollowing && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-800/80 text-neutral-300 border border-white/10">
              <UserCheck className="w-2.5 h-2.5" />
              <span>Seguito</span>
            </span>
          )}
        </div>

        {/* Location, Distance & Compatibility */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-neutral-300 font-medium mb-1.5">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
            <span>{district}, {selectedCity.name}</span>
          </span>

          {isListing && listingData?.distanceKm != null && (
            <span className="px-2 py-0.5 rounded-md bg-black/60 border border-[#E11D48]/40 text-[#E11D48] text-[10px] font-bold">
              a {listingData.distanceKm.toFixed(1)} km
            </span>
          )}

          {isListing && listingData?.compatibilityScore && (
            <span className="px-2 py-0.5 rounded-md bg-black/60 border border-neutral-700 text-neutral-200 text-[10px] font-bold">
              ⚡ {listingData.compatibilityScore}% Affinità
            </span>
          )}

          {isListing && listingData?.ratePerHour && (
            <span className="px-2 py-0.5 rounded-md bg-black/60 border border-neutral-700 text-white font-mono text-[11px] font-bold">
              €{listingData.ratePerHour}/h
            </span>
          )}
        </div>

        {/* Post Title */}
        <h2 className="text-sm font-semibold text-white/95 line-clamp-1 leading-snug drop-shadow-md mb-1">
          {title}
        </h2>

        {/* Bio Snippet */}
        <div className="text-xs text-neutral-200/90 leading-relaxed drop-shadow-sm">
          <p className={isBioExpanded ? 'block' : 'line-clamp-2'}>
            {description}
          </p>
          {description.length > 80 && (
            <button
              onClick={() => setIsBioExpanded(!isBioExpanded)}
              className="text-[11px] font-bold text-[#E11D48] hover:underline mt-0.5"
            >
              {isBioExpanded ? 'Meno' : 'Altro...'}
            </button>
          )}
        </div>

        {/* Interest tags */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['#Incontri', '#Aperitivo', '#BolognaLive'].map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-semibold text-white/80 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* View Full Profile CTA */}
        <div className="mt-2.5">
          <button
            onClick={() => {
              if (isListing && onOpenListingModal) onOpenListingModal(listingData!);
              else if (businessData && onOpenBusinessModal) onOpenBusinessModal(businessData!);
              else openUserProfileById(authorId, authorName, activeImage);
            }}
            className="text-[11px] font-semibold text-white/90 hover:text-white bg-black/50 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md transition-all active:scale-95"
          >
            Vedi scheda completa →
          </button>
        </div>

      </div>

      {/* Multi-photo Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-4 right-4 z-20 flex gap-1 h-0.5">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 rounded-full transition-all duration-200 ${
                idx === currentPhotoIndex ? 'bg-white h-0.5' : 'bg-white/30 h-0.5'
              }`}
            />
          ))}
        </div>
      )}

      {/* Toast */}
      {copiedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#E11D48] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-in fade-in flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Link profilo copiato negli appunti!</span>
        </div>
      )}

      {/* Comments Drawer Modal */}
      {activeCommentTarget && (
        <MobileCommentsDrawer
          targetId={activeCommentTarget}
          onClose={() => setActiveCommentTarget(null)}
        />
      )}

      {/* Italian Comune Picker Modal */}
      {isComunePickerOpen && (
        <ItalianComunePickerModal
          isOpen={isComunePickerOpen}
          onClose={() => setIsComunePickerOpen(false)}
        />
      )}

    </div>
  );
};
