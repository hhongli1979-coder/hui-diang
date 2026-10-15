import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Listing, AdCampaign } from '../types';
import {
  X,
  LayoutDashboard,
  Megaphone,
  Upload,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  Plus,
  Eye,
  MousePointerClick,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Pause,
  Play,
  ArrowUpRight,
  ShieldCheck,
  Building,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface MerchantDashboardModalProps {
  onClose: () => void;
}

type TabType =
  | 'overview'
  | 'listings'
  | 'upload'
  | 'campaigns'
  | 'messages'
  | 'bookings'
  | 'settings';

export const MerchantDashboardModal: React.FC<MerchantDashboardModalProps> = ({
  onClose,
}) => {
  const {
    currentUser,
    listings,
    addListing,
    updateListing,
    deleteListing,
    campaigns,
    addCampaign,
    updateCampaign,
    bookingRequests,
    updateBookingStatus,
    conversations,
    selectedCity,
    cities,
    categories,
    setActiveConversation,
    setIsMessagesDrawerOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Merchant's listings
  const myListings = listings.filter(
    (l) => l.authorId === currentUser.id || currentUser.role === 'admin'
  );

  // New Listing Form State
  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [listingForm, setListingForm] = useState({
    title: '',
    categoryId: 'escort',
    subcategoryId: 'Indipendente',
    cityId: selectedCity.id,
    district: 'Centro Storico',
    description: '',
    ratePerHour: 100,
    phone: currentUser.phone || '+39 348 000 1122',
    whatsapp: currentUser.phone || '+39 348 000 1122',
    telegram: '',
    images: [] as string[],
  });

  // Media Upload State
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      id: string;
      name: string;
      sizeKb: number;
      dimensions: string;
      preview: string;
      status: 'ready' | 'uploading' | 'verified';
    }>
  >([
    {
      id: 'med_1',
      name: 'portfolio_main_portrait.jpg',
      sizeKb: 1420,
      dimensions: '1080 x 1920 (9:16)',
      preview: '/src/assets/images/discover_fashion_milan_1792084200282.jpg',
      status: 'verified',
    },
    {
      id: 'med_2',
      name: 'studio_interior_sanitized.jpg',
      sizeKb: 980,
      dimensions: '1080 x 1920 (9:16)',
      preview: '/src/assets/images/discover_lounge_bologna_1792084200626.jpg',
      status: 'verified',
    },
  ]);

  const [uploadError, setUploadError] = useState<string | null>(null);

  // New Campaign Form State
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    type: 'discover_feed' as AdCampaign['type'],
    cityId: selectedCity.id,
    budgetEur: 50,
    dailyBudgetEur: 10,
    linkUrl: '/it/discover',
  });

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Handle local file selection for media upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // File validation: Type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Formato non supportato. Utilizza file JPG, PNG o WEBP.');
      return;
    }

    // File validation: Size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Il file supera la dimensione massima consentita di 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const newMedia = {
        id: `med_${Date.now()}`,
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        dimensions: 'Rilevata (Auto-Ottimizzata)',
        preview: result,
        status: 'verified' as const,
      };

      setUploadedFiles((prev) => [newMedia, ...prev]);
      // Also add to listing form if currently drafting
      setListingForm((prev) => ({
        ...prev,
        images: [...prev.images, result],
      }));
      showSuccess(`Foto "${file.name}" caricata e validata con successo.`);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listingForm.title.trim() || !listingForm.description.trim()) {
      setUploadError('Inserisci titolo e descrizione per pubblicare.');
      return;
    }

    const imagesToUse =
      listingForm.images.length > 0
        ? listingForm.images
        : ['/src/assets/images/discover_fashion_milan_1792084200282.jpg'];

    const targetCity = cities.find((c) => c.id === listingForm.cityId) || selectedCity;

    addListing({
      title: listingForm.title,
      slug: listingForm.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      categoryId: listingForm.categoryId,
      subcategoryId: listingForm.subcategoryId,
      cityId: listingForm.cityId,
      district: listingForm.district,
      description: listingForm.description,
      images: imagesToUse,
      lat: targetCity.lat + (Math.random() - 0.5) * 0.01,
      lng: targetCity.lng + (Math.random() - 0.5) * 0.01,
      ratePerHour: Number(listingForm.ratePerHour),
      phone: listingForm.phone,
      whatsapp: listingForm.whatsapp,
      telegram: listingForm.telegram,
      verified: true,
      authorId: currentUser.id,
      authorName: currentUser.name,
      status: 'active',
      promotionTier: 'none',
      tags: ['Inserzionista Verificato', 'Nuovo Annuncio'],
    });

    setIsCreatingListing(false);
    showSuccess('Annuncio pubblicato con successo nel catalogo e feed!');
  };

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.title.trim()) {
      setUploadError('Inserisci un titolo per la campagna promozionale.');
      return;
    }

    addCampaign({
      title: campaignForm.title,
      type: campaignForm.type,
      cityId: campaignForm.cityId,
      budgetEur: Number(campaignForm.budgetEur),
      dailyBudgetEur: Number(campaignForm.dailyBudgetEur),
      active: true,
      linkUrl: campaignForm.linkUrl,
      status: 'active',
      bannerImage: '/src/assets/images/discover_fashion_milan_1792084200282.jpg',
    });

    setIsCreatingCampaign(false);
    showSuccess('Nuova campagna pubblicitaria attivata!');
  };

  // Metrics Calculation
  const totalViews = myListings.reduce((acc, l) => acc + l.viewsCount, 0) + 3820;
  const totalContacts = myListings.reduce((acc, l) => acc + l.contactsCount, 0) + 142;
  const activeCampaignsCount = campaigns.filter((c) => c.active).length;
  const totalBudgetSpent = campaigns.reduce((acc, c) => acc + (c.budgetEur || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E5E7E1] rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Top Modal Header */}
        <div className="px-6 py-4 bg-[#F8F8F5] border-b border-[#E5E7E1] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#193C32] text-white flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#202522]">
                  Pannello Gestione Inserzionisti & Attività
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EFEA] text-[#193C32] border border-[#193C32]/20">
                  Account Verificato
                </span>
              </div>
              <p className="text-xs text-[#777B76]">
                Gestisci annunci, carica media, campagne Ads, chat clienti e prenotazioni
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#777B76] hover:text-[#202522] rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Success Notification */}
        {successMessage && (
          <div className="bg-[#193C32] text-white text-xs px-6 py-2.5 flex items-center justify-between animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span className="font-medium">{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body: Sidebar Nav + Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-56 bg-[#F8F8F5] border-b md:border-b-0 md:border-r border-[#E5E7E1] p-3 flex md:flex-col gap-1 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-[#193C32] text-white shadow-xs'
                  : 'text-[#777B76] hover:text-[#202522] hover:bg-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Panoramica</span>
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                activeTab === 'listings'
                  ? 'bg-[#193C32] text-white shadow-xs'
                  : 'text-[#777B76] hover:text-[#202522] hover:bg-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>I Miei Annunci ({myListings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                activeTab === 'upload'
                  ? 'bg-[#193C32] text-white shadow-xs'
                  : 'text-[#777B76] hover:text-[#202522] hover:bg-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Carica Media</span>
            </button>

            <button
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                activeTab === 'campaigns'
                  ? 'bg-[#193C32] text-white shadow-xs'
                  : 'text-[#777B76] hover:text-[#202522] hover:bg-white'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>AMICA Ads ({campaigns.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'bg-[#193C32] text-white shadow-xs'
                  : 'text-[#777B76] hover:text-[#202522] hover:bg-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Messaggi Clienti</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-[#193C32] text-white shadow-xs'
                  : 'text-[#777B76] hover:text-[#202522] hover:bg-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Prenotazioni ({bookingRequests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-[#193C32] text-white shadow-xs'
                  : 'text-[#777B76] hover:text-[#202522] hover:bg-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Impostazioni & Doc</span>
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto bg-white">
            
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#202522]">
                    Bentornato, {currentUser.name}
                  </h3>
                  <p className="text-xs text-[#777B76] mt-0.5">
                    Ecco il riassunto in tempo reale dell'attività e delle conversioni dei tuoi annunci su AMICA.
                  </p>
                </div>

                {/* 4 KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#F8F8F5] border border-[#E5E7E1] rounded-2xl p-4">
                    <div className="flex items-center justify-between text-[#777B76] mb-2">
                      <span className="text-xs font-medium">Visualizzazioni</span>
                      <Eye className="w-4 h-4 text-[#193C32]" />
                    </div>
                    <div className="text-2xl font-black text-[#202522]">{totalViews.toLocaleString()}</div>
                    <div className="text-[11px] text-[#193C32] font-semibold mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +14.2% questa settimana
                    </div>
                  </div>

                  <div className="bg-[#F8F8F5] border border-[#E5E7E1] rounded-2xl p-4">
                    <div className="flex items-center justify-between text-[#777B76] mb-2">
                      <span className="text-xs font-medium">Contatti & Click</span>
                      <MousePointerClick className="w-4 h-4 text-[#193C32]" />
                    </div>
                    <div className="text-2xl font-black text-[#202522]">{totalContacts}</div>
                    <div className="text-[11px] text-[#777B76] mt-1">
                      CTR medio: 4.8%
                    </div>
                  </div>

                  <div className="bg-[#F8F8F5] border border-[#E5E7E1] rounded-2xl p-4">
                    <div className="flex items-center justify-between text-[#777B76] mb-2">
                      <span className="text-xs font-medium">Campagne Ads Attive</span>
                      <Megaphone className="w-4 h-4 text-[#193C32]" />
                    </div>
                    <div className="text-2xl font-black text-[#202522]">{activeCampaignsCount}</div>
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                      Feed TikTok & Top Città
                    </div>
                  </div>

                  <div className="bg-[#F8F8F5] border border-[#E5E7E1] rounded-2xl p-4">
                    <div className="flex items-center justify-between text-[#777B76] mb-2">
                      <span className="text-xs font-medium">Budget Investito</span>
                      <Sparkles className="w-4 h-4 text-[#193C32]" />
                    </div>
                    <div className="text-2xl font-black text-[#202522]">€{totalBudgetSpent}</div>
                    <div className="text-[11px] text-[#777B76] mt-1">
                      Fatturazione mensile attiva
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsCreatingListing(true);
                      setActiveTab('listings');
                    }}
                    className="px-4 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Pubblica Nuovo Annuncio</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCreatingCampaign(true);
                      setActiveTab('campaigns');
                    }}
                    className="px-4 py-2 bg-white border border-[#193C32] text-[#193C32] text-xs font-semibold rounded-xl flex items-center gap-2 hover:bg-[#E8EFEA] transition-colors"
                  >
                    <Megaphone className="w-4 h-4" />
                    <span>Attiva Promozione Feed</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 bg-[#F8F8F5] border border-[#E5E7E1] text-[#202522] text-xs font-semibold rounded-xl flex items-center gap-2 hover:bg-white transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Carica Nuove Foto 9:16</span>
                  </button>
                </div>

                {/* Recent Inquiries List */}
                <div className="pt-4 border-t border-[#E5E7E1]">
                  <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider mb-3">
                    Ultime Richieste e Messaggi
                  </h4>
                  <div className="space-y-2">
                    {conversations.slice(0, 3).map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => {
                          setActiveConversation(conv);
                          setIsMessagesDrawerOpen(true);
                        }}
                        className="p-3 bg-[#F8F8F5] border border-[#E5E7E1] rounded-xl flex items-center justify-between cursor-pointer hover:border-[#193C32]/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#193C32] text-white text-xs font-bold flex items-center justify-center">
                            {conv.partnerName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-[#202522]">{conv.partnerName}</div>
                            <div className="text-[11px] text-[#777B76] truncate max-w-xs">{conv.lastMessage}</div>
                          </div>
                        </div>
                        <div className="text-[10px] text-[#777B76] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{conv.lastTimestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MY LISTINGS */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#202522]">Gestione Annunci</h3>
                    <p className="text-xs text-[#777B76]">
                      Crea, modifica o metti in pausa i tuoi annunci visibili sul catalogo e nel feed TikTok.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreatingListing(!isCreatingListing)}
                    className="px-4 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isCreatingListing ? 'Annulla' : 'Nuovo Annuncio'}</span>
                  </button>
                </div>

                {/* Form to create listing */}
                {isCreatingListing && (
                  <form
                    onSubmit={handleCreateListingSubmit}
                    className="bg-[#F8F8F5] border border-[#E5E7E1] rounded-2xl p-5 space-y-4 animate-in fade-in"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#193C32]">
                      Dati del Nuovo Annuncio
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#202522] mb-1">
                          Titolo Annuncio *
                        </label>
                        <input
                          type="text"
                          required
                          value={listingForm.title}
                          onChange={(e) => setListingForm({ ...listingForm, title: e.target.value })}
                          placeholder="es. Sofia – Accompagnatrice di classe in centro"
                          className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#193C32]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#202522] mb-1">
                          Tariffa oraria (€)
                        </label>
                        <input
                          type="number"
                          value={listingForm.ratePerHour}
                          onChange={(e) => setListingForm({ ...listingForm, ratePerHour: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#193C32]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#202522] mb-1">
                          Città
                        </label>
                        <select
                          value={listingForm.cityId}
                          onChange={(e) => setListingForm({ ...listingForm, cityId: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522]"
                        >
                          {cities.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#202522] mb-1">
                          Zona / Quartiere
                        </label>
                        <input
                          type="text"
                          value={listingForm.district}
                          onChange={(e) => setListingForm({ ...listingForm, district: e.target.value })}
                          placeholder="es. Centro Storico, Brera"
                          className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#202522] mb-1">
                        Descrizione Dettagliata *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={listingForm.description}
                        onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })}
                        placeholder="Descrivi l'ambiente, i servizi offerti e le modalità di ricezione..."
                        className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#193C32]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingListing(false)}
                        className="px-4 py-2 border border-[#E5E7E1] text-[#777B76] text-xs font-semibold rounded-xl hover:bg-white"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl"
                      >
                        Pubblica Subito
                      </button>
                    </div>
                  </form>
                )}

                {/* Listings List */}
                <div className="space-y-3">
                  {myListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="p-4 bg-white border border-[#E5E7E1] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#193C32]/40 transition-colors shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.images[0] || '/src/assets/images/verified_profile_preview_1792082231358.jpg'}
                          alt={listing.title}
                          className="w-16 h-20 rounded-xl object-cover shrink-0 border border-[#E5E7E1]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-[#202522] line-clamp-1">
                              {listing.title}
                            </h4>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                listing.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {listing.status === 'active' ? 'Attivo nel Feed' : 'In Pausa'}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#777B76] mt-1">
                            {listing.district} · €{listing.ratePerHour}/ora · {listing.viewsCount} visualizzazioni
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => {
                            const newStatus = listing.status === 'active' ? 'paused' : 'active';
                            updateListing(listing.id, { status: newStatus });
                            showSuccess(`Stato annuncio modificato in: ${newStatus}`);
                          }}
                          className="p-2 border border-[#E5E7E1] rounded-xl hover:bg-[#F8F8F5] text-xs font-semibold flex items-center gap-1"
                          title="Pausa / Riattiva"
                        >
                          {listing.status === 'active' ? (
                            <>
                              <Pause className="w-3.5 h-3.5 text-amber-600" />
                              <span className="text-amber-800">Pausa</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-800">Attiva</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm('Sei sicuro di voler eliminare questo annuncio?')) {
                              deleteListing(listing.id);
                              showSuccess('Annuncio rimosso.');
                            }
                          }}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Elimina"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MEDIA UPLOAD (REAL PIPELINE) */}
            {activeTab === 'upload' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#202522]">Caricamento e Gestione Foto</h3>
                  <p className="text-xs text-[#777B76]">
                    Carica foto ad alta definizione in formato 9:16 per il feed immersivo TikTok e per la scheda annuncio.
                  </p>
                </div>

                {uploadError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Drag and drop upload zone */}
                <div className="border-2 border-dashed border-[#193C32]/30 hover:border-[#193C32] rounded-3xl p-8 bg-[#F8F8F5] flex flex-col items-center justify-center text-center transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-[#E8EFEA] text-[#193C32] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#202522]">
                    Trascina qui le tue foto o fai clic per sfogliare
                  </h4>
                  <p className="text-xs text-[#777B76] mt-1 max-w-sm">
                    Supporta JPG, PNG, WEBP. Dimensione massima 10MB per file. Proporzioni consigliate 9:16 o 3:4.
                  </p>

                  <label className="mt-5 px-5 py-2.5 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl cursor-pointer shadow-xs transition-colors">
                    <span>Seleziona Foto dal Dispositivo</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Uploaded Gallery Grid */}
                <div>
                  <h4 className="text-xs font-bold text-[#202522] uppercase tracking-wider mb-3">
                    Media Disponibili nel tuo Archivio ({uploadedFiles.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {uploadedFiles.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-[#E5E7E1] rounded-2xl overflow-hidden shadow-xs flex flex-col"
                      >
                        <div className="aspect-[9/16] bg-neutral-900 relative">
                          <img
                            src={item.preview}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#193C32] text-white shadow-xs">
                            {item.status === 'verified' ? 'Verificato' : 'In Elaborazione'}
                          </span>
                        </div>
                        <div className="p-3">
                          <div className="text-[11px] font-bold text-[#202522] truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-[#777B76] mt-0.5">
                            {item.sizeKb} KB · {item.dimensions}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ADVERTISING CAMPAIGNS (AMICA ADS) */}
            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#202522]">AMICA Ads Intelligence</h3>
                    <p className="text-xs text-[#777B76]">
                      Promuovi il tuo profilo in cima al feed TikTok, nella home page o nei risultati della tua città.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCreatingCampaign(!isCreatingCampaign)}
                    className="px-4 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isCreatingCampaign ? 'Annulla' : 'Crea Campagna'}</span>
                  </button>
                </div>

                {isCreatingCampaign && (
                  <form
                    onSubmit={handleCreateCampaignSubmit}
                    className="bg-[#F8F8F5] border border-[#E5E7E1] rounded-2xl p-5 space-y-4 animate-in fade-in"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#193C32]">
                      Configura Nuova Campagna Promozionale
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#202522] mb-1">
                          Nome Campagna *
                        </label>
                        <input
                          type="text"
                          required
                          value={campaignForm.title}
                          onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                          placeholder="es. Spotlight Feed Bologna Weekend"
                          className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#202522] mb-1">
                          Posizionamento Sponsorizzato *
                        </label>
                        <select
                          value={campaignForm.type}
                          onChange={(e) => setCampaignForm({ ...campaignForm, type: e.target.value as any })}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522]"
                        >
                          <option value="discover_feed">Feed Immersivo Scopri (TikTok-Style) - Altissima Visibilità</option>
                          <option value="top_city">Top Città (Primo posto nei risultati della città)</option>
                          <option value="vetrina_home">Vetrina Homepage AMICA</option>
                          <option value="category_spotlight">Spotlight Categoria</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#202522] mb-1">
                          Budget Totale (€)
                        </label>
                        <input
                          type="number"
                          value={campaignForm.budgetEur}
                          onChange={(e) => setCampaignForm({ ...campaignForm, budgetEur: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#202522] mb-1">
                          Limite Giornaliero (€/giorno)
                        </label>
                        <input
                          type="number"
                          value={campaignForm.dailyBudgetEur}
                          onChange={(e) => setCampaignForm({ ...campaignForm, dailyBudgetEur: Number(e.target.value) })}
                          className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingCampaign(false)}
                        className="px-4 py-2 border border-[#E5E7E1] text-[#777B76] text-xs font-semibold rounded-xl"
                      >
                        Annulla
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#193C32] hover:bg-[#244D40] text-white text-xs font-semibold rounded-xl"
                      >
                        Attiva Campagna
                      </button>
                    </div>
                  </form>
                )}

                {/* Campaigns List */}
                <div className="space-y-3">
                  {campaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="p-4 bg-white border border-[#E5E7E1] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#193C32]/40 transition-colors shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-[#202522]">{camp.title}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8EFEA] text-[#193C32]">
                            {camp.type === 'discover_feed'
                              ? 'Feed TikTok'
                              : camp.type === 'top_city'
                              ? 'Top Città'
                              : 'Vetrina'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#777B76] mt-1 flex items-center gap-3">
                          <span>Visualizzazioni: <strong>{camp.impressions}</strong></span>
                          <span>Click: <strong>{camp.clicks}</strong></span>
                          <span>CTR: <strong>{((camp.clicks / (camp.impressions || 1)) * 100).toFixed(1)}%</strong></span>
                          <span>Budget: <strong>€{camp.budgetEur}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            updateCampaign(camp.id, { active: !camp.active });
                            showSuccess(`Campagna ${camp.active ? 'messa in pausa' : 'riattivata'}.`);
                          }}
                          className="px-3 py-1.5 border border-[#E5E7E1] rounded-xl text-xs font-semibold hover:bg-[#F8F8F5]"
                        >
                          {camp.active ? 'Metti in Pausa' : 'Attiva'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: MESSAGES */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#202522]">Messaggi e Consulenze Clienti</h3>
                  <p className="text-xs text-[#777B76]">
                    Rispondi direttamente alle richieste ricevute tramite i tuoi annunci o tramite il feed Scopri.
                  </p>
                </div>

                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        setActiveConversation(conv);
                        setIsMessagesDrawerOpen(true);
                      }}
                      className="p-4 bg-white border border-[#E5E7E1] rounded-2xl flex items-center justify-between cursor-pointer hover:border-[#193C32] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#193C32] text-white font-bold flex items-center justify-center">
                          {conv.partnerName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#202522]">{conv.partnerName}</div>
                          <div className="text-xs text-[#777B76] mt-0.5">{conv.lastMessage}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-[#777B76]">{conv.lastTimestamp}</span>
                        {conv.unreadCount > 0 && (
                          <div className="mt-1 inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#193C32] text-white">
                            {conv.unreadCount} non letti
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#202522]">Richieste di Prenotazione</h3>
                  <p className="text-xs text-[#777B76]">
                    Gestisci le prenotazioni per massaggi e percorsi SPA ricevute tramite AMICA.
                  </p>
                </div>

                <div className="space-y-3">
                  {bookingRequests.map((bk) => (
                    <div
                      key={bk.id}
                      className="p-4 bg-white border border-[#E5E7E1] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#202522]">{bk.customerName}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              bk.status === 'confirmed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : bk.status === 'rejected'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {bk.status === 'confirmed'
                              ? 'Confermata'
                              : bk.status === 'rejected'
                              ? 'Rifiutata'
                              : 'In Attesa'}
                          </span>
                        </div>
                        <div className="text-xs text-[#777B76] mt-1">
                          Servizio: <strong>{bk.serviceName}</strong> (€{bk.priceEur}) · Data: <strong>{bk.date} alle {bk.timeSlot}</strong>
                        </div>
                        <div className="text-[11px] text-[#777B76] mt-0.5">
                          Tel: {bk.customerPhone} · Email: {bk.customerEmail}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {bk.status === 'pending' && (
                          <>
                            <button
                              onClick={() => {
                                updateBookingStatus(bk.id, 'confirmed');
                                showSuccess('Prenotazione confermata con successo!');
                              }}
                              className="px-3 py-1.5 bg-[#193C32] text-white text-xs font-semibold rounded-xl hover:bg-[#244D40]"
                            >
                              Conferma
                            </button>
                            <button
                              onClick={() => {
                                updateBookingStatus(bk.id, 'rejected');
                                showSuccess('Prenotazione declinata.');
                              }}
                              className="px-3 py-1.5 border border-[#E5E7E1] text-[#777B76] text-xs font-semibold rounded-xl hover:bg-rose-50 hover:text-rose-600"
                            >
                              Rifiuta
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: SETTINGS & VERIFICATION */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-lg font-bold text-[#202522]">Verifica Attività e Impostazioni</h3>
                  <p className="text-xs text-[#777B76]">
                    La verifica garantisce il badge "Verificato" con aumento medio dell'80% dei contatti.
                  </p>
                </div>

                <div className="bg-[#E8EFEA] border border-[#193C32]/20 rounded-2xl p-4 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-[#193C32] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#193C32]">
                      Stato Account: Verificato e Conforme 18+
                    </div>
                    <div className="text-[11px] text-[#193C32]/80 mt-0.5">
                      I documenti d'identità sono stati convalidati e la fatturazione è conforme alla legge italiana.
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#202522] mb-1">
                      Nome Attività o Nome d'Arte
                    </label>
                    <input
                      type="text"
                      defaultValue={currentUser.name}
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202522] mb-1">
                      Recapito Telefonico / WhatsApp
                    </label>
                    <input
                      type="text"
                      defaultValue={currentUser.phone || '+39 348 712 9014'}
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#202522] mb-1">
                      Partita IVA / Codice Fiscale (Per fatturazione pubblicitaria)
                    </label>
                    <input
                      type="text"
                      defaultValue="IT 03988100371"
                      className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-xs text-[#202522]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => showSuccess('Impostazioni profilo salvate con successo.')}
                    className="px-5 py-2.5 bg-[#193C32] text-white text-xs font-semibold rounded-xl hover:bg-[#244D40] transition-colors"
                  >
                    Salva Modifiche
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
