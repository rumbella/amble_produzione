import { useEffect } from 'react';

/**
 * useViewportHeight
 * 
 * Accurately measures the visible dynamic viewport height and synchronizes it 
 * with the CSS custom property `--app-height` on `document.documentElement`.
 * 
 * Why this is necessary:
 * Standard `100vh` on mobile browsers (iOS Safari, Android Chrome, and PWA standalone)
 * is calculated based on the maximum screen height (assuming toolbars/address bar are retracted).
 * When toolbars are visible or change during scroll, elements positioned with `100vh` or fixed offsets
 * are clipped or overlapped by the browser chrome or software navigation bar.
 * 
 * Features:
 * - Uses `window.visualViewport.height` if supported (provides the exact pixel height of the visible area)
 * - Falls back to `window.innerHeight`
 * - Listens to `resize`, `orientationchange`, and `visualViewport`'s `resize` & `scroll` events
 * - Handles software keyboards, address bar expansions, and orientation shifts
 */
export function useViewportHeight() {
  useEffect(() => {
    const updateAppHeight = () => {
      // visualViewport is the most accurate measurement on mobile devices
      const height = window.visualViewport 
        ? window.visualViewport.height 
        : window.innerHeight;

      if (height > 0) {
        document.documentElement.style.setProperty('--app-height', `${height}px`);
      }
    };

    // Run initially
    updateAppHeight();

    // Standard window resize and orientation change
    window.addEventListener('resize', updateAppHeight, { passive: true });
    window.addEventListener('orientationchange', updateAppHeight, { passive: true });

    // visualViewport events (critical for iOS Safari and Android Chrome address bar collapsing/expanding)
    const visualViewport = window.visualViewport;
    if (visualViewport) {
      visualViewport.addEventListener('resize', updateAppHeight, { passive: true });
      visualViewport.addEventListener('scroll', updateAppHeight, { passive: true });
    }

    return () => {
      window.removeEventListener('resize', updateAppHeight);
      window.removeEventListener('orientationchange', updateAppHeight);
      if (visualViewport) {
        visualViewport.removeEventListener('resize', updateAppHeight);
        visualViewport.removeEventListener('scroll', updateAppHeight);
      }
    };
  }, []);
}

export default useViewportHeight;
