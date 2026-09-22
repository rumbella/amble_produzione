import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, Sparkles } from 'lucide-react';
import { PageSponsor } from '../types';

export interface SponsorSpotModalProps {
  sponsor: PageSponsor;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Hook to manage sponsor spot modal state, including one-time auto trigger per session
 */
export function useSponsorSpot(sponsor?: PageSponsor) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!sponsor || sponsor.popupTrigger !== 'auto') return;
    const storageKey = `amble_sponsor_seen_${sponsor.sponsorName.toLowerCase().replace(/\s+/g, '_')}`;
    const alreadySeen = sessionStorage.getItem(storageKey);
    if (!alreadySeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(storageKey, 'true');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [sponsor]);

  return {
    isOpen,
    openSpot: () => setIsOpen(true),
    closeSpot: () => setIsOpen(false),
  };
}

/**
 * Modal dialog displaying the sponsor's short video spot.
 * Supports auto-opening once per session (via sessionStorage) when popupTrigger === 'auto',
 * or manual opening when tapping the sponsor marquee.
 */
export function SponsorSpotModal({
  sponsor,
  isOpen,
  onClose,
}: SponsorSpotModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play when open, pause on close
  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay with sound might be blocked, fallback muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    } else if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Spot sponsor ${sponsor.sponsorName}`}
    >
      <div 
        className="relative w-full max-w-lg bg-[#121215] border border-white/15 rounded-2xl overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-space font-bold tracking-[0.2em] text-[#ff2e55] uppercase px-2 py-0.5 rounded bg-[#ff2e55]/10 border border-[#ff2e55]/20">
              <Sparkles size={11} />
              SPONSOR SPOT
            </span>
            <span className="text-xs font-space font-bold text-white tracking-wider">
              {sponsor.sponsorName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-white/80 hover:text-white transition-all"
            aria-label="Chiudi spot"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            src={sponsor.popupVideoSrc}
            autoPlay
            playsInline
            controls
            className="w-full h-full object-contain"
          />
        </div>

        {/* Footer info */}
        <div className="px-5 py-3.5 bg-black/40 flex items-center justify-between text-left">
          <p className="text-[11px] font-sans text-white/60 line-clamp-1">
            {sponsor.marqueeText}
          </p>
          <button
            onClick={onClose}
            className="ml-3 shrink-0 px-3 py-1 rounded-full bg-white text-black font-space text-[10px] font-bold tracking-wider hover:bg-white/90 transition-colors uppercase"
          >
            Continua
          </button>
        </div>
      </div>
    </div>
  );
}

export default SponsorSpotModal;
