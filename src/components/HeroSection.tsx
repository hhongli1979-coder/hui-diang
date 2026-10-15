import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowRight,
  Navigation,
  Sparkles,
  Users,
  Compass,
  Flame,
  Megaphone,
  Building,
} from 'lucide-react';

import { motion } from 'motion/react';

interface HeroSectionProps {
  onOpenAdPortal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenAdPortal }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCity,
    setSelectedCategory,
    userLocation,
    requestUserLocation,
    locationStatus,
    searchRadiusKm,
    setSearchRadiusKm,
    clearUserLocation,
    setViewMode,
    setIsMerchantDashboardOpen,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);

  const headline = "Cosa cerchi oggi?";
  const subtitle = "Persone, luoghi e servizi. Tutto in un'unica ricerca.";

  const headlineWords = headline.split(' ');
  const subtitleWords = subtitle.split(' ');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal);
    const element = document.getElementById('incontri-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const suggestedPrompts = [
    { label: 'Incontri verificati a ' + selectedCity.name, query: 'verificato' },
    { label: 'Massaggio rilassante con oli caldi', query: 'rilassante' },
    { label: 'Appartamento privato in centro', query: 'centro' },
    { label: 'Centri SPA & Benessere', query: 'spa' },
  ];

  return (
    <section className="w-full bg-[#F8F8F5] py-12 md:py-16 border-b border-[#E5E7E1]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 text-center">
        
        {/* Brand Tagline */}
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#193C32] bg-[#E8EFEA] px-3 py-1 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#193C32]" />
          <span>AMICA · {selectedCity.name}</span>
        </div>

        {/* Main Headline with Staggered Character Jump-Out Animation */}
        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#202522] tracking-tight leading-tight max-w-2xl mx-auto flex flex-wrap justify-center items-center gap-x-2.5">
          {headlineWords.map((word, wordIndex) => {
            // Calculate starting character index for this word
            let prevChars = 0;
            for (let i = 0; i < wordIndex; i++) {
              prevChars += headlineWords[i].length;
            }

            return (
              <span key={wordIndex} className="inline-flex overflow-visible">
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={{ opacity: 0, y: 32, scale: 0.4, rotate: -6 }}
                    animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 10,
                      stiffness: 160,
                      delay: 0.1 + (prevChars + charIndex) * 0.045,
                    }}
                    className="inline-block origin-bottom hover:text-[#193C32] hover:-translate-y-1 transition-colors cursor-default"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </h1>

        {/* Subtitle with Staggered Word Pop-Out Animation */}
        <p className="mt-3 text-base sm:text-lg text-[#777B76] max-w-xl mx-auto font-normal flex flex-wrap justify-center items-center gap-x-1.5 gap-y-1">
          {subtitleWords.map((word, wordIndex) => (
            <motion.span
              key={wordIndex}
              initial={{ opacity: 0, y: 16, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.85 + wordIndex * 0.075,
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </p>

        {/* AI Chat Input - Visual Focal Point */}
        <div className="mt-8 max-w-2xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl border border-[#E5E7E1] p-2.5 shadow-sm hover:border-[#193C32]/40 focus-within:border-[#193C32] focus-within:ring-2 focus-within:ring-[#193C32]/10 transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Chiedi qualcosa ad AMICA... (es. 'Massaggio rilassante centro' o 'Accompagnatrice')"
              className="flex-1 px-4 py-2.5 bg-transparent text-sm text-[#202522] placeholder-[#777B76] focus:outline-none"
            />

            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              {/* Geolocation Button */}
              <button
                type="button"
                onClick={userLocation ? clearUserLocation : requestUserLocation}
                disabled={locationStatus === 'requesting'}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition-colors ${
                  userLocation
                    ? 'bg-[#E8EFEA] text-[#193C32] border-[#193C32]/30 font-semibold'
                    : 'bg-[#F8F8F5] text-[#777B76] border-[#E5E7E1] hover:text-[#202522]'
                }`}
                title={userLocation ? 'Disattiva GPS' : 'Cerca vicino a me'}
              >
                <Navigation className={`w-3.5 h-3.5 ${userLocation ? 'text-[#193C32]' : 'text-[#777B76]'}`} />
                <span className="whitespace-nowrap">
                  {locationStatus === 'requesting'
                    ? 'Rilevamento...'
                    : userLocation
                    ? `${searchRadiusKm} km`
                    : 'Vicino'}
                </span>
              </button>

              {/* Send Button */}
              <button
                type="submit"
                className="w-10 h-10 rounded-xl bg-[#193C32] hover:bg-[#244D40] text-white flex items-center justify-center transition-colors shadow-xs shrink-0"
                title="Cerca"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Suggested Prompts */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#777B76] text-[11px]">Suggeriti:</span>
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputVal(p.query);
                  setSearchQuery(p.query);
                }}
                className="px-3 py-1 rounded-full bg-white border border-[#E5E7E1] text-[#777B76] hover:text-[#202522] hover:border-[#193C32]/30 transition-colors text-[11px]"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Proximity Radius Options if User Location Active */}
          {userLocation && (
            <div className="mt-3 pt-3 border-t border-[#E5E7E1] flex items-center justify-center gap-2 text-xs text-[#777B76]">
              <span>Raggio chilometrico:</span>
              <div className="flex items-center gap-1">
                {[1, 5, 10, 25, 50].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSearchRadiusKm(r)}
                    className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                      searchRadiusKm === r
                        ? 'bg-[#193C32] text-white'
                        : 'bg-white border border-[#E5E7E1] text-[#777B76] hover:text-[#202522]'
                    }`}
                  >
                    {r} km
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4 Main Module Cards (Pure White, Restrained Icons, 1px Border) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          
          {/* Card 1: Incontri */}
          <div
            onClick={() => {
              setSelectedCategory('incontri');
              const el = document.getElementById('incontri-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group p-5 rounded-2xl bg-white border border-[#E5E7E1] hover:border-[#193C32]/40 text-left cursor-pointer transition-all hover:shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F8F8F5] border border-[#E5E7E1] flex items-center justify-center text-[#193C32] mb-3 group-hover:bg-[#E8EFEA] transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202522] group-hover:text-[#193C32] transition-colors">
                Incontri
              </h3>
              <p className="mt-1 text-xs text-[#777B76] font-normal leading-normal">
                Trova nuove connessioni
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E7E1]/60 text-[11px] font-semibold text-[#193C32] flex items-center justify-between">
              <span>Esplora profili</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Scopri Feed Immersivo */}
          <div
            onClick={() => {
              setViewMode('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group p-5 rounded-2xl bg-white border border-[#E5E7E1] hover:border-[#193C32]/40 text-left cursor-pointer transition-all hover:shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F8F8F5] border border-[#E5E7E1] flex items-center justify-center text-rose-500 mb-3 group-hover:bg-rose-50 transition-colors">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-base font-bold text-[#202522] group-hover:text-[#193C32] transition-colors flex items-center gap-1.5">
                <span>Scopri</span>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Feed</span>
              </h3>
              <p className="mt-1 text-xs text-[#777B76] font-normal leading-normal">
                Sfoglia foto e video a schermo intero
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E7E1]/60 text-[11px] font-semibold text-[#193C32] flex items-center justify-between">
              <span>Feed TikTok</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Massaggi & SPA */}
          <div
            onClick={() => {
              setSelectedCategory('massaggi_spa');
              const el = document.getElementById('benessere-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group p-5 rounded-2xl bg-white border border-[#E5E7E1] hover:border-[#193C32]/40 text-left cursor-pointer transition-all hover:shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F8F8F5] border border-[#E5E7E1] flex items-center justify-center text-[#193C32] mb-3 group-hover:bg-[#E8EFEA] transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202522] group-hover:text-[#193C32] transition-colors">
                Massaggi & SPA
              </h3>
              <p className="mt-1 text-xs text-[#777B76] font-normal leading-normal">
                Scopri i servizi benessere
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E7E1]/60 text-[11px] font-semibold text-[#193C32] flex items-center justify-between">
              <span>Centri benessere</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 4: Area Inserzionisti */}
          <div
            onClick={() => setIsMerchantDashboardOpen(true)}
            className="group p-5 rounded-2xl bg-white border border-[#E5E7E1] hover:border-[#193C32]/40 text-left cursor-pointer transition-all hover:shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F8F8F5] border border-[#E5E7E1] flex items-center justify-center text-[#193C32] mb-3 group-hover:bg-[#E8EFEA] transition-colors">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202522] group-hover:text-[#193C32] transition-colors">
                Area Inserzionisti
              </h3>
              <p className="mt-1 text-xs text-[#777B76] font-normal leading-normal">
                Carica foto e gestisci Ads
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E5E7E1]/60 text-[11px] font-semibold text-[#193C32] flex items-center justify-between">
              <span>Pannello gestione</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

        </div>

        {/* Brand Editorial Footer Line */}
        <p className="mt-8 text-xs text-[#777B76] italic font-normal">
          Un'esperienza semplice, elegante e intelligente.
        </p>

      </div>
    </section>
  );
};
