export type Role = 'visitor' | 'user' | 'advertiser' | 'business_owner' | 'moderator' | 'admin';

export type SeekingCategory =
  | 'all'
  | 'donna_cerca_uomo'      // 女子寻男
  | 'uomo_cerca_donna'      // 男寻女
  | 'uomo_cerca_uomo'       // 男人寻找男人
  | 'donna_cerca_donna'     // 女人寻找女人
  | 'coppie'                // 情侣
  | 'amicizia'              // 我在寻找朋友
  | 'anima_gemella';        // 我在寻找我的灵魂伴侣

export interface SeekingCategoryOption {
  id: SeekingCategory;
  label: string;
  zh: string;
}

export const SEEKING_CATEGORIES: SeekingCategoryOption[] = [
  { id: 'all', label: 'Tutti i generi e desideri', zh: '所有类别' },
  { id: 'donna_cerca_uomo', label: 'Donna cerca Uomo', zh: '女子寻男' },
  { id: 'uomo_cerca_donna', label: 'Uomo cerca Donna', zh: '男寻女' },
  { id: 'uomo_cerca_uomo', label: 'Uomo cerca Uomo', zh: '男人寻找男人' },
  { id: 'donna_cerca_donna', label: 'Donna cerca Donna', zh: '女人寻找女人' },
  { id: 'coppie', label: 'Coppie & Incontri a Tre', zh: '情侣' },
  { id: 'amicizia', label: 'Amicizia & Nuove Conoscenze', zh: '我在寻找朋友' },
  { id: 'anima_gemella', label: 'Anima Gemella & Relazione Seria', zh: '我在寻找我的灵魂伴侣' },
];

export interface ItalianComune {
  id: string;
  name: string;
  region: string;
  province: string;
  provinceCode: string;
  postalCode: string;
  lat: number;
  lng: number;
  population?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  username?: string;
  phone?: string;
  isVerified?: boolean;
  avatar?: string;
  photos?: string[];
  bio?: string;
  city?: string;
  province?: string;
  comune?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  locationVisibility?: 'city_only' | 'district' | 'exact';
  age?: number;
  gender?: 'donna' | 'uomo' | 'coppia' | 'trans';
  interests?: string[];
  seekingCategory?: SeekingCategory;
  onlineStatus?: 'online' | 'just_now' | 'five_min_ago' | 'today' | 'yesterday';
  lastActive?: string;
  showOnlineStatus?: boolean;
  followingCount?: number;
  followersCount?: number;
  likesCount?: number;
  createdAt: string;
}

export type MobileTab = 'home' | 'friends' | 'create' | 'inbox' | 'profile';

export interface CommentItem {
  id: string;
  targetId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
  likesCount?: number;
}

export interface ActivityNotification {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'system';
  title: string;
  text: string;
  time: string;
  avatar?: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  region: string;
  lat: number;
  lng: number;
  listingCount: number;
  popularDistricts: string[];
  description: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  isAdult: boolean;
  isBusinessOriented?: boolean;
  subcategories: string[];
  seoTitle: string;
  seoDescription: string;
}

export type ListingStatus = 'active' | 'pending' | 'draft' | 'paused' | 'rejected';
export type PromotionTier = 'none' | 'highlighted' | 'top_city' | 'vetrina_home';

export type ViewMode = 'home' | 'discover' | 'grid' | 'map' | 'split';

export interface Listing {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  subcategoryId: string;
  cityId: string;
  district: string;
  address?: string;
  lat: number;
  lng: number;
  adLocation?: string;
  adCity?: string;
  adArea?: string;
  adLatitude?: number;
  adLongitude?: number;
  locationVisibility?: 'city' | 'area' | 'exact';
  description: string;
  images: string[];
  ratePerHour?: number;
  phone?: string;
  whatsapp?: string;
  telegram?: string;
  verified: boolean;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  status: ListingStatus;
  promotionTier: PromotionTier;
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  contactsCount: number;
  likesCount?: number;
  isLiked?: boolean;
  tags?: string[];
  distanceKm?: number;
  compatibilityScore?: number;
  age?: number;
  intention?: 'fidanzato' | 'fidanzata' | 'relazione' | 'amante' | 'incontri' | 'amicizia' | 'chiacchiere' | 'aperitivo' | 'massaggi';
  seekingCategory?: SeekingCategory;
  targetGender?: 'uomo' | 'donna' | 'tutti';
  postalCode?: string;
  gender?: 'donna' | 'uomo' | 'coppia' | 'trans';
  onlineStatus?: 'online' | 'just_now' | 'five_min_ago' | 'today' | 'yesterday';
  moderationComment?: string;
}

export interface DatingMatch {
  id: string;
  userId: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  matchedAt: string;
  compatibilityScore: number;
}

export interface BusinessService {
  id: string;
  name: string;
  durationMin: number;
  priceEur: number;
  description: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: 'massaggi_spa' | 'centro_estetico' | 'spa_wellness';
  cityId: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp?: string;
  website?: string;
  description: string;
  images: string[];
  videos?: string[];
  videoUrl?: string;
  openingHours: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  isPromoted: boolean;
  services: BusinessService[];
  authorId: string;
}

export interface BookingRequest {
  id: string;
  businessId: string;
  businessName: string;
  serviceId: string;
  serviceName: string;
  priceEur: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled';
  createdAt: string;
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  status?: 'sending' | 'delivered' | 'read' | 'failed';
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  listingId?: string;
  listingTitle?: string;
  businessId?: string;
  partnerId?: string;
  partnerName: string;
  partnerAvatar?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  isBlocked?: boolean;
  messages: MessageItem[];
}

export interface AdCampaign {
  id: string;
  title: string;
  type: 'vetrina_home' | 'top_city' | 'category_spotlight' | 'discover_feed';
  cityId: string;
  targetCategory?: string;
  impressions: number;
  clicks: number;
  enquiries?: number;
  conversions?: number;
  budgetEur: number;
  dailyBudgetEur?: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
  bannerImage?: string;
  linkUrl: string;
  status?: 'active' | 'pending_review' | 'paused' | 'completed';
}

export interface ModerationReport {
  id: string;
  targetType: 'listing' | 'business' | 'message';
  targetId: string;
  targetTitle: string;
  reason: 'spam' | 'underage' | 'fake' | 'fraud' | 'copyright' | 'other';
  comment: string;
  reportedAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
