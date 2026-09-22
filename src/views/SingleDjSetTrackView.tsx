import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Heart, Share2 } from 'lucide-react';
import { DJSET_ITEMS, getDjSetSongs } from '../data/djsets';
import PlayerTicker from '../components/PlayerTicker';
import { usePlayer } from '../contexts/PlayerContext';
import { usePlayerHeightObserver } from '../hooks/usePlayerHeightObserver';
import { PageBackground } from '../components/PageBackground';
import { SponsorMarquee } from '../components/SponsorMarquee';
import { SponsorSpotModal, useSponsorSpot } from '../components/SponsorSpotModal';

export function SingleDjSetTrackView() {
  const { isPlaying, togglePlay, playTrack, userLikes, toggleLike, currentTrackUrl } = usePlayer();
  const playerCardRef = usePlayerHeightObserver<HTMLDivElement>();
  const { id, songIndex } = useParams();
  const navigate = useNavigate();
  const playlist = DJSET_ITEMS.find(p => p.id === Number(id));
  
  const sIndex = Number(songIndex);
  const songsList = playlist ? getDjSetSongs(playlist.id) : [];
  const song = songsList[sIndex];

  const sponsor = song?.sponsor || playlist?.sponsor;
  const { isOpen: isSpotOpen, openSpot, closeSpot } = useSponsorSpot(sponsor);

  if (!playlist || !song) return null;

  const songAudio = song.audioUrl;
  const itemId = `djset_track:${playlist.id}:${songIndex}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === songAudio;

  const goToPrev = () => {
    if (sIndex > 0) {
      const prevSong = songsList[sIndex - 1];
      playTrack(prevSong.audioUrl);
      navigate(`/djset/${playlist.id}/song/${sIndex - 1}`, { replace: true });
    }
  };

  const goToNext = () => {
    if (sIndex < songsList.length - 1) {
      const nextSong = songsList[sIndex + 1];
      playTrack(nextSong.audioUrl);
      navigate(`/djset/${playlist.id}/song/${sIndex + 1}`, { replace: true });
    }
  };

  useEffect(() => {
    if (currentTrackUrl !== songAudio) {
      playTrack(songAudio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songAudio]);

  return (
    <motion.main
      className="relative z-30 w-full h-full min-h-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Level 3: Scoped Full-Page Background */}
      <PageBackground 
        type={sponsor ? sponsor.backgroundType : song?.imageUrl || playlist?.imageUrl ? 'image' : 'neutral'}
        src={sponsor ? sponsor.backgroundSrc : song?.imageUrl || playlist?.imageUrl}
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

      {/* The Player Box in normal flex flow */}
      <div className={`relative z-10 w-full max-w-[500px] h-full flex flex-col justify-end items-center pb-2 md:pb-6 px-6 mx-auto pointer-events-auto ${
        sponsor ? 'pt-16 sm:pt-20' : ''
      }`}>
        <div className="flex-1 min-h-[10px]" />
        <div ref={playerCardRef} className="shrink-0 flex flex-col items-center w-full">
          <PlayerTicker />
          <div 
            className="glass-panel animated-gradient-border w-full px-6 py-5 flex flex-col shrink-0 bg-[#0c0c0e]/45 backdrop-blur-md shadow-2xl rounded-3xl"
          >
          <div className="flex items-center gap-4 w-full mb-4">
            {playlist.id === 1 ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md border border-white/10 shrink-0">
                <img 
                  src={playlist.imageUrl} 
                  alt="AID Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : null}
            <div className={`flex-1 min-w-0 ${playlist.id !== 1 ? 'text-center' : 'text-left'}`}>
              <h2 className="font-space text-[18px] sm:text-[22px] text-white tracking-widest leading-tight truncate">
                {song.title}
              </h2>
              <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/50 uppercase mt-1.5 truncate">
                {playlist.title} • {playlist.author}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full max-w-[320px]">
            <button 
              onClick={() => toggleLike(itemId)}
              className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${isLiked ? 'text-white' : 'text-white/80'}`}
              aria-label="Like"
            >
              <Heart size={22} strokeWidth={isLiked ? 2.5 : 1} className={isLiked ? "fill-white" : ""} />
            </button>

            <div className="flex items-center justify-center gap-4 w-full">
              <button 
                onClick={goToPrev}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${sIndex === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={sIndex === 0}
              >
                <SkipBack size={24} strokeWidth={2} />
              </button>

              <button 
                onClick={() => togglePlay(songAudio)}
                className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform mx-2 ${trackIsPlaying ? 'play-pulse' : ''}`}
                aria-label={trackIsPlaying ? "Pause" : "Play"}
              >
                {trackIsPlaying ? (
                  <Pause size={28} strokeWidth={2} className="fill-black" />
                ) : (
                  <Play size={28} strokeWidth={2} className="ml-1 fill-black" />
                )}
              </button>

              <button 
                onClick={goToNext}
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${sIndex === songsList.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={sIndex === songsList.length - 1}
              >
                <SkipForward size={24} strokeWidth={2} />
              </button>
            </div>

            <button 
              className="p-2 text-white/80 transition-transform hover:scale-110 flex items-center justify-center"
              aria-label="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: `${song.title} - ${playlist.title}`, url: window.location.href })
                    .catch(e => {
                      if (e.name !== 'AbortError') console.error("Share failed", e);
                    });
                }
              }}
            >
              <Share2 size={22} strokeWidth={1} />
            </button>
          </div>
        </div>
        </div>
      </div>
    </motion.main>
  );
}

export default SingleDjSetTrackView;
