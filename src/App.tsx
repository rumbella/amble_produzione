import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useParams, Navigate } from 'react-router';
import { Play, Pause, Heart, Share2, Menu as MenuIcon, Mic, ListMusic, Disc3, LogIn, LogOut, User as UserIcon, Home, ChevronLeft, ChevronRight, ArrowLeft, SkipBack, SkipForward, Radio, MoreHorizontal, Link2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PlayerProvider, usePlayer } from './contexts/PlayerContext';
import { db } from './lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { InfiniteCarousel } from './components/InfiniteCarousel';
import { ProfilePage } from './components/ProfilePage';
import { WebGLBackground } from './components/WebGLBackground';
import { ExploreView } from './components/ExploreView';
import { ContentGrid, MOCK_FEATURED_SLOTS } from './components/ContentGrid';
import LongArrowLeft from './components/LongArrowLeft';
import FlamingoLogo from './components/FlamingoLogo';
import PinterestCard from './components/PinterestCard';
import SpotlightTracksSection from './components/SpotlightTracksSection';
import SongRowItem from './components/SongRowItem';
import DjSetStackSwipe from './components/DjSetStackSwipe';
import TracksBottomSheet from './components/TracksBottomSheet';
import PlayerTicker from './components/PlayerTicker';

// ==========================================
// VIEW IMPORTS (From src/views/)
// ==========================================
import SinglePodcastView from './views/SinglePodcastView';
import SingleDjSetView from './views/SingleDjSetView';
import SingleDjSetTrackView from './views/SingleDjSetTrackView';
import SingleSongView from './views/SingleSongView';
import SinglePlaylistView from './views/SinglePlaylistView';
import { PodcastEpisodePlayerPage as SinglePodcastEpisodeView } from './views/PodcastEpisodePlayerPage';

// ==========================================
// DATA IMPORTS & RE-EXPORTS (From src/data/)
// ==========================================
import { MUSIC_PLAYLISTS, PODCAST_ITEMS, getPodcastSongs, getPlaylistSongs } from './data/podcasts';
import { DJSET_ITEMS, MOCK_SONGS, getDjSetSongs } from './data/djsets';
import { HOMEPAGE_BACKGROUNDS, RANDOM_BACKGROUNDS, getRandomBackground } from './data/featured';
import { PLAYLIST_SPOTLIGHT_TRACKS, PODCAST_SPOTLIGHT_TRACKS, DJSET_SPOTLIGHT_TRACKS, PROGRAMMI_SPOTLIGHT_TRACKS } from './data/tracks';
import { PROGRAMMI_ITEMS, MUSIK_TALK_EPISODES } from './data/shows';
import { Song } from './types';

export {
  MUSIC_PLAYLISTS,
  PODCAST_ITEMS,
  getPodcastSongs,
  getPlaylistSongs,
  DJSET_ITEMS,
  MOCK_SONGS,
  getDjSetSongs,
  HOMEPAGE_BACKGROUNDS,
  RANDOM_BACKGROUNDS,
  getRandomBackground,
  PLAYLIST_SPOTLIGHT_TRACKS,
  PODCAST_SPOTLIGHT_TRACKS,
  DJSET_SPOTLIGHT_TRACKS,
  PROGRAMMI_SPOTLIGHT_TRACKS,
  PROGRAMMI_ITEMS,
  MUSIK_TALK_EPISODES
};
export type { Song };

function getSpansForTotal(N: number): number[] {
  if (N <= 0) return [];
  if (N === 1) return [3];
  if (N === 2) return [2, 1];
  if (N === 3) return [2, 1, 3];
  if (N === 4) return [2, 1, 1, 2];
  if (N === 5) return [2, 1, 1, 1, 1];
  
  const spans: number[] = [];
  let remaining = N;
  let rowTypeToggle = 0;
  while (remaining > 0) {
    if (remaining === 1) {
      spans.push(3);
      remaining -= 1;
    } else if (remaining === 2) {
      spans.push(2, 1);
      remaining -= 2;
    } else if (remaining === 3) {
      spans.push(2, 1, 3);
      remaining -= 3;
    } else if (remaining === 4) {
      spans.push(2, 1, 1, 2);
      remaining -= 4;
    } else {
      if (rowTypeToggle % 2 === 0) {
        spans.push(2, 1);
        remaining -= 2;
      } else {
        spans.push(1, 1, 1);
        remaining -= 3;
      }
      rowTypeToggle++;
    }
  }
  return spans;
}

const getBentoConfig = (index: number, total: number) => {
  const spans = getSpansForTotal(total);
  const span = spans[index] || 1;
  
  let smSpan = "sm:col-span-1";
  if (span === 3) {
    smSpan = "sm:col-span-2";
  } else if (span === 2) {
    smSpan = "sm:col-span-1";
  }

  const mdSpan = `md:col-span-${span}`;

  return {
    isFull: span >= 2,
    spanClass: `col-span-1 ${smSpan} ${mdSpan}`
  };
};

function PlaylistView() {
  const { isPlaying, togglePlay, currentTrackUrl } = usePlayer();
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] md:max-w-[90%] mx-auto px-6 sm:px-10 md:pl-[104px]">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-space text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Playlist
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Selezioni curate di canzoni iconiche, colonne sonore leggendarie ed esperimenti sonori d'autore.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Section title for Playlists */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 text-left">
          <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
            Curated Playlists
          </h2>
        </div>

        {/* Bento grid / cards of playlists - First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {MUSIC_PLAYLISTS.slice(0, 3).map((playlist, idx) => {
            return (
              <PinterestCard
                key={playlist.id}
                id={playlist.id}
                title={playlist.title}
                author={playlist.author}
                teaser={playlist.teaser}
                tag={playlist.tag || 'CONSIGLIATO'}
                subtitle={playlist.subtitle || "Playlist d'autore"}
                imageUrl={playlist.imageUrl}
                seed={playlist.seed}
                isFull={false}
                index={idx}
                onClick={() => navigate('/playlist/' + playlist.id)}
                isPlaylistCollage={!playlist.imageUrl}
                spanClass="col-span-1"
              />
            );
          })}
        </div>

        {/* Spotlight Section - Beautiful Alternating Layout in the middle */}
        <SpotlightTracksSection
          title="Spotlight"
          subtitle="Brani indipendenti e di alta qualità selezionati dal team editoriale di Radio Amblè"
          tracks={PLAYLIST_SPOTLIGHT_TRACKS}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          currentTrackUrl={currentTrackUrl}
        />

        {/* Remaining Curated Playlists */}
        {MUSIC_PLAYLISTS.length > 3 && (
          <div className="mt-8 pb-44 md:pb-32">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 text-left">
              <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
                Altre Playlist Consigliate
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {MUSIC_PLAYLISTS.slice(3).map((playlist, idx) => {
                return (
                  <PinterestCard
                    key={playlist.id}
                    id={playlist.id}
                    title={playlist.title}
                    author={playlist.author}
                    teaser={playlist.teaser}
                    tag={playlist.tag || 'CONSIGLIATO'}
                    subtitle={playlist.subtitle || "Playlist d'autore"}
                    imageUrl={playlist.imageUrl}
                    seed={playlist.seed}
                    isFull={false}
                    index={idx}
                    onClick={() => navigate('/playlist/' + playlist.id)}
                    isPlaylistCollage={!playlist.imageUrl}
                    spanClass="col-span-1"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.main>
  );
}

function PodcastView() {
  const { isPlaying, togglePlay, currentTrackUrl } = usePlayer();
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] md:max-w-[90%] mx-auto px-6 sm:px-10 md:pl-[104px]">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-space text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Podcast
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Puntate speciali, interviste esclusive e approfondimenti culturali on-demand su Radio Amblè.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Section title for Podcasts */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 text-left">
          <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
            Top Podcast
          </h2>
        </div>

        {/* Bento grid / cards of podcasts - First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {PODCAST_ITEMS.slice(0, 3).map((podcast, idx) => {
            return (
              <PinterestCard
                key={podcast.id}
                id={podcast.id}
                title={podcast.title}
                author={podcast.author}
                teaser={podcast.teaser}
                tag={podcast.tag || 'PODCAST'}
                subtitle={podcast.subtitle || 'Audio On-Demand'}
                imageUrl={podcast.imageUrl}
                seed={podcast.seed}
                isFull={false}
                index={idx}
                onClick={() => navigate('/podcast/' + podcast.id)}
                spanClass="col-span-1"
              />
            );
          })}
        </div>

        {/* Spotlight Section - Beautiful Alternating Layout in the middle */}
        <SpotlightTracksSection
          title="Podcast Highlights"
          subtitle="Gli episodi più ascoltati e consigliati della settimana"
          tracks={PODCAST_SPOTLIGHT_TRACKS}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          currentTrackUrl={currentTrackUrl}
        />

        {/* Remaining Podcasts */}
        {PODCAST_ITEMS.length > 3 && (
          <div className="mt-8 pb-44 md:pb-32">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 text-left">
              <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
                Altri Podcast
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {PODCAST_ITEMS.slice(3).map((podcast, idx) => {
                return (
                  <PinterestCard
                    key={podcast.id}
                    id={podcast.id}
                    title={podcast.title}
                    author={podcast.author}
                    teaser={podcast.teaser}
                    tag={podcast.tag || 'PODCAST'}
                    subtitle={podcast.subtitle || 'Audio On-Demand'}
                    imageUrl={podcast.imageUrl}
                    seed={podcast.seed}
                    isFull={false}
                    index={idx}
                    onClick={() => navigate('/podcast/' + podcast.id)}
                    spanClass="col-span-1"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.main>
  );
}

function DjSetView() {
  const { isPlaying, togglePlay, currentTrackUrl } = usePlayer();
  const navigate = useNavigate();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1280);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const gridItems = DJSET_ITEMS.map((item, idx) => {
    const aspectRatios = [0.75, 1.33, 1.0, 0.8, 1.5, 0.7, 1.25, 0.5625, 1.777];
    const aspectRatio = aspectRatios[idx % aspectRatios.length];
    
    return {
      id: String(item.id),
      type: 'image' as const,
      mediaUrl: item.imageUrl,
      aspectRatio,
      title: item.title,
      brandName: item.tag || 'DJ SET',
    };
  });

  const handleActionClick = (item: any, actionType: string) => {
    console.log(`Action triggered on item ${item.id}: ${actionType}`);
  };

  const handleCardClick = (item: any) => {
    navigate('/djset/' + item.id);
  };

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] md:max-w-[90%] mx-auto px-6 sm:px-10 pb-44 md:pb-32 md:pl-[104px]">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-space text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Dj Set
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Registrazioni esclusive, mix set ed eccezionali performance curate dai migliori DJ internazionali e locali.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Dynamic Pinterest ContentGrid with integrated alternating Tracklist & Video/Featured slots */}
        <ContentGrid 
          items={gridItems}
          featuredSlots={MOCK_FEATURED_SLOTS}
          onActionClick={handleActionClick}
          onCardClick={handleCardClick}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          currentTrackUrl={currentTrackUrl}
          spotlightTracks={DJSET_SPOTLIGHT_TRACKS}
        />
      </div>
    </motion.main>
  );
}



function ProgrammiView() {
  const { isPlaying, togglePlay, currentTrackUrl } = usePlayer();
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] md:max-w-[90%] mx-auto px-6 sm:px-10 md:pl-[104px]">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-space text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Programmi
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Il palinsesto e i programmi esclusivi in onda e on-demand su Radio Amblè.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Section title for Programmi */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 text-left">
          <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
            Top Programmi
          </h2>
        </div>

        {/* Bento grid / cards of programs - First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {PROGRAMMI_ITEMS.slice(0, 2).map((prog, idx) => {
            return (
              <PinterestCard
                key={prog.id}
                id={prog.id}
                title={prog.title}
                author={prog.author}
                teaser={prog.teaser}
                tag={prog.tag}
                subtitle={prog.time}
                imageUrl={prog.imageUrl}
                isFull={false}
                index={idx}
                onClick={() => {
                  if (prog.type === 'musiktalk') {
                    navigate('/programmi/musik-talk');
                  } else if (prog.type === 'podcast' && prog.targetId) {
                    navigate(`/podcast/${prog.targetId}`);
                  } else if (prog.type === 'djset' && prog.targetId) {
                    navigate(`/djset/${prog.targetId}`);
                  }
                }}
                spanClass="col-span-1"
              />
            );
          })}
        </div>

        {/* Spotlight Section - Beautiful Alternating Layout in the middle */}
        <SpotlightTracksSection
          title="On-Air Spotlight"
          subtitle="Il meglio dei nostri programmi e talk show selezionati in questa settimana"
          tracks={PROGRAMMI_SPOTLIGHT_TRACKS}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          currentTrackUrl={currentTrackUrl}
        />

        {/* Remaining Programs */}
        {PROGRAMMI_ITEMS.length > 2 && (
          <div className="mt-8 pb-44 md:pb-32">
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 text-left">
              <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
                Altri Programmi
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {PROGRAMMI_ITEMS.slice(2).map((prog, idx) => {
                return (
                  <PinterestCard
                    key={prog.id}
                    id={prog.id}
                    title={prog.title}
                    author={prog.author}
                    teaser={prog.teaser}
                    tag={prog.tag}
                    subtitle={prog.time}
                    imageUrl={prog.imageUrl}
                    isFull={false}
                    index={idx}
                    onClick={() => {
                      if (prog.type === 'musiktalk') {
                        navigate('/programmi/musik-talk');
                      } else if (prog.type === 'podcast' && prog.targetId) {
                        navigate(`/podcast/${prog.targetId}`);
                      } else if (prog.type === 'djset' && prog.targetId) {
                        navigate(`/djset/${prog.targetId}`);
                      }
                    }}
                    spanClass="col-span-1"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.main>
  );
}

function MusikTalkView() {
  const { isPlaying, togglePlay, currentTrackUrl, userLikes, toggleLike } = usePlayer();
  const navigate = useNavigate();
  const [bgUrl] = useState(() => "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(5).jpg");

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Immersive Background */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <img 
          className="absolute inset-0 w-full h-full object-cover"
          src={bgUrl}
          alt=""
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-red-950/30 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-black/75 pointer-events-none"></div>
      </div>

      {/* Content Area */}
      <div className="absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 pt-28 md:pt-36 md:pl-[104px]">
        <div className="w-full max-w-[1200px] mx-auto pb-44">
          
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            {/* Left Cover Artwork */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0 group">
              <img 
                src={bgUrl} 
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
                  ESCLUSIVA RADIO AMBLÈ
                </span>
              </div>
              
              <h1 className="font-space text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
                Musik & Talk
              </h1>
              
              <p className="font-sans text-sm sm:text-base text-white/70 mt-2">
                Con <span className="font-semibold text-white">Francesco Farfa, Ricky le Roy & ospiti</span>
              </p>

              <p className="font-sans text-xs sm:text-sm text-white/50 mt-3 leading-relaxed max-w-2xl">
                Puntate storiche, interviste intime ed eccitanti selezioni musicali firmate con i padri fondatori e i protagonisti della scena clubbing.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                <button 
                  onClick={() => togglePlay(MUSIK_TALK_EPISODES[0]?.audioUrl)}
                  className={`h-12 px-6 rounded-full bg-white text-black hover:bg-white/90 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg text-sm shrink-0 ${isPlaying && MUSIK_TALK_EPISODES.some(s => s.audioUrl === currentTrackUrl) ? 'play-pulse' : ''}`}
                >
                  {isPlaying && MUSIK_TALK_EPISODES.some(s => s.audioUrl === currentTrackUrl) ? (
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

          {/* Section Divider & Title */}
          <div className="flex items-center justify-between mt-12 mb-6 border-b border-white/5 pb-4">
            <h2 className="font-space font-bold text-lg sm:text-xl text-white tracking-wider flex items-center gap-1.5 uppercase">
              <span>Le Puntate</span>
              <ChevronRight size={18} className="text-[#ff2e55]" />
            </h2>
            <span className="text-xs text-white/40 font-sans">{MUSIK_TALK_EPISODES.length} puntate</span>
          </div>

          {/* Episode List */}
          <div className="flex flex-col gap-3">
            {MUSIK_TALK_EPISODES.map((song, i) => (
              <SongRowItem
                key={i}
                song={song}
                index={i}
                playlistId={5}
                playlistType="musiktalk"
                isPlaying={isPlaying}
                currentTrackUrl={currentTrackUrl}
                onPlayToggle={togglePlay}
                userLikes={userLikes}
                onLikeToggle={toggleLike}
                playlistImage={bgUrl}
                author={song.author}
              />
            ))}
          </div>

        </div>
      </div>
    </motion.main>
  );
}

function SingleMusikTalkEpisodeView() {
  const { isPlaying, togglePlay, playTrack, userLikes, toggleLike, currentTrackUrl } = usePlayer();
  const { id } = useParams();
  const navigate = useNavigate();

  const epIndex = MUSIK_TALK_EPISODES.findIndex(ep => ep.id === Number(id));
  const ep = MUSIK_TALK_EPISODES[epIndex];

  if (!ep) return null;

  const bgUrl = ep.imageUrl;
  const itemId = `musiktalk_ep:${ep.id}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === ep.audioUrl;
  const isVideo = bgUrl?.toLowerCase().endsWith('.mp4');

  const goToPrev = () => {
    if (epIndex > 0) {
      const prevEp = MUSIK_TALK_EPISODES[epIndex - 1];
      playTrack(prevEp.audioUrl);
      navigate(`/programmi/musik-talk/${prevEp.id}`, { replace: true });
    }
  };

  const goToNext = () => {
    if (epIndex < MUSIK_TALK_EPISODES.length - 1) {
      const nextEp = MUSIK_TALK_EPISODES[epIndex + 1];
      playTrack(nextEp.audioUrl);
      navigate(`/programmi/musik-talk/${nextEp.id}`, { replace: true });
    }
  };

  useEffect(() => {
    if (currentTrackUrl !== ep.audioUrl) {
      playTrack(ep.audioUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ep.audioUrl]);

  return (
    <motion.main
      className="relative z-30 w-full h-full"
    >
      {/* Background (Episode cover image) */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={bgUrl}
          />
        ) : (
          <img 
            className="absolute inset-0 w-full h-full object-cover object-center"
            src={bgUrl}
            alt=""
            referrerPolicy="no-referrer"
          />
        )}
        {/* Color tone blend overlays matching single song/podcast style */}
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
            {ep.title}
          </h2>

          <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/70 uppercase mt-2 mb-4">
            Music & Talk • {ep.author}
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
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${epIndex === 0 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={epIndex === 0}
              >
                <SkipBack size={24} strokeWidth={2} />
              </button>

              <button 
                onClick={() => togglePlay(ep.audioUrl)}
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
                className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${epIndex === MUSIK_TALK_EPISODES.length - 1 ? 'text-white/30 cursor-not-allowed' : 'text-white'}`}
                disabled={epIndex === MUSIK_TALK_EPISODES.length - 1}
              >
                <SkipForward size={24} strokeWidth={2} />
              </button>
            </div>

            <button 
              className="p-2 text-white/80 transition-transform hover:scale-110 flex items-center justify-center"
              aria-label="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: ep.title, url: window.location.href })
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

function HomeView() {
  const { isPlaying, userLikes, togglePlay, toggleLike, currentTrackUrl } = usePlayer();
  const navigate = useNavigate();
  const itemId = 'radio-amble-live';
  const isLiked = userLikes?.includes(itemId) || false;
  const isStreamPlaying = isPlaying && (currentTrackUrl === "https://mqugxowc-lbmedia.radioca.st/stream" || currentTrackUrl === null);
  return (
    <motion.main
      className="relative z-10 w-full max-w-[500px] h-full flex flex-col justify-between pt-24 pb-[96px] md:pb-[32px] px-6 overflow-hidden"
    >
      <div className="flex-1 flex flex-col justify-end">
        <PlayerTicker />
        <div 
          className="glass-panel animated-gradient-border w-full px-6 py-4 sm:py-6 flex flex-col items-center text-center shrink-0 bg-[#0c0c0e]/45 backdrop-blur-md shadow-2xl"
        >
          {/* Custom partnership text */}
          <span className="text-[9px] tracking-wider text-white/40 font-sans mt-1 mb-2">sponsored by</span>

          <a
            href="https://disclaimerofficial.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-[-15px] mb-[-12px] sm:mt-[-30px] sm:mb-[-25px] flex flex-col items-center justify-center cursor-pointer transition-transform duration-300 hover:scale-105"
            title="Visita disclaimerofficial.com"
          >
            <img 
              src="https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/disclaimer/Screenshot_2026-06-15_11.39.16-removebg-preview.png" 
              alt="Disclaimer Logo" 
              className="h-[75px] sm:h-[110px] md:h-[130px] w-auto object-contain select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </a>
          
          <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/70 uppercase mt-1 mb-4">
            radio amblè live
          </p>

          <div className="flex items-center justify-between w-full max-w-[260px]">
            <button 
              onClick={() => toggleLike(itemId)}
              className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${isLiked ? 'text-white' : 'text-white/80'}`}
              aria-label="Like"
            >
              <Heart size={22} strokeWidth={isLiked ? 2.5 : 1} className={isLiked ? "fill-white" : ""} />
            </button>

            <button 
              onClick={() => togglePlay()}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform ${isStreamPlaying ? 'play-pulse' : ''}`}
              aria-label={isStreamPlaying ? "Pause" : "Play"}
            >
              {isStreamPlaying ? ( 
                <Pause className="w-6 h-6 sm:w-7 sm:h-7 fill-black" strokeWidth={2} /> 
              ) : ( 
                <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-black" strokeWidth={2} /> 
              )}
            </button>

            <button 
              className="p-2 text-white/80 transition-transform hover:scale-110 flex items-center justify-center"
              aria-label="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Radio Amblè Live', url: window.location.href })
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

  function AppContent() {
  const { user, signIn, logOut } = useAuth();
  const [currentHomeBgIndex, setCurrentHomeBgIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Floating Header show/hide on scroll states
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollTop = useRef(0);

  // Preload homepage backgrounds
  useEffect(() => {
    HOMEPAGE_BACKGROUNDS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Listen to scroll events on any container (capture phase)
  useEffect(() => {
    const handleScroll = (e: Event) => {
      // Only apply on desktop
      if (window.innerWidth < 768) {
        setShowHeader(true);
        setIsScrolled(false);
        return;
      }

      const target = e.target as HTMLElement;
      if (!target || typeof target.scrollTop === 'undefined') return;

      const scrollTop = target.scrollTop;
      
      setIsScrolled(scrollTop > 20);

      // If we are on the homepage, always show the header
      if (location.pathname === '/') {
        setShowHeader(true);
        return;
      }

      // Check scroll direction
      if (scrollTop > lastScrollTop.current && scrollTop > 100) {
        // Scrolling down and past threshold -> hide
        setShowHeader(false);
      } else if (scrollTop < lastScrollTop.current) {
        // Scrolling up -> show
        setShowHeader(true);
      }
      
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [location.pathname]);

  // Reset header state on route change
  useEffect(() => {
    setShowHeader(true);
    setIsScrolled(false);
    lastScrollTop.current = 0;
  }, [location.pathname]);

  const getDepth = (path: string) => path === '/' ? 0 : path.split('/').filter(Boolean).length;
  const prevPathRef = useRef(location.pathname);
  const directionRef = useRef(1);

  if (prevPathRef.current !== location.pathname) {
    const prevDepth = getDepth(prevPathRef.current);
    const currDepth = getDepth(location.pathname);
    directionRef.current = currDepth < prevDepth ? -1 : 1;
    prevPathRef.current = location.pathname;
  }
  
  const direction = directionRef.current;
  const isHome = location.pathname === '/';

  // Set up background slide timer when isHome is active
  useEffect(() => {
    if (!isHome) return;
    const interval = setInterval(() => {
      setCurrentHomeBgIndex((prev) => (prev + 1) % HOMEPAGE_BACKGROUNDS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isHome]);

  const handleBack = () => {
    const path = location.pathname;
    
    if (path.includes('/song/')) {
      const parentPath = path.substring(0, path.indexOf('/song/'));
      navigate(parentPath);
    } else if (path.startsWith('/programmi/musik-talk/')) {
      navigate('/programmi/musik-talk');
    } else if (path === '/programmi/musik-talk') {
      navigate('/programmi');
    } else if (path.startsWith('/playlist/')) {
      navigate('/playlist');
    } else if (path.startsWith('/podcast/')) {
      navigate('/podcast');
    } else if (path.startsWith('/djset/')) {
      navigate('/djset');
    } else if (path === '/playlist' || path === '/podcast' || path === '/djset' || path === '/programmi') {
      navigate('/');
    } else {
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }
  };

  const handleDragEnd = (e: any, info: any) => {
    // Only detect swipe on mobile
    if (window.innerWidth >= 768) return;

    const swipeThreshold = 50;
    const TABS = ['/', '/playlist', '/podcast', '/djset', '/programmi', '/profile'];
    const currentPath = location.pathname;

    if (TABS.includes(currentPath)) {
      if (info.offset.x > swipeThreshold) {
        // Swipe right -> Go to previous tab
        const currentIndex = TABS.indexOf(currentPath);
        const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
        setTimeout(() => {
          navigate(TABS[prevIndex]);
        }, 0);
      } else if (info.offset.x < -swipeThreshold) {
        // Swipe left -> Go to next tab
        const currentIndex = TABS.indexOf(currentPath);
        const nextIndex = (currentIndex + 1) % TABS.length;
        setTimeout(() => {
          navigate(TABS[nextIndex]);
        }, 0);
      }
    } else {
      if (info.offset.x > swipeThreshold) {
        setTimeout(() => {
          handleBack();
        }, 0);
      }
    }
  };

  return (
    <div className={`h-screen h-[100dvh] w-full relative overflow-hidden flex flex-col items-center bg-[#0a0a0a]`}>
      
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        {isHome ? (
          <div className="absolute inset-0 w-full h-full">
            <WebGLBackground 
              images={HOMEPAGE_BACKGROUNDS}
              currentIndex={currentHomeBgIndex}
            />
            {/* Color tone blend overlays matching Scheggia style */}
            <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute inset-0 bg-black/55 pointer-events-none font-space"></div>
          </div>
        ) : (
          <>
            {!location.pathname.startsWith('/programmi/musik-talk') && (
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
                src="https://radioamble-cdn.b-cdn.net/video/From%20KlickPin%20CF%20%D0%9F%D0%B8%D0%BD%20%D0%BD%D0%B0%20%D0%B4%D0%BE%D1%81%D0%BA%D0%B5%20%D0%91%D1%8B%D1%81%D1%82%D1%80%D0%BE%D0%B5%20%D1%81%D0%BE%D1%85%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5.mp4" 
              />
            )}
            <div className="absolute inset-0 bg-red-900/40 mix-blend-multiply pointer-events-none"></div>
            <div className="absolute inset-0 bg-black/60 pointer-events-none"></div>
          </>
        )}
      </div>

      {/* Desktop Left Sidebar Navigation */}
      <div className="hidden md:flex flex-col items-center justify-between py-8 fixed left-[6px] top-[6px] bottom-[6px] w-[74px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-50">
        {/* Brand Logo / Top Mark */}
        <div className="flex flex-col items-center">
          <div className="w-11 h-11 mb-2 hover:scale-105 transition-transform duration-300 select-none flex items-center justify-center rounded-full overflow-hidden border border-white/10 bg-white/5">
            <img 
              src="https://radioamble-cdn.b-cdn.net/logo_radioamble.png" 
              alt="Radio Amblè Logo" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[7px] font-space tracking-[0.2em] font-black text-white/50 select-none">AMBLÈ</span>
        </div>

        {/* Navigation Middle Buttons */}
        <div className="flex flex-col gap-8 w-full px-2">
          {/* LIVE button */}
          <button 
            onClick={() => navigate('/')}
            className="relative flex flex-col items-center justify-center group py-2 cursor-pointer"
            title="Diretta Live"
          >
            <Radio 
              size={20} 
              className={`transition-all duration-300 ${
                location.pathname === '/' 
                  ? 'stroke-[2.5px] text-white scale-110' 
                  : 'stroke-[1.5px] text-white/40 group-hover:text-white/80 group-hover:scale-105'
              }`} 
            />
            <span className={`text-[8px] font-sans tracking-widest mt-1.5 font-black transition-colors ${
              location.pathname === '/' ? 'text-white' : 'text-white/30 group-hover:text-white/60'
            }`}>LIVE</span>
          </button>

          {/* PLAYLIST button */}
          <button 
            onClick={() => navigate('/playlist')}
            className="relative flex flex-col items-center justify-center group py-2 cursor-pointer"
            title="Playlist Curate"
          >
            <ListMusic 
              size={20} 
              className={`transition-all duration-300 ${
                location.pathname.startsWith('/playlist') 
                  ? 'stroke-[2.5px] text-white scale-110' 
                  : 'stroke-[1.5px] text-white/40 group-hover:text-white/80 group-hover:scale-105'
              }`} 
            />
            <span className={`text-[8px] font-sans tracking-widest mt-1.5 font-black transition-colors ${
              location.pathname.startsWith('/playlist') ? 'text-white' : 'text-white/30 group-hover:text-white/60'
            }`}>PLAYLIST</span>
          </button>

          {/* PODCAST button */}
          <button 
            onClick={() => navigate('/podcast')}
            className="relative flex flex-col items-center justify-center group py-2 cursor-pointer"
            title="Podcast"
          >
            <Mic 
              size={20} 
              className={`transition-all duration-300 ${
                location.pathname.startsWith('/podcast') 
                  ? 'stroke-[2.5px] text-white scale-110' 
                  : 'stroke-[1.5px] text-white/40 group-hover:text-white/80 group-hover:scale-105'
              }`} 
            />
            <span className={`text-[8px] font-sans tracking-widest mt-1.5 font-black transition-colors ${
              location.pathname.startsWith('/podcast') ? 'text-white' : 'text-white/30 group-hover:text-white/60'
            }`}>PODCAST</span>
          </button>

          {/* DJ SET button */}
          <button 
            onClick={() => navigate('/djset')}
            className="relative flex flex-col items-center justify-center group py-2 cursor-pointer"
            title="DJ Set"
          >
            <Disc3 
              size={20} 
              className={`transition-all duration-300 ${
                location.pathname.startsWith('/djset') 
                  ? 'stroke-[2.5px] text-white scale-110' 
                  : 'stroke-[1.5px] text-white/40 group-hover:text-white/80 group-hover:scale-105'
              }`} 
            />
            <span className={`text-[8px] font-sans tracking-widest mt-1.5 font-black transition-colors ${
              location.pathname.startsWith('/djset') ? 'text-white' : 'text-white/30 group-hover:text-white/60'
            }`}>DJ SET</span>
          </button>

          {/* TALK/PROGRAMMI button */}
          <button 
            onClick={() => navigate('/programmi')}
            className="relative flex flex-col items-center justify-center group py-2 cursor-pointer"
            title="Talk & Programmi"
          >
            <Home 
              size={20} 
              className={`transition-all duration-300 ${
                location.pathname.startsWith('/programmi') 
                  ? 'stroke-[2.5px] text-white scale-110' 
                  : 'stroke-[1.5px] text-white/40 group-hover:text-white/80 group-hover:scale-105'
              }`} 
            />
            <span className={`text-[8px] font-sans tracking-widest mt-1.5 font-black transition-colors ${
              location.pathname.startsWith('/programmi') ? 'text-white' : 'text-white/30 group-hover:text-white/60'
            }`}>TALK</span>
          </button>
        </div>

        {/* Profile / Bottom Section */}
        <div className="w-full px-2">
          <button 
            onClick={() => navigate('/profile')}
            className="relative flex flex-col items-center justify-center group py-2 w-full cursor-pointer"
            title={user ? "Il tuo Profilo" : "Accedi / Registrati"}
          >
            <UserIcon 
              size={20} 
              className={`transition-all duration-300 ${
                location.pathname.startsWith('/profile') 
                  ? 'stroke-[2.5px] text-white scale-110' 
                  : 'stroke-[1.5px] text-white/40 group-hover:text-white/80 group-hover:scale-105'
              }`} 
            />
            <span className={`text-[8px] font-sans tracking-widest mt-1.5 font-black transition-colors ${
              location.pathname.startsWith('/profile') ? 'text-white' : 'text-white/30 group-hover:text-white/60'
            }`}>PROFILO</span>
          </button>
        </div>
      </div>
      
      {/* Pages */}
      <AnimatePresence custom={direction}>
        <motion.div
          key={location.pathname.includes('/song/') ? location.pathname.substring(0, location.pathname.lastIndexOf('/song/')) + '/song' : location.pathname}
          custom={direction}
          variants={{
            initial: (dir) => ({
              x: dir > 0 ? "100%" : "-30%",
              zIndex: dir > 0 ? 10 : 0
            }),
            animate: {
              x: 0,
              zIndex: 10
            },
            exit: (dir) => ({
              x: dir > 0 ? "-30%" : "100%",
              zIndex: dir > 0 ? 0 : 10
            })
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
          drag={window.innerWidth < 768 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          <Routes location={location}>
            <Route path="/" element={<HomeView />} />
            <Route path="/playlist" element={<PlaylistView />} />
            <Route path="/playlist/:id" element={<SinglePlaylistView />} />
            <Route path="/playlist/:id/song/:songIndex" element={<SingleSongView />} />
            <Route path="/podcast" element={<PodcastView />} />
            <Route path="/podcast/:id" element={<SinglePodcastView />} />
            <Route path="/podcast/:id/song/:songIndex" element={<SinglePodcastEpisodeView />} />
            <Route path="/djset" element={<DjSetView />} />
            <Route path="/djset/:id" element={<SingleDjSetView />} />
            <Route path="/djset/:id/song/:songIndex" element={<SingleDjSetTrackView />} />
            <Route path="/programmi" element={<ProgrammiView />} />
            <Route path="/programmi/musik-talk" element={<MusikTalkView />} />
            <Route path="/programmi/musik-talk/:id" element={<SingleMusikTalkEpisodeView />} />
            <Route path="/explore" element={<ExploreView />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>

      {/* Floating Header */}
      <header 
        className={`z-40 w-full transition-all duration-500 ease-out ${
          isHome 
            ? 'absolute top-8 left-0 right-0 bg-transparent' 
            : `fixed top-0 left-0 right-0 ${
                isScrolled 
                  ? 'bg-black/40 backdrop-blur-md border-b border-white/5 shadow-lg' 
                  : 'bg-transparent border-b border-transparent shadow-none'
              }`
        }`}
        style={{
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <div className={`w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:pl-[124px] flex justify-between items-center transition-all duration-300 ${
          isHome ? 'h-12' : 'h-16 md:h-20'
        }`}>
          {/* Left Column: Back button */}
          <div className="flex items-center gap-4 w-10 md:min-w-[200px] h-full">
            {!isHome && (
              <button 
                onClick={handleBack}
                className="text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer p-1 -ml-1"
              >
                <ChevronLeft size={24} />
              </button>
            )}
          </div>

          {/* Center Column for Mobile: Mobile Brand/Logo */}
          {isHome && (
            <div className="flex md:hidden justify-center flex-1 max-w-[200px] h-full items-center">
              <span className="text-center text-white font-space tracking-[0.2em] font-black text-sm select-none">
                RADIO AMBLÈ
              </span>
            </div>
          )}
          
          {/* Right Column: Spacing placeholder on desktop */}
          <div className="flex items-center justify-end w-10 md:min-w-[200px] h-full" />
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[440px] h-[64px] flex items-center justify-around px-2 transition-all duration-300 ${
        !isHome 
          ? "bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]" 
          : ""
      }`}>
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname === '/' ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <Radio size={18} className={location.pathname === '/' ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname === '/' ? 'text-white' : 'text-white/40'}`}>LIVE</span>
        </button>

        <button 
          onClick={() => navigate('/playlist')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/playlist') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <ListMusic size={18} className={location.pathname.startsWith('/playlist') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/playlist') ? 'text-white' : 'text-white/40'}`}>PLAYLIST</span>
        </button>

        <button 
          onClick={() => navigate('/podcast')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/podcast') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <Mic size={18} className={location.pathname.startsWith('/podcast') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/podcast') ? 'text-white' : 'text-white/40'}`}>PODCAST</span>
        </button>

        <button 
          onClick={() => navigate('/djset')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/djset') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <Disc3 size={18} className={location.pathname.startsWith('/djset') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/djset') ? 'text-white' : 'text-white/40'}`}>DJ SET</span>
        </button>

        <button 
          onClick={() => navigate('/programmi')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/programmi') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <Home size={18} className={location.pathname.startsWith('/programmi') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/programmi') ? 'text-white' : 'text-white/40'}`}>TALK</span>
        </button>

        <button 
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${location.pathname.startsWith('/profile') ? 'text-white scale-110' : 'text-white/40 hover:text-white/70'}`}
        >
          <UserIcon size={18} className={location.pathname.startsWith('/profile') ? 'stroke-[2px] text-white' : 'stroke-[1.5px]'} />
          <span className={`text-[8px] font-sans tracking-wider mt-1 font-bold ${location.pathname.startsWith('/profile') ? 'text-white' : 'text-white/40'}`}>PROFILO</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlayerProvider>
          <AppContent />
        </PlayerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
