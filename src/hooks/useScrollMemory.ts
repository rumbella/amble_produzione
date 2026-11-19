import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router';

// Module-level map: pathname -> scrollTop
const scrollPositions = new Map<string, number>();

let previousPathname = '';
let isRestoringGlobal = false;

type ScrollResetListener = (scrollTop: number) => void;
const scrollResetListeners = new Set<ScrollResetListener>();

export function setPreviousPathname(path: string) {
  previousPathname = path;
}

export function getPreviousPathname(): string {
  return previousPathname;
}

export function isRestoringScroll(): boolean {
  return isRestoringGlobal;
}

export function setIsRestoringScroll(val: boolean) {
  isRestoringGlobal = val;
}

export function registerScrollResetListener(listener: ScrollResetListener) {
  scrollResetListeners.add(listener);
  return () => {
    scrollResetListeners.delete(listener);
  };
}

export function notifyScrollRestored(scrollTop: number) {
  scrollResetListeners.forEach((fn) => {
    try {
      fn(scrollTop);
    } catch (e) {
      console.error(e);
    }
  });
}

const normalizePath = (path: string) => {
  if (!path) return '';
  const trimmed = path.replace(/\/+$/, '');
  return trimmed || '/';
};

export function useScrollMemory<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null);
  const location = useLocation();
  const isRestoringRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const currentPath = normalizePath(location.pathname);
    const prevPath = normalizePath(previousPathname);

    // Only restore position if coming from a child page (e.g. /djset/8 -> /djset, /djset/8/song/2 -> /djset/8)
    const isFromChild = prevPath.startsWith(currentPath === '/' ? '/placeholder' : currentPath + '/');

    let rafId: number | null = null;
    let saveRafId: number | null = null;
    let isCancelled = false;

    if (isFromChild) {
      const targetScrollTop = scrollPositions.get(currentPath) || 0;

      if (targetScrollTop > 0) {
        isRestoringRef.current = true;
        setIsRestoringScroll(true);

        const startTime = performance.now();

        const attemptRestore = () => {
          if (isCancelled || !containerRef.current) {
            isRestoringRef.current = false;
            setIsRestoringScroll(false);
            return;
          }

          const currentEl = containerRef.current;
          currentEl.scrollTop = targetScrollTop;

          // Notify header to not hide
          notifyScrollRestored(targetScrollTop);

          const elapsed = performance.now() - startTime;
          const reached = Math.abs(currentEl.scrollTop - targetScrollTop) < 2;

          if (reached || elapsed >= 800) {
            isRestoringRef.current = false;
            setIsRestoringScroll(false);
            notifyScrollRestored(currentEl.scrollTop);
            return;
          }

          rafId = requestAnimationFrame(attemptRestore);
        };

        rafId = requestAnimationFrame(attemptRestore);
      } else {
        el.scrollTop = 0;
        notifyScrollRestored(0);
      }
    } else {
      // In all other cases (tab change, open from menu, etc.), start from top
      el.scrollTop = 0;
      scrollPositions.set(currentPath, 0);
      notifyScrollRestored(0);
    }

    // Cancel restoration if user starts interacting directly
    const stopRestoration = () => {
      if (isRestoringRef.current) {
        isCancelled = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
        isRestoringRef.current = false;
        setIsRestoringScroll(false);
        if (containerRef.current) {
          scrollPositions.set(currentPath, containerRef.current.scrollTop);
          notifyScrollRestored(containerRef.current.scrollTop);
        }
      }
    };

    el.addEventListener('touchstart', stopRestoration, { passive: true });
    el.addEventListener('wheel', stopRestoration, { passive: true });
    el.addEventListener('pointerdown', stopRestoration, { passive: true });

    // Track scroll events with requestAnimationFrame (not on every raw event)
    const handleScroll = () => {
      if (isRestoringRef.current) return;
      if (saveRafId !== null) return;
      saveRafId = requestAnimationFrame(() => {
        saveRafId = null;
        if (containerRef.current && !isRestoringRef.current) {
          scrollPositions.set(currentPath, containerRef.current.scrollTop);
        }
      });
    };

    el.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      isCancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (saveRafId !== null) cancelAnimationFrame(saveRafId);
      el.removeEventListener('touchstart', stopRestoration);
      el.removeEventListener('wheel', stopRestoration);
      el.removeEventListener('pointerdown', stopRestoration);
      el.removeEventListener('scroll', handleScroll);

      if (containerRef.current && !isRestoringRef.current) {
        scrollPositions.set(currentPath, containerRef.current.scrollTop);
      }
      isRestoringRef.current = false;
      setIsRestoringScroll(false);
    };
  }, [location.pathname]);

  return containerRef;
}
