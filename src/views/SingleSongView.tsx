import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Heart, Share2 } from 'lucide-react';
import { MUSIC_PLAYLISTS, getPlaylistSongs } from '../data/podcasts';
import { getRandomBackground } from '../data/featured';
import PlayerTicker from '../components/PlayerTicker';
import { usePlayer } from '../contexts/PlayerContext';

export function SingleSongView() {
  const { isPlaying, togglePlay, playTrack, userLikes, toggleLike, currentTrackUrl } = usePlayer();
  const { id, songIndex } = useParams();
  const navigate = useNavigate();
  const playlist = MUSIC_PLAYLISTS.find(p => p.id === Number(id));
  const [bgUrl] = useState(() => playlist?.imageUrl || getRandomBackground());
  
  const sIndex = Number(songIndex);
  const songs = playlist ? getPlaylistSongs(playlist.id) : [];
  const song = songs[sIndex];

  if (!playlist || !song) return null;

  const songAudio = song.audioUrl;
  const itemId = `playlist_song:${playlist.id}:${songIndex}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === songAudio;
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  const goToPrev = () => {
    if (sIndex > 0) {
      const prevSong = songs[sIndex - 1];
      playTrack(prevSong.audioUrl);
      navigate(`/playlist/${playlist.id}/song/${sIndex - 1}`, { replace: true });
    }
  };

  const goToNext = () => {
    if (sIndex < songs.length - 1) {
      const nextSong = songs[sIndex + 1];
      playTrack(nextSong.audioUrl);
      navigate(`/playlist/${playlist.id}/song/${sIndex + 1}`, { replace: true });
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
      className="relative z-30 w-full h-full"
    >
      {/* Background (Specific to the single song) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
          />
        ) : (
          <img 
            className="absolute inset-0 w-full h-full object-cover"
            src={bgUrl}
            alt=""
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
      </div>

      {/* The Player Box */}
      <div className="absolute inset-0 flex flex-col justify-end items-center z-10 w-full max-w-[500px] mb-[100px] md:mb-[40px] px-6 mx-auto pointer-events-auto">
        <PlayerTicker />
        <div 
          className="glass-panel animated-gradient-border w-full px-6 py-4 sm:py-6 flex flex-col items-center text-center shrink-0 bg-[#0c0c0e]/45 backdrop-blur-md shadow-2xl rounded-3xl"
        >
          <h2 className="font-space text-[20px] sm:text-[24px] text-white tracking-widest leading-none mb-1">
            {song.title}
          </h2>
          
          <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/70 uppercase mt-2 mb-4">
            {playlist.title} • {playlist.author}
          </p>

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
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${sIndex === songs.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={sIndex === songs.length - 1}
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
    </motion.main>
  );
}

export default SingleSongView;
