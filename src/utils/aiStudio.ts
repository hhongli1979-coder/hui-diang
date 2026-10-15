/**
 * AI Studio Copywriting & Campaign Generator for AMICA
 * Generates compelling Italian copy for listings, profiles, and advertising campaigns.
 */

export interface GenerateListingCopyOptions {
  category: string;
  nameOrAlias: string;
  districtOrCity: string;
  tone?: string;
  amenities?: string[];
  keyHighlights?: string;
}

export interface GeneratedListingCopy {
  title: string;
  description: string;
  tags: string[];
}

export function generateAdCampaignHeadline(placementType: string, cityName: string): string {
  const city = cityName || 'Bologna';
  switch (placementType) {
    case 'vetrina_home':
      return `🌟 Vetrina Esclusiva in Prima Pagina a ${city} – Massima Visibilità`;
    case 'top_city':
      return `💎 Posizione Top In Evidenza a ${city} – Raggiungi i Tuoi Clienti`;
    case 'category_spotlight':
      return `🔥 Spotlight di Categoria a ${city} – Annuncio Sempre al Vertice`;
    case 'discover_feed':
      return `✨ Campagna Feed Immersivo ${city} – Esperienza Visiva Ad Alto Impatto`;
    default:
      return `🚀 Campagna Promozione Premium a ${city} – Più Contatti e Prenotazioni`;
  }
}

export function generateListingCopy(options: GenerateListingCopyOptions): GeneratedListingCopy {
  const name = options.nameOrAlias || 'Amica';
  const location = options.districtOrCity || 'in centro';
  const tone = options.tone || 'elegante';

  let title = '';
  let description = '';
  let tags: string[] = ['Verificato', location];

  switch (options.category) {
    case 'escort':
      title = `${name} – Incontri Esclusivi e Raffinati a ${location}`;
      description = `Ciao, sono ${name}. Ti do il benvenuto in un ambiente intimo, elegante e riservato a ${location}. Offro momenti di autentico relax e complicità, con massima discrezione e igiene garantita. Disponibile per incontri in sede accogliente e trasferte selezionate. Foto recenti e verificate al 100%.`;
      tags = [...tags, 'Incall', 'Outcall', 'Riservatezza', 'Foto Reali'];
      break;

    case 'trans':
      title = `${name} – Fascino e Dolcezza Unica a ${location}`;
      description = `Ciao tesoro, sono ${name}. Una presenza sensuale, elegante e accogliente nel cuore di ${location}. Ti aspetto per condividere piacevoli momenti di evasione e coccole in un'atmosfera calda e rilassante. Pulizia assoluta e riservatezza.`;
      tags = [...tags, 'Trans', 'Massima Igiene', 'Sensualità', 'Discrezione'];
      break;

    case 'uomo_cerca_uomo':
      title = `${name} – Compagnia Maschile e Spensieratezza a ${location}`;
      description = `Ciao! Mi chiamo ${name}, ragazzo simpatico, sportivo e discreto a ${location}. Cerco incontri stimolanti, nuove amicizie o momenti di svago senza complicazioni. Massima serietà e reciproco rispetto.`;
      tags = [...tags, 'Gay Friendly', 'Sportivo', 'Aperitivo', 'Incontri'];
      break;

    case 'massaggi_benessere':
    case 'massaggi':
      title = `${name} – Trattamenti Olistici e Massaggi Rilassanti a ${location}`;
      description = `Ritrova l'equilibrio psicofisico e sciogli le tensioni quotidiane con percorsi di massaggio professionale a ${location}. Ambiente igienizzato, oli essenziali naturali, doccia riservata e musica rilassante. Trattamenti personalizzati per il tuo benessere.`;
      tags = [...tags, 'Massaggio Relax', 'Oli Naturali', 'Doccia Riservata', 'Benessere'];
      break;

    case 'incontri':
    default:
      title = `${name} – Nuove Connessioni e Bei Momenti a ${location}`;
      description = `Piacere, sono ${name}! Cerco persone piacevoli con cui condividere un buon aperitivo, chiacchiere interessanti e magari una bella intesa a ${location}. Se cerchi autenticità, buon umore e rispetto reciproco, scrivimi un messaggio!`;
      tags = [...tags, 'Incontri', 'Aperitivo', 'Affinità', 'Complicità'];
      break;
  }

  if (options.amenities && options.amenities.length > 0) {
    description += ` Servizi inclusi: ${options.amenities.join(', ')}.`;
  }
  if (options.keyHighlights) {
    description += ` Nota speciale: ${options.keyHighlights}.`;
  }

  return {
    title,
    description,
    tags,
  };
}
