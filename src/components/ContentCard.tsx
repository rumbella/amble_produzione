import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MoreHorizontal, Heart, Share2, PlusCircle } from 'lucide-react';
import { GridItem, FeaturedSlot } from '../types';

export interface ContentCardProps {
  key?: any;
  item: GridItem;
  onActionClick?: (item: GridItem | FeaturedSlot, actionType: string) => void;
  onCardClick?: (item: GridItem) => void;
  isWideOnDesktop?: boolean;
}

export function ContentCard({ 
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
      {/* Media Container */}
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
            className={`w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-700 ease-in-out ${
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
            className={`w-full h-full object-cover object-center select-none pointer-events-none transition-all duration-700 ease-in-out ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          />
        )}
      </div>

      {/* Info Row UNDERNEATH/FUORI the image */}
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

export default ContentCard;
