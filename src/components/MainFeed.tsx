import React from 'react';
import { useApp } from '../context/AppContext';
import { ListingCard } from './ListingCard';
import { InteractiveMap } from './InteractiveMap';
import { Listing, Business, SEEKING_CATEGORIES } from '../types';
import {
  SlidersHorizontal,
  Map as MapIcon,
  LayoutGrid,
  Columns,
  CheckCircle2,
  Navigation,
  Heart,
  MapPin,
} from 'lucide-react';

interface MainFeedProps {
  onOpenListing: (listing: Listing) => void;
  onOpenBusiness: (business: Business) => void;
}

export const MainFeed: React.FC<MainFeedProps> = ({ onOpenListing, onOpenBusiness }) => {
  const {
    filteredListings,
    filteredBusinesses,
    selectedCity,
    selectedCategory,
    setSelectedCategory,
    selectedSeekingCategory,
    setSelectedSeekingCategory,
    categories,
    selectedSubcategory,
    setSelectedSubcategory,
    sortBy,
    setSortBy,
    verifiedOnly,
    setVerifiedOnly,
    searchRadiusKm,
    setSearchRadiusKm,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
  } = useApp();

  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const mapItems = [...filteredListings, ...filteredBusinesses];

  return (
    <div id="incontri-section" className="max-w-[1120px] mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Filter and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E7E1]">
        
        {/* Results title & Active Scope */}
        <div>
          <div className="flex items-center gap-2 text-xs text-[#777B76]">
            <span>AMICA</span>
            <span>/</span>
            <span className="text-[#193C32] font-semibold">{selectedCity.name}</span>
            <span>/</span>
            <span className="text-[#202522]">
              {currentCategory ? currentCategory.name : 'Tutte le categorie'}
            </span>
          </div>

          <div className="flex items-baseline gap-2.5 mt-1">
            <h2 className="text-xl sm:text-2xl font-bold text-[#202522]">
              {currentCategory ? currentCategory.name : 'Risultati di ricerca'}
            </h2>
            <span className="text-xs text-[#777B76] font-mono">
              ({filteredListings.length} {filteredListings.length === 1 ? 'annuncio' : 'annunci'})
            </span>
          </div>
        </div>

        {/* Toolbar: View mode, Sort, and Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Verified Only Toggle */}
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              verifiedOnly
                ? 'bg-[#E8EFEA] border-[#193C32]/40 text-[#193C32] font-semibold'
                : 'bg-white border-[#E5E7E1] text-[#777B76] hover:text-[#202522]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#193C32]" />
            <span>Solo verificati</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-[#E5E7E1] px-3 py-1.5 rounded-xl text-xs text-[#202522]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#777B76]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#202522] focus:outline-none cursor-pointer text-xs"
            >
              <option value="recommended">Consigliati & Sponsor</option>
              <option value="distance">Distanza (Più vicini)</option>
              <option value="newest">Più recenti</option>
              <option value="price_asc">Prezzo crescente</option>
              <option value="price_desc">Prezzo decrescente</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-white border border-[#E5E7E1] p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-[#193C32] text-white' : 'text-[#777B76] hover:text-[#202522]'
              }`}
              title="Vista Griglia"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`hidden lg:block p-1.5 rounded-lg transition-colors ${
                viewMode === 'split' ? 'bg-[#193C32] text-white' : 'text-[#777B76] hover:text-[#202522]'
              }`}
              title="Vista Divisa Elenco + Mappa"
            >
              <Columns className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-[#193C32] text-white' : 'text-[#777B76] hover:text-[#202522]'
              }`}
              title="Vista Mappa Interattiva"
            >
              <MapIcon className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Category Segmented Buttons */}
      <div className="flex items-center gap-1.5 py-3 overflow-x-auto text-xs border-b border-[#E5E7E1]/80">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-[#193C32] text-white font-semibold'
              : 'bg-white border border-[#E5E7E1] text-[#777B76] hover:text-[#202522]'
          }`}
        >
          Tutte le categorie
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-[#193C32] text-white font-semibold'
                : 'bg-white border border-[#E5E7E1] text-[#777B76] hover:text-[#202522]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Standard Seeking Category Bar (所有类别、女子寻男、男寻女、男人寻找男人、女人寻找女人、情侣、我在寻找朋友、我在寻找我的灵魂伴侣) */}
      <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto text-xs border-b border-[#E5E7E1]/80">
        <span className="text-[11px] font-semibold text-[#777B76] shrink-0 mr-1 flex items-center gap-1">
          <Heart className="w-3.5 h-3.5 text-[#193C32]" />
          Desiderio / Cerco:
        </span>
        {SEEKING_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedSeekingCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap border shrink-0 ${
              selectedSeekingCategory === cat.id
                ? 'bg-[#193C32] text-white border-[#193C32] font-semibold shadow-xs'
                : 'bg-white border-[#E5E7E1] text-[#777B76] hover:text-[#202522] hover:border-[#193C32]/30'
            }`}
          >
            {cat.label} ({cat.zh})
          </button>
        ))}
      </div>

      {/* Proximity Radius Selector */}
      <div className="flex items-center gap-2 py-2 overflow-x-auto text-xs border-b border-[#E5E7E1]/60">
        <span className="text-[11px] font-semibold text-[#777B76] shrink-0 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#193C32]" />
          Raggio da {selectedCity.name}:
        </span>
        {[5, 10, 25, 50, 100].map((r) => (
          <button
            key={r}
            onClick={() => setSearchRadiusKm(r)}
            className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              searchRadiusKm === r
                ? 'bg-[#193C32] text-white font-bold'
                : 'bg-white border border-[#E5E7E1] text-[#777B76] hover:text-[#202522]'
            }`}
          >
            {r} km
          </button>
        ))}
      </div>

      {/* Subcategory Filter Tabs (if category selected) */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto text-xs border-b border-[#E5E7E1]/60">
          {currentCategory.subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-2.5 py-0.5 rounded-md transition-colors whitespace-nowrap text-[11px] ${
                selectedSubcategory === sub
                  ? 'bg-[#E8EFEA] text-[#193C32] font-semibold border border-[#193C32]/30'
                  : 'text-[#777B76] hover:text-[#202522]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* District Quick Filter Chips */}
      {selectedCity.popularDistricts && (
        <div className="flex items-center gap-2 py-3 overflow-x-auto text-xs text-[#777B76]">
          <span className="font-semibold text-[#202522] shrink-0">Quartieri {selectedCity.name}:</span>
          {selectedCity.popularDistricts.map((district) => (
            <button
              key={district}
              onClick={() => setSearchQuery(district)}
              className="hover:text-[#193C32] transition-colors whitespace-nowrap text-[11px]"
            >
              {district} ·
            </button>
          ))}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-rose-600 hover:underline shrink-0 ml-2 text-[11px]"
            >
              Rimuovi filtro
            </button>
          )}
        </div>
      )}

      {/* Main Content Layout based on viewMode */}
      <div className="mt-6">
        
        {/* VIEW 1: FULL MAP VIEW */}
        {viewMode === 'map' && (
          <div className="space-y-4">
            <InteractiveMap
              items={mapItems}
              onSelectItem={onOpenListing}
              onSelectBusiness={onOpenBusiness}
            />
            <div className="text-center">
              <button
                onClick={() => setViewMode('grid')}
                className="text-xs text-[#193C32] hover:underline font-semibold"
              >
                Torna alla vista elenco schede
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: SPLIT VIEW (DESKTOP) */}
        {viewMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4 max-h-[750px] overflow-y-auto pr-2">
              {filteredListings.length === 0 ? (
                <EmptyState onReset={() => setSelectedCategory('all')} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredListings.map((item) => (
                    <ListingCard key={item.id} listing={item} onOpenDetails={onOpenListing} />
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 sticky top-20">
              <InteractiveMap
                items={mapItems}
                onSelectItem={onOpenListing}
                onSelectBusiness={onOpenBusiness}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: GRID VIEW */}
        {viewMode === 'grid' && (
          <div>
            {filteredListings.length === 0 ? (
              <EmptyState onReset={() => setSelectedCategory('all')} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((item) => (
                  <ListingCard key={item.id} listing={item} onOpenDetails={onOpenListing} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const EmptyState: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  const { setIsPostModalOpen, searchRadiusKm, setSearchRadiusKm, selectedCity } = useApp();

  return (
    <div className="col-span-full py-16 text-center space-y-4 bg-white border border-[#E5E7E1] rounded-2xl p-8">
      <div className="w-12 h-12 rounded-xl bg-[#F8F8F5] border border-[#E5E7E1] flex items-center justify-center mx-auto text-[#193C32]">
        <Navigation className="w-5 h-5" />
      </div>
      <h3 className="text-base font-bold text-[#202522]">
        附近暂时没有更多符合条件的人
      </h3>
      <p className="text-xs text-[#777B76] max-w-md mx-auto">
        Nel raggio di <strong className="text-[#202522]">{searchRadiusKm} km</strong> a{' '}
        <strong className="text-[#202522]">{selectedCity.name}</strong> non ci sono annunci con i criteri selezionati.
        Puoi ampliare la distanza o pubblicare il tuo annuncio.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          onClick={() => setSearchRadiusKm(50)}
          className="px-4 py-2 bg-[#E8EFEA] hover:bg-[#d8e4db] text-[#193C32] text-xs font-semibold rounded-xl border border-[#193C32]/30 transition-colors"
        >
          扩大到 50 km (Espandi a 50 km)
        </button>
        <button
          onClick={() => setSearchRadiusKm(100)}
          className="px-4 py-2 bg-[#E8EFEA] hover:bg-[#d8e4db] text-[#193C32] text-xs font-semibold rounded-xl border border-[#193C32]/30 transition-colors"
        >
          扩大到 100 km (Espandi a 100 km)
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-[#F8F8F5] hover:bg-[#E5E7E1] text-[#202522] text-xs font-semibold rounded-xl border border-[#E5E7E1]"
        >
          Mostra tutti i generi
        </button>
        <button
          onClick={() => setIsPostModalOpen(true)}
          className="px-4 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl shadow-xs"
        >
          Pubblica per primo
        </button>
      </div>
    </div>
  );
};
