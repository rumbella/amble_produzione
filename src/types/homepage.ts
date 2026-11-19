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
}

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
  return activeItems(v).length > 0;
}
