import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WebGLBackground } from './WebGLBackground';
import { activeItems, HomeMediaItem, HomepageConfig } from '../types/homepage';

/** Tetto di sicurezza per un video senza durata impostata (se si blocca, lo slideshow riparte) */
const VIDEO_SAFETY_CAP_S = 120;

function prefersSaveData(): boolean {
  try {
    return (navigator as unknown as { connection?: { saveData?: boolean } }).connection?.saveData === true;
  } catch {
    return false;
  }
}

interface BgVideoProps {
  item: HomeMediaItem;
  loop: boolean;
  onEnded: () => void;
  onBlocked: () => void;
}

function BgVideo({ item, loop, onEnded, onBlocked }: BgVideoProps) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // obbligatorio per l'autoplay su iOS/Android
    const p = v.play();
    if (p) p.catch(() => onBlocked()); // es. iPhone in risparmio energetico
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.url]);

  return (
    <video
      ref={ref}
      src={item.url}
      poster={item.poster}
      muted
      autoPlay
      playsInline
      loop={loop}
      preload="auto"
      onEnded={onEnded}
      onError={onBlocked}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

export function HomeBackground({ config }: { config: HomepageConfig }) {
  const items = useMemo(() => activeItems(config), [config]);
  const saveData = useMemo(prefersSaveData, []);
  const [index, setIndex] = useState(0);
  const [blockedKey, setBlockedKey] = useState<string | null>(null);

  // Nuova configurazione => si riparte dal primo elemento
  useEffect(() => {
    setIndex(0);
    setBlockedKey(null);
  }, [items]);

  const count = items.length;
  const current = items[index % Math.max(count, 1)];
  const slideKey = current ? `${current.id}-${index}` : 'empty';
  const isSlideshow = count > 1;
  const allImages = items.every((i) => i.type === 'image');
  const useWebGL = isSlideshow && allImages;

  const next = useCallback(() => {
    if (count > 1) setIndex((i) => (i + 1) % count);
  }, [count]);

  const blocked = blockedKey === slideKey;
  const isVideo = current?.type === 'video';
  // Un video viene mostrato come immagine (il suo poster) se l'utente risparmia dati o l'autoplay è bloccato
  const videoAsPoster = isVideo && !!current?.poster && (saveData || blocked);

  // Timer dello slideshow
  useEffect(() => {
    if (!current || !isSlideshow) return;

    // Video bloccato e senza poster: si passa oltre subito
    if (isVideo && blocked && !current.poster) {
      next();
      return;
    }

    let seconds: number;
    if (!isVideo || videoAsPoster) {
      seconds = current.duration ?? config.imageDuration;
    } else {
      // Video che gira: avanza a fine video (onEnded) oppure alla durata impostata
      seconds = current.duration ?? VIDEO_SAFETY_CAP_S;
    }
    const t = window.setTimeout(next, Math.max(seconds, 2) * 1000);
    return () => window.clearTimeout(t);
  }, [slideKey, isSlideshow, isVideo, blocked, videoAsPoster, config.imageDuration, current, next]);

  // Precarica la prossima immagine (i video no: consumerebbero dati su mobile)
  useEffect(() => {
    if (!isSlideshow) return;
    const upcoming = items[(index + 1) % count];
    const src = upcoming?.type === 'image' ? upcoming.url : upcoming?.poster;
    if (src) {
      const img = new Image();
      img.src = src;
    }
  }, [index, items, count, isSlideshow]);

  const overlay = Math.min(Math.max(config.overlay ?? 0.55, 0), 0.9);

  return (
    <div className="absolute inset-0 w-full h-full">
      {useWebGL ? (
        // Solo immagini: si mantiene la transizione "liquida" WebGL già esistente
        <WebGLBackground images={items.map((i) => i.url)} currentIndex={index} />
      ) : (
        <AnimatePresence initial={false}>
          {current && (
            <motion.div
              key={slideKey}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            >
              {!isVideo || videoAsPoster ? (
                <img
                  src={isVideo ? current.poster : current.url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <BgVideo
                  item={current}
                  loop={!isSlideshow}
                  onEnded={next}
                  onBlocked={() => setBlockedKey(slideKey)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Stessi filtri colore di prima; lo scurimento ora si regola dalla dashboard */}
      <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: overlay }} />
    </div>
  );
}
