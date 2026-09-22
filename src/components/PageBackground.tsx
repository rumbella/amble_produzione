import React, { useState, useEffect } from 'react';

export interface PageBackgroundProps {
  type?: 'neutral' | 'video' | 'image' | 'slideshow';
  src?: string | string[];
  poster?: string;
  overlayOpacity?: number;
  className?: string;
}

/**
 * Reusable full-page edge-to-edge background layer.
 * 
 * - Positioned fixed with inset-0, covering the entire viewport edge-to-edge
 * - Uses var(--app-height, 100dvh) for cross-device mobile/PWA reliability
 * - Ignores safe areas so visuals bleed seamlessly behind status bars and notches
 * - Lowest z-index (-z-10) so content, player, header, and navbar stay perfectly legible
 * - Scoped: Mounted ONLY within the page component requesting it, NEVER in App/global layout
 */
export function PageBackground({
  type = 'neutral',
  src,
  poster,
  overlayOpacity = 0.6,
  className = '',
}: PageBackgroundProps) {
  // Slideshow rotation logic
  const images = Array.isArray(src) ? src : src ? [src] : [];
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useEffect(() => {
    if (type !== 'slideshow' || images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [type, images.length]);

  // If neutral or no media source provided, render solid neutral color
  if (type === 'neutral' || !src) {
    return (
      <div 
        className={`fixed inset-0 w-full -z-10 pointer-events-none bg-[#0a0a0a] ${className}`}
        style={{ height: 'var(--app-height, 100dvh)' }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div 
      className={`fixed inset-0 w-full -z-10 pointer-events-none overflow-hidden select-none bg-[#0a0a0a] ${className}`}
      style={{ height: 'var(--app-height, 100dvh)' }}
      aria-hidden="true"
    >
      {/* 1. Video Background */}
      {type === 'video' && typeof src === 'string' && (
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          src={src}
        />
      )}

      {/* 2. Single Image Background */}
      {type === 'image' && (
        <img
          src={typeof src === 'string' ? src : src[0]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          referrerPolicy="no-referrer"
        />
      )}

      {/* 3. Slideshow Crossfade Background */}
      {type === 'slideshow' && images.length > 0 && (
        <div className="absolute inset-0 w-full h-full">
          {images.map((imgSrc, idx) => (
            <img
              key={imgSrc + idx}
              src={imgSrc}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ease-in-out pointer-events-none ${
                idx === activeSlideIndex ? 'opacity-100' : 'opacity-0'
              }`}
              referrerPolicy="no-referrer"
            />
          ))}
        </div>
      )}

      {/* Dark overlay & brand multiply tint for text readability */}
      <div className="absolute inset-0 bg-red-950/25 mix-blend-multiply pointer-events-none" />
      <div 
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
        style={{ opacity: overlayOpacity }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}

export default PageBackground;
