import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Play, Pause, ChevronRight, ListMusic } from 'lucide-react';
import { DJSET_ITEMS, getDjSetSongs } from '../data/djsets';
import { PageBackground } from '../components/PageBackground';
import { SponsorMarquee } from '../components/SponsorMarquee';
import { SponsorSpotModal, useSponsorSpot } from '../components/SponsorSpotModal';
import SongRowItem from '../components/SongRowItem';
import DjSetStackSwipe from '../components/DjSetStackSwipe';
import TracksBottomSheet from '../components/TracksBottomSheet';
import { usePlayer } from '../contexts/PlayerContext';

export function SingleDjSetView() {
  const { isPlaying, togglePlay, currentTrackUrl, userLikes, toggleLike } = usePlayer();
  const { id } = useParams();
  const navigate = useNavigate();
  const playlist = DJSET_ITEMS.find(p => p.id === Number(id));
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const sponsor = playlist?.sponsor;
  const { isOpen: isSpotOpen, openSpot, closeSpot } = useSponsorSpot(sponsor);

  if (!playlist) return null;

  const songsList = getDjSetSongs(playlist.id);

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full min-h-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Level 3: Scoped Full-Page Background (Sponsor Video / Slideshow, or Neutral solid #0a0a0a) */}
      <PageBackground 
        type={sponsor ? sponsor.backgroundType : 'neutral'}
        src={sponsor ? sponsor.backgroundSrc : undefined}
      />

      {/* Sponsor Marquee Bar if entity has sponsor */}
      {sponsor && (
        <div className="fixed top-[calc(env(safe-area-inset-top,0px)+2.75rem)] md:top-[calc(env(safe-area-inset-top,0px)+3rem)] left-0 right-0 z-40 md:pl-[80px]">
          <SponsorMarquee 
            sponsor={sponsor} 
            onOpenSpot={openSpot} 
          />
        </div>
      )}

      {/* Sponsor Video Spot Modal */}
      {sponsor && (
        <SponsorSpotModal 
          sponsor={sponsor}
          isOpen={isSpotOpen}
          onClose={closeSpot}
        />
      )}

      {/* Content Area */}
      <div className={`absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 ${
        sponsor ? 'page-top-spacing-sponsored' : 'page-top-spacing'
      } md:pl-[104px]`}>
        <div className="w-full max-w-[1200px] mx-auto pb-44">
          
          {/* Hero Section */}
          {playlist.id !== 1 ? (
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              {/* Left Cover Artwork */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0 group">
                <img 
                  src={playlist.imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -inset-4 bg-[#ff2e55]/10 blur-xl -z-10 rounded-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
              </div>

              {/* Right Information */}
              <div className="flex flex-col flex-1 justify-center py-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="text-[10px] font-bold tracking-widest text-[#ff2e55] uppercase font-space bg-[#ff2e55]/10 px-3 py-1 rounded-full">
                    {playlist.tag || "DJ SET ESCLUSIVO"}
                  </span>
                </div>
                
                <h1 className="font-space text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
                  {playlist.title}
                </h1>
                
                <p className="font-sans text-sm sm:text-base text-white/70 mt-2">
                  Mixato da <span className="font-semibold text-white">{playlist.author}</span>
                </p>

                <p className="font-sans text-xs sm:text-sm text-white/50 mt-3 leading-relaxed max-w-2xl">
                  {playlist.teaser || "Groove ricercati e selezioni d'eccezione firmate dai migliori artisti della scena per Radio Amblè."}
                </p>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                  <button 
                    onClick={() => togglePlay(songsList[0]?.audioUrl)}
                    className={`h-12 px-6 rounded-full bg-white text-black hover:bg-white/90 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg text-sm shrink-0 ${isPlaying && songsList.some(s => s.audioUrl === currentTrackUrl) ? 'play-pulse' : ''}`}
                  >
                    {isPlaying && songsList.some(s => s.audioUrl === currentTrackUrl) ? (
                      <>
                        <Pause size={16} className="fill-black text-black" />
                        <span>PAUSA</span>
                      </>
                    ) : (
                      <>
                        <Play size={16} className="ml-0.5 fill-black text-black" />
                        <span>ASCOLTA</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Section Divider & Title */}
          {playlist.id !== 1 && (
            <div 
              onClick={() => playlist.id === 1 && setIsSheetOpen(true)}
              className={`flex items-center justify-between mt-12 mb-6 border-b border-white/5 pb-4 ${playlist.id === 1 ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
            >
              <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-wider flex items-center gap-1.5 uppercase">
                <span>I brani del set</span>
                <ChevronRight size={18} className="text-[#ff2e55]" />
              </h2>
              {playlist.id === 1 ? (
                <span className="text-xs font-bold text-[#ff2e55] font-space tracking-wider flex items-center gap-1">
                  <ListMusic size={14} />
                  MOSTRA ({songsList.length})
                </span>
              ) : (
                <span className="text-xs text-white/40 font-sans">{songsList.length} brani</span>
              )}
            </div>
          )}

          {/* DJ Set Tracks List */}
          {playlist.id === 1 ? (
            <div className="flex flex-col items-center">
              {/* Title & Description inserted BEFORE the cards stack player */}
              <div className="mb-6 text-center max-w-lg px-4 flex flex-col items-center">
                <span className="text-[9px] font-bold tracking-widest text-[#ff2e55]/80 uppercase font-space bg-[#ff2e55]/5 px-2.5 py-0.5 rounded-full w-fit">
                  {playlist.tag || "MIX ESCLUSIVO"}
                </span>

                <h1 className="font-space text-xl sm:text-2xl font-black text-white tracking-tight mt-2.5">
                  {playlist.title}
                </h1>

                <p className="font-sans text-xs text-white/60 mt-1">
                  Mixato da <span className="font-medium text-white/80">{playlist.author}</span>
                </p>

                <p className="font-sans text-[11px] sm:text-xs text-white/40 mt-2 leading-relaxed max-w-sm">
                  {playlist.teaser || "I migliori allievi e docenti della scuola A.i.D. firmano una selezione elettronica tagliente e imprevedibile."}
                </p>
              </div>

              <DjSetStackSwipe
                songsList={songsList}
                playlist={playlist}
                isPlaying={isPlaying}
                currentTrackUrl={currentTrackUrl}
                onPlayToggle={togglePlay}
                userLikes={userLikes}
                onLikeToggle={toggleLike}
                onOpenSheet={() => setIsSheetOpen(true)}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {songsList.map((song, i) => (
                <SongRowItem
                  key={i}
                  song={song}
                  index={i}
                  playlistId={playlist.id}
                  playlistType="djset"
                  isPlaying={isPlaying}
                  currentTrackUrl={currentTrackUrl}
                  onPlayToggle={togglePlay}
                  userLikes={userLikes}
                  onLikeToggle={toggleLike}
                  playlistImage={playlist.imageUrl}
                  author={playlist.author}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Slide-up Tracks Bottom Sheet */}
      <TracksBottomSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        songsList={songsList}
        playlist={playlist}
        isPlaying={isPlaying}
        currentTrackUrl={currentTrackUrl}
        onPlayToggle={togglePlay}
        userLikes={userLikes}
        onLikeToggle={toggleLike}
      />
    </motion.main>
  );
}

export default SingleDjSetView;
