/**
 * Real Backend Database Layer for AMICA
 * Supports Italian Comuni geocoding, user profiles, ads with server-controlled approval,
 * interactions (like, follow, block, report), mutual matches, real chat persistence, and photos.
 */

import { ITALIAN_COMUNI } from '../src/data/italianComuni';
import { SeekingCategory } from '../src/types';

export interface DBUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'advertiser' | 'business_owner' | 'admin' | 'moderator';
  avatar?: string;
  bio?: string;
  city: string;
  comune: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  locationVisibility: 'city_only' | 'district' | 'exact';
  age: number;
  gender: 'donna' | 'uomo' | 'coppia' | 'trans';
  seekingCategory: SeekingCategory;
  interests: string[];
  onlineStatus: 'online' | 'just_now' | 'five_min_ago' | 'today';
  showOnlineStatus: boolean;
  lastActive: string;
  isVerified: boolean;
  createdAt: string;
}

export type AdStatus = 'draft' | 'pending' | 'reviewing' | 'approved' | 'rejected' | 'paused';

export interface DBAd {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  description: string;
  cityId: string;
  cityName: string;
  comune: string;
  district: string;
  latitude: number;
  longitude: number;
  adLocation?: string;
  adCity?: string;
  adArea?: string;
  adLatitude?: number;
  adLongitude?: number;
  locationVisibility?: 'city' | 'area' | 'exact';
  age: number;
  gender: 'donna' | 'uomo' | 'coppia' | 'trans';
  seekingCategory: SeekingCategory;
  category: string;
  interests: string[];
  languages: string[];
  images: string[];
  imageStatuses?: Array<{ url: string; status: 'uploading' | 'processing' | 'reviewing' | 'approved' | 'rejected' }>;
  ratePerHour?: number;
  status: AdStatus;
  moderationComment?: string;
  verified: boolean;
  viewsCount: number;
  likesCount: number;
  contactsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DBInteraction {
  id: string;
  userId: string;
  targetUserId: string;
  action: 'view' | 'like' | 'skip' | 'favorite' | 'follow' | 'block' | 'report';
  createdAt: string;
}

export interface DBMatch {
  id: string;
  userA: string;
  userB: string;
  matchedAt: string;
  status: 'active' | 'unmatched';
}

export interface DBMessage {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
  imageUrl?: string;
  status: 'sending' | 'delivered' | 'read';
  createdAt: string;
  readAt?: string;
}

export interface DBConversation {
  id: string;
  participantIds: [string, string];
  listingId?: string;
  lastMessage: string;
  lastTimestamp: string;
  createdAt: string;
}

export interface DBReport {
  id: string;
  reporterId: string;
  targetType: 'user' | 'ad' | 'photo' | 'message';
  targetId: string;
  targetTitle?: string;
  reason: 'spam' | 'underage' | 'fake' | 'fraud' | 'copyright' | 'other';
  comment: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  createdAt: string;
}

// Calculate Haversine distance in Kilometers
export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

class InMemoryDatabase {
  users: Map<string, DBUser> = new Map();
  ads: Map<string, DBAd> = new Map();
  interactions: DBInteraction[] = [];
  matches: Map<string, DBMatch> = new Map();
  conversations: Map<string, DBConversation> = new Map();
  messages: DBMessage[] = [];
  reports: DBReport[] = [];

  constructor() {
    this.seedInitialData();
  }

  seedInitialData() {
    // 1. Current logged-in demo user (Marco Rossi)
    const currentUser: DBUser = {
      id: 'usr_marco_current',
      name: 'Marco Rossi',
      email: 'marco.rossi@amica.it',
      phone: '+39 347 1122334',
      role: 'user',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Professionista a Firenze, amante dei viaggi, dell\'arte e dei buoni aperitivi in centro.',
      city: 'Firenze',
      comune: 'Firenze',
      province: 'Firenze',
      postalCode: '50121',
      latitude: 43.7696,
      longitude: 11.2558,
      locationVisibility: 'city_only',
      age: 32,
      gender: 'uomo',
      seekingCategory: 'donna_cerca_uomo',
      interests: ['Arte', 'Cucina Toscana', 'Trekking', 'Cinema'],
      onlineStatus: 'online',
      showOnlineStatus: true,
      lastActive: new Date().toISOString(),
      isVerified: true,
      createdAt: '2026-01-10T10:00:00.000Z',
    };
    this.users.set(currentUser.id, currentUser);

    // 2. Verified real users in and around Firenze (Real distances: 2 km, 5 km, 9 km, 14 km, 22 km)
    const firenzeUsers: DBUser[] = [
      {
        id: 'usr_anna_fi',
        name: 'Anna Bianchi',
        email: 'anna.fi@amica.it',
        phone: '+39 349 8877665',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        bio: 'Cerco una persona complice per serate tranquille, passeggiate sui Lungarni e conversazioni autentiche.',
        city: 'Firenze',
        comune: 'Firenze',
        province: 'Firenze',
        postalCode: '50122',
        latitude: 43.7710, // ~1.8 km from center
        longitude: 11.2600,
        locationVisibility: 'city_only',
        age: 28,
        gender: 'donna',
        seekingCategory: 'donna_cerca_uomo',
        interests: ['Pittura', 'Aperitivi', 'Musica Indie', 'Gatti'],
        onlineStatus: 'online',
        showOnlineStatus: true,
        lastActive: new Date().toISOString(),
        isVerified: true,
        createdAt: '2026-02-01T10:00:00.000Z',
      },
      {
        id: 'usr_maria_fi',
        name: 'Maria Bellini',
        email: 'maria.fi@amica.it',
        phone: '+39 340 5544332',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
        bio: 'Architetto a Firenze. Credo nelle vibrazioni sincere e nelle persone che sanno ascoltare.',
        city: 'Firenze',
        comune: 'Firenze',
        province: 'Firenze',
        postalCode: '50125',
        latitude: 43.7540, // ~4.8 km (Scandicci border)
        longitude: 11.2200,
        locationVisibility: 'city_only',
        age: 31,
        gender: 'donna',
        seekingCategory: 'donna_cerca_uomo',
        interests: ['Design', 'Vino Chianti', 'Fotografia'],
        onlineStatus: 'just_now',
        showOnlineStatus: true,
        lastActive: new Date(Date.now() - 4 * 60000).toISOString(),
        isVerified: true,
        createdAt: '2026-02-15T10:00:00.000Z',
      },
      {
        id: 'usr_laura_fi',
        name: 'Laura Moretti',
        email: 'laura.fi@amica.it',
        phone: '+39 333 9988771',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
        bio: 'Sesto Fiorentino. Cerco la mia anima gemella, qualcuno con cui costruire qualcosa di duraturo.',
        city: 'Firenze',
        comune: 'Sesto Fiorentino',
        province: 'Firenze',
        postalCode: '50019',
        latitude: 43.8331, // ~8.9 km from Florence center
        longitude: 11.2003,
        locationVisibility: 'city_only',
        age: 29,
        gender: 'donna',
        seekingCategory: 'anima_gemella',
        interests: ['Letteratura', 'Natura', 'Cucina Sana'],
        onlineStatus: 'five_min_ago',
        showOnlineStatus: true,
        lastActive: new Date(Date.now() - 15 * 60000).toISOString(),
        isVerified: true,
        createdAt: '2026-03-01T10:00:00.000Z',
      },
      {
        id: 'usr_sofia_po',
        name: 'Sofia Neri',
        email: 'sofia.po@amica.it',
        phone: '+39 328 1122445',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        bio: 'Prato centro. Solare, ironica, amo viaggiare e conoscere gente aperta di mente.',
        city: 'Prato',
        comune: 'Prato',
        province: 'Prato',
        postalCode: '59100',
        latitude: 43.8777, // ~17.5 km from Florence
        longitude: 11.1022,
        locationVisibility: 'city_only',
        age: 26,
        gender: 'donna',
        seekingCategory: 'donna_cerca_uomo',
        interests: ['Moda', 'Palestra', 'Viaggi'],
        onlineStatus: 'today',
        showOnlineStatus: true,
        lastActive: new Date(Date.now() - 3600000).toISOString(),
        isVerified: true,
        createdAt: '2026-03-10T10:00:00.000Z',
      },
      {
        id: 'usr_elena_pt',
        name: 'Elena Conti',
        email: 'elena.pt@amica.it',
        phone: '+39 345 6677889',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
        bio: 'Pistoia. Cerco nuove amicizie sincere e compagni per escursioni in collina.',
        city: 'Pistoia',
        comune: 'Pistoia',
        province: 'Pistoia',
        postalCode: '51100',
        latitude: 43.9333, // ~33 km from Florence
        longitude: 10.9167,
        locationVisibility: 'city_only',
        age: 30,
        gender: 'donna',
        seekingCategory: 'amicizia',
        interests: ['Trekking', 'Fotografia paesaggistica', 'Teatro'],
        onlineStatus: 'today',
        showOnlineStatus: false,
        lastActive: new Date(Date.now() - 7200000).toISOString(),
        isVerified: true,
        createdAt: '2026-03-12T10:00:00.000Z',
      },
    ];

    firenzeUsers.forEach((u) => this.users.set(u.id, u));

    // 3. Corresponding Approved Ads for these users
    const initialAds: DBAd[] = [
      {
        id: 'ad_anna_01',
        userId: 'usr_anna_fi',
        authorName: 'Anna Bianchi',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        title: 'Anna · Momenti autentici e un buon aperitivo a Firenze',
        description: 'Ciao! Sono Anna, 28 anni a Firenze centro. Cerco un ragazzo con cui trascorrere serate piacevoli, condividere risate e un buon bicchiere di vino senza fretta né maschere.',
        cityId: 'firenze',
        cityName: 'Firenze',
        comune: 'Firenze',
        district: 'Centro Storico / Santa Croce',
        latitude: 43.7710,
        longitude: 11.2600,
        age: 28,
        gender: 'donna',
        seekingCategory: 'donna_cerca_uomo',
        category: 'incontri',
        interests: ['Aperitivi', 'Arte contemporanea', 'Viaggi'],
        languages: ['Italiano', 'Inglese'],
        images: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        verified: true,
        viewsCount: 142,
        likesCount: 19,
        contactsCount: 7,
        createdAt: '2026-03-01T12:00:00.000Z',
        updatedAt: '2026-03-01T12:00:00.000Z',
      },
      {
        id: 'ad_maria_02',
        userId: 'usr_maria_fi',
        authorName: 'Maria Bellini',
        authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
        title: 'Maria · Connessioni sincere e cene a lume di candela',
        description: 'Architetto a Firenze. Mi piace la bellezza dei dettagli e le conversazioni che ti arricchiscono. Cerco un uomo maturo, curato ed educato.',
        cityId: 'firenze',
        cityName: 'Firenze',
        comune: 'Firenze',
        district: 'Oltrarno / Porta Romana',
        latitude: 43.7540,
        longitude: 11.2200,
        age: 31,
        gender: 'donna',
        seekingCategory: 'donna_cerca_uomo',
        category: 'incontri',
        interests: ['Architettura', 'Vini pregiati', 'Mostre d\'arte'],
        languages: ['Italiano', 'Francese'],
        images: [
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        verified: true,
        viewsCount: 210,
        likesCount: 34,
        contactsCount: 12,
        createdAt: '2026-03-05T14:30:00.000Z',
        updatedAt: '2026-03-05T14:30:00.000Z',
      },
      {
        id: 'ad_laura_03',
        userId: 'usr_laura_fi',
        authorName: 'Laura Moretti',
        authorAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
        title: 'Laura · Cerco la mia anima gemella per una storia seria',
        description: 'La vita è più bella se condivisa. Cerco un uomo leale con cui condividere progetti futuri, viaggi e quotidianità nel rispetto reciproco.',
        cityId: 'firenze',
        cityName: 'Firenze',
        comune: 'Sesto Fiorentino',
        district: 'Sesto Fiorentino',
        latitude: 43.8331,
        longitude: 11.2003,
        age: 29,
        gender: 'donna',
        seekingCategory: 'anima_gemella',
        category: 'incontri',
        interests: ['Natura', 'Cucina biologica', 'Musica classica'],
        languages: ['Italiano'],
        images: [
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        verified: true,
        viewsCount: 95,
        likesCount: 15,
        contactsCount: 4,
        createdAt: '2026-03-10T09:15:00.000Z',
        updatedAt: '2026-03-10T09:15:00.000Z',
      },
      {
        id: 'ad_sofia_04',
        userId: 'usr_sofia_po',
        authorName: 'Sofia Neri',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        title: 'Sofia · Spontaneità e sorrisi tra Prato e Firenze',
        description: 'Spirito libero, energica e sempre pronta a scoprire nuovi locali. Scrivimi se sei un ragazzo simpatico e intraprendente!',
        cityId: 'prato',
        cityName: 'Prato',
        comune: 'Prato',
        district: 'Centro Storico Prato',
        latitude: 43.8777,
        longitude: 11.1022,
        age: 26,
        gender: 'donna',
        seekingCategory: 'donna_cerca_uomo',
        category: 'incontri',
        interests: ['Fitness', 'Moda', 'Weekend al mare'],
        languages: ['Italiano', 'Spagnolo'],
        images: [
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        verified: true,
        viewsCount: 180,
        likesCount: 28,
        contactsCount: 9,
        createdAt: '2026-03-12T16:00:00.000Z',
        updatedAt: '2026-03-12T16:00:00.000Z',
      },
      {
        id: 'ad_elena_05',
        userId: 'usr_elena_pt',
        authorName: 'Elena Conti',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
        title: 'Elena · Nuove amicizie e weekend fuori porta a Pistoia',
        description: 'Amo la tranquillità delle colline toscane. Cerco amici sinceri con cui organizzare gite, cene e scambiare due chiacchiere serene.',
        cityId: 'pistoia',
        cityName: 'Pistoia',
        comune: 'Pistoia',
        district: 'Pistoia Ovest',
        latitude: 43.9333,
        longitude: 10.9167,
        age: 30,
        gender: 'donna',
        seekingCategory: 'amicizia',
        category: 'incontri',
        interests: ['Trekking', 'Fotografia', 'Lettura'],
        languages: ['Italiano'],
        images: [
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        verified: true,
        viewsCount: 65,
        likesCount: 8,
        contactsCount: 3,
        createdAt: '2026-03-14T11:00:00.000Z',
        updatedAt: '2026-03-14T11:00:00.000Z',
      },
    ];

    initialAds.forEach((ad) => {
      if (!ad.adLocation) {
        ad.adLocation = `${ad.district}, ${ad.cityName}`;
        ad.adCity = ad.cityName;
        ad.adArea = ad.district;
        ad.adLatitude = ad.latitude;
        ad.adLongitude = ad.longitude;
        ad.locationVisibility = 'area';
      }
      this.ads.set(ad.id, ad);
    });

    // 4. Pre-seed a match with Anna (Mutual like) so user can immediately test real chat!
    const matchId = 'match_marco_anna';
    this.interactions.push({
      id: 'int_anna_likes_marco',
      userId: 'usr_anna_fi',
      targetUserId: 'usr_marco_current',
      action: 'like',
      createdAt: '2026-03-14T10:00:00.000Z',
    });
    this.interactions.push({
      id: 'int_marco_likes_anna',
      userId: 'usr_marco_current',
      targetUserId: 'usr_anna_fi',
      action: 'like',
      createdAt: '2026-03-14T10:05:00.000Z',
    });
    this.matches.set(matchId, {
      id: matchId,
      userA: 'usr_marco_current',
      userB: 'usr_anna_fi',
      matchedAt: '2026-03-14T10:05:00.000Z',
      status: 'active',
    });

    // 5. Initial conversation and messages with Anna
    const convId = 'conv_marco_anna';
    this.conversations.set(convId, {
      id: convId,
      participantIds: ['usr_marco_current', 'usr_anna_fi'],
      listingId: 'ad_anna_01',
      lastMessage: 'Ciao Marco! Piacere di conoscerti, ho visto il tuo profilo 😊',
      lastTimestamp: '2026-03-14T10:10:00.000Z',
      createdAt: '2026-03-14T10:05:00.000Z',
    });

    this.messages.push(
      {
        id: 'msg_01',
        conversationId: convId,
        senderId: 'usr_anna_fi',
        receiverId: 'usr_marco_current',
        text: 'Ciao Marco! Piacere di conoscerti, ho visto il tuo profilo 😊',
        status: 'read',
        createdAt: '2026-03-14T10:10:00.000Z',
        readAt: '2026-03-14T10:12:00.000Z',
      },
      {
        id: 'msg_02',
        conversationId: convId,
        senderId: 'usr_marco_current',
        receiverId: 'usr_anna_fi',
        text: 'Ciao Anna! Piacere tutto mio. Sei di Firenze centro vero?',
        status: 'read',
        createdAt: '2026-03-14T10:12:30.000Z',
        readAt: '2026-03-14T10:13:00.000Z',
      },
      {
        id: 'msg_03',
        conversationId: convId,
        senderId: 'usr_anna_fi',
        receiverId: 'usr_marco_current',
        text: 'Sì esatto, zona Santa Croce! Ti andrebbe un aperitivo uno di questi giorni?',
        status: 'delivered',
        createdAt: '2026-03-14T10:15:00.000Z',
      }
    );
  }

  // Get all blocked user IDs for a user
  getBlockedUserIds(userId: string): string[] {
    const blocked: string[] = [];
    for (const inter of this.interactions) {
      if (inter.action === 'block') {
        if (inter.userId === userId) {
          blocked.push(inter.targetUserId);
        } else if (inter.targetUserId === userId) {
          blocked.push(inter.userId);
        }
      }
    }
    return [...new Set(blocked)];
  }

  // Check if mutual like exists
  checkMutualLike(userA: string, userB: string): boolean {
    const aLikesB = this.interactions.some(
      (i) => i.userId === userA && i.targetUserId === userB && i.action === 'like'
    );
    const bLikesA = this.interactions.some(
      (i) => i.userId === userB && i.targetUserId === userA && i.action === 'like'
    );
    return aLikesB && bLikesA;
  }
}

export const db = new InMemoryDatabase();
