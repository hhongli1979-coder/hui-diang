# Amico | EuroVicino – Piattaforma Annunci Locali, Incontri e Servizi Benessere (Italia)

Amico EuroVicino è una piattaforma web moderna, reattiva e geolocalizzata per la pubblicazione e consultazione di annunci locali, incontri per adulti verificati (18+) e centri massaggi & SPA in Italia.

## 1. Caratteristiche Principali del Sistema

- **Design Moderno & Mobile-First**: Sviluppato nel pieno rispetto del contratto di navigazione a 3 zone, senza elementi grafici ingombranti o clonato da vecchie bacheche.
- **Geolocalizzazione GPS & Calcolo Distanza Reale**: Formula di Haversine sia lato client che server per calcolare la distanza chilometrica reale tra l'utente e l'inserzionista. Raggi di ricerca selezionabili: `1 km`, `5 km`, `10 km`, `25 km`, `50 km`.
- **Mappa Interattiva & Navigazione**: Vista mappa con marker dinamici, radar circolare della zona, anteprima istantanea e collegamento diretto alle indicazioni stradali su Google Maps.
- **Bacheca Annunci con Categorie Dedicate**:
  - `Escort` (Accompagnatrici indipendenti, incall / outcall)
  - `Trans` (Incontri transessuali e travestiti)
  - `Uomo Cerca Uomo` (Incontri gay e bisex)
  - `Incontri` (Donna cerca uomo, uomo cerca donna, coppie)
  - `Massaggi & Benessere` (Centri estetici, SPA, massaggi relax, olistici e decontratturanti)
- **Modulo Prenotazione Appuntamenti Benessere**: Schede per centri massaggi con listino prezzi, durata e invio richiesta appuntamento con selezione data e orario.
- **Messaggistica Privata**: Chat interna crittografata tra utenti e inserzionisti con gestione delle conversazioni e badge messaggi non letti.
- **Pannello di Moderazione & Segnalazioni**: Revisione annunci, gestione segnalazioni abusi (spam, fake, violazioni minori), gestione prenotazioni e monitoraggio campagne sponsorizzate.
- **Conformità Legale & GDPR (18+)**: Gateway di verifica maggiore età obbligatorio in ingresso conforme alla normativa italiana (D.Lgs. 70/2003 e GDPR UE 2016/679).
- **Assistente AI Intelligente**: Chatbot di supporto per rispondere alle domande su sicurezza, raggio GPS, pubblicazione annunci e regole della bacheca.

## 2. Struttura del Progetto

```
/
├── index.html                    # Entry point con SEO tags e Schema.org JSON-LD
├── metadata.json                 # Metadati di applicazione Google AI Studio
├── package.json                  # Dipendenze e script Vite / Tailwind
├── src/
│   ├── App.tsx                   # Applicazione principale con wiring modali e layout
│   ├── main.tsx                  # Bootstrap React 19
│   ├── index.css                 # Importazione Tailwind CSS 4 e scrollbar scura
│   ├── types/
│   │   └── index.ts              # Modelli di dati (Listing, Business, Booking, Conversation, User)
│   ├── utils/
│   │   └── geo.ts                # Calcolo distanze Haversine e link Google Maps
│   ├── data/
│   │   └── initialData.ts        # Dati realistici per Bologna, Milano, Roma, Firenze, ecc.
│   ├── context/
│   │   └── AppContext.tsx        # Store globale con sincronizzazione localStorage
│   └── components/
│       ├── Header.tsx            # Navigazione principale (Top Bar Contract 3-zone)
│       ├── HeroSection.tsx       # Skyline panoramico, ricerca rapida e raggio GPS
│       ├── MainFeed.tsx          # Elenco annunci, filtri, griglia, mappa e split view
│       ├── ListingCard.tsx       # Card annuncio senza pillole con metadati separati
│       ├── ListingDetailModal.tsx # Scheda dettagli annuncio con contatti e segnalazione
│       ├── InteractiveMap.tsx    # Mappa vettoriale con marker e raggio radar
│       ├── BusinessSection.tsx   # Vetrina centri massaggi e SPA
│       ├── BusinessDetailModal.tsx # Dettagli centro benessere con listino prezzi
│       ├── SpaBookingModal.tsx   # Modulo di richiesta prenotazione massaggi
│       ├── PostAdModal.tsx       # Wizard in 4 passaggi per pubblicare annunci
│       ├── MessagesDrawer.tsx    # Inbox e chat in tempo reale
│       ├── AdminDashboardModal.tsx # Cruscotto di moderazione e adv sponsor
│       ├── UserAuthModal.tsx     # Gestione profilo e cambio rapido ruoli demo
│       ├── AgeVerificationModal.tsx # Gateway legale 18+ e consenso cookie GDPR
│       ├── AiSupportAssistant.tsx # Assistente virtuale per supporto utente
│       └── Footer.tsx            # Footer sobrio con link alle città e note legali
```

## 3. Avvio Locale

```bash
npm install
npm run dev
```

L'applicazione si avvierà su `http://localhost:3000`.

Per verificare la compilazione del progetto:
```bash
npm run build
npm run lint
```
