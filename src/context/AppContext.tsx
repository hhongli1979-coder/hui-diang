import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  City,
  Category,
  Listing,
  Business,
  BookingRequest,
  Conversation,
  AdCampaign,
  ModerationReport,
  ViewMode,
  MobileTab,
  CommentItem,
  ActivityNotification,
  DatingMatch,
  MessageItem,
  SeekingCategory,
} from '../types';
import {
  INITIAL_CITIES,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_BUSINESSES,
  INITIAL_CAMPAIGNS,
  INITIAL_COMMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/initialData';
import {
  calculateDistanceKm,
  Coordinates,
  requestCurrentLocation,
  geocodeItalianAddress,
  calculateCompatibilityScore,
  obfuscateLocationForPrivacy,
} from '../utils/geo';
import { api } from '../services/api';

interface AppContextType {
  // Mobile App Navigation & Dual-mode
  mobileTab: MobileTab;
  setMobileTab: (tab: MobileTab) => void;
  deviceMode: 'responsive' | 'mobile_app' | 'web';
  setDeviceMode: (mode: 'responsive' | 'mobile_app' | 'web') => void;

  // Address, Postal Code (CAP) & Dating Criteria
  addressSearchQuery: string;
  setAddressSearchQuery: (q: string) => void;
  selectedCAP: string;
  setSelectedCAP: (cap: string) => void;
  ageRange: [number, number];
  setAgeRange: (range: [number, number]) => void;
  datingIntention: string;
  setDatingIntention: (intention: string) => void;
  selectedSeekingCategory: SeekingCategory;
  setSelectedSeekingCategory: (cat: SeekingCategory) => void;

  // Dating Matches & Swiping
  datingMatches: DatingMatch[];
  likedProfileIds: string[];
  skippedProfileIds: string[];
  swipeProfile: (targetListing: Listing, action: 'like' | 'skip') => { isMatch: boolean; match?: DatingMatch };
  activeMatchModal: DatingMatch | null;
  setActiveMatchModal: (match: DatingMatch | null) => void;

  // Enhanced Messaging & Real-time Chat
  sendImageMessage: (convId: string, imageUrl: string, caption?: string) => void;
  markConversationRead: (convId: string) => void;
  deleteConversation: (convId: string) => void;

  // Drafts & Creative Works
  myDrafts: Array<Partial<Listing> & { id: string }>;
  saveDraft: (draft: Partial<Listing>) => void;
  deleteDraft: (draftId: string) => void;

  // Privacy & GDPR Export
  exportUserDataJSON: () => void;
  profileVisibility: 'public' | 'followers_only' | 'verified_only';
  setProfileVisibility: (v: 'public' | 'followers_only' | 'verified_only') => void;

  // Following & Relationships
  followingUserIds: string[];
  toggleFollowUser: (userId: string) => void;
  isFollowingUser: (userId: string) => boolean;

  // Comments
  comments: Record<string, CommentItem[]>;
  addComment: (targetId: string, text: string) => void;
  isCommentsDrawerOpen: boolean;
  setIsCommentsDrawerOpen: (open: boolean) => void;
  activeCommentTargetId: string | null;
  setActiveCommentTargetId: (id: string | null) => void;

  // Notifications
  notifications: ActivityNotification[];
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Safety & Blocklist
  blockedUserIds: string[];
  toggleBlockUser: (userId: string) => void;
  isUserBlocked: (userId: string) => boolean;

  // Public Profile Viewing
  viewingUserProfile: User | null;
  setViewingUserProfile: (u: User | null) => void;
  openUserProfileById: (userId: string, fallbackName?: string, fallbackAvatar?: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;

  // Total Unread Messages
  unreadMessagesCount: number;

  // Cities & Categories
  cities: City[];
  categories: Category[];
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  selectedCategory: string; // 'all' or category id
  setSelectedCategory: (catId: string) => void;
  selectedSubcategory: string;
  setSelectedSubcategory: (sub: string) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: 'recommended' | 'distance' | 'newest' | 'price_asc' | 'price_desc';
  setSortBy: (sort: 'recommended' | 'distance' | 'newest' | 'price_asc' | 'price_desc') => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (val: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;

  // Geolocation & Radius
  userLocation: Coordinates | null;
  locationStatus: 'idle' | 'requesting' | 'granted' | 'denied';
  locationError: string | null;
  searchRadiusKm: number; // 1, 5, 10, 25, 50
  setSearchRadiusKm: (radius: number) => void;
  requestUserLocation: () => Promise<void>;
  clearUserLocation: () => void;

  // View Mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Data
  listings: Listing[];
  businesses: Business[];
  filteredListings: Listing[];
  filteredBusinesses: Business[];
  campaigns: AdCampaign[];
  favorites: string[];
  toggleFavorite: (id: string) => void;
  toggleLikeListing: (id: string) => void;
  addCampaign: (campaign: Omit<AdCampaign, 'id' | 'impressions' | 'clicks'>) => void;
  updateCampaign: (id: string, updates: Partial<AdCampaign>) => void;
  startConversationWithListing: (listing: Listing, initialText?: string) => void;
  startConversationWithBusiness: (business: Business, initialText?: string) => void;

  // Active / Detailed Item Modals
  activeListing: Listing | null;
  setActiveListing: (listing: Listing | null) => void;
  activeBusiness: Business | null;
  setActiveBusiness: (business: Business | null) => void;

  // User & Auth
  currentUser: User;
  setCurrentUser: (user: User) => void;
  allUsers: User[];

  // Actions
  addListing: (newListing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'contactsCount'>) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  updateListingLocation: (id: string, locationData: {
    adLocation: string;
    adLatitude: number;
    adLongitude: number;
    adCity?: string;
    adArea?: string;
    locationVisibility?: 'city' | 'area' | 'exact';
  }) => Promise<void>;
  deleteListing: (id: string) => void;
  addBookingRequest: (req: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: 'confirmed' | 'rejected' | 'cancelled') => void;
  bookingRequests: BookingRequest[];

  // Chat & Messaging
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conv: Conversation | null) => void;
  sendMessage: (convId: string, text: string) => void;
  startConversation: (listingId: string, partnerName: string, initialMessage?: string) => Conversation;

  // Reports & Moderation
  reports: ModerationReport[];
  submitReport: (targetType: 'listing' | 'business' | 'message', targetId: string, targetTitle: string, reason: ModerationReport['reason'], comment: string) => void;
  resolveReport: (reportId: string, action: 'resolved' | 'dismissed') => void;

  // Age verification gate
  isAgeVerified: boolean;
  verifyAge: () => void;

  // UI Drawer / Modals
  isPostModalOpen: boolean;
  setIsPostModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isMerchantDashboardOpen: boolean;
  setIsMerchantDashboardOpen: (open: boolean) => void;
  isMessagesDrawerOpen: boolean;
  setIsMessagesDrawerOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cities & Categories
  const [cities] = useState<City[]>(INITIAL_CITIES);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    const saved = localStorage.getItem('amico_city');
    if (saved) {
      const found = INITIAL_CITIES.find((c) => c.id === saved);
      if (found) return found;
    }
    return INITIAL_CITIES[0]; // Bologna by default
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('Tutte');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommended' | 'distance' | 'newest' | 'price_asc' | 'price_desc'>('recommended');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Address, Postal Code (CAP) & Dating Criteria
  const [addressSearchQuery, setAddressSearchQuery] = useState<string>('');
  const [selectedCAP, setSelectedCAP] = useState<string>('');
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 55]);
  const [datingIntention, setDatingIntention] = useState<string>('all');
  const [selectedSeekingCategory, setSelectedSeekingCategory] = useState<SeekingCategory>('all');

  // Dating Matches State
  const [datingMatches, setDatingMatches] = useState<DatingMatch[]>(() => {
    const saved = localStorage.getItem('amica_matches');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'match_1',
            userId: 'user_sofia',
            partnerId: 'user_marco_mi',
            partnerName: 'Marco Brera',
            partnerAvatar: '/src/assets/images/discover_lounge_bologna_1792084200626.jpg',
            matchedAt: 'Oggi, 11:30',
            compatibilityScore: 94,
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('amica_matches', JSON.stringify(datingMatches));
  }, [datingMatches]);

  const [likedProfileIds, setLikedProfileIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('amica_liked_profiles');
    return saved ? JSON.parse(saved) : ['list_bo_01', 'list_bo_02'];
  });

  useEffect(() => {
    localStorage.setItem('amica_liked_profiles', JSON.stringify(likedProfileIds));
  }, [likedProfileIds]);

  const [skippedProfileIds, setSkippedProfileIds] = useState<string[]>([]);
  const [activeMatchModal, setActiveMatchModal] = useState<DatingMatch | null>(null);

  // Drafts
  const [myDrafts, setMyDrafts] = useState<Array<Partial<Listing> & { id: string }>>(() => {
    const saved = localStorage.getItem('amica_drafts');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('amica_drafts', JSON.stringify(myDrafts));
  }, [myDrafts]);

  const saveDraft = (draft: Partial<Listing>) => {
    const draftId = draft.id || `draft_${Date.now()}`;
    setMyDrafts((prev) => {
      const exists = prev.some((d) => d.id === draftId);
      if (exists) {
        return prev.map((d) => (d.id === draftId ? { ...d, ...draft, updatedAt: new Date().toISOString() } : d));
      }
      return [{ ...draft, id: draftId, updatedAt: new Date().toISOString() }, ...prev];
    });
  };

  const deleteDraft = (draftId: string) => {
    setMyDrafts((prev) => prev.filter((d) => d.id !== draftId));
  };

  // Privacy & GDPR
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'followers_only' | 'verified_only'>(() => {
    const saved = localStorage.getItem('amica_profile_visibility');
    return (saved as any) || 'public';
  });

  useEffect(() => {
    localStorage.setItem('amica_profile_visibility', profileVisibility);
  }, [profileVisibility]);

  const exportUserDataJSON = () => {
    const data = {
      app: 'AMICA',
      exportDate: new Date().toISOString(),
      user: currentUser,
      listings: listings.filter((l) => l.authorId === currentUser.id),
      favorites,
      matches: datingMatches,
      conversations,
      settings: {
        profileVisibility,
        selectedCity,
        searchRadiusKm,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amica_backup_${currentUser.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Geolocation
  const [userLocation, setUserLocation] = useState<Coordinates | null>(() => {
    const saved = localStorage.getItem('amico_user_location');
    return saved ? JSON.parse(saved) : null;
  });
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState<number>(25);

  // View Mode & Mobile App Navigation
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');
  const [deviceMode, setDeviceMode] = useState<'responsive' | 'mobile_app' | 'web'>(() => {
    const saved = localStorage.getItem('amica_device_mode');
    return (saved as 'responsive' | 'mobile_app' | 'web') || 'responsive';
  });

  useEffect(() => {
    localStorage.setItem('amica_device_mode', deviceMode);
  }, [deviceMode]);

  // Following & Relationships
  const [followingUserIds, setFollowingUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('amica_following_ids');
    return saved ? JSON.parse(saved) : ['user_marco_mi', 'user_elena_fi'];
  });

  useEffect(() => {
    localStorage.setItem('amica_following_ids', JSON.stringify(followingUserIds));
  }, [followingUserIds]);

  const toggleFollowUser = (userId: string) => {
    setFollowingUserIds((prev) => {
      const isFollowing = prev.includes(userId);
      const next = isFollowing ? prev.filter((id) => id !== userId) : [...prev, userId];

      // Update following count on current user
      setCurrentUser((u) => ({
        ...u,
        followingCount: Math.max(0, (u.followingCount || 38) + (isFollowing ? -1 : 1)),
      }));

      // If newly followed, trigger notification
      if (!isFollowing) {
        const found = allUsers.find((u) => u.id === userId);
        const newNotif: ActivityNotification = {
          id: `notif_${Date.now()}`,
          type: 'follow',
          title: 'Nuovo Seguito',
          text: `Hai iniziato a seguire ${found?.name || 'questo utente'}.`,
          time: 'Adesso',
          avatar: found?.avatar,
          isRead: false,
        };
        setNotifications((prevNotifs) => [newNotif, ...prevNotifs]);
      }

      return next;
    });
  };

  const isFollowingUser = (userId: string) => followingUserIds.includes(userId);

  // Comments & Feedback
  const [comments, setComments] = useState<Record<string, CommentItem[]>>(() => {
    const saved = localStorage.getItem('amica_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  useEffect(() => {
    localStorage.setItem('amica_comments', JSON.stringify(comments));
  }, [comments]);

  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);
  const [activeCommentTargetId, setActiveCommentTargetId] = useState<string | null>(null);

  const addComment = (targetId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: CommentItem = {
      id: `comm_${Date.now()}`,
      targetId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: 'Adesso',
      likesCount: 0,
    };
    setComments((prev) => ({
      ...prev,
      [targetId]: [...(prev[targetId] || []), newComment],
    }));
  };

  // Notifications
  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    const saved = localStorage.getItem('amica_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('amica_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Blocked Users
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('amica_blocked_users');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('amica_blocked_users', JSON.stringify(blockedUserIds));
  }, [blockedUserIds]);

  const toggleBlockUser = (userId: string) => {
    setBlockedUserIds((prev) => {
      const isBlocked = prev.includes(userId);
      return isBlocked ? prev.filter((id) => id !== userId) : [...prev, userId];
    });
  };

  const isUserBlocked = (userId: string) => blockedUserIds.includes(userId);

  // Profile Viewing
  const [viewingUserProfile, setViewingUserProfile] = useState<User | null>(null);

  const openUserProfileById = (userId: string, fallbackName?: string, fallbackAvatar?: string) => {
    const found = allUsers.find((u) => u.id === userId);
    if (found) {
      setViewingUserProfile(found);
    } else {
      setViewingUserProfile({
        id: userId,
        name: fallbackName || 'Utente AMICA',
        username: (fallbackName || 'utente').toLowerCase().replace(/\s+/g, '_'),
        email: 'riservata@amica.it',
        role: 'user',
        avatar: fallbackAvatar || '/src/assets/images/category_incontri_evening_1792082231469.jpg',
        city: selectedCity.name,
        age: 26,
        bio: 'Membro verificato della community AMICA Italia.',
        interests: ['Incontri', 'Aperitivi', 'Viaggi', 'Design'],
        followingCount: 24,
        followersCount: 160,
        likesCount: 520,
        isVerified: true,
        createdAt: '2025-06-01T10:00:00Z',
      });
    }
  };

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  // Age verification state (Italian adult classifieds standard)
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    return localStorage.getItem('amico_age_verified') === 'true';
  });

  const verifyAge = () => {
    setIsAgeVerified(true);
    localStorage.setItem('amico_age_verified', 'true');
  };

  // Listings state with localStorage sync
  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('amico_listings');
    const rawListings: Listing[] = saved ? JSON.parse(saved) : INITIAL_LISTINGS;
    return rawListings.map((l) => ({
      ...l,
      adLocation: l.adLocation || (l.district ? `${l.district}, ${l.cityId ? l.cityId.charAt(0).toUpperCase() + l.cityId.slice(1) : 'Bologna'}` : 'Bologna Centro'),
      adCity: l.adCity || (l.cityId ? l.cityId.charAt(0).toUpperCase() + l.cityId.slice(1) : 'Bologna'),
      adArea: l.adArea || l.district || 'Centro',
      adLatitude: l.adLatitude !== undefined ? l.adLatitude : l.lat,
      adLongitude: l.adLongitude !== undefined ? l.adLongitude : l.lng,
      locationVisibility: l.locationVisibility || 'area',
    }));
  });

  useEffect(() => {
    localStorage.setItem('amico_listings', JSON.stringify(listings));
  }, [listings]);

  // Businesses state
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('amico_businesses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_BUSINESSES.length) {
          return parsed;
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_BUSINESSES;
  });

  useEffect(() => {
    localStorage.setItem('amico_businesses', JSON.stringify(businesses));
  }, [businesses]);

  // Campaigns with local storage
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() => {
    const saved = localStorage.getItem('amico_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  useEffect(() => {
    localStorage.setItem('amico_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('amico_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('amico_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Auth & Roles
  const [allUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('amico_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[1]; // default as Sofia (advertiser) or switchable
  });

  useEffect(() => {
    localStorage.setItem('amico_user', JSON.stringify(currentUser));
  }, [currentUser]);

  // Modals & Drawers
  const [activeListing, setActiveListing] = useState<Listing | null>(null);
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isMerchantDashboardOpen, setIsMerchantDashboardOpen] = useState(false);
  const [isMessagesDrawerOpen, setIsMessagesDrawerOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  // Bookings
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(() => {
    const saved = localStorage.getItem('amico_bookings');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'bk_demo_1',
            businessId: 'biz_bo_01',
            businessName: 'Oasi Serena SPA & Massaggi Olistici',
            serviceId: 'srv_01',
            serviceName: 'Massaggio Rilassante Antistress con Oli Caldi',
            priceEur: 60,
            customerName: 'Matteo R.',
            customerPhone: '+39 347 889 0012',
            customerEmail: 'matteo.r@gmail.com',
            date: '2026-03-28',
            timeSlot: '16:00',
            notes: 'Preferenza per massaggio con pressione media.',
            status: 'confirmed',
            createdAt: '2026-03-24T10:00:00Z',
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('amico_bookings', JSON.stringify(bookingRequests));
  }, [bookingRequests]);

  const addBookingRequest = (req: Omit<BookingRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: BookingRequest = {
      ...req,
      id: `bk_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setBookingRequests((prev) => [newReq, ...prev]);
  };

  const updateBookingStatus = (id: string, status: 'confirmed' | 'rejected' | 'cancelled') => {
    setBookingRequests((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('amico_conversations');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'conv_demo_1',
            listingId: 'list_bo_01',
            listingTitle: 'Sofia – Elegante e riservata in centro',
            partnerName: 'Sofia V.',
            partnerAvatar: '/src/assets/images/verified_profile_preview_1792082231358.jpg',
            lastMessage: 'Buonasera, ricevo domani dalle 15:00 in poi. Ti aspetto!',
            lastTimestamp: 'Ieri, 19:45',
            unreadCount: 1,
            messages: [
              {
                id: 'm1',
                senderId: 'client',
                senderName: 'Tu',
                text: 'Salve Sofia, sei disponibile domani pomeriggio per un incontro in centro?',
                timestamp: 'Ieri, 19:30',
                isMine: true,
              },
              {
                id: 'm2',
                senderId: 'user_sofia',
                senderName: 'Sofia V.',
                text: 'Buonasera, ricevo domani dalle 15:00 in poi. Ti aspetto!',
                timestamp: 'Ieri, 19:45',
                isMine: false,
              },
            ],
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('amico_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  const sendMessage = (convId: string, text: string) => {
    if (!text.trim()) return;
    const newMsg: MessageItem = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: 'Adesso',
      isMine: true,
      status: 'delivered',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastTimestamp: 'Adesso',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    if (activeConversation && activeConversation.id === convId) {
      setActiveConversation((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: text.trim(),
              lastTimestamp: 'Adesso',
              messages: [...prev.messages, newMsg],
            }
          : null
      );
    }

    // Simulated authentic interactive reply from partner after 2.5s
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            const replies = [
              `Piacere di conoscerti! Ti va di fare due chiacchiere su AMICA?`,
              `Ricevuto! Sei della zona di ${selectedCity.name}?`,
              `Grazie per il messaggio! Mi fa molto piacere averti tra i contatti.`,
              `Ottimo! Scambiamoci pure qualche consiglio sui locali in centro!`
            ];
            const autoText = replies[Math.floor(Math.random() * replies.length)];
            const autoMsg: MessageItem = {
              id: `msg_reply_${Date.now()}`,
              senderId: c.partnerName,
              senderName: c.partnerName,
              text: autoText,
              timestamp: 'Adesso',
              isMine: false,
              status: 'read',
            };
            return {
              ...c,
              lastMessage: autoText,
              lastTimestamp: 'Adesso',
              unreadCount: activeConversation?.id === convId ? 0 : (c.unreadCount || 0) + 1,
              messages: [...c.messages, autoMsg],
            };
          }
          return c;
        })
      );
    }, 2500);
  };

  const sendImageMessage = (convId: string, imageUrl: string, caption?: string) => {
    const text = caption?.trim() || '📷 Immagine inviata';
    const newMsg: MessageItem = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      imageUrl,
      timestamp: 'Adesso',
      isMine: true,
      status: 'delivered',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text,
            lastTimestamp: 'Adesso',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    if (activeConversation && activeConversation.id === convId) {
      setActiveConversation((prev) =>
        prev
          ? {
              ...prev,
              lastMessage: text,
              lastTimestamp: 'Adesso',
              messages: [...prev.messages, newMsg],
            }
          : null
      );
    }
  };

  const markConversationRead = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            unreadCount: 0,
            messages: c.messages.map((m) => (!m.isMine ? { ...m, status: 'read' as const } : m)),
          };
        }
        return c;
      })
    );
  };

  const deleteConversation = (convId: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== convId));
    if (activeConversation && activeConversation.id === convId) {
      setActiveConversation(null);
    }
  };

  const swipeProfile = (targetListing: Listing, action: 'like' | 'skip') => {
    if (action === 'skip') {
      setSkippedProfileIds((prev) => [...prev, targetListing.id]);
      return { isMatch: false };
    }

    setLikedProfileIds((prev) => [...prev, targetListing.id]);
    toggleLikeListing(targetListing.id);

    // Mutual match logic: genuine match if not own profile
    if (targetListing.authorId !== currentUser.id) {
      const compScore = calculateCompatibilityScore(
        currentUser,
        { tags: targetListing.tags, intention: targetListing.intention, city: targetListing.district }
      );

      const matchObj: DatingMatch = {
        id: `match_${Date.now()}`,
        userId: currentUser.id,
        partnerId: targetListing.authorId,
        partnerName: targetListing.authorName,
        partnerAvatar: targetListing.authorAvatar || targetListing.images[0],
        matchedAt: 'Adesso',
        compatibilityScore: compScore,
      };

      setDatingMatches((prev) => [matchObj, ...prev]);
      setActiveMatchModal(matchObj);

      // Trigger high priority match notification
      const matchNotif: ActivityNotification = {
        id: `notif_${Date.now()}`,
        type: 'like',
        title: '🎉 È un Match!',
        text: `Tu e ${targetListing.authorName} vi siete piaciuti! Compatibilità calcolata al ${compScore}%.`,
        time: 'Adesso',
        avatar: targetListing.authorAvatar || targetListing.images[0],
        isRead: false,
      };
      setNotifications((prev) => [matchNotif, ...prev]);

      // Initialize private conversation
      startConversation(
        targetListing.id,
        targetListing.authorName,
        `Ciao ${targetListing.authorName}! Abbiamo appena fatto Match su AMICA con compatibilità al ${compScore}%! 🎉`
      );

      return { isMatch: true, match: matchObj };
    }

    return { isMatch: false };
  };

  const startConversation = (listingId: string, partnerName: string, initialMessage?: string): Conversation => {
    const existing = conversations.find((c) => c.listingId === listingId);
    if (existing) {
      if (initialMessage) {
        sendMessage(existing.id, initialMessage);
      }
      setActiveConversation(existing);
      setIsMessagesDrawerOpen(true);
      return existing;
    }

    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      listingId,
      listingTitle: partnerName,
      partnerName,
      lastMessage: initialMessage || 'Nuova conversazione avviata',
      lastTimestamp: 'Adesso',
      unreadCount: 0,
      messages: initialMessage
        ? [
            {
              id: `msg_${Date.now()}`,
              senderId: currentUser.id,
              senderName: currentUser.name,
              text: initialMessage,
              timestamp: 'Adesso',
              isMine: true,
              status: 'delivered',
            },
          ]
        : [],
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversation(newConv);
    setIsMessagesDrawerOpen(true);
    return newConv;
  };

  // Moderation reports
  const [reports, setReports] = useState<ModerationReport[]>(() => {
    const saved = localStorage.getItem('amico_reports');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'rep_01',
            targetType: 'listing',
            targetId: 'list_bo_04',
            targetTitle: 'Alessandro – Ragazzo atletico',
            reason: 'spam',
            comment: 'Verificare autenticità del profilo telegram.',
            reportedAt: '2026-03-24T12:00:00Z',
            status: 'pending',
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem('amico_reports', JSON.stringify(reports));
  }, [reports]);

  const submitReport = (
    targetType: 'listing' | 'business' | 'message',
    targetId: string,
    targetTitle: string,
    reason: ModerationReport['reason'],
    comment: string
  ) => {
    const rep: ModerationReport = {
      id: `rep_${Date.now()}`,
      targetType,
      targetId,
      targetTitle,
      reason,
      comment,
      reportedAt: new Date().toISOString(),
      status: 'pending',
    };
    setReports((prev) => [rep, ...prev]);
  };

  const resolveReport = (reportId: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: action } : r))
    );
  };

  // Real location request
  const requestUserLocation = async () => {
    setLocationStatus('requesting');
    setLocationError(null);
    try {
      const coords = await requestCurrentLocation();
      setUserLocation(coords);
      setLocationStatus('granted');
      localStorage.setItem('amico_user_location', JSON.stringify(coords));

      // Find closest city
      let closestCity = cities[0];
      let minDistance = Infinity;
      cities.forEach((city) => {
        const d = calculateDistanceKm(coords.lat, coords.lng, city.lat, city.lng);
        if (d < minDistance) {
          minDistance = d;
          closestCity = city;
        }
      });
      setSelectedCity(closestCity);
      localStorage.setItem('amico_city', closestCity.id);
    } catch (err: unknown) {
      setLocationStatus('denied');
      setLocationError(err instanceof Error ? err.message : 'Errore posizione.');
    }
  };

  const clearUserLocation = () => {
    setUserLocation(null);
    setLocationStatus('idle');
    localStorage.removeItem('amico_user_location');
  };

  // Listing creation & mutations
  const addListing = (
    newListing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount' | 'contactsCount'>
  ) => {
    const now = new Date().toISOString();
    const listing: Listing = {
      ...newListing,
      id: `list_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
      viewsCount: 1,
      contactsCount: 0,
    };
    setListings((prev) => [listing, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
    );
  };

  const updateListingLocation = async (
    id: string,
    locationData: {
      adLocation: string;
      adLatitude: number;
      adLongitude: number;
      adCity?: string;
      adArea?: string;
      locationVisibility?: 'city' | 'area' | 'exact';
    }
  ) => {
    updateListing(id, {
      adLocation: locationData.adLocation,
      adLatitude: locationData.adLatitude,
      adLongitude: locationData.adLongitude,
      lat: locationData.adLatitude,
      lng: locationData.adLongitude,
      adCity: locationData.adCity,
      adArea: locationData.adArea,
      district: locationData.adArea || locationData.adLocation,
      locationVisibility: locationData.locationVisibility || 'area',
    });

    try {
      await api.updateAdLocation(id, {
        userId: currentUser.id,
        ...locationData,
      });
    } catch (err) {
      console.warn('[updateAdLocation error]', err);
    }
  };

  const deleteListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  const toggleLikeListing = (id: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const isLiked = !item.isLiked;
          const currentLikes = item.likesCount ?? 0;
          const nextLikes = isLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
          return { ...item, isLiked, likesCount: nextLikes };
        }
        return item;
      })
    );
  };

  const addCampaign = (
    newCamp: Omit<AdCampaign, 'id' | 'impressions' | 'clicks'>
  ) => {
    const camp: AdCampaign = {
      ...newCamp,
      id: `camp_${Date.now()}`,
      impressions: 1,
      clicks: 0,
      enquiries: 0,
      conversions: 0,
      active: true,
      status: 'active',
    };
    setCampaigns((prev) => [camp, ...prev]);
  };

  const updateCampaign = (id: string, updates: Partial<AdCampaign>) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const startConversationWithListing = (listing: Listing, initialText?: string) => {
    startConversation(
      listing.id,
      listing.authorName,
      initialText || `Salve ${listing.authorName}, ho visto il tuo annuncio su AMICA: "${listing.title.slice(0, 45)}..." e vorrei maggiori informazioni.`
    );
  };

  const startConversationWithBusiness = (business: Business, initialText?: string) => {
    startConversation(
      business.id,
      business.name,
      initialText || `Salve ${business.name}, vorrei richiedere informazioni sui vostri servizi e disponibilità.`
    );
  };

  // Geocoded coordinates from address query or CAP
  const geocodedAddressCoords = React.useMemo(() => {
    const q = addressSearchQuery.trim() || selectedCAP.trim();
    if (!q) return null;
    return geocodeItalianAddress(q, selectedCity);
  }, [addressSearchQuery, selectedCAP, selectedCity]);

  // Filter listings based on current selections and calculate exact real distances & compatibility
  const filteredListings = listings
    .filter((item) => {
      // Blocked author filter
      if (blockedUserIds.includes(item.authorId)) return false;

      // Must be active unless admin or owner
      if (item.status !== 'active' && currentUser.role !== 'admin' && item.authorId !== currentUser.id) {
        return false;
      }

      // STRICT DISTANCE & LOCATION LOGIC:
      // Reference coordinates: GPS > Geocoded Comune/Address > selectedCity
      const refLat = userLocation?.lat ?? geocodedAddressCoords?.lat ?? selectedCity?.lat ?? 43.7696;
      const refLng = userLocation?.lng ?? geocodedAddressCoords?.lng ?? selectedCity?.lng ?? 11.2558;
      const dist = calculateDistanceKm(refLat, refLng, item.lat, item.lng);

      // Rule: Strict distance limit. If user is in Firenze, ONLY return users whose real distance
      // is <= searchRadiusKm (e.g. 5, 15, 30, 50, 100). Never backfill from Roma or Milano!
      if (dist > searchRadiusKm) {
        return false;
      }

      // Seeking Category Filter (所有类别, 女子寻男, 男寻女, 男人寻找男人, 女人寻找女人, 情侣, 我在寻找朋友, 我在寻找我的灵魂伴侣)
      if (selectedSeekingCategory !== 'all') {
        const itemCat = item.seekingCategory || (
          item.subcategoryId?.toLowerCase().includes('donna cerca uomo') || (item.gender === 'donna' && item.targetGender === 'uomo') ? 'donna_cerca_uomo' :
          item.subcategoryId?.toLowerCase().includes('uomo cerca donna') || (item.gender === 'uomo' && item.targetGender === 'donna') ? 'uomo_cerca_donna' :
          item.subcategoryId?.toLowerCase().includes('uomo cerca uomo') || (item.gender === 'uomo' && item.targetGender === 'uomo') ? 'uomo_cerca_uomo' :
          item.subcategoryId?.toLowerCase().includes('donna cerca donna') || (item.gender === 'donna' && item.targetGender === 'donna') ? 'donna_cerca_donna' :
          item.gender === 'coppia' || item.subcategoryId?.toLowerCase().includes('coppie') ? 'coppie' :
          item.intention === 'amicizia' ? 'amicizia' :
          item.intention === 'relazione' || item.intention === 'fidanzato' || item.intention === 'fidanzata' ? 'anima_gemella' :
          'donna_cerca_uomo'
        );
        if (itemCat !== selectedSeekingCategory) {
          return false;
        }
      }

      // Age range filter
      if (item.age && (item.age < ageRange[0] || item.age > ageRange[1])) {
        return false;
      }

      // Dating intention filter
      if (datingIntention !== 'all') {
        const matchesIntention =
          item.intention === datingIntention ||
          (item.tags && item.tags.some((t) => t.toLowerCase().includes(datingIntention)));
        if (!matchesIntention) return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (item.categoryId !== selectedCategory) return false;
      }

      // Subcategory filter
      if (selectedSubcategory && selectedSubcategory !== 'Tutte' && selectedSubcategory !== 'Tutti') {
        if (item.subcategoryId !== selectedSubcategory) return false;
      }

      // Verified only
      if (verifiedOnly && !item.verified) return false;

      // Price filter (if has price)
      if (item.ratePerHour && (item.ratePerHour < priceRange[0] || item.ratePerHour > priceRange[1])) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesDistrict = item.district.toLowerCase().includes(q);
        const matchesAuthor = item.authorName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesDistrict && !matchesAuthor) return false;
      }

      return true;
    })
    .map((item) => {
      // Attach calculated distance and compatibility score
      const refLat = geocodedAddressCoords ? geocodedAddressCoords.lat : (userLocation ? userLocation.lat : selectedCity.lat);
      const refLng = geocodedAddressCoords ? geocodedAddressCoords.lng : (userLocation ? userLocation.lng : selectedCity.lng);
      const dist = calculateDistanceKm(refLat, refLng, item.lat, item.lng);
      const compScore = calculateCompatibilityScore(
        currentUser,
        { tags: item.tags, intention: item.intention, city: item.district }
      );
      return { ...item, distanceKm: dist, compatibilityScore: compScore };
    })
    .sort((a, b) => {
      // Promotion priority first
      if (a.promotionTier === 'top_city' && b.promotionTier !== 'top_city') return -1;
      if (b.promotionTier === 'top_city' && a.promotionTier !== 'top_city') return 1;

      if (sortBy === 'distance') {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'price_asc') {
        return (a.ratePerHour || 0) - (b.ratePerHour || 0);
      }
      if (sortBy === 'price_desc') {
        return (b.ratePerHour || 0) - (a.ratePerHour || 0);
      }
      // Recommended: verified first, then strictly real distance ascending!
      if (a.verified && !b.verified) return -1;
      if (!a.verified && b.verified) return 1;
      return (a.distanceKm || 0) - (b.distanceKm || 0);
    });

  // Filter businesses
  const filteredBusinesses = businesses.filter((b) => {
    if (selectedCity && b.cityId !== selectedCity.id) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.district.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <AppContext.Provider
      value={{
        mobileTab,
        setMobileTab,
        deviceMode,
        setDeviceMode,
        addressSearchQuery,
        setAddressSearchQuery,
        selectedCAP,
        setSelectedCAP,
        ageRange,
        setAgeRange,
        datingIntention,
        setDatingIntention,
        datingMatches,
        likedProfileIds,
        skippedProfileIds,
        swipeProfile,
        activeMatchModal,
        setActiveMatchModal,
        sendImageMessage,
        markConversationRead,
        deleteConversation,
        myDrafts,
        saveDraft,
        deleteDraft,
        exportUserDataJSON,
        profileVisibility,
        setProfileVisibility,
        followingUserIds,
        toggleFollowUser,
        isFollowingUser,
        comments,
        addComment,
        isCommentsDrawerOpen,
        setIsCommentsDrawerOpen,
        activeCommentTargetId,
        setActiveCommentTargetId,
        notifications,
        markAllNotificationsRead,
        unreadNotificationsCount,
        blockedUserIds,
        toggleBlockUser,
        isUserBlocked,
        viewingUserProfile,
        setViewingUserProfile,
        openUserProfileById,
        updateUserProfile,
        unreadMessagesCount,
        cities,
        categories,
        selectedCity,
        setSelectedCity: (city) => {
          setSelectedCity(city);
          localStorage.setItem('amico_city', city.id);
        },
        selectedCategory,
        setSelectedCategory,
        selectedSeekingCategory,
        setSelectedSeekingCategory,
        selectedSubcategory,
        setSelectedSubcategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        verifiedOnly,
        setVerifiedOnly,
        priceRange,
        setPriceRange,
        userLocation,
        locationStatus,
        locationError,
        searchRadiusKm,
        setSearchRadiusKm,
        requestUserLocation,
        clearUserLocation,
        viewMode,
        setViewMode,
        listings,
        businesses,
        filteredListings,
        filteredBusinesses,
        campaigns,
        favorites,
        toggleFavorite,
        activeListing,
        setActiveListing,
        activeBusiness,
        setActiveBusiness,
        currentUser,
        setCurrentUser,
        allUsers,
        addListing,
        updateListing,
        updateListingLocation,
        deleteListing,
        addBookingRequest,
        updateBookingStatus,
        bookingRequests,
        conversations,
        activeConversation,
        setActiveConversation,
        sendMessage,
        startConversation,
        reports,
        submitReport,
        resolveReport,
        isAgeVerified,
        verifyAge,
        isPostModalOpen,
        setIsPostModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isMerchantDashboardOpen,
        setIsMerchantDashboardOpen,
        isMessagesDrawerOpen,
        setIsMessagesDrawerOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        toggleLikeListing,
        addCampaign,
        updateCampaign,
        startConversationWithListing,
        startConversationWithBusiness,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
