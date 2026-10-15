import React, { useState } from 'react';
import { Listing, Business } from '../types';
import { useApp } from '../context/AppContext';
import { formatDistance, getGoogleMapsNavigationUrl } from '../utils/geo';
import { MapPin, Navigation, ExternalLink, X, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface InteractiveMapProps {
  items: (Listing | (Business & { categoryId?: string }))[];
  onSelectItem?: (item: Listing) => void;
  onSelectBusiness?: (business: Business) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  items,
  onSelectItem,
  onSelectBusiness,
}) => {
  const {
    selectedCity,
    userLocation,
    searchRadiusKm,
    setSearchRadiusKm,
    requestUserLocation,
    locationStatus,
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(13);
  const [selectedPin, setSelectedPin] = useState<any | null>(null);

  const centerLat = userLocation ? userLocation.lat : selectedCity.lat;
  const centerLng = userLocation ? userLocation.lng : selectedCity.lng;

  const latSpan = 0.16 * (13 / zoomLevel);
  const lngSpan = (0.24 * (13 / zoomLevel)) / Math.cos((centerLat * Math.PI) / 180);

  const getCoordinatesPct = (lat: number, lng: number) => {
    const xPct = 50 + ((lng - centerLng) / lngSpan) * 100;
    const yPct = 50 - ((lat - centerLat) / latSpan) * 100;
    return { x: xPct, y: yPct };
  };

  return (
    <div className="relative w-full h-[520px] md:h-[600px] rounded-2xl overflow-hidden bg-[#F2F4F0] border border-[#E5E7E1] shadow-xs flex flex-col">
      
      {/* Map Header / Location Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#E5E7E1] text-xs shadow-xs text-[#202522]">
        <MapPin className="w-3.5 h-3.5 text-[#193C32] shrink-0" />
        <span className="font-semibold">{selectedCity.name}</span>
        <span className="text-[#E5E7E1]">·</span>
        <span className="text-[#777B76]">
          {userLocation ? (
            <span className="text-[#193C32] font-semibold">GPS Attivo ({searchRadiusKm} km)</span>
          ) : (
            <span>Raggio: {searchRadiusKm} km</span>
          )}
        </span>
        <button
          onClick={requestUserLocation}
          disabled={locationStatus === 'requesting'}
          className="ml-2 flex items-center gap-1 px-2.5 py-1 bg-[#E8EFEA] hover:bg-[#d9e5dc] text-[#193C32] font-semibold rounded-lg transition-colors"
        >
          <Navigation className="w-3 h-3" />
          <span>{locationStatus === 'requesting' ? 'Rilevamento...' : 'Trova Vicini'}</span>
        </button>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-[#E5E7E1] shadow-xs">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 1, 16))}
          title="Ingrandisci"
          className="p-2 text-[#777B76] hover:text-[#202522] hover:bg-[#F8F8F5] rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
          title="Riduci"
          className="p-2 text-[#777B76] hover:text-[#202522] hover:bg-[#F8F8F5] rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(13)}
          title="Centra Mappa"
          className="p-2 text-[#777B76] hover:text-[#202522] hover:bg-[#F8F8F5] rounded-lg transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Vector Street Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="lightGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D8DBD4" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lightGrid)" />
            {/* Elegant waterway / boulevard path */}
            <path
              d="M 0,260 Q 250,300 450,230 T 850,280 T 1200,210"
              fill="none"
              stroke="#D2DDD6"
              strokeWidth="14"
            />
            <path
              d="M 180,0 Q 240,280 370,600"
              fill="none"
              stroke="#E2E5DF"
              strokeWidth="9"
            />
            <path
              d="M 680,0 Q 640,270 790,600"
              fill="none"
              stroke="#E2E5DF"
              strokeWidth="7"
            />
          </svg>
        </div>

        {/* Center Target & Radius Aura */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="rounded-full border border-[#193C32]/25 bg-[#193C32]/5 transition-all duration-500 animate-pulse"
            style={{
              width: `${Math.min(searchRadiusKm * 18 * (zoomLevel / 13), 550)}px`,
              height: `${Math.min(searchRadiusKm * 18 * (zoomLevel / 13), 550)}px`,
            }}
          />
          <div className="absolute w-4 h-4 rounded-full bg-[#193C32] border-2 border-white shadow-xs flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>

        {/* Markers */}
        {items.map((item) => {
          const { x, y } = getCoordinatesPct(item.lat, item.lng);
          if (x < 2 || x > 98 || y < 2 || y > 98) return null;

          const isSelected = selectedPin?.id === item.id;
          const isListing = 'ratePerHour' in item;
          const isBusiness = 'services' in item;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedPin(item)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-200 hover:scale-115"
            >
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold shadow-xs border transition-all ${
                  isSelected
                    ? 'bg-[#193C32] text-white border-[#193C32] ring-3 ring-[#193C32]/20 scale-105'
                    : isBusiness
                    ? 'bg-white text-[#193C32] border-[#193C32] font-bold'
                    : 'bg-[#193C32] text-white border-[#193C32]'
                }`}
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[85px]">
                  {isBusiness
                    ? (item as Business).name.split(' ')[0]
                    : isListing && item.ratePerHour
                    ? `€${item.ratePerHour}`
                    : (item as Listing).authorName || 'Profilo'}
                </span>
              </div>
            </div>
          );
        })}

        {/* Selected Pin Popup Card */}
        {selectedPin && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-30 bg-white border border-[#E5E7E1] rounded-2xl p-4 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => setSelectedPin(null)}
              className="absolute top-3 right-3 text-[#777B76] hover:text-[#202522] p-1 rounded-lg hover:bg-[#F8F8F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex gap-3">
              {selectedPin.images && selectedPin.images[0] ? (
                <img
                  src={selectedPin.images[0]}
                  alt={selectedPin.title || selectedPin.name}
                  className="w-18 h-18 rounded-xl object-cover shrink-0 border border-[#E5E7E1]"
                />
              ) : (
                <div className="w-18 h-18 rounded-xl bg-[#F8F8F5] flex items-center justify-center shrink-0 border border-[#E5E7E1]">
                  <MapPin className="w-5 h-5 text-[#777B76]" />
                </div>
              )}

              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-1.5 text-xs text-[#193C32] font-semibold">
                  <span>{selectedPin.district || selectedCity.name}</span>
                  {selectedPin.distanceKm != null && (
                    <>
                      <span className="text-[#E5E7E1]">·</span>
                      <span className="text-[#777B76] font-mono font-normal">
                        {formatDistance(selectedPin.distanceKm)}
                      </span>
                    </>
                  )}
                </div>

                <h4 className="text-sm font-bold text-[#202522] truncate mt-0.5">
                  {selectedPin.title || selectedPin.name}
                </h4>

                <p className="text-xs text-[#777B76] line-clamp-2 mt-1 font-normal">
                  {selectedPin.description}
                </p>

                {selectedPin.ratePerHour != null && selectedPin.ratePerHour > 0 && (
                  <div className="text-xs font-semibold text-[#202522] mt-1 font-mono">
                    €{selectedPin.ratePerHour} <span className="font-sans text-[10px] text-[#777B76] font-normal">/ ora</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E5E7E1]">
              <button
                onClick={() => {
                  if ('services' in selectedPin) {
                    onSelectBusiness?.(selectedPin);
                  } else {
                    onSelectItem?.(selectedPin);
                  }
                }}
                className="flex-1 py-2 px-3 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold text-xs rounded-xl transition-colors text-center shadow-xs"
              >
                Vedi scheda
              </button>

              <a
                href={getGoogleMapsNavigationUrl(
                  selectedPin.lat,
                  selectedPin.lng,
                  selectedPin.title || selectedPin.name
                )}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center gap-1.5 py-2 px-3 bg-white hover:bg-[#F8F8F5] text-[#202522] text-xs font-medium rounded-xl border border-[#E5E7E1] transition-colors"
                title="Google Maps"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#777B76]" />
                <span>Google Maps</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Map Footer Bar */}
      <div className="p-3 bg-white border-t border-[#E5E7E1] flex flex-wrap items-center justify-between gap-3 text-xs text-[#777B76]">
        <div className="flex items-center gap-2">
          <span>Raggio:</span>
          <div className="flex items-center gap-1 bg-[#F8F8F5] p-0.5 rounded-lg border border-[#E5E7E1]">
            {[1, 5, 10, 25, 50].map((radius) => (
              <button
                key={radius}
                onClick={() => {
                  setSearchRadiusKm(radius);
                  if (radius <= 5) setZoomLevel(15);
                  else if (radius <= 10) setZoomLevel(14);
                  else if (radius <= 25) setZoomLevel(13);
                  else setZoomLevel(11);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  searchRadiusKm === radius
                    ? 'bg-[#193C32] text-white font-semibold'
                    : 'text-[#777B76] hover:text-[#202522]'
                }`}
              >
                {radius}km
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#193C32]" /> Annunci privati
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border border-[#193C32] bg-white" /> Centri benessere & SPA
          </span>
        </div>
      </div>
    </div>
  );
};
