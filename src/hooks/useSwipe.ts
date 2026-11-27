import { useEffect, useRef } from 'react';

export type SwipeDir = 'left' | 'right' | 'up' | 'down';

export interface SwipeHandlers {
  onSwipe?: (dir: SwipeDir) => void;
  onDoubleTap?: (x: number, y: number) => void;
  onLongPress?: () => void;
}

const MIN_DIST = 60; // px minimi per contare come swipe
const MAX_TIME = 700; // ms massimi del gesto
const DIRECTION_RATIO = 1.5; // il movimento principale deve essere 1,5x l'altro asse
const EDGE = 24; // px dal bordo sinistro: lasciati al "indietro" di sistema (iOS/Android)
const DOUBLE_TAP_MS = 300;
const LONG_PRESS_MS = 550;
const TAP_SLOP = 10;

/**
 * true se il tocco parte su un elemento dove le gesture non devono intervenire.
 * Controlla solo gli elementi DENTRO il nodo dello hook: un data-no-swipe sul nodo stesso
 * blocca le gesture delle pagine sotto, ma non quelle del suo hook.
 */
function shouldIgnore(target: EventTarget | null, axis: 'x' | 'y' | 'any', root: HTMLElement): boolean {
  let el = target instanceof Element ? target : null;
  while (el && el !== root && el !== document.body) {
    if (el.hasAttribute('data-no-swipe')) return true;
    if (el.matches('input, textarea, select, [contenteditable="true"]')) return true;
    const style = window.getComputedStyle(el);
    // Caroselli e liste orizzontali: lo swipe orizzontale serve a loro
    if (axis === 'x' && /(auto|scroll)/.test(style.overflowX) && el.scrollWidth > el.clientWidth + 2) return true;
    // Contenuti che scorrono in verticale: lo swipe giù vale solo se sono già in cima
    if (axis === 'y' && /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 2 && el.scrollTop > 0)
      return true;
    el = el.parentElement;
  }
  return false;
}

/**
 * Gesture touch su un elemento: swipe nelle 4 direzioni, doppio tocco, tocco lungo.
 * Solo dita (touch), il mouse non è coinvolto.
 */
export function useSwipe<T extends HTMLElement>(handlers: SwipeHandlers, enabled = true) {
  const ref = useRef<T | null>(null);
  const h = useRef(handlers);
  h.current = handlers;

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;

    let startX = 0;
    let startY = 0;
    let startT = 0;
    let startTarget: EventTarget | null = null;
    let moved = false;
    let multi = false;
    let lastTapT = 0;
    let lastTapX = 0;
    let lastTapY = 0;
    let longTimer: number | undefined;
    let longFired = false;

    const clearLong = () => {
      if (longTimer) window.clearTimeout(longTimer);
      longTimer = undefined;
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        multi = true;
        clearLong();
        return;
      }
      multi = false;
      moved = false;
      longFired = false;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      startT = Date.now();
      startTarget = e.target;
      clearLong();
      if (h.current.onLongPress && !shouldIgnore(e.target, 'any', node)) {
        longTimer = window.setTimeout(() => {
          if (!moved && !multi) {
            longFired = true;
            navigator.vibrate?.(15);
            h.current.onLongPress?.();
          }
        }, LONG_PRESS_MS);
      }
    };

    const onMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      if (Math.abs(t.clientX - startX) > TAP_SLOP || Math.abs(t.clientY - startY) > TAP_SLOP) {
        moved = true;
        clearLong();
      }
    };

    const onEnd = (e: TouchEvent) => {
      clearLong();
      if (multi || longFired) return;
      const t = e.changedTouches[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = Date.now() - startT;

      // Tocco (non movimento): controlla il doppio tocco
      if (!moved) {
        if (!h.current.onDoubleTap || shouldIgnore(startTarget, 'any', node)) return;
        if ((startTarget as Element | null)?.closest?.('button, a')) return;
        const now = Date.now();
        if (now - lastTapT < DOUBLE_TAP_MS && Math.abs(t.clientX - lastTapX) < 40 && Math.abs(t.clientY - lastTapY) < 40) {
          lastTapT = 0;
          h.current.onDoubleTap(t.clientX, t.clientY);
        } else {
          lastTapT = now;
          lastTapX = t.clientX;
          lastTapY = t.clientY;
        }
        return;
      }

      if (!h.current.onSwipe || dt > MAX_TIME) return;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);

      if (ax >= MIN_DIST && ax > ay * DIRECTION_RATIO) {
        if (startX < EDGE || startX > window.innerWidth - EDGE) return; // bordi lasciati al sistema
        if (shouldIgnore(startTarget, 'x', node)) return;
        h.current.onSwipe(dx < 0 ? 'left' : 'right');
      } else if (ay >= MIN_DIST && ay > ax * DIRECTION_RATIO) {
        if (shouldIgnore(startTarget, 'y', node)) return;
        h.current.onSwipe(dy < 0 ? 'up' : 'down');
      }
    };

    const onCancel = () => {
      clearLong();
      multi = true;
    };

    node.addEventListener('touchstart', onStart, { passive: true });
    node.addEventListener('touchmove', onMove, { passive: true });
    node.addEventListener('touchend', onEnd, { passive: true });
    node.addEventListener('touchcancel', onCancel, { passive: true });
    return () => {
      clearLong();
      node.removeEventListener('touchstart', onStart);
      node.removeEventListener('touchmove', onMove);
      node.removeEventListener('touchend', onEnd);
      node.removeEventListener('touchcancel', onCancel);
    };
  }, [enabled]);

  return ref;
}
