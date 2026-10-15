import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useI18n } from '../i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  MapPin,
  MessageSquare,
  Compass,
  Menu,
  X,
  User as UserIcon,
  ShieldCheck,
  Megaphone,
  Flame,
  Building,
  Grid,
} from 'lucide-react';

interface HeaderProps {
  onOpenAdPortal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdPortal }) => {
  const { t } = useI18n();
  const {
    cities,
    selectedCity,
    setSelectedCity,
    setIsPostModalOpen,
    setIsAuthModalOpen,
    setIsAdminModalOpen,
    setIsMerchantDashboardOpen,
    setIsMessagesDrawerOpen,
    conversations,
    currentUser,
    userLocation,
    requestUserLocation,
    viewMode,
    setViewMode,
    setDeviceMode,
  } = useApp();

  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F8F5]/90 backdrop-blur-md border-b border-[#E5E7E1] transition-all">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single Brand Wordmark & City Selector */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-baseline gap-2 group whitespace-nowrap"
          >
            <span className="text-xl font-black tracking-tight text-[#193C32]">
              AMICA
            </span>
            <span className="hidden sm:inline text-[11px] font-semibold tracking-wider uppercase text-[#777B76]">
              SCOPRI. CONNETTI. CRESCI.
            </span>
          </a>

          {/* City Selector Popover */}
          <div className="relative">
            <button
              onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-xl bg-white border border-[#E5E7E1] text-[#202522] hover:border-[#193C32]/40 transition-colors shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5 text-[#193C32]" />
              <span className="font-semibold">{selectedCity.name}</span>
            </button>

            {isCityMenuOpen && (
              <div
                className="absolute left-0 mt-2 w-56 bg-white border border-[#E5E7E1] rounded-2xl shadow-lg py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1"
                onMouseLeave={() => setIsCityMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#777B76] border-b border-[#E5E7E1] pb-1.5 flex items-center justify-between">
                  <span>Città di ricerca</span>
                  <button
                    onClick={() => {
                      requestUserLocation();
                      setIsCityMenuOpen(false);
                    }}
                    className="text-[#193C32] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Compass className="w-3 h-3" /> GPS
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto pt-1">
                  {cities.map((city) => (
                    <button
                      key={city.id}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsCityMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F8F8F5] transition-colors ${
                        selectedCity.id === city.id
                          ? 'text-[#193C32] font-bold bg-[#E8EFEA]'
                          : 'text-[#202522]'
                      }`}
                    >
                      <span>{city.name}</span>
                      <span className="text-[10px] text-[#777B76] font-mono">{city.region}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Zone 2: Clean, Single-line Nav Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-medium text-[#777B76]">
          {/* Mode Switcher: Scopri TikTok vs Catalogo */}
          <button
            onClick={() => {
              setViewMode(viewMode === 'discover' ? 'grid' : 'discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-all whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold ${
              viewMode === 'discover'
                ? 'bg-[#193C32] text-white shadow-xs'
                : 'text-[#202522] bg-white border border-[#E5E7E1] hover:border-[#193C32]/40'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Scopri Feed</span>
          </button>

          <button
            onClick={() => {
              setViewMode('grid');
              const el = document.getElementById('incontri-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`hover:text-[#193C32] transition-colors whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              viewMode === 'grid' ? 'text-[#193C32] font-semibold' : ''
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Catalogo</span>
          </button>

          <button
            onClick={() => {
              setViewMode(viewMode === 'map' ? 'grid' : 'map');
            }}
            className={`hover:text-[#193C32] transition-colors whitespace-nowrap flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
              viewMode === 'map' ? 'text-[#193C32] font-semibold' : ''
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Radar Mappa</span>
          </button>

          <a
            href="#benessere-section"
            className="hover:text-[#193C32] transition-colors whitespace-nowrap"
          >
            Massaggi & SPA
          </a>

          {/* Area Inserzionisti Dashboard */}
          <button
            onClick={() => setIsMerchantDashboardOpen(true)}
            className="hover:bg-[#193C32] hover:text-white transition-all whitespace-nowrap flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl bg-[#E8EFEA] text-[#193C32] border border-[#193C32]/20"
            title="Pannello gestione annunci, foto, chat e campagne pubblicitarie"
          >
            <Building className="w-3.5 h-3.5" />
            <span>Area Inserzionisti</span>
          </button>

          {/* Quick Switcher to TikTok Mobile App View */}
          <button
            onClick={() => setDeviceMode('mobile_app')}
            className="hover:scale-105 transition-all whitespace-nowrap flex items-center gap-1.5 font-bold px-3 py-1.5 rounded-xl bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-md shadow-[#E11D48]/25"
            title="Passa all'esperienza TikTok Mobile 5 Schede"
          >
            <span>📱 App Mobile</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Quick Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Messages inbox */}
          <button
            onClick={() => setIsMessagesDrawerOpen(true)}
            className="relative p-2 text-[#777B76] hover:text-[#193C32] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-[#E5E7E1]"
            title="Messaggi"
          >
            <MessageSquare className="w-4 h-4" />
            {totalUnread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#193C32] ring-2 ring-[#F8F8F5]" />
            )}
          </button>

          {/* User profile toggle */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-[#202522] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-[#E5E7E1]"
            title={`Profilo: ${currentUser.name}`}
          >
            <UserIcon className="w-3.5 h-3.5 text-[#193C32]" />
            <span className="hidden sm:inline font-medium truncate max-w-[85px]">
              {currentUser.name.split(' ')[0]}
            </span>
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher variant="pill" className="hidden sm:inline-block" />

          {/* Moderation quick trigger */}
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="hidden md:flex p-2 text-[#777B76] hover:text-[#193C32] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-[#E5E7E1]"
            title="Pannello Moderazione"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => setIsPostModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#193C32] hover:bg-[#244D40] rounded-xl transition-all shadow-xs active:scale-[0.98] whitespace-nowrap"
          >
            {t('nav.create')}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-[#777B76] hover:text-[#202522] hover:bg-white rounded-xl transition-colors border border-transparent hover:border-[#E5E7E1]"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E5E7E1] px-4 py-3 space-y-2 text-xs text-[#202522] animate-in fade-in shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E7E1]">
            <span className="text-[#777B76]">Città corrente:</span>
            <span className="font-bold text-[#193C32]">{selectedCity.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setViewMode(viewMode === 'map' ? 'grid' : 'map');
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#F8F8F5] border border-[#E5E7E1] text-left font-medium text-[#202522] flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#193C32]" />
              <span>{viewMode === 'map' ? 'Vista Elenco' : 'Vicino a te'}</span>
            </button>

            <button
              onClick={() => {
                onOpenAdPortal?.();
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#F8F8F5] border border-[#E5E7E1] text-left font-medium text-[#202522] flex items-center gap-1.5"
            >
              <Megaphone className="w-3.5 h-3.5 text-[#193C32]" />
              <span>Pubblicità</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-[#777B76]">
            <span>Account: {currentUser.role}</span>
            <button
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="text-[#193C32] font-semibold underline"
            >
              Gestisci Profilo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
