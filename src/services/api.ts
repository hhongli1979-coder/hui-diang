/**
 * Frontend Client for AMICA Backend REST API
 * Connects directly to /api endpoints for cities, nearby search, ads, interactions, matches, and chat.
 */

import { SeekingCategory, ItalianComune, Listing } from '../types';

export interface NearbySearchResult {
  total: number;
  page: number;
  limit: number;
  currentRadiusKm: number;
  hasMore: boolean;
  recommendedRadii: number[];
  center: { lat: number; lng: number };
  ads: Array<Listing & { distanceKm: number }>;
}

export const api = {
  // 1. Italian Comuni Autocomplete
  async searchCities(q: string, region?: string, limit = 20): Promise<{ total: number; comuni: ItalianComune[] }> {
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (region && region !== 'Tutti') params.set('region', region);
      params.set('limit', String(limit));
      const res = await fetch(`/api/cities/search?${params.toString()}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('[API searchCities fallback]', err);
      return { total: 0, comuni: [] };
    }
  },

  // 2. Real Server-Side Nearby Search with Strict Haversine Distance
  async getNearbyAds(params: {
    lat?: number;
    lng?: number;
    radiusKm?: number;
    seekingCategory?: SeekingCategory;
    cityId?: string;
    gender?: string;
    minAge?: number;
    maxAge?: number;
    page?: number;
    limit?: number;
    userId?: string;
  }): Promise<NearbySearchResult> {
    const query = new URLSearchParams();
    if (params.lat !== undefined) query.set('lat', String(params.lat));
    if (params.lng !== undefined) query.set('lng', String(params.lng));
    if (params.radiusKm !== undefined) query.set('radiusKm', String(params.radiusKm));
    if (params.seekingCategory) query.set('seekingCategory', params.seekingCategory);
    if (params.cityId) query.set('cityId', params.cityId);
    if (params.gender) query.set('gender', params.gender);
    if (params.minAge !== undefined) query.set('minAge', String(params.minAge));
    if (params.maxAge !== undefined) query.set('maxAge', String(params.maxAge));
    if (params.page !== undefined) query.set('page', String(params.page));
    if (params.limit !== undefined) query.set('limit', String(params.limit));
    if (params.userId) query.set('userId', params.userId);

    const res = await fetch(`/api/users/nearby?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load nearby ads');
    return await res.json();
  },

  // 3. Post Ad (Server sets status to 'pending')
  async createAd(adData: any): Promise<{ message: string; ad: any }> {
    const res = await fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Errore nella creazione dell\'annuncio');
    }
    return await res.json();
  },

  // 4. Update Ad Status (Moderation)
  async updateAdStatus(id: string, status: string, comment?: string): Promise<any> {
    const res = await fetch(`/api/ads/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, moderationComment: comment }),
    });
    if (!res.ok) throw new Error('Failed to update ad status');
    return await res.json();
  },

  // 4b. Update Ad Public Location
  async updateAdLocation(id: string, locationData: {
    userId?: string;
    adLocation?: string;
    adLatitude?: number;
    adLongitude?: number;
    adCity?: string;
    adArea?: string;
    locationVisibility?: 'city' | 'area' | 'exact';
  }): Promise<any> {
    const res = await fetch(`/api/ads/${id}/location`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(locationData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update ad location');
    }
    return await res.json();
  },

  // 5. Interactions (Like, Skip, Follow, Block, Report)
  async sendInteraction(targetUserId: string, action: string, userId = 'usr_marco_current'): Promise<{
    success: boolean;
    action: string;
    isMatch: boolean;
    match?: any;
    partner?: any;
  }> {
    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetUserId, action }),
    });
    if (!res.ok) throw new Error('Interaction failed');
    return await res.json();
  },

  // 6. Matches
  async getMatches(userId = 'usr_marco_current'): Promise<{ matches: any[] }> {
    const res = await fetch(`/api/matches?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to load matches');
    return await res.json();
  },

  // 7. Chat Conversations & Messages
  async getConversations(userId = 'usr_marco_current'): Promise<{ conversations: any[] }> {
    const res = await fetch(`/api/chat/conversations?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to load conversations');
    return await res.json();
  },

  async getMessages(convId: string, userId = 'usr_marco_current'): Promise<{ messages: any[] }> {
    const res = await fetch(`/api/chat/conversations/${convId}/messages?userId=${userId}`);
    if (!res.ok) throw new Error('Failed to load messages');
    return await res.json();
  },

  async sendMessage(params: {
    conversationId: string;
    senderId?: string;
    receiverId?: string;
    text: string;
    imageUrl?: string;
  }): Promise<{ message: any; conversation: any }> {
    const res = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to send message');
    }
    return await res.json();
  },

  async markMessageRead(msgId: string): Promise<any> {
    const res = await fetch(`/api/chat/messages/${msgId}/read`, {
      method: 'PATCH',
    });
    return await res.json();
  },

  // 8. Block user
  async blockUser(targetUserId: string, userId = 'usr_marco_current'): Promise<any> {
    const res = await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetUserId }),
    });
    if (!res.ok) throw new Error('Failed to block user');
    return await res.json();
  },

  // 9. Report
  async submitReport(data: {
    reporterId?: string;
    targetType: 'user' | 'ad' | 'photo' | 'message';
    targetId: string;
    targetTitle?: string;
    reason: string;
    comment: string;
  }): Promise<any> {
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return await res.json();
  },

  // 10. Update Profile & Online Status
  async updateProfile(data: any): Promise<any> {
    const res = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
  },
};
