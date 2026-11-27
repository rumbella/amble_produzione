import { useEffect, useRef } from 'react';
import type { NowPlaying } from '../components/MiniPlayer';

interface MediaSessionOptions {
  meta: NowPlaying | null;
  playing: boolean;
  isLive: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

const FALLBACK_ARTWORK = 'https://radioamble-cdn.b-cdn.net/logo_radioamble.png';

function guessType(url: string) {
  if (/\.png(\?|$)/i.test(url)) return 'image/png';
  if (/\.webp(\?|$)/i.test(url)) return 'image/webp';
  return 'image/jpeg';
}

/**
 * Titolo, copertina e play/pausa sulla schermata di blocco, nel centro di controllo,
 * nelle notifiche Android, in auto e sulle cuffie Bluetooth.
 */
export function useMediaSession({ meta, playing, isLive, onPlay, onPause, onStop }: MediaSessionOptions) {
  const handlers = useRef({ onPlay, onPause, onStop });
  handlers.current = { onPlay, onPause, onStop };

  const supported = typeof navigator !== 'undefined' && 'mediaSession' in navigator;

  // Metadati (titolo, autore, copertina)
  useEffect(() => {
    if (!supported) return;
    if (!meta) {
      navigator.mediaSession.metadata = null;
      return;
    }
    const art = meta.image || FALLBACK_ARTWORK;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: meta.title,
        artist: isLive ? 'In diretta' : meta.subtitle || 'Radio Amblè',
        album: 'Radio Amblè',
        artwork: [
          { src: art, sizes: '512x512', type: guessType(art) },
          { src: art, sizes: '256x256', type: guessType(art) },
        ],
      });
    } catch {
      /* browser senza MediaMetadata */
    }
  }, [supported, meta, isLive]);

  // Stato di riproduzione
  useEffect(() => {
    if (!supported) return;
    navigator.mediaSession.playbackState = meta ? (playing ? 'playing' : 'paused') : 'none';
  }, [supported, playing, meta]);

  // Pulsanti
  useEffect(() => {
    if (!supported) return;
    const set = (action: MediaSessionAction, fn: MediaSessionActionHandler | null) => {
      try {
        navigator.mediaSession.setActionHandler(action, fn);
      } catch {
        /* azione non supportata su questo browser */
      }
    };
    set('play', () => handlers.current.onPlay());
    set('pause', () => handlers.current.onPause());
    set('stop', () => handlers.current.onStop());
    // La diretta non si può riavvolgere: niente salti avanti/indietro
    set('seekbackward', null);
    set('seekforward', null);
    set('seekto', null);
    return () => {
      set('play', null);
      set('pause', null);
      set('stop', null);
    };
  }, [supported]);
}
