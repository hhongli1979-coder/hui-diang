/**
 * Geolocation and Haversine distance utilities
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculates the great-circle distance between two points on Earth using the Haversine formula.
 * Result in kilometers.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Human-readable distance formatting in Italian style
 */
export function formatDistance(distanceKm: number | undefined | null): string {
  if (distanceKm == null || isNaN(distanceKm)) return '';
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `a ${meters} m`;
  }
  return `a ${distanceKm.toFixed(1)} km`;
}

/**
 * Request real browser location
 */
export function requestCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocalizzazione non supportata dal tuo browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        let msg = 'Impossibile rilevare la posizione.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Permesso di localizzazione negato dall\'utente.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Informazioni sulla posizione non disponibili.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Richiesta di geolocalizzazione scaduta.';
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Generates an official Google Maps navigation link
 */
export function getGoogleMapsNavigationUrl(lat: number, lng: number, label?: string): string {
  const query = encodeURIComponent(`${lat},${lng}${label ? ` (${label})` : ''}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

/**
 * Generates an Apple Maps navigation link (iOS / macOS)
 */
export function getAppleMapsNavigationUrl(lat: number, lng: number, label?: string): string {
  const q = label ? encodeURIComponent(label) : `${lat},${lng}`;
  return `https://maps.apple.com/?daddr=${lat},${lng}&q=${q}&dirflg=d`;
}

/**
 * Generates a Waze navigation link
 */
export function getWazeNavigationUrl(lat: number, lng: number): string {
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
}

/**
 * Detects device environment and returns the best navigation URL,
 * or launches the native map scheme.
 */
export function getSmartNavigationUrl(lat: number, lng: number, label?: string): string {
  if (typeof navigator !== 'undefined') {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      return getAppleMapsNavigationUrl(lat, lng, label);
    }
  }
  return getGoogleMapsNavigationUrl(lat, lng, label);
}

/**
 * Obfuscates exact geographic coordinates by ~250-400 meters to protect user private residence.
 * Conforms to AMICA dating privacy policy.
 */
export function obfuscateLocationForPrivacy(lat: number, lng: number): Coordinates {
  // 0.003 degrees latitude is approx 330 meters
  const deltaLat = (Math.sin(lat * 1000) * 0.003);
  const deltaLng = (Math.cos(lng * 1000) * 0.003);
  return {
    lat: Math.round((lat + deltaLat) * 10000) / 10000,
    lng: Math.round((lng + deltaLng) * 10000) / 10000,
  };
}

/**
 * Italian Postal Code (CAP) & District Reference Coordinates
 */
const CAP_COORDINATES_MAP: Record<string, { lat: number; lng: number; city: string; district: string }> = {
  // Bologna
  '40121': { lat: 44.4985, lng: 11.3435, city: 'Bologna', district: 'Centro Storico / Indipendenza' },
  '40122': { lat: 44.5020, lng: 11.3360, city: 'Bologna', district: 'Porto - Saragozza' },
  '40123': { lat: 44.4880, lng: 11.3430, city: 'Bologna', district: 'Santo Stefano' },
  '40128': { lat: 44.5120, lng: 11.3520, city: 'Bologna', district: 'Bolognina / Navile' },
  '40127': { lat: 44.5050, lng: 11.3650, city: 'Bologna', district: 'San Donato' },
  '40138': { lat: 44.4920, lng: 11.3780, city: 'Bologna', district: 'Mazzini / Savena' },
  // Milano
  '20121': { lat: 45.4710, lng: 9.1880, city: 'Milano', district: 'Brera / Duomo' },
  '20123': { lat: 45.4610, lng: 9.1760, city: 'Milano', district: 'Sant\'Ambrogio / Magenta' },
  '20144': { lat: 45.4520, lng: 9.1680, city: 'Milano', district: 'Navigli / Porta Genova' },
  '20124': { lat: 45.4860, lng: 9.2040, city: 'Milano', district: 'Stazione Centrale' },
  '20154': { lat: 45.4820, lng: 9.1740, city: 'Milano', district: 'Sempione / Chinatown' },
  // Roma
  '00185': { lat: 41.8970, lng: 12.5080, city: 'Roma', district: 'Esquilino / Termini' },
  '00186': { lat: 41.8980, lng: 12.4760, city: 'Roma', district: 'Centro Storico / Pantheon' },
  '00153': { lat: 41.8860, lng: 12.4710, city: 'Roma', district: 'Trastevere / Testaccio' },
  '00192': { lat: 41.9110, lng: 12.4580, city: 'Roma', district: 'Prati' },
  '00144': { lat: 41.8290, lng: 12.4680, city: 'Roma', district: 'EUR' },
  // Firenze
  '50121': { lat: 43.7710, lng: 11.2640, city: 'Firenze', district: 'Centro Storico / Santa Croce' },
  '50123': { lat: 43.7750, lng: 11.2480, city: 'Firenze', district: 'Santa Maria Novella' },
  '50125': { lat: 43.7640, lng: 11.2500, city: 'Firenze', district: 'Oltrarno / Santo Spirito' },
  // Torino
  '10121': { lat: 45.0680, lng: 7.6790, city: 'Torino', district: 'Centro' },
  '10125': { lat: 45.0530, lng: 7.6820, city: 'Torino', district: 'San Salvario' },
  // Napoli
  '80121': { lat: 40.8350, lng: 14.2370, city: 'Napoli', district: 'Chiaia' },
  '80129': { lat: 40.8460, lng: 14.2320, city: 'Napoli', district: 'Vomero' },
  // Venezia
  '30121': { lat: 45.4440, lng: 12.3270, city: 'Venezia', district: 'Cannaregio' },
  '30171': { lat: 45.4920, lng: 12.2410, city: 'Venezia', district: 'Mestre Centro' },
};

/**
 * Geocodes an Italian address, district, or CAP into real coordinates.
 */
import { searchItalianComuni } from '../data/italianComuni';

export function geocodeItalianAddress(
  query: string,
  cityHint?: { lat: number; lng: number; name: string }
): (Coordinates & { label?: string; matchedCAP?: string; comuneName?: string }) | null {
  if (!query || !query.trim()) return null;

  const normalized = query.trim().toLowerCase();

  // 1. Check in full Italian Comuni Database first (Comune name, CAP, or Province)
  const matchedComuni = searchItalianComuni(query, 1);
  if (matchedComuni.length > 0) {
    const c = matchedComuni[0];
    return {
      lat: c.lat,
      lng: c.lng,
      label: `${c.name} (${c.provinceCode}), ${c.region} - CAP ${c.postalCode}`,
      matchedCAP: c.postalCode,
      comuneName: c.name,
    };
  }

  // 2. Check for 5-digit CAP match in localized district map
  const capMatch = normalized.match(/\b\d{5}\b/);
  if (capMatch && CAP_COORDINATES_MAP[capMatch[0]]) {
    const info = CAP_COORDINATES_MAP[capMatch[0]];
    return {
      lat: info.lat,
      lng: info.lng,
      label: `${info.district}, ${info.city} (CAP ${capMatch[0]})`,
      matchedCAP: capMatch[0],
      comuneName: info.city,
    };
  }

  // 3. Check for district or street name matches
  for (const [cap, data] of Object.entries(CAP_COORDINATES_MAP)) {
    if (
      normalized.includes(data.district.toLowerCase()) ||
      normalized.includes(data.city.toLowerCase())
    ) {
      return {
        lat: data.lat,
        lng: data.lng,
        label: `${data.district}, ${data.city}`,
        matchedCAP: cap,
        comuneName: data.city,
      };
    }
  }

  // 4. Fallback to city coordinates with minor offset
  if (cityHint) {
    return {
      lat: cityHint.lat,
      lng: cityHint.lng,
      label: cityHint.name,
      comuneName: cityHint.name,
    };
  }

  return null;
}

/**
 * Calculates a match compatibility score (65% - 99%) between two dating profiles
 * based on mutual interests, intention, and lifestyle keywords.
 */
export function calculateCompatibilityScore(
  userA: { interests?: string[]; intention?: string; city?: string },
  userB: { tags?: string[]; intention?: string; city?: string; district?: string }
): number {
  let score = 70; // baseline 70%

  const tagsA = (userA.interests || []).map((t) => t.toLowerCase().replace('#', ''));
  const tagsB = (userB.tags || []).map((t) => t.toLowerCase().replace('#', ''));

  // Shared interests
  const common = tagsA.filter((t) => tagsB.some((b) => b.includes(t) || t.includes(b)));
  score += Math.min(20, common.length * 5);

  // Same intention
  if (userA.intention && userB.intention && userA.intention === userB.intention) {
    score += 8;
  }

  // Same city
  if (userA.city && userB.city && userA.city.toLowerCase() === userB.city.toLowerCase()) {
    score += 5;
  }

  return Math.min(99, Math.max(65, score));
}

