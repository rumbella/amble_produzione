/**
 * CENSIMENTO DATI: featured.ts
 * 
 * 1. HOMEPAGE_BACKGROUNDS (8 immagini di sfondo per l'homepage disclaimer):
 *    - Immagini CDN Phoenix 6P9A1302.jpg - 6P9A2047.jpg
 * 
 * 2. RANDOM_BACKGROUNDS (12 media di sfondo casuali: immagini e video MP4):
 *    - Immagini e video MP4 per sessioni di ascolto
 * 
 * 3. getRandomBackground():
 *    - Helper che seleziona un media casuale da RANDOM_BACKGROUNDS con encoding spazi (%20).
 * 
 * 4. MOCK_GRID_ITEMS (11 elementi griglia responsive per ContentGrid):
 *    - grid-1 (image, ratio 0.75): "Electronic Sessions Vol. 4" (RadioAmblé)
 *    - grid-2 (video MP4, ratio 0.5625): "Live Ambient Flow" (Phoenix Selecta)
 *    - grid-3 (image, ratio 1.5): "Vinyl Collectors Night" (Stiv Tirella)
 *    - grid-4 (image, ratio 1.0): "Episode #42: Special Guest" (Musik & Talk)
 *    - grid-5 (video MP4, ratio 1.777): "Late Night House Set" (Club Selection)
 *    - grid-6 (image, ratio 0.8): "Digital Beats Synthesis" (Accademia A.i.D.)
 *    - grid-7 (image, ratio 1.25): "Club Culture Chronicles" (Albi Scotti)
 *    - grid-8 (image, ratio 1.33): "Synthesizer Special Sessions" (RadioAmblé)
 *    - grid-9 (video MP4, ratio 0.5625): "Neon Lightwaves Rhythm" (Visuals Live)
 *    - grid-10 (image, ratio 0.7): "Progressive Masterclass" (Francesco Farfa)
 *    - grid-11 (image, ratio 1.5): "Mainstage Crowd Anthems" (RadioAmblé Live)
 * 
 * 5. MOCK_FEATURED_SLOTS (7 slot full-width per il feed):
 *    - slot-djset-highlight (type: 'djset', isHighlight: true): "Francesco Farfa Live @ Amblé"
 *    - slot-adv-active (type: 'adv', isSponsored: true, expiresAt: '2028-12-31'): "Live Your Music - Heineken Sessions"
 *    - slot-promo (type: 'promo'): "Summer Dance Festival 2026" (RadioAmblé Official)
 *    - slot-djset (type: 'djset'): "Alex Neri exclusive 90 MINS session"
 *    - slot-video-art (type: 'video_art'): "Neon Lightwaves Rhythm - Abstract 4K"
 *    - slot-podcast (type: 'podcast'): "Albi Scotti in-depth interview"
 *    - slot-adv-expired (type: 'adv', isSponsored: true, expiresAt: '2024-12-31'): "Winter Selection 2025"
 */

import { GridItem, FeaturedSlot } from '../components/ContentGrid';

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

export const MOCK_GRID_ITEMS: GridItem[] = [
  {
    id: 'grid-1',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 0.75, // Portrait (3/4)
    brandName: 'RadioAmblé',
    title: 'Electronic Sessions Vol. 4',
  },
  {
    id: 'grid-2',
    type: 'video',
    mediaUrl: 'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_b85bbea7-d3d7-4d23-8397-cc797d40db6d_generated_video.MP4',
    aspectRatio: 0.5625, // Vertical (9:16)
    brandName: 'Phoenix Selecta',
    title: 'Live Ambient Flow',
  },
  {
    id: 'grid-3',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.5, // Landscape (3/2)
    brandName: 'Stiv Tirella',
    title: 'Vinyl Collectors Night',
  },
  {
    id: 'grid-4',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.0, // Square
    brandName: 'Musik & Talk',
    title: 'Episode #42: Special Guest',
  },
  {
    id: 'grid-5',
    type: 'video',
    mediaUrl: 'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_d4aa45e7-83be-4318-b00a-3684afdd7624_generated_video.MP4',
    aspectRatio: 1.777, // Widescreen (16:9)
    brandName: 'Club Selection',
    title: 'Late Night House Set',
  },
  {
    id: 'grid-6',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 0.8, // Tall Portrait
    brandName: 'Accademia A.i.D.',
    title: 'Digital Beats Synthesis',
  },
  {
    id: 'grid-7',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.25, // Balanced Landscape
    brandName: 'Albi Scotti',
    title: 'Club Culture Chronicles',
  },
  {
    id: 'grid-8',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.33, // Landscape (4/3)
    brandName: 'RadioAmblé',
    title: 'Synthesizer Special Sessions',
  },
  {
    id: 'grid-9',
    type: 'video',
    mediaUrl: 'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_ed66afeb-20ab-4bf2-8ad6-016d76d9fdfe_generated_video.MP4',
    aspectRatio: 0.5625, // Vertical (9:16)
    brandName: 'Visuals Live',
    title: 'Neon Lightwaves Rhythm',
  },
  {
    id: 'grid-10',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 0.7, // Extra Tall Portrait
    brandName: 'Francesco Farfa',
    title: 'Progressive Masterclass',
  },
  {
    id: 'grid-11',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.5, // Landscape (3/2)
    brandName: 'RadioAmblé Live',
    title: 'Mainstage Crowd Anthems',
  }
];

export const MOCK_FEATURED_SLOTS: FeaturedSlot[] = [
  {
    id: 'slot-djset-highlight',
    type: 'djset',
    isSponsored: false,
    isHighlight: true, // DJ set della settimana! Should go first!
    brandName: 'DJ SET DELLA SETTIMANA',
    title: 'Francesco Farfa Live @ Amblé',
    subtitle: 'Una selezione ipnotica registrata dal vivo nei nostri studi.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-adv-active',
    type: 'adv',
    isSponsored: true,
    brandName: 'Heineken Italia',
    title: 'Live Your Music - Heineken Sessions',
    subtitle: 'Il ritmo esclusivo incontra l’estate. Scopri la line-up esclusiva di stasera.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4',
    expiresAt: '2028-12-31' // Active/Non-expired
  },
  {
    id: 'slot-promo',
    type: 'promo',
    isSponsored: false,
    brandName: 'RadioAmblé Official',
    title: 'Summer Dance Festival 2026',
    subtitle: 'Iscriviti ora per partecipare all’evento elettronico dell’anno sulla riviera.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-djset',
    type: 'djset',
    isSponsored: false,
    brandName: '90 MINS OF MUSIC',
    title: 'Alex Neri exclusive 90 MINS session',
    subtitle: 'Un viaggio profondo nell’house elettronica firmato Alex Neri.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-video-art',
    type: 'video_art',
    isSponsored: false,
    brandName: 'Visual Art Section',
    title: 'Neon Lightwaves Rhythm - Abstract 4K',
    subtitle: 'Un’opera d’arte generativa sul flusso luminoso della musica.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-podcast',
    type: 'podcast',
    isSponsored: false,
    brandName: 'Musik & Talk Podcast',
    title: 'Albi Scotti in-depth interview',
    subtitle: 'Riflessioni sulla cultura del clubbing italiano, aneddoti e sfide future.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-adv-expired',
    type: 'adv',
    isSponsored: true,
    brandName: 'Expired Brands',
    title: 'Winter Selection 2025',
    subtitle: 'Questo annuncio promozionale è scaduto e non dovrebbe avere la massima priorità.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4',
    expiresAt: '2024-12-31' // Expired
  }
];
