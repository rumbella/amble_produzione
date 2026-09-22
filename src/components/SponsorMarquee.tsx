import React from 'react';
import { Play } from 'lucide-react';
import { PageSponsor } from '../types';

export interface SponsorMarqueeProps {
  sponsor: PageSponsor;
  onOpenSpot?: () => void;
  className?: string;
}

/**
 * Scrolling text marquee for sponsored pages.
 * Displays sponsor information and triggers the sponsor spot modal on tap if enabled.
 */
export function SponsorMarquee({
  sponsor,
  onOpenSpot,
  className = '',
}: SponsorMarqueeProps) {
  const isTappable = !!onOpenSpot;

  const content = (
    <div className="flex items-center gap-6 whitespace-nowrap py-1">
      <span className="text-[10px] font-space font-bold tracking-[0.2em] text-[#ff2e55] uppercase">
        SPONSOR
      </span>
      <span className="text-xs font-sans font-medium tracking-wider text-white/90">
        {sponsor.marqueeText}
      </span>
      {isTappable && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[10px] font-space text-white tracking-widest uppercase transition-colors">
          <Play size={10} className="fill-white" />
          Spot
        </span>
      )}
      <span className="text-white/20 select-none">•</span>
    </div>
  );

  return (
    <div 
      onClick={isTappable ? onOpenSpot : undefined}
      className={`w-full overflow-hidden bg-black/40 backdrop-blur-md border-y border-white/10 ${
        isTappable ? 'cursor-pointer hover:bg-black/60 transition-colors' : ''
      } ${className}`}
      role={isTappable ? 'button' : undefined}
      tabIndex={isTappable ? 0 : undefined}
      aria-label={isTappable ? `Sponsor ${sponsor.sponsorName}: tocca per guardare lo spot` : undefined}
    >
      <div className="w-full flex overflow-x-hidden">
        {/* Continuous Marquee Animation */}
        <div className="animate-marquee shrink-0 gap-6 items-center">
          {content}
          {content}
          {content}
          {content}
        </div>
      </div>
    </div>
  );
}

export default SponsorMarquee;
