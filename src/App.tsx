import { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useParams, Navigate } from 'react-router';
import { Play, Pause, Heart, Share2, Menu as MenuIcon, Mic, ListMusic, Disc3, LogIn, LogOut, User as UserIcon, Home, ChevronLeft, ChevronRight, ArrowLeft, SkipBack, SkipForward, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from './lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { InfiniteCarousel } from './components/InfiniteCarousel';
import { ProfilePage } from './components/ProfilePage';
import { WebGLBackground } from './components/WebGLBackground';

export const MUSIC_PLAYLISTS = [
  {
    id: 12,
    title: 'Planet Funk',
    author: 'Planet Funk',
    seed: 112,
    tag: 'NUOVA PLAYLIST',
    subtitle: 'The Ultimate Selection',
    teaser: 'La potente ed elettronica discografia dei Planet Funk: una selezione travolgente ricca di hit storiche, influenze rock-dance e ritmi inconfondibili.',
    image: 'https://radioamble-cdn.b-cdn.net/Planet%20Funk/immagini/aff70516-692b-4b0a-8282-b0a12a42f270~1%20(2).jpg'
  },
  {
    id: 11,
    title: 'Stiv Tirella Selection',
    author: 'Stiv Tirella',
    seed: 111,
    tag: 'NUOVA PLAYLIST',
    subtitle: 'La selezione di Stiv',
    teaser: 'Una raffinata e trascinante selezione musicale a cura di Stiv Tirella con sonorità speciali e groove profondi.',
    image: 'https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20foto%203%20(1).jpg'
  }
];

export const PODCAST_ITEMS = [
  {
    id: 5,
    title: 'Scheggia Impazzita',
    author: 'Stiv Tirella',
    image: 'https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20T%20foto%201%20(1).jpg',
    seed: 205,
    tag: 'PODCAST ESCLUSIVO',
    subtitle: 'Di Stiv Tirella',
    teaser: 'L\'energia irriverente e imprevedibile di Scheggia Impazzita, formato podcast firmato Stiv Tirella con ospiti d\'eccezione.'
  },
  {
    id: 6,
    title: 'Il segreto del naso di Rioba',
    author: 'Vichi de Marchi',
    image: 'https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/images%20(8).jpeg',
    seed: 206,
    tag: 'LIBRERIA BRAC / EMONS',
    subtitle: 'Letture d\'Autore',
    teaser: 'Una ragazza, una cesta di pane, un quaderno rosso, a due passi dalla Liberazione. Venezia, gennaio 1945. Emma fa la garzona al forno del sior Bepi. Nonostante l’ansia per la presenza dei tedeschi nelle strade, il suo lavoro le piace: i giri di consegne, l’odore del pane, la vicinanza di Elio. Da qualche tempo, però, le persone intorno a lei hanno troppi segreti: cosa c’è nel quaderno rosso che suo fratello le chiede di nascondere sotto la statua del sior Rioba in campo dei Mori? Chi è lo studente col vocabolario, amico di Elio? E perché un giorno Venezia si risveglia dipinta di rosso?'
  },
  {
    id: 7,
    title: 'Anche il diavolo si stanca',
    author: 'A.',
    image: 'https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/images%20(9).jpeg',
    seed: 207,
    tag: 'LIBRERIA BRAC / EMONS',
    subtitle: 'Letture d\'Autore',
    teaser: 'L\'amicizia esilarante e poetica tra una zia e una nipote. Incuriosita dalla storia della Sella del Diavolo, il promontorio che domina il golfo di Cagliari, Efi non riesce a smettere di pensare al povero diavolo sconfitto da un’orda di angeli. Così decide di andare a cercarlo per conoscere la sua versione. C’è solo una persona tanto folle da acconsentire ad accompagnerarla: la zia Flu, che studia i fenicotteri e ha due oche a guardia del giardino. La gita offrirà a zia e nipote l’occasione di vivere un’avventura indimenticabile, tra cielo e mare, dove tutto diventa possibile.'
  }
];

export const DJSET_ITEMS = [
  { 
    id: 2, 
    title: 'Alex Neri', 
    author: 'Alex Neri', 
    image: 'https://radioamble-cdn.b-cdn.net/Alex%20Neri%20dj/images%20(12).jpeg',
    seed: 302,
    tag: 'SELEZIONE CLUB',
    subtitle: 'DJ Set Selecta',
    teaser: 'Groove esclusivi ed house d\'eccezione firmata Alex Neri: sessioni registrate live appositamente per Radio Amblè.'
  },
  { 
    id: 1, 
    title: 'Accademia italiana dj A.i.D.', 
    author: 'Radio Amblè', 
    image: 'https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./immagini%20e%20video%20ai%20per%20AID/images%20(7)%20-%20Modificata%20(1).png',
    seed: 301,
    tag: 'MIX ESCLUSIVO',
    subtitle: 'I talenti del domani',
    teaser: 'I migliori allievi e docenti della scuola A.i.D. firmano una selezione elettronica tagliente e imprevedibile.'
  },
  { 
    id: 3, 
    title: 'Biga', 
    author: 'Biga', 
    image: 'https://radioamble-cdn.b-cdn.net/Biga/Biga_press_ottobre126%20(1)%20(1).webp',
    seed: 303,
    tag: 'SELEZIONE VINILICA',
    subtitle: 'Deep Sounds from the Vault',
    teaser: 'Una selezione ricercata di rarità funk, soul, hip-hop ed elettronica d\'annata, mixata sapientemente dall\'eclettico DJ Biga.'
  },
  { 
    id: 4, 
    title: 'Collettivo Co.lore', 
    author: 'Collettivo Co.lore', 
    image: 'https://radioamble-cdn.b-cdn.net/Collettivo%20colore/Screenshot%202026-06-06%2021.56.02.png',
    seed: 304,
    tag: 'EXPLORATION',
    subtitle: 'Co.LORE Gisela',
    teaser: 'Atmosfere profonde e sound design curato dal Collettivo Co.lore.'
  },
  { 
    id: 5, 
    title: 'FKV', 
    author: 'FKV', 
    image: 'https://radioamble-cdn.b-cdn.net/FKV/FKV_PRESSKIT_2024%20(1)%20(2).jpg',
    seed: 305,
    tag: 'SELEZIONE DEEP',
    subtitle: 'FKV Selection',
    teaser: 'Selezione ricercata e accattivante firmata FKV, con groove trascinanti e sonorità avvolgenti.'
  },
  { 
    id: 6, 
    title: 'GGDEX GENTLE WAVES', 
    author: 'GGDEX GENTLE WAVES', 
    image: 'https://radioamble-cdn.b-cdn.net/GGDEX%20GENTLE%20WAVES/Bio%20Foto/Photo-01%20(1).jpg',
    seed: 306,
    tag: 'GENTLE WAVES',
    subtitle: 'Ambient & Deep Selection',
    teaser: 'Onde sonore, ritmi avvolgenti e paesaggi sonori rilassanti curati da GGDEX per Radio Amblè.'
  },
  { 
    id: 7, 
    title: 'HZHA DISCHI SOFFICI', 
    author: 'HZHA DISCHI SOFFICI', 
    image: 'https://radioamble-cdn.b-cdn.net/HZHA%20DISCHI%20SOFFICI/Foto%20e%20Bio/37c45c4f-2352-43dc-8b1f-d9060b996dc5%20(1).jpeg',
    seed: 307,
    tag: 'DISCHI SOFFICI',
    subtitle: 'Mellow & Soft Grooves',
    teaser: 'Un viaggio imperdibile tra dischi soffici e sonorità calde selezionate con cura per Radio Amblè.'
  },
  { 
    id: 8, 
    title: 'Mistiche Vibre', 
    author: 'Mistiche Vibre', 
    image: 'https://radioamble-cdn.b-cdn.net/Mistiche%20Vibre/Mistiche%20Vibre.jpeg',
    seed: 308,
    tag: 'MISTICA',
    subtitle: 'Vibrazioni Mistiche',
    teaser: 'Atmosfere magiche e suoni avvolgenti selezionati da Mistiche Vibre per un viaggio sensoriale indimenticabile.'
  },
  { 
    id: 9, 
    title: 'Vimana', 
    author: 'Vimana', 
    image: 'https://radioamble-cdn.b-cdn.net/vimana/Screenshot%202025-12-05%2010.35.23.png',
    seed: 309,
    tag: 'RARE GROOVE',
    subtitle: 'Vimana Project Selection',
    teaser: 'Rarità groove, selezioni funk calde, sonorità italiane e ritmi rari scelti da Vimana Project.'
  },
  { 
    id: 10, 
    title: 'Stiv Tirella', 
    author: 'Stiv Tirella', 
    image: 'https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20T%20foto%201%20(1).jpg',
    seed: 310,
    tag: 'SCHEGGIA IMPAZZITA',
    subtitle: 'Scheggia Impazzita',
    teaser: 'Energia allo stato puro e selezioni eccentriche firmate Stiv Tirella con il suo celebre format Scheggia Impazzita.'
  },
  { 
    id: 11, 
    title: 'Rufus', 
    author: 'Rufus', 
    image: 'https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/immagini/397df7675bb90715880609056aad5814.jpg',
    seed: 311,
    tag: 'CITY SOUND PERSPECTIVE',
    subtitle: 'City Sound Perspective',
    teaser: 'Un elegante viaggio sonoro metropolitano tra groove raffinati, funk, disco e sonorità ricercate selezionate da Rufus.'
  }
];

export type Song = {
  title: string;
  duration: string;
  audio: string;
  background?: string;
};

export const MOCK_SONGS: Song[] = [
  { title: "Come Together", duration: "4:19", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Something", duration: "3:02", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { title: "Maxwell's Silver Hammer", duration: "3:27", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Oh! Darling", duration: "3:26", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { title: "Octopus's Garden", duration: "2:50", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { title: "I Want You (She's So Heavy)", duration: "7:47", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { title: "Here Comes The Sun", duration: "3:05", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { title: "Because", duration: "2:45", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
];

export function getDjSetSongs(playlistId: number): Song[] {
  if (playlistId === 1) {
    return [
      { 
        title: "millers e alez garcia", 
        duration: "5:32", 
        audio: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%232%20%20Millers%20Galez%20Garcia.mp3" 
      },
      {
        title: "Emanuele Orsini Giorgia Marziano",
        duration: "4:45",
        audio: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%233%20Emanuele%20Orsini%20Giorgia%20Marziano.mp3"
      },
      {
        title: "marzo Alex Meu e Xandra",
        duration: "5:12",
        audio: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%234%2025%20marzo%20Alex%20Meu%20e%20Xandra.mp3"
      },
      {
        title: "Kressi e Galez Garcia",
        duration: "6:18",
        audio: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%235%20Kressi%20e%20Galez%20Garcia.mp3"
      },
      {
        title: "Vika Meelis e Hroven",
        duration: "5:50",
        audio: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%236%20Vika%20Meelis%20e%20Hroven.mp3"
      },
      {
        title: "Daniela Ferrari e Galez Garcia",
        duration: "5:05",
        audio: "https://radioamble-cdn.b-cdn.net/Accademia%20italiana%20dj%20A.i.D./AiD%20%237%20Daniela%20Ferrari%20e%20Galez%20Garcia.mp3"
      }
    ];
  }
  if (playlistId === 2) {
    return [
      {
        title: "ALEX NERI E MOUNTH WATER",
        duration: "1:14:27",
        audio: "https://radioamble-cdn.b-cdn.net/Alex%20Neri%20dj/Set/ALEX%20NERI%20E%20MOUNTH%20WATER%20RADIO%20AMBLE%2027%20LUGLIO%202022.mp3"
      },
      {
        title: "ALEX NERI E MENNIE",
        duration: "1:18:40",
        audio: "https://radioamble-cdn.b-cdn.net/Alex%20Neri%20dj/Set/ALEX%20NERI%20E%20MENNIE%20RADIO%20AMBLE%2031%20AGOSTO%202022.mp3"
      },
      {
        title: "ALEX NERI",
        duration: "1:24:10",
        audio: "https://radioamble-cdn.b-cdn.net/Alex%20Neri%20dj/Set/alex%20neri.mp3"
      }
    ];
  }
  if (playlistId === 3) {
    return [
      {
        title: "DEEP SOUND FROM THE VAULT VOL 1",
        duration: "1:12:45",
        audio: "https://radioamble-cdn.b-cdn.net/Biga/DJ%20set/Biga%20deep%20soundm%20from%20the%20vault%2013%20mar.%2026.mp3"
      },
      {
        title: "DEEP SOUND FROM THE VAULT VOL 2",
        duration: "1:15:20",
        audio: "https://radioamble-cdn.b-cdn.net/Biga/DJ%20set/Biga%2011%20dic%20Deep%20sounds%20from%20the%20valut.mp3"
      }
    ];
  }
  if (playlistId === 4) {
    return [
      {
        title: "Co.LORE Gisela",
        duration: "1:02:15",
        audio: "https://radioamble-cdn.b-cdn.net/Collettivo%20colore/Co.LORE%20Gisela%2026%20marzo%2026.mp3"
      },
      {
        title: "Co.lore Collettivo Loredana Olivia_B & Santamama",
        duration: "1:18:45",
        audio: "https://radioamble-cdn.b-cdn.net/Collettivo%20colore/Colore%20%20Collettivo%20Loredana%20%20Olivia_B%20%26%20Santamama.mp3"
      }
    ];
  }
  if (playlistId === 5) {
    return [
      {
        title: "FKV VOL 1",
        duration: "1:15:45",
        audio: "https://radioamble-cdn.b-cdn.net/FKV/FKV-%2016%20ottobre%2025.mp3"
      }
    ];
  }
  if (playlistId === 6) {
    return [
      {
        title: "VOL 1",
        duration: "1:32:40",
        audio: "https://radioamble-cdn.b-cdn.net/GGDEX%20GENTLE%20WAVES/GGDEX%20Gentle%20waves%205%20febb%2026.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:24:15",
        audio: "https://radioamble-cdn.b-cdn.net/GGDEX%20GENTLE%20WAVES/GGDEX%20GENTLE%20WAVES%206%20NOV%2025%20mp3.mp3"
      }
    ];
  }
  if (playlistId === 7) {
    return [
      {
        title: "VOL 1",
        duration: "1:20:15",
        audio: "https://radioamble-cdn.b-cdn.net/HZHA%20DISCHI%20SOFFICI/HZHA%20Dischi%20soffici%2027%20nov%2025%20T.GHIVING.mp3"
      }
    ];
  }
  if (playlistId === 8) {
    return [
      {
        title: "VOL 1",
        duration: "1:22:10",
        audio: "https://radioamble-cdn.b-cdn.net/Mistiche%20Vibre/Mistiche%20Vibre%20e%20Aris%20SKR%2018%20aprile%2026.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:18:35",
        audio: "https://radioamble-cdn.b-cdn.net/Mistiche%20Vibre/Mistike%20Vibes%20ospite%20DonSurf%2022%20gennaio.mp3"
      }
    ];
  }
  if (playlistId === 9) {
    return [
      {
        title: "VOL 1",
        duration: "1:15:30",
        audio: "https://radioamble-cdn.b-cdn.net/vimana/Vimana%20Progect%20Rare%20Groove%20%209%20lug.%2025.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:22:45",
        audio: "https://radioamble-cdn.b-cdn.net/vimana/Vimana%20Rare%20Grovve%20Italian%20Set%204%20dic.mp3"
      },
      {
        title: "VOL 3",
        duration: "1:18:20",
        audio: "https://radioamble-cdn.b-cdn.net/vimana/Vimana_Progect%20Rare%20groove%2012%20marz.%2026.mp3"
      },
      {
        title: "VOL 4",
        duration: "1:21:10",
        audio: "https://radioamble-cdn.b-cdn.net/vimana/Rare%20Groove%20Vimana_Progect%2012%20febb%2026.mp3"
      }
    ];
  }
  if (playlistId === 10) {
    return [
      {
        title: "VOL 1",
        duration: "1:14:40",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggia%20imp.%20dj%20set%2010%20ott%2025.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:19:15",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggia%20impazzita%20S.%20Tirella%208%20gennaio%2026.mp3"
      },
      {
        title: "VOL 3",
        duration: "1:12:30",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggia%20Impazzita%20S.T%2012%20sett%2025.mp3"
      },
      {
        title: "VOL 4",
        duration: "1:21:05",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggiaimpazzita%20dj%20set%20S.T.%207%20febb%2026mp3.mp3"
      },
      {
        title: "VOL 5",
        duration: "1:26:50",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Steve%20Scheggia%20impazzita%2028%20agosto%2025%20.mp3"
      }
    ];
  }
  if (playlistId === 11) {
    return [
      {
        title: "VOL 1",
        duration: "1:18:20",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/City%20Soun%20prespective%20rufus%206%20marzo%2026.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:22:45",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/City%20Sound%20Prespective%20Rufus%20Quni%CC%80indi%20Records%2021%20nov%2025.mp3"
      },
      {
        title: "VOL 3",
        duration: "1:15:30",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Disco%20Spectrum%20A.A%202%20ott.%2025.mp3"
      },
      {
        title: "VOL 4",
        duration: "1:20:15",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20C.Sound%20Prespective%2022%20gen%2026.mp3"
      },
      {
        title: "VOL 5",
        duration: "1:24:50",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20City%20sound%20pr.%204%20sett%2025.mp3"
      }
    ];
  }
  return MOCK_SONGS;
}

export function getPodcastSongs(playlistId: number): Song[] {
  if (playlistId === 5) {
    return [
      {
        title: "Nikky di Radio deejay",
        duration: "1:05:20",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/12%20NIKKI%20scheggia%20(1)%20(1).mp3",
        background: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/91bc11e7-db11-4db1-b21c-ef21d662aec3.png"
      },
      {
        title: "intervista a faso",
        duration: "58:45",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/FASO%20SCHEGGIA%201.mp3",
        background: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/01f3de8a-2a62-42a6-beef-afeeb4e0b0c9.png"
      },
      {
        title: "intervista a marlen",
        duration: "1:02:15",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/MARLEN%20SCHEGGIA%20.mp3",
        background: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/13aaa0b2-3262-4326-99c2-319c3ecb3944%20(2).png"
      }
    ];
  }
  if (playlistId === 6) {
    return [
      {
        title: "Il segreto del naso di Rioba",
        duration: "30:25",
        audio: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/Brac%20Emons%20Vichi%20se%20Marchi%20Il%20segreto%20del%20naso%20di%20Rioba%2030%20sett%2025.mp3",
        background: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/images%20(8).jpeg"
      }
    ];
  }
  if (playlistId === 7) {
    return [
      {
        title: "Anche il diavolo si stanca",
        duration: "23:45",
        audio: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/Brac%20Emons%20A.%2023%20settembre%20Anche%20il%20diavolo%20si%20stanca%20p.p.wav",
        background: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/images%20(9).jpeg"
      }
    ];
  }
  return MOCK_SONGS;
}

export function getPlaylistSongs(playlistId: number): Song[] {
  if (playlistId === 11) {
    return [
      {
        title: "Another Day",
        duration: "3:39",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Another%20Day%20_%20Bukshot%20Lefonque.mp3"
      },
      {
        title: "The Bravest Man (Remix)",
        duration: "4:12",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Bobby%20Womack%20_%20The%20Bravest%20Man%20Remix.mp3"
      },
      {
        title: "Bubble Jet",
        duration: "5:04",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Bubble%20Jet%20_%20Emotionelectric.mp3"
      },
      {
        title: "So Far To Go",
        duration: "5:12",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Common%20_%20%20So%20Far%20To%20Go.mp3"
      },
      {
        title: "Easy",
        duration: "5:52",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Groove%20Armada%20_%20Easy.mp3"
      },
      {
        title: "El Pollero Loco",
        duration: "4:28",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Koel%20Willer%20_%20El%20Pollero%20Loco%20.mp3"
      },
      {
        title: "This Is SKA",
        duration: "3:41",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Longsy%20D%20_%20This%20Is%20SKA.mp3"
      },
      {
        title: "Hold Up",
        duration: "4:03",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Louis%20Chedid%20_%20Hold%20Up.mp3"
      },
      {
        title: "Transylfornia",
        duration: "4:47",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Nikki%20_%20Transylfornia.mp3"
      },
      {
        title: "Perfidia",
        duration: "3:20",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Phyllis%20Dillon%20_%20Perfidia.mp3"
      },
      {
        title: "Bloodstream",
        duration: "5:07",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Stateless%20_%20Bloodstream%20.mp3"
      }
    ];
  }
  if (playlistId === 12) {
    return [
      {
        title: "It's Your Time",
        duration: "3:58",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/01%20It's%20Your%20Time.mp3"
      },
      {
        title: "Welcome to Planet Funk",
        duration: "7:04",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/01%20Welcome%20to%20Planet%20Funk.mp3"
      },
      {
        title: "Where Is the Max",
        duration: "4:40",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/01%20where%20is%20the%20max.mp3"
      },
      {
        title: "Chase the Sun",
        duration: "3:40",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/02%20chase%20the%20sun.mp3"
      },
      {
        title: "Magic Number",
        duration: "3:52",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/02%20Magic%20Number.mp3"
      },
      {
        title: "All Man's Land",
        duration: "5:32",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/03%20all%20mans%20land.mp3"
      },
      {
        title: "Swallow",
        duration: "5:10",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/03%20Swallow.mp3"
      },
      {
        title: "In The Beginning",
        duration: "4:32",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/04%20In%20The%20Beginning.mp3"
      },
      {
        title: "The Switch",
        duration: "3:41",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/04%20the%20switch.mp3"
      },
      {
        title: "If We Try",
        duration: "4:12",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/05%20If%20We%20Tray.mp3"
      },
      {
        title: "Inside All the People",
        duration: "4:57",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/05%20inside%20all%20the%20people.mp3"
      },
      {
        title: "Static",
        duration: "4:24",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/06%20Static.mp3"
      },
      {
        title: "Under the Rain",
        duration: "6:11",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/06%20under%20the%20rain.mp3"
      },
      {
        title: "Paraffin",
        duration: "4:30",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/07%20paraffin.mp3"
      },
      {
        title: "We Turn",
        duration: "4:45",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/07%20We%20Turn.mp3"
      },
      {
        title: "Piano Piano",
        duration: "3:15",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/08%20piano%20piano.mp3"
      },
      {
        title: "Running Through My Head",
        duration: "4:43",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/08%20Running%20Through%20My%20Head.mp3"
      },
      {
        title: "Tears",
        duration: "3:48",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/09%20Tears.mp3"
      },
      {
        title: "Tightrope Artist",
        duration: "3:45",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/09%20tightrope%20artist.mp3"
      }
    ];
  }
  return MOCK_SONGS;
}

export const HOMEPAGE_BACKGROUNDS = [
  "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1302.jpg",
  "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A0466.jpg",
  "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1066.jpg",
  "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1321.jpg",
  "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1781.jpg",
  "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1814.jpg",
  "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A2168.jpg",
  "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A2047.jpg"
];

export const RANDOM_BACKGROUNDS = [
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/Uplifting%20life%20lessons%20for%20people%20who%20love%20practical%20beauty%20today%20for%20simple%20inner%20peace%20%F0%9F%95%8A%EF%B8%8F.jpg",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/7%20Fresh%20easy%20dinner%20recipe%20ideas%20that%20are%20worth%20saving%20if%20you%20love%20elegant%20details%20and%20creative%20inspiration%20for%20anyone%20planning%20a%20beautiful%20refresh.jpg",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/Discover%20Creative%20tiny%20apartment%20decor%20that%20make%20your%20next%20project%20look%20polished%20and%20expensive%20for%20ideas%20worth%20saving%20right%20now.jpg",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/Impressive%20Productivity%20Hacks%20That%20Never%20Go%20Out%20of%20Style.jpg",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/Get%20inspired%20by%20Unique%20side%20hustle%20ideas%20that%20are%20trending%20right%20now%20across%20Pinterest%20boards%20for%20ideas%20worth%20saving%20right%20now.jpg",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/85%20Genius%20Family%20Dinner%20Ideas.mp4",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/Cozy%20meal%20prep%20inspiration%20for%20busy%20days%20that%20feel%20fresh%20and%20shareable%20to%20save%20for%20later%20%F0%9F%93%8C.mp4",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/DIY%20Gift%20Ideas%20Inspiration%20for%20Back-to-School%2099196.mp4",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/Elegant%20Printable%20Wall%20Art%20Ideas%20Worth%20Trying.mp4",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/Explore%20Timeless%20healthy%20breakfast%20recipes%20that%20make%20your%20next%20project%20look%20polished%20and%20expensive%20for%20your%20next%20Pinterest%20save.mp4",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/Pin%20these%2013%2520Unique%2520curly%2520hair%2520care%2520ideas%2520that%2520are%2520perfect%2520when%2520you%2520want%2520something%2520stylish%2520modern%2520and%2520easy%2520to%2520copy%2520for%2520anyone%2520planning%2520a%2520beautiful.mp4",
  "https://radioamble-cdn.b-cdn.net/immagini%20e%20video%20random/Pin%20these%20beautiful%20pet%20routine%20ideas%20that%20feel%20luxe%20without%2520spending%2520a%2520fortune%2520for%2520a%2520stylish%2520result%2520that%2520still%2520feels%2520effortless%2520%E2%80%94%2520save%2520these%2520ideas%2520(1).mp4"
];

export function getRandomBackground(): string {
  const randomIdx = Math.floor(Math.random() * RANDOM_BACKGROUNDS.length);
  return RANDOM_BACKGROUNDS[randomIdx].replace(/ /g, "%20");
}

const LongArrowLeft = ({ size = 24, strokeWidth = 1.5, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size * 1.6} 
    height={size} 
    viewBox="0 0 38 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M36 12H4" />
    <path d="M11 5L4 12l7 7" />
  </svg>
);

const FlamingoLogo = ({ className = "h-5 w-auto text-white", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Headphone Band */}
    <path
      d="M38 34 A14 14 0 0 1 62 34"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
    />
    
    {/* Headphones Ear-pads */}
    <rect x="34" y="30" width="5" height="12" rx="2.5" fill="currentColor" stroke="none" />
    <rect x="61" y="30" width="5" height="12" rx="2.5" fill="currentColor" stroke="none" />
    <circle cx="36.5" cy="36" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="63.5" cy="36" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />

    {/* Elegant Flamingo head and beak */}
    <path
      d="M49 32 C43 32 40 37 40 43 C40 47 37 53 37 57 C37 60 38 61 39.5 58 C41 55 45 53 47 50 C49 47 50 43 50 43 Z"
      fill="currentColor"
      stroke="none"
    />

    {/* Elegant S-Neck */}
    <path
      d="M48 43 C52 43 55 49 53 58 C51 68 44 74 46 84"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
    />

    {/* Beautiful teardrop wing/body */}
    <path
      d="M46 84 C56 84 69 88 69 98 C69 109 56 113 46 113 C36 113 32 104 32 98 C32 88 36 84 46 84 Z"
      fill="currentColor"
      stroke="none"
    />

    {/* Slender legs */}
    <line x1="43" y1="112" x2="43" y2="152" stroke="currentColor" strokeWidth="2.5" />
    <line x1="47" y1="112" x2="47" y2="152" stroke="currentColor" strokeWidth="2.5" />

    {/* Minimal feet */}
    <line x1="39" y1="152" x2="43" y2="152" stroke="currentColor" strokeWidth="2.5" />
    <line x1="47" y1="152" x2="51" y2="152" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

function PlaylistView() {
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-display text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Playlist
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Selezioni curate di canzoni iconiche, colonne sonore leggendarie ed esperimenti sonori d'autore.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Bento grid / cards of playlists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 md:pb-12">
          {MUSIC_PLAYLISTS.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => navigate('/playlist/' + playlist.id)}
              className="glass-panel group relative overflow-hidden flex flex-col sm:flex-row gap-5 p-5 border border-white/5 bg-[#121212]/40 rounded-2xl md:rounded-[24px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#ff2e55]/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity duration-500 cursor-pointer hover:border-white/20"
            >
              {/* Image thumb (Apple Music grid collage style for playlists) */}
              <div className="relative w-full sm:w-40 aspect-[1.3] sm:aspect-square rounded-xl overflow-hidden bg-[#181818] shrink-0 border border-white/5">
                {playlist.image ? (
                  <img src={playlist.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 group-hover:scale-105 transition-transform duration-500 ease-out">
                    <img src={`https://picsum.photos/seed/${playlist.seed}a/200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <img src={`https://picsum.photos/seed/${playlist.seed}b/200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <img src={`https://picsum.photos/seed/${playlist.seed}c/200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <img src={`https://picsum.photos/seed/${playlist.seed}d/200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              {/* Info text */}
              <div className="flex flex-col flex-1 justify-between text-left py-1">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[8px] md:text-[9px] font-semibold tracking-wider text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-2.5 py-0.5 rounded-full">
                      {playlist.tag || 'CONSIGLIATO'}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-white/40 font-mono">
                      {playlist.subtitle || 'Playlist d\'autore'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display tracking-wider uppercase group-hover:text-white/90 transition-colors">
                    {playlist.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 font-sans">
                    Di {playlist.author}
                  </p>
                  <p className="text-xs text-white/70 mt-2 font-sans leading-relaxed line-clamp-3 antialiased">
                    {playlist.teaser}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[10px] text-[#ff2e55] font-display tracking-widest uppercase gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Ascolta ora</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}

function PodcastView() {
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-display text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Podcast
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Puntate speciali, interviste esclusive e approfondimenti culturali on-demand su Radio Amblè.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Bento grid / cards of podcasts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 md:pb-12">
          {PODCAST_ITEMS.map((podcast) => (
            <div
              key={podcast.id}
              onClick={() => navigate('/podcast/' + podcast.id)}
              className="glass-panel group relative overflow-hidden flex flex-col sm:flex-row gap-5 p-5 border border-white/5 bg-[#121212]/40 rounded-2xl md:rounded-[24px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#ff2e55]/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity duration-500 cursor-pointer hover:border-white/20"
            >
              {/* Image thumb */}
              <div className="relative w-full sm:w-40 aspect-[1.3] sm:aspect-square rounded-xl overflow-hidden bg-[#181818] shrink-0 border border-white/5">
                <img
                  src={podcast.image || `https://picsum.photos/seed/${podcast.seed}/600`}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info text */}
              <div className="flex flex-col flex-1 justify-between text-left py-1">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[8px] md:text-[9px] font-semibold tracking-wider text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-2.5 py-0.5 rounded-full">
                      {podcast.tag || 'PODCAST'}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-white/40 font-mono">
                      {podcast.subtitle || 'Audio On-Demand'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display tracking-wider uppercase group-hover:text-white/90 transition-colors">
                    {podcast.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 font-sans">
                    Di {podcast.author}
                  </p>
                  <p className="text-xs text-white/70 mt-2 font-sans leading-relaxed line-clamp-3 antialiased">
                    {podcast.teaser}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[10px] text-[#ff2e55] font-display tracking-widest uppercase gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Ascolta ora</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}

function DjSetView() {
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-display text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Dj Set
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Registrazioni esclusive, mix set ed eccezionali performance curate dai migliori DJ internazionali e locali.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Bento grid / cards of dj sets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 md:pb-12">
          {DJSET_ITEMS.map((djset) => (
            <div
              key={djset.id}
              onClick={() => navigate('/djset/' + djset.id)}
              className="glass-panel group relative overflow-hidden flex flex-col sm:flex-row gap-5 p-5 border border-white/5 bg-[#121212]/40 rounded-2xl md:rounded-[24px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#ff2e55]/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity duration-500 cursor-pointer hover:border-white/20"
            >
              {/* Image thumb */}
              <div className="relative w-full sm:w-40 aspect-[1.3] sm:aspect-square rounded-xl overflow-hidden bg-[#181818] shrink-0 border border-white/5">
                <img
                  src={djset.image || `https://picsum.photos/seed/${djset.seed}/600`}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info text */}
              <div className="flex flex-col flex-1 justify-between text-left py-1">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[8px] md:text-[9px] font-semibold tracking-wider text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-2.5 py-0.5 rounded-full">
                      {djset.tag || 'MIXSET'}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-white/40 font-mono">
                      {djset.subtitle || 'Dj Set Esclusivo'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display tracking-wider uppercase group-hover:text-white/90 transition-colors">
                    {djset.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 font-sans">
                    Di {djset.author}
                  </p>
                  <p className="text-xs text-white/70 mt-2 font-sans leading-relaxed line-clamp-3 antialiased">
                    {djset.teaser}
                  </p>
                </div>
                <div className="mt-4 flex items-center text-[10px] text-[#ff2e55] font-display tracking-widest uppercase gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Ascolta ora</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}

export const PROGRAMMI_ITEMS = [
  {
    id: 1,
    title: 'Scheggia Impazzita',
    author: 'Stiv Tirella',
    time: 'Ogni Lunedì • 18:00 - 19:30',
    type: 'podcast',
    targetId: 5,
    tag: 'PODCAST ESCLUSIVO',
    teaser: "L'energia irriverente e imprevedibile del talk show di Stiv Tirella con interviste sorprendenti a ospiti speciali.",
    image: 'https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20T%20foto%201%20(1).jpg',
  },
  {
    id: 5,
    title: 'Musik & Talk',
    author: 'Francesco Farfa, Ricky le Roy & guests',
    time: 'Mensile • Esclusivo',
    type: 'musiktalk',
    targetId: null,
    tag: 'TALK & DJSET',
    teaser: "Interviste intime, storie indimenticabili ed eccezionali selezioni musicali con i padri fondatori e i protagonisti della scena clubbing.",
    image: 'https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(5).jpg',
  }
];

export const MUSIK_TALK_EPISODES = [
  {
    id: 1,
    title: "Music&Talk - Francesco Farfa",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Copia%20di%20francesco%20farfa%20(14).jpg",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%231%20Francesco%20Farfa%20.mp3",
    duration: "1:15:30",
    author: "Francesco Farfa",
    tag: "PUNTATA 1",
  },
  {
    id: 2,
    title: "Music&Talk - Ricky le Roy & Luca Pechino",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(9).jpg",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%231%20Francesco%20Farfa%20.mp3",
    duration: "1:22:15",
    author: "Ricky le Roy & Luca Pechino",
    tag: "PUNTATA 2",
  },
  {
    id: 3,
    title: "Music&Talk - Slowaxx",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Copia%20di%20francesco%20farfa%20(15).jpg",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%231%20Francesco%20Farfa%20.mp3",
    duration: "1:08:45",
    author: "Slowaxx",
    tag: "PUNTATA 3",
  },
  {
    id: 4,
    title: "Music&Talk - Thomas T.",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Copia%20di%20francesco%20farfa%20(17).jpg",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%235%20Thomas%20T.%20pres.%20Ottanio.mp3",
    duration: "1:18:12",
    author: "Thomas T.",
    tag: "PUNTATA 4",
  },
  {
    id: 5,
    title: "Music&Talk - Alex Neri",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(10).jpg",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%232%20Alex%20Neri%20.mp3",
    duration: "1:24:50",
    author: "Alex Neri",
    tag: "PUNTATA 5",
  },
  {
    id: 6,
    title: "Music&Talk - Albi Scotti",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(8).jpg",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%236%20Albi%20Scotti.mp3",
    duration: "1:20:15",
    author: "Albi Scotti",
    tag: "PUNTATA 6",
  }
];

function ProgrammiView() {
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-display text-[24px] sm:text-[28px] text-white tracking-widest uppercase">
            Programmi
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Il palinsesto e i programmi esclusivi in onda e on-demand su Radio Amblè.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Bento grid / cards of programs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24 md:pb-12">
          {PROGRAMMI_ITEMS.map((prog) => (
            <div
              key={prog.id}
              onClick={() => {
                if (prog.type === 'musiktalk') {
                  navigate('/programmi/musik-talk');
                } else if (prog.type === 'podcast' && prog.targetId) {
                  navigate(`/podcast/${prog.targetId}`);
                } else if (prog.type === 'djset' && prog.targetId) {
                  navigate(`/djset/${prog.targetId}`);
                }
              }}
              className={`glass-panel group relative overflow-hidden flex flex-col sm:flex-row gap-5 p-5 border border-white/5 bg-[#121212]/40 rounded-2xl md:rounded-[24px] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#ff2e55]/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity duration-500 cursor-pointer ${prog.targetId || prog.type === 'musiktalk' ? 'hover:border-white/20' : 'cursor-default'}`}
            >
              {/* Image thumb */}
              <div className="relative w-full sm:w-40 aspect-[1.3] sm:aspect-square rounded-xl overflow-hidden bg-[#181818] shrink-0 border border-white/5">
                <img
                  src={prog.image}
                  alt=""
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out ${prog.type === 'musiktalk' ? 'object-top' : ''}`}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Info text */}
              <div className="flex flex-col flex-1 justify-between text-left py-1">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[8px] md:text-[9px] font-semibold tracking-wider text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-2.5 py-0.5 rounded-full">
                      {prog.tag}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-white/40 font-mono">
                      {prog.time}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display tracking-wider uppercase group-hover:text-white/90 transition-colors">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-white/50 mt-1 font-sans">
                    Di {prog.author}
                  </p>
                  <p className="text-xs text-white/70 mt-2 font-sans leading-relaxed line-clamp-3 antialiased">
                    {prog.teaser}
                  </p>
                </div>
                {(prog.targetId || prog.type === 'musiktalk') && (
                  <div className="mt-4 flex items-center text-[10px] text-[#ff2e55] font-display tracking-widest uppercase gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Vedi programmazione</span>
                    <ChevronRight size={12} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.main>
  );
}

function MusikTalkView({ isPlaying, togglePlay, currentTrackUrl, userLikes, toggleLike }: any) {
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Immersive static background without the video */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {/* Subtle ambient red/dark radial aura */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(220, 38, 38, 0.15) 0%, rgba(0, 0, 0, 0) 70%)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-black/75 pointer-events-none"></div>
      </div>

      {/* Main Content (Scrollable overlay container) */}
      <div className="absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 pt-32 md:pt-40">
        <div className="w-full max-w-[1600px] mx-auto pb-24">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold tracking-wider text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-3 py-1 rounded-full">
                ESCLUSIVA RADIO AMBLÈ
              </span>
            </div>
            


            <p className="font-sans text-xs md:text-sm text-white/70 mt-2 max-w-2xl leading-relaxed">
              Puntate storiche, interviste intime ed eccitanti selezioni musicali firmate Francesco Farfa, Ricky le Roy & ospiti speciali.
            </p>
          </div>

          {/* List of custom Episode Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MUSIK_TALK_EPISODES.map((ep) => {
              const isCurrent = currentTrackUrl === ep.audio;
              const isCurrentPlaying = isCurrent && isPlaying;
              const likeId = `musiktalk_ep:${ep.id}`;
              const isLiked = userLikes?.includes(likeId) || false;

              return (
                <div
                  key={ep.id}
                  onClick={() => navigate(`/programmi/musik-talk/${ep.id}`)}
                  className={`glass-panel group relative overflow-hidden flex flex-col sm:flex-row gap-5 p-5 border transition-all duration-300 cursor-pointer ${isCurrent ? 'border-white/25 bg-white/[0.04]' : 'border-white/5 bg-[#121212]/40 hover:border-white/20'}`}
                >
                  {/* Image Thumb with play overlay */}
                  <div className="relative w-full sm:w-36 aspect-[1.3] sm:aspect-square rounded-xl overflow-hidden bg-[#181818] shrink-0 border border-white/5 shadow-md">
                    <img
                      src={ep.image}
                      alt=""
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                      referrerPolicy="no-referrer"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                        {isCurrentPlaying ? (
                          <Pause size={20} className="fill-black text-black" />
                        ) : (
                          <Play size={20} className="ml-1 fill-black text-black" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info and controls */}
                  <div className="flex flex-col flex-1 justify-between text-left py-1">
                    <div>
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <span className="text-[9px] font-semibold tracking-wider text-white/50 uppercase font-display bg-white/5 px-2.5 py-0.5 rounded-full">
                          {ep.tag}
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">
                          {ep.duration}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white font-display tracking-wider uppercase group-hover:text-[#ff2e55]/95 transition-colors line-clamp-2">
                        {ep.title}
                      </h3>
                      <p className="text-xs text-white/50 mt-1 font-sans">
                        Di {ep.author}
                      </p>
                    </div>

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                      {/* Direct play state indicator */}
                      <span className="flex items-center gap-2 text-xs font-display tracking-widest uppercase transition-colors text-white/70 hover:text-white">
                        {isCurrentPlaying ? (
                          <>
                            <span className="flex items-end gap-[2px] h-3 w-4">
                              <span className="w-[2px] bg-[#ff2e55] rounded-full animate-soundwave-1" />
                              <span className="w-[2px] bg-[#ff2e55] rounded-full animate-soundwave-2" />
                              <span className="w-[2px] bg-[#ff2e55] rounded-full animate-soundwave-3" />
                            </span>
                            <span className="text-[#ff2e55] normal-case">Ora in riproduzione</span>
                          </>
                        ) : (
                          <>
                            <Play size={12} className="fill-current" />
                            <span>Ascolta ora</span>
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-1">
                        {/* Like button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(likeId);
                          }}
                          className={`p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer ${isLiked ? 'text-[#ff2e55]' : 'text-white/60 hover:text-white'}`}
                        >
                          <Heart size={16} className={isLiked ? "fill-current" : ""} />
                        </button>

                        {/* Share button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                              navigator.share({ title: ep.title, url: window.location.href })
                                .catch(err => {
                                  if (err.name !== 'AbortError') console.error("Share failed", err);
                                });
                            }
                          }}
                          className="p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-white/60 hover:text-white"
                        >
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function SingleMusikTalkEpisodeView({ isPlaying, togglePlay, userLikes, toggleLike, currentTrackUrl }: any) {
  const { episodeId } = useParams();
  const navigate = useNavigate();

  const epIndex = MUSIK_TALK_EPISODES.findIndex(ep => ep.id === Number(episodeId));
  const ep = MUSIK_TALK_EPISODES[epIndex];

  if (!ep) return null;

  const bgUrl = ep.image;
  const itemId = `musiktalk_ep:${ep.id}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === ep.audio;

  // Background videos pool
  const videosPool = [
    "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_d4aa45e7-83be-4318-b00a-3684afdd7624_generated_video.MP4",
    "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_ed66afeb-20ab-4bf2-8ad6-016d76d9fdfe_generated_video.MP4",
    "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_b85bbea7-d3d7-4d23-8397-cc797d40db6d_generated_video.MP4"
  ];

  // Randomly select one video on load/mount
  const [randomVideoUrl] = useState(() => {
    const randomIdx = Math.floor(Math.random() * videosPool.length);
    return videosPool[randomIdx];
  });

  const goToPrev = () => {
    if (epIndex > 0) {
      navigate(`/programmi/musik-talk/${MUSIK_TALK_EPISODES[epIndex - 1].id}`, { replace: true });
    }
  };

  const goToNext = () => {
    if (epIndex < MUSIK_TALK_EPISODES.length - 1) {
      navigate(`/programmi/musik-talk/${MUSIK_TALK_EPISODES[epIndex + 1].id}`, { replace: true });
    }
  };

  useEffect(() => {
    if (currentTrackUrl !== ep.audio || !isPlaying) {
      if (currentTrackUrl !== ep.audio) {
        togglePlay(ep.audio);
      } else if (!isPlaying) {
        togglePlay(ep.audio);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ep.audio]);

  return (
    <motion.main
      className="relative z-30 w-full h-full"
    >
      {/* Immersive background video */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <video
          src={randomVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Color tone blend overlays matching Scheggia style */}
        <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end items-center z-10 w-full max-w-[500px] mb-[100px] md:mb-[40px] px-6 mx-auto pointer-events-auto">
        <PlayerTicker 
          text="TELA Collection · German Aerospace-Grade Polycarbonate · Lifetime Warranty · Free Return · 100 Days Try Me Out · Lego Concept — Replace. Recycle. Personalise. · Spacious & Washable Interior · Wide Handle — More Space. More Control. · Canvas Texture · Serial Number — Identity. · Free Shipping · Help Us Close the Loop · Pre-Order 30% Off — Code LOVE30 · Aesthetics & Integrity Over Exclusivity · A New Chapter Is About to Begin" 
          duration={55}
          href="https://www.phoenix-voyage.com/"
          ctaText="WWW.PHOENIX-VOYAGE.COM"
        />
        <div className="w-full px-6 py-6 flex flex-col items-center text-center shrink-0 bg-transparent">
          
          {/* Custom partnership text */}
          <span className="text-[9px] tracking-wider text-white/40 font-sans mt-1">sponsored by</span>

          {/* Custom logo - highly visible, same as home page */}
          <a
            href="https://www.phoenix-voyage.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[-23px] mb-[-17px] sm:mt-[-39px] sm:mb-[-33px] flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
            title="Visita phoenix-voyage.com"
          >
            <img 
              src="https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/Screenshot_2026-06-15_16.13.47-removebg-preview.png" 
              alt="Musik & Talk Logo" 
              className="h-[95px] sm:h-[130px] w-auto object-contain select-none pointer-events-none invert"
              style={{ filter: 'invert(1)' }}
              referrerPolicy="no-referrer"
            />
          </a>

          <p className="font-sans text-[10px] sm:text-[12px] tracking-[0.15em] text-white/70 uppercase mt-0 mb-4">
            Music & Talk • {ep.author}
          </p>

          <div className="flex items-center justify-between w-full max-w-[320px]">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(itemId);
              }}
              className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${isLiked ? 'text-[#ff2e55]' : 'text-white/80'}`}
              aria-label="Like"
            >
              <Heart size={22} strokeWidth={isLiked ? 2.5 : 1} className={isLiked ? "fill-current" : ""} />
            </button>

            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={goToPrev}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${epIndex === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={epIndex === 0}
              >
                <SkipBack size={24} strokeWidth={2} />
              </button>

              <button 
                onClick={() => togglePlay(ep.audio)}
                className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform mx-2 ${trackIsPlaying ? 'play-pulse' : ''}`}
                aria-label={trackIsPlaying ? "Pause" : "Play"}
              >
                {trackIsPlaying ? (
                  <Pause size={28} strokeWidth={2} className="fill-black" />
                ) : (
                  <Play size={28} strokeWidth={2} className="ml-1 fill-black" />
                )}
              </button>

              <button 
                onClick={goToNext}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${epIndex === MUSIK_TALK_EPISODES.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={epIndex === MUSIK_TALK_EPISODES.length - 1}
              >
                <SkipForward size={24} strokeWidth={2} />
              </button>
            </div>

            <button 
              className="p-2 text-white/80 transition-transform hover:scale-110 flex items-center justify-center"
              aria-label="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: ep.title, url: window.location.href })
                    .catch(e => {
                      if (e.name !== 'AbortError') console.error("Share failed", e);
                    });
                }
              }}
            >
              <Share2 size={22} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function SinglePodcastEpisodeView({ isPlaying, togglePlay, userLikes, toggleLike, currentTrackUrl }: any) {
  const { id, songIndex } = useParams();
  const navigate = useNavigate();
  
  const playlist = PODCAST_ITEMS.find(p => p.id === Number(id));
  const sIndex = Number(songIndex);
  const songsList = getPodcastSongs(Number(id));
  const song = songsList[sIndex];
  
  const [fallbackBg] = useState(() => playlist?.image || getRandomBackground());
  const bgUrl = song?.background || fallbackBg;

  if (!playlist || !song) return null;

  const itemId = `podcast_episode:${playlist.id}:${songIndex}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === song.audio;
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  const goToPrev = () => {
    if (sIndex > 0) navigate(`/podcast/${playlist.id}/song/${sIndex - 1}`, { replace: true });
  };

  const goToNext = () => {
    if (sIndex < songsList.length - 1) navigate(`/podcast/${playlist.id}/song/${sIndex + 1}`, { replace: true });
  };

  useEffect(() => {
    if (currentTrackUrl !== song.audio || !isPlaying) {
      if (currentTrackUrl !== song.audio) {
        togglePlay(song.audio);
      } else if (!isPlaying) {
        togglePlay(song.audio);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.audio]);

  return (
    <motion.main
      className="relative z-30 w-full h-full"
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
          />
        ) : (
          <img 
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
            alt=""
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end items-center z-10 w-full max-w-[500px] mb-[100px] md:mb-[40px] px-6 mx-auto pointer-events-auto">
        <PlayerTicker />
        <div className="w-full px-6 py-6 flex flex-col items-center text-center shrink-0 bg-transparent">
          <h2 className="font-display text-[20px] sm:text-[24px] text-white tracking-widest leading-none">
            {song.title}
          </h2>
          <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/70 uppercase mt-2 mb-5">
            {playlist.title} • {playlist.author}
          </p>

          <div className="flex items-center justify-between w-full max-w-[320px]">
            <button 
              onClick={() => toggleLike(itemId)}
              className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${isLiked ? 'text-white' : 'text-white/80'}`}
              aria-label="Like"
            >
              <Heart size={22} strokeWidth={isLiked ? 2.5 : 1} className={isLiked ? "fill-white" : ""} />
            </button>

            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={goToPrev}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${sIndex === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={sIndex === 0}
              >
                <SkipBack size={24} strokeWidth={2} />
              </button>

              <button 
                onClick={() => togglePlay(song.audio)}
                className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform mx-2 ${trackIsPlaying ? 'play-pulse' : ''}`}
                aria-label={trackIsPlaying ? "Pause" : "Play"}
              >
                {trackIsPlaying ? (
                  <Pause size={28} strokeWidth={2} className="fill-black" />
                ) : (
                  <Play size={28} strokeWidth={2} className="ml-1 fill-black" />
                )}
              </button>

              <button 
                onClick={goToNext}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${sIndex === songsList.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={sIndex === songsList.length - 1}
              >
                <SkipForward size={24} strokeWidth={2} />
              </button>
            </div>

            <button 
              className="p-2 text-white/80 transition-transform hover:scale-110 flex items-center justify-center"
              aria-label="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `${song.title} - ${playlist.title}`, url: window.location.href })
                    .catch(e => {
                      if (e.name !== 'AbortError') console.error("Share failed", e);
                    });
                }
              }}
            >
              <Share2 size={22} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function SinglePodcastView({ isPlaying, togglePlay, currentTrackUrl, userLikes, toggleLike }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const playlist = PODCAST_ITEMS.find(p => p.id === Number(id));
  const songsList = getPodcastSongs(Number(id));
  const [bgUrl] = useState(() => songsList[0]?.background || playlist?.image || getRandomBackground());

  if (!playlist) return null;

  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  // Specific layout for Scheggia Impazzita (id === 5) and Brac/Emons (id === 6, 7) matching MusikTalkView
  if (Number(id) === 5 || Number(id) === 6 || Number(id) === 7) {
    return (
      <motion.main
        className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a] overflow-hidden"
      >
        {/* Immersive background cover image */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
          <img 
            className="absolute inset-0 w-full h-full object-cover"
            src={playlist.image}
            alt=""
            referrerPolicy="no-referrer"
          />
          {/* Color tone blend overlays matching Scheggia style */}
          <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-black/75 pointer-events-none"></div>
        </div>

        {/* Main Content (Scrollable overlay container) */}
        <div className="absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 pt-32 md:pt-40">
          <div className="w-full max-w-[1600px] mx-auto pb-24">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="text-[10px] font-semibold tracking-wider text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-3 py-1 rounded-full">
                  PODCAST ESCLUSIVO
                </span>
              </div>
              <h1 className="font-display text-[26px] sm:text-[36px] md:text-[44px] text-white tracking-widest uppercase mt-3 font-bold">
                {playlist.title}
              </h1>
              <p className="font-sans text-xs md:text-sm text-white/70 mt-2 max-w-2xl leading-relaxed">
                {playlist.teaser || "L'energia irriverente e imprevedibile di Scheggia Impazzita, formato podcast firmato Stiv Tirella con ospiti d'eccezione."}
              </p>
            </div>

            {/* List of custom Episode Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {songsList.map((song, i) => {
                const isCurrent = currentTrackUrl === song.audio;
                const isCurrentPlaying = isCurrent && isPlaying;
                const likeId = `podcast_episode:${playlist.id}:${i}`;
                const isLiked = userLikes?.includes(likeId) || false;

                return (
                  <div
                    key={i}
                    onClick={() => navigate(`/podcast/${playlist.id}/song/${i}`)}
                    className={`glass-panel group relative overflow-hidden flex flex-col sm:flex-row gap-5 p-5 border transition-all duration-300 cursor-pointer ${isCurrent ? 'border-white/25 bg-white/[0.04]' : 'border-white/5 bg-[#121212]/40 hover:border-white/20'}`}
                  >
                    {/* Image Thumb with play overlay */}
                    <div className="relative w-full sm:w-36 aspect-[1.3] sm:aspect-square rounded-xl overflow-hidden bg-[#181818] shrink-0 border border-white/5 shadow-md">
                      <img
                        src={song.background || playlist.image}
                        alt=""
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                          {isCurrentPlaying ? (
                            <Pause size={20} className="fill-black text-black" />
                          ) : (
                            <Play size={20} className="ml-1 fill-black text-black" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Info and controls */}
                    <div className="flex flex-col flex-1 justify-between text-left py-1">
                      <div>
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <span className="text-[9px] font-semibold tracking-wider text-white/50 uppercase font-display bg-white/5 px-2.5 py-0.5 rounded-full">
                            PUNTATA {i + 1}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">
                            {song.duration}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white font-display tracking-wider uppercase group-hover:text-[#ff2e55]/95 transition-colors line-clamp-2">
                          {song.title}
                        </h3>
                        <p className="text-xs text-white/50 mt-1 font-sans">
                          Di {playlist.author}
                        </p>
                      </div>

                      {/* Actions Bar */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        {/* Direct play state indicator */}
                        <span className="flex items-center gap-2 text-xs font-display tracking-widest uppercase transition-colors text-white/70 hover:text-white">
                          {isCurrentPlaying ? (
                            <>
                              <span className="flex items-end gap-[2px] h-3 w-4">
                                <span className="w-[2px] bg-[#ff2e55] rounded-full animate-soundwave-1" />
                                <span className="w-[2px] bg-[#ff2e55] rounded-full animate-soundwave-2" />
                                <span className="w-[2px] bg-[#ff2e55] rounded-full animate-soundwave-3" />
                              </span>
                              <span className="text-[#ff2e55] normal-case">Ora in riproduzione</span>
                            </>
                          ) : (
                            <>
                              <Play size={12} className="fill-current" />
                              <span>Ascolta ora</span>
                            </>
                          )}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Like button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(likeId);
                            }}
                            className={`p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer ${isLiked ? 'text-[#ff2e55]' : 'text-white/60 hover:text-white'}`}
                          >
                            <Heart size={16} className={isLiked ? "fill-current" : ""} />
                          </button>

                          {/* Share button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (navigator.share) {
                                navigator.share({ title: song.title, url: window.location.href })
                                  .catch(err => {
                                    if (err.name !== 'AbortError') console.error("Share failed", err);
                                  });
                              }
                            }}
                            className="p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer text-white/60 hover:text-white"
                          >
                            <Share2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.main>
    );
  }

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
          />
        ) : (
          <img 
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
            alt=""
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/75 pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 pt-32 md:pt-40">
        <div className="w-full max-w-[800px] mx-auto pb-24 md:pb-10 flex flex-col gap-10">
          <div className="w-full flex flex-col items-center">
            <p className="font-sans text-[10px] tracking-widest text-white/50 uppercase mb-3 text-center">Podcast</p>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white text-center tracking-wide mb-2">{playlist.title}</h2>
            <p className="font-sans text-sm text-white/60 text-center mb-6">Di {playlist.author}</p>

            <button 
              onClick={() => togglePlay(songsList[0]?.audio)}
              className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] ${isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? 'play-pulse' : ''}`}
              aria-label={isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? "Pause" : "Play"}
            >
              {isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? ( <Pause size={28} strokeWidth={2} className="fill-black" /> ) : ( <Play size={28} strokeWidth={2} className="ml-1 fill-black" /> )}
            </button>
          </div>

          <div className="w-full flex flex-col mt-4">
            <div className="flex items-center gap-4 text-white/50 text-xs tracking-widest uppercase mb-4 px-4">
              <span className="w-6 text-center">#</span>
              <span className="flex-1">Titolo</span>
              <span className="text-right">Tempo</span>
            </div>

            <div className="flex flex-col gap-1">
              {songsList.map((song, i) => {
                const isCurrent = currentTrackUrl === song.audio;
                const isCurrentPlaying = isCurrent && isPlaying;
                return (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/podcast/${playlist.id}/song/${i}`)} 
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all group cursor-pointer ${isCurrent ? 'bg-white/15 text-white font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]' : 'hover:bg-white/10 text-white/90'}`}
                  >
                    <span className="w-6 text-center text-sm flex justify-center items-center">
                      {isCurrentPlaying ? (
                        <>
                          <span className="flex items-end justify-center gap-[2px] h-3.5 w-4 group-hover:hidden">
                            <span className="w-[2px] bg-white rounded-full animate-soundwave-1" />
                            <span className="w-[2px] bg-white rounded-full animate-soundwave-2" />
                            <span className="w-[2px] bg-white rounded-full animate-soundwave-3" />
                          </span>
                          <span className="hidden group-hover:flex justify-center text-white">
                            <Pause size={14} className="fill-white" />
                          </span>
                        </>
                      ) : isCurrent ? (
                        <>
                          <span className="flex items-end justify-center gap-[2px] h-3.5 w-4 group-hover:hidden">
                            <span className="w-[2px] bg-white/70 rounded-full h-1" />
                            <span className="w-[2px] bg-white/70 rounded-full h-1" />
                            <span className="w-[2px] bg-white/70 rounded-full h-1" />
                          </span>
                          <span className="hidden group-hover:flex justify-center text-white">
                            <Play size={14} className="fill-white" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-white/50 group-hover:hidden">{i + 1}</span>
                          <span className="hidden group-hover:flex justify-center text-white">
                            <Play size={14} className="fill-white" />
                          </span>
                        </>
                      )}
                    </span>
                    <span className="flex-1 font-sans text-sm">{song.title}</span>
                    <span className="text-right font-sans text-white/50 text-sm">{song.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function SingleDjSetTrackView({ isPlaying, togglePlay, userLikes, toggleLike, currentTrackUrl }: any) {
  const { id, songIndex } = useParams();
  const navigate = useNavigate();
  const playlist = DJSET_ITEMS.find(p => p.id === Number(id));
  const [bgUrl] = useState(() => playlist?.image || getRandomBackground());
  
  const sIndex = Number(songIndex);
  const songsList = getDjSetSongs(Number(id));
  const song = songsList[sIndex];

  if (!playlist || !song) return null;

  const itemId = `djset_track:${playlist.id}:${songIndex}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === song.audio;
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  const goToPrev = () => {
    if (sIndex > 0) navigate(`/djset/${playlist.id}/song/${sIndex - 1}`, { replace: true });
  };

  const goToNext = () => {
    if (sIndex < songsList.length - 1) navigate(`/djset/${playlist.id}/song/${sIndex + 1}`, { replace: true });
  };

  useEffect(() => {
    if (currentTrackUrl !== song.audio || !isPlaying) {
      if (currentTrackUrl !== song.audio) {
        togglePlay(song.audio);
      } else if (!isPlaying) {
        togglePlay(song.audio);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.audio]);

  return (
    <motion.main
      className="relative z-30 w-full h-full"
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
          />
        ) : (
          <img 
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
            alt=""
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end items-center z-10 w-full max-w-[500px] mb-[100px] md:mb-[40px] px-6 mx-auto pointer-events-auto">
        <PlayerTicker />
        <div className="w-full px-6 py-6 flex flex-col items-center text-center shrink-0 bg-transparent">
          <h2 className="font-display text-[20px] sm:text-[24px] text-white tracking-widest leading-none">
            {song.title}
          </h2>
          <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/70 uppercase mt-2 mb-5">
            {playlist.title} • {playlist.author}
          </p>

          <div className="flex items-center justify-between w-full max-w-[320px]">
            <button 
              onClick={() => toggleLike(itemId)}
              className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${isLiked ? 'text-white' : 'text-white/80'}`}
              aria-label="Like"
            >
              <Heart size={22} strokeWidth={isLiked ? 2.5 : 1} className={isLiked ? "fill-white" : ""} />
            </button>

            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={goToPrev}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${sIndex === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={sIndex === 0}
              >
                <SkipBack size={24} strokeWidth={2} />
              </button>

              <button 
                onClick={() => togglePlay(song.audio)}
                className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform mx-2 ${trackIsPlaying ? 'play-pulse' : ''}`}
                aria-label={trackIsPlaying ? "Pause" : "Play"}
              >
                {trackIsPlaying ? (
                  <Pause size={28} strokeWidth={2} className="fill-black" />
                ) : (
                  <Play size={28} strokeWidth={2} className="ml-1 fill-black" />
                )}
              </button>

              <button 
                onClick={goToNext}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${sIndex === songsList.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={sIndex === songsList.length - 1}
              >
                <SkipForward size={24} strokeWidth={2} />
              </button>
            </div>

            <button 
              className="p-2 text-white/80 transition-transform hover:scale-110 flex items-center justify-center"
              aria-label="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `${song.title} - ${playlist.title}`, url: window.location.href })
                    .catch(e => {
                      if (e.name !== 'AbortError') console.error("Share failed", e);
                    });
                }
              }}
            >
              <Share2 size={22} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function SingleDjSetView({ isPlaying, togglePlay, currentTrackUrl }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const playlist = DJSET_ITEMS.find(p => p.id === Number(id));
  const [bgUrl] = useState(() => playlist?.image || getRandomBackground());

  if (!playlist) return null;

  const songsList = getDjSetSongs(playlist.id);
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
          />
        ) : (
          <img 
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
            alt=""
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/75 pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 pt-32 md:pt-40">
        <div className="w-full max-w-[800px] mx-auto pb-24 md:pb-10 flex flex-col gap-10">
          <div className="w-full flex flex-col items-center">
            <p className="font-sans text-[10px] tracking-widest text-white/50 uppercase mb-3 text-center">Dj Set</p>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white text-center tracking-wide mb-2">{playlist.title}</h2>
            <p className="font-sans text-sm text-white/60 text-center mb-6">Di {playlist.author}</p>

            <button 
              onClick={() => togglePlay(songsList[0]?.audio)}
              className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] ${isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? 'play-pulse' : ''}`}
              aria-label={isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? "Pause" : "Play"}
            >
              {isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? ( <Pause size={28} strokeWidth={2} className="fill-black" /> ) : ( <Play size={28} strokeWidth={2} className="ml-1 fill-black" /> )}
            </button>
          </div>

          <div className="w-full flex flex-col mt-4">
            <div className="flex items-center gap-4 text-white/50 text-xs tracking-widest uppercase mb-4 px-4">
              <span className="w-6 text-center">#</span>
              <span className="flex-1">Titolo</span>
              <span className="text-right">Tempo</span>
            </div>

            <div className="flex flex-col gap-1">
              {songsList.map((song, i) => {
                const isCurrent = currentTrackUrl === song.audio;
                const isCurrentPlaying = isCurrent && isPlaying;
                return (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/djset/${playlist.id}/song/${i}`)} 
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all group cursor-pointer ${isCurrent ? 'bg-white/15 text-white font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]' : 'hover:bg-white/10 text-white/90'}`}
                  >
                    <span className="w-6 text-center text-sm flex justify-center items-center">
                      {isCurrentPlaying ? (
                        <>
                          <span className="flex items-end justify-center gap-[2px] h-3.5 w-4 group-hover:hidden">
                            <span className="w-[2px] bg-white rounded-full animate-soundwave-1" />
                            <span className="w-[2px] bg-white rounded-full animate-soundwave-2" />
                            <span className="w-[2px] bg-white rounded-full animate-soundwave-3" />
                          </span>
                          <span className="hidden group-hover:flex justify-center text-white">
                            <Pause size={14} className="fill-white" />
                          </span>
                        </>
                      ) : isCurrent ? (
                        <>
                          <span className="flex items-end justify-center gap-[2px] h-3.5 w-4 group-hover:hidden">
                            <span className="w-[2px] bg-white/70 rounded-full h-1" />
                            <span className="w-[2px] bg-white/70 rounded-full h-1" />
                            <span className="w-[2px] bg-white/70 rounded-full h-1" />
                          </span>
                          <span className="hidden group-hover:flex justify-center text-white">
                            <Play size={14} className="fill-white" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-white/50 group-hover:hidden">{i + 1}</span>
                          <span className="hidden group-hover:flex justify-center text-white">
                            <Play size={14} className="fill-white" />
                          </span>
                        </>
                      )}
                    </span>
                    <span className="flex-1 font-sans text-sm">{song.title}</span>
                    <span className="text-right font-sans text-white/50 text-sm">{song.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function SingleSongView({ isPlaying, togglePlay, userLikes, toggleLike, currentTrackUrl }: any) {
  const { id, songIndex } = useParams();
  const navigate = useNavigate();
  const playlist = MUSIC_PLAYLISTS.find(p => p.id === Number(id));
  const [bgUrl] = useState(() => playlist?.image || getRandomBackground());
  
  const sIndex = Number(songIndex);
  const songs = playlist ? getPlaylistSongs(playlist.id) : [];
  const song = songs[sIndex];

  if (!playlist || !song) return null;

  const itemId = `playlist_song:${playlist.id}:${songIndex}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === song.audio;
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  const goToPrev = () => {
    if (sIndex > 0) navigate(`/playlist/${playlist.id}/song/${sIndex - 1}`, { replace: true });
  };

  const goToNext = () => {
    if (sIndex < songs.length - 1) navigate(`/playlist/${playlist.id}/song/${sIndex + 1}`, { replace: true });
  };

  useEffect(() => {
    if (currentTrackUrl !== song.audio || !isPlaying) {
      if (currentTrackUrl !== song.audio) {
        togglePlay(song.audio);
      } else if (!isPlaying) {
        togglePlay(song.audio);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.audio]);

  return (
    <motion.main
      className="relative z-30 w-full h-full"
    >
      {/* Background (Specific to the single song) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
          />
        ) : (
          <img 
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
            alt=""
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
      </div>

      {/* The Player Box */}
      <div className="absolute inset-0 flex flex-col justify-end items-center z-10 w-full max-w-[500px] mb-[100px] md:mb-[40px] px-6 mx-auto pointer-events-auto">
        <PlayerTicker />
        <div className="w-full px-6 py-6 flex flex-col items-center text-center shrink-0 bg-transparent">
          
          <h2 className="font-display text-[20px] sm:text-[24px] text-white tracking-widest leading-none">
            {song.title}
          </h2>
          
          <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/70 uppercase mt-2 mb-5">
            {playlist.title} • {playlist.author}
          </p>

          <div className="flex items-center justify-between w-full max-w-[320px]">
            <button 
              onClick={() => toggleLike(itemId)}
              className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${isLiked ? 'text-white' : 'text-white/80'}`}
              aria-label="Like"
            >
              <Heart size={22} strokeWidth={isLiked ? 2.5 : 1} className={isLiked ? "fill-white" : ""} />
            </button>

            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={goToPrev}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${sIndex === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={sIndex === 0}
              >
                <SkipBack size={24} strokeWidth={2} />
              </button>

              <button 
                onClick={() => togglePlay(song.audio)}
                className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform mx-2 ${trackIsPlaying ? 'play-pulse' : ''}`}
                aria-label={trackIsPlaying ? "Pause" : "Play"}
              >
                {trackIsPlaying ? (
                  <Pause size={28} strokeWidth={2} className="fill-black" />
                ) : (
                  <Play size={28} strokeWidth={2} className="ml-1 fill-black" />
                )}
              </button>

              <button 
                onClick={goToNext}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${sIndex === songs.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={sIndex === songs.length - 1}
              >
                <SkipForward size={24} strokeWidth={2} />
              </button>
            </div>

            <button 
              className="p-2 text-white/80 transition-transform hover:scale-110 flex items-center justify-center"
              aria-label="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `${song.title} - ${playlist.title}`, url: window.location.href })
                    .catch(e => {
                      if (e.name !== 'AbortError') console.error("Share failed", e);
                    });
                }
              }}
            >
              <Share2 size={22} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function SinglePlaylistView({ isPlaying, togglePlay, currentTrackUrl }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const playlist = MUSIC_PLAYLISTS.find(p => p.id === Number(id));
  const [bgUrl] = useState(() => playlist?.image || getRandomBackground());

  if (!playlist) return null;

  const songs = getPlaylistSongs(playlist.id);
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a] overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
          />
        ) : (
          <img 
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
            alt=""
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/75 pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 pt-32 md:pt-40">
        <div className="w-full max-w-[800px] mx-auto pb-24 md:pb-10 flex flex-col gap-10">
          
          {/* Top: Artwork & Player */}
          <div className="w-full flex flex-col items-center">
            <p className="font-sans text-[10px] tracking-widest text-white/50 uppercase mb-3 text-center">Playlist</p>
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white text-center tracking-wide mb-2">{playlist.title}</h2>
            <p className="font-sans text-sm text-white/60 text-center mb-6">Curata da {playlist.author}</p>

            <button 
              onClick={() => togglePlay(songs[0]?.audio)}
              className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] ${isPlaying && songs.some(s => s.audio === currentTrackUrl) ? 'play-pulse' : ''}`}
              aria-label={isPlaying && songs.some(s => s.audio === currentTrackUrl) ? "Pause" : "Play"}
            >
              {isPlaying && songs.some(s => s.audio === currentTrackUrl) ? ( <Pause size={28} strokeWidth={2} className="fill-black" /> ) : ( <Play size={28} strokeWidth={2} className="ml-1 fill-black" /> )}
            </button>
          </div>

          {/* Bottom: Tracklist */}
          <div className="w-full flex flex-col mt-4">
            <div className="flex items-center gap-4 text-white/50 text-xs tracking-widest uppercase mb-4 px-4">
              <span className="w-6 text-center">#</span>
              <span className="flex-1">Titolo</span>
              <span className="text-right">Tempo</span>
            </div>

            <div className="flex flex-col gap-1">
              {songs.map((song, i) => {
                const isCurrent = currentTrackUrl === song.audio;
                const isCurrentPlaying = isCurrent && isPlaying;
                return (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/playlist/${playlist.id}/song/${i}`)} 
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all group cursor-pointer ${isCurrent ? 'bg-white/15 text-white font-medium shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]' : 'hover:bg-white/10 text-white/90'}`}
                  >
                    <span className="w-6 text-center text-sm flex justify-center items-center">
                      {isCurrentPlaying ? (
                        <>
                          <span className="flex items-end justify-center gap-[2px] h-3.5 w-4 group-hover:hidden">
                            <span className="w-[2px] bg-white rounded-full animate-soundwave-1" />
                            <span className="w-[2px] bg-white rounded-full animate-soundwave-2" />
                            <span className="w-[2px] bg-white rounded-full animate-soundwave-3" />
                          </span>
                          <span className="hidden group-hover:flex justify-center text-white">
                            <Pause size={14} className="fill-white" />
                          </span>
                        </>
                      ) : isCurrent ? (
                        <>
                          <span className="flex items-end justify-center gap-[2px] h-3.5 w-4 group-hover:hidden">
                            <span className="w-[2px] bg-white/70 rounded-full h-1" />
                            <span className="w-[2px] bg-white/70 rounded-full h-1" />
                            <span className="w-[2px] bg-white/70 rounded-full h-1" />
                          </span>
                          <span className="hidden group-hover:flex justify-center text-white">
                            <Play size={14} className="fill-white" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-white/50 group-hover:hidden">{i + 1}</span>
                          <span className="hidden group-hover:flex justify-center text-white">
                            <Play size={14} className="fill-white" />
                          </span>
                        </>
                      )}
                    </span>
                    <span className="flex-1 font-sans text-sm">{song.title}</span>
                    <span className="text-right font-sans text-white/50 text-sm">{song.duration}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

function HomeView({ isPlaying, userLikes, togglePlay, toggleLike }: any) {
  const itemId = 'radio-amble-live';
  const isLiked = userLikes?.includes(itemId) || false;
  return (
    <motion.main
      className="relative z-10 w-full max-w-[500px] h-full flex flex-col justify-between pt-24 pb-[96px] md:pb-[32px] px-6 overflow-hidden"
    >
      <div className="flex-1 flex flex-col justify-end">
        <PlayerTicker />
        <div 
          className="glass-panel animated-gradient-border w-full px-6 py-4 sm:py-6 flex flex-col items-center text-center shrink-0 bg-[#0c0c0e]/45 backdrop-blur-md shadow-2xl"
        >
          {/* Custom partnership text */}
          <span className="text-[9px] tracking-wider text-white/40 font-sans mt-1 mb-2">sponsored by</span>

          <a
            href="https://disclaimerofficial.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[-15px] mb-[-12px] sm:mt-[-30px] sm:mb-[-25px] flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
            title="Visita disclaimerofficial.com"
          >
            <img 
              src="https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/Screenshot_2026-06-15_11.39.16-removebg-preview.png" 
              alt="Disclaimer Logo" 
              className="h-[75px] sm:h-[110px] md:h-[130px] w-auto object-contain select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </a>
          
          <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/70 uppercase mt-1 mb-4">
            radio amblè live
          </p>

          <div className="flex items-center justify-between w-full max-w-[260px]">
            <button 
              onClick={() => toggleLike(itemId)}
              className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${isLiked ? 'text-white' : 'text-white/80'}`}
              aria-label="Like"
            >
              <Heart size={22} strokeWidth={isLiked ? 2.5 : 1} className={isLiked ? "fill-white" : ""} />
            </button>

            <button 
              onClick={togglePlay}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform ${isPlaying ? 'play-pulse' : ''}`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? ( 
                <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-black" strokeWidth={2} /> 
              ) : ( 
                <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-black" strokeWidth={2} /> 
              )}
            </button>

            <button 
              className="p-2 text-white/80 transition-transform hover:scale-110 flex items-center justify-center"
              aria-label="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Radio Amblè Live', url: window.location.href })
                    .catch(e => {
                      if (e.name !== 'AbortError') console.error("Share failed", e);
                    });
                }
              }}
            >
              <Share2 size={22} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

  function AppContent() {
  const { user, signIn, logOut } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [currentHomeBgIndex, setCurrentHomeBgIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Preload homepage backgrounds
  useEffect(() => {
    HOMEPAGE_BACKGROUNDS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const getDepth = (path: string) => path === '/' ? 0 : path.split('/').filter(Boolean).length;
  const prevPathRef = useRef(location.pathname);
  const directionRef = useRef(1);

  if (prevPathRef.current !== location.pathname) {
    const prevDepth = getDepth(prevPathRef.current);
    const currDepth = getDepth(location.pathname);
    directionRef.current = currDepth < prevDepth ? -1 : 1;
    prevPathRef.current = location.pathname;
  }
  
  const direction = directionRef.current;
  const isHome = location.pathname === '/';

  // Set up background slide timer when isHome is active
  useEffect(() => {
    if (!isHome) return;
    const interval = setInterval(() => {
      setCurrentHomeBgIndex((prev) => (prev + 1) % HOMEPAGE_BACKGROUNDS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isHome]);

  const streamUrl = "https://mqugxowc-lbmedia.radioca.st/stream";

  useEffect(() => {
    async function fetchUserLikes() {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            setUserLikes(data.likes || []);
          } else {
            setUserLikes([]);
          }
        } catch (err) {
          console.error("Failed to load user likes", err);
          setUserLikes([]);
        }
      } else {
        setUserLikes([]);
      }
    }
    fetchUserLikes();
  }, [user]);

  const togglePlay = (trackUrl: string = streamUrl) => {
    if (!audioRef.current) return;
    
    if (isPlaying && currentTrackUrl === trackUrl) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTrackUrl !== trackUrl) {
        if (trackUrl === streamUrl) {
          audioRef.current.src = `${trackUrl}?cb=${Date.now()}`;
        } else {
          audioRef.current.src = trackUrl;
        }
        setCurrentTrackUrl(trackUrl);
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(err => {
          if (err.name !== 'AbortError' && err.name !== 'NotSupportedError') {
            setIsPlaying(false);
          }
        });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleToggleLike = async (itemId: string) => {
    if (!user) {
      navigate('/profile');
      return;
    }
    
    const exists = userLikes.includes(itemId);
    let newLikes: string[];
    if (exists) {
      newLikes = userLikes.filter(id => id !== itemId);
    } else {
      newLikes = [...userLikes, itemId];
    }
    
    setUserLikes(newLikes);
    
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, { likes: newLikes });
    } catch (e) {
      console.error("Failed to update likes", e);
      setUserLikes(userLikes); // revert state
    }
  };

  const handleBack = () => {
    const path = location.pathname;
    
    if (path.includes('/song/')) {
      const parentPath = path.substring(0, path.indexOf('/song/'));
      navigate(parentPath);
    } else if (path.startsWith('/playlist/')) {
      navigate('/playlist');
    } else if (path.startsWith('/podcast/')) {
      navigate('/podcast');
    } else if (path.startsWith('/djset/')) {
      navigate('/djset');
    } else if (path === '/playlist' || path === '/podcast' || path === '/djset') {
      navigate('/');
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  const handleDragEnd = (e: any, info: any) => {
    // Only detect swipe on mobile
    if (window.innerWidth >= 768) return;

    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      setTimeout(() => {
        handleBack();
      }, 0);
    }
  };

  return (
    <div className={`h-screen h-[100dvh] w-full relative overflow-hidden flex flex-col items-center bg-[#0a0a0a]`}>
      
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {isHome ? (
          <div className="absolute inset-0 w-full h-full">
            <WebGLBackground 
              images={HOMEPAGE_BACKGROUNDS}
              currentIndex={currentHomeBgIndex}
            />
            {/* Color tone blend overlays matching Scheggia style */}
            <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute inset-0 bg-black/55 pointer-events-none font-display"></div>
          </div>
        ) : (
          <>
            {location.pathname !== '/programmi/musik-talk' && (
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
                src="https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4" 
              />
            )}
            <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
          </>
        )}
      </div>
      
      {/* Pages */}
      <AnimatePresence custom={direction}>
        <motion.div
          key={location.pathname.includes('/song/') ? location.pathname.substring(0, location.pathname.lastIndexOf('/song/')) + '/song' : location.pathname}
          custom={direction}
          variants={{
            initial: (dir) => ({
              x: dir > 0 ? "100%" : "-30%",
              zIndex: dir > 0 ? 10 : 0
            }),
            animate: {
              x: 0,
              zIndex: 10
            },
            exit: (dir) => ({
              x: dir > 0 ? "-30%" : "100%",
              zIndex: dir > 0 ? 0 : 10
            })
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          drag={window.innerWidth < 768 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <Routes location={location}>
            <Route path="/" element={
              <HomeView 
                isPlaying={isPlaying && (currentTrackUrl === streamUrl || currentTrackUrl === null)} 
                userLikes={userLikes} 
                togglePlay={() => togglePlay(streamUrl)} 
                toggleLike={handleToggleLike} 
              />
            } />
            <Route path="/playlist" element={<PlaylistView />} />
            <Route path="/playlist/:id" element={
              <SinglePlaylistView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/playlist/:id/song/:songIndex" element={
              <SingleSongView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/podcast" element={<PodcastView />} />
            <Route path="/podcast/:id" element={
              <SinglePodcastView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
              />
            } />
            <Route path="/podcast/:id/song/:songIndex" element={
              <SinglePodcastEpisodeView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/djset" element={<DjSetView />} />
            <Route path="/djset/:id" element={
              <SingleDjSetView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/djset/:id/song/:songIndex" element={
              <SingleDjSetTrackView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/programmi" element={<ProgrammiView />} />
            <Route path="/programmi/musik-talk" element={
              <MusikTalkView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
              />
            } />
            <Route path="/programmi/musik-talk/:id" element={
              <SingleMusikTalkEpisodeView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/profile" element={
              <ProfilePage 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
              />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Floating Header */}
      <header className="absolute top-8 left-0 right-0 z-40 w-full">
        <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 flex justify-between items-center h-12">
          {/* Left Column: Back button and/or Logo mark */}
          <div className="flex items-center gap-4 min-w-[200px] h-full">
            {!isHome && (
              <button 
                onClick={handleBack}
                className="p-2 -ml-2 text-white/80 hover:text-white hover:scale-105 transition-all flex items-center gap-2 font-space text-xs tracking-widest uppercase cursor-pointer bg-black/40 backdrop-blur-md rounded-full px-4 border border-white/10"
              >
                <ChevronLeft size={14} />
                <span>Indietro</span>
              </button>
            )}
            <span className="hidden md:inline text-white font-space tracking-[0.2em] font-black text-sm select-none">
              RADIO AMBLÈ
            </span>
          </div>

          {/* Center Column: Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center gap-6 h-full font-space text-[12px] font-bold tracking-widest uppercase text-white/80">
            <button 
              onClick={() => navigate('/')} 
              className={`hover:text-white transition-colors cursor-pointer ${location.pathname === '/' ? 'text-white font-black border-b border-white' : ''}`}
            >
              DIRETTA
            </button>
            <button 
              onClick={() => navigate('/playlist')} 
              className={`hover:text-white transition-colors cursor-pointer ${location.pathname.startsWith('/playlist') ? 'text-white font-black border-b border-white' : ''}`}
            >
              PLAYLIST
            </button>
            <button 
              onClick={() => navigate('/podcast')} 
              className={`hover:text-white transition-colors cursor-pointer ${location.pathname.startsWith('/podcast') ? 'text-white font-black border-b border-white' : ''}`}
            >
              PODCAST
            </button>
            <button 
              onClick={() => navigate('/djset')} 
              className={`hover:text-white transition-colors cursor-pointer ${location.pathname.startsWith('/djset') ? 'text-white font-black border-b border-white' : ''}`}
            >
              DJ SET
            </button>
            <button 
              onClick={() => navigate('/programmi')} 
              className={`hover:text-white transition-colors cursor-pointer ${location.pathname.startsWith('/programmi') ? 'text-white font-black border-b border-white' : ''}`}
            >
              PROGRAMMI
            </button>
          </nav>

          {/* Center Column for Mobile: Mobile Brand/Logo */}
          <div className="flex md:hidden justify-center flex-1 max-w-[200px] h-full items-center">
            <span className="text-center text-white font-space tracking-[0.2em] font-black text-sm">
              RADIO AMBLÈ
            </span>
          </div>
          
          {/* Right Column: Profile or Login dynamic button */}
          <div className="flex items-center justify-end min-w-[200px] h-full">
            <button 
              onClick={() => navigate('/profile')}
              className={`hidden md:inline font-space text-[12px] font-bold tracking-widest uppercase hover:text-white transition-colors cursor-pointer ${location.pathname.startsWith('/profile') ? 'text-white font-black border-b border-white' : 'text-white/80'}`}
            >
              {user ? 'PROFILO' : 'LOGIN'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[440px] h-[64px] flex items-center justify-around px-2">
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname === '/' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <Radio size={18} className={location.pathname === '/' ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname === '/' ? 'text-white' : 'text-white/40'}`}>LIVE</span>
        </button>

        <button 
          onClick={() => navigate('/playlist')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/playlist') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <ListMusic size={18} className={location.pathname.startsWith('/playlist') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/playlist') ? 'text-white' : 'text-white/40'}`}>PLAYLIST</span>
        </button>

        <button 
          onClick={() => navigate('/podcast')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/podcast') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <Mic size={18} className={location.pathname.startsWith('/podcast') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/podcast') ? 'text-white' : 'text-white/40'}`}>PODCAST</span>
        </button>

        <button 
          onClick={() => navigate('/djset')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/djset') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <Disc3 size={18} className={location.pathname.startsWith('/djset') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/djset') ? 'text-white' : 'text-white/40'}`}>DJ SET</span>
        </button>

        <button 
          onClick={() => navigate('/programmi')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/programmi') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <Home size={18} className={location.pathname.startsWith('/programmi') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/programmi') ? 'text-white' : 'text-white/40'}`}>TALK</span>
        </button>

        <button 
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/profile') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <UserIcon size={18} className={location.pathname.startsWith('/profile') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/profile') ? 'text-white' : 'text-white/40'}`}>PROFILO</span>
        </button>
      </div>

      <audio 
        ref={audioRef} 
        preload="none" 
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          if (!audioRef.current?.src || audioRef.current?.src === window.location.href) return;
          setIsPlaying(false);
        }}
      ></audio>
    </div>
  );
}

const PlayerTicker = ({ 
  text, 
  duration = 45, 
  href = "https://disclaimerofficial.com/", 
  ctaText = "WWW.DISCLAIMEROFFICIAL.COM"
}: { 
  text?: string; 
  duration?: number; 
  href?: string; 
  ctaText?: string; 
}) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-full h-[36px] glass-panel overflow-hidden flex items-center shrink-0 mb-[11px] mt-auto border-y border-white/10 bg-white/5 cursor-pointer hover:border-white/20 transition-all hover:bg-white/10 group/ticker"
    title={`Visita ${href.replace("https://", "").replace("www.", "")}`}
  >
    <motion.div
      className="whitespace-nowrap inline-block text-[13px] sm:text-[15px] font-space font-black text-white tracking-wider uppercase pl-[100%] group-hover/ticker:text-cyan-400 transition-colors"
      initial={{ x: "0%" }}
      animate={{ x: "-100%" }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
    >
      {text ? (
        <>
          {text} &nbsp;&bull;&nbsp; VISITA IL SITO UFFICIALE: {ctaText} &nbsp;&bull;&nbsp; {text} &nbsp;&bull;&nbsp; VISITA IL SITO UFFICIALE: {ctaText}
        </>
      ) : (
        <>
          Creatività urbana, stile senza compromessi. Esprimi la tua identità con DISCLAIMER &nbsp;&bull;&nbsp; VISITA IL SITO: {ctaText} &nbsp;&bull;&nbsp; "Non chiedere il permesso di essere te stesso." &nbsp;&bull;&nbsp; Chi si veste DISCLAIMER non ha niente da spiegare. &nbsp;&bull;&nbsp; VISITA IL SITO: {ctaText}
        </>
      )}
    </motion.div>
  </a>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
