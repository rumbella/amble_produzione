/**
 * CENSIMENTO DATI: tracks.ts
 * 
 * 1. PLAYLIST_SPOTLIGHT_TRACKS (6 tracce in evidenza per la sezione Playlist):
 *    - "Chase the Sun" (Planet Funk) - CDN image & audio
 *    - "Another Day" (Buckshot LeFonque) - CDN image & audio
 *    - "Easy" (Groove Armada) - CDN image & audio
 *    - "Bloodstream" (Stateless) - CDN image & audio
 *    - "Inside All the People" (Planet Funk) - CDN image & audio
 *    - "The Switch" (Planet Funk) - CDN image & audio
 * 
 * 2. PODCAST_SPOTLIGHT_TRACKS (6 tracce in evidenza per la sezione Podcast):
 *    - "Nikky di Radio deejay" (Stiv Tirella) - CDN image & audio
 *    - "Il segreto del naso di Rioba" (Brac Emons) - CDN image & audio
 *    - "intervista a faso" (Stiv Tirella) - CDN image & audio
 *    - "Anche il diavolo si stanca" (Brac Emons) - CDN image & audio
 *    - "intervista a marlen" (Stiv Tirella) - CDN image & audio
 *    - "Music&Talk - Thomas T." (Thomas T.) - CDN image & audio
 * 
 * 3. DJSET_SPOTLIGHT_TRACKS (8 tracce in evidenza per la sezione DJ Set):
 *    - "VOL 1" a "VOL 5" (Rufus City) - CDN image & audio
 *    - "Music&Talk - Alex Neri" (Alex Neri) - CDN image & audio
 *    - "Music&Talk - Francesco Farfa" (Francesco Farfa) - CDN image & audio
 *    - "Music&Talk - Albi Scotti" (Albi Scotti) - CDN image & audio
 * 
 * 4. PROGRAMMI_SPOTLIGHT_TRACKS (6 tracce in evidenza per la sezione Programmi):
 *    - "Music&Talk - Francesco Farfa" (Francesco Farfa) - CDN image & audio
 *    - "Music&Talk - Alex Neri" (Alex Neri) - CDN image & audio
 *    - "Music&Talk - Albi Scotti" (Albi Scotti) - CDN image & audio
 *    - "Nikky di Radio deejay" (Stiv Tirella) - CDN image & audio
 *    - "intervista a faso" (Stiv Tirella) - CDN image & audio
 *    - "Il segreto del naso di Rioba" (Brac Emons) - CDN image & audio
 */

export interface SpotlightTrack {
  title: string;
  artist: string;
  audio: string;
  image: string;
} // TODO: move to types.ts

export const PLAYLIST_SPOTLIGHT_TRACKS: SpotlightTrack[] = [
  {
    title: "Chase the Sun",
    artist: "Planet Funk",
    audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/02%20chase%20the%20sun.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/immagini/aff70516-692b-4b0a-8282-b0a12a42f270~1%20(2).jpg"
  },
  {
    title: "Another Day",
    artist: "Buckshot LeFonque",
    audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Another%20Day%20_%20Bukshot%20Lefonque.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20foto%203%20(1).jpg"
  },
  {
    title: "Easy",
    artist: "Groove Armada",
    audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Groove%20Armada%20_%20Easy.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20foto%203%20(1).jpg"
  },
  {
    title: "Bloodstream",
    artist: "Stateless",
    audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Stateless%20_%20Bloodstream%20.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20foto%203%20(1).jpg"
  },
  {
    title: "Inside All the People",
    artist: "Planet Funk",
    audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/05%20inside%20all%20the%20people.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/immagini/aff70516-692b-4b0a-8282-b0a12a42f270~1%20(2).jpg"
  },
  {
    title: "The Switch",
    artist: "Planet Funk",
    audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/04%20the%20switch.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/immagini/aff70516-692b-4b0a-8282-b0a12a42f270~1%20(2).jpg"
  }
];

export const PODCAST_SPOTLIGHT_TRACKS: SpotlightTrack[] = [
  {
    title: "Nikky di Radio deejay",
    artist: "Stiv Tirella",
    audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/12%20NIKKI%20scheggia%20(1)%20(1).mp3",
    image: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/91bc11e7-db11-4db1-b21c-ef21d662aec3.png"
  },
  {
    title: "Il segreto del naso di Rioba",
    artist: "Brac Emons",
    audio: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/Brac%20Emons%20Vichi%20se%20Marchi%20Il%20segreto%20del%20naso%20di%20Rioba%2030%20sett%2025.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/images%20(8).jpeg"
  },
  {
    title: "intervista a faso",
    artist: "Stiv Tirella",
    audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/FASO%20SCHEGGIA%201.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/01f3de8a-2a62-42a6-beef-afeeb4e0b0c9.png"
  },
  {
    title: "Anche il diavolo si stanca",
    artist: "Brac Emons",
    audio: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/Brac%20Emons%20A.%2023%20settembre%20Anche%20il%20diavolo%20si%20stanca%20p.p.wav",
    image: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/images%20(9).jpeg"
  },
  {
    title: "intervista a marlen",
    artist: "Stiv Tirella",
    audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/MARLEN%20SCHEGGIA%20.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/13aaa0b2-3262-4326-99c2-319c3ecb3944%20(2).png"
  },
  {
    title: "Music&Talk - Thomas T.",
    artist: "Thomas T.",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%235%20Thomas%20T.%20pres.%20Ottanio.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Copia%20di%20francesco%20farfa%20(17).jpg"
  }
];

export const DJSET_SPOTLIGHT_TRACKS: SpotlightTrack[] = [
  {
    title: "VOL 1",
    artist: "Rufus City",
    audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20C.S.%20p.%2030%20ott%2025.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/immagini/397df7675bb90715880609056aad5814.jpg"
  },
  {
    title: "VOL 2",
    artist: "Rufus City",
    audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20C.S.p.18%20dic%2025.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/immagini/397df7675bb90715880609056aad5814.jpg"
  },
  {
    title: "VOL 3",
    artist: "Rufus City",
    audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20C.S.P%2019%20feb%2026.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/immagini/397df7675bb90715880609056aad5814.jpg"
  },
  {
    title: "VOL 4",
    artist: "Rufus City",
    audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records%20%20%231.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/immagini/397df7675bb90715880609056aad5814.jpg"
  },
  {
    title: "VOL 5",
    artist: "Rufus City",
    audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20City%20sound%20pr.%204%20sett%2025.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/immagini/397df7675bb90715880609056aad5814.jpg"
  },
  {
    title: "Music&Talk - Alex Neri",
    artist: "Alex Neri",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%232%20Alex%20Neri%20.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Alex%20Neri%20dj/images%20(12).jpeg"
  },
  {
    title: "Music&Talk - Francesco Farfa",
    artist: "Francesco Farfa",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%231%20Francesco%20Farfa%20.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Copia%20di%20francesco%20farfa%20(14).jpg"
  },
  {
    title: "Music&Talk - Albi Scotti",
    artist: "Albi Scotti",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%236%20Albi%20Scotti.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(8).jpg"
  }
];

export const PROGRAMMI_SPOTLIGHT_TRACKS: SpotlightTrack[] = [
  {
    title: "Music&Talk - Francesco Farfa",
    artist: "Francesco Farfa",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%231%20Francesco%20Farfa%20.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Copia%20di%20francesco%20farfa%20(14).jpg"
  },
  {
    title: "Music&Talk - Alex Neri",
    artist: "Alex Neri",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%232%20Alex%20Neri%20.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(10).jpg"
  },
  {
    title: "Music&Talk - Albi Scotti",
    artist: "Albi Scotti",
    audio: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%236%20Albi%20Scotti.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(8).jpg"
  },
  {
    title: "Nikky di Radio deejay",
    artist: "Stiv Tirella",
    audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/12%20NIKKI%20scheggia%20(1)%20(1).mp3",
    image: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/91bc11e7-db11-4db1-b21c-ef21d662aec3.png"
  },
  {
    title: "intervista a faso",
    artist: "Stiv Tirella",
    audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/FASO%20SCHEGGIA%201.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/01f3de8a-2a62-42a6-beef-afeeb4e0b0c9.png"
  },
  {
    title: "Il segreto del naso di Rioba",
    artist: "Brac Emons",
    audio: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/Brac%20Emons%20Vichi%20se%20Marchi%20Il%20segreto%20del%20naso%20di%20Rioba%2030%20sett%2025.mp3",
    image: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/images%20(8).jpeg"
  }
];
