// Salva la configurazione della homepage (sfondo + sponsor del player) su Bunny Storage.
// Su Netlify la usa netlify/functions/homepage.mts; su Vercel funziona da sola come /api/homepage.
// La chiave di Bunny resta qui sul server, mai nel browser.
//
// Variabili d'ambiente (Netlify: Site configuration > Environment variables · Vercel: Settings > Environment Variables):
//   ADMIN_PASSWORD        password per entrare in /admin
//   BUNNY_STORAGE_ZONE    nome della storage zone (es. radioamble)
//   BUNNY_STORAGE_KEY     password della storage zone (Storage > FTP & API Access)
//   BUNNY_STORAGE_HOST    opzionale, default storage.bunnycdn.com (cambia se la zona non è in Europa)
//   BUNNY_API_KEY         API key dell'account (Account settings > API) per svuotare la cache
//   BUNNY_CDN_BASE        opzionale, default https://radioamble-cdn.b-cdn.net

import { createHash, timingSafeEqual } from 'node:crypto';

const CONFIG_PATH = 'config/homepage.json';

type MediaType = 'image' | 'video';
type Mode = 'image' | 'video' | 'slideshow';

interface Item {
  id: string;
  type: MediaType;
  url: string;
  poster?: string;
  duration?: number;
}

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function sameSecret(a: string, b: string) {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

function cleanConfig(input: unknown, cdnBase: string) {
  if (!input || typeof input !== 'object') throw new Error('Dati mancanti');
  const raw = input as Record<string, unknown>;

  const mode = raw.mode as Mode;
  if (!['image', 'video', 'slideshow'].includes(mode)) throw new Error('Modalità non valida');

  const isBunny = (u: unknown): u is string => typeof u === 'string' && u.startsWith(cdnBase + '/');

  const cleanItem = (r: unknown, label: string, forcedType?: MediaType): Item => {
    const it = (r ?? {}) as Record<string, unknown>;
    if (!isBunny(it.url)) throw new Error(`${label}: il link deve iniziare con ${cdnBase}/`);
    const type = forcedType ?? it.type;
    if (type !== 'image' && type !== 'video') throw new Error(`${label}: tipo non valido`);
    if (it.poster !== undefined && it.poster !== '' && !isBunny(it.poster))
      throw new Error(`${label}: anche il poster deve essere un link Bunny`);
    const duration =
      it.duration === undefined || it.duration === null || it.duration === '' ? undefined : Number(it.duration);
    if (duration !== undefined && (!Number.isFinite(duration) || duration < 2 || duration > 600))
      throw new Error(`${label}: durata tra 2 e 600 secondi`);
    return {
      id: typeof it.id === 'string' && it.id ? it.id.slice(0, 40) : `item-${Date.now()}`,
      type,
      url: it.url,
      ...(it.poster ? { poster: it.poster as string } : {}),
      ...(duration !== undefined ? { duration } : {}),
    };
  };

  const image = raw.image ? cleanItem(raw.image, 'Immagine', 'image') : undefined;
  const video = raw.video ? cleanItem(raw.video, 'Video', 'video') : undefined;

  const rawSlides = Array.isArray(raw.slides) ? raw.slides : [];
  if (rawSlides.length > 30) throw new Error('Slideshow: massimo 30 elementi');
  const slides = rawSlides.map((s, i) => cleanItem(s, `Slide ${i + 1}`));

  if (mode === 'image' && !image) throw new Error('Modalità immagine: inserisci il link dell’immagine');
  if (mode === 'video' && !video) throw new Error('Modalità video: inserisci il link del video');
  if (mode === 'slideshow' && slides.length === 0) throw new Error('Slideshow: aggiungi almeno un elemento');

  // Sponsor del player
  let sponsor: Record<string, unknown> | undefined;
  if (raw.sponsor && typeof raw.sponsor === 'object') {
    const sp = raw.sponsor as Record<string, unknown>;
    const enabled = sp.enabled !== false;
    const logoUrl = typeof sp.logoUrl === 'string' ? sp.logoUrl : '';
    if (enabled && !isBunny(logoUrl)) throw new Error(`Sponsor: il logo deve essere un link Bunny (${cdnBase}/…)`);
    const link = typeof sp.link === 'string' && sp.link.trim() ? sp.link.trim() : undefined;
    if (link && !/^https:\/\/[^\s]+$/.test(link)) throw new Error('Sponsor: il link deve iniziare con https://');
    const scale = Number(sp.scale ?? 1);
    sponsor = {
      enabled,
      label: typeof sp.label === 'string' ? sp.label.slice(0, 40) : '',
      name: typeof sp.name === 'string' ? sp.name.slice(0, 60) : '',
      logoUrl,
      ...(link ? { link: link.slice(0, 300) } : {}),
      scale: Number.isFinite(scale) ? Math.min(Math.max(scale, 0.5), 2) : 1,
    };
  }

  const imageDuration = Number(raw.imageDuration ?? 10);
  const overlay = Number(raw.overlay ?? 0.55);

  return {
    version: 1 as const,
    updatedAt: new Date().toISOString(),
    mode,
    ...(image ? { image } : {}),
    ...(video ? { video } : {}),
    slides,
    imageDuration: Number.isFinite(imageDuration) ? Math.min(Math.max(imageDuration, 3), 120) : 10,
    overlay: Number.isFinite(overlay) ? Math.min(Math.max(overlay, 0), 0.9) : 0.55,
    ...(sponsor ? { sponsor } : {}),
  };
}

async function putFile(path: string, body: string) {
  const host = process.env.BUNNY_STORAGE_HOST || 'storage.bunnycdn.com';
  const zone = process.env.BUNNY_STORAGE_ZONE!;
  const res = await fetch(`https://${host}/${zone}/${path}`, {
    method: 'PUT',
    headers: {
      AccessKey: process.env.BUNNY_STORAGE_KEY!,
      'Content-Type': 'application/json',
    },
    body,
  });
  if (!res.ok) throw new Error(`Bunny Storage ha risposto ${res.status}`);
}

async function purge(url: string) {
  const key = process.env.BUNNY_API_KEY;
  if (!key) return false;
  const res = await fetch(`https://api.bunny.net/purge?url=${encodeURIComponent(url)}&async=false`, {
    method: 'POST',
    headers: { AccessKey: key },
  });
  return res.ok;
}

export async function POST(request: Request): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Usa POST' });

  const { ADMIN_PASSWORD, BUNNY_STORAGE_ZONE, BUNNY_STORAGE_KEY } = process.env;
  if (!ADMIN_PASSWORD || !BUNNY_STORAGE_ZONE || !BUNNY_STORAGE_KEY) {
    return json(500, { error: 'Variabili d’ambiente mancanti sul server' });
  }

  const password = request.headers.get('x-admin-password') || '';
  if (!sameSecret(password, ADMIN_PASSWORD)) {
    return json(401, { error: 'Password errata' });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'JSON non leggibile' });
  }

  // Richiesta di sola verifica password dal login della dashboard
  if (body && typeof body === 'object' && (body as { check?: boolean }).check === true) {
    return json(200, { ok: true });
  }

  const cdnBase = (process.env.BUNNY_CDN_BASE || 'https://radioamble-cdn.b-cdn.net').replace(/\/$/, '');

  let config;
  try {
    config = cleanConfig(body, cdnBase);
  } catch (e) {
    return json(400, { error: (e as Error).message });
  }

  const text = JSON.stringify(config, null, 2);
  try {
    // Copia di sicurezza datata, poi il file pubblico
    const stamp = config.updatedAt.replace(/[:.]/g, '-');
    await putFile(`config/backup/homepage-${stamp}.json`, text);
    await putFile(CONFIG_PATH, text);
  } catch (e) {
    return json(502, { error: (e as Error).message });
  }

  const purged = await purge(`${cdnBase}/${CONFIG_PATH}`).catch(() => false);

  return json(200, { ok: true, purged, config });
}
