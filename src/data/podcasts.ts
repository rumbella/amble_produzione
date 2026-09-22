/**
 * CENSIMENTO DATI: podcasts.ts
 * 
 * 1. PODCAST_ITEMS (Array di 3 serie podcast):
 *    - ID 5: "Scheggia Impazzita" di Stiv Tirella - CDN image
 *    - ID 6: "Il segreto del naso di Rioba" di Vichi de Marchi (Libreria Brac / Emons) - CDN image
 *    - ID 7: "Anche il diavolo si stanca" di A. (Libreria Brac / Emons) - CDN image
 * 
 * 2. MUSIC_PLAYLISTS (Array di 2 playlist musicali):
 *    - ID 12: "Planet Funk" di Planet Funk - CDN image
 *    - ID 11: "Stiv Tirella Selection" di Stiv Tirella - CDN image
 * 
 * 3. getPodcastSongs(playlistId):
 *    - Restituisce le puntate/audio dei podcast per gli ID 5, 6, 7.
 * 
 * 4. getPlaylistSongs(playlistId):
 *    - Restituisce i brani delle playlist musicali per gli ID 11 e 12.
 */

import { Song, PodcastItem, PlaylistCategoryItem } from '../types';
import { MOCK_SONGS } from './djsets';
import { SAMPLE_SLIDESHOW_SPONSOR } from './sponsors';

export const PODCAST_ITEMS: PodcastItem[] = [
  {
    id: 5,
    title: 'Scheggia Impazzita',
    author: 'Stiv Tirella',
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20T%20foto%201%20(1).jpg',
    seed: 205,
    tag: 'PODCAST ESCLUSIVO',
    subtitle: 'Di Stiv Tirella',
    teaser: 'L\'energia irriverente e imprevedibile di Scheggia Impazzita, formato podcast firmato Stiv Tirella con ospiti d\'eccezione.',
    sponsor: SAMPLE_SLIDESHOW_SPONSOR
  },
  {
    id: 6,
    title: 'Il segreto del naso di Rioba',
    author: 'Vichi de Marchi',
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/images%20(8).jpeg',
    seed: 206,
    tag: 'LIBRERIA BRAC / EMONS',
    subtitle: 'Letture d\'Autore',
    teaser: 'Una ragazza, una cesta di pane, un quaderno rosso, a due passi dalla Liberazione. Venezia, gennaio 1945. Emma fa la garzona al forno del sior Bepi. Nonostante l’ansia per la presenza dei tedeschi nelle strade, il suo lavoro le piace: i giri di consegne, l’odore del pane, la vicinanza di Elio. Da qualche tempo, però, le persone intorno a lei hanno troppi segreti: cosa c’è nel quaderno rosso che suo fratello le chiede di nascondere sotto la statua del sior Rioba in campo dei Mori? Chi è lo studente col vocabolario, amico di Elio? E perché un giorno Venezia si risveglia dipinta di rosso?'
  },
  {
    id: 7,
    title: 'Anche il diavolo si stanca',
    author: 'A.',
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/images%20(9).jpeg',
    seed: 207,
    tag: 'LIBRERIA BRAC / EMONS',
    subtitle: 'Letture d\'Autore',
    teaser: 'L\'amicizia esilarante e poetica tra una zia e una nipote. Incuriosita dalla storia della Sella del Diavolo, il promontorio che domina il golfo di Cagliari, Efi non riesce a smettere di pensare al povero diavolo sconfitto da un’orda di angeli. Così decide di andare a cercarlo per conoscere la sua versione. C’è solo una persona tanto folle da acconsentire ad accompagnerarla: la zia Flu, che studia i fenicotteri e ha due oche a guardia del giardino. La gita offrirà a zia e nipote l’occasione di vivere un’avventura indimenticabile, tra cielo e mare, dove tutto diventa possibile.'
  }
];

export const MUSIC_PLAYLISTS: PlaylistCategoryItem[] = [
  {
    id: 12,
    title: 'Planet Funk',
    author: 'Planet Funk',
    seed: 112,
    tag: 'NUOVA PLAYLIST',
    subtitle: 'The Ultimate Selection',
    teaser: 'La potente ed elettronica discografia dei Planet Funk: una selezione travolgente ricca di hit storiche, influenze rock-dance e ritmi inconfondibili.',
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Planet%20Funk/immagini/aff70516-692b-4b0a-8282-b0a12a42f270~1%20(2).jpg'
  },
  {
    id: 11,
    title: 'Stiv Tirella Selection',
    author: 'Stiv Tirella',
    seed: 111,
    tag: 'NUOVA PLAYLIST',
    subtitle: 'La selezione di Stiv',
    teaser: 'Una raffinata e trascinante selezione musicale a cura di Stiv Tirella con sonorità speciali e groove profondi.',
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20foto%203%20(1).jpg'
  }
];

export function getPodcastSongs(playlistId: number): Song[] {
  if (playlistId === 5) {
    return [
      {
        title: "Nikky di Radio deejay",
        duration: "1:05:20",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/12%20NIKKI%20scheggia%20(1)%20(1).mp3",
        backgroundUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/91bc11e7-db11-4db1-b21c-ef21d662aec3.png"
      },
      {
        title: "intervista a faso",
        duration: "58:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/FASO%20SCHEGGIA%201.mp3",
        backgroundUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/01f3de8a-2a62-42a6-beef-afeeb4e0b0c9.png"
      },
      {
        title: "intervista a marlen",
        duration: "1:02:15",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/MARLEN%20SCHEGGIA%20.mp3",
        backgroundUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/13aaa0b2-3262-4326-99c2-319c3ecb3944%20(2).png"
      }
    ];
  }
  if (playlistId === 6) {
    return [
      {
        title: "Il segreto del naso di Rioba",
        duration: "30:25",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/Brac%20Emons%20Vichi%20se%20Marchi%20Il%20segreto%20del%20naso%20di%20Rioba%2030%20sett%2025.mp3",
        backgroundUrl: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/images%20(8).jpeg"
      }
    ];
  }
  if (playlistId === 7) {
    return [
      {
        title: "Anche il diavolo si stanca",
        duration: "23:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/Brac%20Emons%20A.%2023%20settembre%20Anche%20il%20diavolo%20si%20stanca%20p.p.wav",
        backgroundUrl: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/images%20(9).jpeg"
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
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Another%20Day%20_%20Bukshot%20Lefonque.mp3"
      },
      {
        title: "The Bravest Man (Remix)",
        duration: "4:12",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Bobby%20Womack%20_%20The%20Bravest%20Man%20Remix.mp3"
      },
      {
        title: "Bubble Jet",
        duration: "5:04",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Bubble%20Jet%20_%20Emotionelectric.mp3"
      },
      {
        title: "So Far To Go",
        duration: "5:12",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Common%20_%20%20So%20Far%20To%20Go.mp3"
      },
      {
        title: "Easy",
        duration: "5:52",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Groove%20Armada%20_%20Easy.mp3"
      },
      {
        title: "El Pollero Loco",
        duration: "4:28",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Koel%20Willer%20_%20El%20Pollero%20Loco%20.mp3"
      },
      {
        title: "This Is SKA",
        duration: "3:41",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Longsy%20D%20_%20This%20Is%20SKA.mp3"
      },
      {
        title: "Hold Up",
        duration: "4:03",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Louis%20Chedid%20_%20Hold%20Up.mp3"
      },
      {
        title: "Transylfornia",
        duration: "4:47",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Nikki%20_%20Transylfornia.mp3"
      },
      {
        title: "Perfidia",
        duration: "3:20",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Phyllis%20Dillon%20_%20Perfidia.mp3"
      },
      {
        title: "Bloodstream",
        duration: "5:07",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Stateless%20_%20Bloodstream%20.mp3"
      }
    ];
  }
  if (playlistId === 12) {
    return [
      {
        title: "It's Your Time",
        duration: "3:58",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/01%20It's%20Your%20Time.mp3"
      },
      {
        title: "Welcome to Planet Funk",
        duration: "7:04",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/01%20Welcome%20to%20Planet%20Funk.mp3"
      },
      {
        title: "Where Is the Max",
        duration: "4:40",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/01%20where%20is%20the%20max.mp3"
      },
      {
        title: "Chase the Sun",
        duration: "3:40",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/02%20chase%20the%20sun.mp3"
      },
      {
        title: "Magic Number",
        duration: "3:52",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/02%20Magic%20Number.mp3"
      },
      {
        title: "All Man's Land",
        duration: "5:32",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/03%20all%20mans%20land.mp3"
      },
      {
        title: "Swallow",
        duration: "5:10",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/03%20Swallow.mp3"
      },
      {
        title: "In The Beginning",
        duration: "4:32",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/04%20In%20The%20Beginning.mp3"
      },
      {
        title: "The Switch",
        duration: "3:41",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/04%20the%20switch.mp3"
      },
      {
        title: "If We Try",
        duration: "4:12",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/05%20If%20We%20Tray.mp3"
      },
      {
        title: "Inside All the People",
        duration: "4:57",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/05%20inside%20all%20the%20people.mp3"
      },
      {
        title: "Static",
        duration: "4:24",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/06%20Static.mp3"
      },
      {
        title: "Under the Rain",
        duration: "6:11",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/06%20under%20the%20rain.mp3"
      },
      {
        title: "Paraffin",
        duration: "4:30",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/07%20paraffin.mp3"
      },
      {
        title: "We Turn",
        duration: "4:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/07%20We%20Turn.mp3"
      },
      {
        title: "Piano Piano",
        duration: "3:15",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/08%20piano%20piano.mp3"
      },
      {
        title: "Running Through My Head",
        duration: "4:43",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/08%20Running%20Through%20My%20Head.mp3"
      },
      {
        title: "Tears",
        duration: "3:48",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/09%20Tears.mp3"
      },
      {
        title: "Tightrope Artist",
        duration: "3:45",
        audioUrl: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/09%20tightrope%20artist.mp3"
      }
    ];
  }
  return MOCK_SONGS;
}

