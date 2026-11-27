import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Download, Share, SquarePlus, X } from 'lucide-react';

/* ---------- stato dell'installazione ---------- */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const KEY_VISITS = 'ra_visits';
const KEY_DISMISSED = 'ra_install_dismissed_at';
const KEY_INSTALLED = 'ra_installed';
const SHOW_FROM_VISIT = 3;
const SNOOZE_DAYS = 30;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // niente mini-banner automatico di Chrome: lo proponiamo noi al momento giusto
    deferredPrompt = e as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    try {
      localStorage.setItem(KEY_INSTALLED, '1');
    } catch {
      /* ok */
    }
    notify();
  });
}


function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  const ua = navigator.userAgent;
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return /iphone|ipad|ipod/i.test(ua) || iPadOs;
}

function isIosSafari() {
  // Su iOS si installa solo da Safari (e dai browser che usano il suo menu Condividi): escludi app con browser interno tipo Instagram
  return isIos() && !/instagram|fbav|fban|tiktok|line\//i.test(navigator.userAgent);
}

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Stato condiviso: si può installare? come? */
export function useInstallApp() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const installed = typeof window !== 'undefined' && (isStandalone() || read(KEY_INSTALLED) === '1');
  const mode: 'native' | 'ios' | null = installed
    ? null
    : deferredPrompt
      ? 'native'
      : typeof window !== 'undefined' && isIosSafari()
        ? 'ios'
        : null;

  const install = async (): Promise<'accepted' | 'dismissed' | 'ios' | 'unavailable'> => {
    if (mode === 'ios') return 'ios';
    if (!deferredPrompt) return 'unavailable';
    const p = deferredPrompt;
    deferredPrompt = null;
    await p.prompt();
    const { outcome } = await p.userChoice;
    notify();
    return outcome;
  };

  return { canInstall: mode !== null, mode, installed, install };
}

/* ---------- istruzioni iPhone ---------- */

export function IosInstallSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            data-no-swipe
            className="w-full max-w-md m-3 rounded-2xl bg-[#121214] border border-white/10 p-5 text-white"
            style={{ marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            exit={{ y: 60 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-space font-bold tracking-wide">Installa Radio Amblè</h3>
              <button onClick={onClose} aria-label="Chiudi" className="text-white/50 -mr-1 -mt-1 p-1">
                <X size={18} />
              </button>
            </div>
            <ol className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">1</span>
                Tocca <Share size={18} className="inline text-[#0a84ff]" /> <b>Condividi</b> nella barra di Safari
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">2</span>
                Scegli <SquarePlus size={18} className="inline" /> <b>Aggiungi alla schermata Home</b>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">3</span>
                Tocca <b>Aggiungi</b>: la radio sarà tra le tue app
              </li>
            </ol>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- pulsante (es. nel Profilo) ---------- */

export function InstallButton({ className = '' }: { className?: string }) {
  const { canInstall, install } = useInstallApp();
  const [iosOpen, setIosOpen] = useState(false);
  if (!canInstall) return null;
  return (
    <>
      <button
        onClick={async () => {
          if ((await install()) === 'ios') setIosOpen(true);
        }}
        className={`flex items-center justify-center gap-2 rounded-full bg-white text-black font-bold text-sm px-5 py-3 ${className}`}
      >
        <Download size={16} /> Installa l'app
      </button>
      <IosInstallSheet open={iosOpen} onClose={() => setIosOpen(false)} />
    </>
  );
}

/* ---------- banner automatico dalla 3ª visita ---------- */

export function InstallBanner() {
  const { canInstall, install } = useInstallApp();
  const [show, setShow] = useState(false);
  const [iosOpen, setIosOpen] = useState(false);

  useEffect(() => {
    let visits = 0;
    try {
      // una "visita" per sessione del browser
      if (!sessionStorage.getItem('ra_visit_counted')) {
        visits = Number(localStorage.getItem(KEY_VISITS) || '0') + 1;
        localStorage.setItem(KEY_VISITS, String(visits));
        sessionStorage.setItem('ra_visit_counted', '1');
      } else {
        visits = Number(localStorage.getItem(KEY_VISITS) || '0');
      }
    } catch {
      return;
    }
    const dismissedAt = Number(read(KEY_DISMISSED) || '0');
    const snoozed = Date.now() - dismissedAt < SNOOZE_DAYS * 864e5;
    if (visits >= SHOW_FROM_VISIT && !snoozed) {
      const t = window.setTimeout(() => setShow(true), 8000); // non appena aperta: lascia prima ascoltare
      return () => window.clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(KEY_DISMISSED, String(Date.now()));
    } catch {
      /* ok */
    }
  };

  return (
    <>
      <AnimatePresence>
        {show && canInstall && (
          <motion.div
            data-no-swipe
            className="fixed z-[55] left-2 right-2 md:left-auto md:right-4 md:w-[360px] rounded-2xl bg-[#121214]/95 backdrop-blur-xl border border-white/10 p-3 flex items-center gap-3 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            style={{ top: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
          >
            <img
              src="https://radioamble-cdn.b-cdn.net/Nuova%20cartella%20(1)/icon-192x192.png"
              alt=""
              className="w-10 h-10 rounded-xl shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-space font-bold text-[13px]">Radio Amblè sul tuo telefono</p>
              <p className="text-[11px] text-white/55">Un tocco e sei in diretta, senza aprire il browser.</p>
            </div>
            <button
              onClick={async () => {
                const r = await install();
                if (r === 'ios') setIosOpen(true);
                setShow(false);
              }}
              className="rounded-full bg-white text-black text-xs font-bold px-3 py-2 shrink-0"
            >
              Installa
            </button>
            <button onClick={dismiss} aria-label="Non ora" className="text-white/40 p-1 shrink-0">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <IosInstallSheet open={iosOpen} onClose={() => setIosOpen(false)} />
    </>
  );
}
