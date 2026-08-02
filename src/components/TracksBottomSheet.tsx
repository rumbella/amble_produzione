import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { Song, PlaylistItem } from '../types';
import SongRowItem from './SongRowItem';

export interface TracksBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  songsList: Song[];
  playlist: PlaylistItem;
  isPlaying: boolean;
  currentTrackUrl: string | null;
  onPlayToggle: (url: string) => void;
  userLikes?: string[];
  onLikeToggle: (id: string) => void;
}

export function TracksBottomSheet({ 
  isOpen, 
  onClose, 
  songsList, 
  playlist, 
  isPlaying, 
  currentTrackUrl, 
  onPlayToggle, 
  userLikes, 
  onLikeToggle 
}: TracksBottomSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] cursor-pointer"
          />

          {/* Bottom Sheet Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] md:max-h-[75vh] bg-[#121212]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-[32px] z-[101] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pb-safe"
          >
            {/* Header / Drag Handle */}
            <div className="flex flex-col items-center py-4 shrink-0 cursor-row-resize">
              <div className="w-12 h-1.5 rounded-full bg-white/20" />
              <div className="flex items-center justify-between w-full px-6 mt-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-[#ff2e55] tracking-widest uppercase font-space">
                    {playlist.title}
                  </span>
                  <h3 className="text-lg font-bold text-white font-display">
                    I brani del set
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable List Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-12 select-none">
              <div className="flex flex-col gap-3">
                {songsList.map((song: Song, i: number) => (
                  <SongRowItem
                    key={i}
                    song={song}
                    index={i}
                    playlistId={playlist.id}
                    playlistType="djset"
                    isPlaying={isPlaying}
                    currentTrackUrl={currentTrackUrl}
                    onPlayToggle={onPlayToggle}
                    userLikes={userLikes}
                    onLikeToggle={onLikeToggle}
                    playlistImage={playlist.imageUrl}
                    author={playlist.author}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default TracksBottomSheet;
