import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Listing } from '../../types';
import {
  Settings,
  Share2,
  Grid3X3,
  Bookmark,
  Heart,
  ShieldCheck,
  MapPin,
  Edit3,
  Lock,
  Eye,
  Check,
  Plus,
  MessageCircle,
  Flag,
  Ban,
  X,
  Camera,
  Trash2,
  Sparkles,
  Download,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface MobileProfileViewProps {
  onOpenListingModal?: (listing: Listing) => void;
}

export const MobileProfileView: React.FC<MobileProfileViewProps> = ({ onOpenListingModal }) => {
  const {
    currentUser,
    viewingUserProfile,
    setViewingUserProfile,
    followingUserIds,
    toggleFollowUser,
    isFollowingUser,
    listings,
    deleteListing,
    favorites,
    toggleFavorite,
    startConversation,
    setMobileTab,
    updateUserProfile,
    blockedUserIds,
    toggleBlockUser,
    exportUserDataJSON,
    profileVisibility,
    setProfileVisibility,
  } = useApp();

  // Determine if viewing own profile or another member's profile
  const isOwnProfile = !viewingUserProfile || viewingUserProfile.id === currentUser.id;
  const targetUser: User = isOwnProfile ? currentUser : viewingUserProfile!;

  // Tabs: 'works' (Opere / 作品) | 'saved' (Salvati / 收藏) | 'liked' (Mi Piace / 喜欢)
  const [activeTab, setActiveTab] = useState<'works' | 'saved' | 'liked'>('works');

  // Modals & Settings Drawer
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [exportSuccessToast, setExportSuccessToast] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editCity, setEditCity] = useState(currentUser.city || 'Bologna');
  const [editAge, setEditAge] = useState(currentUser.age || 25);

  // 1. Works published by this user
  const userWorks = listings.filter((l) => l.authorId === targetUser.id);

  // 2. Saved / Bookmarked items (only accessible by current user)
  const savedItems = listings.filter((l) => favorites.includes(l.id));

  // 3. Liked items
  const likedItems = listings.filter((l) => !!l.isLiked);

  const isFollowing = isFollowingUser(targetUser.id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName.trim(),
      bio: editBio.trim(),
      city: editCity.trim(),
      age: Number(editAge),
    });
    setIsEditModalOpen(false);
  };

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleExportData = () => {
    exportUserDataJSON();
    setExportSuccessToast(true);
    setTimeout(() => setExportSuccessToast(false), 3000);
  };

  return (
    <div className="w-full min-h-[calc(100dvh-3.5rem)] bg-neutral-950 text-white pb-20 select-none">
      
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-md border-b border-white/10 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isOwnProfile && (
            <button
              onClick={() => setViewingUserProfile(null)}
              className="text-xs text-[#E11D48] font-semibold hover:underline"
            >
              ← Torna al mio profilo
            </button>
          )}
          <span className="text-sm font-bold tracking-tight text-white">
            {targetUser.username ? `@${targetUser.username}` : targetUser.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareProfile}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Condividi profilo"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {isOwnProfile && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Impostazioni account"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Header Details */}
      <div className="px-4 pt-4 pb-2 text-center flex flex-col items-center">
        
        {/* Avatar */}
        <div className="relative mb-2.5">
          <div className="w-20 h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#E11D48] via-[#BE123C] to-white/30 shadow-xl">
            <img
              src={targetUser.avatar || '/src/assets/images/discover_fashion_milan_1792084200282.jpg'}
              alt={targetUser.name}
              className="w-full h-full rounded-full object-cover border-2 border-black"
            />
          </div>

          {targetUser.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E11D48] border-2 border-black flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {/* Name & Username */}
        <div className="flex items-center gap-1.5 justify-center">
          <h2 className="text-base font-bold text-white tracking-tight">
            {targetUser.name}
          </h2>
          {targetUser.age && (
            <span className="text-xs text-neutral-400">· {targetUser.age}</span>
          )}
        </div>

        {targetUser.username && (
          <p className="text-xs text-neutral-400 mt-0.5">
            @{targetUser.username}
          </p>
        )}

        {/* City and status */}
        <div className="flex items-center gap-1 text-xs text-neutral-300 mt-1">
          <MapPin className="w-3.5 h-3.5 text-[#00F2FE]" />
          <span>{targetUser.city || 'Bologna'}</span>
          <span className="text-neutral-500">·</span>
          <span className="text-emerald-400 font-medium">Verificato 18+</span>
        </div>

        {/* Stats Row: Following / Followers / Likes */}
        <div className="flex items-center justify-center gap-6 mt-3.5 py-2 px-6 rounded-2xl bg-neutral-900/60 border border-white/5">
          <div className="text-center">
            <span className="text-sm font-bold text-white block">
              {targetUser.followingCount ?? followingUserIds.length}
            </span>
            <span className="text-[10px] text-neutral-400">Seguiti</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <span className="text-sm font-bold text-white block">
              {targetUser.followersCount ?? 128}
            </span>
            <span className="text-[10px] text-neutral-400">Follower</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <span className="text-sm font-bold text-white block">
              {targetUser.likesCount ?? 840}
            </span>
            <span className="text-[10px] text-neutral-400">Mi Piace</span>
          </div>
        </div>

        {/* Bio Snippet */}
        {targetUser.bio && (
          <p className="text-xs text-neutral-200 mt-3 max-w-sm leading-relaxed px-2">
            {targetUser.bio}
          </p>
        )}

        {/* Interest tags */}
        {targetUser.interests && targetUser.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-center mt-2.5">
            {targetUser.interests.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold bg-neutral-900 text-neutral-300 border border-white/10 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="flex items-center gap-2 mt-4 w-full max-w-xs justify-center">
          {isOwnProfile ? (
            <>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold rounded-xl border border-white/15 flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-sm cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Modifica Profilo</span>
              </button>

              <button
                onClick={handleShareProfile}
                className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold rounded-xl border border-white/15 flex items-center justify-center transition-colors active:scale-95 shadow-sm cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => toggleFollowUser(targetUser.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm cursor-pointer ${
                  isFollowing
                    ? 'bg-neutral-900 text-neutral-300 border border-white/15'
                    : 'bg-[#E11D48] text-white hover:bg-[#BE123C] shadow-[#E11D48]/30'
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Seguito</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Segui</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  startConversation(
                    targetUser.id,
                    targetUser.name,
                    `Ciao ${targetUser.name}, ho visto il tuo profilo su AMICA!`
                  );
                  setMobileTab('inbox');
                }}
                className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-semibold rounded-xl border border-white/15 flex items-center justify-center gap-1.5 transition-colors active:scale-95 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Messaggio</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* 3 Grid Tabs: Works / Bookmarks / Likes */}
      <div className="mt-4 border-t border-white/10">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('works')}
            className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
              activeTab === 'works'
                ? 'text-[#E11D48] border-b-2 border-[#E11D48] font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
            <span>Opere ({userWorks.length})</span>
          </button>

          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                activeTab === 'saved'
                  ? 'text-[#E11D48] border-b-2 border-[#E11D48] font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Salvati ({savedItems.length})</span>
            </button>
          )}

          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 py-3 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                activeTab === 'liked'
                  ? 'text-[#E11D48] border-b-2 border-[#E11D48] font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Mi Piace ({likedItems.length})</span>
            </button>
          )}
        </div>

        {/* 3-Column Media Grid */}
        <div className="p-1">
          {activeTab === 'works' && (
            userWorks.length === 0 ? (
              <div className="py-16 text-center text-neutral-400">
                <Grid3X3 className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#E11D48]" />
                <p className="text-xs font-medium">Nessun annuncio pubblicato finora.</p>
                {isOwnProfile && (
                  <button
                    onClick={() => setMobileTab('create')}
                    className="mt-3 px-4 py-1.5 bg-[#E11D48] text-white text-xs font-semibold rounded-full shadow-md"
                  >
                    Pubblica Nuovo Annuncio
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {userWorks.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenListingModal && onOpenListingModal(item)}
                    className="aspect-3/4 bg-neutral-900 rounded-sm overflow-hidden relative group cursor-pointer"
                  >
                    <img
                      src={item.images[0] || '/src/assets/images/category_incontri_evening_1792082231469.jpg'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-1 left-1">
                      {item.status === 'active' ? (
                        <span className="bg-emerald-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Attivo</span>
                        </span>
                      ) : (
                        <span className="bg-amber-500/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          <span>Revisione</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5 justify-between">
                      <span className="text-[10px] text-white font-mono flex items-center gap-1">
                        <Eye className="w-3 h-3 text-neutral-300" />
                        <span>{item.viewsCount}</span>
                      </span>

                      {isOwnProfile && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenListingModal && onOpenListingModal(item);
                            }}
                            className="p-1 rounded-full bg-black/60 text-neutral-300 hover:text-white"
                            title="Modifica posizione annuncio"
                          >
                            <MapPin className="w-3 h-3 text-[#E11D48]" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteListing(item.id);
                            }}
                            className="p-1 rounded-full bg-black/60 text-neutral-300 hover:text-rose-400"
                            title="Elimina annuncio"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'saved' && (
            savedItems.length === 0 ? (
              <div className="py-16 text-center text-neutral-400">
                <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#E11D48]" />
                <p className="text-xs font-medium">Nessun annuncio salvato nei preferiti.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {savedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenListingModal && onOpenListingModal(item)}
                    className="aspect-3/4 bg-neutral-900 rounded-sm overflow-hidden relative group cursor-pointer"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5 justify-between">
                      <span className="text-[10px] text-white truncate max-w-[70%]">
                        {item.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="p-1 rounded-full bg-black/60 text-[#E11D48]"
                      >
                        <Bookmark className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'liked' && (
            likedItems.length === 0 ? (
              <div className="py-16 text-center text-neutral-400">
                <Heart className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#E11D48]" />
                <p className="text-xs font-medium">Nessun annuncio a cui hai messo Mi Piace.</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {likedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onOpenListingModal && onOpenListingModal(item)}
                    className="aspect-3/4 bg-neutral-900 rounded-sm overflow-hidden relative group cursor-pointer"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-1.5 justify-between">
                      <span className="text-[10px] text-white truncate max-w-[70%]">
                        {item.title}
                      </span>
                      <Heart className="w-3 h-3 text-rose-500 fill-current" />
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-neutral-900 border border-white/15 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Modifica Profilo AMICA</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">Nome visualizzato</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-neutral-950 text-xs text-white p-2 rounded-xl border border-white/15 focus:outline-hidden focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">Città principale</label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full bg-neutral-950 text-xs text-white p-2 rounded-xl border border-white/15 focus:outline-hidden focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">Età</label>
                <input
                  type="number"
                  min={18}
                  max={75}
                  value={editAge}
                  onChange={(e) => setEditAge(Number(e.target.value))}
                  className="w-full bg-neutral-950 text-xs text-white p-2 rounded-xl border border-white/15 focus:outline-hidden focus:border-[#E11D48]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">Biografia personale</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-neutral-950 text-xs text-white p-2 rounded-xl border border-white/15 focus:outline-hidden focus:border-[#E11D48] resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-[#E11D48] text-white rounded-lg hover:bg-[#BE123C]"
                >
                  Salva Modifiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Account Settings Drawer */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center">
          <div className="w-full max-w-md bg-neutral-900 border-t border-white/15 rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#E11D48]" />
                <h3 className="text-sm font-bold text-white">Impostazioni & Privacy</h3>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Privacy Section */}
            <div className="space-y-2 text-left">
              <h4 className="text-xs font-bold text-neutral-300">Visibilità Profilo AMICA</h4>
              <div className="p-3 bg-neutral-950 rounded-xl border border-white/10 space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Chi può vedere il mio profilo:</span>
                  <select
                    value={profileVisibility}
                    onChange={(e) => setProfileVisibility(e.target.value as any)}
                    className="bg-neutral-900 text-white rounded-lg px-2 py-1 text-xs border border-white/15"
                  >
                    <option value="public">Tutti gli utenti (Pubblico)</option>
                    <option value="verified_only">Solo utenti verificati 18+</option>
                    <option value="followers_only">Solo follower approvati</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Blocked users list */}
            <div className="space-y-2 text-left">
              <h4 className="text-xs font-bold text-neutral-300">Utenti Bloccati ({blockedUserIds.length})</h4>
              {blockedUserIds.length === 0 ? (
                <p className="text-xs text-neutral-500">Nessun utente bloccato al momento.</p>
              ) : (
                <div className="space-y-1.5">
                  {blockedUserIds.map((id) => (
                    <div key={id} className="flex items-center justify-between p-2 rounded-lg bg-neutral-950 border border-white/10 text-xs">
                      <span>ID: {id}</span>
                      <button
                        onClick={() => toggleBlockUser(id)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Sblocca
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legal and Data Export */}
            <div className="space-y-2 text-left pt-2 border-t border-white/10">
              <h4 className="text-xs font-bold text-neutral-300">Gestione Dati Personali (GDPR)</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                I tuoi dati personali sono protetti secondo la normativa GDPR italiana. Puoi esportare in qualsiasi momento una copia completa di tutti i tuoi contenuti, chat e profilo.
              </p>
              <button
                onClick={handleExportData}
                className="w-full py-2.5 bg-neutral-950 border border-white/15 hover:border-[#E11D48] rounded-xl text-xs text-neutral-200 hover:text-white flex items-center justify-center gap-1.5 font-semibold cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#00F2FE]" />
                <span>Esporta i Miei Dati (JSON)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Toast Messages */}
      {copiedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#E11D48] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-in fade-in flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-white" />
          <span>Link profilo copiato negli appunti!</span>
        </div>
      )}

      {exportSuccessToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-in fade-in flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>Dati personali esportati con successo!</span>
        </div>
      )}

    </div>
  );
};
