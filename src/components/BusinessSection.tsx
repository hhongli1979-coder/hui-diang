import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Calendar, Star, Clock, MapPin, CheckCircle2, ChevronRight, Play, ImageIcon } from 'lucide-react';

export const BusinessSection: React.FC = () => {
  const {
    filteredBusinesses,
    selectedCity,
    setActiveBusiness,
    setIsBookingModalOpen,
  } = useApp();

  return (
    <section id="benessere-section" className="py-12 border-t border-neutral-800 bg-black text-white">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#E11D48] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Centri Benessere & SPA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Massaggi & SPA a {selectedCity.name}
            </h2>
          </div>

          <div className="text-xs font-medium text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-full border border-neutral-800">
            {filteredBusinesses.length} centri disponibili
          </div>
        </div>

        {/* Business Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBusinesses.map((biz) => {
            const images = biz.images || [];
            const hasVideo = !!biz.videoUrl || (biz.videos && biz.videos.length > 0);

            return (
              <div
                key={biz.id}
                className="rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-[#E11D48]/50 transition-all p-5 sm:p-6 shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Photo & Video Preview Strip */}
                  <div
                    onClick={() => setActiveBusiness(biz)}
                    className="relative cursor-pointer mb-4 overflow-hidden rounded-xl border border-neutral-800 bg-black aspect-[16/9]"
                  >
                    <img
                      src={images[0]}
                      alt={biz.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

                    {/* Photos Count Badge */}
                    <div className="absolute top-3 left-3 bg-black/70 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-neutral-800 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{images.length} Foto</span>
                    </div>

                    {/* Video Tour Badge */}
                    {hasVideo && (
                      <div className="absolute top-3 right-3 bg-[#E11D48] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Play className="w-3 h-3 fill-current" />
                        <span>Video</span>
                      </div>
                    )}

                    {/* Thumbnail Strip */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-none">
                      {images.slice(0, 6).map((thumb, idx) => (
                        <div
                          key={idx}
                          className="w-10 h-7 rounded border border-neutral-700 overflow-hidden shrink-0 bg-black/50"
                        >
                          <img src={thumb} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 
                          onClick={() => setActiveBusiness(biz)}
                          className="text-lg font-bold text-white group-hover:text-[#E11D48] transition-colors cursor-pointer"
                        >
                          {biz.name}
                        </h3>
                        {biz.verified && (
                          <CheckCircle2 className="w-4 h-4 text-[#E11D48] shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-[#E11D48] shrink-0" />
                        <span className="text-neutral-300">{biz.address}</span>
                        <span className="text-neutral-700">·</span>
                        <span className="text-white font-medium">{biz.district}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 bg-black px-2.5 py-1 rounded-lg border border-neutral-800 text-xs text-white font-semibold shrink-0">
                      <Star className="w-3.5 h-3.5 fill-[#E11D48] text-[#E11D48]" />
                      <span>{biz.rating.toFixed(1)}</span>
                      <span className="text-neutral-500 font-normal text-[11px]">({biz.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-3 text-xs text-neutral-400 leading-relaxed line-clamp-2 font-normal">
                    {biz.description}
                  </p>

                  {/* Operating hours */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{biz.openingHours}</span>
                  </div>

                  {/* Services Preview list */}
                  <div className="mt-4 pt-3 border-t border-neutral-800 space-y-2">
                    {biz.services.slice(0, 2).map((srv) => (
                      <div
                        key={srv.id}
                        className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-black/60 border border-neutral-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{srv.name}</span>
                          <span className="text-neutral-500 text-[11px]">({srv.durationMin} min)</span>
                        </div>
                        <span className="text-[#E11D48] font-bold font-mono">€{srv.priceEur}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveBusiness(biz);
                      setIsBookingModalOpen(true);
                    }}
                    className="flex-1 py-2.5 px-3 bg-[#E11D48] hover:bg-[#BE123C] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-98"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Prenota Online</span>
                  </button>

                  <button
                    onClick={() => setActiveBusiness(biz)}
                    className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl border border-neutral-800 flex items-center gap-1 transition-colors active:scale-98"
                  >
                    <span>Foto & Video</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
