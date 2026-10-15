import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdCampaign } from '../types';
import { generateAdCampaignHeadline } from '../utils/aiStudio';
import {
  X,
  Megaphone,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  MousePointerClick,
  Eye,
  PlusCircle,
  Play,
  Pause,
} from 'lucide-react';

interface AdvertiserCampaignModalProps {
  onClose: () => void;
}

export const AdvertiserCampaignModal: React.FC<AdvertiserCampaignModalProps> = ({ onClose }) => {
  const {
    campaigns,
    cities,
    categories,
    selectedCity,
    currentUser,
  } = useApp();

  const [activeView, setActiveView] = useState<'overview' | 'create'>('overview');

  // Form State for new campaign
  const [title, setTitle] = useState('');
  const [placementType, setPlacementType] = useState<'vetrina_home' | 'top_city' | 'category_spotlight'>('top_city');
  const [targetCityId, setTargetCityId] = useState(selectedCity.id);
  const [targetCategory, setTargetCategory] = useState('escort');
  const [budgetEur, setBudgetEur] = useState(120);
  const [linkUrl, setLinkUrl] = useState('/it/bologna/escort');
  const [isCreatedSuccess, setIsCreatedSuccess] = useState(false);

  const targetCityObj = cities.find((c) => c.id === targetCityId) || cities[0];

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || generateAdCampaignHeadline(placementType, targetCityObj.name);

    const newCamp: AdCampaign = {
      id: `camp_${Date.now()}`,
      title: finalTitle,
      type: placementType,
      cityId: targetCityId,
      targetCategory,
      impressions: 12,
      clicks: 1,
      budgetEur,
      active: true,
      linkUrl: linkUrl || `/it/${targetCityObj.slug}`,
    };

    campaigns.unshift(newCamp);
    setIsCreatedSuccess(true);
    setTimeout(() => {
      setIsCreatedSuccess(false);
      setActiveView('overview');
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white border border-[#E5E7E1] rounded-3xl shadow-xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8F8F5] border-b border-[#E5E7E1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#E8EFEA] rounded-xl text-[#193C32]">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202522] flex items-center gap-2">
                <span>Centro Inserzionisti & Campagne Sponsorizzate</span>
                <span className="text-[10px] font-mono bg-[#E8EFEA] text-[#193C32] px-2 py-0.5 rounded font-bold border border-[#193C32]/20">
                  AMICA ADS
                </span>
              </h2>
              <div className="text-xs text-[#777B76]">
                Pianifica la visibilità del tuo profilo o centro benessere con conversioni trasparenti
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777B76] hover:text-[#202522] hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher */}
        <div className="px-6 pt-3 bg-white border-b border-[#E5E7E1] flex items-center justify-between text-xs">
          <div className="flex gap-4 font-semibold">
            <button
              onClick={() => setActiveView('overview')}
              className={`pb-2.5 border-b-2 transition-colors ${
                activeView === 'overview' ? 'border-[#193C32] text-[#193C32]' : 'border-transparent text-[#777B76]'
              }`}
            >
              Le Tue Campagne ({campaigns.length})
            </button>
            <button
              onClick={() => setActiveView('create')}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeView === 'create' ? 'border-[#193C32] text-[#193C32]' : 'border-transparent text-[#777B76]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Nuova Campagna</span>
            </button>
          </div>

          <div className="text-[#777B76] text-[11px]">
            Inserzionista: <strong className="text-[#202522]">{currentUser.name}</strong>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto text-xs bg-[#F8F8F5]">
          
          {/* VIEW: OVERVIEW */}
          {activeView === 'overview' && (
            <div className="space-y-6">
              
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7E1] shadow-xs">
                  <div className="flex items-center justify-between text-[#777B76]">
                    <span>Impressioni Totali</span>
                    <Eye className="w-4 h-4 text-[#193C32]" />
                  </div>
                  <div className="text-2xl font-bold text-[#202522] font-mono mt-1.5">
                    {campaigns.reduce((a, c) => a + c.impressions, 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7E1] shadow-xs">
                  <div className="flex items-center justify-between text-[#777B76]">
                    <span>Click Ricevuti</span>
                    <MousePointerClick className="w-4 h-4 text-[#193C32]" />
                  </div>
                  <div className="text-2xl font-bold text-[#202522] font-mono mt-1.5">
                    {campaigns.reduce((a, c) => a + c.clicks, 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7E1] shadow-xs">
                  <div className="flex items-center justify-between text-[#777B76]">
                    <span>CTR Medio</span>
                    <TrendingUp className="w-4 h-4 text-[#193C32]" />
                  </div>
                  <div className="text-2xl font-bold text-[#202522] font-mono mt-1.5">
                    7.4%
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7E1] shadow-xs">
                  <div className="flex items-center justify-between text-[#777B76]">
                    <span>Budget Investito</span>
                    <span className="text-[#193C32] font-bold font-mono">€</span>
                  </div>
                  <div className="text-2xl font-bold text-[#202522] font-mono mt-1.5">
                    €{campaigns.reduce((a, c) => a + c.budgetEur, 0)}
                  </div>
                </div>
              </div>

              {/* Active Campaigns List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[#777B76] pb-2 border-b border-[#E5E7E1]">
                  <span className="font-semibold text-[#202522]">Spazi Pubblicitari Attivi:</span>
                  <button
                    onClick={() => setActiveView('create')}
                    className="text-[#193C32] hover:underline font-semibold flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Nuova Campagna
                  </button>
                </div>

                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 rounded-2xl bg-white border border-[#E5E7E1] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#202522] text-sm">{camp.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          camp.active ? 'bg-[#E8EFEA] text-[#193C32] font-bold' : 'bg-[#F8F8F5] text-[#777B76]'
                        }`}>
                          {camp.active ? 'ATTIVA' : 'IN PAUSA'}
                        </span>
                      </div>

                      <div className="text-[#777B76] text-[11px] mt-1">
                        Città: <strong className="text-[#202522]">{camp.cityId.toUpperCase()}</strong> · Posizione: <strong className="text-[#193C32]">{camp.type.replace('_', ' ').toUpperCase()}</strong>
                      </div>

                      <div className="flex items-center gap-3 text-[#777B76] text-[11px] mt-1.5 font-mono">
                        <span>{camp.impressions} visualizzazioni</span>
                        <span>·</span>
                        <span className="text-[#193C32] font-semibold">{camp.clicks} click</span>
                        <span>·</span>
                        <span>Budget: €{camp.budgetEur}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          camp.active = !camp.active;
                          setActiveView('overview');
                        }}
                        className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                          camp.active
                            ? 'bg-[#F8F8F5] hover:bg-[#E8EFEA] text-[#777B76] border border-[#E5E7E1]'
                            : 'bg-[#193C32] hover:bg-[#244D40] text-white font-bold'
                        }`}
                      >
                        {camp.active ? (
                          <>
                            <Pause className="w-3.5 h-3.5" /> Sospendi
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" /> Riattiva
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* VIEW: CREATE NEW CAMPAIGN */}
          {activeView === 'create' && (
            <div>
              {isCreatedSuccess ? (
                <div className="p-12 text-center space-y-3 bg-white border border-[#E5E7E1] rounded-2xl">
                  <div className="w-14 h-14 rounded-full bg-[#E8EFEA] text-[#193C32] flex items-center justify-center mx-auto border border-[#193C32]/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-[#202522]">Campagna Creata ed Attivata!</h3>
                  <p className="text-xs text-[#777B76] max-w-md mx-auto">
                    La tua sponsorizzazione è ora attiva su AMICA ed è visibile in evidenza a {targetCityObj.name}.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCreateCampaign} className="space-y-5 max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-[#E5E7E1]">
                  
                  {/* Step 1: Placement type */}
                  <div>
                    <label className="block font-semibold text-[#202522] mb-2">
                      1. Seleziona lo Spazio Pubblicitario:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'top_city',
                          title: 'Top di Città',
                          desc: 'In cima alla bacheca cittadina e marker prioritario su mappa.',
                          price: '€40 / mese',
                        },
                        {
                          id: 'vetrina_home',
                          title: 'Vetrina Homepage',
                          desc: 'In primo piano nella sezione vetrina nazionale.',
                          price: '€120 / mese',
                        },
                        {
                          id: 'category_spotlight',
                          title: 'Spotlight Categoria',
                          desc: 'Primo risultato evidenziato nella categoria scelta.',
                          price: '€80 / mese',
                        },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setPlacementType(item.id as any)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            placementType === item.id
                              ? 'bg-[#E8EFEA] border-[#193C32] text-[#202522] ring-2 ring-[#193C32]/10'
                              : 'bg-white border-[#E5E7E1] text-[#777B76] hover:border-[#193C32]/30'
                          }`}
                        >
                          <div className="font-bold text-xs">{item.title}</div>
                          <div className="text-[11px] text-[#193C32] font-mono font-bold mt-0.5">{item.price}</div>
                          <p className="text-[11px] text-[#777B76] mt-1 leading-normal font-normal">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Target City & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#202522] mb-1">
                        Città Target *
                      </label>
                      <select
                        value={targetCityId}
                        onChange={(e) => setTargetCityId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                      >
                        {cities.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.region})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#202522] mb-1">
                        Categoria Target *
                      </label>
                      <select
                        value={targetCategory}
                        onChange={(e) => setTargetCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Step 3: Title and link */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-semibold text-[#202522]">
                          Testo Promozionale
                        </label>
                        <button
                          type="button"
                          onClick={() => setTitle(generateAdCampaignHeadline(placementType, targetCityObj.name))}
                          className="text-[#193C32] hover:underline text-[11px] flex items-center gap-1 font-semibold"
                        >
                          <Sparkles className="w-3 h-3" /> Genera con AI
                        </button>
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={generateAdCampaignHeadline(placementType, targetCityObj.name)}
                        className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] focus:outline-none focus:border-[#193C32]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-[#202522] mb-1">
                        Link Destinazione
                      </label>
                      <input
                        type="text"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder={`/it/${targetCityObj.slug}/${targetCategory}`}
                        className="w-full px-3 py-2 bg-white border border-[#E5E7E1] rounded-xl text-[#202522] font-mono text-xs focus:outline-none focus:border-[#193C32]"
                      />
                    </div>
                  </div>

                  {/* Step 4: Budget */}
                  <div>
                    <label className="block font-semibold text-[#202522] mb-1.5">
                      Budget Stanziato:
                    </label>
                    <div className="flex items-center gap-3">
                      {[50, 100, 200, 500].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBudgetEur(b)}
                          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors ${
                            budgetEur === b
                              ? 'bg-[#193C32] text-white font-black'
                              : 'bg-white border border-[#E5E7E1] text-[#777B76] hover:text-[#202522]'
                          }`}
                        >
                          €{b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-4 border-t border-[#E5E7E1] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveView('overview')}
                      className="px-4 py-2 bg-white hover:bg-[#F8F8F5] text-[#777B76] border border-[#E5E7E1] rounded-xl"
                    >
                      Annulla
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#193C32] hover:bg-[#244D40] text-white font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Attiva Campagna</span>
                    </button>
                  </div>

                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
