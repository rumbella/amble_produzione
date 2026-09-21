import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Heart, Share2, ChevronLeft, ChevronRight, ListMusic } from 'lucide-react';
import { Song, PlaylistItem } from '../types';
import { usePlayer } from '../contexts/PlayerContext';

export interface DjSetStackSwipeProps {
  songsList: Song[];
  playlist: PlaylistItem;
  isPlaying?: boolean;
  currentTrackUrl?: string | null;
  onPlayToggle?: (url: string) => void;
  userLikes?: string[];
  onLikeToggle?: (id: string) => void;
  onOpenSheet: () => void;
}

export function DjSetStackSwipe({ 
  songsList, 
  playlist, 
  isPlaying: propIsPlaying, 
  currentTrackUrl: propCurrentTrackUrl, 
  onPlayToggle: propOnPlayToggle, 
  userLikes: propUserLikes, 
  onLikeToggle: propOnLikeToggle, 
  onOpenSheet 
}: DjSetStackSwipeProps) {
  const player = usePlayer();
  const isPlaying = propIsPlaying ?? player.isPlaying;
  const currentTrackUrl = propCurrentTrackUrl ?? player.currentTrackUrl;
  const onPlayToggle = propOnPlayToggle ?? player.togglePlay;
  const userLikes = propUserLikes ?? player.userLikes;
  const onLikeToggle = propOnLikeToggle ?? player.toggleLike;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songsList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + songsList.length) % songsList.length);
  };

  const trackCovers = [
    "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=80"
  ];

  const topSong = songsList[currentIndex];
  const isTopCurrent = currentTrackUrl === topSong?.audioUrl;
  const isTopPlaying = isPlaying && isTopCurrent;

  return (
    <div className="flex flex-col items-center justify-center py-6 w-full max-w-[400px] mx-auto select-none">
      {/* The Stack Container */}
      <div className="relative w-full aspect-[4/5] h-[340px] sm:h-[400px] flex items-center justify-center">
        {/* Render bottom cards first so they appear behind the top card */}
        {[2, 1, 0].map((depth) => {
          const index = (currentIndex + depth) % songsList.length;
          const song = songsList[index];
          if (!song) return null;

          const trackCover = trackCovers[index % trackCovers.length];
          const isCurrent = currentTrackUrl === song.audioUrl;
          const isCurrentPlaying = isPlaying && isCurrent;
          const itemId = `djset_track:${playlist.id}:${index}`;
          const isLiked = userLikes?.includes(itemId);

          const isTop = depth === 0;
          const scale = 1 - depth * 0.05;
          const translateY = depth * 12;
          const rotate = depth === 0 ? 0 : depth === 1 ? 3 : -3;
          const opacity = 1 - depth * 0.35;

          return (
            <motion.div
              key={index}
              style={{
                zIndex: 30 - depth,
                touchAction: 'none'
              }}
              animate={{
                scale,
                y: translateY,
                rotate,
                opacity,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 25
              }}
              className="absolute w-[280px] sm:w-[320px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col justify-between h-full cursor-grab active:cursor-grabbing overflow-hidden"
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, info) => {
                if (!isTop) return;
                const swipeThreshold = 80;
                if (info.offset.x > swipeThreshold) {
                  handlePrev();
                } else if (info.offset.x < -swipeThreshold) {
                  handleNext();
                }
              }}
            >
              {/* Blur accent backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

              <div className="flex flex-col h-full justify-between relative z-10">
                {/* Artwork Area */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl bg-white/5 group">
                  <img
                    src={trackCover}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />

                  {/* Gradient shadow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

                  {/* Play Overlay (On Hover) */}
                  {isTop && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const isPlaylistPlaying = isPlaying && songsList.some((s) => s.audioUrl === currentTrackUrl);
                          if (isPlaylistPlaying && currentTrackUrl) {
                            onPlayToggle(currentTrackUrl);
                          } else {
                            onPlayToggle(song.audioUrl);
                          }
                        }}
                        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_8px_20px_rgba(255,255,255,0.25)]"
                      >
                        {isPlaying && songsList.some((s) => s.audioUrl === currentTrackUrl) ? (
                          <Pause size={24} className="fill-black text-black" />
                        ) : (
                          <Play size={24} className="ml-0.5 fill-black text-black" />
                        )}
                      </motion.button>
                    </div>
                  )}

                  {/* Live Badge if Playing */}
                  {isCurrentPlaying && (
                    <div className="absolute top-3 left-3 bg-[#ff2e55] text-white border border-[#ff2e55]/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-[0_4px_12px_rgba(255,46,85,0.4)]">
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                      </span>
                      <span className="text-[8px] font-space tracking-widest font-black uppercase">PLAYING</span>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="mt-4 flex flex-col text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-[#ff2e55] tracking-[0.2em] uppercase font-space">
                      AID MIX #{(index + 2)}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 tracking-wider">
                      {song.duration}
                    </span>
                  </div>

                  <h3 className={`font-space font-extrabold text-base sm:text-lg mt-1 line-clamp-1 transition-colors duration-200 ${isCurrent ? 'text-[#ff2e55]' : 'text-white'}`}>
                    {song.title}
                  </h3>

                  <p className="text-xs text-white/50 mt-0.5 line-clamp-1 font-sans">
                    {playlist.author}
                  </p>
                </div>

                {/* Actions Bottom Bar */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-md overflow-hidden border border-white/15 shrink-0 bg-white/5">
                      <img 
                        src={playlist.imageUrl} 
                        alt="AID Logo" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[8px] font-space tracking-widest text-white/40 uppercase font-black">
                      A.I.D. MIX
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLikeToggle(itemId);
                      }}
                      className={`p-1.5 rounded-full hover:bg-white/5 transition-colors ${isLiked ? 'text-[#ff2e55]' : 'text-white/40 hover:text-white'}`}
                      title="Mi piace"
                    >
                      <Heart size={16} className={isLiked ? "fill-[#ff2e55]" : ""} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigator.share) {
                          navigator.share({ 
                            title: `${song.title} - ${playlist.title}`, 
                            url: window.location.href 
                          }).catch(err => {
                            if (err.name !== 'AbortError') console.error("Share failed", err);
                          });
                        }
                      }}
                      className="p-1.5 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                      title="Condividi"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Swipe Deck Page Controls underneath */}
      <div className="flex flex-col items-center gap-4 mt-8 w-full">
        <div className="flex items-center gap-6">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 text-white/70 hover:text-white shadow-lg"
            aria-label="Precedente"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Core play controller */}
          <button
            onClick={() => onPlayToggle(topSong?.audioUrl)}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(255,255,255,0.25)]"
            aria-label="Play/Pause"
          >
            {isTopPlaying ? (
              <Pause size={26} className="fill-black text-black" />
            ) : (
              <Play size={26} className="ml-0.5 fill-black text-black" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 text-white/70 hover:text-white shadow-lg"
            aria-label="Successivo"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Dynamic dots indicator */}
        <div className="flex items-center gap-2 mt-1">
          {songsList.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-5 bg-[#ff2e55]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
              aria-label={`Brano ${idx + 1}`}
            />
          ))}
        </div>

        {/* Informative Hint */}
        <span className="text-[9px] font-mono text-white/20 tracking-[0.2em] uppercase mt-2 animate-pulse text-center">
          Trascina la card o usa le frecce per scorrere i mix
        </span>

        {/* View Set Songs Button */}
        <button
          onClick={onOpenSheet}
          className="mt-4 text-xs font-bold text-white/70 hover:text-white font-space tracking-wider border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shrink-0"
        >
          <ListMusic size={14} className="text-[#ff2e55]" />
          <span>I BRANI DEL SET</span>
        </button>
      </div>
    </div>
  );
}

export default DjSetStackSwipe;
