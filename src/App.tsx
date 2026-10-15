import React, { useState } from 'react';
import { I18nProvider } from './i18n';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MainFeed } from './components/MainFeed';
import { BusinessSection } from './components/BusinessSection';
import { Footer } from './components/Footer';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { ListingDetailModal } from './components/ListingDetailModal';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { SpaBookingModal } from './components/SpaBookingModal';
import { PostAdModal } from './components/PostAdModal';
import { UserAuthModal } from './components/UserAuthModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdvertiserCampaignModal } from './components/AdvertiserCampaignModal';
import { MessagesDrawer } from './components/MessagesDrawer';
import { AiSupportAssistant } from './components/AiSupportAssistant';
import { MobileAppGeoBar } from './components/MobileAppGeoBar';
import { ImmersiveDiscoverFeed } from './components/ImmersiveDiscoverFeed';
import { MerchantDashboardModal } from './components/MerchantDashboardModal';
import { MobileDualModeHeader } from './components/mobile/MobileDualModeHeader';
import { MobileAppContainer } from './components/mobile/MobileAppContainer';
import { DatingMatchModal } from './components/DatingMatchModal';

const AppContent: React.FC = () => {
  const {
    activeListing,
    setActiveListing,
    activeBusiness,
    setActiveBusiness,
    isBookingModalOpen,
    setIsBookingModalOpen,
    isPostModalOpen,
    setIsPostModalOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAdminModalOpen,
    setIsAdminModalOpen,
    isMerchantDashboardOpen,
    setIsMerchantDashboardOpen,
    isAiAssistantOpen,
    setIsAiAssistantOpen,
    isMessagesDrawerOpen,
    setIsMessagesDrawerOpen,
    viewMode,
    setViewMode,
    deviceMode,
    activeMatchModal,
    setActiveMatchModal,
    startConversation,
    setMobileTab,
  } = useApp();

  const [isAdPortalOpen, setIsAdPortalOpen] = useState(false);

  // Determine whether to display the Mobile App or Web Portal
  const isForcedMobile = deviceMode === 'mobile_app';
  const isForcedWeb = deviceMode === 'web';

  return (
    <div className="min-h-screen bg-[#F8F8F5] text-[#202522] flex flex-col selection:bg-[#E8EFEA] selection:text-[#193C32]">
      
      {/* 18+ Legal Age Verification Gateway */}
      <AgeVerificationModal />

      {/* AMICA Dual-Mode Engine Bar (Web + Mobile App Toggle) */}
      <MobileDualModeHeader />

      {/* Forced Mobile App Mode */}
      {isForcedMobile && (
        <div className="w-full bg-neutral-950 min-h-[calc(100vh-32px)] flex items-center justify-center p-0 md:py-6">
          <div className="w-full h-full md:max-w-[430px] md:h-[88vh] md:rounded-[36px] md:border md:border-white/15 md:shadow-2xl overflow-hidden bg-black flex flex-col">
            <MobileAppContainer
              onOpenListingModal={(l) => setActiveListing(l)}
              onOpenBusinessModal={(b) => setActiveBusiness(b)}
            />
          </div>
        </div>
      )}

      {/* Forced Web Desktop Mode */}
      {isForcedWeb && (
        <div className="flex-1 flex flex-col">
          <Header onOpenAdPortal={() => setIsAdPortalOpen(true)} />
          {viewMode === 'discover' ? (
            <ImmersiveDiscoverFeed
              onOpenListing={(listing) => setActiveListing(listing)}
              onOpenBusiness={(business) => setActiveBusiness(business)}
            />
          ) : (
            <>
              <HeroSection onOpenAdPortal={() => setIsAdPortalOpen(true)} />
              <MobileAppGeoBar
                onOpenPost={() => setIsPostModalOpen(true)}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onOpenMessages={() => setIsMessagesDrawerOpen(true)}
              />
              <main className="flex-1">
                <MainFeed
                  onOpenListing={(listing) => setActiveListing(listing)}
                  onOpenBusiness={(business) => setActiveBusiness(business)}
                />
                <BusinessSection />
              </main>
            </>
          )}
          <Footer />
        </div>
      )}

      {/* Automatic Responsive Dual-Mode (Default: Mobile on <md, Web on >=md) */}
      {!isForcedMobile && !isForcedWeb && (
        <>
          {/* Mobile Screen: 5-Tab TikTok Style Application (< md) */}
          <div className="block md:hidden w-full flex-1">
            <MobileAppContainer
              onOpenListingModal={(l) => setActiveListing(l)}
              onOpenBusinessModal={(b) => setActiveBusiness(b)}
            />
          </div>

          {/* Desktop Screen: Original Web Portal (>= md) */}
          <div className="hidden md:flex flex-col flex-1">
            <Header onOpenAdPortal={() => setIsAdPortalOpen(true)} />
            {viewMode === 'discover' ? (
              <ImmersiveDiscoverFeed
                onOpenListing={(listing) => setActiveListing(listing)}
                onOpenBusiness={(business) => setActiveBusiness(business)}
              />
            ) : (
              <>
                <HeroSection onOpenAdPortal={() => setIsAdPortalOpen(true)} />
                <MobileAppGeoBar
                  onOpenPost={() => setIsPostModalOpen(true)}
                  onOpenAuth={() => setIsAuthModalOpen(true)}
                  onOpenMessages={() => setIsMessagesDrawerOpen(true)}
                />
                <main className="flex-1">
                  <MainFeed
                    onOpenListing={(listing) => setActiveListing(listing)}
                    onOpenBusiness={(business) => setActiveBusiness(business)}
                  />
                  <BusinessSection />
                </main>
              </>
            )}
            <Footer />
          </div>
        </>
      )}

      {/* Modals & Drawers */}
      {activeListing && (
        <ListingDetailModal
          listing={activeListing}
          onClose={() => setActiveListing(null)}
        />
      )}

      {activeBusiness && (
        <BusinessDetailModal
          business={activeBusiness}
          onClose={() => setActiveBusiness(null)}
          onOpenBooking={() => setIsBookingModalOpen(true)}
        />
      )}

      {isBookingModalOpen && activeBusiness && (
        <SpaBookingModal
          business={activeBusiness}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}

      {isPostModalOpen && (
        <PostAdModal onClose={() => setIsPostModalOpen(false)} />
      )}

      {isAuthModalOpen && (
        <UserAuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}

      {isAdminModalOpen && (
        <AdminDashboardModal onClose={() => setIsAdminModalOpen(false)} />
      )}

      {isMerchantDashboardOpen && (
        <MerchantDashboardModal onClose={() => setIsMerchantDashboardOpen(false)} />
      )}

      {isAdPortalOpen && (
        <AdvertiserCampaignModal onClose={() => setIsAdPortalOpen(false)} />
      )}

      {/* Dating Match Notification Modal */}
      {activeMatchModal && (
        <DatingMatchModal
          match={activeMatchModal}
          onClose={() => setActiveMatchModal(null)}
          onStartChat={() => {
            startConversation(
              activeMatchModal.partnerId,
              activeMatchModal.partnerName,
              `Ciao ${activeMatchModal.partnerName}! Abbiamo un Match su AMICA! ✨`
            );
            setActiveMatchModal(null);
            setMobileTab('inbox');
          }}
        />
      )}

      <MessagesDrawer />
      <AiSupportAssistant />
    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </I18nProvider>
  );
}
