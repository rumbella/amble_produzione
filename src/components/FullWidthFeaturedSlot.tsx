import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import { GridItem, FeaturedSlot } from '../types';

export interface FullWidthFeaturedSlotProps {
  slot: FeaturedSlot;
  onActionClick?: (item: GridItem | FeaturedSlot, actionType: string) => void;
}

export function FullWidthFeaturedSlot({
  slot,
  onActionClick
}: FullWidthFeaturedSlotProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Viewport IntersectionObserver to Auto play/pause video
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoElement.play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              setIsPlaying(false);
            });
        } else {
          videoElement.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(videoElement);
    return () => {
      if (videoElement) {
        observer.unobserve(videoElement);
      }
    };
  }, []);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleAction = (actionType: string) => {
    if (onActionClick) {
      onActionClick(slot, actionType);
    }
    setShowDropdown(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col mb-8 bg-transparent">
      {/* Video Container */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-950 aspect-[4/5] md:aspect-video shadow-xl border border-white/[0.05]">
        
        {/* Loading Skeleton */}
        {!loaded && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse rounded-2xl" />
        )}

        {/* Autoplay Video element */}
        <video
          ref={videoRef}
          src={slot.videoUrl}
          muted={isMuted}
          loop
          playsInline
          onLoadedData={() => setLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Unmute / Mute trigger overlays */}
        <button
          onClick={toggleMute}
          className="absolute top-3 right-3 bg-black/40 backdrop-blur-md hover:bg-black/75 text-white rounded-full p-2.5 shadow-lg transition-all duration-300 shrink-0 transform active:scale-95 z-10 cursor-pointer"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Info Row */}
      <div className="flex justify-between items-start mt-3 px-2">
        <div className="text-left select-none flex-1 pr-4">
          <div className="flex flex-col gap-0.5">
            {slot.brandName && (
              <span className="font-bold text-sm text-white tracking-wide uppercase">
                {slot.brandName}
              </span>
            )}
            
            <h3 className="text-sm md:text-base text-white/95 font-semibold mt-0.5">
              {slot.title}
            </h3>
            
            {slot.subtitle && (
              <p className="text-xs text-neutral-400 mt-0.5 font-sans font-light">
                {slot.subtitle}
              </p>
            )}

            {slot.isSponsored && (
              <span className="text-neutral-400 text-xs md:text-sm mt-0.5">
                Sponsorizzato
              </span>
            )}
          </div>
        </div>

        {/* Action Options */}
        <div className="relative shrink-0 mt-0.5">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
            aria-label="More options"
          >
            <MoreHorizontal size={18} />
          </button>

          {/* Dropdown for Slot */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 w-44 rounded-xl bg-zinc-950 border border-white/10 shadow-2xl p-1.5 z-30 text-left"
              >
                <button
                  onClick={() => handleAction('info')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-white/85 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  Scopri di più
                </button>
                <button
                  onClick={() => handleAction('share')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-white/85 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  Condividi
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default FullWidthFeaturedSlot;
