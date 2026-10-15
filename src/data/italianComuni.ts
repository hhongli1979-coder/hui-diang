import { ItalianComune } from '../types';

/**
 * Comprehensive Italian Comune (Municipality) & City Database
 * Covers all 20 Regions, provincial capitals, and major municipalities with standard CAP and GPS coordinates.
 */
export const ITALIAN_COMUNI: ItalianComune[] = [
  // TOSCANA
  { id: 'firenze', name: 'Firenze', region: 'Toscana', province: 'Firenze', provinceCode: 'FI', postalCode: '50121', lat: 43.7696, lng: 11.2558, population: 360000 },
  { id: 'prato', name: 'Prato', region: 'Toscana', province: 'Prato', provinceCode: 'PO', postalCode: '59100', lat: 43.8777, lng: 11.1022, population: 195000 },
  { id: 'livorno', name: 'Livorno', region: 'Toscana', province: 'Livorno', provinceCode: 'LI', postalCode: '57121', lat: 43.5485, lng: 10.3106, population: 157000 },
  { id: 'arezzo', name: 'Arezzo', region: 'Toscana', province: 'Arezzo', provinceCode: 'AR', postalCode: '52100', lat: 43.4632, lng: 11.8796, population: 99000 },
  { id: 'pistoia', name: 'Pistoia', region: 'Toscana', province: 'Pistoia', provinceCode: 'PT', postalCode: '51100', lat: 43.9333, lng: 10.9167, population: 90000 },
  { id: 'pisa', name: 'Pisa', region: 'Toscana', province: 'Pisa', provinceCode: 'PI', postalCode: '56121', lat: 43.7228, lng: 10.4017, population: 90000 },
  { id: 'lucca', name: 'Lucca', region: 'Toscana', province: 'Lucca', provinceCode: 'LU', postalCode: '55100', lat: 43.8429, lng: 10.5027, population: 89000 },
  { id: 'grosseto', name: 'Grosseto', region: 'Toscana', province: 'Grosseto', provinceCode: 'GR', postalCode: '58100', lat: 42.7635, lng: 11.1118, population: 82000 },
  { id: 'siena', name: 'Siena', region: 'Toscana', province: 'Siena', provinceCode: 'SI', postalCode: '53100', lat: 43.3188, lng: 11.3308, population: 53000 },
  { id: 'massa', name: 'Massa', region: 'Toscana', province: 'Massa-Carrara', provinceCode: 'MS', postalCode: '54100', lat: 44.0306, lng: 10.1378, population: 66000 },
  { id: 'carrara', name: 'Carrara', region: 'Toscana', province: 'Massa-Carrara', provinceCode: 'MS', postalCode: '54033', lat: 44.0792, lng: 10.1006, population: 62000 },
  { id: 'viareggio', name: 'Viareggio', region: 'Toscana', province: 'Lucca', provinceCode: 'LU', postalCode: '55049', lat: 43.8667, lng: 10.2500, population: 61000 },
  { id: 'scandicci', name: 'Scandicci', region: 'Toscana', province: 'Firenze', provinceCode: 'FI', postalCode: '50018', lat: 43.7547, lng: 11.1897, population: 50000 },
  { id: 'empoli', name: 'Empoli', region: 'Toscana', province: 'Firenze', provinceCode: 'FI', postalCode: '50053', lat: 43.7178, lng: 10.9467, population: 48000 },
  { id: 'sesto_fiorentino', name: 'Sesto Fiorentino', region: 'Toscana', province: 'Firenze', provinceCode: 'FI', postalCode: '50019', lat: 43.8331, lng: 11.2003, population: 49000 },
  { id: 'montecatini_terme', name: 'Montecatini Terme', region: 'Toscana', province: 'Pistoia', provinceCode: 'PT', postalCode: '51016', lat: 43.8828, lng: 10.7719, population: 20000 },

  // LOMBARDIA
  { id: 'milano', name: 'Milano', region: 'Lombardia', province: 'Milano', provinceCode: 'MI', postalCode: '20121', lat: 45.4642, lng: 9.1900, population: 1370000 },
  { id: 'brescia', name: 'Brescia', region: 'Lombardia', province: 'Brescia', provinceCode: 'BS', postalCode: '25121', lat: 45.5416, lng: 10.2118, population: 196000 },
  { id: 'monza', name: 'Monza', region: 'Lombardia', province: 'Monza e Brianza', provinceCode: 'MB', postalCode: '20900', lat: 45.5845, lng: 9.2744, population: 122000 },
  { id: 'bergamo', name: 'Bergamo', region: 'Lombardia', province: 'Bergamo', provinceCode: 'BG', postalCode: '24121', lat: 45.6983, lng: 9.6773, population: 120000 },
  { id: 'busto_arsizio', name: 'Busto Arsizio', region: 'Lombardia', province: 'Varese', provinceCode: 'VA', postalCode: '21052', lat: 45.6119, lng: 8.8522, population: 83000 },
  { id: 'como', name: 'Como', region: 'Lombardia', province: 'Como', provinceCode: 'CO', postalCode: '22100', lat: 45.8081, lng: 9.0852, population: 84000 },
  { id: 'sesto_san_giovanni', name: 'Sesto San Giovanni', region: 'Lombardia', province: 'Milano', provinceCode: 'MI', postalCode: '20099', lat: 45.5328, lng: 9.2272, population: 81000 },
  { id: 'varese', name: 'Varese', region: 'Lombardia', province: 'Varese', provinceCode: 'VA', postalCode: '21100', lat: 45.8206, lng: 8.8262, population: 80000 },
  { id: 'cinisello_balsamo', name: 'Cinisello Balsamo', region: 'Lombardia', province: 'Milano', provinceCode: 'MI', postalCode: '20092', lat: 45.5564, lng: 9.2131, population: 75000 },
  { id: 'pavia', name: 'Pavia', region: 'Lombardia', province: 'Pavia', provinceCode: 'PV', postalCode: '27100', lat: 45.1847, lng: 9.1582, population: 73000 },
  { id: 'cremona', name: 'Cremona', region: 'Lombardia', province: 'Cremona', provinceCode: 'CR', postalCode: '26100', lat: 45.1333, lng: 10.0333, population: 72000 },
  { id: 'vigevano', name: 'Vigevano', region: 'Lombardia', province: 'Pavia', provinceCode: 'PV', postalCode: '27029', lat: 45.3167, lng: 8.8667, population: 63000 },
  { id: 'legnano', name: 'Legnano', region: 'Lombardia', province: 'Milano', provinceCode: 'MI', postalCode: '20025', lat: 45.5967, lng: 8.9136, population: 60000 },
  { id: 'mantova', name: 'Mantova', region: 'Lombardia', province: 'Mantova', provinceCode: 'MN', postalCode: '46100', lat: 45.1564, lng: 10.7914, population: 49000 },
  { id: 'lecco', name: 'Lecco', region: 'Lombardia', province: 'Lecco', provinceCode: 'LC', postalCode: '23900', lat: 45.8558, lng: 9.3978, population: 48000 },
  { id: 'lodi', name: 'Lodi', region: 'Lombardia', province: 'Lodi', provinceCode: 'LO', postalCode: '26900', lat: 45.3139, lng: 9.5033, population: 45000 },
  { id: 'sondrio', name: 'Sondrio', region: 'Lombardia', province: 'Sondrio', provinceCode: 'SO', postalCode: '23100', lat: 46.1694, lng: 9.8711, population: 21000 },

  // LAZIO
  { id: 'roma', name: 'Roma', region: 'Lazio', province: 'Roma', provinceCode: 'RM', postalCode: '00185', lat: 41.9028, lng: 12.4964, population: 2870000 },
  { id: 'latina', name: 'Latina', region: 'Lazio', province: 'Latina', provinceCode: 'LT', postalCode: '04100', lat: 41.4676, lng: 12.9037, population: 127000 },
  { id: 'guidonia_montecelio', name: 'Guidonia Montecelio', region: 'Lazio', province: 'Roma', provinceCode: 'RM', postalCode: '00012', lat: 41.9961, lng: 12.7247, population: 89000 },
  { id: 'fiumicino', name: 'Fiumicino', region: 'Lazio', province: 'Roma', provinceCode: 'RM', postalCode: '00054', lat: 41.7733, lng: 12.2356, population: 81000 },
  { id: 'aprilia', name: 'Aprilia', region: 'Lazio', province: 'Latina', provinceCode: 'LT', postalCode: '04011', lat: 41.5947, lng: 12.6508, population: 74000 },
  { id: 'viterbo', name: 'Viterbo', region: 'Lazio', province: 'Viterbo', provinceCode: 'VT', postalCode: '01100', lat: 42.4175, lng: 12.1047, population: 67000 },
  { id: 'pomezia', name: 'Pomezia', region: 'Lazio', province: 'Roma', provinceCode: 'RM', postalCode: '00071', lat: 41.6700, lng: 12.5028, population: 64000 },
  { id: 'tivoli', name: 'Tivoli', region: 'Lazio', province: 'Roma', provinceCode: 'RM', postalCode: '00019', lat: 41.9611, lng: 12.7981, population: 56000 },
  { id: 'anzio', name: 'Anzio', region: 'Lazio', province: 'Roma', provinceCode: 'RM', postalCode: '00042', lat: 41.4489, lng: 12.6272, population: 58000 },
  { id: 'velletri', name: 'Velletri', region: 'Lazio', province: 'Roma', provinceCode: 'RM', postalCode: '00049', lat: 41.6869, lng: 12.7781, population: 53000 },
  { id: 'civitavecchia', name: 'Civitavecchia', region: 'Lazio', province: 'Roma', provinceCode: 'RM', postalCode: '00053', lat: 42.0925, lng: 11.7964, population: 52000 },
  { id: 'frosinone', name: 'Frosinone', region: 'Lazio', province: 'Frosinone', provinceCode: 'FR', postalCode: '03100', lat: 41.6406, lng: 13.3517, population: 46000 },
  { id: 'rieti', name: 'Rieti', region: 'Lazio', province: 'Rieti', provinceCode: 'RI', postalCode: '02100', lat: 42.4042, lng: 12.8631, population: 47000 },

  // EMILIA-ROMAGNA
  { id: 'bologna', name: 'Bologna', region: 'Emilia-Romagna', province: 'Bologna', provinceCode: 'BO', postalCode: '40121', lat: 44.4949, lng: 11.3426, population: 390000 },
  { id: 'parma', name: 'Parma', region: 'Emilia-Romagna', province: 'Parma', provinceCode: 'PR', postalCode: '43121', lat: 44.8015, lng: 10.3279, population: 196000 },
  { id: 'modena', name: 'Modena', region: 'Emilia-Romagna', province: 'Modena', provinceCode: 'MO', postalCode: '41121', lat: 44.6471, lng: 10.9252, population: 185000 },
  { id: 'reggio_emilia', name: 'Reggio Emilia', region: 'Emilia-Romagna', province: 'Reggio Emilia', provinceCode: 'RE', postalCode: '42121', lat: 44.6982, lng: 10.6312, population: 171000 },
  { id: 'ravenna', name: 'Ravenna', region: 'Emilia-Romagna', province: 'Ravenna', provinceCode: 'RA', postalCode: '48121', lat: 44.4184, lng: 12.2035, population: 158000 },
  { id: 'rimini', name: 'Rimini', region: 'Emilia-Romagna', province: 'Rimini', provinceCode: 'RN', postalCode: '47921', lat: 44.0594, lng: 12.5683, population: 150000 },
  { id: 'ferrara', name: 'Ferrara', region: 'Emilia-Romagna', province: 'Ferrara', provinceCode: 'FE', postalCode: '44121', lat: 44.8381, lng: 11.6198, population: 132000 },
  { id: 'forli', name: 'Forlì', region: 'Emilia-Romagna', province: 'Forlì-Cesena', provinceCode: 'FC', postalCode: '47121', lat: 44.2227, lng: 12.0407, population: 117000 },
  { id: 'piacenza', name: 'Piacenza', region: 'Emilia-Romagna', province: 'Piacenza', provinceCode: 'PC', postalCode: '29121', lat: 45.0526, lng: 9.6929, population: 103000 },
  { id: 'cesena', name: 'Cesena', region: 'Emilia-Romagna', province: 'Forlì-Cesena', provinceCode: 'FC', postalCode: '47521', lat: 44.1391, lng: 12.2431, population: 97000 },
  { id: 'carpi', name: 'Carpi', region: 'Emilia-Romagna', province: 'Modena', provinceCode: 'MO', postalCode: '41012', lat: 44.7844, lng: 10.8856, population: 71000 },
  { id: 'imola', name: 'Imola', region: 'Emilia-Romagna', province: 'Bologna', provinceCode: 'BO', postalCode: '40026', lat: 44.3533, lng: 11.7144, population: 70000 },
  { id: 'faenza', name: 'Faenza', region: 'Emilia-Romagna', province: 'Ravenna', provinceCode: 'RA', postalCode: '48018', lat: 44.2894, lng: 11.8778, population: 59000 },
  { id: 'riccione', name: 'Riccione', region: 'Emilia-Romagna', province: 'Rimini', provinceCode: 'RN', postalCode: '47838', lat: 43.9994, lng: 12.6558, population: 35000 },

  // VENETO
  { id: 'venezia', name: 'Venezia', region: 'Veneto', province: 'Venezia', provinceCode: 'VE', postalCode: '30121', lat: 45.4408, lng: 12.3155, population: 260000 },
  { id: 'verona', name: 'Verona', region: 'Veneto', province: 'Verona', provinceCode: 'VR', postalCode: '37121', lat: 45.4384, lng: 10.9916, population: 257000 },
  { id: 'padova', name: 'Padova', region: 'Veneto', province: 'Padova', provinceCode: 'PD', postalCode: '35121', lat: 45.4064, lng: 11.8768, population: 210000 },
  { id: 'vicenza', name: 'Vicenza', region: 'Veneto', province: 'Vicenza', provinceCode: 'VI', postalCode: '36100', lat: 45.5455, lng: 11.5354, population: 111000 },
  { id: 'treviso', name: 'Treviso', region: 'Veneto', province: 'Treviso', provinceCode: 'TV', postalCode: '31100', lat: 45.6669, lng: 12.2431, population: 85000 },
  { id: 'rovigo', name: 'Rovigo', region: 'Veneto', province: 'Rovigo', provinceCode: 'RO', postalCode: '45100', lat: 45.0703, lng: 11.7906, population: 51000 },
  { id: 'chioggia', name: 'Chioggia', region: 'Veneto', province: 'Venezia', provinceCode: 'VE', postalCode: '30015', lat: 45.2197, lng: 12.2789, population: 49000 },
  { id: 'bassano_del_grappa', name: 'Bassano del Grappa', region: 'Veneto', province: 'Vicenza', provinceCode: 'VI', postalCode: '36061', lat: 45.7667, lng: 11.7333, population: 43000 },
  { id: 'belluno', name: 'Belluno', region: 'Veneto', province: 'Belluno', provinceCode: 'BL', postalCode: '32100', lat: 46.1428, lng: 12.2167, population: 36000 },

  // PIEMONTE
  { id: 'torino', name: 'Torino', region: 'Piemonte', province: 'Torino', provinceCode: 'TO', postalCode: '10121', lat: 45.0703, lng: 7.6869, population: 870000 },
  { id: 'novara', name: 'Novara', region: 'Piemonte', province: 'Novara', provinceCode: 'NO', postalCode: '28100', lat: 45.4469, lng: 8.6203, population: 104000 },
  { id: 'alessandria', name: 'Alessandria', region: 'Piemonte', province: 'Alessandria', provinceCode: 'AL', postalCode: '15121', lat: 44.9128, lng: 8.6144, population: 93000 },
  { id: 'asti', name: 'Asti', region: 'Piemonte', province: 'Asti', provinceCode: 'AT', postalCode: '14100', lat: 44.9006, lng: 8.2069, population: 75000 },
  { id: 'moncalieri', name: 'Moncalieri', region: 'Piemonte', province: 'Torino', provinceCode: 'TO', postalCode: '10024', lat: 45.0000, lng: 7.6833, population: 57000 },
  { id: 'cuneo', name: 'Cuneo', region: 'Piemonte', province: 'Cuneo', provinceCode: 'CN', postalCode: '12100', lat: 44.3844, lng: 7.5428, population: 56000 },
  { id: 'collegno', name: 'Collegno', region: 'Piemonte', province: 'Torino', provinceCode: 'TO', postalCode: '10093', lat: 45.0789, lng: 7.5731, population: 50000 },
  { id: 'vercelli', name: 'Vercelli', region: 'Piemonte', province: 'Vercelli', provinceCode: 'VC', postalCode: '13100', lat: 45.3258, lng: 8.4239, population: 46000 },
  { id: 'biella', name: 'Biella', region: 'Piemonte', province: 'Biella', provinceCode: 'BI', postalCode: '13900', lat: 45.5667, lng: 8.0500, population: 44000 },
  { id: 'verbania', name: 'Verbania', region: 'Piemonte', province: 'Verbano-Cusio-Ossola', provinceCode: 'VB', postalCode: '28921', lat: 45.9228, lng: 8.5517, population: 30000 },

  // CAMPANIA
  { id: 'napoli', name: 'Napoli', region: 'Campania', province: 'Napoli', provinceCode: 'NA', postalCode: '80121', lat: 40.8518, lng: 14.2681, population: 960000 },
  { id: 'salerno', name: 'Salerno', region: 'Campania', province: 'Salerno', provinceCode: 'SA', postalCode: '84121', lat: 40.6824, lng: 14.7681, population: 133000 },
  { id: 'giugliano', name: 'Giugliano in Campania', region: 'Campania', province: 'Napoli', provinceCode: 'NA', postalCode: '80014', lat: 40.9292, lng: 14.1950, population: 124000 },
  { id: 'torre_del_greco', name: 'Torre del Greco', region: 'Campania', province: 'Napoli', provinceCode: 'NA', postalCode: '80059', lat: 40.7878, lng: 14.3683, population: 85000 },
  { id: 'pozzuoli', name: 'Pozzuoli', region: 'Campania', province: 'Napoli', provinceCode: 'NA', postalCode: '80078', lat: 40.8258, lng: 14.1228, population: 80000 },
  { id: 'casoria', name: 'Casoria', region: 'Campania', province: 'Napoli', provinceCode: 'NA', postalCode: '80026', lat: 40.9000, lng: 14.2833, population: 76000 },
  { id: 'caserta', name: 'Caserta', region: 'Campania', province: 'Caserta', provinceCode: 'CE', postalCode: '81100', lat: 41.0722, lng: 14.3325, population: 74000 },
  { id: 'castellammare_di_stabia', name: 'Castellammare di Stabia', region: 'Campania', province: 'Napoli', provinceCode: 'NA', postalCode: '80053', lat: 40.6958, lng: 14.4792, population: 65000 },
  { id: 'afragola', name: 'Afragola', region: 'Campania', province: 'Napoli', provinceCode: 'NA', postalCode: '80021', lat: 40.9167, lng: 14.3000, population: 64000 },
  { id: 'benevento', name: 'Benevento', region: 'Campania', province: 'Benevento', provinceCode: 'BN', postalCode: '82100', lat: 41.1306, lng: 14.7778, population: 59000 },
  { id: 'avellino', name: 'Avellino', region: 'Campania', province: 'Avellino', provinceCode: 'AV', postalCode: '83100', lat: 40.9144, lng: 14.7928, population: 53000 },

  // SICILIA
  { id: 'palermo', name: 'Palermo', region: 'Sicilia', province: 'Palermo', provinceCode: 'PA', postalCode: '90121', lat: 38.1157, lng: 13.3615, population: 650000 },
  { id: 'catania', name: 'Catania', region: 'Sicilia', province: 'Catania', provinceCode: 'CT', postalCode: '95121', lat: 37.5079, lng: 15.0830, population: 310000 },
  { id: 'messina', name: 'Messina', region: 'Sicilia', province: 'Messina', provinceCode: 'ME', postalCode: '98121', lat: 38.1938, lng: 15.5540, population: 230000 },
  { id: 'siracusa', name: 'Siracusa', region: 'Sicilia', province: 'Siracusa', provinceCode: 'SR', postalCode: '96100', lat: 37.0755, lng: 15.2866, population: 120000 },
  { id: 'marsala', name: 'Marsala', region: 'Sicilia', province: 'Trapani', provinceCode: 'TP', postalCode: '91025', lat: 37.7981, lng: 12.4358, population: 82000 },
  { id: 'gela', name: 'Gela', region: 'Sicilia', province: 'Caltanissetta', provinceCode: 'CL', postalCode: '93012', lat: 37.0667, lng: 14.2500, population: 74000 },
  { id: 'ragusa', name: 'Ragusa', region: 'Sicilia', province: 'Ragusa', provinceCode: 'RG', postalCode: '97100', lat: 36.9269, lng: 14.7306, population: 73000 },
  { id: 'trapani', name: 'Trapani', region: 'Sicilia', province: 'Trapani', provinceCode: 'TP', postalCode: '91100', lat: 38.0167, lng: 12.5167, population: 67000 },
  { id: 'agrigento', name: 'Agrigento', region: 'Sicilia', province: 'Agrigento', provinceCode: 'AG', postalCode: '92100', lat: 37.3111, lng: 13.5764, population: 59000 },
  { id: 'caltanissetta', name: 'Caltanissetta', region: 'Sicilia', province: 'Caltanissetta', provinceCode: 'CL', postalCode: '93100', lat: 37.4922, lng: 14.0622, population: 62000 },
  { id: 'enna', name: 'Enna', region: 'Sicilia', province: 'Enna', provinceCode: 'EN', postalCode: '94100', lat: 37.5678, lng: 14.2792, population: 27000 },

  // PUGLIA
  { id: 'bari', name: 'Bari', region: 'Puglia', province: 'Bari', provinceCode: 'BA', postalCode: '70121', lat: 41.1171, lng: 16.8719, population: 320000 },
  { id: 'taranto', name: 'Taranto', region: 'Puglia', province: 'Taranto', provinceCode: 'TA', postalCode: '74121', lat: 40.4644, lng: 17.2470, population: 195000 },
  { id: 'foggia', name: 'Foggia', region: 'Puglia', province: 'Foggia', provinceCode: 'FG', postalCode: '71121', lat: 41.4622, lng: 15.5447, population: 150000 },
  { id: 'andria', name: 'Andria', region: 'Puglia', province: 'Barletta-Andria-Trani', provinceCode: 'BT', postalCode: '76123', lat: 41.2294, lng: 16.2975, population: 100000 },
  { id: 'lecce', name: 'Lecce', region: 'Puglia', province: 'Lecce', provinceCode: 'LE', postalCode: '73100', lat: 40.3548, lng: 18.1724, population: 95000 },
  { id: 'barletta', name: 'Barletta', region: 'Puglia', province: 'Barletta-Andria-Trani', provinceCode: 'BT', postalCode: '76121', lat: 41.3197, lng: 16.2819, population: 94000 },
  { id: 'brindisi', name: 'Brindisi', region: 'Puglia', province: 'Brindisi', provinceCode: 'BR', postalCode: '72100', lat: 40.6384, lng: 17.9459, population: 87000 },
  { id: 'altamura', name: 'Altamura', region: 'Puglia', province: 'Bari', provinceCode: 'BA', postalCode: '70022', lat: 40.8258, lng: 16.5539, population: 70000 },
  { id: 'molfetta', name: 'Molfetta', region: 'Puglia', province: 'Bari', provinceCode: 'BA', postalCode: '70056', lat: 41.2014, lng: 16.5986, population: 59000 },

  // LIGURIA
  { id: 'genova', name: 'Genova', region: 'Liguria', province: 'Genova', provinceCode: 'GE', postalCode: '16121', lat: 44.4056, lng: 8.9463, population: 560000 },
  { id: 'la_spezia', name: 'La Spezia', region: 'Liguria', province: 'La Spezia', provinceCode: 'SP', postalCode: '19121', lat: 44.1100, lng: 9.8300, population: 93000 },
  { id: 'savona', name: 'Savona', region: 'Liguria', province: 'Savona', provinceCode: 'SV', postalCode: '17100', lat: 44.3081, lng: 8.4811, population: 60000 },
  { id: 'sanremo', name: 'Sanremo', region: 'Liguria', province: 'Imperia', provinceCode: 'IM', postalCode: '18038', lat: 43.8167, lng: 7.7833, population: 55000 },
  { id: 'imperia', name: 'Imperia', region: 'Liguria', province: 'Imperia', provinceCode: 'IM', postalCode: '18100', lat: 43.8872, lng: 8.0289, population: 42000 },
  { id: 'rapallo', name: 'Rapallo', region: 'Liguria', province: 'Genova', provinceCode: 'GE', postalCode: '16035', lat: 44.3500, lng: 9.2333, population: 30000 },

  // MARCHE
  { id: 'ancona', name: 'Ancona', region: 'Marche', province: 'Ancona', provinceCode: 'AN', postalCode: '60121', lat: 43.6167, lng: 13.5167, population: 100000 },
  { id: 'pesaro', name: 'Pesaro', region: 'Marche', province: 'Pesaro e Urbino', provinceCode: 'PU', postalCode: '61121', lat: 43.9100, lng: 12.9133, population: 96000 },
  { id: 'fano', name: 'Fano', region: 'Marche', province: 'Pesaro e Urbino', provinceCode: 'PU', postalCode: '61032', lat: 43.8425, lng: 13.0189, population: 60000 },
  { id: 'ascoli_piceno', name: 'Ascoli Piceno', region: 'Marche', province: 'Ascoli Piceno', provinceCode: 'AP', postalCode: '63100', lat: 42.8550, lng: 13.5750, population: 48000 },
  { id: 'macerata', name: 'Macerata', region: 'Marche', province: 'Macerata', provinceCode: 'MC', postalCode: '62100', lat: 43.3000, lng: 13.4500, population: 42000 },
  { id: 'fermo', name: 'Fermo', region: 'Marche', province: 'Fermo', provinceCode: 'FM', postalCode: '63900', lat: 43.1611, lng: 13.7178, population: 37000 },

  // FRIULI-VENEZIA GIULIA
  { id: 'trieste', name: 'Trieste', region: 'Friuli-Venezia Giulia', province: 'Trieste', provinceCode: 'TS', postalCode: '34121', lat: 45.6495, lng: 13.7768, population: 200000 },
  { id: 'udine', name: 'Udine', region: 'Friuli-Venezia Giulia', province: 'Udine', provinceCode: 'UD', postalCode: '33100', lat: 46.0667, lng: 13.2333, population: 100000 },
  { id: 'pordenone', name: 'Pordenone', region: 'Friuli-Venezia Giulia', province: 'Pordenone', provinceCode: 'PN', postalCode: '33170', lat: 45.9564, lng: 12.6606, population: 51000 },
  { id: 'gorizia', name: 'Gorizia', region: 'Friuli-Venezia Giulia', province: 'Gorizia', provinceCode: 'GO', postalCode: '34170', lat: 45.9408, lng: 13.6219, population: 34000 },

  // ABRUZZO
  { id: 'pescara', name: 'Pescara', region: 'Abruzzo', province: 'Pescara', provinceCode: 'PE', postalCode: '65121', lat: 42.4643, lng: 14.2142, population: 120000 },
  { id: 'aquila', name: "L'Aquila", region: 'Abruzzo', province: "L'Aquila", provinceCode: 'AQ', postalCode: '67100', lat: 42.3498, lng: 13.3995, population: 70000 },
  { id: 'teramo', name: 'Teramo', region: 'Abruzzo', province: 'Teramo', provinceCode: 'TE', postalCode: '64100', lat: 42.6589, lng: 13.7044, population: 54000 },
  { id: 'chieti', name: 'Chieti', region: 'Abruzzo', province: 'Chieti', provinceCode: 'CH', postalCode: '66100', lat: 42.3506, lng: 14.1678, population: 51000 },

  // TRENTINO-ALTO ADIGE
  { id: 'trento', name: 'Trento', region: 'Trentino-Alto Adige', province: 'Trento', provinceCode: 'TN', postalCode: '38121', lat: 46.0667, lng: 11.1167, population: 118000 },
  { id: 'bolzano', name: 'Bolzano / Bozen', region: 'Trentino-Alto Adige', province: 'Bolzano', provinceCode: 'BZ', postalCode: '39100', lat: 46.4983, lng: 11.3548, population: 107000 },
  { id: 'rovereto', name: 'Rovereto', region: 'Trentino-Alto Adige', province: 'Trento', provinceCode: 'TN', postalCode: '38068', lat: 45.8894, lng: 11.0436, population: 40000 },
  { id: 'merano', name: 'Merano / Meran', region: 'Trentino-Alto Adige', province: 'Bolzano', provinceCode: 'BZ', postalCode: '39012', lat: 46.6711, lng: 11.1594, population: 41000 },

  // UMBRIA
  { id: 'perugia', name: 'Perugia', region: 'Umbria', province: 'Perugia', provinceCode: 'PG', postalCode: '06121', lat: 43.1107, lng: 12.3908, population: 165000 },
  { id: 'terni', name: 'Terni', region: 'Umbria', province: 'Terni', provinceCode: 'TR', postalCode: '05100', lat: 42.5667, lng: 12.6500, population: 110000 },
  { id: 'foligno', name: 'Foligno', region: 'Umbria', province: 'Perugia', provinceCode: 'PG', postalCode: '06034', lat: 42.9556, lng: 12.7036, population: 57000 },
  { id: 'citta_di_castello', name: 'Città di Castello', region: 'Umbria', province: 'Perugia', provinceCode: 'PG', postalCode: '06012', lat: 43.4561, lng: 12.2394, population: 39000 },
  { id: 'spoleto', name: 'Spoleto', region: 'Umbria', province: 'Perugia', provinceCode: 'PG', postalCode: '06049', lat: 42.7333, lng: 12.7333, population: 37000 },

  // SARDEGNA
  { id: 'cagliari', name: 'Cagliari', region: 'Sardegna', province: 'Cagliari', provinceCode: 'CA', postalCode: '09121', lat: 39.2238, lng: 9.1217, population: 154000 },
  { id: 'sassari', name: 'Sassari', region: 'Sardegna', province: 'Sassari', provinceCode: 'SS', postalCode: '07100', lat: 40.7272, lng: 8.5606, population: 127000 },
  { id: 'quartu_sant_elena', name: "Quartu Sant'Elena", region: 'Sardegna', province: 'Cagliari', provinceCode: 'CA', postalCode: '09045', lat: 39.2417, lng: 9.1833, population: 70000 },
  { id: 'olbia', name: 'Olbia', region: 'Sardegna', province: 'Sassari', provinceCode: 'SS', postalCode: '07026', lat: 40.9239, lng: 9.4967, population: 61000 },
  { id: 'nuoro', name: 'Nuoro', region: 'Sardegna', province: 'Nuoro', provinceCode: 'NU', postalCode: '08100', lat: 40.3208, lng: 9.3292, population: 36000 },
  { id: 'oristano', name: 'Oristano', region: 'Sardegna', province: 'Oristano', provinceCode: 'OR', postalCode: '09170', lat: 39.9056, lng: 8.5917, population: 31000 },

  // CALABRIA
  { id: 'reggio_calabria', name: 'Reggio Calabria', region: 'Calabria', province: 'Reggio Calabria', provinceCode: 'RC', postalCode: '89121', lat: 38.1114, lng: 15.6472, population: 180000 },
  { id: 'catanzaro', name: 'Catanzaro', region: 'Calabria', province: 'Catanzaro', provinceCode: 'CZ', postalCode: '88100', lat: 38.9058, lng: 16.5944, population: 90000 },
  { id: 'corigliano_rossano', name: 'Corigliano-Rossano', region: 'Calabria', province: 'Cosenza', provinceCode: 'CS', postalCode: '87064', lat: 39.5750, lng: 16.5186, population: 77000 },
  { id: 'lamezia_terme', name: 'Lamezia Terme', region: 'Calabria', province: 'Catanzaro', provinceCode: 'CZ', postalCode: '88046', lat: 38.9667, lng: 16.3167, population: 70000 },
  { id: 'cosenza', name: 'Cosenza', region: 'Calabria', province: 'Cosenza', provinceCode: 'CS', postalCode: '87100', lat: 39.3000, lng: 16.2500, population: 67000 },
  { id: 'crotone', name: 'Crotone', region: 'Calabria', province: 'Crotone', provinceCode: 'KR', postalCode: '88900', lat: 39.0833, lng: 17.1167, population: 64000 },
  { id: 'vibo_valentia', name: 'Vibo Valentia', region: 'Calabria', province: 'Vibo Valentia', provinceCode: 'VV', postalCode: '89900', lat: 38.6750, lng: 16.1000, population: 33000 },

  // BASILICATA
  { id: 'potenza', name: 'Potenza', region: 'Basilicata', province: 'Potenza', provinceCode: 'PZ', postalCode: '85100', lat: 40.6406, lng: 15.8056, population: 66000 },
  { id: 'matera', name: 'Matera', region: 'Basilicata', province: 'Matera', provinceCode: 'MT', postalCode: '75100', lat: 40.6667, lng: 16.6000, population: 60000 },

  // MOLISE
  { id: 'campobasso', name: 'Campobasso', region: 'Molise', province: 'Campobasso', provinceCode: 'CB', postalCode: '86100', lat: 41.5606, lng: 14.6628, population: 49000 },
  { id: 'isernia', name: 'Isernia', region: 'Molise', province: 'Isernia', provinceCode: 'IS', postalCode: '86170', lat: 41.5975, lng: 14.2344, population: 21000 },
  { id: 'termoli', name: 'Termoli', region: 'Molise', province: 'Campobasso', provinceCode: 'CB', postalCode: '86039', lat: 42.0000, lng: 14.9833, population: 33000 },

  // VALLE D'AOSTA
  { id: 'aosta', name: 'Aosta', region: "Valle d'Aosta", province: 'Aosta', provinceCode: 'AO', postalCode: '11100', lat: 45.7372, lng: 7.3197, population: 34000 },
  { id: 'courmayeur', name: 'Courmayeur', region: "Valle d'Aosta", province: 'Aosta', provinceCode: 'AO', postalCode: '11013', lat: 45.7967, lng: 6.9686, population: 2800 },
];

/**
 * Fast prefix/fuzzy search across Italian Comuni by name, CAP, province or region
 */
export function searchItalianComuni(query: string, maxResults: number = 8): ItalianComune[] {
  if (!query || !query.trim()) return [];

  const q = query.trim().toLowerCase();

  // Score each comune
  const scored = ITALIAN_COMUNI.map((c) => {
    let score = 0;
    const nameLow = c.name.toLowerCase();
    const provLow = c.province.toLowerCase();
    const provCodeLow = c.provinceCode.toLowerCase();
    const capLow = c.postalCode.toLowerCase();
    const regLow = c.region.toLowerCase();

    if (nameLow === q) score += 100;
    else if (nameLow.startsWith(q)) score += 60;
    else if (nameLow.includes(q)) score += 40;

    if (capLow === q) score += 95;
    else if (capLow.startsWith(q)) score += 50;

    if (provCodeLow === q) score += 80;
    if (provLow.startsWith(q)) score += 30;
    if (regLow.startsWith(q)) score += 20;

    return { comune: c, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || (b.comune.population || 0) - (a.comune.population || 0));

  return scored.slice(0, maxResults).map((item) => item.comune);
}

/**
 * Find exact or closest Comune by GPS coordinates
 */
export function findNearestComune(lat: number, lng: number): ItalianComune {
  let nearest = ITALIAN_COMUNI[0];
  let minDistance = Number.MAX_VALUE;

  for (const c of ITALIAN_COMUNI) {
    const dLat = c.lat - lat;
    const dLng = c.lng - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistance) {
      minDistance = distSq;
      nearest = c;
    }
  }

  return nearest;
}
