import { useEffect, useState } from 'react';
import { HOMEPAGE_CONFIG_URL, HomepageConfig, isHomepageConfig } from '../types/homepage';

const LOCAL_KEY = 'ra_homepage_config';

// Usato se il JSON su Bunny non esiste ancora o non si carica: sono gli sfondi attuali.
const FALLBACK_IMAGES = [
  'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1302.jpg',
  'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A0466.jpg',
  'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1066.jpg',
  'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1321.jpg',
  'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1781.jpg',
  'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A1814.jpg',
  'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A2168.jpg',
  'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/6P9A2047.jpg',
];

export const FALLBACK_CONFIG: HomepageConfig = {
  version: 1,
  updatedAt: '',
  mode: 'slideshow',
  slides: FALLBACK_IMAGES.map((url, i) => ({ id: `fallback-${i}`, type: 'image', url })),
  imageDuration: 10,
  overlay: 0.55,
};

function readLocal(): HomepageConfig | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isHomepageConfig(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeLocal(config: HomepageConfig) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(config));
  } catch {
    /* storage non disponibile: pazienza */
  }
}

export async function fetchHomepageConfig(): Promise<HomepageConfig | null> {
  try {
    const res = await fetch(HOMEPAGE_CONFIG_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return isHomepageConfig(data) ? data : null;
  } catch {
    return null;
  }
}

/**
 * Mostra subito l'ultima configurazione vista (salvata nel browser) o quella di default,
 * poi scarica quella aggiornata da Bunny.
 */
export function useHomepageConfig(): HomepageConfig {
  const [config, setConfig] = useState<HomepageConfig>(() => readLocal() ?? FALLBACK_CONFIG);

  useEffect(() => {
    let cancelled = false;
    fetchHomepageConfig().then((fresh) => {
      if (cancelled || !fresh) return;
      writeLocal(fresh);
      setConfig((prev) => (JSON.stringify(prev) === JSON.stringify(fresh) ? prev : fresh));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
