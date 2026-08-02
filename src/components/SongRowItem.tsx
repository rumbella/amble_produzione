import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Heart, MoreHorizontal, Share2, Link2 } from 'lucide-react';
import { Song } from '../types';

export interface SongRowItemProps {
  key?: any;
  song: any;
  index: number;
  playlistId: number | string;
  playlistType: 'musiktalk' | 'podcast' | 'djset' | 'playlist' | string;
  isPlaying: boolean;
  currentTrackUrl: string | null;
  onPlayToggle: (url: string) => void;
  userLikes?: string[];
  onLikeToggle: (id: string) => void;
  playlistImage?: string;
  author?: string;
  isExplicit?: boolean;
}

export function SongRowItem({ 
  song, 
  index, 
  playlistId, 
  playlistType, 
  isPlaying, 
  currentTrackUrl, 
  onPlayToggle, 
  userLikes, 
  onLikeToggle, 
  playlistImage,
  author,
  isExplicit = false
}: SongRowItemProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const isCurrent = currentTrackUrl === song.audioUrl;
  const isCurrentPlaying = isCurrent && isPlaying;
  
  const likeId = playlistType === 'musiktalk' 
    ? `musiktalk_ep:${song.id}`
    : playlistType === 'podcast'
      ? `podcast_episode:${playlistId}:${index}`
      : playlistType === 'djset'
        ? `djset_track:${playlistId}:${index}`
        : `playlist_song:${playlistId}:${index}`;
        
  const isLiked = userLikes?.includes(likeId) || false;
  const thumbUrl = song.backgroundUrl || song.imageUrl || playlistImage;
  
  const handleRowClick = () => {
    if (playlistType === 'musiktalk') {
      navigate(`/programmi/musik-talk/${song.id}`);
    } else {
      navigate(`/${playlistType}/${playlistId}/song/${index}`);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayToggle(song.audioUrl);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLikeToggle(likeId);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (navigator.share) {
      navigator.share({ title: song.title, url: window.location.href })
        .catch(err => {
          if (err.name !== 'AbortError') console.error("Share failed", err);
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    navigator.clipboard.writeText(window.location.href + (playlistType === 'musiktalk' ? `/${song.id}` : `/song/${index}`));
  };

  useEffect(() => {
    if (!showMenu) return;
    const close = () => setShowMenu(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [showMenu]);

  return (
    <div 
      onClick={handleRowClick}
      className={`glass-panel group relative flex items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer ${isCurrent ? 'border-white/20 bg-white/[0.04]' : ''}`}
    >
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Rounded Image with Play overlay on hover */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-[#181818] shrink-0 border border-white/5 shadow-md">
          <img
            src={thumbUrl}
            alt=""
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Soundwave or Play overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isCurrentPlaying ? (
              <button 
                onClick={handlePlayClick}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                <Pause size={15} className="fill-black text-black" />
              </button>
            ) : (
              <button 
                onClick={handlePlayClick}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                <Play size={15} className="ml-0.5 fill-black text-black" />
              </button>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm sm:text-base font-bold text-white font-display tracking-wide truncate group-hover:text-[#ff2e55]/95 transition-colors ${isCurrent ? 'text-[#ff2e55]' : ''}`}>
              {song.title}
            </h3>
            {isExplicit && (
              <span className="bg-white/10 text-[9px] font-bold text-white/60 px-1 rounded uppercase font-sans shrink-0">
                E
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 truncate font-sans mt-0.5">
            {song.author || author}
          </p>
        </div>
      </div>

      {/* Right side Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xs text-white/40 font-mono hidden sm:inline">
          {song.duration}
        </span>

        {/* Like Heart Button */}
        <button
          onClick={handleLikeClick}
          className={`p-2 rounded-full hover:bg-white/5 transition-colors cursor-pointer ${isLiked ? 'text-[#ff2e55]' : 'text-white/40 hover:text-white'}`}
          title="Mi piace"
        >
          <Heart size={16} className={isLiked ? "fill-current" : ""} />
        </button>

        {/* More/Options Trigger */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer"
            title="Altre opzioni"
          >
            <MoreHorizontal size={16} />
          </button>

          {/* Context Dropdown Popover */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-[#0c0c0e]/95 border border-white/10 rounded-2xl p-1.5 shadow-2xl backdrop-blur-xl z-20 flex flex-col gap-0.5 font-sans overflow-hidden"
              >
                <button
                  onClick={handlePlayClick}
                  className="w-full text-left text-xs sm:text-sm text-white/80 hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Play size={14} />
                  <span>{isCurrentPlaying ? 'Pausa' : 'Riproduci ora'}</span>
                </button>
                <button
                  onClick={handleLikeClick}
                  className="w-full text-left text-xs sm:text-sm text-white/80 hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Heart size={14} className={isLiked ? "fill-current text-[#ff2e55]" : ""} />
                  <span>{isLiked ? 'Rimuovi preferiti' : 'Aggiungi preferiti'}</span>
                </button>
                <button
                  onClick={handleShareClick}
                  className="w-full text-left text-xs sm:text-sm text-white/80 hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Share2 size={14} />
                  <span>Condividi</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full text-left text-xs sm:text-sm text-white/80 hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Link2 size={14} />
                  <span>Copia link brano</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SongRowItem;
