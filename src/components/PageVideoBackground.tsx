import React from 'react';

interface PageVideoBackgroundProps {
  src: string;
  poster?: string;
  overlayOpacity?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Scoped video background component for pages that explicitly require a video backdrop.
 * Rendered locally with low z-index (-z-10) and high-contrast readability overlays.
 * Never mounted globally across all routes.
 */
export function PageVideoBackground({
  src,
  poster,
  className = '',
  children
}: PageVideoBackgroundProps) {
  return (
    <div 
      className={`absolute inset-0 w-full h-full -z-10 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src={src}
      />
      {/* Brand tone overlay and darkening gradient for text legibility */}
      <div className="absolute inset-0 bg-red-950/30 mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      {children}
    </div>
  );
}

export default PageVideoBackground;
