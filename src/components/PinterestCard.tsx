import React from 'react';
import { Play, ChevronRight } from 'lucide-react';

export function getSpansForTotal(N: number): number[] {
  if (N <= 0) return [];
  if (N === 1) return [3];
  if (N === 2) return [2, 1];
  if (N === 3) return [2, 1, 3];
  if (N === 4) return [2, 1, 1, 2];
  if (N === 5) return [2, 1, 1, 1, 1];
  
  const spans: number[] = [];
  let remaining = N;
  let rowTypeToggle = 0;
  while (remaining > 0) {
    if (remaining === 1) {
      spans.push(3);
      remaining -= 1;
    } else if (remaining === 2) {
      spans.push(2, 1);
      remaining -= 2;
    } else if (remaining === 3) {
      spans.push(2, 1, 3);
      remaining -= 3;
    } else if (remaining === 4) {
      spans.push(2, 1, 1, 2);
      remaining -= 4;
    } else {
      if (rowTypeToggle % 2 === 0) {
        spans.push(2, 1);
        remaining -= 2;
      } else {
        spans.push(1, 1, 1);
        remaining -= 3;
      }
      rowTypeToggle++;
    }
  }
  return spans;
}

export const getBentoConfig = (index: number, total: number) => {
  const spans = getSpansForTotal(total);
  const span = spans[index] || 1;
  
  let smSpan = "sm:col-span-1";
  if (span === 3) {
    smSpan = "sm:col-span-2";
  } else if (span === 2) {
    smSpan = "sm:col-span-1";
  }

  const mdSpan = `md:col-span-${span}`;

  return {
    isFull: span >= 2,
    spanClass: `col-span-1 ${smSpan} ${mdSpan}`
  };
};

export interface PinterestCardProps {
  id: string | number;
  title: string;
  author: string;
  teaser: string;
  tag: string;
  subtitle?: string;
  imageUrl?: string;
  seed?: any;
  isFull: boolean;
  index: number;
  onClick: () => any;
  isPlaylistCollage?: boolean;
  key?: any;
  spanClass?: string;
}

export function PinterestCard({
  id,
  title,
  author,
  teaser,
  tag,
  subtitle,
  imageUrl,
  seed,
  isFull,
  index,
  onClick,
  isPlaylistCollage = false,
  spanClass
}: PinterestCardProps) {
  const cardImg = imageUrl;

  const getAspectClass = (full: boolean, idx: number) => {
    if (full) {
      return "aspect-[2/1] sm:aspect-[2.4/1] md:aspect-[2.8/1]";
    }
    return "aspect-[16/10]";
  };

  const aspectClass = getAspectClass(isFull, index);

  return (
    <div
      onClick={onClick}
      className={`glass-panel group relative overflow-hidden flex flex-col ${
        spanClass || (isFull ? 'col-span-2' : 'col-span-1')
      } border border-white/10 bg-[#161616]/80 rounded-3xl md:rounded-[32px] hover:border-[#ff2e55]/30 transition-all duration-500 ease-out cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-12px_rgba(255,46,85,0.25)] hover:bg-[#1a1a1a]/95`}
    >
      {/* Image Thumb (with hover effects) */}
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#181818] shrink-0 border-b border-white/5`}>
        {/* Full Image or Collage */}
        {cardImg ? (
          <img
            src={cardImg}
            alt=""
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
        ) : isPlaylistCollage ? (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 group-hover:scale-105 transition-transform duration-700 ease-out">
            <img src={`https://picsum.photos/seed/${seed}a/200`} alt="" className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
            <img src={`https://picsum.photos/seed/${seed}b/200`} alt="" className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
            <img src={`https://picsum.photos/seed/${seed}c/200`} alt="" className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
            <img src={`https://picsum.photos/seed/${seed}d/200`} alt="" className="w-full h-full object-cover object-center" referrerPolicy="no-referrer" />
          </div>
        ) : (
          <img
            src={`https://picsum.photos/seed/${seed}/600`}
            alt=""
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Dynamic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Pinterest hover Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#ff2e55] p-4 rounded-full shadow-lg shadow-[#ff2e55]/30 transform scale-90 group-hover:scale-100 transition-transform duration-500 flex items-center justify-center">
            <Play size={20} className="text-white fill-white translate-x-[1px]" />
          </div>
        </div>

        {/* Floating Tag over image - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[8px] md:text-[9px] font-semibold tracking-wider text-white uppercase font-space bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            {tag}
          </span>
        </div>
      </div>

      {/* Info text below the image */}
      <div className="flex flex-col flex-1 justify-between p-5 md:p-6 text-left">
        <div>
          {/* Subtitle / Fine metadata */}
          {subtitle && (
            <p className="text-[9px] md:text-[10px] text-white/40 font-mono tracking-wider uppercase mb-1.5">
              {subtitle}
            </p>
          )}
          
          {/* Heading */}
          <h3 className={`${
            isFull ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base md:text-lg'
          } font-bold text-white font-space tracking-wider uppercase group-hover:text-[#ff2e55] transition-colors duration-300`}>
            {title}
          </h3>

          {/* Author */}
          <p className="text-[11px] md:text-xs text-white/50 mt-1 font-sans">
            Di {author}
          </p>

          {/* Teaser text */}
          <p className="text-xs text-white/60 mt-3 font-sans leading-relaxed line-clamp-3 antialiased">
            {teaser}
          </p>
        </div>

        {/* CTA link */}
        <div className="mt-5 flex items-center text-[10px] text-[#ff2e55] font-space tracking-widest uppercase gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
          <span className="font-bold">Ascolta ora</span>
          <ChevronRight size={12} className="stroke-[2.5px]" />
        </div>
      </div>
    </div>
  );
}

export default PinterestCard;
