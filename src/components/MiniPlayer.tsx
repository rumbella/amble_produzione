import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { PlayButtonIcon } from './PlayButtonIcon';
import { useSwipe } from '../hooks/useSwipe';

export interface NowPlaying {
  /** Titolo del brano / episodio / "Diretta" */
  title: string;
  /** Autore, playlist o programma */
  subtitle?: string;
  /** Copertina (URL immagine) */
  image?: string;
  /** Pagina da aprire toccando il mini player */
  href?: string;
}

interface MiniPlayerProps {
  visible: boolean;
  meta: NowPlaying | null;
  playing: boolean;
  loading: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * Barra di riproduzione compatta, visibile in tutte le pagine mentre qualcosa suona.
 * Posizionamento: su mobile sopra la nav in basso (usa la variabile CSS --bottom-nav-h, default 64px),
 * su desktop centrata in basso.
 */
export function MiniPlayer({ visible, meta, playing, loading, onToggle, onOpen, onClose }: MiniPlayerProps) {
  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const swipeRef = useSwipe<HTMLDivElement>(
    {
      onSwipe: (d) => {
        if (d === 'down') onClose();
        if (d === 'up') onOpen();
      },
    },
    isTouch,
  );

  return (
    <AnimatePresence>
      {visible && meta && (
        <motion.div
          key="mini-player"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed z-50 left-2 right-2 md:left-0 md:right-0 md:mx-auto md:w-[440px]"
          style={{ bottom: 'calc(var(--bottom-nav-h, 64px) + env(safe-area-inset-bottom, 0px) + 8px)' }}
        >
          <div
            ref={swipeRef}
            data-no-swipe
            className="flex items-center gap-3 rounded-2xl bg-[#121214]/90 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-2 pr-3"
          >
            <button
              type="button"
              onClick={onOpen}
              className="flex items-center gap-3 flex-1 min-w-0 text-left"
              aria-label={`Apri ${meta.title}`}
            >
              {meta.image ? (
                <img
                  src={meta.image}
                  alt=""
                  className="w-11 h-11 rounded-lg object-cover shrink-0 bg-white/5"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-lg shrink-0 bg-white/10" />
              )}
              <span className="flex flex-col min-w-0">
                <span className="font-space font-bold text-[13px] text-white truncate">{meta.title}</span>
                {(loading || meta.subtitle) && (
                  <span className="font-sans text-[11px] text-white/55 truncate">
                    {loading ? 'Connessione…' : meta.subtitle}
                  </span>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={onToggle}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 active:scale-95 transition-transform"
              aria-label={loading ? 'Connessione in corso' : playing ? 'Pausa' : 'Play'}
            >
              <PlayButtonIcon playing={playing} loading={loading} size={18} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white shrink-0"
              aria-label="Ferma e chiudi"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
