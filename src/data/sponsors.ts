import { HomeBackground, PageSponsor } from '../types';

/**
 * =======================================================================
 * SPONSORSHIP & BACKGROUND CONFIGURATION (GUIDATO DAI DATI)
 * =======================================================================
 * 
 * Qui si gestiscono le sponsorizzazioni e gli sfondi dell'app senza dover
 * toccare i componenti React.
 * 
 * LIVELLO 1: HOMEPAGE (SLOT SINGOLO ATTIVO)
 * Modifica `activeHomeBackground` con il video o l'immagine concordata
 * con lo sponsor o con la programmazione artistica.
 */
export const activeHomeBackground: HomeBackground = {
  type: 'video',
  src: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4',
  sponsorName: 'Disclaimer Official',
};

/**
 * LIVELLO 3: SPONSOR PER PAGINE SINGOLE/DETTAGLIO (DJ Set, Podcast, Playlist)
 * Ogni entità può includere opzionalmente un oggetto `PageSponsor`.
 * Se `sponsor` non è presente nell'oggetto dati, la pagina utilizzerà
 * lo sfondo solido neutro standard (#0a0a0a).
 */
export const SAMPLE_DJSET_SPONSOR: PageSponsor = {
  sponsorName: 'Heineken Silver',
  backgroundType: 'video',
  backgroundSrc: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4',
  marqueeText: 'OFFERTO DA HEINEKEN SILVER • LIVE YOUR MUSIC SESSIONS • TAP PER GUARDARE LO SPOT',
  popupTrigger: 'tap',
  popupVideoSrc: 'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_b85bbea7-d3d7-4d23-8397-cc797d40db6d_generated_video.MP4',
};

export const SAMPLE_SLIDESHOW_SPONSOR: PageSponsor = {
  sponsorName: 'Disclaimer Official',
  backgroundType: 'slideshow',
  backgroundSrc: [
    'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1302.jpg',
    'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A0466.jpg',
    'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1066.jpg',
    'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1321.jpg',
    'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1781.jpg'
  ],
  marqueeText: 'OFFERTO DA DISCLAIMER OFFICIAL • URBAN STREETWEAR & SOUND CULTURE',
  popupTrigger: 'auto',
  popupVideoSrc: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4',
};
