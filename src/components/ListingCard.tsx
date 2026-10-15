import React, { useMemo } from 'react';
import { Listing } from '../types';
import { useApp } from '../context/AppContext';
import { calculateDistanceKm } from '../utils/geo';
import { Heart, CheckCircle2, MessageCircle, Phone, ArrowUpRight, MapPin } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onOpenDetails: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onOpenDetails }) => {
  const { favorites, toggleFavorite, startConversation, selectedCity, userLocation } = useApp();
  const isFavorite = favorites.includes(listing.id);
  const isPromoted = listing.promotionTier === 'top_city' || listing.promotionTier === 'vetrina_home';

  const distanceKm = useMemo(() => {
    if (!userLocation || userLocation.lat == null || userLocation.lng == null) return null;
    const lat = listing.adLatitude ?? listing.lat;
    const lng = listing.adLongitude ?? listing.lng;
    return Math.max(1, Math.round(calculateDistanceKm(userLocation.lat, userLocation.lng, lat, lng)));
  }, [userLocation, listing]);

  return (
    <article
      onClick={() => onOpenDetails(listing)}
      className="group cursor-pointer rounded-2xl bg-white border border-[#E5E7E1] hover:border-[#193C32]/40 transition-all duration-200 overflow-hidden flex flex-col hover:shadow-sm"
    >
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F8F8F5]">
        {listing.images && listing.images[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F8F8F5] text-[#777B76] text-xs">
            Foto non disponibile
          </div>
        )}

        {/* Sponsorizzato label */}
        {isPromoted && (
          <div className="absolute top-3 left-3 bg-[#193C32] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
            Sponsorizzato
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(listing.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#777B76] hover:text-rose-500 hover:bg-white transition-colors border border-[#E5E7E1] shadow-xs"
          title={isFavorite ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
        >
          <Heart
            className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
          />
        </button>

        {/* Price tag */}
        {listing.ratePerHour != null && listing.ratePerHour > 0 && (
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-[#202522] text-xs font-bold px-2.5 py-1 rounded-lg border border-[#E5E7E1] font-mono shadow-xs">
            €{listing.ratePerHour} <span className="text-[10px] text-[#777B76] font-sans font-normal">/ ora</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata Line with typographic separators (NO PILLS) */}
          <div className="flex items-center gap-1.5 text-xs text-[#777B76] mb-1.5 font-normal">
            <span className="text-[#193C32] font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#E11D48] shrink-0" />
              <span>{listing.adLocation || listing.district || selectedCity.name}</span>
            </span>
            <span aria-hidden="true" className="text-[#E5E7E1]">·</span>
            <span>{listing.subcategoryId}</span>
            {distanceKm != null && (
              <>
                <span aria-hidden="true" className="text-[#E5E7E1]">·</span>
                <span className="font-mono text-[#202522] font-medium">
                  {distanceKm} km
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-[#202522] group-hover:text-[#193C32] transition-colors line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-xs text-[#777B76] line-clamp-2 leading-relaxed font-normal">
            {listing.description}
          </p>

          {/* Author Line */}
          <div className="mt-3 flex items-center justify-between text-xs text-[#202522] pt-2 border-t border-[#E5E7E1]">
            <div className="flex items-center gap-1.5 font-medium">
              <span>{listing.authorName}</span>
              {listing.verified && (
                <span title="Profilo Verificato">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#193C32]" />
                </span>
              )}
            </div>

            <div className="text-[11px] text-[#777B76] font-mono">
              {new Date(listing.createdAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-3 pt-2.5 flex items-center gap-2">
          {listing.phone && (
            <a
              href={`tel:${listing.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 py-1.5 px-2 bg-[#F8F8F5] hover:bg-[#E8EFEA] text-[#202522] hover:text-[#193C32] text-xs font-medium rounded-lg border border-[#E5E7E1] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3 h-3 text-[#193C32]" />
              <span>Chiama</span>
            </a>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              startConversation(listing.id, listing.authorName, 'Salve, ho visto il tuo annuncio su AMICA!');
            }}
            className="flex-1 py-1.5 px-2 bg-[#F8F8F5] hover:bg-[#E8EFEA] text-[#202522] hover:text-[#193C32] text-xs font-medium rounded-lg border border-[#E5E7E1] flex items-center justify-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3 h-3 text-[#193C32]" />
            <span>Messaggio</span>
          </button>

          <button
            onClick={() => onOpenDetails(listing)}
            className="p-1.5 bg-[#F8F8F5] hover:bg-[#193C32] hover:text-white text-[#777B76] rounded-lg border border-[#E5E7E1] transition-colors"
            title="Dettagli annuncio"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
