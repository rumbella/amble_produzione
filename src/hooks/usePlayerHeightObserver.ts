import { useEffect, useRef } from 'react';

/**
 * usePlayerHeightObserver
 * 
 * Uses ResizeObserver to dynamically track the rendered height of the player card
 * and publishes it to the CSS custom property `--player-height`.
 * 
 * This enables any scrollable container or layout element to adapt its offsets
 * responsively without hardcoded magic numbers.
 */
export function usePlayerHeightObserver<T extends HTMLElement = HTMLDivElement>() {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const updateHeight = () => {
      const rect = el.getBoundingClientRect();
      const height = rect.height;
      if (height > 0) {
        document.documentElement.style.setProperty('--player-height', `${height}px`);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
        if (height > 0) {
          document.documentElement.style.setProperty('--player-height', `${height}px`);
        }
      }
    });

    resizeObserver.observe(el);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return elementRef;
}

export default usePlayerHeightObserver;
