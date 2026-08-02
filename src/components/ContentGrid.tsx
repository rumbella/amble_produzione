import React, { useState, useEffect } from 'react';
import { GridItem, FeaturedSlot } from '../types';
import ContentCard from './ContentCard';
import FullWidthFeaturedSlot from './FullWidthFeaturedSlot';
import TracklistFeaturedSlot from './TracklistFeaturedSlot';

export type { GridItem, FeaturedSlot };

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
// CORE CONTENT GRID COMPONENT
// ===============================================

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
// DATA IMPORT & RE-EXPORTS (From src/data/featured.ts)
// ==========================================

export { MOCK_GRID_ITEMS, MOCK_FEATURED_SLOTS } from '../data/featured';

