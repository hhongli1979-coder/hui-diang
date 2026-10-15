import React, { useState, useMemo } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import {
  calculateDistanceKm,
  getGoogleMapsNavigationUrl,
  getAppleMapsNavigationUrl,
  getWazeNavigationUrl,
  getSmartNavigationUrl,
  requestCurrentLocation,
} from '../utils/geo';
import { ITALIAN_COMUNI } from '../data/italianComuni';
import {
  MapPin,
  Navigation,
  Map as MapIcon,
  ExternalLink,
  Edit3,
  X,
  Compass,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AdPublicLocationBlockProps {
  listing: Listing;
  variant?: 'light' | 'dark';
}

export const AdPublicLocationBlock: React.FC<AdPublicLocationBlockProps> = ({
  listing,
  variant = 'light',
}) => {
  const { lang } = useI18n();
  const isZh = lang === 'zh';

  const {
    userLocation,
    selectedCity,
    currentUser,
    updateListingLocation,
  } = useApp();

  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [isNavModalOpen, setIsNavModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(14);

  // Edit location state
  const [editLabel, setEditLabel] = useState<string>(
    listing.adLocation || listing.district || `${selectedCity.name} Centro`
  );
  const [editCity, setEditCity] = useState<string>(listing.adCity || selectedCity.name);
  const [editArea, setEditArea] = useState<string>(listing.adArea || listing.district || 'Centro');
  const [editLat, setEditLat] = useState<number>(listing.adLatitude ?? listing.lat);
  const [editLng, setEditLng] = useState<number>(listing.adLongitude ?? listing.lng);
  const [editLoadingGps, setEditLoadingGps] = useState<boolean>(false);
  const [editGpsError, setEditGpsError] = useState<string | null>(null);
  const [editSavedToast, setEditSavedToast] = useState<boolean>(false);

  // Target public coordinates of this ad
  const adLat = listing.adLatitude !== undefined ? listing.adLatitude : listing.lat;
  const adLng = listing.adLongitude !== undefined ? listing.adLongitude : listing.lng;
  const publicLocationName =
    listing.adLocation || listing.district || `${listing.adCity || selectedCity.name} Centro`;

  // Real distance: ONLY calculated if viewer authorized GPS / userLocation exists!
  // Never fake 3 km or 0.0 km if location permission is not granted.
  const distanceKm = useMemo(() => {
    if (!userLocation || userLocation.lat == null || userLocation.lng == null) {
      return null;
    }
    const d = calculateDistanceKm(userLocation.lat, userLocation.lng, adLat, adLng);
    if (isNaN(d)) return null;
    return d;
  }, [userLocation, adLat, adLng]);

  const formattedDistance = useMemo(() => {
    if (distanceKm == null) return null;
    if (distanceKm < 1) {
      const meters = Math.round(distanceKm * 1000);
      return meters <= 150 ? (isZh ? '不到 150米' : '< 150 m') : (isZh ? `${meters}米` : `${meters} m`);
    }
    return `${Math.round(distanceKm)} km`;
  }, [distanceKm, isZh]);

  const isAuthor =
    currentUser.id === listing.authorId ||
    currentUser.role === 'admin' ||
    currentUser.role === 'moderator';

  // Map projection calculation for interactive visual preview
  const latSpan = 0.08 * (14 / zoomLevel);
  const lngSpan = (0.12 * (14 / zoomLevel)) / Math.cos((adLat * Math.PI) / 180);

  const getCoordinatesPct = (lat: number, lng: number) => {
    const xPct = 50 + ((lng - adLng) / lngSpan) * 100;
    const yPct = 50 - ((lat - adLat) / latSpan) * 100;
    return { x: xPct, y: yPct };
  };

  const adPin = getCoordinatesPct(adLat, adLng);

  // Direct navigation links
  const googleMapsUrl = getGoogleMapsNavigationUrl(adLat, adLng, publicLocationName);
  const appleMapsUrl = getAppleMapsNavigationUrl(adLat, adLng, publicLocationName);
  const wazeUrl = getWazeNavigationUrl(adLat, adLng);
  const smartUrl = getSmartNavigationUrl(adLat, adLng, publicLocationName);

  // Handle GPS location pickup in Edit mode
  const handleUseMyCurrentLocation = async () => {
    setEditLoadingGps(true);
    setEditGpsError(null);
    try {
      const coords = await requestCurrentLocation();
      setEditLat(coords.lat);
      setEditLng(coords.lng);

      // Find closest comune
      let closestComune = ITALIAN_COMUNI[0];
      let minD = Infinity;
      ITALIAN_COMUNI.forEach((c) => {
        const d = calculateDistanceKm(coords.lat, coords.lng, c.lat, c.lng);
        if (d < minD) {
          minD = d;
          closestComune = c;
        }
      });
      setEditCity(closestComune.name);
      setEditArea('Posizione attuale');
      setEditLabel(`${closestComune.name} (${isZh ? '公开坐标' : 'Punto pubblico'})`);
    } catch (err: any) {
      setEditGpsError(err.message || (isZh ? '无法获取当前位置' : 'Impossibile ottenere la posizione'));
    } finally {
      setEditLoadingGps(false);
    }
  };

  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLabel.trim()) return;

    await updateListingLocation(listing.id, {
      adLocation: editLabel.trim(),
      adLatitude: editLat,
      adLongitude: editLng,
      adCity: editCity,
      adArea: editArea,
      locationVisibility: 'area',
    });

    setEditSavedToast(true);
    setTimeout(() => {
      setEditSavedToast(false);
      setIsEditModalOpen(false);
    }, 1200);
  };

  const isDark = variant === 'dark';

  return (
    <div
      className={`rounded-2xl border transition-all overflow-hidden ${
        isDark
          ? 'bg-neutral-900/90 border-neutral-800 text-white'
          : 'bg-[#F8F8F5] border-[#E5E7E1] text-[#202522]'
      }`}
    >
      {/* 1. Header Information & Buttons */}
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className="space-y-1 cursor-pointer group"
            title={isZh ? '点击展开/收起地图' : 'Tocca per aprire/chiudere la mappa'}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#193C32]">
              <MapPin className="w-4 h-4 text-[#E11D48]" />
              <span>{isZh ? '📍 广告位置' : '📍 Posizione Annuncio'}</span>
            </div>

            <div className="text-base sm:text-lg font-bold tracking-tight group-hover:text-[#193C32] transition-colors">
              <span>{publicLocationName}</span>
              {formattedDistance && (
                <span className="text-[#193C32] font-semibold text-sm sm:text-base ml-1.5">
                  · {formattedDistance}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-[#777B76]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                {isZh
                  ? '广告发布者公开位置 · 保护私人住址隐私'
                  : "Posizione pubblica dell'annuncio · Privacy tutelata"}
              </span>
            </div>
          </div>

          {/* Publisher Edit Button */}
          {isAuthor && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-[#E5E7E1] bg-white hover:bg-[#E8EFEA] text-[#193C32] transition-colors flex items-center gap-1 shrink-0"
              title={isZh ? '修改广告公开位置' : 'Modifica posizione annuncio'}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isZh ? '修改位置' : 'Modifica'}</span>
            </button>
          )}
        </div>

        {/* Action Row: [ 查看地图 ] and [ 导航 ] */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 active:scale-98 ${
              isMapExpanded
                ? 'bg-[#193C32] text-white border-[#193C32]'
                : isDark
                ? 'bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700'
                : 'bg-white hover:bg-[#E8EFEA] text-[#202522] hover:text-[#193C32] border-[#E5E7E1]'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>{isMapExpanded ? (isZh ? '收起地图' : 'Chiudi Mappa') : (isZh ? '查看地图' : 'Vedi Mappa')}</span>
            {isMapExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <button
            onClick={() => setIsNavModalOpen(true)}
            className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>{isZh ? '导航' : 'Navigazione'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Map (Shown when "查看地图" is toggled) */}
      {isMapExpanded && (
        <div className="relative w-full h-[260px] sm:h-[300px] bg-[#EEF2ED] border-t border-[#E5E7E1] overflow-hidden select-none animate-in fade-in duration-200">
          
          {/* Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#E5E7E1] shadow-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 1, 17))}
              className="p-1.5 text-[#777B76] hover:text-[#202522] hover:bg-[#F8F8F5] rounded-lg transition-colors"
              title={isZh ? '放大' : 'Ingrandisci'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 1, 11))}
              className="p-1.5 text-[#777B76] hover:text-[#202522] hover:bg-[#F8F8F5] rounded-lg transition-colors"
              title={isZh ? '缩小' : 'Riduci'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(14)}
              className="p-1.5 text-[#777B76] hover:text-[#202522] hover:bg-[#F8F8F5] rounded-lg transition-colors"
              title={isZh ? '重置' : 'Ripristina'}
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG Map Canvas with Italian Street Layout */}
          <svg className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="adMapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1D6CE" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#adMapGrid)" />
            {/* Major boulevards */}
            <path d="M 0,130 Q 180,150 400,120 T 800,140" fill="none" stroke="#CBD5CB" strokeWidth="12" />
            <path d="M 120,0 Q 150,140 220,300" fill="none" stroke="#D8E2D8" strokeWidth="8" />
            <path d="M 320,0 Q 290,140 370,300" fill="none" stroke="#D8E2D8" strokeWidth="7" />
          </svg>

          {/* Radius Pulse Circle around the public location */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full border border-[#E11D48]/30 bg-[#E11D48]/10 animate-ping"
              style={{
                width: '60px',
                height: '60px',
                animationDuration: '3s',
              }}
            />
          </div>

          {/* Pin Marker on Ad Public Location */}
          <div
            style={{ left: `${adPin.x}%`, top: `${adPin.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-full z-10 flex flex-col items-center"
          >
            {/* Popup Label */}
            <div className="px-3 py-1 bg-[#193C32] text-white text-[11px] font-bold rounded-lg shadow-md border border-white/20 whitespace-nowrap mb-1 flex items-center gap-1.5 animate-bounce">
              <MapPin className="w-3 h-3 text-[#E11D48]" />
              <span>{publicLocationName}</span>
            </div>

            {/* Pin Head */}
            <div className="w-8 h-8 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-lg border-2 border-white ring-2 ring-[#E11D48]/30">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            {/* Pin pointer tip */}
            <div className="w-2 h-2 bg-[#E11D48] rotate-45 -mt-1" />
          </div>

          {/* Quick Bottom Bar on Map */}
          <div className="absolute bottom-2 inset-x-3 z-20 flex items-center justify-between px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl border border-[#E5E7E1] text-[11px] shadow-xs">
            <div className="truncate text-[#202522] font-semibold pr-2">
              📍 {publicLocationName}
            </div>
            <a
              href={smartUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="shrink-0 text-[#193C32] hover:underline font-bold flex items-center gap-1"
            >
              <span>{isZh ? '打开外链地图' : 'Apri Mappa'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 3. Navigation Modal (Dialog for Google Maps, Apple Maps, Waze, etc.) */}
      {isNavModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white border border-[#E5E7E1] rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-200 text-[#202522]">
            <button
              onClick={() => setIsNavModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#777B76] hover:text-[#202522] hover:bg-[#F8F8F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#E11D48] mx-auto flex items-center justify-center mb-2">
                <Navigation className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-base font-bold text-[#202522]">
                {isZh ? '选择导航应用' : 'Scegli Navigatore'}
              </h3>
              <p className="text-xs text-[#777B76] mt-0.5">
                {isZh ? '目的地：' : 'Destinazione:'}{' '}
                <span className="font-semibold text-[#202522]">{publicLocationName}</span>
                {formattedDistance && <span className="text-[#193C32]"> · {formattedDistance}</span>}
              </p>
            </div>

            <div className="space-y-2">
              {/* Smart / Native System Map */}
              <a
                href={smartUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setIsNavModalOpen(false)}
                className="w-full py-3 px-4 bg-[#193C32] hover:bg-[#244D40] text-white rounded-2xl flex items-center justify-between text-xs font-bold transition-colors group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xs">
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <div className="text-left">
                    <div>{isZh ? '系统默认地图导航 (推荐)' : 'Navigatore Predefinito (Auto)'}</div>
                    <div className="text-[10px] text-emerald-200 font-normal">
                      {isZh ? '根据设备自动调用 Apple / Google 地图' : 'Rileva automaticamente iOS / Android'}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/80 group-hover:text-white" />
              </a>

              {/* Google Maps */}
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setIsNavModalOpen(false)}
                className="w-full py-3 px-4 bg-[#F8F8F5] hover:bg-[#E8EFEA] border border-[#E5E7E1] rounded-2xl flex items-center justify-between text-xs font-bold text-[#202522] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#E5E7E1] flex items-center justify-center text-blue-600 font-bold text-xs shadow-xs">
                    G
                  </div>
                  <div>
                    <div>Google Maps</div>
                    <div className="text-[10px] text-[#777B76] font-normal">
                      {isZh ? 'Android / iOS / 网页默认推荐' : 'Consigliato Android & Web'}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#777B76] group-hover:text-[#193C32]" />
              </a>

              {/* Apple Maps */}
              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setIsNavModalOpen(false)}
                className="w-full py-3 px-4 bg-[#F8F8F5] hover:bg-[#E8EFEA] border border-[#E5E7E1] rounded-2xl flex items-center justify-between text-xs font-bold text-[#202522] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#E5E7E1] flex items-center justify-center text-slate-800 font-bold text-xs shadow-xs">
                    
                  </div>
                  <div>
                    <div>Apple Mappe</div>
                    <div className="text-[10px] text-[#777B76] font-normal">
                      {isZh ? 'iPhone / iPad / Mac 默认地图' : 'Nativo iPhone & Apple devices'}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#777B76] group-hover:text-[#193C32]" />
              </a>

              {/* Waze */}
              <a
                href={wazeUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setIsNavModalOpen(false)}
                className="w-full py-3 px-4 bg-[#F8F8F5] hover:bg-[#E8EFEA] border border-[#E5E7E1] rounded-2xl flex items-center justify-between text-xs font-bold text-[#202522] transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-[#E5E7E1] flex items-center justify-center text-cyan-600 font-bold text-xs shadow-xs">
                    W
                  </div>
                  <div>
                    <div>Waze</div>
                    <div className="text-[10px] text-[#777B76] font-normal">
                      {isZh ? '实时路况与驾驶导航' : 'Traffico in tempo reale e autovelox'}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#777B76] group-hover:text-[#193C32]" />
              </a>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5E7E1] text-center">
              <button
                onClick={() => setIsNavModalOpen(false)}
                className="w-full py-2 text-xs font-medium text-[#777B76] hover:text-[#202522]"
              >
                {isZh ? '取消' : 'Annulla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Location Edit Modal for Author */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white border border-[#E5E7E1] rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-[#202522]">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#777B76] hover:text-[#202522] hover:bg-[#F8F8F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h3 className="text-base font-bold text-[#202522] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E11D48]" />
                <span>{isZh ? '修改广告公开位置' : 'Modifica Posizione Pubblica Annuncio'}</span>
              </h3>
              <p className="text-xs text-[#777B76] mt-1 leading-relaxed">
                {isZh
                  ? '此位置属于该交友广告，将在广告卡片、详情页地图和导航中展示。您的私人家庭地址绝对不会被公开。'
                  : "Questa posizione appartiene solo a questo annuncio. Il tuo indirizzo privato di residenza non verrà mai diffuso."}
              </p>
            </div>

            {/* Quick 3-Choice Picker Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={handleUseMyCurrentLocation}
                disabled={editLoadingGps}
                className="p-2.5 bg-[#F8F8F5] hover:bg-[#E8EFEA] text-[#193C32] rounded-xl border border-[#E5E7E1] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>{editLoadingGps ? (isZh ? '获取中...' : 'Rilevamento...') : (isZh ? '使用我的当前位置' : 'Usa Posizione Attuale')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditLabel(`${selectedCity.name} Centro`);
                  setEditCity(selectedCity.name);
                  setEditArea('Centro Storico');
                  setEditLat(selectedCity.lat);
                  setEditLng(selectedCity.lng);
                }}
                className="p-2.5 bg-[#F8F8F5] hover:bg-[#E8EFEA] text-[#202522] rounded-xl border border-[#E5E7E1] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#193C32]" />
                <span>{selectedCity.name} Centro</span>
              </button>
            </div>

            {editGpsError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs mb-3">
                {editGpsError}
              </div>
            )}

            <form onSubmit={handleSaveLocation} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#202522] mb-1">
                  {isZh ? '公开展示名称 / 区域' : 'Nome Posizione Pubblica'}
                </label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="Es. Bologna Centro, Piazza Maggiore, Stazione Centrale"
                  className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522] focus:border-[#193C32] outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#202522] mb-1">
                    {isZh ? '城市 / Comune' : 'Città'}
                  </label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522] focus:border-[#193C32] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#202522] mb-1">
                    {isZh ? '区域 / Quartiere' : 'Zona / Quartiere'}
                  </label>
                  <input
                    type="text"
                    value={editArea}
                    onChange={(e) => setEditArea(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522] focus:border-[#193C32] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#777B76]">
                <div>Lat: {editLat.toFixed(4)}</div>
                <div>Lng: {editLng.toFixed(4)}</div>
              </div>

              {editSavedToast && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{isZh ? '广告位置已保存！' : 'Posizione annuncio aggiornata!'}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#777B76] hover:text-[#202522]"
                >
                  {isZh ? '取消' : 'Annulla'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  {isZh ? '保存广告位置' : 'Salva Posizione'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
