import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, MoreHorizontal, Share2, Heart, PlusCircle } from 'lucide-react';

// ==========================================
// TYPES & INTERFACES (TypeScript)
// ==========================================

export interface GridItem {
  id: string;
  type: 'image' | 'video';
  mediaUrl: string;
  aspectRatio: number;
  title?: string;
  brandName?: string;
  overflowMenu?: boolean;
}

export interface FeaturedSlot {
  id: string;
  type: 'adv' | 'promo' | 'djset' | 'podcast' | 'video_art' | 'tracklist';
  isSponsored: boolean;
  brandName?: string;
  title: string;
  subtitle?: string;
  videoUrl?: string;
  expiresAt?: string;
  isHighlight?: boolean; // dj set della settimana, va nel primo slot
  isFirstTracklist?: boolean;
  tracks?: any[];
}

export interface ContentGridProps {
  items: GridItem[];
  featuredSlots: FeaturedSlot[];
  itemsPerSlot?: number;
  onActionClick?: (item: GridItem | FeaturedSlot, actionType: string) => void;
  onCardClick?: (item: GridItem) => void;
  isPlaying?: boolean;
  togglePlay?: (url: string) => void;
  currentTrackUrl?: string | null;
  spotlightTracks?: any[];
}

// ==========================================
// PRIORITY LOGIC FOR FEATURED SLOTS
// ==========================================

/**
 * Returns an ordered queue of featured slots based on:
 * a) DJ set in evidenza della settimana (isHighlight: true) -> FIRST SLOT
 * b) Active ADV spots (isSponsored: true, not expired)
 * c) Promo video RadioAmblé
 * d) Other DJ sets / recent 90 MINS episodes
 * e) Video art / music videos
 * f) Podcast
 */
export function getFeaturedQueue(slots: FeaturedSlot[]): FeaturedSlot[] {
  if (!slots || slots.length === 0) return [];
  
  const now = new Date();
  
  const highlightList: FeaturedSlot[] = [];
  const advList: FeaturedSlot[] = [];
  const promoList: FeaturedSlot[] = [];
  const djsetList: FeaturedSlot[] = [];
  const videoArtList: FeaturedSlot[] = [];
  const podcastList: FeaturedSlot[] = [];

  slots.forEach(slot => {
    if (slot.isHighlight) {
      highlightList.push(slot);
    } else {
      const isAdv = slot.isSponsored && (!slot.expiresAt || new Date(slot.expiresAt) > now);
      if (isAdv) {
        advList.push(slot);
      } else if (slot.type === 'promo') {
        promoList.push(slot);
      } else if (slot.type === 'djset') {
        djsetList.push(slot);
      } else if (slot.type === 'video_art') {
        videoArtList.push(slot);
      } else if (slot.type === 'podcast') {
        podcastList.push(slot);
      }
    }
  });

  return [
    ...highlightList,
    ...advList,
    ...promoList,
    ...djsetList,
    ...videoArtList,
    ...podcastList
  ];
}

// ==========================================
// INDIVIDUAL CARD COMPONENT
// ==========================================

interface ContentCardProps {
  key?: string | number;
  item: GridItem;
  onActionClick?: (item: GridItem | FeaturedSlot, actionType: string) => void;
  onCardClick?: (item: GridItem) => void;
  isWideOnDesktop?: boolean;
}

function ContentCard({ 
  item, 
  onActionClick,
  onCardClick,
  isWideOnDesktop = false
}: ContentCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handleAction = (actionType: string) => {
    if (onActionClick) {
      onActionClick(item, actionType);
    }
    setShowDropdown(false);
  };

  return (
    <div 
      onClick={() => onCardClick?.(item)}
      className={`flex flex-col group mb-3 bg-transparent ${onCardClick ? 'cursor-pointer' : ''}`}
    >
      {/* Media Container with fixed aspect ratio: aspect-[8/5] for wide items on desktop to match height of aspect-[4/5] items */}
      <div 
        className={`relative rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/[0.06] shadow-md hover:shadow-xl transition-all duration-300 ease-out ${
          isWideOnDesktop ? 'aspect-[4/5] md:aspect-[8/5]' : 'aspect-[4/5]'
        }`}
      >
        {/* Skeleton Pulse Loader */}
        {!loaded && (
          <div className="absolute inset-0 bg-zinc-800 animate-pulse rounded-2xl" />
        )}

        {/* Media Rendering */}
        {item.type === 'image' ? (
          <img
            src={item.mediaUrl}
            alt={item.title || "RadioAmblé Media"}
            onLoad={() => setLoaded(true)}
            className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-700 ease-in-out ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        ) : (
          <video
            src={item.mediaUrl}
            muted
            loop
            autoPlay
            playsInline
            onLoadedData={() => setLoaded(true)}
            className={`w-full h-full object-cover select-none pointer-events-none transition-all duration-700 ease-in-out ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        )}
      </div>

      {/* Info Row UNDERNEATH/FUORI the image with fixed min-h-[3.5rem] */}
      <div className="flex justify-between items-start mt-2 px-1 min-h-[3.5rem]">
        <div className="text-left select-none pr-1.5 min-w-0 flex-1">
          {item.brandName && (
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold mb-0.5 truncate">
              {item.brandName}
            </p>
          )}
          {item.title && (
            <h4 className="text-xs md:text-sm font-semibold text-white leading-snug line-clamp-2">
              {item.title}
            </h4>
          )}
        </div>

        {/* More Actions Trigger Button */}
        <div className="relative shrink-0 mt-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-1 rounded-full bg-transparent hover:bg-white/5 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
            aria-label="More options"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Action Dropdown Menu */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-8 w-40 rounded-xl bg-zinc-950 border border-white/10 shadow-2xl p-1.5 z-20 text-left"
              >
                <button
                  onClick={() => handleAction('like')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <Heart size={14} /> Preferiti
                </button>
                <button
                  onClick={() => handleAction('share')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <Share2 size={14} /> Condividi
                </button>
                <button
                  onClick={() => handleAction('add')}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <PlusCircle size={14} /> Playlist
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// FULL WIDTH SLOT COMPONENT
// ==========================================

function FullWidthFeaturedSlot({
  slot,
  onActionClick
}: {
  slot: FeaturedSlot;
  onActionClick?: (item: GridItem | FeaturedSlot, actionType: string) => void;
}) {
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
      {/* Video Container: Aspect ratio vertical-ish [4/5] on mobile, aspect-video on desktop (xl) */}
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

        {/* Unmute / Mute trigger overlays in top-right of the video */}
        <button
          onClick={toggleMute}
          className="absolute top-3 right-3 bg-black/40 backdrop-blur-md hover:bg-black/75 text-white rounded-full p-2.5 shadow-lg transition-all duration-300 shrink-0 transform active:scale-95 z-10 cursor-pointer"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* SOTTO IL VIDEO: Brand name in bold, title, and if isSponsored the "Sponsorizzato" label in text-neutral-400 text-xs md:text-sm */}
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

// ==========================================
// TRACKLIST FEATURED SLOT COMPONENT
// ==========================================

function TracklistFeaturedSlot({
  slot,
  isPlaying,
  togglePlay,
  currentTrackUrl
}: {
  slot: FeaturedSlot;
  isPlaying: boolean;
  togglePlay?: (url: string) => void;
  currentTrackUrl: string | null;
}) {
  const tracks = slot.tracks || [];
  
  return (
    <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-[1450px] mx-auto flex flex-col mb-12 mt-4 text-left">
      {/* Header */}
      {slot.isFirstTracklist ? (
        <>
          <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
                {slot.title}
              </h2>
              {/* Info Circle */}
              <div className="relative group cursor-pointer">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4.5 h-4.5 text-white/40 hover:text-white/80 transition-colors"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-black/95 border border-white/10 rounded-xl text-[11px] text-white/80 leading-relaxed font-sans shadow-xl z-50">
                  Questi brani rappresentano selezioni esclusive e di alta qualità approvate dalla redazione di Radio Amblè.
                </div>
              </div>
            </div>
            <button className="text-xs text-[#ff2e55] font-display tracking-widest uppercase hover:underline transition-all">
              Vedi tutto
            </button>
          </div>
          {slot.subtitle && (
            <p className="font-sans text-xs text-white/40 mb-6 leading-relaxed">
              {slot.subtitle}
            </p>
          )}
        </>
      ) : (
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <h3 className="font-display font-bold text-sm text-neutral-400 tracking-wider uppercase">
            {slot.title || "Ancora Spotlight"}
          </h3>
        </div>
      )}

      {/* Grid: 1 col on mobile, 2 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track, i) => {
          const isCurrent = currentTrackUrl === track.audio;
          const isCurrentPlaying = isCurrent && isPlaying;
          return (
            <div
              key={i}
              onClick={() => togglePlay?.(track.audio)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group cursor-pointer ${
                isCurrent 
                  ? 'border-white/20 bg-white/[0.06] shadow-[0_4px_20px_rgba(255,46,85,0.15)]' 
                  : 'border-white/5 bg-[#121212]/30 hover:border-white/15 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#1a1a1a] border border-white/5 shadow-md">
                  <img
                    src={track.image}
                    alt=""
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isCurrentPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="w-8 h-8 rounded-full bg-white/15 backdrop-blur-md text-white flex items-center justify-center hover:scale-105 transition-transform">
                      {isCurrentPlaying ? (
                        <span className="flex items-end gap-[1.5px] h-3 w-3.5">
                          <span className="w-[1.5px] bg-white rounded-full animate-soundwave-1" />
                          <span className="w-[1.5px] bg-white rounded-full animate-soundwave-2" />
                          <span className="w-[1.5px] bg-white rounded-full animate-soundwave-3" />
                        </span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5 text-white">
                          <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className={`text-xs md:text-sm font-bold truncate tracking-wide uppercase transition-colors duration-300 ${isCurrent ? 'text-[#ff2e55]' : 'text-white group-hover:text-[#ff2e55]'}`}>
                      {track.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-white/50 truncate mt-1 font-sans">
                    {track.artist}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// CORE CONTENT GRID COMPONENT
// ==========================================

export function ContentGrid({
  items,
  featuredSlots,
  onActionClick,
  onCardClick,
  isPlaying,
  togglePlay,
  currentTrackUrl,
  spotlightTracks
}: ContentGridProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  // Responsive Hook to calculate columns and chunk sizes
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280); // xl breakpoint is 1280px
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const chunkSize = isDesktop ? 3 : 2;
  const colCount = isDesktop ? 4 : 2;

  // Build the ordered priority queue of video/featured slots
  const queue = getFeaturedQueue(featuredSlots);

  // Build programmatic tracklist slots by chunking the spotlightTracks by 4
  const tracklistSlots: FeaturedSlot[] = [];
  if (spotlightTracks && spotlightTracks.length > 0) {
    const tracklistChunkSize = 4;
    for (let i = 0; i < spotlightTracks.length; i += tracklistChunkSize) {
      const chunkTracks = spotlightTracks.slice(i, i + tracklistChunkSize);
      const index = i / tracklistChunkSize;
      tracklistSlots.push({
        id: `tracklist-slot-${index + 1}`,
        type: 'tracklist',
        isSponsored: false,
        title: index === 0 ? 'DJ Set Spotlight' : 'Spotlight Continua',
        subtitle: index === 0 ? 'Selezioni mixate ed esclusive per far vibrare il tuo spazio' : undefined,
        isFirstTracklist: index === 0,
        tracks: chunkTracks
      });
    }
  }

  // Partition the items array into chunks of dynamic size `chunkSize`
  const itemChunks: GridItem[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    itemChunks.push(items.slice(i, i + chunkSize));
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {itemChunks.map((chunk, chunkIndex) => {
        // Select slot to insert after this chunk using alternating cadence:
        // Even indices (0, 2, 4...) -> VIDEO/FEATURED slots
        // Odd indices (1, 3, 5...) -> TRACKLIST slots
        // This guarantees tracklists are never consecutive, separated by video/featured slots
        const slot = (() => {
          if (chunkIndex >= itemChunks.length - 1) return null; // No slot after the last chunk

          const isEven = chunkIndex % 2 === 0;
          if (isEven) {
            const videoIndex = Math.floor(chunkIndex / 2);
            if (queue.length === 0) return null;
            if (videoIndex < queue.length) {
              return queue[videoIndex];
            }
            // Cycle back skipping the highlight (first item if it's highlighed)
            const nonHighlightStartIndex = queue.findIndex(item => !item.isHighlight);
            const startIndex = nonHighlightStartIndex !== -1 ? nonHighlightStartIndex : 0;
            const cycleLength = queue.length - startIndex;
            if (cycleLength <= 0) {
              return queue[0];
            }
            const cycleIndex = startIndex + ((videoIndex - startIndex) % cycleLength);
            return queue[cycleIndex];
          } else {
            // Tracklist slot
            if (tracklistSlots.length === 0) {
              // Fallback to video slot if no tracklists are configured
              const videoIndex = Math.floor(chunkIndex / 2);
              if (queue.length === 0) return null;
              return queue[videoIndex % queue.length];
            }
            const tracklistIndex = Math.floor(chunkIndex / 2);
            return tracklistSlots[tracklistIndex % tracklistSlots.length];
          }
        })();

        // Create the vertical stacks (masonry-like effect)
        const columns: GridItem[][] = Array.from({ length: colCount }, () => []);
        chunk.forEach((item, index) => {
          columns[index % colCount].push(item);
        });

        return (
          <React.Fragment key={chunkIndex}>
            
            {/* Custom Multi-Column stack layout */}
            {isDesktop ? (
              <div className="grid grid-cols-4 gap-4">
                {chunk.map((item, index) => {
                  const isMiddle = index === 1;
                  return (
                    <div 
                      key={item.id} 
                      className={isMiddle ? "col-span-2" : "col-span-1"}
                    >
                      <ContentCard 
                        item={item} 
                        onActionClick={onActionClick} 
                        onCardClick={onCardClick}
                        isWideOnDesktop={isMiddle}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {columns.map((col, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2">
                    {col.map((item) => (
                      <ContentCard 
                        key={item.id} 
                        item={item} 
                        onActionClick={onActionClick} 
                        onCardClick={onCardClick}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Interrupter Full-Width Featured/Tracklist Slot */}
            {slot && chunkIndex < itemChunks.length - 1 && (
              slot.type === 'tracklist' ? (
                <TracklistFeaturedSlot
                  slot={slot}
                  isPlaying={isPlaying || false}
                  togglePlay={togglePlay}
                  currentTrackUrl={currentTrackUrl || null}
                />
              ) : (
                <FullWidthFeaturedSlot 
                  slot={slot} 
                  onActionClick={onActionClick} 
                />
              )
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ==========================================
// MOCK DATA GENERATION (11 Elements)
// ==========================================

export const MOCK_GRID_ITEMS: GridItem[] = [
  {
    id: 'grid-1',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 0.75, // Portrait (3/4)
    brandName: 'RadioAmblé',
    title: 'Electronic Sessions Vol. 4',
  },
  {
    id: 'grid-2',
    type: 'video',
    mediaUrl: 'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_b85bbea7-d3d7-4d23-8397-cc797d40db6d_generated_video.MP4',
    aspectRatio: 0.5625, // Vertical (9:16)
    brandName: 'Phoenix Selecta',
    title: 'Live Ambient Flow',
  },
  {
    id: 'grid-3',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.5, // Landscape (3/2)
    brandName: 'Stiv Tirella',
    title: 'Vinyl Collectors Night',
  },
  {
    id: 'grid-4',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.0, // Square
    brandName: 'Musik & Talk',
    title: 'Episode #42: Special Guest',
  },
  {
    id: 'grid-5',
    type: 'video',
    mediaUrl: 'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_d4aa45e7-83be-4318-b00a-3684afdd7624_generated_video.MP4',
    aspectRatio: 1.777, // Widescreen (16:9)
    brandName: 'Club Selection',
    title: 'Late Night House Set',
  },
  {
    id: 'grid-6',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 0.8, // Tall Portrait
    brandName: 'Accademia A.i.D.',
    title: 'Digital Beats Synthesis',
  },
  {
    id: 'grid-7',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.25, // Balanced Landscape
    brandName: 'Albi Scotti',
    title: 'Club Culture Chronicles',
  },
  {
    id: 'grid-8',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1487180142328-054b783fc471?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.33, // Landscape (4/3)
    brandName: 'RadioAmblé',
    title: 'Synthesizer Special Sessions',
  },
  {
    id: 'grid-9',
    type: 'video',
    mediaUrl: 'https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_ed66afeb-20ab-4bf2-8ad6-016d76d9fdfe_generated_video.MP4',
    aspectRatio: 0.5625, // Vertical (9:16)
    brandName: 'Visuals Live',
    title: 'Neon Lightwaves Rhythm',
  },
  {
    id: 'grid-10',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 0.7, // Extra Tall Portrait
    brandName: 'Francesco Farfa',
    title: 'Progressive Masterclass',
  },
  {
    id: 'grid-11',
    type: 'image',
    mediaUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&auto=format&fit=crop&q=80',
    aspectRatio: 1.5, // Landscape (3/2)
    brandName: 'RadioAmblé Live',
    title: 'Mainstage Crowd Anthems',
  }
];

export const MOCK_FEATURED_SLOTS: FeaturedSlot[] = [
  {
    id: 'slot-djset-highlight',
    type: 'djset',
    isSponsored: false,
    isHighlight: true, // DJ set della settimana! Should go first!
    brandName: 'DJ SET DELLA SETTIMANA',
    title: 'Francesco Farfa Live @ Amblé',
    subtitle: 'Una selezione ipnotica registrata dal vivo nei nostri studi.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-adv-active',
    type: 'adv',
    isSponsored: true,
    brandName: 'Heineken Italia',
    title: 'Live Your Music - Heineken Sessions',
    subtitle: 'Il ritmo esclusivo incontra l’estate. Scopri la line-up esclusiva di stasera.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4',
    expiresAt: '2028-12-31' // Active/Non-expired
  },
  {
    id: 'slot-promo',
    type: 'promo',
    isSponsored: false,
    brandName: 'RadioAmblé Official',
    title: 'Summer Dance Festival 2026',
    subtitle: 'Iscriviti ora per partecipare all’evento elettronico dell’anno sulla riviera.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-djset',
    type: 'djset',
    isSponsored: false,
    brandName: '90 MINS OF MUSIC',
    title: 'Alex Neri exclusive 90 MINS session',
    subtitle: 'Un viaggio profondo nell’house elettronica firmato Alex Neri.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-video-art',
    type: 'video_art',
    isSponsored: false,
    brandName: 'Visual Art Section',
    title: 'Neon Lightwaves Rhythm - Abstract 4K',
    subtitle: 'Un’opera d’arte generativa sul flusso luminoso della musica.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-podcast',
    type: 'podcast',
    isSponsored: false,
    brandName: 'Musik & Talk Podcast',
    title: 'Albi Scotti in-depth interview',
    subtitle: 'Riflessioni sulla cultura del clubbing italiano, aneddoti e sfide future.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4'
  },
  {
    id: 'slot-adv-expired',
    type: 'adv',
    isSponsored: true,
    brandName: 'Expired Brands',
    title: 'Winter Selection 2025',
    subtitle: 'Questo annuncio promozionale è scaduto e non dovrebbe avere la massima priorità.',
    videoUrl: 'https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4',
    expiresAt: '2024-12-31' // Expired
  }
];
