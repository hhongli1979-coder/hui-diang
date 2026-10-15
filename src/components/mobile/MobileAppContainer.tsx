import React from 'react';
import { useApp } from '../../context/AppContext';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileHomeFeed } from './MobileHomeFeed';
import { MobileFriendsView } from './MobileFriendsView';
import { MobileCreateView } from './MobileCreateView';
import { MobileInboxView } from './MobileInboxView';
import { MobileProfileView } from './MobileProfileView';
import { Listing, Business } from '../../types';

interface MobileAppContainerProps {
  onOpenListingModal: (listing: Listing) => void;
  onOpenBusinessModal: (business: Business) => void;
}

export const MobileAppContainer: React.FC<MobileAppContainerProps> = ({
  onOpenListingModal,
  onOpenBusinessModal,
}) => {
  const { mobileTab } = useApp();

  return (
    <div className="relative w-full min-h-screen bg-neutral-950 text-white flex flex-col justify-between">
      {/* Active Tab Screen */}
      <main className="flex-1 w-full">
        {mobileTab === 'home' && (
          <MobileHomeFeed
            onOpenListingModal={onOpenListingModal}
            onOpenBusinessModal={onOpenBusinessModal}
          />
        )}

        {mobileTab === 'friends' && (
          <MobileFriendsView
            onOpenListingModal={onOpenListingModal}
          />
        )}

        {mobileTab === 'create' && (
          <MobileCreateView />
        )}

        {mobileTab === 'inbox' && (
          <MobileInboxView />
        )}

        {mobileTab === 'profile' && (
          <MobileProfileView
            onOpenListingModal={onOpenListingModal}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation (5 tabs) */}
      <MobileBottomNav />
    </div>
  );
};
