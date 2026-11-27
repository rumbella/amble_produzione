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

import { useViewportHeight } from './hooks/useViewportHeight';
import { usePlayerHeightObserver } from './hooks/usePlayerHeightObserver';
import { useScrollMemory, setPreviousPathname, isRestoringScroll, registerScrollResetListener } from './hooks/useScrollMemory';
import AdminHome from './pages/AdminHome';
import { HomeBackground } from './components/HomeBackground';
import { PlayerSponsor } from './components/PlayerSponsor';
import { PlayButtonIcon } from './components/PlayButtonIcon';
import { useHomepageConfig } from './hooks/useHomepageConfig';
import type { HomepageConfig } from './types/homepage';
import { PageBackground } from './components/PageBackground';
import { SponsorMarquee } from './components/SponsorMarquee';
import { SponsorSpotModal, useSponsorSpot } from './components/SponsorSpotModal';
import { useSwipe, SwipeDir } from './hooks/useSwipe';
import { useHeartBurst } from './components/HeartBurst';
import { MiniPlayer } from './components/MiniPlayer';
import { InstallBanner } from './components/InstallApp';

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
  const scrollRef = useScrollMemory();

  return (
    <motion.main
      ref={scrollRef}
      className="absolute inset-0 z-30 w-full h-full min-h-full flex flex-col page-top-spacing overflow-y-auto bg-[#0a0a0a]"
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
  const scrollRef = useScrollMemory();

  return (
    <motion.main
      ref={scrollRef}
      className="absolute inset-0 z-30 w-full h-full min-h-full flex flex-col page-top-spacing overflow-y-auto bg-[#0a0a0a]"
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
  const scrollRef = useScrollMemory();

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
      ref={scrollRef}
      className="absolute inset-0 z-30 w-full h-full min-h-full flex flex-col page-top-spacing overflow-y-auto bg-[#0a0a0a]"
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
  const scrollRef = useScrollMemory();

  return (
    <motion.main
      ref={scrollRef}
      className="absolute inset-0 z-30 w-full h-full min-h-full flex flex-col page-top-spacing overflow-y-auto bg-[#0a0a0a]"
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
  const { isPlaying, isLoading, togglePlay, currentTrackUrl, userLikes, toggleLike } = usePlayer();
  const navigate = useNavigate();
  const [bgUrl] = useState(() => "https://radioamble-cdn.b-cdn.net/Musik%20%26%20Talk/post%20animato%20musik%26talk%20%20(5).jpg");
  const scrollRef = useScrollMemory();
  const listHasCurrent = MUSIK_TALK_EPISODES.some(s => s.audioUrl === currentTrackUrl);
  const listIsPlaying = isPlaying && listHasCurrent;
  const listIsLoading = isLoading && listHasCurrent;

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full min-h-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Immersive Background */}
      <PageBackground type="image" src={bgUrl} />

      {/* Content Area */}
      <div 
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 page-top-spacing md:pl-[104px]"
      >
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
                  onClick={() => togglePlay(MUSIK_TALK_EPISODES[0]?.audioUrl, MUSIK_TALK_EPISODES[0] ? {
                    title: MUSIK_TALK_EPISODES[0].title,
                    subtitle: 'Musik & Talk',
                    image: MUSIK_TALK_EPISODES[0].imageUrl || bgUrl,
                    href: `/programmi/musik-talk/${MUSIK_TALK_EPISODES[0].id}`,
                  } : undefined)}
                  className={`h-12 px-6 rounded-full bg-white text-black hover:bg-white/90 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg text-sm shrink-0 ${listIsPlaying && !listIsLoading ? 'play-pulse' : ''}`}
                  aria-label={listIsLoading ? "Connessione in corso" : listIsPlaying ? "Pausa" : "Ascolta"}
                >
                  <PlayButtonIcon playing={listIsPlaying} loading={listIsLoading} size={16} />
                  <span>{listIsPlaying ? 'PAUSA' : 'ASCOLTA'}</span>
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
  const { isPlaying, isLoading, togglePlay, playTrack, userLikes, toggleLike, currentTrackUrl } = usePlayer();
  const playerCardRef = usePlayerHeightObserver<HTMLDivElement>();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const epIndex = MUSIK_TALK_EPISODES.findIndex(ep => ep.id === Number(id));
  const ep = MUSIK_TALK_EPISODES[epIndex];

  const sponsor = ep?.sponsor;
  const { isOpen: isSpotOpen, openSpot, closeSpot } = useSponsorSpot(sponsor);

  const bgUrl = ep?.imageUrl;
  const itemId = ep ? `musiktalk_ep:${ep.id}` : '';
  const isLiked = userLikes?.includes(itemId) || false;
  const epAudio = ep?.audioUrl ?? '';
  const trackIsPlaying = isPlaying && currentTrackUrl === epAudio;
  const trackIsLoading = isLoading && currentTrackUrl === epAudio;

  const epMeta = ep ? {
    title: ep.title,
    subtitle: ep.author || 'Musik & Talk',
    image: bgUrl,
    href: location.pathname,
  } : undefined;

  const goToPrev = () => {
    if (epIndex > 0) {
      const prevEp = MUSIK_TALK_EPISODES[epIndex - 1];
      const prevHref = `/programmi/musik-talk/${prevEp.id}`;
      playTrack(prevEp.audioUrl, {
        title: prevEp.title,
        subtitle: prevEp.author || 'Musik & Talk',
        image: prevEp.imageUrl,
        href: prevHref,
      });
      navigate(prevHref, { replace: true });
    }
  };

  const goToNext = () => {
    if (epIndex < MUSIK_TALK_EPISODES.length - 1) {
      const nextEp = MUSIK_TALK_EPISODES[epIndex + 1];
      const nextHref = `/programmi/musik-talk/${nextEp.id}`;
      playTrack(nextEp.audioUrl, {
        title: nextEp.title,
        subtitle: nextEp.author || 'Musik & Talk',
        image: nextEp.imageUrl,
        href: nextHref,
      });
      navigate(nextHref, { replace: true });
    }
  };

  const share = () => {
    if (!ep) return;
    if (navigator.share) {
      navigator.share({ title: ep.title, url: window.location.href })
        .catch(e => {
          if (e.name !== 'AbortError') console.error("Share failed", e);
        });
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const heart = useHeartBurst();
  const pageSwipeRef = useSwipe<HTMLElement>({
    onSwipe: (d) => {
      if (d === 'left') goToNext();
      if (d === 'right') goToPrev();
    },
    onDoubleTap: (x, y) => {
      if (itemId && !isLiked) toggleLike(itemId);
      heart.show(x, y);
    },
  }, isTouch);
  const playerSwipeRef = useSwipe<HTMLDivElement>({ onLongPress: share }, isTouch);

  useEffect(() => {
    if (epAudio && currentTrackUrl !== epAudio) {
      playTrack(epAudio, epMeta);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epAudio]);

  if (!ep) return null;

  return (
    <motion.main
      ref={pageSwipeRef}
      className="relative z-30 w-full h-full min-h-full bg-[#0a0a0a] overflow-hidden"
    >
      {heart.layer}
      {/* Level 3: Scoped Full-Page Background */}
      <PageBackground 
        type={sponsor ? sponsor.backgroundType : bgUrl ? 'image' : 'neutral'}
        src={sponsor ? sponsor.backgroundSrc : bgUrl}
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
            ref={playerSwipeRef}
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
                  onClick={() => togglePlay(ep.audioUrl, epMeta)}
                  className={`w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform mx-2 ${trackIsPlaying && !trackIsLoading ? 'play-pulse' : ''}`}
                  aria-label={trackIsLoading ? "Connessione in corso" : trackIsPlaying ? "Pause" : "Play"}
                >
                  <PlayButtonIcon playing={trackIsPlaying} loading={trackIsLoading} size={28} />
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
                onClick={share}
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

function HomeView({ homeConfig }: { homeConfig: HomepageConfig }) {
  const { isPlaying, isLoading, userLikes, togglePlay, toggleLike, currentTrackUrl, streamUrl } = usePlayer();
  const playerCardRef = usePlayerHeightObserver<HTMLDivElement>();
  const itemId = 'radio-amble-live';
  const isLiked = userLikes?.includes(itemId) || false;
  const isStreamPlaying = isPlaying && (currentTrackUrl === streamUrl || currentTrackUrl === null);
  const isStreamLoading = isLoading && (currentTrackUrl === streamUrl || currentTrackUrl === null);

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: 'Radio Amblè Live', url: window.location.href })
        .catch(e => {
          if (e.name !== 'AbortError') console.error("Share failed", e);
        });
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const heart = useHeartBurst();
  const pageSwipeRef = useSwipe<HTMLElement>({
    onDoubleTap: (x, y) => {
      if (!isLiked) toggleLike(itemId);
      heart.show(x, y);
    },
  }, isTouch);
  const playerSwipeRef = useSwipe<HTMLDivElement>({ onLongPress: share }, isTouch);

  return (
    <motion.main
      ref={pageSwipeRef}
      className="home-main relative z-10 w-full h-full flex flex-col items-center overflow-hidden bg-transparent"
    >
      {heart.layer}
      {/* The Player Box in normal flex flow */}
      <div className="relative z-10 w-full max-w-[500px] h-full flex flex-col justify-end pt-16 sm:pt-20 pb-2 md:pb-6 px-6 overflow-hidden mx-auto pointer-events-auto">
        <div className="flex-1 min-h-[10px]" />
        <div ref={playerCardRef} className="shrink-0 flex flex-col items-center w-full">
          <PlayerTicker />
          <div 
            ref={playerSwipeRef}
            className="glass-panel animated-gradient-border w-full px-6 pt-4 sm:pt-6 pb-6 sm:pb-8 flex flex-col items-center text-center shrink-0 bg-[#0c0c0e]/45 backdrop-blur-md shadow-2xl"
          >
            <PlayerSponsor sponsor={homeConfig.sponsor} />
            
            <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/70 uppercase mt-1 mb-6">
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

              <div className="relative flex items-center justify-center">
                {isStreamPlaying && (
                  <>
                    <span 
                      aria-hidden="true" 
                      className="absolute inset-0 ripple-ring"
                      style={{ animationDelay: '0s' }}
                    />
                    <span 
                      aria-hidden="true" 
                      className="absolute inset-0 ripple-ring"
                      style={{ animationDelay: '1s' }}
                    />
                    <span 
                      aria-hidden="true" 
                      className="absolute inset-0 ripple-ring"
                      style={{ animationDelay: '2s' }}
                    />
                  </>
                )}
                <button 
                  onClick={() => togglePlay()}
                  className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                  aria-label={isStreamLoading ? "Connessione in corso" : isStreamPlaying ? "Pause" : "Play"}
                >
                  <PlayButtonIcon playing={isStreamPlaying} loading={isStreamLoading} size={26} />
                </button>
              </div>

              <button 
                className="p-2 text-white/80 transition-transform hover:scale-110 flex items-center justify-center"
                aria-label="Share"
                onClick={share}
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

  function AppContent() {
  useViewportHeight();
  const { user, signIn, logOut } = useAuth();
  const { nowPlaying, isPlaying, isLoading, currentTrackUrl, togglePlay, stop, streamUrl } = usePlayer();
  const location = useLocation();
  const navigate = useNavigate();
  const homeConfig = useHomepageConfig();

  // Floating Header show/hide on scroll states
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollTop = useRef(0);

  // Synchronize header with scroll restoration from useScrollMemory
  useEffect(() => {
    return registerScrollResetListener((restoredScrollTop: number) => {
      lastScrollTop.current = restoredScrollTop;
      setShowHeader(true);
      setIsScrolled(restoredScrollTop > 20);
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
      
      // If we are currently restoring scroll, do NOT hide the header
      if (isRestoringScroll()) {
        setShowHeader(true);
        setIsScrolled(scrollTop > 20);
        lastScrollTop.current = scrollTop;
        return;
      }

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
    if (!isRestoringScroll()) {
      setIsScrolled(false);
      lastScrollTop.current = 0;
    }
  }, [location.pathname]);

  const SECTIONS = ['/', '/playlist', '/podcast', '/djset', '/programmi'];
  const getDepth = (path: string) => path === '/' ? 0 : path.split('/').filter(Boolean).length;
  const prevPathRef = useRef(location.pathname);
  const directionRef = useRef(1);

  if (prevPathRef.current !== location.pathname) {
    const prevIdx = SECTIONS.indexOf(prevPathRef.current);
    const currIdx = SECTIONS.indexOf(location.pathname);
    if (prevIdx !== -1 && currIdx !== -1) {
      directionRef.current = currIdx > prevIdx ? 1 : -1;
    } else {
      const prevDepth = getDepth(prevPathRef.current);
      const currDepth = getDepth(location.pathname);
      directionRef.current = currDepth < prevDepth ? -1 : 1;
    }
    setPreviousPathname(prevPathRef.current);
    prevPathRef.current = location.pathname;
  }
  
  const direction = directionRef.current;
  const isHome = location.pathname === '/';

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

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const isTrackPage = (p: string) =>
    p.includes('/song/') || /^\/programmi\/musik-talk\/[^/]+$/.test(p);

  const handleSwipe = (dir: SwipeDir) => {
    const path = location.pathname;
    const i = SECTIONS.indexOf(path);
    if (i !== -1) {
      if (dir === 'left' && i < SECTIONS.length - 1) navigate(SECTIONS[i + 1]);
      if (dir === 'right' && i > 0) navigate(SECTIONS[i - 1]);
      return;
    }
    if (isTrackPage(path)) {
      if (dir === 'down') handleBack();
      return;
    }
    if (dir === 'right') handleBack();
  };

  const swipeRef = useSwipe<HTMLDivElement>({ onSwipe: handleSwipe }, isTouch);

  const isLiveOnHome = location.pathname === '/' && (currentTrackUrl === streamUrl || currentTrackUrl === null);
  const miniVisible = !!nowPlaying && !!currentTrackUrl
    && location.pathname !== nowPlaying.href
    && !isLiveOnHome
    && !location.pathname.startsWith('/admin');

  return (
    <div 
      ref={swipeRef}
      className={`w-full relative overflow-hidden flex flex-col items-center bg-[#0a0a0a] touch-manipulation ${miniVisible ? 'has-mini-player' : ''}`}
      style={{ height: 'var(--app-height, 100dvh)' }}
    >
      {/* Level 1: Full-screen homepage background at all viewport widths */}
      {isHome && (
        <div
          className="fixed inset-0 w-full z-0 pointer-events-none overflow-hidden select-none bg-[#0a0a0a]"
          style={{ height: 'var(--app-height, 100dvh)' }}
          aria-hidden="true"
        >
          <HomeBackground config={homeConfig} />
        </div>
      )}

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
      
      {/* Main Pages Container */}
      <main className="flex-1 w-full min-h-0 relative overflow-hidden flex flex-col items-center z-10">
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
          >
            <Routes location={location}>
              <Route path="/" element={<HomeView homeConfig={homeConfig} />} />
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
      </main>

      {/* Floating Header */}
      <header 
        className={`z-40 w-full transition-all duration-500 ease-out ${
          isHome 
            ? 'absolute top-8 left-0 right-0 bg-transparent pointer-events-auto' 
            : `fixed top-0 left-0 right-0 pt-[calc(env(safe-area-inset-top,0px)+10px)] pb-1.5 sm:pb-2 ${
                isScrolled 
                  ? 'bg-black/60 backdrop-blur-md border-b border-white/5 shadow-lg' 
                  : 'bg-transparent border-b border-transparent shadow-none'
              }`
        }`}
        style={{
          transform: showHeader ? 'translateY(0)' : 'translateY(-100%)'
        }}
      >
        <div className={`w-full max-w-[1600px] mx-auto px-6 sm:px-10 md:pl-[124px] flex justify-between items-center transition-all duration-300 ${
          isHome ? 'h-12' : 'h-10 md:h-11'
        }`}>
          {/* Left Column: Back button */}
          <div className="flex items-center gap-4 w-10 md:min-w-[200px] h-full">
            {!isHome && (
              <button 
                onClick={handleBack}
                className="text-white/80 hover:text-white hover:scale-110 transition-all cursor-pointer p-1.5 -ml-1.5 rounded-full flex items-center justify-center focus:outline-none"
                aria-label="Torna indietro"
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

      {/* Mobile Bottom Navigation Bar in normal flex flow */}
      <nav 
        className="mobile-bottom-nav-container md:hidden flex-shrink-0 z-50 w-full flex justify-center items-center pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-1 px-4 pointer-events-auto transition-all duration-300"
      >
        <div className={`w-full max-w-[440px] h-[60px] sm:h-[64px] flex items-center justify-around px-2 transition-all duration-300 ${
          !isHome 
            ? "bg-[#0c0c0e]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]" 
            : "bg-transparent border-transparent"
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
      </nav>

      <MiniPlayer
        visible={miniVisible}
        meta={nowPlaying}
        playing={isPlaying}
        loading={isLoading}
        onToggle={() => {
          if (!currentTrackUrl) return;
          const url = currentTrackUrl.startsWith(streamUrl) ? streamUrl : currentTrackUrl;
          togglePlay(url, nowPlaying ?? undefined);
        }}
        onOpen={() => nowPlaying?.href && navigate(nowPlaying.href)}
        onClose={stop}
      />
      {!location.pathname.startsWith('/admin') && <InstallBanner />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {window.location.pathname.startsWith('/admin') ? (
          <AdminHome />
        ) : (
          <PlayerProvider>
            <AppContent />
          </PlayerProvider>
        )}
      </AuthProvider>
    </BrowserRouter>
  );
}
