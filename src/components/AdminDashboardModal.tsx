import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Check,
  Trash2,
  Calendar,
  AlertTriangle,
  Megaphone,
  BarChart3,
} from 'lucide-react';

interface AdminDashboardModalProps {
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ onClose }) => {
  const {
    listings,
    updateListing,
    deleteListing,
    reports,
    resolveReport,
    bookingRequests,
    updateBookingStatus,
    campaigns,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'reports' | 'bookings' | 'ads'>('listings');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white border border-[#E5E7E1] rounded-3xl shadow-xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8F8F5] border-b border-[#E5E7E1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#E8EFEA] rounded-xl text-[#193C32]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202522] flex items-center gap-2">
                <span>Pannello di Moderazione & Gestione AMICA</span>
                <span className="text-[10px] font-mono text-[#193C32] bg-[#E8EFEA] px-2 py-0.5 rounded font-bold">
                  {currentUser.role.toUpperCase()}
                </span>
              </h2>
              <div className="text-xs text-[#777B76]">
                Conformità legale, controllo contenuti, prenotazioni SPA e metriche pubblicitarie
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

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-white border-b border-[#E5E7E1] flex gap-2 overflow-x-auto text-xs">
          {[
            { id: 'listings', label: 'Gestione Annunci', count: listings.length, icon: ShieldCheck },
            { id: 'reports', label: 'Segnalazioni', count: reports.filter((r) => r.status === 'pending').length, icon: AlertTriangle },
            { id: 'bookings', label: 'Appuntamenti SPA', count: bookingRequests.length, icon: Calendar },
            { id: 'ads', label: 'Campagne Adv', count: campaigns.length, icon: Megaphone },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3.5 font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-[#193C32] text-[#193C32]'
                    : 'border-transparent text-[#777B76] hover:text-[#202522]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-[#E8EFEA] text-[#193C32]' : 'bg-[#F8F8F5] text-[#777B76]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 flex-1 overflow-y-auto text-xs bg-[#F8F8F5]">
          
          {/* TAB 1: LISTINGS */}
          {activeTab === 'listings' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[#777B76] pb-2 border-b border-[#E5E7E1]">
                <span>Elenco annunci pubblicati:</span>
                <span>Totale: {listings.length}</span>
              </div>

              {listings.map((l) => (
                <div
                  key={l.id}
                  className="p-4 rounded-2xl bg-white border border-[#E5E7E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex gap-3 items-start">
                    {l.images && l.images[0] && (
                      <img
                        src={l.images[0]}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E5E7E1]"
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#202522] text-sm">{l.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          l.status === 'active' ? 'bg-[#E8EFEA] text-[#193C32] font-semibold' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {l.status}
                        </span>
                      </div>
                      <div className="text-[#777B76] text-[11px] mt-0.5">
                        {l.cityId.toUpperCase()} · {l.district} · Categoria: {l.categoryId} · Autore: {l.authorName}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {l.status !== 'active' ? (
                      <button
                        onClick={() => updateListing(l.id, { status: 'active' })}
                        className="px-3 py-1.5 bg-[#193C32] hover:bg-[#244D40] text-white rounded-lg font-semibold flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Approva
                      </button>
                    ) : (
                      <button
                        onClick={() => updateListing(l.id, { status: 'paused' })}
                        className="px-3 py-1.5 bg-white hover:bg-[#F8F8F5] text-[#777B76] border border-[#E5E7E1] rounded-lg"
                      >
                        Sospendi
                      </button>
                    )}

                    <button
                      onClick={() => deleteListing(l.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200"
                      title="Elimina"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              <div className="text-[#777B76] pb-2 border-b border-[#E5E7E1]">
                Segnalazioni ricevute dalla community:
              </div>

              {reports.length === 0 ? (
                <div className="text-center py-12 text-[#777B76]">
                  Nessuna segnalazione in sospeso.
                </div>
              ) : (
                reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 rounded-2xl bg-white border border-[#E5E7E1] space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-700 uppercase tracking-wider text-[11px]">
                          Motivo: {r.reason}
                        </span>
                        <span className="text-[#E5E7E1]">·</span>
                        <span className="text-[#202522] font-semibold">{r.targetTitle}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        r.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-[#F8F8F5] text-[#777B76]'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    <p className="text-[#202522] text-xs bg-[#F8F8F5] p-3 rounded-xl border border-[#E5E7E1]">
                      "{r.comment || 'Nessun commento aggiuntivo.'}"
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-[#777B76]">
                      <span>{new Date(r.reportedAt).toLocaleString('it-IT')}</span>
                      {r.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => resolveReport(r.id, 'dismissed')}
                            className="px-3 py-1 bg-white hover:bg-[#F8F8F5] text-[#777B76] border border-[#E5E7E1] rounded-lg"
                          >
                            Archivia
                          </button>
                          <button
                            onClick={() => {
                              resolveReport(r.id, 'resolved');
                              deleteListing(r.targetId);
                            }}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
                          >
                            Rimuovi Annuncio
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-3">
              <div className="text-[#777B76] pb-2 border-b border-[#E5E7E1]">
                Richieste di prenotazione massaggi:
              </div>

              {bookingRequests.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-white border border-[#E5E7E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#202522] text-sm">{b.businessName}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        b.status === 'confirmed'
                          ? 'bg-[#E8EFEA] text-[#193C32] font-semibold'
                          : b.status === 'rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}>
                        {b.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="text-[#193C32] font-semibold text-xs mt-0.5">
                      {b.serviceName} · €{b.priceEur}
                    </div>

                    <div className="text-[#777B76] text-[11px] mt-1">
                      Data: <strong className="text-[#202522]">{b.date}</strong> ore <strong className="text-[#202522]">{b.timeSlot}</strong>
                    </div>

                    <div className="text-[#777B76] text-[11px] mt-0.5">
                      Cliente: {b.customerName} ({b.customerPhone})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {b.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'confirmed')}
                          className="px-3 py-1.5 bg-[#193C32] hover:bg-[#244D40] text-white rounded-lg font-semibold shadow-xs"
                        >
                          Conferma
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, 'rejected')}
                          className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-[#E5E7E1] rounded-lg"
                        >
                          Rifiuta
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: ADS */}
          {activeTab === 'ads' && (
            <div className="space-y-4">
              <div className="text-[#777B76] pb-2 border-b border-[#E5E7E1]">
                Cruscotto campagne pubblicitarie:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-[#E5E7E1] shadow-xs">
                  <div className="flex items-center justify-between text-[#777B76]">
                    <span>Impressioni</span>
                    <BarChart3 className="w-4 h-4 text-[#193C32]" />
                  </div>
                  <div className="text-2xl font-bold text-[#202522] font-mono mt-1.5">
                    {campaigns.reduce((a, c) => a + c.impressions, 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7E1] shadow-xs">
                  <div className="flex items-center justify-between text-[#777B76]">
                    <span>Click</span>
                    <Megaphone className="w-4 h-4 text-[#193C32]" />
                  </div>
                  <div className="text-2xl font-bold text-[#202522] font-mono mt-1.5">
                    {campaigns.reduce((a, c) => a + c.clicks, 0).toLocaleString()}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#E5E7E1] shadow-xs">
                  <div className="flex items-center justify-between text-[#777B76]">
                    <span>Budget Gestito</span>
                    <span className="text-[#193C32] font-bold font-mono">€</span>
                  </div>
                  <div className="text-2xl font-bold text-[#202522] font-mono mt-1.5">
                    €{campaigns.reduce((a, c) => a + c.budgetEur, 0)}
                  </div>
                </div>
              </div>

              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-4 rounded-2xl bg-white border border-[#E5E7E1] flex items-center justify-between shadow-xs"
                >
                  <div>
                    <div className="font-bold text-[#202522] text-sm">{camp.title}</div>
                    <div className="text-[#777B76] text-[11px] mt-0.5">
                      Città: {camp.cityId.toUpperCase()} · Posizione: {camp.type}
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <div className="text-[#193C32] font-mono font-bold">
                      {camp.clicks} click / {camp.impressions} impr.
                    </div>
                    <div className="text-[#777B76] text-[11px] font-mono">Budget: €{camp.budgetEur}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
