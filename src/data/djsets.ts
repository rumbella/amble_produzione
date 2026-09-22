/**
 * CENSIMENTO DATI: djsets.ts
 * 
 * 1. DJSET_ITEMS (Array di 11 DJ Set con relative informazioni):
 *    - ID 1: "Accademia italiana dj A.i.D." (Radio Amblè) - CDN image
 *    - ID 2: "Alex Neri" (Alex Neri) - CDN image
 *    - ID 3: "Biga" (Biga) - CDN image
 *    - ID 4: "Collettivo Co.lore" (Collettivo Co.lore) - CDN image
 *    - ID 5: "FKV" (FKV) - CDN image
 *    - ID 6: "GGDEX GENTLE WAVES" (GGDEX GENTLE WAVES) - CDN image
 *    - ID 7: "HZHA DISCHI SOFFICI" (HZHA DISCHI SOFFICI) - CDN image
 *    - ID 8: "Mistiche Vibre" (Mistiche Vibre) - CDN image
 *    - ID 9: "Vimana" (Vimana) - CDN image
 *    - ID 10: "Stiv Tirella" (Stiv Tirella) - CDN image
 *    - ID 11: "Rufus" (Rufus) - CDN image
 * 
 * 2. MOCK_SONGS (Array di 8 brani di esempio con audio SoundHelix):
 *    - "Come Together", "Something", "Maxwell's Silver Hammer", "Oh! Darling",
 *      "Octopus's Garden", "I Want You (She's So Heavy)", "Here Comes The Sun", "Because"
 * 
 * 3. getDjSetSongs(playlistId):
 *    - Funzione helper che restituisce la lista delle tracce (audio CDN Bunny) per ciascun DJ Set (ID 1 - 11).
 */

import { Song, MediaCategoryItem } from '../types';
import { SAMPLE_DJSET_SPONSOR } from './sponsors';

export const DJSET_ITEMS: MediaCategoryItem[] = [
  { 
    id: 2, 
    title: 'Alex Neri', 
    author: 'Alex Neri', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Alex%20Neri%20dj/images%20(12).jpeg',
    seed: 302,
    tag: 'SELEZIONE CLUB',
    subtitle: 'DJ Set Selecta',
    teaser: 'Groove esclusivi ed house d\'eccezione firmata Alex Neri: sessioni registrate live appositamente per Radio Amblè.',
    sponsor: SAMPLE_DJSET_SPONSOR
  },
  { 
    id: 1, 
    title: 'Accademia italiana dj A.i.D.', 
    author: 'Radio Amblè', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./immagini%20e%20video%20ai%20per%20AID/images%20(7)%20-%20Modificata%20(1).png',
    seed: 301,
    tag: 'MIX ESCLUSIVO',
    subtitle: 'I talenti del domani',
    teaser: 'I migliori allievi e docenti della scuola A.i.D. firmano una selezione elettronica tagliente e imprevedibile.'
  },
  { 
    id: 3, 
    title: 'Biga', 
    author: 'Biga', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Biga/Biga_press_ottobre126%20(1)%20(1).webp',
    seed: 303,
    tag: 'SELEZIONE VINILICA',
    subtitle: 'Deep Sounds from the Vault',
    teaser: 'Una selezione ricercata di rarità funk, soul, hip-hop ed elettronica d\'annata, mixata sapientemente dall\'eclettico DJ Biga.'
  },
  { 
    id: 4, 
    title: 'Collettivo Co.lore', 
    author: 'Collettivo Co.lore', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Collettivo%20colore/Screenshot%202026-06-06%2021.56.02.png',
    seed: 304,
    tag: 'EXPLORATION',
    subtitle: 'Co.LORE Gisela',
    teaser: 'Atmosfere profonde e sound design curato dal Collettivo Co.lore.'
  },
  { 
    id: 5, 
    title: 'FKV', 
    author: 'FKV', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/FKV/FKV_PRESSKIT_2024%20(1)%20(2).jpg',
    seed: 305,
    tag: 'SELEZIONE DEEP',
    subtitle: 'FKV Selection',
    teaser: 'Selezione ricercata e accattivante firmata FKV, con groove trascinanti e sonorità avvolgenti.'
  },
  { 
    id: 6, 
    title: 'GGDEX GENTLE WAVES', 
    author: 'GGDEX GENTLE WAVES', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/GGDEX%20GENTLE%20WAVES/Bio%20Foto/Photo-01%20(1).jpg',
    seed: 306,
    tag: 'GENTLE WAVES',
    subtitle: 'Ambient & Deep Selection',
    teaser: 'Onde sonore, ritmi avvolgenti e paesaggi sonori rilassanti curati da GGDEX per Radio Amblè.'
  },
  { 
    id: 7, 
    title: 'HZHA DISCHI SOFFICI', 
    author: 'HZHA DISCHI SOFFICI', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/HZHA%20DISCHI%20SOFFICI/Foto%20e%20Bio/37c45c4f-2352-43dc-8b1f-d9060b996dc5%20(1).jpeg',
    seed: 307,
    tag: 'DISCHI SOFFICI',
    subtitle: 'Mellow & Soft Grooves',
    teaser: 'Un viaggio imperdibile tra dischi soffici e sonorità calde selezionate con cura per Radio Amblè.'
  },
  { 
    id: 8, 
    title: 'Mistiche Vibre', 
    author: 'Mistiche Vibre', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Mistiche%20Vibre/Mistiche%20Vibre.jpeg',
    seed: 308,
    tag: 'MISTICA',
    subtitle: 'Vibrazioni Mistiche',
    teaser: 'Atmosfere magiche e suoni avvolgenti selezionati da Mistiche Vibre per un viaggio sensoriale indimenticabile.'
  },
  { 
    id: 9, 
    title: 'Vimana', 
    author: 'Vimana', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/vimana/Screenshot%202025-12-05%2010.35.23.png',
    seed: 309,
    tag: 'RARE GROOVE',
    subtitle: 'Vimana Project Selection',
    teaser: 'Rarità groove, selezioni funk calde, sonorità italiane e ritmi rari scelti da Vimana Project.'
  },
  { 
    id: 10, 
    title: 'Stiv Tirella', 
    author: 'Stiv Tirella', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20T%20foto%201%20(1).jpg',
    seed: 310,
    tag: 'SCHEGGIA IMPAZZITA',
    subtitle: 'Scheggia Impazzita',
    teaser: 'Energia allo stato puro e selezioni eccentriche firmate Stiv Tirella con il suo celebre format Scheggia Impazzita.'
  },
  { 
    id: 11, 
    title: 'Rufus', 
    author: 'Rufus', 
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/immagini/397df7675bb90715880609056aad5814.jpg',
    seed: 311,
    tag: 'CITY SOUND PERSPECTIVE',
    subtitle: 'City Sound Perspective',
    teaser: 'Un elegante viaggio sonoro metropolitano tra groove raffinati, funk, disco e sonorità ricercate selezionate da Rufus.'
  }
];

export const MOCK_SONGS: Song[] = [
  { title: "Come Together", duration: "4:19", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Something", duration: "3:02", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Maxwell's Silver Hammer", duration: "3:27", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Oh! Darling", duration: "3:26", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "Octopus's Garden", duration: "2:50", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { title: "I Want You (She's So Heavy)", duration: "7:47", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { title: "Here Comes The Sun", duration: "3:05", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { title: "Because", duration: "2:45", audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

export function getDjSetSongs(playlistId: number): Song[] {
  if (playlistId === 1) {
    return [
      { 
        title: "millers e alez garcia", 
        duration: "5:32", 
        audioUrl: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%232%20%20Millers%20Galez%20Garcia.mp3" 
      },
      {
        title: "Emanuele Orsini Giorgia Marziano",
        duration: "4:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%233%20Emanuele%20Orsini%20Giorgia%20Marziano.mp3"
      },
      {
        title: "marzo Alex Meu e Xandra",
        duration: "5:12",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%234%2025%20marzo%20Alex%20Meu%20e%20Xandra.mp3"
      },
      {
        title: "Kressi e Galez Garcia",
        duration: "6:18",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%235%20Kressi%20e%20Galez%20Garcia.mp3"
      },
      {
        title: "Vika Meelis e Hroven",
        duration: "5:50",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%236%20Vika%20Meelis%20e%20Hroven.mp3"
      },
      {
        title: "Daniela Ferrari e Galez Garcia",
        duration: "5:05",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%237%20Daniela%20Ferrari%20e%20Galez%20Garcia.mp3"
      }
    ];
  }
  if (playlistId === 2) {
    return [
      {
        title: "ALEX NERI E MOUNTH WATER",
        duration: "1:14:27",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Alex%20Neri%20dj/Set/ALEX%20NERI%20E%20MOUNTH%20WATER%20RADIO%20AMBLE%2027%20LUGLIO%202022.mp3"
      },
      {
        title: "ALEX NERI E MENNIE",
        duration: "1:18:40",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Alex%20Neri%20dj/Set/ALEX%20NERI%20E%20MENNIE%20RADIO%20AMBLE%2031%20AGOSTO%202022.mp3"
      },
      {
        title: "ALEX NERI",
        duration: "1:24:10",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Alex%20Neri%20dj/Set/alex%20neri.mp3"
      }
    ];
  }
  if (playlistId === 3) {
    return [
      {
        title: "DEEP SOUND FROM THE VAULT VOL 1",
        duration: "1:12:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Biga/DJ%20set/Biga%20deep%20soundm%20from%20the%20vault%2013%20mar.%2026.mp3"
      },
      {
        title: "DEEP SOUND FROM THE VAULT VOL 2",
        duration: "1:15:20",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Biga/DJ%20set/Biga%2011%20dic%20Deep%20sounds%20from%20the%20valut.mp3"
      }
    ];
  }
  if (playlistId === 4) {
    return [
      {
        title: "Co.LORE Gisela",
        duration: "1:02:15",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Collettivo%20colore/Co.LORE%20Gisela%2026%20marzo%2026.mp3"
      },
      {
        title: "Co.lore Collettivo Loredana Olivia_B & Santamama",
        duration: "1:18:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Collettivo%20colore/Colore%20%20Collettivo%20Loredana%20%20Olivia_B%20%26%20Santamama.mp3"
      }
    ];
  }
  if (playlistId === 5) {
    return [
      {
        title: "FKV VOL 1",
        duration: "1:15:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/FKV/FKV-%2016%20ottobre%2025.mp3"
      }
    ];
  }
  if (playlistId === 6) {
    return [
      {
        title: "VOL 1",
        duration: "1:32:40",
        audioUrl: "https://radioamble-cdn.b-cdn.net/GGDEX%20GENTLE%20WAVES/GGDEX%20Gentle%20waves%205%20febb%2026.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:24:15",
        audioUrl: "https://radioamble-cdn.b-cdn.net/GGDEX%20GENTLE%20WAVES/GGDEX%20GENTLE%20WAVES%206%20NOV%2025%20mp3.mp3"
      }
    ];
  }
  if (playlistId === 7) {
    return [
      {
        title: "VOL 1",
        duration: "1:20:15",
        audioUrl: "https://radioamble-cdn.b-cdn.net/HZHA%20DISCHI%20SOFFICI/HZHA%20Dischi%20soffici%2027%20nov%2025%20T.GHIVING.mp3"
      }
    ];
  }
  if (playlistId === 8) {
    return [
      {
        title: "VOL 1",
        duration: "1:22:10",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Mistiche%20Vibre/Mistiche%20Vibre%20e%20Aris%20SKR%2018%20aprile%2026.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:18:35",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Mistiche%20Vibre/Mistike%20Vibes%20ospite%20DonSurf%2022%20gennaio.mp3"
      }
    ];
  }
  if (playlistId === 9) {
    return [
      {
        title: "VOL 1",
        duration: "1:15:30",
        audioUrl: "https://radioamble-cdn.b-cdn.net/vimana/Vimana%20Progect%20Rare%20Groove%20%209%20lug.%2025.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:22:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/vimana/Vimana%20Rare%20Grovve%20Italian%20Set%204%20dic.mp3"
      },
      {
        title: "VOL 3",
        duration: "1:18:20",
        audioUrl: "https://radioamble-cdn.b-cdn.net/vimana/Vimana_Progect%20Rare%20groove%2012%20marz.%2026.mp3"
      },
      {
        title: "VOL 4",
        duration: "1:21:10",
        audioUrl: "https://radioamble-cdn.b-cdn.net/vimana/Rare%20Groove%20Vimana_Progect%2012%20febb%2026.mp3"
      }
    ];
  }
  if (playlistId === 10) {
    return [
      {
        title: "VOL 1",
        duration: "1:14:40",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggia%20imp.%20dj%20set%2010%20ott%2025.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:19:15",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggia%20impazzita%20S.%20Tirella%208%20gennaio%2026.mp3"
      },
      {
        title: "VOL 3",
        duration: "1:12:30",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggia%20Impazzita%20S.T%2012%20sett%2025.mp3"
      },
      {
        title: "VOL 4",
        duration: "1:21:05",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggiaimpazzita%20dj%20set%20S.T.%207%20febb%2026mp3.mp3"
      },
      {
        title: "VOL 5",
        duration: "1:26:50",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Steve%20Scheggia%20impazzita%2028%20agosto%2025%20.mp3"
      }
    ];
  }
  if (playlistId === 11) {
    return [
      {
        title: "VOL 1",
        duration: "1:18:20",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/City%20Soun%20prespective%20rufus%206%20marzo%2026.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:22:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/City%20Sound%20Prespective%20Rufus%20Quni%CC%80indi%20Records%2021%20nov%2025.mp3"
      },
      {
        title: "VOL 3",
        duration: "1:15:30",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Disco%20Spectrum%20A.A%202%20ott.%2025.mp3"
      },
      {
        title: "VOL 4",
        duration: "1:20:15",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20C.Sound%20Prespective%2022%20gen%2026.mp3"
      },
      {
        title: "VOL 5",
        duration: "1:24:50",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20City%20sound%20pr.%204%20sett%2025.mp3"
      }
    ];
  }
  return MOCK_SONGS;
}

