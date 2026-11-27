import React, { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface Burst {
  id: number;
  x: number;
  y: number;
}

/** Cuore animato nel punto del doppio tocco. Uso: const { show, layer } = useHeartBurst(); */
export function useHeartBurst() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  const show = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();
    setBursts((b) => [...b, { id, x, y }]);
    window.setTimeout(() => setBursts((b) => b.filter((i) => i.id !== id)), 900);
  }, []);

  // Portale su <body>: le pagine animate usano transform, che sposterebbe un elemento "fixed"
  const layer = createPortal(
    <div className="fixed inset-0 z-[60] pointer-events-none" aria-hidden="true">
      <AnimatePresence>
        {bursts.map((b) => (
          <motion.div
            key={b.id}
            className="absolute"
            style={{ left: b.x - 48, top: b.y - 48 }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1.2, 1], opacity: [0, 1, 1] }}
            exit={{ scale: 1.4, opacity: 0, y: -40 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <Heart size={96} className="fill-white text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );

  return { show, layer };
}
