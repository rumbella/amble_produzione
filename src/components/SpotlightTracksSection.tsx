import React from 'react';
import { usePlayer } from '../contexts/PlayerContext';

export interface SpotlightTracksSectionProps {
  title?: string;
  subtitle?: string;
  tracks: any[];
  isPlaying?: boolean;
  togglePlay?: (url: string) => void;
  currentTrackUrl?: string | null;
}

export function SpotlightTracksSection({ 
  title = "Spotlight", 
  subtitle = "Brani selezionati da Radio Amblè", 
  tracks = [], 
  isPlaying: propIsPlaying, 
  togglePlay: propTogglePlay, 
  currentTrackUrl: propCurrentTrackUrl 
}: SpotlightTracksSectionProps) {
  const player = usePlayer();
  const isPlaying = propIsPlaying ?? player.isPlaying;
  const togglePlay = propTogglePlay ?? player.togglePlay;
  const currentTrackUrl = propCurrentTrackUrl ?? player.currentTrackUrl;
  return (
    <div className="w-full flex flex-col mb-16 text-left">
      <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
            {title}
          </h2>
          {/* Info circle icon */}
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
        <button className="text-xs text-[#ff2e55] font-space tracking-widest uppercase hover:underline transition-all">
          Vedi tutto
        </button>
      </div>
      <p className="font-sans text-xs text-white/40 mb-6 leading-relaxed">
        {subtitle}
      </p>

      {/* Grid of tracks matching the reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track, i) => {
          const trackAudio = track.audioUrl;
          const trackImage = track.imageUrl;
          const isCurrent = currentTrackUrl === trackAudio;
          const isCurrentPlaying = isCurrent && isPlaying;
          return (
            <div
              key={i}
              onClick={() => togglePlay(trackAudio)}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 group cursor-pointer ${
                isCurrent 
                  ? 'border-white/20 bg-white/[0.06] shadow-[0_4px_20px_rgba(255,46,85,0.15)]' 
                  : 'border-white/5 bg-[#121212]/30 hover:border-white/15 hover:bg-white/[0.03]'
              }`}
            >
              {/* Left Content */}
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Square image with overlay play button */}
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#1a1a1a] border border-white/5 shadow-md">
                  <img
                    src={trackImage}
                    alt=""
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                  />
                  {/* Play Overlay */}
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

                {/* Song Meta info */}
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className={`text-sm font-bold truncate tracking-wide uppercase transition-colors duration-300 ${isCurrent ? 'text-[#ff2e55]' : 'text-white group-hover:text-[#ff2e55]'}`}>
                      {track.title}
                    </h3>
                  </div>
                  <p className="text-xs text-white/50 truncate mt-1 font-sans">
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

export default SpotlightTracksSection;
