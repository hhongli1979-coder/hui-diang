import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ITALIAN_COMUNI, searchItalianComuni } from '../data/italianComuni';
import { ItalianComune } from '../types';
import {
  MapPin,
  Search,
  Crosshair,
  X,
  Check,
  ChevronRight,
  Sliders,
  Globe,
  Sparkles,
} from 'lucide-react';

interface ItalianComunePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectComune?: (comune: ItalianComune, radiusKm: number) => void;
}

export const ItalianComunePickerModal: React.FC<ItalianComunePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectComune,
}) => {
  const {
    userLocation,
    requestUserLocation,
    locationStatus,
    setAddressSearchQuery,
    searchRadiusKm,
    setSearchRadiusKm,
    selectedCity,
    setSelectedCity,
    cities,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedRadius, setSelectedRadius] = useState<number>(searchRadiusKm || 25);
  const [activeRegion, setActiveRegion] = useState<string>('Tutti');

  const radiusOptions = [5, 10, 25, 50, 100];

  // Search results
  const searchResults = useMemo(() => {
    if (query.trim().length >= 1) {
      return searchItalianComuni(query, 24);
    }
    if (activeRegion !== 'Tutti') {
      return ITALIAN_COMUNI.filter((c) => c.region === activeRegion);
    }
    // Default show popular capitals
    return ITALIAN_COMUNI.slice(0, 16);
  }, [query, activeRegion]);

  const uniqueRegions = useMemo(() => {
    const list = Array.from(new Set(ITALIAN_COMUNI.map((c) => c.region))).sort();
    return ['Tutti', ...list];
  }, []);

  if (!isOpen) return null;

  const handleSelect = (comune: ItalianComune) => {
    // Sync with AppContext
    setAddressSearchQuery(`${comune.name} (${comune.provinceCode})`);
    setSearchRadiusKm(selectedRadius);

    // Also match closest primary city in cities list if available
    const matchedCity = cities.find(
      (c) => c.name.toLowerCase() === comune.name.toLowerCase()
    );
    if (matchedCity) {
      setSelectedCity(matchedCity);
    }

    if (onSelectComune) {
      onSelectComune(comune, selectedRadius);
    }
    onClose();
  };

  const handleUseGps = async () => {
    await requestUserLocation();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-neutral-950 border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-neutral-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E11D48] to-[#00F2FE] flex items-center justify-center text-white shadow-md shadow-[#E11D48]/30">
              <MapPin className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Trova Persone per Città o Comune</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E11D48]/20 text-pink-300 border border-[#E11D48]/30 font-medium">
                  Italia Completa
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Oltre 100+ Comuni e Capoluoghi con ricerca per CAP e Raggio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Quick Action */}
        <div className="px-4 py-3 bg-neutral-900/30 border-b border-white/5 flex items-center justify-between gap-3">
          <button
            onClick={handleUseGps}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-neutral-900 to-neutral-850 hover:from-neutral-800 hover:to-neutral-800 border border-white/10 hover:border-[#00F2FE]/50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm group"
          >
            <Crosshair className="w-3.5 h-3.5 text-[#00F2FE] group-hover:rotate-90 transition-transform duration-300" />
            <span>
              {locationStatus === 'requesting'
                ? 'Rilevamento GPS in corso...'
                : userLocation
                ? 'GPS Attivo (Posizione Rilevata)'
                : 'Usa Posizione GPS Corrente'}
            </span>
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 pb-2 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca Comune (es. Firenze, Prato, Milano, 50121...)"
              className="w-full bg-neutral-900 text-xs text-white pl-10 pr-9 py-2.5 rounded-xl border border-white/15 focus:outline-hidden focus:border-[#E11D48] transition-colors placeholder:text-neutral-500 font-medium"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Radius Slider / Chips */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-[#E11D48]" />
              <span>Raggio di ricerca:</span>
            </span>
            <div className="flex items-center gap-1.5">
              {radiusOptions.map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRadius(r)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                    selectedRadius === r
                      ? 'bg-[#E11D48] border-[#E11D48] text-white shadow-sm shadow-[#E11D48]/30'
                      : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>

          {/* Region Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
            {uniqueRegions.map((reg) => (
              <button
                key={reg}
                onClick={() => {
                  setActiveRegion(reg);
                  setQuery('');
                }}
                className={`text-[10px] whitespace-nowrap px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
                  activeRegion === reg && !query
                    ? 'bg-white/20 border-white text-white font-bold'
                    : 'bg-neutral-900 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 max-h-[380px] divide-y divide-white/5">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              <Globe className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
              <p className="font-semibold text-neutral-300">Nessun comune trovato</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Verifica l'ortografia o prova a cercare per sigla provincia (es. FI, MI, RM) o CAP.
              </p>
            </div>
          ) : (
            searchResults.map((comune) => {
              const isSelected =
                selectedCity.name.toLowerCase() === comune.name.toLowerCase();

              return (
                <button
                  key={comune.id}
                  onClick={() => handleSelect(comune)}
                  className="w-full pt-2 pb-2 text-left flex items-center justify-between group hover:bg-white/5 px-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-[#00F2FE] group-hover:border-[#00F2FE]/30 transition-colors">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-[#00F2FE] transition-colors">
                          {comune.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono border border-white/10">
                          {comune.provinceCode}
                        </span>
                        <span className="text-[9px] text-neutral-400 font-mono">
                          CAP {comune.postalCode}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">
                        {comune.region} · Prov. {comune.province}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-neutral-400 group-hover:text-white">
                    {isSelected && (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                        <Check className="w-3 h-3" />
                        <span>Attuale</span>
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-900/80 border-t border-white/10 text-center">
          <p className="text-[10px] text-neutral-400">
            AMICA Local Dating · La distanza viene calcolata con formula geodetica reale
          </p>
        </div>
      </div>
    </div>
  );
};
