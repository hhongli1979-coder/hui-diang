import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Navigation,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Search,
  MessageSquare,
  PlusCircle,
  User as UserIcon,
  MapPin,
  Home,
  Flame,
} from 'lucide-react';

interface MobileAppGeoBarProps {
  onOpenPost: () => void;
  onOpenAuth: () => void;
  onOpenMessages: () => void;
}

export const MobileAppGeoBar: React.FC<MobileAppGeoBarProps> = ({
  onOpenPost,
  onOpenAuth,
  onOpenMessages,
}) => {
  const {
    userLocation,
    locationStatus,
    locationError,
    requestUserLocation,
    clearUserLocation,
    selectedCity,
    searchRadiusKm,
    setSearchRadiusKm,
    viewMode,
    setViewMode,
    conversations,
  } = useApp();

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <>
      {/* Progressive Geolocation Card (App-style high-end indicator) */}
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 pt-4">
        <div className="bg-white border border-[#E5E7E1] rounded-2xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Status info */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                userLocation
                  ? 'bg-[#E8EFEA] text-[#193C32]'
                  : locationStatus === 'requesting'
                  ? 'bg-amber-50 text-amber-700 animate-pulse'
                  : 'bg-[#F8F8F5] text-[#777B76]'
              }`}
            >
              {locationStatus === 'requesting' ? (
                <Compass className="w-5 h-5 animate-spin" />
              ) : userLocation ? (
                <Navigation className="w-5 h-5" />
              ) : (
                <MapPin className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#202522]">
                {userLocation ? (
                  <>
                    <span>Radar GPS Attivo</span>
                    <span className="text-[#193C32] font-mono">(±15m precisione)</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#193C32]" />
                  </>
                ) : locationStatus === 'requesting' ? (
                  <span className="text-amber-800">Rilevamento coordinate satellitari in corso...</span>
                ) : (
                  <span>Geolocalizzazione Automatica</span>
                )}
              </div>

              <div className="text-[11px] text-[#777B76] truncate mt-0.5">
                {userLocation
                  ? `Posizione centrata su ${selectedCity.name} · Raggio di ricerca: ${searchRadiusKm} km`
                  : locationError
                  ? locationError
                  : `Tocca "Attiva Radar" per ordinare gli annunci per distanza reale da te.`}
              </div>
            </div>
          </div>

          {/* Action & Radius selector */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#E5E7E1]">
            {userLocation ? (
              <div className="flex items-center gap-1.5 w-full md:w-auto justify-between md:justify-end">
                <div className="flex items-center gap-1 bg-[#F8F8F5] p-1 rounded-xl border border-[#E5E7E1]">
                  {[1, 5, 10, 25, 50].map((km) => (
                    <button
                      key={km}
                      onClick={() => setSearchRadiusKm(km)}
                      className={`px-2.5 py-1 text-xs font-mono font-medium rounded-lg transition-colors ${
                        searchRadiusKm === km
                          ? 'bg-[#193C32] text-white font-bold'
                          : 'text-[#777B76] hover:text-[#202522]'
                      }`}
                    >
                      {km}km
                    </button>
                  ))}
                </div>

                <button
                  onClick={clearUserLocation}
                  className="p-2 text-[#777B76] hover:text-[#202522] rounded-xl hover:bg-[#F8F8F5] transition-colors"
                  title="Disattiva GPS"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={requestUserLocation}
                disabled={locationStatus === 'requesting'}
                className="w-full md:w-auto px-4 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Compass className="w-4 h-4" />
                <span>{locationStatus === 'requesting' ? 'Rilevamento...' : 'Attiva Radar Intelligente'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
};
