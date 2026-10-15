import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Role, SeekingCategory } from '../types';
import {
  X,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Heart,
  Save,
  Users,
} from 'lucide-react';

interface UserAuthModalProps {
  onClose: () => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({ onClose }) => {
  const { currentUser, setCurrentUser, allUsers } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'switch_role'>('profile');

  // Form fields for active user profile editing
  const [name, setName] = useState<string>(currentUser.name || '');
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [phone, setPhone] = useState<string>(currentUser.phone || '');
  const [city, setCity] = useState<string>(currentUser.city || '');
  const [bio, setBio] = useState<string>(currentUser.bio || '');
  const [age, setAge] = useState<number>(currentUser.age || 26);
  const [seekingCategory, setSeekingCategory] = useState<SeekingCategory>(
    currentUser.seekingCategory || 'all'
  );
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: User = {
      ...currentUser,
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      phone: phone.trim() || currentUser.phone,
      city: city.trim() || currentUser.city,
      bio: bio.trim(),
      age: Number(age) || currentUser.age,
      seekingCategory,
    };

    setCurrentUser(updatedUser);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSelectDemoUser = (user: User) => {
    setCurrentUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setCity(user.city || '');
    setBio(user.bio || '');
    setAge(user.age || 26);
    setSeekingCategory(user.seekingCategory || 'all');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">Admin / Moderatore</span>;
      case 'business_owner':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Titolare Centro SPA</span>;
      case 'advertiser':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">Inserzionista Verificato</span>;
      case 'user':
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Utente Community</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">Visitatore</span>;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-auth-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-black border-b border-neutral-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <UserIcon className="w-5 h-5 text-[#E11D48]" />
            </div>
            <div>
              <h2 id="user-auth-title" className="text-lg font-semibold text-white">
                Profilo & Account
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-neutral-300">{currentUser.name}</span>
                {currentUser.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#E11D48] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> 18+ Verificato
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-colors ${
              activeTab === 'profile'
                ? 'border-b-2 border-[#E11D48] text-[#E11D48] bg-white'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Modifica Profilo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('switch_role')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'switch_role'
                ? 'border-b-2 border-[#E11D48] text-[#E11D48] bg-white'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Cambia Utente
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {savedSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Profilo aggiornato con successo!
            </div>
          )}

          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-200 border-2 border-[#193C32]/20 flex items-center justify-center shrink-0">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-6 h-6 text-stone-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-stone-900 truncate">
                      {currentUser.name}
                    </span>
                    {getRoleBadge(currentUser.role)}
                  </div>
                  <p className="text-xs text-stone-500 truncate mt-0.5">{currentUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email di Contatto
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Cellulare / WA
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Città / Comune
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Età (18+)
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Cosa Cerchi (Incontri / Dating)
                </label>
                <select
                  value={seekingCategory}
                  onChange={(e) => setSeekingCategory(e.target.value as SeekingCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32] bg-white"
                >
                  <option value="all">Tutte le connessioni & servizi</option>
                  <option value="donna_cerca_uomo">Donna cerca Uomo</option>
                  <option value="uomo_cerca_donna">Uomo cerca Donna</option>
                  <option value="uomo_cerca_uomo">Uomo cerca Uomo</option>
                  <option value="donna_cerca_donna">Donna cerca Donna</option>
                  <option value="coppie">Coppie & Incontri a Tre</option>
                  <option value="amicizia">Nuove Amicizie & Compagnia</option>
                  <option value="anima_gemella">Relazione Stabile & Anima Gemella</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Biografia Breve
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Scrivi due righe su di te, interessi o preferenze..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  Chiudi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-[#E11D48] text-white rounded-xl hover:bg-[#BE123C] transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Salva Modifiche
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-stone-500">
                Seleziona uno dei profili preconfigurati per esplorare la piattaforma con ruoli e permessi differenti:
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(allUsers || []).map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectDemoUser(u)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-[#193C32] bg-emerald-50/60 ring-1 ring-[#193C32]'
                          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 shrink-0">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-stone-500 m-2.5" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                            {u.name}
                            {isCurrent && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md font-medium">
                                Attivo
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-stone-500">{u.email}</div>
                        </div>
                      </div>
                      <div>{getRoleBadge(u.role)}</div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                >
                  Chiudi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
