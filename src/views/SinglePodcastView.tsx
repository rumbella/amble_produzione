import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Play, Pause, ChevronRight } from 'lucide-react';
import { PODCAST_ITEMS } from '../data/podcasts';
import { getPodcastSongs } from '../data/podcasts';
import { PageBackground } from '../components/PageBackground';
import { SponsorMarquee } from '../components/SponsorMarquee';
import { SponsorSpotModal, useSponsorSpot } from '../components/SponsorSpotModal';
import SongRowItem from '../components/SongRowItem';
import { usePlayer } from '../contexts/PlayerContext';

export function SinglePodcastView() {
  const { isPlaying, togglePlay, currentTrackUrl, userLikes, toggleLike } = usePlayer();
  const { id } = useParams();
  const navigate = useNavigate();
  const playlist = PODCAST_ITEMS.find(p => p.id === Number(id));
  const songsList = getPodcastSongs(Number(id));

  const sponsor = playlist?.sponsor;
  const { isOpen: isSpotOpen, openSpot, closeSpot } = useSponsorSpot(sponsor);

  if (!playlist) return null;

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full min-h-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Level 3: Scoped Full-Page Background (Sponsor Video / Slideshow or Neutral solid #0a0a0a) */}
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
                  {playlist.tag || "PODCAST ESCLUSIVO"}
                </span>
              </div>
              
              <h1 className="font-space text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
                {playlist.title}
              </h1>
              
              <p className="font-sans text-sm sm:text-base text-white/70 mt-2">
                Creato da <span className="font-semibold text-white">{playlist.author}</span>
              </p>

              <p className="font-sans text-xs sm:text-sm text-white/50 mt-3 leading-relaxed max-w-2xl">
                {playlist.teaser || "L'energia irriverente e imprevedibile formato podcast, firmato con ospiti d'eccezione."}
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
                      <span>ASCOLTA L'ULTIMA PUNTATA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Section Divider & Title */}
          <div className="flex items-center justify-between mt-12 mb-6 border-b border-white/5 pb-4">
            <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-wider flex items-center gap-1.5 uppercase">
              <span>Le Puntate</span>
              <ChevronRight size={18} className="text-[#ff2e55]" />
            </h2>
            <span className="text-xs text-white/40 font-sans">{songsList.length} puntate</span>
          </div>

          {/* Podcast Episodes List */}
          <div className="flex flex-col gap-3">
            {songsList.map((song, i) => (
              <SongRowItem
                key={i}
                song={song}
                index={i}
                playlistId={playlist.id}
                playlistType="podcast"
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

        </div>
      </div>
    </motion.main>
  );
}

export default SinglePodcastView;
