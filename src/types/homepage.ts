// Configurazione dello sfondo homepage, salvata su Bunny in /config/homepage.json

export type HomeMediaType = 'image' | 'video';
export type HomeBgMode = 'image' | 'video' | 'slideshow';

export interface HomeMediaItem {
  id: string;
  type: HomeMediaType;
  /** Link Bunny del file (https://radioamble-cdn.b-cdn.net/...) */
  url: string;
  /** Solo video: immagine mostrata mentre il video carica o se l'autoplay è bloccato */
  poster?: string;
  /**
   * Secondi di permanenza nello slideshow.
   * Immagini: se assente usa imageDuration. Video: se assente il video gira fino alla fine.
   */
  duration?: number;
}

export interface HomepageConfig {
  version: 1;
  updatedAt: string;
  /** Cosa è attivo adesso in homepage */
  mode: HomeBgMode;
  /** Le tre impostazioni restano salvate tutte: cambiando modalità non si perde nulla */
  image?: HomeMediaItem;
  video?: HomeMediaItem;
  slides: HomeMediaItem[];
  /** Secondi di default per ogni immagine nello slideshow */
  imageDuration: number;
  /** Scurimento sopra lo sfondo, da 0 a 0.9 */
  overlay: number;
  /** Sponsor mostrato nel player della homepage (se assente: Disclaimer, come oggi) */
  sponsor?: HomeSponsor;
}

export interface HomeSponsor {
  /** false = il player non mostra nessuno sponsor */
  enabled: boolean;
  /** Testo piccolo sopra il logo, es. "sponsored by" */
  label: string;
  /** Nome dello sponsor (testo alternativo del logo e tooltip) */
  name: string;
  /** Logo su Bunny, meglio PNG/SVG trasparente e chiaro (il player è scuro) */
  logoUrl: string;
  /** Sito dello sponsor (facoltativo) */
  link?: string;
  /** Dimensione del logo, da 0.5 a 2 (1 = standard) */
  scale: number;
}

export const DEFAULT_SPONSOR: HomeSponsor = {
  enabled: true,
  label: 'sponsored by',
  name: 'Disclaimer Official',
  logoUrl:
    'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/Screenshot_2026-06-15_11.39.16-removebg-preview.png',
  link: 'https://disclaimerofficial.com/',
  // il PNG Disclaimer ha molto margine trasparente: leggermente più grande
  scale: 1.3,
};

export const CDN_BASE = 'https://radioamble-cdn.b-cdn.net';
export const HOMEPAGE_CONFIG_URL = `${CDN_BASE}/config/homepage.json`;

export function detectMediaType(url: string): HomeMediaType {
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url) ? 'video' : 'image';
}

/** Gli elementi effettivamente mostrati in base alla modalità scelta */
export function activeItems(config: HomepageConfig): HomeMediaItem[] {
  if (config.mode === 'image') return config.image ? [config.image] : [];
  if (config.mode === 'video') return config.video ? [config.video] : [];
  return config.slides ?? [];
}

function isItem(i: unknown): i is HomeMediaItem {
  if (!i || typeof i !== 'object') return false;
  const it = i as HomeMediaItem;
  return typeof it.url === 'string' && (it.type === 'image' || it.type === 'video');
}

/** Controllo che il JSON scaricato abbia la forma giusta e mostri almeno qualcosa */
export function isHomepageConfig(value: unknown): value is HomepageConfig {
  if (!value || typeof value !== 'object') return false;
  const v = value as HomepageConfig;
  if (!(v.mode === 'image' || v.mode === 'video' || v.mode === 'slideshow')) return false;
  if (v.image !== undefined && !isItem(v.image)) return false;
  if (v.video !== undefined && !isItem(v.video)) return false;
  if (!Array.isArray(v.slides) || !v.slides.every(isItem)) return false;
  if (v.sponsor !== undefined && (typeof v.sponsor !== 'object' || typeof v.sponsor.logoUrl !== 'string')) return false;
  return activeItems(v).length > 0;
}
