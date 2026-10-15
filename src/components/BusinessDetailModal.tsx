import React, { useState } from 'react';
import { Business } from '../types';
import { useApp } from '../context/AppContext';
import { getGoogleMapsNavigationUrl } from '../utils/geo';
import {
  X,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  ImageIcon,
  Film,
} from 'lucide-react';

interface BusinessDetailModalProps {
  business: Business;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  business,
  onClose,
  onOpenBooking,
}) => {
  const { selectedCity } = useApp();
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number>(0);

  const images = business.images || [];
  const videoUrl = business.videoUrl || (business.videos && business.videos[0]);

  const handleNextPhoto = () => {
    if (images.length > 1) {
      setActivePhotoIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handlePrevPhoto = () => {
    if (images.length > 1) {
      setActivePhotoIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-6 text-white animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Switcher Tab */}
        {videoUrl && (
          <div className="absolute top-4 left-4 z-30 flex items-center bg-black/70 backdrop-blur-md rounded-full p-1 border border-neutral-800">
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeMediaTab === 'photos'
                  ? 'bg-white text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Foto ({images.length})</span>
            </button>
            <button
              onClick={() => setActiveMediaTab('video')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                activeMediaTab === 'video'
                  ? 'bg-[#E11D48] text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>
          </div>
        )}

        {/* Media Container */}
        <div className="relative aspect-[16/9] w-full bg-black overflow-hidden">
          {activeMediaTab === 'video' && videoUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-black relative">
              <video
                src={videoUrl}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            </div>
          ) : images.length > 0 ? (
            <div className="relative w-full h-full">
              <img
                src={images[activePhotoIndex] || images[0]}
                alt={`${business.name} ${activePhotoIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-all active:scale-95"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute top-4 right-16 z-20 bg-black/70 text-white text-[11px] font-mono px-2.5 py-1 rounded-full border border-neutral-800">
                {activePhotoIndex + 1} / {images.length}
              </div>

              <div className="absolute bottom-4 left-6 flex items-center gap-2">
                <span className="bg-[#E11D48] text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {business.district || selectedCity.name}
                </span>
                <div className="flex items-center gap-1 bg-black/80 px-2.5 py-1 rounded-md border border-neutral-800 text-xs text-white font-semibold">
                  <Star className="w-3.5 h-3.5 fill-[#E11D48] text-[#E11D48]" />
                  <span>{business.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
              {business.name}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {activeMediaTab === 'photos' && images.length > 1 && (
          <div className="bg-neutral-900 p-2.5 border-b border-neutral-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  idx === activePhotoIndex
                    ? 'border-[#E11D48] scale-105'
                    : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {videoUrl && (
              <button
                onClick={() => setActiveMediaTab('video')}
                className="w-16 h-12 rounded-lg bg-black border border-neutral-800 text-white flex flex-col items-center justify-center shrink-0 hover:bg-neutral-950 transition-colors"
              >
                <Play className="w-4 h-4 fill-current text-[#E11D48]" />
                <span className="text-[9px] font-bold mt-0.5">Video</span>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {business.name}
              </h2>
              {business.verified && (
                <CheckCircle2 className="w-5 h-5 text-[#E11D48] shrink-0" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-2">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#E11D48]" />
                <span className="text-white">{business.address}</span>
                <span>({business.district || selectedCity.name})</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                <span>{business.openingHours}</span>
              </div>
            </div>
          </div>

          {business.description && (
            <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal">
              {business.description}
            </div>
          )}

          {/* Services List */}
          {business.services && business.services.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Trattamenti & Tariffe</span>
              </div>

              <div className="space-y-2">
                {business.services.map((srv) => (
                  <div
                    key={srv.id}
                    className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-semibold text-xs text-white">{srv.name}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {srv.durationMin} min · {srv.description}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[#E11D48] font-bold font-mono text-sm">
                        €{srv.priceEur}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="py-3 px-4 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all sm:col-span-2 active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              <span>Prenota Online</span>
            </button>

            <a
              href={getGoogleMapsNavigationUrl(business.lat, business.lng, business.name)}
              target="_blank"
              rel="noreferrer noopener"
              className="py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-xs rounded-xl border border-neutral-800 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-neutral-400" />
              <span>Mappe</span>
            </a>
          </div>

          {/* Direct phone / whatsapp row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#E11D48]" />
              <span className="font-mono text-white font-medium">{business.phone}</span>
            </div>
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer noopener"
                className="text-[#E11D48] hover:underline flex items-center gap-1 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
