import React, { useRef, useEffect } from 'react';
import { MediaCategoryItem as CarouselItem } from '../types';

export type { CarouselItem };

const LongArrowLeft = ({ size = 20, strokeWidth = 1.5, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size * 1.6} 
    height={size} 
    viewBox="0 0 38 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M36 12H4" />
    <path d="M11 5L4 12l7 7" />
  </svg>
);

const LongArrowRight = ({ size = 20, strokeWidth = 1.5, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size * 1.6} 
    height={size} 
    viewBox="0 0 38 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 12H34" />
    <path d="M27 5l7 7-7 7" />
  </svg>
);

interface InfiniteCarouselProps {
  items: CarouselItem[];
  type: 'playlist' | 'podcast' | 'djset';
  onItemClick: (id: number) => void;
}

export function InfiniteCarousel({ items, type, onItemClick }: InfiniteCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // We only replicate the list if we have more than 2 items to provide an infinite loop effect
  const shouldLoop = items.length > 2;
  const repeatedItems = shouldLoop ? Array(5).fill(items).flat() : items;

  // Handle boundary resets on scroll to create the infinite illusion
  const handleScroll = () => {
    if (!shouldLoop) return;
    const container = scrollRef.current;
    if (!container) return;

    const S = container.scrollWidth;
    const cycleWidth = S / 5;
    const left = container.scrollLeft;

    // Reset scroll margins dynamically before they ever hit the scroll limits
    if (left < cycleWidth * 1.2) {
      container.scrollLeft = left + cycleWidth;
    } else if (left > cycleWidth * 3.8) {
      container.scrollLeft = left - cycleWidth;
    }
  };

  // Setup Observer and initial middle-scroll center on mount & list updates
  useEffect(() => {
    if (!shouldLoop) return;
    const container = scrollRef.current;
    if (!container) return;

    const centerScroll = () => {
      const S = container.scrollWidth;
      const cycleWidth = S / 5;
      container.scrollLeft = cycleWidth * 2;
    };

    const observer = new ResizeObserver(() => {
      centerScroll();
    });
    observer.observe(container);

    // Initial warm center scroll to middle set of items
    const timer = setTimeout(() => {
      centerScroll();
    }, 40);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [items, shouldLoop]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    // Retrieve the actual rendered card width dynamically
    const firstCard = container.firstElementChild as HTMLElement;
    const scrollAmount = firstCard ? firstCard.offsetWidth + 24 : 500;

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative group/carousel w-full overflow-visible">
      {/* Scroll Navigation Overlay - Left (Aligned with the layout boundaries dynamically) */}
      {shouldLoop && (
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-6 xl:left-[calc((100vw-1600px)/2+2.5rem)] top-[55%] -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/95 text-white border border-white/10 items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer"
          aria-label="Scorri a sinistra"
        >
          <LongArrowLeft size={16} strokeWidth={1.5} />
        </button>
      )}

      {/* Scroll Navigation Overlay - Right (Aligned with the layout boundaries dynamically) */}
      {shouldLoop && (
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-6 xl:right-[calc((100vw-1600px)/2+2.5rem)] top-[55%] -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/95 text-white border border-white/10 items-center justify-center backdrop-blur-md opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer"
          aria-label="Scorri a destra"
        >
          <LongArrowRight size={16} strokeWidth={1.5} />
        </button>
      )}

      {/* Infinite Scroll Container (using padding to align first elements but allowing edge-to-edge scrolling) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex ${!shouldLoop ? 'justify-start md:justify-center overflow-x-hidden' : 'overflow-x-auto'} gap-6 pb-12 px-6 sm:px-10 xl:px-[calc(max(2.5rem,(100vw-1600px)/2+2.5rem))] snap-x snap-mandatory no-scrollbar select-none`}
      >
        {repeatedItems.map((p, idx) => (
          <div
            key={`${p.id}-${idx}`}
            onClick={() => onItemClick(p.id)}
            className="flex-shrink-0 w-[80vw] sm:w-[440px] md:w-[500px] lg:w-[560px] xl:w-[640px] flex flex-col cursor-pointer group select-none snap-start"
          >
            {/* Apple Music Style Rounded Landscape Card */}
            {type === 'playlist' && (
              <div className="relative w-full aspect-[1.58] rounded-2xl md:rounded-[24px] overflow-hidden bg-[#181818] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5">
                <div className="w-full h-full grid grid-cols-2 grid-rows-2 group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                  <img src={`https://picsum.photos/seed/${p.seed}a/300`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <img src={`https://picsum.photos/seed/${p.seed}b/300`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <img src={`https://picsum.photos/seed/${p.seed}c/300`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <img src={`https://picsum.photos/seed/${p.seed}d/300`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            )}

            {type === 'podcast' && (
              <div className="relative w-full aspect-[1.58] rounded-2xl md:rounded-[24px] overflow-hidden bg-[#181818] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5">
                <img
                  src={p.imageUrl || `https://picsum.photos/seed/${p.seed}/600`}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {type === 'djset' && (
              p.id === 1 ? (
                <div className="relative w-full aspect-[1.58] rounded-2xl md:rounded-[24px] overflow-hidden bg-transparent">
                  <img
                    src={p.imageUrl || `https://picsum.photos/seed/${p.seed}/600`}
                    alt=""
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="relative w-full aspect-[1.58] rounded-2xl md:rounded-[24px] overflow-hidden bg-[#181818] shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5">
                  <img
                    src={p.imageUrl || `https://picsum.photos/seed/${p.seed}/600`}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )
            )}

            {/* Metadata and Teaser text BELOW the card block */}
            <div className="flex flex-col mt-4 text-left">
              <span className="text-[9px] md:text-[10px] font-semibold tracking-[0.18em] text-[#ff2e55] uppercase font-display">
                {p.tag || 'CONSIGLIATO'}
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-1 group-hover:text-white/80 transition-colors line-clamp-1 font-display tracking-widest uppercase">
                {p.title}
              </h3>
              <span className="text-xs md:text-sm text-white/50 line-clamp-1 mt-1 font-sans">
                {p.subtitle || `Curata da ${p.author}`}
              </span>
              {p.teaser && (
                <p className="text-[12px] md:text-sm text-white/70 font-sans leading-relaxed line-clamp-2 text-left mt-2 antialiased">
                  {p.teaser}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
