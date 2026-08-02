/**
 * CENSIMENTO DATI: shows.ts
 * 
 * 1. PROGRAMMI_ITEMS (Array di 2 programmi/format radiofonici):
 *    - ID 1: "Scheggia Impazzita" di Stiv Tirella - Ogni Lunedì • 18:00 - 19:30 - CDN image
 *    - ID 5: "Musik & Talk" di Francesco Farfa, Ricky le Roy & guests - Mensile • Esclusivo - CDN image
 * 
 * 2. MUSIK_TALK_EPISODES (Array di 6 episodi della serie Musik & Talk):
 *    - ID 1: "Music&Talk - Francesco Farfa" (PUNTATA 1) - CDN image & audio MP3
 *    - ID 2: "Music&Talk - Ricky le Roy & Luca Pechino" (PUNTATA 2) - CDN image & audio MP3
 *    - ID 3: "Music&Talk - Slowaxx" (PUNTATA 3) - CDN image & audio MP3
 *    - ID 4: "Music&Talk - Thomas T." (PUNTATA 4) - CDN image & audio MP3
 *    - ID 5: "Music&Talk - Alex Neri" (PUNTATA 5) - CDN image & audio MP3
 *    - ID 6: "Music&Talk - Albi Scotti" (PUNTATA 6) - CDN image & audio MP3
 */

import { ProgramItem, MusikTalkEpisode } from '../types';

export const PROGRAMMI_ITEMS: ProgramItem[] = [
  {
    id: 1,
    title: 'Scheggia Impazzita',
    author: 'Stiv Tirella',
    time: 'Ogni Lunedì • 18:00 - 19:30',
    type: 'podcast',
    targetId: 5,
    tag: 'PODCAST ESCLUSIVO',
    teaser: "L'energia irriverente e imprevedibile del talk show di Stiv Tirella con interviste sorprendenti a ospiti speciali.",
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Immagini%20e%20bio/Siv%20T%20foto%201%20(1).jpg',
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
    imageUrl: 'https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(5).jpg',
  }
];

export const MUSIK_TALK_EPISODES: MusikTalkEpisode[] = [
  {
    id: 1,
    title: "Music&Talk - Francesco Farfa",
    imageUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Copia%20di%20francesco%20farfa%20(14).jpg",
    audioUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%231%20Francesco%20Farfa%20.mp3",
    duration: "1:15:30",
    author: "Francesco Farfa",
    tag: "PUNTATA 1",
  },
  {
    id: 2,
    title: "Music&Talk - Ricky le Roy & Luca Pechino",
    imageUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(9).jpg",
    audioUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%231%20Francesco%20Farfa%20.mp3",
    duration: "1:22:15",
    author: "Ricky le Roy & Luca Pechino",
    tag: "PUNTATA 2",
  },
  {
    id: 3,
    title: "Music&Talk - Slowaxx",
    imageUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Copia%20di%20francesco%20farfa%20(15).jpg",
    audioUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%231%20Francesco%20Farfa%20.mp3",
    duration: "1:08:45",
    author: "Slowaxx",
    tag: "PUNTATA 3",
  },
  {
    id: 4,
    title: "Music&Talk - Thomas T.",
    imageUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Copia%20di%20francesco%20farfa%20(17).jpg",
    audioUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%235%20Thomas%20T.%20pres.%20Ottanio.mp3",
    duration: "1:18:12",
    author: "Thomas T.",
    tag: "PUNTATA 4",
  },
  {
    id: 5,
    title: "Music&Talk - Alex Neri",
    imageUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(10).jpg",
    audioUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%232%20Alex%20Neri%20.mp3",
    duration: "1:24:50",
    author: "Alex Neri",
    tag: "PUNTATA 5",
  },
  {
    id: 6,
    title: "Music&Talk - Albi Scotti",
    imageUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(8).jpg",
    audioUrl: "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/Music%26Talk%20-%20%236%20Albi%20Scotti.mp3",
    duration: "1:20:15",
    author: "Albi Scotti",
    tag: "PUNTATA 6",
  }
];
