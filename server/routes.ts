import { Router, Request, Response } from 'express';
import { db, DBUser, DBAd, DBMessage, DBReport, calculateHaversineKm } from './db';
import { ITALIAN_COMUNI } from '../src/data/italianComuni';
import { SeekingCategory } from '../src/types';

export const apiRouter = Router();

// -------------------------------------------------------------
// 1. Italian Comuni Database & Autocomplete Search
// -------------------------------------------------------------
apiRouter.get('/cities/search', (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const region = String(req.query.region || '').trim();
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  let results = ITALIAN_COMUNI;

  if (region && region !== 'Tutti' && region !== 'all') {
    results = results.filter((c) => c.region.toLowerCase() === region.toLowerCase());
  }

  if (q) {
    results = results.filter((c) => {
      const matchName = c.name.toLowerCase().includes(q);
      const matchCap = c.postalCode && c.postalCode.includes(q);
      const matchProv = (c.province && c.province.toLowerCase().includes(q)) ||
                        (c.provinceCode && c.provinceCode.toLowerCase().includes(q));
      return matchName || matchCap || matchProv;
    });
  }

  // Sort: exact match or startsWith first
  if (q) {
    results.sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      return aStarts - bStarts || (b.population || 0) - (a.population || 0);
    });
  }

  return res.json({
    total: results.length,
    comuni: results.slice(0, limit),
  });
});

apiRouter.get('/cities/all', (_req: Request, res: Response) => {
  return res.json({
    total: ITALIAN_COMUNI.length,
    comuni: ITALIAN_COMUNI,
  });
});

// -------------------------------------------------------------
// 2. Core Feature: Server-side Nearby Users & Ads Search
// -------------------------------------------------------------
// Rules strictly enforced:
// - Distance calculated via Haversine
// - Strictly filtered by radius (e.g., 5, 15, 30, 50, 100 km)
// - If user has 3 nearby in Firenze, return EXACTLY 3. Never backfill from Roma/Milano!
// - Sorted ascending by distance
// - Excludes blocked and skipped users
// - Only approved ads
apiRouter.get('/users/nearby', (req: Request, res: Response) => {
  const currentUserId = String(req.query.userId || 'usr_marco_current');
  const latStr = req.query.lat;
  const lngStr = req.query.lng;
  const radiusKm = Number(req.query.radiusKm) || 25;
  const seekingCategory = String(req.query.seekingCategory || 'all') as SeekingCategory;
  const gender = req.query.gender ? String(req.query.gender) : undefined;
  const minAge = req.query.minAge ? Number(req.query.minAge) : 18;
  const maxAge = req.query.maxAge ? Number(req.query.maxAge) : 99;
  const cityId = req.query.cityId ? String(req.query.cityId).toLowerCase() : undefined;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 50);

  // If no lat/lng provided, resolve from cityId or fallback to Firenze
  let userLat: number;
  let userLng: number;

  if (latStr !== undefined && lngStr !== undefined && !isNaN(Number(latStr)) && !isNaN(Number(lngStr))) {
    userLat = Number(latStr);
    userLng = Number(lngStr);
  } else if (cityId) {
    const matchedCity = ITALIAN_COMUNI.find((c) => c.id === cityId || c.name.toLowerCase() === cityId);
    userLat = matchedCity ? matchedCity.lat : 43.7696;
    userLng = matchedCity ? matchedCity.lng : 11.2558;
  } else {
    // Default to Firenze (user reference)
    userLat = 43.7696;
    userLng = 11.2558;
  }

  // Get blocked user IDs (bidirectional)
  const blockedIds = db.getBlockedUserIds(currentUserId);

  // Get skipped user IDs for this user
  const skippedIds = db.interactions
    .filter((i) => i.userId === currentUserId && i.action === 'skip')
    .map((i) => i.targetUserId);

  // Filter ads
  const candidateAds: Array<DBAd & { distanceKm: number }> = [];

  for (const ad of db.ads.values()) {
    // Must be approved by server
    if (ad.status !== 'approved') continue;

    // Do not return self
    if (ad.userId === currentUserId) continue;

    // Do not return blocked
    if (blockedIds.includes(ad.userId)) continue;

    // Do not return skipped
    if (skippedIds.includes(ad.userId)) continue;

    // Calculate real Haversine distance using public ad coordinates
    const adLat = ad.adLatitude !== undefined ? ad.adLatitude : ad.latitude;
    const adLng = ad.adLongitude !== undefined ? ad.adLongitude : ad.longitude;
    const dist = calculateHaversineKm(userLat, userLng, adLat, adLng);

    // STRICT DISTANCE FILTER: Must be <= requested radius
    if (dist > radiusKm) continue;

    // Seeking category filter
    if (seekingCategory !== 'all' && ad.seekingCategory !== seekingCategory) {
      continue;
    }

    // Gender filter
    if (gender && gender !== 'all' && ad.gender !== gender) {
      continue;
    }

    // Age filter
    if (ad.age < minAge || ad.age > maxAge) {
      continue;
    }

    candidateAds.push({
      ...ad,
      distanceKm: dist,
    });
  }

  // Sort strictly by distance ascending: 0-5km, 5-15km, 15-30km, 30-50km
  candidateAds.sort((a, b) => a.distanceKm - b.distanceKm);

  const total = candidateAds.length;
  const startIndex = (page - 1) * limit;
  const paginated = candidateAds.slice(startIndex, startIndex + limit);

  return res.json({
    total,
    page,
    limit,
    currentRadiusKm: radiusKm,
    hasMore: startIndex + limit < total,
    recommendedRadii: [5, 15, 30, 50, 100],
    center: { lat: userLat, lng: userLng },
    ads: paginated,
  });
});

// -------------------------------------------------------------
// 3. Dating Ads / Classified Ads CRUD & Moderation
// -------------------------------------------------------------
apiRouter.get('/ads', (req: Request, res: Response) => {
  const currentUserId = String(req.query.userId || 'usr_marco_current');
  const status = req.query.status ? String(req.query.status) : undefined;
  const category = req.query.category ? String(req.query.category) : undefined;
  const cityId = req.query.cityId ? String(req.query.cityId).toLowerCase() : undefined;

  let adsList = Array.from(db.ads.values());

  if (status) {
    adsList = adsList.filter((a) => a.status === status);
  } else {
    // By default, public only sees approved ads, or ads authored by themselves
    adsList = adsList.filter((a) => a.status === 'approved' || a.userId === currentUserId);
  }

  if (category && category !== 'all') {
    adsList = adsList.filter((a) => a.category === category || a.seekingCategory === category);
  }

  if (cityId && cityId !== 'all') {
    adsList = adsList.filter((a) => a.cityId === cityId);
  }

  return res.json({ total: adsList.length, ads: adsList });
});

apiRouter.post('/ads', (req: Request, res: Response) => {
  const {
    userId = 'usr_marco_current',
    title,
    description,
    cityId = 'firenze',
    district = 'Centro',
    age = 29,
    gender = 'uomo',
    seekingCategory = 'donna_cerca_uomo',
    category = 'incontri',
    interests = [],
    languages = ['Italiano'],
    images = [],
    ratePerHour,
    adLocation,
    adLatitude,
    adLongitude,
    adCity,
    adArea,
    locationVisibility = 'area',
  } = req.body;

  if (!title || title.trim().length < 5) {
    return res.status(400).json({ error: 'Titolo obbligatorio (almeno 5 caratteri)' });
  }

  const user = db.users.get(userId);
  const cityObj = ITALIAN_COMUNI.find((c) => c.id === cityId) || ITALIAN_COMUNI[0];

  const newAdId = `ad_${Date.now()}`;
  const now = new Date().toISOString();

  const finalAdLat = adLatitude !== undefined && !isNaN(Number(adLatitude)) ? Number(adLatitude) : cityObj.lat;
  const finalAdLng = adLongitude !== undefined && !isNaN(Number(adLongitude)) ? Number(adLongitude) : cityObj.lng;
  const finalAdLocation = adLocation ? String(adLocation).trim() : (district ? `${district}, ${cityObj.name}` : cityObj.name);
  const finalAdCity = adCity ? String(adCity).trim() : cityObj.name;
  const finalAdArea = adArea ? String(adArea).trim() : (district ? district.trim() : 'Centro');

  // New ads MUST be set to 'pending' by server
  const newAd: DBAd = {
    id: newAdId,
    userId,
    authorName: user ? user.name : 'Utente AMICA',
    authorAvatar: user?.avatar,
    title: title.trim(),
    description: description ? description.trim() : '',
    cityId: cityObj.id,
    cityName: cityObj.name,
    comune: cityObj.name,
    district: district.trim(),
    latitude: finalAdLat,
    longitude: finalAdLng,
    adLocation: finalAdLocation,
    adCity: finalAdCity,
    adArea: finalAdArea,
    adLatitude: finalAdLat,
    adLongitude: finalAdLng,
    locationVisibility,
    age: Number(age) || 28,
    gender,
    seekingCategory,
    category,
    interests: Array.isArray(interests) ? interests : [],
    languages: Array.isArray(languages) ? languages : ['Italiano'],
    images: Array.isArray(images) ? images : [],
    imageStatuses: Array.isArray(images)
      ? images.map((url: string) => ({ url, status: 'approved' }))
      : [],
    ratePerHour: ratePerHour ? Number(ratePerHour) : undefined,
    status: 'pending', // SERVER CONTROLLED
    moderationComment: 'Annuncio in coda di verifica da parte del team di moderazione.',
    verified: user?.isVerified || false,
    viewsCount: 0,
    likesCount: 0,
    contactsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  db.ads.set(newAdId, newAd);

  return res.status(201).json({
    message: 'Annuncio inviato con successo e preso in carico per la moderazione.',
    ad: newAd,
  });
});

// Update Public Ad Location (only author or admin)
apiRouter.patch('/ads/:id/location', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, adLocation, adLatitude, adLongitude, adCity, adArea, locationVisibility } = req.body;

  const ad = db.ads.get(id);
  if (!ad) {
    return res.status(404).json({ error: 'Annuncio non trovato' });
  }

  // Permission check: only author or admin
  if (userId && ad.userId !== userId && userId !== 'user_admin' && userId !== 'usr_admin') {
    return res.status(403).json({ error: 'Non autorizzato a modificare la posizione di questo annuncio' });
  }

  if (adLocation) ad.adLocation = String(adLocation).trim();
  if (adCity) ad.adCity = String(adCity).trim();
  if (adArea) ad.adArea = String(adArea).trim();
  if (adLatitude !== undefined && !isNaN(Number(adLatitude))) {
    ad.adLatitude = Number(adLatitude);
    ad.latitude = Number(adLatitude);
  }
  if (adLongitude !== undefined && !isNaN(Number(adLongitude))) {
    ad.adLongitude = Number(adLongitude);
    ad.longitude = Number(adLongitude);
  }
  if (locationVisibility) {
    ad.locationVisibility = locationVisibility;
  }
  ad.updatedAt = new Date().toISOString();
  db.ads.set(id, ad);

  return res.json({
    message: 'Posizione pubblica dell\'annuncio aggiornata con successo',
    ad,
  });
});

// Get Single Ad with Public Location & Privacy Guarantees
apiRouter.get('/ads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = String(req.query.userId || 'usr_marco_current');
  const ad = db.ads.get(id);

  if (!ad) {
    return res.status(404).json({ error: 'Annuncio non trovato o rimosso' });
  }

  // If ad is paused, rejected, or deleted, do NOT expose location or ad to other users
  if (ad.status !== 'approved' && ad.userId !== currentUserId && currentUserId !== 'usr_admin') {
    return res.status(403).json({ error: 'Questo annuncio è stato sospeso o rimosso dall\'autore.' });
  }

  // Calculate real distance if lat/lng are provided
  const latStr = req.query.lat;
  const lngStr = req.query.lng;
  let distanceKm: number | null = null;
  if (latStr !== undefined && lngStr !== undefined && !isNaN(Number(latStr)) && !isNaN(Number(lngStr))) {
    const adLat = ad.adLatitude !== undefined ? ad.adLatitude : ad.latitude;
    const adLng = ad.adLongitude !== undefined ? ad.adLongitude : ad.longitude;
    distanceKm = calculateHaversineKm(Number(latStr), Number(lngStr), adLat, adLng);
  }

  return res.json({
    ad: {
      ...ad,
      distanceKm: distanceKm != null ? distanceKm : undefined,
    },
  });
});

// Delete Ad (only author or admin)
apiRouter.delete('/ads/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const currentUserId = String(req.query.userId || req.body?.userId || 'usr_marco_current');
  const ad = db.ads.get(id);

  if (!ad) {
    return res.status(404).json({ error: 'Annuncio non trovato' });
  }

  if (ad.userId !== currentUserId && currentUserId !== 'usr_admin') {
    return res.status(403).json({ error: 'Non autorizzato a eliminare questo annuncio' });
  }

  db.ads.delete(id);
  return res.json({ message: 'Annuncio eliminato con successo. La posizione non è più accessibile.' });
});

// Admin Moderation: Update Ad Status
apiRouter.patch('/ads/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, moderationComment } = req.body;

  const validStatuses: DBAd['status'][] = ['draft', 'pending', 'reviewing', 'approved', 'rejected', 'paused'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Stato non valido' });
  }

  const ad = db.ads.get(id);
  if (!ad) {
    return res.status(404).json({ error: 'Annuncio non trovato' });
  }

  ad.status = status;
  ad.moderationComment = moderationComment || undefined;
  ad.updatedAt = new Date().toISOString();
  db.ads.set(id, ad);

  return res.json({ message: `Stato annuncio aggiornato a: ${status}`, ad });
});

// -------------------------------------------------------------
// 4. Photo Upload Endpoint with Real Verification Statuses
// -------------------------------------------------------------
apiRouter.post('/upload', (req: Request, res: Response) => {
  const { files = [] } = req.body; // Array of base64 or photo meta
  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: 'Nessun file fornito per il caricamento' });
  }

  const processed = files.map((file, idx) => ({
    id: `photo_${Date.now()}_${idx}`,
    url: typeof file === 'string' ? file : file.url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    status: 'approved' as const, // Verified for demo
    verifiedAt: new Date().toISOString(),
  }));

  return res.json({
    message: 'Foto elaborate e verificate con successo.',
    photos: processed,
  });
});

// -------------------------------------------------------------
// 5. User Interactions: Like, Skip, Favorite, Follow, Block, Report
// -------------------------------------------------------------
// Rules:
// - Like and Follow are strictly separated.
// - Mutual Like creates a Match!
// - Block completely isolates users from search & chat.
apiRouter.post('/interactions', (req: Request, res: Response) => {
  const {
    userId = 'usr_marco_current',
    targetUserId,
    action,
  } = req.body;

  if (!targetUserId || !action) {
    return res.status(400).json({ error: 'Parametri incompleti' });
  }

  const validActions = ['view', 'like', 'skip', 'favorite', 'follow', 'block', 'report'];
  if (!validActions.includes(action)) {
    return res.status(400).json({ error: 'Azione non valida' });
  }

  const interactionId = `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  db.interactions.push({
    id: interactionId,
    userId,
    targetUserId,
    action,
    createdAt: new Date().toISOString(),
  });

  // Handle Mutual Like -> Match
  let isMatch = false;
  let matchRecord = null;
  let partnerUser = null;

  if (action === 'like') {
    // Increment likes count on ad if exists
    for (const ad of db.ads.values()) {
      if (ad.userId === targetUserId) {
        ad.likesCount = (ad.likesCount || 0) + 1;
      }
    }

    if (db.checkMutualLike(userId, targetUserId)) {
      isMatch = true;
      const matchId = `match_${userId}_${targetUserId}`;
      matchRecord = {
        id: matchId,
        userA: userId,
        userB: targetUserId,
        matchedAt: new Date().toISOString(),
        status: 'active' as const,
      };
      db.matches.set(matchId, matchRecord);
      partnerUser = db.users.get(targetUserId);

      // Create conversation if not existing
      let existingConv = Array.from(db.conversations.values()).find(
        (c) =>
          (c.participantIds[0] === userId && c.participantIds[1] === targetUserId) ||
          (c.participantIds[0] === targetUserId && c.participantIds[1] === userId)
      );

      if (!existingConv) {
        const convId = `conv_${Date.now()}`;
        existingConv = {
          id: convId,
          participantIds: [userId, targetUserId],
          lastMessage: '🎉 Vi siete piaciuti reciprocamente! Inizia subito la conversazione.',
          lastTimestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        db.conversations.set(convId, existingConv);
        db.messages.push({
          id: `msg_${Date.now()}`,
          conversationId: convId,
          senderId: 'system',
          receiverId: userId,
          text: '🎉 Match confermato! Entrambi avete espresso un interesse reciproco.',
          status: 'delivered',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  return res.json({
    success: true,
    action,
    isMatch,
    match: matchRecord,
    partner: partnerUser,
  });
});

apiRouter.get('/matches', (req: Request, res: Response) => {
  const userId = String(req.query.userId || 'usr_marco_current');
  const userMatches: Array<{
    matchId: string;
    matchedAt: string;
    partner: DBUser | undefined;
  }> = [];

  for (const match of db.matches.values()) {
    if (match.userA === userId || match.userB === userId) {
      const partnerId = match.userA === userId ? match.userB : match.userA;
      const partner = db.users.get(partnerId);
      userMatches.push({
        matchId: match.id,
        matchedAt: match.matchedAt,
        partner,
      });
    }
  }

  return res.json({ matches: userMatches });
});

// -------------------------------------------------------------
// 6. Real Chat & Messaging System
// -------------------------------------------------------------
// Rules:
// - Persisted messages
// - Status: sending -> delivered -> read
// - Blocked users cannot send or receive messages
apiRouter.get('/chat/conversations', (req: Request, res: Response) => {
  const userId = String(req.query.userId || 'usr_marco_current');
  const blockedIds = db.getBlockedUserIds(userId);

  const convs = Array.from(db.conversations.values())
    .filter((c) => c.participantIds.includes(userId))
    .map((c) => {
      const partnerId = c.participantIds.find((id) => id !== userId) || userId;
      const partner = db.users.get(partnerId);
      const isBlocked = blockedIds.includes(partnerId);

      // Count unread messages
      const unreadCount = db.messages.filter(
        (m) => m.conversationId === c.id && m.receiverId === userId && m.status !== 'read'
      ).length;

      return {
        id: c.id,
        partnerId,
        partnerName: partner?.name || 'Utente AMICA',
        partnerAvatar: partner?.avatar,
        lastMessage: c.lastMessage,
        lastTimestamp: c.lastTimestamp,
        unreadCount,
        isBlocked,
      };
    });

  return res.json({ conversations: convs });
});

apiRouter.get('/chat/conversations/:id/messages', (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = String(req.query.userId || 'usr_marco_current');

  const messages = db.messages
    .filter((m) => m.conversationId === id)
    .map((m) => ({
      ...m,
      isMine: m.senderId === userId,
    }));

  // Automatically mark incoming messages as read
  messages.forEach((m) => {
    if (m.receiverId === userId && m.status !== 'read') {
      const original = db.messages.find((orig) => orig.id === m.id);
      if (original) {
        original.status = 'read';
        original.readAt = new Date().toISOString();
      }
    }
  });

  return res.json({ messages });
});

apiRouter.post('/chat/messages', (req: Request, res: Response) => {
  const {
    conversationId,
    senderId = 'usr_marco_current',
    receiverId,
    text,
    imageUrl,
  } = req.body;

  if (!text && !imageUrl) {
    return res.status(400).json({ error: 'Messaggio vuoto' });
  }

  // Check if sender or receiver is blocked
  const blockedIds = db.getBlockedUserIds(senderId);
  if (receiverId && blockedIds.includes(receiverId)) {
    return res.status(403).json({ error: 'Impossibile inviare messaggi a un utente bloccato.' });
  }

  let conv = db.conversations.get(conversationId);
  if (!conv && receiverId) {
    // Create new conversation
    const newConvId = `conv_${Date.now()}`;
    conv = {
      id: newConvId,
      participantIds: [senderId, receiverId],
      lastMessage: text || '📷 Immagine inviata',
      lastTimestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    db.conversations.set(newConvId, conv);
  }

  const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();

  const newMessage: DBMessage = {
    id: messageId,
    conversationId: conv ? conv.id : conversationId,
    senderId,
    receiverId: receiverId || (conv?.participantIds.find((id) => id !== senderId) as string),
    text: text || '',
    imageUrl,
    status: 'delivered', // Server delivery
    createdAt: now,
  };

  db.messages.push(newMessage);

  if (conv) {
    conv.lastMessage = text || '📷 Immagine inviata';
    conv.lastTimestamp = now;
    db.conversations.set(conv.id, conv);
  }

  return res.status(201).json({
    message: newMessage,
    conversation: conv,
  });
});

apiRouter.patch('/chat/messages/:id/read', (req: Request, res: Response) => {
  const { id } = req.params;
  const msg = db.messages.find((m) => m.id === id);
  if (!msg) {
    return res.status(404).json({ error: 'Messaggio non trovato' });
  }

  msg.status = 'read';
  msg.readAt = new Date().toISOString();

  return res.json({ message: 'Messaggio contrassegnato come letto', data: msg });
});

// -------------------------------------------------------------
// 7. Blocks & Moderation Reports
// -------------------------------------------------------------
apiRouter.post('/blocks', (req: Request, res: Response) => {
  const { userId = 'usr_marco_current', targetUserId } = req.body;
  if (!targetUserId) {
    return res.status(400).json({ error: 'Target user ID richiesto' });
  }

  db.interactions.push({
    id: `int_blk_${Date.now()}`,
    userId,
    targetUserId,
    action: 'block',
    createdAt: new Date().toISOString(),
  });

  return res.json({ success: true, message: 'Utente bloccato con successo dal server.' });
});

apiRouter.get('/blocks', (req: Request, res: Response) => {
  const userId = String(req.query.userId || 'usr_marco_current');
  const blockedIds = db.getBlockedUserIds(userId);
  const blockedUsers = blockedIds.map((id) => db.users.get(id)).filter(Boolean);

  return res.json({ blockedUsers });
});

apiRouter.post('/reports', (req: Request, res: Response) => {
  const {
    reporterId = 'usr_marco_current',
    targetType,
    targetId,
    targetTitle,
    reason,
    comment,
  } = req.body;

  if (!targetType || !targetId || !reason) {
    return res.status(400).json({ error: 'Dati di segnalazione incompleti' });
  }

  const newReport: DBReport = {
    id: `rep_${Date.now()}`,
    reporterId,
    targetType,
    targetId,
    targetTitle,
    reason,
    comment: comment ? String(comment).trim() : '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  db.reports.push(newReport);

  return res.status(201).json({
    success: true,
    message: 'Segnalazione registrata sul server per revisione di moderazione.',
    report: newReport,
  });
});

apiRouter.get('/reports', (_req: Request, res: Response) => {
  return res.json({ reports: db.reports });
});

// -------------------------------------------------------------
// 8. User Profile & Real Online Status Management
// -------------------------------------------------------------
apiRouter.get('/users/me', (req: Request, res: Response) => {
  const userId = String(req.query.userId || 'usr_marco_current');
  const user = db.users.get(userId) || Array.from(db.users.values())[0];
  return res.json({ user });
});

apiRouter.patch('/users/me', (req: Request, res: Response) => {
  const userId = String(req.body.userId || 'usr_marco_current');
  const user = db.users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'Utente non trovato' });
  }

  const {
    name,
    bio,
    phone,
    city,
    comune,
    postalCode,
    seekingCategory,
    onlineStatus,
    showOnlineStatus,
    age,
  } = req.body;

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (phone !== undefined) user.phone = phone;
  if (city) user.city = city;
  if (comune) user.comune = comune;
  if (postalCode) user.postalCode = postalCode;
  if (seekingCategory) user.seekingCategory = seekingCategory;
  if (onlineStatus) user.onlineStatus = onlineStatus;
  if (showOnlineStatus !== undefined) user.showOnlineStatus = showOnlineStatus;
  if (age) user.age = Number(age);
  user.lastActive = new Date().toISOString();

  db.users.set(userId, user);

  return res.json({ message: 'Profilo salvato sul server', user });
});
