import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Business, BusinessService } from '../types';
import {
  X,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  MapPin,
  Phone,
  Euro,
  User as UserIcon,
  Mail,
  FileText,
} from 'lucide-react';

interface SpaBookingModalProps {
  business: Business;
  onClose: () => void;
}

export const SpaBookingModal: React.FC<SpaBookingModalProps> = ({ business, onClose }) => {
  const { currentUser, addBookingRequest } = useApp();

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    business.services?.[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('15:00');
  const [customerName, setCustomerName] = useState<string>(currentUser.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser.phone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser.email || '');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedService: BusinessService | undefined = business.services?.find(
    (s) => s.id === selectedServiceId
  ) || business.services?.[0];

  const timeSlots = [
    '10:00',
    '11:00',
    '12:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedService) {
      setErrorMessage('Seleziona un trattamento o servizio.');
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Inserisci il tuo nome completo.');
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMessage('Inserisci un numero di telefono o WhatsApp valido.');
      return;
    }
    if (!selectedDate) {
      setErrorMessage('Seleziona la data desiderata.');
      return;
    }

    addBookingRequest({
      businessId: business.id,
      businessName: business.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      priceEur: selectedService.priceEur,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      date: selectedDate,
      timeSlot: selectedTime,
      notes: notes.trim() || undefined,
    });

    setIsSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spa-booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-black border-b border-neutral-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="spa-booking-title" className="text-lg font-semibold">
                Prenota Appuntamento Benessere
              </h2>
              <p className="text-xs text-emerald-200/80 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
                {business.name} • {business.district}
              </p>
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

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              Richiesta Inviata con Successo!
            </h3>
            <p className="text-sm text-stone-600 max-w-md mx-auto">
              La tua richiesta per <strong className="text-stone-900">{selectedService?.name}</strong> è
              stata registrata per il giorno <strong className="text-stone-900">{selectedDate}</strong> alle{' '}
              <strong className="text-stone-900">{selectedTime}</strong>. Il centro benessere{' '}
              {business.name} ti confermerà l'orario via telefono o messaggio.
            </p>
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#193C32] text-white rounded-xl font-medium hover:bg-[#122e26] transition-colors"
              >
                Torna al Centro Benessere
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Service Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                1. Scegli il Trattamento
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {business.services && business.services.length > 0 ? (
                  business.services.map((srv) => (
                    <label
                      key={srv.id}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedServiceId === srv.id
                          ? 'border-[#193C32] bg-emerald-50/50 shadow-xs ring-1 ring-[#193C32]'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="service"
                          value={srv.id}
                          checked={selectedServiceId === srv.id}
                          onChange={() => setSelectedServiceId(srv.id)}
                          className="w-4 h-4 text-[#193C32] focus:ring-[#193C32]"
                        />
                        <div>
                          <div className="text-sm font-semibold text-stone-900">{srv.name}</div>
                          {srv.description && (
                            <div className="text-xs text-stone-500 line-clamp-1">
                              {srv.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-[#193C32]">€{srv.priceEur}</div>
                        <div className="text-xs text-stone-400 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          {srv.durationMin} min
                        </div>
                      </div>
                    </label>
                  ))
                ) : (
                  <div className="text-xs text-stone-500 italic p-3 border rounded-xl">
                    Trattamento benessere personalizzato (1 ora) – €60
                  </div>
                )}
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#193C32]" />
                  2. Data Desiderata
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#193C32]" />
                  Orario Preferito
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32] bg-white"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                3. I Tuoi Recapiti
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Nome e Cognome *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="Cellulare / WhatsApp *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="Email (opzionale per conferma)"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <FileText className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    placeholder="Note particolari, richieste di oli o orario flessibile..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#193C32]"
                  />
                </div>
              </div>
            </div>

            {/* Summary & Submit */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 block">Totale stimato</span>
                <span className="text-lg font-bold text-stone-900">
                  €{selectedService?.priceEur || 60}
                </span>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold bg-[#CC09E6] hover:bg-[#B008C5] text-white rounded-xl transition-colors shadow-md"
                >
                  Invia Prenotazione
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
