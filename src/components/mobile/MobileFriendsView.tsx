import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useI18n } from '../../i18n';
import { User, Listing, SeekingCategory, SEEKING_CATEGORIES } from '../../types';
import {
  Heart,
  X,
  MessageCircle,
  RotateCcw,
  MapPin,
  ShieldCheck,
  Search,
  Filter,
  Sparkles,
  Flame,
  UserCheck,
  Plus,
  Check,
  ChevronRight,
  ChevronLeft,
  Navigation,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { calculateDistanceKm, geocodeItalianAddress, calculateCompatibilityScore } from '../../utils/geo';
import { ItalianComunePickerModal } from '../ItalianComunePickerModal';

interface MobileFriendsViewProps {
  onOpenListingModal?: (listing: Listing) => void;
}

export interface DatingCard {
  id: string;
  userId: string;
  name: string;
  age: number;
  city: string;
  district?: string;
  distanceKm: number | null;
  seekingCategory: SeekingCategory;
  categoryLabel: string;
  bio: string;
  headline?: string;
  interests: string[];
  images: string[];
  isVerified: boolean;
  likesCount: number;
  compatibilityScore: number;
  originalUser?: User;
  originalListing?: Listing;
}

export const MobileFriendsView: React.FC<MobileFriendsViewProps> = ({ onOpenListingModal }) => {
  const { lang } = useI18n();
  const isZh = lang === 'zh';

  const {
    allUsers,
    currentUser,
    followingUserIds,
    toggleFollowUser,
    isFollowingUser,
    openUserProfileById,
    startConversation,
    setMobileTab,
    selectedCity,
    setSelectedCity,
    cities,
    datingMatches,
    swipeProfile,
    listings,
    userLocation,
    requestUserLocation,
    locationStatus,
  } = useApp();

  // Top Modes: 'recommended' | 'nearby' | 'matches' | 'following'
  const [activeMode, setActiveMode] = useState<'recommended' | 'nearby' | 'matches' | 'following'>('recommended');

  // Category Filter
  const [selectedCategory, setSelectedCategory] = useState<SeekingCategory>('all');

  // Distance radius for 'nearby' mode: 5km, 15km, 30km
  const [nearbyRadiusKm, setNearbyRadiusKm] = useState<number>(15);

  // Search & Geocoding
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [addressSearch, setAddressSearch] = useState<string>('');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isComunePickerOpen, setIsComunePickerOpen] = useState<boolean>(false);

  // Card deck swipe state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activePhotoIndices, setActivePhotoIndices] = useState<Record<string, number>>({});
  const [, setSwipedCardHistory] = useState<Array<{ card: DatingCard; action: 'like' | 'skip' }>>([]);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [likeToast, setLikeToast] = useState<string | null>(null);

  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const geocodedReference = useMemo(() => {
    if (addressSearch.trim()) {
      return geocodeItalianAddress(addressSearch, selectedCity);
    }
    return null;
  }, [addressSearch, selectedCity]);

  const referenceCoords = useMemo(() => {
    if (geocodedReference) return { lat: geocodedReference.lat, lng: geocodedReference.lng };
    if (userLocation) return { lat: userLocation.lat, lng: userLocation.lng };
    return { lat: selectedCity.lat, lng: selectedCity.lng };
  }, [geocodedReference, userLocation, selectedCity]);

  const cityCoordsMap: Record<string, { lat: number; lng: number }> = {
    bologna: { lat: 44.4949, lng: 11.3426 },
    milano: { lat: 45.4642, lng: 9.19 },
    roma: { lat: 41.9028, lng: 12.4964 },
    firenze: { lat: 43.7696, lng: 11.2558 },
    torino: { lat: 45.0703, lng: 7.6869 },
    napoli: { lat: 40.8518, lng: 14.2681 },
    venezia: { lat: 45.4408, lng: 12.3155 },
  };

  const getCategoryLabel = (catId: SeekingCategory): string => {
    const item = SEEKING_CATEGORIES.find((c) => c.id === catId);
    if (!item) return isZh ? '交友' : 'Incontri';
    return isZh ? item.zh : item.label;
  };

  // 1. Dynamic Data: STRICT EXCLUSION of businesses, spas, and official staff
  const rawDatingCards = useMemo(() => {
    const cards: DatingCard[] = [];

    const validUsers = allUsers.filter((u) => {
      if (u.id === currentUser.id) return false;
      if (u.role === 'admin' || u.role === 'moderator' || u.role === 'business_owner') return false;

      const lowerName = (u.name || '').toLowerCase();
      const lowerUsername = (u.username || '').toLowerCase();
      const lowerBio = (u.bio || '').toLowerCase();

      if (
        lowerName.includes('staff') ||
        lowerName.includes('moderazione') ||
        lowerName.includes('amica') ||
        lowerName.includes('oasi') ||
        lowerName.includes('spa') ||
        lowerName.includes('centro') ||
        lowerName.includes('relax') ||
        lowerUsername.includes('official') ||
        lowerBio.includes('centro benessere')
      ) {
        return false;
      }
      return true;
    });

    validUsers.forEach((user) => {
      const userListing = listings.find((l) => l.authorId === user.id);

      // Public ad location coordinates (distinct from user private address)
      let adLat = userListing?.adLatitude ?? userListing?.lat ?? user.latitude;
      let adLng = userListing?.adLongitude ?? userListing?.lng ?? user.longitude;

      if (!adLat || !adLng) {
        const cityKey = (user.city || selectedCity.name).toLowerCase();
        const cityCoords = cityCoordsMap[cityKey] || { lat: selectedCity.lat, lng: selectedCity.lng };
        adLat = cityCoords.lat;
        adLng = cityCoords.lng;
      }

      // Real distance: calculate ONLY if viewer authorized GPS (userLocation is set)
      // Never show fake distance like 0.0 km if location is ungranted!
      const hasViewerGps = !!userLocation && userLocation.lat != null && userLocation.lng != null;
      const realDistanceKm = hasViewerGps
        ? Math.max(1, Math.round(calculateDistanceKm(userLocation.lat, userLocation.lng, adLat, adLng)))
        : null;

      const sCat: SeekingCategory = user.seekingCategory || 'donna_cerca_uomo';
      const catLabel = getCategoryLabel(sCat);

      const compScore = calculateCompatibilityScore(currentUser, {
        tags: user.interests,
        city: user.city,
      });

      // Collect all user images
      const images: string[] = [];
      if (user.photos && user.photos.length > 0) {
        images.push(...user.photos);
      }
      if (userListing?.images && userListing.images.length > 0) {
        userListing.images.forEach((img) => {
          if (!images.includes(img)) images.push(img);
        });
      }
      if (user.avatar && !images.includes(user.avatar)) {
        images.unshift(user.avatar);
      }
      if (images.length === 0) {
        images.push('/src/assets/images/category_incontri_evening_1792082231469.jpg');
      }

      // Ensure a full public listing object always exists with public ad location
      const effectiveListing: Listing = userListing || {
        id: `list_user_${user.id}`,
        title: `${user.name} – Profilo Personale`,
        slug: `user-${user.id}`,
        categoryId: 'incontri',
        subcategoryId: catLabel,
        cityId: (user.city || selectedCity.name).toLowerCase(),
        district: user.province || selectedCity.name,
        address: `${user.city || selectedCity.name} Centro`,
        lat: adLat,
        lng: adLng,
        adLocation: `${user.city || selectedCity.name} Centro`,
        adCity: user.city || selectedCity.name,
        adArea: 'Centro',
        adLatitude: adLat,
        adLongitude: adLng,
        locationVisibility: 'area',
        description: user.bio || '',
        images,
        verified: !!user.isVerified,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        status: 'active',
        promotionTier: 'none',
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewsCount: 50,
        contactsCount: 2,
        age: user.age,
        gender: user.gender,
        seekingCategory: sCat,
      };

      cards.push({
        id: `card_${user.id}`,
        userId: user.id,
        name: user.name,
        age: user.age || 26,
        city: effectiveListing.adCity || user.city || selectedCity.name,
        district: effectiveListing.adLocation || user.city || selectedCity.name,
        distanceKm: realDistanceKm,
        seekingCategory: sCat,
        categoryLabel: catLabel,
        bio: user.bio || '',
        headline: effectiveListing.title,
        interests: user.interests || ['旅行', '美食', '音乐'],
        images,
        isVerified: !!user.isVerified,
        likesCount: user.likesCount || 120,
        compatibilityScore: compScore,
        originalUser: user,
        originalListing: effectiveListing,
      });
    });

    return cards;
  }, [allUsers, currentUser, listings, userLocation, selectedCity, isZh]);

  // 2. Filter Cards by Mode, Category, Search, Distance
  const filteredCards = useMemo(() => {
    let result = [...rawDatingCards];

    if (activeMode === 'recommended') {
      // Prioritize local users within 35km first, then sort by compatibility
      result = result.sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null) {
          const aIsLocal = a.distanceKm <= 35 ? 1 : 0;
          const bIsLocal = b.distanceKm <= 35 ? 1 : 0;
          if (aIsLocal !== bIsLocal) return bIsLocal - aIsLocal;
        }
        return b.compatibilityScore - a.compatibilityScore;
      });
    } else if (activeMode === 'nearby') {
      // Strict distance filtering: only users within nearbyRadiusKm
      result = result
        .filter((c) => c.distanceKm == null || c.distanceKm <= nearbyRadiusKm)
        .sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    } else if (activeMode === 'matches') {
      const matchPartnerIds = datingMatches.map((m) => m.partnerId);
      result = result.filter((c) => matchPartnerIds.includes(c.userId));
    } else if (activeMode === 'following') {
      result = result.filter((c) => followingUserIds.includes(c.userId));
    }

    if (selectedCategory !== 'all') {
      result = result.filter((c) => c.seekingCategory === selectedCategory);
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.bio.toLowerCase().includes(q) ||
          c.categoryLabel.toLowerCase().includes(q) ||
          c.interests.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result;
  }, [rawDatingCards, activeMode, selectedCategory, nearbyRadiusKm, datingMatches, followingUserIds, searchKeyword]);

  useEffect(() => {
    setCurrentIndex(0);
    setDragOffset({ x: 0, y: 0 });
  }, [activeMode, selectedCategory, nearbyRadiusKm, searchKeyword]);

  const totalCards = filteredCards.length;
  const currentCard = filteredCards[currentIndex];

  const currentPhotoIndex = currentCard ? (activePhotoIndices[currentCard.id] || 0) : 0;
  const currentImage = currentCard
    ? (currentCard.images[currentPhotoIndex] || currentCard.images[0])
    : '';

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard || currentCard.images.length <= 1) return;
    setActivePhotoIndices((prev) => ({
      ...prev,
      [currentCard.id]: (currentPhotoIndex + 1) % currentCard.images.length,
    }));
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentCard || currentCard.images.length <= 1) return;
    setActivePhotoIndices((prev) => ({
      ...prev,
      [currentCard.id]: (currentPhotoIndex - 1 + currentCard.images.length) % currentCard.images.length,
    }));
  };

  const handleLike = (cardToLike?: DatingCard) => {
    const card = cardToLike || currentCard;
    if (!card) return;

    const synthListing: Listing = card.originalListing || {
      id: `synth_${card.userId}`,
      title: card.name,
      slug: `user-${card.userId}`,
      categoryId: 'incontri',
      subcategoryId: card.categoryLabel,
      cityId: selectedCity.id,
      district: card.district || selectedCity.name,
      lat: referenceCoords.lat,
      lng: referenceCoords.lng,
      description: card.bio,
      images: card.images,
      authorId: card.userId,
      authorName: card.name,
      verified: card.isVerified,
      status: 'active',
      promotionTier: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewsCount: 15,
      contactsCount: 1,
      tags: card.interests,
      age: card.age,
    };

    swipeProfile(synthListing, 'like');

    setLikeToast(`❤️ ${card.name}`);
    setTimeout(() => setLikeToast(null), 1500);

    setSwipedCardHistory((prev) => [...prev, { card, action: 'like' }]);
    setCurrentIndex((prev) => prev + 1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleSkip = (cardToSkip?: DatingCard) => {
    const card = cardToSkip || currentCard;
    if (!card) return;

    setSwipedCardHistory((prev) => [...prev, { card, action: 'skip' }]);
    setCurrentIndex((prev) => prev + 1);
    setDragOffset({ x: 0, y: 0 });
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSwipedCardHistory((prev) => prev.slice(0, -1));
      setDragOffset({ x: 0, y: 0 });
    }
  };

  const handleChat = (card: DatingCard) => {
    startConversation(
      card.userId,
      card.name,
      isZh ? `你好 ${card.name}！` : `Ciao ${card.name}!`
    );
    setMobileTab('inbox');
  };

  const handleViewDetails = (card: DatingCard) => {
    if (card.originalListing && onOpenListingModal) {
      onOpenListingModal(card.originalListing);
    } else {
      openUserProfileById(card.userId, card.name, card.images[0]);
    }
  };

  // Touch & Mouse Drag Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current || !isDragging) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset.x > 75) {
      handleLike();
    } else if (dragOffset.x < -75) {
      handleSkip();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    dragStartRef.current = null;
  };

  // Mouse drag support for web desktop / laptop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStartRef.current || !isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset.x > 75) {
      handleLike();
    } else if (dragOffset.x < -75) {
      handleSkip();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    dragStartRef.current = null;
  };

  const rotationDeg = dragOffset.x * 0.08;
  const likeOpacity = Math.min(1, Math.max(0, dragOffset.x / 75));
  const skipOpacity = Math.min(1, Math.max(0, -dragOffset.x / 75));

  return (
    <div className="w-full min-h-[calc(100dvh-3.5rem)] bg-black text-white flex flex-col justify-between pb-16 select-none overflow-x-hidden font-sans">
      
      {/* 1. TOP HEADER (Pure Black/White/Plum Red #E11D48) */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-neutral-800 px-4 pt-3 pb-2">
        {/* Title & City Selector */}
        <div className="flex items-center justify-between mb-2.5">
          <h1 className="text-base font-bold tracking-tight text-white">
            {isZh ? '好友' : 'Amici'}
          </h1>

          <div className="flex items-center gap-1.5 text-xs text-white bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full hover:border-[#E11D48] transition-colors">
            <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
            <select
              value={selectedCity.id}
              onChange={(e) => {
                const found = cities.find((c) => c.id === e.target.value);
                if (found) setSelectedCity(found);
              }}
              className="bg-transparent text-white font-semibold focus:outline-hidden cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c.id} value={c.id} className="bg-neutral-900 text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search bar + Distance Filter button */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder={isZh ? '搜索姓名或兴趣...' : 'Cerca per nome o interessi...'}
              className="w-full bg-neutral-900 text-xs text-white pl-8 pr-3 py-1.5 rounded-xl border border-neutral-800 focus:outline-hidden focus:border-[#E11D48] placeholder:text-neutral-500 transition-colors"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className={`p-1.5 rounded-xl border text-xs flex items-center justify-center transition-all ${
              isFilterDrawerOpen || addressSearch.trim()
                ? 'bg-[#E11D48] text-white border-[#E11D48]'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Collapsible Address / CAP Filter */}
        {isFilterDrawerOpen && (
          <div className="mb-2.5 p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-neutral-200 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>{isZh ? '具体地址或邮编' : 'Indirizzo o CAP'}</span>
              </span>
              <button
                onClick={requestUserLocation}
                className="text-[#E11D48] hover:underline font-semibold"
              >
                {locationStatus === 'granted' ? (isZh ? '已定位 ✓' : 'GPS ✓') : (isZh ? '定位' : 'Usa GPS')}
              </button>
            </div>
            <input
              type="text"
              value={addressSearch}
              onChange={(e) => setAddressSearch(e.target.value)}
              placeholder={isZh ? '输入路名或邮编...' : 'Via, Piazza o CAP...'}
              className="w-full bg-black text-xs text-white px-3 py-1.5 rounded-lg border border-neutral-800 focus:outline-hidden focus:border-[#E11D48]"
            />
          </div>
        )}

        {/* 4 Modes: 推荐 | 附近 (Bologna) | Match | 关注 */}
        <div className="flex items-center gap-1.5 border-b border-neutral-900 pb-2">
          <button
            onClick={() => setActiveMode('recommended')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeMode === 'recommended'
                ? 'bg-[#E11D48] text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isZh ? '推荐' : 'Consigliati'}</span>
          </button>

          <button
            onClick={() => setActiveMode('nearby')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeMode === 'nearby'
                ? 'bg-[#E11D48] text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isZh ? `附近` : `Vicini`}</span>
          </button>

          <button
            onClick={() => setActiveMode('matches')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeMode === 'matches'
                ? 'bg-[#E11D48] text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Match ({datingMatches.length})</span>
          </button>

          <button
            onClick={() => setActiveMode('following')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeMode === 'following'
                ? 'bg-[#E11D48] text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isZh ? `关注 (${followingUserIds.length})` : `Seguiti (${followingUserIds.length})`}</span>
          </button>
        </div>

        {/* Nearby Radius Pills */}
        {activeMode === 'nearby' && (
          <div className="flex items-center gap-2 pt-2 pb-1 overflow-x-auto no-scrollbar">
            {[5, 15, 30, 50].map((r) => (
              <button
                key={r}
                onClick={() => setNearbyRadiusKm(r)}
                className={`px-3 py-0.5 rounded-full text-xs font-bold shrink-0 transition-all border ${
                  nearbyRadiusKm === r
                    ? 'bg-[#E11D48] text-white border-[#E11D48]'
                    : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        )}

        {/* Category Pill Filter */}
        <div className="flex items-center gap-1.5 pt-2 overflow-x-auto no-scrollbar">
          {SEEKING_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-white text-black border-white font-bold'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <span>{isZh ? cat.zh : cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Like Toast */}
      {likeToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#E11D48] text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl flex items-center gap-1.5">
          <Heart className="w-4 h-4 fill-current" />
          <span>{likeToast}</span>
        </div>
      )}

      {/* 2. CARD SWIPE VIEW */}
      <div className="flex-1 w-full max-w-md mx-auto px-4 py-3 flex flex-col justify-center items-center relative">
        
        {activeMode === 'matches' && datingMatches.length === 0 ? (
          <div className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-800 text-[#E11D48] mx-auto flex items-center justify-center mb-4">
              <Flame className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">
              {isZh ? '暂无 Match' : 'Nessun Match'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed mb-6">
              {isZh ? '右滑或点击 ❤️ 喜欢用户，互相喜欢即可直接聊天。' : 'Scorri a destra o tocca ❤️ per mettere Mi Piace e avviare una chat.'}
            </p>
            <button
              onClick={() => setActiveMode('recommended')}
              className="px-6 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl active:scale-95 transition-all"
            >
              {isZh ? '浏览推荐' : 'Sfoglia Consigliati'}
            </button>
          </div>
        ) : !currentCard || currentIndex >= totalCards ? (
          <div className="w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-8 text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-800 text-white mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#E11D48]" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {isZh ? '已浏览完全部卡片' : 'Hai visto tutte le schede'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed mb-6">
              {selectedCity.name} 
              {activeMode === 'nearby' && <span> · {nearbyRadiusKm} km</span>}
              {selectedCategory !== 'all' && (
                <span> · {getCategoryLabel(selectedCategory)}</span>
              )}
            </p>

            <div className="flex flex-col gap-2 max-w-xs mx-auto">
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setSwipedCardHistory([]);
                }}
                className="w-full py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isZh ? '重新浏览' : 'Ricomincia'}</span>
              </button>

              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="w-full py-2.5 bg-neutral-800 text-neutral-200 text-xs font-semibold rounded-xl border border-neutral-700 transition-all active:scale-95"
                >
                  {isZh ? '查看所有分类' : 'Tutte le categorie'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* THE DATING SWIPE CARD */
          <div className="w-full flex flex-col items-center">
            
            {/* Card Index & Distance */}
            <div className="w-full flex items-center justify-between text-xs text-neutral-400 px-1 mb-2 font-mono">
              <span>{currentIndex + 1} / {totalCards}</span>
              <span className="text-[#E11D48] font-semibold flex items-center gap-1 font-sans">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {currentCard.city}
                  {currentCard.distanceKm != null ? ` · ${currentCard.distanceKm} km` : ''}
                </span>
              </span>
            </div>

            {/* Interactive Card */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                transform: `translate(${dragOffset.x}px, ${dragOffset.y * 0.3}px) rotate(${rotationDeg}deg)`,
                transition: isDragging ? 'none' : 'transform 0.25s ease-out',
              }}
              className="w-full h-[480px] sm:h-[520px] rounded-3xl overflow-hidden relative border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col justify-between cursor-grab active:cursor-grabbing"
            >
              {/* Media Layer */}
              <div className="absolute inset-0 z-0 bg-black">
                <img
                  src={currentImage}
                  alt={currentCard.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40 pointer-events-none" />
              </div>

              {/* Swipe Indicators */}
              <div
                style={{ opacity: likeOpacity }}
                className="absolute top-8 left-6 z-30 border-2 border-[#E11D48] text-[#E11D48] font-bold text-lg px-3 py-1 rounded-xl rotate-[-12deg] bg-black/60 pointer-events-none"
              >
                ❤️ {isZh ? '喜欢' : 'MI PIACE'}
              </div>

              <div
                style={{ opacity: skipOpacity }}
                className="absolute top-8 right-6 z-30 border-2 border-white text-white font-bold text-lg px-3 py-1 rounded-xl rotate-[12deg] bg-black/60 pointer-events-none"
              >
                ✕ {isZh ? '跳过' : 'PASSA'}
              </div>

              {/* Multi-photo Tap Navigation */}
              {currentCard.images.length > 1 && (
                <div className="absolute inset-x-0 top-14 bottom-32 z-10 flex">
                  <div
                    onClick={handlePrevPhoto}
                    className="w-1/2 h-full cursor-pointer flex items-center justify-start pl-2 opacity-0 active:opacity-100 transition-opacity"
                  >
                    <div className="p-1.5 rounded-full bg-black/60 text-white">
                      <ChevronLeft className="w-5 h-5" />
                    </div>
                  </div>
                  <div
                    onClick={handleNextPhoto}
                    className="w-1/2 h-full cursor-pointer flex items-center justify-end pr-2 opacity-0 active:opacity-100 transition-opacity"
                  >
                    <div className="p-1.5 rounded-full bg-black/60 text-white">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              )}

              {/* Top Badges */}
              <div className="relative z-20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E11D48] text-white">
                    {currentCard.categoryLabel}
                  </span>

                  {currentCard.isVerified && (
                    <span className="p-1 rounded-full bg-white text-black" title="Verificato">
                      <ShieldCheck className="w-3.5 h-3.5 text-black" />
                    </span>
                  )}
                </div>

                <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/70 border border-neutral-700 text-white flex items-center gap-1">
                  <span className="text-[#E11D48]">⚡</span>
                  <span>{currentCard.compatibilityScore}%</span>
                </div>
              </div>

              {/* Multi-photo Dots */}
              {currentCard.images.length > 1 && (
                <div className="absolute top-14 inset-x-4 z-20 flex gap-1 h-1">
                  {currentCard.images.map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-full transition-all duration-200 ${
                        idx === currentPhotoIndex ? 'bg-[#E11D48] h-1' : 'bg-white/30 h-1'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Bottom Info */}
              <div className="relative z-20 p-5 space-y-2 text-left">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {currentCard.name}
                    </h2>
                    <span className="text-lg text-neutral-300">
                      {currentCard.age}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs text-neutral-300">
                    <MapPin className="w-3 h-3 text-[#E11D48]" />
                    <span>
                      {currentCard.city}
                      {currentCard.distanceKm != null ? ` · ${currentCard.distanceKm} km` : ''}
                    </span>
                  </span>
                </div>

                {/* Bio / Intention */}
                {currentCard.bio && (
                  <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                    {currentCard.bio}
                  </p>
                )}

                {/* Interest Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentCard.interests.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium bg-neutral-900/90 text-neutral-200 px-2 py-0.5 rounded-md border border-neutral-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* View Details Button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleViewDetails(currentCard)}
                    className="w-full py-2 bg-neutral-900/90 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl border border-neutral-800 transition-all flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <span>{isZh ? '查看完整介绍' : 'Vedi Annuncio Completo'}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#E11D48]" />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. BUTTONS (Black, White & Plum Red #E11D48) */}
            <div className="w-full flex items-center justify-center gap-4 mt-4">
              <button
                onClick={handleUndo}
                disabled={currentIndex === 0}
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
                  currentIndex > 0
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                    : 'bg-neutral-900/40 border-neutral-900 text-neutral-600 cursor-not-allowed'
                }`}
                title={isZh ? '撤销' : 'Annulla'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleSkip()}
                className="w-14 h-14 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 flex flex-col items-center justify-center active:scale-90 transition-all shadow-lg"
                title={isZh ? '跳过' : 'Salta'}
              >
                <X className="w-6 h-6 stroke-[2.5]" />
                <span className="text-[9px] font-bold mt-0.5 text-neutral-400">{isZh ? '跳过' : 'Passa'}</span>
              </button>

              <button
                onClick={() => handleChat(currentCard)}
                className="w-12 h-12 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 flex flex-col items-center justify-center active:scale-90 transition-all"
                title={isZh ? '发消息' : 'Messaggio'}
              >
                <MessageCircle className="w-5 h-5 text-[#E11D48]" />
                <span className="text-[9px] font-bold mt-0.5 text-neutral-400">{isZh ? '消息' : 'Chat'}</span>
              </button>

              <button
                onClick={() => handleLike()}
                className="w-16 h-16 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-xl shadow-[#E11D48]/30 flex flex-col items-center justify-center active:scale-90 transition-all"
                title={isZh ? '喜欢' : 'Mi Piace'}
              >
                <Heart className="w-7 h-7 fill-current" />
                <span className="text-[10px] font-bold -mt-0.5">{isZh ? '喜欢' : 'Like'}</span>
              </button>

              <button
                onClick={() => toggleFollowUser(currentCard.userId)}
                className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
                  isFollowingUser(currentCard.userId)
                    ? 'bg-[#E11D48] border-[#E11D48] text-white'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                }`}
                title={isFollowingUser(currentCard.userId) ? (isZh ? '已关注' : 'Seguito') : (isZh ? '关注' : 'Segui')}
              >
                {isFollowingUser(currentCard.userId) ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>

          </div>
        )}

      </div>

      {isComunePickerOpen && (
        <ItalianComunePickerModal
          isOpen={isComunePickerOpen}
          onClose={() => setIsComunePickerOpen(false)}
        />
      )}

    </div>
  );
};
