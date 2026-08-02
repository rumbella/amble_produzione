import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate, useParams, Navigate } from 'react-router';
import { Play, Pause, Heart, Share2, Menu as MenuIcon, Mic, ListMusic, Disc3, LogIn, LogOut, User as UserIcon, Home, ChevronLeft, ChevronRight, ArrowLeft, SkipBack, SkipForward, Radio, MoreHorizontal, Link2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { db } from './lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { InfiniteCarousel } from './components/InfiniteCarousel';
import { ProfilePage } from './components/ProfilePage';
import { WebGLBackground } from './components/WebGLBackground';
import { ExploreView } from './components/ExploreView';
import { ContentGrid, MOCK_FEATURED_SLOTS } from './components/ContentGrid';

// ==========================================
// DATA IMPORTS & RE-EXPORTS (From src/data/)
// ==========================================
import { MUSIC_PLAYLISTS, PODCAST_ITEMS, getPodcastSongs, getPlaylistSongs } from './data/podcasts';
import { DJSET_ITEMS, MOCK_SONGS, getDjSetSongs, type Song } from './data/djsets';
import { HOMEPAGE_BACKGROUNDS, RANDOM_BACKGROUNDS, getRandomBackground } from './data/featured';
import { PLAYLIST_SPOTLIGHT_TRACKS, PODCAST_SPOTLIGHT_TRACKS, DJSET_SPOTLIGHT_TRACKS, PROGRAMMI_SPOTLIGHT_TRACKS } from './data/tracks';
import { PROGRAMMI_ITEMS, MUSIK_TALK_EPISODES } from './data/shows';

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





// getDjSetSongs removed (imported from data/djsets)
/*
  if (playlistId === 3) {
    return [
      {
        title: "DEEP SOUND FROM THE VAULT VOL 1",
        duration: "1:12:45",
        audio: "https://radioamble-cdn.b-cdn.net/Biga/DJ%20set/Biga%20deep%20soundm%20from%20the%20vault%2013%20mar.%2026.mp3"
      },
      {
        title: "DEEP SOUND FROM THE VAULT VOL 2",
        duration: "1:15:20",
        audio: "https://radioamble-cdn.b-cdn.net/Biga/DJ%20set/Biga%2011%20dic%20Deep%20sounds%20from%20the%20valut.mp3"
      }
    ];
  }
  if (playlistId === 4) {
    return [
      {
        title: "Co.LORE Gisela",
        duration: "1:02:15",
        audio: "https://radioamble-cdn.b-cdn.net/Collettivo%20colore/Co.LORE%20Gisela%2026%20marzo%2026.mp3"
      },
      {
        title: "Co.lore Collettivo Loredana Olivia_B & Santamama",
        duration: "1:18:45",
        audio: "https://radioamble-cdn.b-cdn.net/Collettivo%20colore/Colore%20%20Collettivo%20Loredana%20%20Olivia_B%20%26%20Santamama.mp3"
      }
    ];
  }
  if (playlistId === 5) {
    return [
      {
        title: "FKV VOL 1",
        duration: "1:15:45",
        audio: "https://radioamble-cdn.b-cdn.net/FKV/FKV-%2016%20ottobre%2025.mp3"
      }
    ];
  }
  if (playlistId === 6) {
    return [
      {
        title: "VOL 1",
        duration: "1:32:40",
        audio: "https://radioamble-cdn.b-cdn.net/GGDEX%20GENTLE%20WAVES/GGDEX%20Gentle%20waves%205%20febb%2026.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:24:15",
        audio: "https://radioamble-cdn.b-cdn.net/GGDEX%20GENTLE%20WAVES/GGDEX%20GENTLE%20WAVES%206%20NOV%2025%20mp3.mp3"
      }
    ];
  }
  if (playlistId === 7) {
    return [
      {
        title: "VOL 1",
        duration: "1:20:15",
        audio: "https://radioamble-cdn.b-cdn.net/HZHA%20DISCHI%20SOFFICI/HZHA%20Dischi%20soffici%2027%20nov%2025%20T.GHIVING.mp3"
      }
    ];
  }
  if (playlistId === 8) {
    return [
      {
        title: "VOL 1",
        duration: "1:22:10",
        audio: "https://radioamble-cdn.b-cdn.net/Mistiche%20Vibre/Mistiche%20Vibre%20e%20Aris%20SKR%2018%20aprile%2026.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:18:35",
        audio: "https://radioamble-cdn.b-cdn.net/Mistiche%20Vibre/Mistike%20Vibes%20ospite%20DonSurf%2022%20gennaio.mp3"
      }
    ];
  }
  if (playlistId === 9) {
    return [
      {
        title: "VOL 1",
        duration: "1:15:30",
        audio: "https://radioamble-cdn.b-cdn.net/vimana/Vimana%20Progect%20Rare%20Groove%20%209%20lug.%2025.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:22:45",
        audio: "https://radioamble-cdn.b-cdn.net/vimana/Vimana%20Rare%20Grovve%20Italian%20Set%204%20dic.mp3"
      },
      {
        title: "VOL 3",
        duration: "1:18:20",
        audio: "https://radioamble-cdn.b-cdn.net/vimana/Vimana_Progect%20Rare%20groove%2012%20marz.%2026.mp3"
      },
      {
        title: "VOL 4",
        duration: "1:21:10",
        audio: "https://radioamble-cdn.b-cdn.net/vimana/Rare%20Groove%20Vimana_Progect%2012%20febb%2026.mp3"
      }
    ];
  }
  if (playlistId === 10) {
    return [
      {
        title: "VOL 1",
        duration: "1:14:40",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggia%20imp.%20dj%20set%2010%20ott%2025.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:19:15",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggia%20impazzita%20S.%20Tirella%208%20gennaio%2026.mp3"
      },
      {
        title: "VOL 3",
        duration: "1:12:30",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggia%20Impazzita%20S.T%2012%20sett%2025.mp3"
      },
      {
        title: "VOL 4",
        duration: "1:21:05",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Scheggiaimpazzita%20dj%20set%20S.T.%207%20febb%2026mp3.mp3"
      },
      {
        title: "VOL 5",
        duration: "1:26:50",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Steve%20Scheggia%20impazzita%2028%20agosto%2025%20.mp3"
      }
    ];
  }
  if (playlistId === 11) {
    return [
      {
        title: "VOL 1",
        duration: "1:18:20",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/City%20Soun%20prespective%20rufus%206%20marzo%2026.mp3"
      },
      {
        title: "VOL 2",
        duration: "1:22:45",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/City%20Sound%20Prespective%20Rufus%20Quni%CC%80indi%20Records%2021%20nov%2025.mp3"
      },
      {
        title: "VOL 3",
        duration: "1:15:30",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Disco%20Spectrum%20A.A%202%20ott.%2025.mp3"
      },
      {
        title: "VOL 4",
        duration: "1:20:15",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20C.Sound%20Prespective%2022%20gen%2026.mp3"
      },
      {
        title: "VOL 5",
        duration: "1:24:50",
        audio: "https://radioamble-cdn.b-cdn.net/Rufus%20City%20Sound%20Perspective%20-%20Qindi%20records/Rufus%20City%20sound%20pr.%204%20sett%2025.mp3"
      }
    ];
  }
  return MOCK_SONGS;
}

export function getPodcastSongs(playlistId: number): Song[] {
  if (playlistId === 5) {
    return [
      {
        title: "Nikky di Radio deejay",
        duration: "1:05:20",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/12%20NIKKI%20scheggia%20(1)%20(1).mp3",
        background: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/91bc11e7-db11-4db1-b21c-ef21d662aec3.png"
      },
      {
        title: "intervista a faso",
        duration: "58:45",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/FASO%20SCHEGGIA%201.mp3",
        background: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/cover%20rielaborate%20scheggie/01f3de8a-2a62-42a6-beef-afeeb4e0b0c9.png"
      },
      {
        title: "intervista a marlen",
        duration: "1:02:15",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/MARLEN%20SCHEGGIA%20.mp3",
        background: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/podcast/13aaa0b2-3262-4326-99c2-319c3ecb3944%20(2).png"
      }
    ];
  }
  if (playlistId === 6) {
    return [
      {
        title: "Il segreto del naso di Rioba",
        duration: "30:25",
        audio: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/Brac%20Emons%20Vichi%20se%20Marchi%20Il%20segreto%20del%20naso%20di%20Rioba%2030%20sett%2025.mp3",
        background: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/images%20(8).jpeg"
      }
    ];
  }
  if (playlistId === 7) {
    return [
      {
        title: "Anche il diavolo si stanca",
        duration: "23:45",
        audio: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/Brac%20Emons%20A.%2023%20settembre%20Anche%20il%20diavolo%20si%20stanca%20p.p.wav",
        background: "https://radioamble-cdn.b-cdn.net/Brac%20Libreria%20arte%20contemporanea/River%20to%20River%20Indian%20Film%20Festival/images%20(9).jpeg"
      }
    ];
  }
  return MOCK_SONGS;
}

export function getPlaylistSongs(playlistId: number): Song[] {
  if (playlistId === 11) {
    return [
      {
        title: "Another Day",
        duration: "3:39",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Another%20Day%20_%20Bukshot%20Lefonque.mp3"
      },
      {
        title: "The Bravest Man (Remix)",
        duration: "4:12",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Bobby%20Womack%20_%20The%20Bravest%20Man%20Remix.mp3"
      },
      {
        title: "Bubble Jet",
        duration: "5:04",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Bubble%20Jet%20_%20Emotionelectric.mp3"
      },
      {
        title: "So Far To Go",
        duration: "5:12",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Common%20_%20%20So%20Far%20To%20Go.mp3"
      },
      {
        title: "Easy",
        duration: "5:52",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Groove%20Armada%20_%20Easy.mp3"
      },
      {
        title: "El Pollero Loco",
        duration: "4:28",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Koel%20Willer%20_%20El%20Pollero%20Loco%20.mp3"
      },
      {
        title: "This Is SKA",
        duration: "3:41",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Longsy%20D%20_%20This%20Is%20SKA.mp3"
      },
      {
        title: "Hold Up",
        duration: "4:03",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Louis%20Chedid%20_%20Hold%20Up.mp3"
      },
      {
        title: "Transylfornia",
        duration: "4:47",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Nikki%20_%20Transylfornia.mp3"
      },
      {
        title: "Perfidia",
        duration: "3:20",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Phyllis%20Dillon%20_%20Perfidia.mp3"
      },
      {
        title: "Bloodstream",
        duration: "5:07",
        audio: "https://radioamble-cdn.b-cdn.net/Stiv%20Tirella/Playlist/Stateless%20_%20Bloodstream%20.mp3"
      }
    ];
  }
  if (playlistId === 12) {
    return [
      {
        title: "It's Your Time",
        duration: "3:58",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/01%20It's%20Your%20Time.mp3"
      },
      {
        title: "Welcome to Planet Funk",
        duration: "7:04",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/01%20Welcome%20to%20Planet%20Funk.mp3"
      },
      {
        title: "Where Is the Max",
        duration: "4:40",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/01%20where%20is%20the%20max.mp3"
      },
      {
        title: "Chase the Sun",
        duration: "3:40",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/02%20chase%20the%20sun.mp3"
      },
      {
        title: "Magic Number",
        duration: "3:52",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/02%20Magic%20Number.mp3"
      },
      {
        title: "All Man's Land",
        duration: "5:32",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/03%20all%20mans%20land.mp3"
      },
      {
        title: "Swallow",
        duration: "5:10",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/03%20Swallow.mp3"
      },
      {
        title: "In The Beginning",
        duration: "4:32",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/04%20In%20The%20Beginning.mp3"
      },
      {
        title: "The Switch",
        duration: "3:41",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/04%20the%20switch.mp3"
      },
      {
        title: "If We Try",
        duration: "4:12",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/05%20If%20We%20Tray.mp3"
      },
      {
        title: "Inside All the People",
        duration: "4:57",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/05%20inside%20all%20the%20people.mp3"
      },
      {
        title: "Static",
        duration: "4:24",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/06%20Static.mp3"
      },
      {
        title: "Under the Rain",
        duration: "6:11",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/06%20under%20the%20rain.mp3"
      },
      {
        title: "Paraffin",
        duration: "4:30",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/07%20paraffin.mp3"
      },
      {
        title: "We Turn",
        duration: "4:45",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/07%20We%20Turn.mp3"
      },
      {
        title: "Piano Piano",
        duration: "3:15",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/08%20piano%20piano.mp3"
      },
      {
        title: "Running Through My Head",
        duration: "4:43",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/08%20Running%20Through%20My%20Head.mp3"
      },
      {
        title: "Tears",
        duration: "3:48",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/09%20Tears.mp3"
      },
      {
        title: "Tightrope Artist",
        duration: "3:45",
        audio: "https://radioamble-cdn.b-cdn.net/Planet%20Funk/09%20tightrope%20artist.mp3"
      }
    ];
  }
  return MOCK_SONGS;
}
*/



const LongArrowLeft = ({ size = 24, strokeWidth = 1.5, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size * 1.6} 
    height={size} 
    viewBox="0 0 38 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth} 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M36 12H4" />
    <path d="M11 5L4 12l7 7" />
  </svg>
);

const FlamingoLogo = ({ className = "h-5 w-auto text-white", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 160"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Headphone Band */}
    <path
      d="M38 34 A14 14 0 0 1 62 34"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
    />
    
    {/* Headphones Ear-pads */}
    <rect x="34" y="30" width="5" height="12" rx="2.5" fill="currentColor" stroke="none" />
    <rect x="61" y="30" width="5" height="12" rx="2.5" fill="currentColor" stroke="none" />
    <circle cx="36.5" cy="36" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="63.5" cy="36" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />

    {/* Elegant Flamingo head and beak */}
    <path
      d="M49 32 C43 32 40 37 40 43 C40 47 37 53 37 57 C37 60 38 61 39.5 58 C41 55 45 53 47 50 C49 47 50 43 50 43 Z"
      fill="currentColor"
      stroke="none"
    />

    {/* Elegant S-Neck */}
    <path
      d="M48 43 C52 43 55 49 53 58 C51 68 44 74 46 84"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
    />

    {/* Beautiful teardrop wing/body */}
    <path
      d="M46 84 C56 84 69 88 69 98 C69 109 56 113 46 113 C36 113 32 104 32 98 C32 88 36 84 46 84 Z"
      fill="currentColor"
      stroke="none"
    />

    {/* Slender legs */}
    <line x1="43" y1="112" x2="43" y2="152" stroke="currentColor" strokeWidth="2.5" />
    <line x1="47" y1="112" x2="47" y2="152" stroke="currentColor" strokeWidth="2.5" />

    {/* Minimal feet */}
    <line x1="39" y1="152" x2="43" y2="152" stroke="currentColor" strokeWidth="2.5" />
    <line x1="47" y1="152" x2="51" y2="152" stroke="currentColor" strokeWidth="2.5" />
  </svg>
);

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

function PinterestCard({
  id,
  title,
  author,
  teaser,
  tag,
  subtitle,
  image,
  seed,
  isFull,
  index,
  onClick,
  isPlaylistCollage = false,
  spanClass
}: {
  id: string | number;
  title: string;
  author: string;
  teaser: string;
  tag: string;
  subtitle?: string;
  image?: string;
  seed?: any;
  isFull: boolean;
  index: number;
  onClick: () => any;
  isPlaylistCollage?: boolean;
  key?: any;
  spanClass?: string;
}) {
  // Uniform aspect ratio to prevent vertical stretching and empty spaces
  const getAspectClass = (full: boolean, idx: number) => {
    if (full) {
      return "aspect-[2/1] sm:aspect-[2.4/1] md:aspect-[2.8/1]";
    }
    return "aspect-[16/10]";
  };

  const aspectClass = getAspectClass(isFull, index);

  return (
    <div
      onClick={onClick}
      className={`glass-panel group relative overflow-hidden flex flex-col ${
        spanClass || (isFull ? 'col-span-2' : 'col-span-1')
      } border border-white/10 bg-[#161616]/80 rounded-3xl md:rounded-[32px] hover:border-[#ff2e55]/30 transition-all duration-500 ease-out cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_25px_50px_-12px_rgba(255,46,85,0.25)] hover:bg-[#1a1a1a]/95`}
    >
      {/* Image Thumb (with hover effects) */}
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#181818] shrink-0 border-b border-white/5`}>
        {/* Full Image or Collage */}
        {image ? (
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
        ) : isPlaylistCollage ? (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 group-hover:scale-105 transition-transform duration-700 ease-out">
            <img src={`https://picsum.photos/seed/${seed}a/200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <img src={`https://picsum.photos/seed/${seed}b/200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <img src={`https://picsum.photos/seed/${seed}c/200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <img src={`https://picsum.photos/seed/${seed}d/200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        ) : (
          <img
            src={`https://picsum.photos/seed/${seed}/600`}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Dynamic Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Pinterest hover Play button styled beautifully */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#ff2e55] p-4 rounded-full shadow-lg shadow-[#ff2e55]/30 transform scale-90 group-hover:scale-100 transition-transform duration-500 flex items-center justify-center">
            <Play size={20} className="text-white fill-white translate-x-[1px]" />
          </div>
        </div>

        {/* Floating Tag over image - Top Left */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[8px] md:text-[9px] font-semibold tracking-wider text-white uppercase font-display bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            {tag}
          </span>
        </div>
      </div>

      {/* Info text below the image */}
      <div className="flex flex-col flex-1 justify-between p-5 md:p-6 text-left">
        <div>
          {/* Subtitle / Fine metadata */}
          {subtitle && (
            <p className="text-[9px] md:text-[10px] text-white/40 font-mono tracking-wider uppercase mb-1.5">
              {subtitle}
            </p>
          )}
          
          {/* Heading */}
          <h3 className={`${
            isFull ? 'text-base sm:text-lg md:text-xl' : 'text-sm sm:text-base md:text-lg'
          } font-bold text-white font-display tracking-wider uppercase group-hover:text-[#ff2e55] transition-colors duration-300`}>
            {title}
          </h3>

          {/* Author */}
          <p className="text-[11px] md:text-xs text-white/50 mt-1 font-sans">
            Di {author}
          </p>

          {/* Teaser text */}
          <p className="text-xs text-white/60 mt-3 font-sans leading-relaxed line-clamp-3 antialiased">
            {teaser}
          </p>
        </div>

        {/* CTA link */}
        <div className="mt-5 flex items-center text-[10px] text-[#ff2e55] font-display tracking-widest uppercase gap-1 group-hover:translate-x-1.5 transition-transform duration-300">
          <span className="font-bold">Ascolta ora</span>
          <ChevronRight size={12} className="stroke-[2.5px]" />
        </div>
      </div>
    </div>
  );
}



function SpotlightTracksSection({ 
  title = "Spotlight", 
  subtitle = "Brani selezionati da Radio Amblè", 
  tracks = [], 
  isPlaying, 
  togglePlay, 
  currentTrackUrl 
}: { 
  title?: string; 
  subtitle?: string; 
  tracks: any[]; 
  isPlaying: boolean; 
  togglePlay: (url: string) => void; 
  currentTrackUrl: string | null; 
}) {
  return (
    <div className="w-full flex flex-col mb-16 text-left">
      <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
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
        <button className="text-xs text-[#ff2e55] font-display tracking-widest uppercase hover:underline transition-all">
          Vedi tutto
        </button>
      </div>
      <p className="font-sans text-xs text-white/40 mb-6 leading-relaxed">
        {subtitle}
      </p>

      {/* Grid of tracks matching the reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track, i) => {
          const isCurrent = currentTrackUrl === track.audio;
          const isCurrentPlaying = isCurrent && isPlaying;
          return (
            <div
              key={i}
              onClick={() => togglePlay(track.audio)}
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
                    src={track.image}
                    alt=""
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
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

function PlaylistView({ isPlaying, togglePlay, currentTrackUrl }: any) {
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] md:max-w-[90%] mx-auto px-6 sm:px-10 md:pl-[104px]">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-display text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Playlist
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Selezioni curate di canzoni iconiche, colonne sonore leggendarie ed esperimenti sonori d'autore.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Section title for Playlists */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 text-left">
          <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
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
                image={playlist.image}
                seed={playlist.seed}
                isFull={false}
                index={idx}
                onClick={() => navigate('/playlist/' + playlist.id)}
                isPlaylistCollage={!playlist.image}
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
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
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
                    image={playlist.image}
                    seed={playlist.seed}
                    isFull={false}
                    index={idx}
                    onClick={() => navigate('/playlist/' + playlist.id)}
                    isPlaylistCollage={!playlist.image}
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

function PodcastView({ isPlaying, togglePlay, currentTrackUrl }: any) {
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] md:max-w-[90%] mx-auto px-6 sm:px-10 md:pl-[104px]">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-display text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Podcast
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Puntate speciali, interviste esclusive e approfondimenti culturali on-demand su Radio Amblè.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Section title for Podcasts */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 text-left">
          <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
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
                image={podcast.image}
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
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
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
                    image={podcast.image}
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

function DjSetView({ isPlaying, togglePlay, currentTrackUrl }: any) {
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
      mediaUrl: item.image,
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
          <h1 className="font-display text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
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



function ProgrammiView({ isPlaying, togglePlay, currentTrackUrl }: any) {
  const navigate = useNavigate();

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full flex flex-col pt-32 md:pt-40 overflow-y-auto bg-[#0a0a0a]"
    >
      <div className="w-full max-w-[1600px] md:max-w-[90%] mx-auto px-6 sm:px-10 md:pl-[104px]">
        <div className="mb-4 flex flex-col text-left">
          <h1 className="font-display text-[24px] sm:text-[28px] text-white tracking-widest uppercase font-bold">
            Programmi
          </h1>
          <p className="font-sans text-xs md:text-sm text-white/50 mt-2">
            Il palinsesto e i programmi esclusivi in onda e on-demand su Radio Amblè.
          </p>
          <div className="w-full h-[1px] bg-white/10 mt-6 mb-8" />
        </div>

        {/* Section title for Programmi */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-3 text-left">
          <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
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
                image={prog.image}
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
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-widest uppercase">
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
                    image={prog.image}
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

function MusikTalkView({ isPlaying, togglePlay, currentTrackUrl, userLikes, toggleLike }: any) {
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
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -inset-4 bg-[#ff2e55]/10 blur-xl -z-10 rounded-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            </div>

            {/* Right Information */}
            <div className="flex flex-col flex-1 justify-center py-1">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-[10px] font-bold tracking-widest text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-3 py-1 rounded-full">
                  ESCLUSIVA RADIO AMBLÈ
                </span>
              </div>
              
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
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
                  onClick={() => togglePlay(MUSIK_TALK_EPISODES[0]?.audio)}
                  className={`h-12 px-6 rounded-full bg-white text-black hover:bg-white/90 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg text-sm shrink-0 ${isPlaying && MUSIK_TALK_EPISODES.some(s => s.audio === currentTrackUrl) ? 'play-pulse' : ''}`}
                >
                  {isPlaying && MUSIK_TALK_EPISODES.some(s => s.audio === currentTrackUrl) ? (
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
            <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-wider flex items-center gap-1.5 uppercase">
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

function SingleMusikTalkEpisodeView({ isPlaying, togglePlay, userLikes, toggleLike, currentTrackUrl }: any) {
  const { episodeId } = useParams();
  const navigate = useNavigate();

  const epIndex = MUSIK_TALK_EPISODES.findIndex(ep => ep.id === Number(episodeId));
  const ep = MUSIK_TALK_EPISODES[epIndex];

  if (!ep) return null;

  const bgUrl = ep.image;
  const itemId = `musiktalk_ep:${ep.id}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === ep.audio;

  // Background videos pool
  const videosPool = [
    "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_d4aa45e7-83be-4318-b00a-3684afdd7624_generated_video.MP4",
    "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_ed66afeb-20ab-4bf2-8ad6-016d76d9fdfe_generated_video.MP4",
    "https://radioamble-cdn.b-cdn.net/Phoenix/Disclaimer/Immagini/phoenix/_users_cdf7ab6c-aee8-436f-8342-c98879331890_generated_b85bbea7-d3d7-4d23-8397-cc797d40db6d_generated_video.MP4"
  ];

  // Randomly select one video on load/mount
  const [randomVideoUrl] = useState(() => {
    const randomIdx = Math.floor(Math.random() * videosPool.length);
    return videosPool[randomIdx];
  });

  const goToPrev = () => {
    if (epIndex > 0) {
      navigate(`/programmi/musik-talk/${MUSIK_TALK_EPISODES[epIndex - 1].id}`, { replace: true });
    }
  };

  const goToNext = () => {
    if (epIndex < MUSIK_TALK_EPISODES.length - 1) {
      navigate(`/programmi/musik-talk/${MUSIK_TALK_EPISODES[epIndex + 1].id}`, { replace: true });
    }
  };

  useEffect(() => {
    if (currentTrackUrl !== ep.audio || !isPlaying) {
      if (currentTrackUrl !== ep.audio) {
        togglePlay(ep.audio);
      } else if (!isPlaying) {
        togglePlay(ep.audio);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ep.audio]);

  return (
    <motion.main
      className="relative z-30 w-full h-full"
    >
      {/* Immersive background video */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
        <video
          src={randomVideoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Color tone blend overlays matching Scheggia style */}
        <div className="absolute inset-0 bg-red-950/20 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end items-center z-10 w-full max-w-[500px] mb-[100px] md:mb-[40px] px-6 mx-auto pointer-events-auto">
        <PlayerTicker 
          text="TELA Collection · German Aerospace-Grade Polycarbonate · Lifetime Warranty · Free Return · 100 Days Try Me Out · Lego Concept — Replace. Recycle. Personalise. · Spacious & Washable Interior · Wide Handle — More Space. More Control. · Canvas Texture · Serial Number — Identity. · Free Shipping · Help Us Close the Loop · Pre-Order 30% Off — Code LOVE30 · Aesthetics & Integrity Over Exclusivity · A New Chapter Is About to Begin" 
          duration={55}
          href="https://www.phoenix-voyage.com/"
          ctaText="WWW.PHOENIX-VOYAGE.COM"
        />
        <div 
          className="glass-panel animated-gradient-border w-full px-6 py-4 sm:py-6 flex flex-col items-center text-center shrink-0 bg-[#0c0c0e]/45 backdrop-blur-md shadow-2xl rounded-3xl"
        >
          <h2 className="font-display text-[20px] sm:text-[24px] text-white tracking-widest leading-none mb-1">
            {ep.title}
          </h2>

          <p className="font-sans text-[9px] sm:text-[10px] tracking-[0.15em] text-white/70 uppercase mt-2 mb-4">
            Music & Talk • {ep.author}
          </p>

          <div className="flex items-center justify-between w-full max-w-[320px]">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(itemId);
              }}
              className={`p-2 transition-transform hover:scale-110 flex items-center justify-center ${isLiked ? 'text-[#ff2e55]' : 'text-white/80'}`}
              aria-label="Like"
            >
              <Heart size={22} strokeWidth={isLiked ? 2.5 : 1} className={isLiked ? "fill-current" : ""} />
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
                onClick={() => togglePlay(ep.audio)}
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

function SinglePodcastEpisodeView({ isPlaying, togglePlay, userLikes, toggleLike, currentTrackUrl }: any) {
  const { id, songIndex } = useParams();
  const navigate = useNavigate();
  
  const playlist = PODCAST_ITEMS.find(p => p.id === Number(id));
  const sIndex = Number(songIndex);
  const songsList = getPodcastSongs(Number(id));
  const song = songsList[sIndex];
  
  const [fallbackBg] = useState(() => playlist?.image || getRandomBackground());
  const bgUrl = song?.background || fallbackBg;

  if (!playlist || !song) return null;

  const itemId = `podcast_episode:${playlist.id}:${songIndex}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === song.audio;
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  const goToPrev = () => {
    if (sIndex > 0) navigate(`/podcast/${playlist.id}/song/${sIndex - 1}`, { replace: true });
  };

  const goToNext = () => {
    if (sIndex < songsList.length - 1) navigate(`/podcast/${playlist.id}/song/${sIndex + 1}`, { replace: true });
  };

  useEffect(() => {
    if (currentTrackUrl !== song.audio || !isPlaying) {
      if (currentTrackUrl !== song.audio) {
        togglePlay(song.audio);
      } else if (!isPlaying) {
        togglePlay(song.audio);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.audio]);

  return (
    <motion.main
      className="relative z-30 w-full h-full"
    >
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

      <div className="absolute inset-0 flex flex-col justify-end items-center z-10 w-full max-w-[500px] mb-[100px] md:mb-[40px] px-6 mx-auto pointer-events-auto">
        <PlayerTicker />
        <div 
          className="glass-panel animated-gradient-border w-full px-6 py-4 sm:py-6 flex flex-col items-center text-center shrink-0 bg-[#0c0c0e]/45 backdrop-blur-md shadow-2xl rounded-3xl"
        >
          <h2 className="font-display text-[20px] sm:text-[24px] text-white tracking-widest leading-none mb-1">
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
                onClick={() => togglePlay(song.audio)}
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
    </motion.main>
  );
}

function SongRowItem({ 
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
}: any) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const isCurrent = currentTrackUrl === song.audio;
  const isCurrentPlaying = isCurrent && isPlaying;
  
  const likeId = playlistType === 'musiktalk' 
    ? `musiktalk_ep:${song.id}`
    : playlistType === 'podcast'
      ? `podcast_episode:${playlistId}:${index}`
      : playlistType === 'djset'
        ? `djset_track:${playlistId}:${index}`
        : `playlist_song:${playlistId}:${index}`;
        
  const isLiked = userLikes?.includes(likeId) || false;
  const thumbUrl = song.background || song.image || playlistImage;
  
  const handleRowClick = () => {
    if (playlistType === 'musiktalk') {
      navigate(`/programmi/musik-talk/${song.id}`);
    } else {
      navigate(`/${playlistType}/${playlistId}/song/${index}`);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlayToggle(song.audio);
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

function SinglePodcastView({ isPlaying, togglePlay, currentTrackUrl, userLikes, toggleLike }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const playlist = PODCAST_ITEMS.find(p => p.id === Number(id));
  const songsList = getPodcastSongs(Number(id));
  const [bgUrl] = useState(() => playlist?.image || getRandomBackground());

  if (!playlist) return null;

  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Immersive Background */}
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
                src={playlist.image} 
                alt="" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -inset-4 bg-[#ff2e55]/10 blur-xl -z-10 rounded-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            </div>

            {/* Right Information */}
            <div className="flex flex-col flex-1 justify-center py-1">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-[10px] font-bold tracking-widest text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-3 py-1 rounded-full">
                  {playlist.tag || "PODCAST ESCLUSIVO"}
                </span>
              </div>
              
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
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
                  onClick={() => togglePlay(songsList[0]?.audio)}
                  className={`h-12 px-6 rounded-full bg-white text-black hover:bg-white/90 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg text-sm shrink-0 ${isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? 'play-pulse' : ''}`}
                >
                  {isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? (
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
            <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-wider flex items-center gap-1.5 uppercase">
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
                playlistImage={playlist.image}
                author={playlist.author}
              />
            ))}
          </div>

        </div>
      </div>
    </motion.main>
  );
}

function SingleDjSetTrackView({ isPlaying, togglePlay, userLikes, toggleLike, currentTrackUrl }: any) {
  const { id, songIndex } = useParams();
  const navigate = useNavigate();
  const playlist = DJSET_ITEMS.find(p => p.id === Number(id));
  const [bgUrl] = useState(() => playlist?.image || getRandomBackground());
  
  const sIndex = Number(songIndex);
  const songsList = getDjSetSongs(Number(id));
  const song = songsList[sIndex];

  if (!playlist || !song) return null;

  const itemId = `djset_track:${playlist.id}:${songIndex}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === song.audio;
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  const goToPrev = () => {
    if (sIndex > 0) navigate(`/djset/${playlist.id}/song/${sIndex - 1}`, { replace: true });
  };

  const goToNext = () => {
    if (sIndex < songsList.length - 1) navigate(`/djset/${playlist.id}/song/${sIndex + 1}`, { replace: true });
  };

  useEffect(() => {
    if (currentTrackUrl !== song.audio || !isPlaying) {
      if (currentTrackUrl !== song.audio) {
        togglePlay(song.audio);
      } else if (!isPlaying) {
        togglePlay(song.audio);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.audio]);

  return (
    <motion.main
      className="relative z-30 w-full h-full"
    >
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

      <div className="absolute inset-0 flex flex-col justify-end items-center z-10 w-full max-w-[500px] mb-[100px] md:mb-[40px] px-6 mx-auto pointer-events-auto">
        <PlayerTicker />
        <div 
          className="glass-panel animated-gradient-border w-full px-6 py-5 flex flex-col shrink-0 bg-[#0c0c0e]/45 backdrop-blur-md shadow-2xl rounded-3xl"
        >
          <div className="flex items-center gap-4 w-full mb-4">
            {playlist.id === 1 ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-md border border-white/10 shrink-0">
                <img 
                  src={playlist.image} 
                  alt="AID Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : null}
            <div className={`flex-1 min-w-0 ${playlist.id !== 1 ? 'text-center' : 'text-left'}`}>
              <h2 className="font-display text-[18px] sm:text-[22px] text-white tracking-widest leading-tight truncate">
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
                onClick={() => togglePlay(song.audio)}
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
    </motion.main>
  );
}

function DjSetStackSwipe({ songsList, playlist, isPlaying, currentTrackUrl, onPlayToggle, userLikes, onLikeToggle, onOpenSheet }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songsList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + songsList.length) % songsList.length);
  };

  // Curated stunning covers for A.i.D tracks to give a real high-fidelity Spotify-album feel
  const trackCovers = [
    "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=80"
  ];

  const topSong = songsList[currentIndex];
  const isTopCurrent = currentTrackUrl === topSong?.audio;
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
          const isCurrent = currentTrackUrl === song.audio;
          const isCurrentPlaying = isPlaying && isCurrent;
          const itemId = `djset_track:${playlist.id}:${index}`;
          const isLiked = userLikes?.includes(itemId);

          // Card styles depending on its stack depth
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
                  // Swiped right -> go to previous
                  handlePrev();
                } else if (info.offset.x < -swipeThreshold) {
                  // Swiped left -> go to next
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
                          const isPlaylistPlaying = isPlaying && songsList.some((s: any) => s.audio === currentTrackUrl);
                          if (isPlaylistPlaying && currentTrackUrl) {
                            onPlayToggle(currentTrackUrl);
                          } else {
                            onPlayToggle(song.audio);
                          }
                        }}
                        className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_8px_20px_rgba(255,255,255,0.25)]"
                      >
                        {isPlaying && songsList.some((s: any) => s.audio === currentTrackUrl) ? (
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

                  <h3 className={`font-display font-extrabold text-base sm:text-lg mt-1 line-clamp-1 transition-colors duration-200 ${isCurrent ? 'text-[#ff2e55]' : 'text-white'}`}>
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
                        src={playlist.image} 
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
            onClick={() => onPlayToggle(topSong?.audio)}
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

function TracksBottomSheet({ isOpen, onClose, songsList, playlist, isPlaying, currentTrackUrl, onPlayToggle, userLikes, onLikeToggle }: any) {
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
                {songsList.map((song: any, i: number) => (
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
                    playlistImage={playlist.image}
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

function SingleDjSetView({ isPlaying, togglePlay, currentTrackUrl, userLikes, toggleLike }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const playlist = DJSET_ITEMS.find(p => p.id === Number(id));
  const [bgUrl] = useState(() => playlist?.image || getRandomBackground());
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (!playlist) return null;

  const songsList = getDjSetSongs(playlist.id);
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Immersive Background */}
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
        <div className="absolute inset-0 bg-red-950/30 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-black/75 pointer-events-none"></div>
      </div>

      {/* Content Area */}
      <div className="absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 pt-28 md:pt-36 md:pl-[104px]">
        <div className="w-full max-w-[1200px] mx-auto pb-44">
          
          {/* Hero Section */}
          {playlist.id !== 1 ? (
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
              {/* Left Cover Artwork */}
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0 group">
                <img 
                  src={playlist.image} 
                  alt="" 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute -inset-4 bg-[#ff2e55]/10 blur-xl -z-10 rounded-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
              </div>

              {/* Right Information */}
              <div className="flex flex-col flex-1 justify-center py-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="text-[10px] font-bold tracking-widest text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-3 py-1 rounded-full">
                    {playlist.tag || "DJ SET ESCLUSIVO"}
                  </span>
                </div>
                
                <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
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
                    onClick={() => togglePlay(songsList[0]?.audio)}
                    className={`h-12 px-6 rounded-full bg-white text-black hover:bg-white/90 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg text-sm shrink-0 ${isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? 'play-pulse' : ''}`}
                  >
                    {isPlaying && songsList.some(s => s.audio === currentTrackUrl) ? (
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
              <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-wider flex items-center gap-1.5 uppercase">
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
              {/* Title & Description inserted BEFORE the cards stack player, styled to be smaller/less impactful */}
              <div className="mb-6 text-center max-w-lg px-4 flex flex-col items-center">
                <span className="text-[9px] font-bold tracking-widest text-[#ff2e55]/80 uppercase font-display bg-[#ff2e55]/5 px-2.5 py-0.5 rounded-full w-fit">
                  {playlist.tag || "MIX ESCLUSIVO"}
                </span>

                <h1 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight mt-2.5">
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
                  playlistImage={playlist.image}
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

function SingleSongView({ isPlaying, togglePlay, userLikes, toggleLike, currentTrackUrl }: any) {
  const { id, songIndex } = useParams();
  const navigate = useNavigate();
  const playlist = MUSIC_PLAYLISTS.find(p => p.id === Number(id));
  const [bgUrl] = useState(() => playlist?.image || getRandomBackground());
  
  const sIndex = Number(songIndex);
  const songs = playlist ? getPlaylistSongs(playlist.id) : [];
  const song = songs[sIndex];

  if (!playlist || !song) return null;

  const itemId = `playlist_song:${playlist.id}:${songIndex}`;
  const isLiked = userLikes?.includes(itemId) || false;
  const trackIsPlaying = isPlaying && currentTrackUrl === song.audio;
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  const goToPrev = () => {
    if (sIndex > 0) navigate(`/playlist/${playlist.id}/song/${sIndex - 1}`, { replace: true });
  };

  const goToNext = () => {
    if (sIndex < songs.length - 1) navigate(`/playlist/${playlist.id}/song/${sIndex + 1}`, { replace: true });
  };

  useEffect(() => {
    if (currentTrackUrl !== song.audio || !isPlaying) {
      if (currentTrackUrl !== song.audio) {
        togglePlay(song.audio);
      } else if (!isPlaying) {
        togglePlay(song.audio);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song.audio]);

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
          <h2 className="font-display text-[20px] sm:text-[24px] text-white tracking-widest leading-none mb-1">
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
                onClick={() => togglePlay(song.audio)}
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

function SinglePlaylistView({ isPlaying, togglePlay, currentTrackUrl, userLikes, toggleLike }: any) {
  const { id } = useParams();
  const navigate = useNavigate();
  const playlist = MUSIC_PLAYLISTS.find(p => p.id === Number(id));
  const [bgUrl] = useState(() => playlist?.image || getRandomBackground());

  if (!playlist) return null;

  const songs = getPlaylistSongs(playlist.id);
  const isVideo = bgUrl.toLowerCase().endsWith('.mp4');

  return (
    <motion.main
      className="absolute inset-0 z-30 w-full h-full bg-[#0a0a0a] overflow-hidden"
    >
      {/* Immersive Background */}
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
        <div className="absolute inset-0 bg-red-950/40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-black/75 pointer-events-none"></div>
      </div>

      {/* Main Content Scroll Container */}
      <div className="absolute inset-0 overflow-y-auto z-10 w-full h-full flex flex-col p-6 sm:p-10 pt-28 md:pt-36 md:pl-[104px]">
        <div className="w-full max-w-[1200px] mx-auto pb-44">
          
          {/* Hero Section / Playlist Spotlight Banner */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            {/* Left: Giant Cover Art with Glow */}
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/10 shrink-0 group">
              <img 
                src={playlist.image} 
                alt="" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -inset-4 bg-[#ff2e55]/10 blur-xl -z-10 rounded-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
            </div>

            {/* Right: Metadata and Controls */}
            <div className="flex flex-col flex-1 justify-center py-1">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-[10px] font-bold tracking-widest text-[#ff2e55] uppercase font-display bg-[#ff2e55]/10 px-3 py-1 rounded-full">
                  {playlist.tag || "PLAYLIST ESCLUSIVA"}
                </span>
              </div>
              
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
                {playlist.title}
              </h1>
              
              <p className="font-sans text-sm sm:text-base text-white/70 mt-2">
                Curata da <span className="font-semibold text-white">{playlist.author}</span>
              </p>

              <p className="font-sans text-xs sm:text-sm text-white/50 mt-3 leading-relaxed max-w-2xl">
                {playlist.teaser || "La potente ed elettronica selezione musicale ricca di hit storiche, influenze rock-dance e ritmi inconfondibili."}
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                <button 
                  onClick={() => togglePlay(songs[0]?.audio)}
                  className={`h-12 px-6 rounded-full bg-white text-black hover:bg-white/90 flex items-center gap-2 font-bold transition-all hover:scale-105 active:scale-95 shadow-lg text-sm shrink-0 ${isPlaying && songs.some(s => s.audio === currentTrackUrl) ? 'play-pulse' : ''}`}
                >
                  {isPlaying && songs.some(s => s.audio === currentTrackUrl) ? (
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

          {/* Section Divider & Title matching third image */}
          <div className="flex items-center justify-between mt-12 mb-6 border-b border-white/5 pb-4">
            <h2 className="font-display font-bold text-lg sm:text-xl text-white tracking-wider flex items-center gap-1.5 uppercase">
              <span>I brani del momento</span>
              <ChevronRight size={18} className="text-[#ff2e55]" />
            </h2>
            <span className="text-xs text-white/40 font-sans">{songs.length} brani</span>
          </div>

          {/* Custom Tracklist Songs */}
          <div className="flex flex-col gap-3">
            {songs.map((song, i) => (
              <SongRowItem
                key={i}
                song={song}
                index={i}
                playlistId={playlist.id}
                playlistType="playlist"
                isPlaying={isPlaying}
                currentTrackUrl={currentTrackUrl}
                onPlayToggle={togglePlay}
                userLikes={userLikes}
                onLikeToggle={toggleLike}
                playlistImage={playlist.image}
                author={playlist.author}
              />
            ))}
          </div>

        </div>
      </div>
    </motion.main>
  );
}

function HomeView({ isPlaying, userLikes, togglePlay, toggleLike }: any) {
  const navigate = useNavigate();
  const itemId = 'radio-amble-live';
  const isLiked = userLikes?.includes(itemId) || false;
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
              onClick={togglePlay}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform ${isPlaying ? 'play-pulse' : ''}`}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? ( 
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [currentHomeBgIndex, setCurrentHomeBgIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  const streamUrl = "https://mqugxowc-lbmedia.radioca.st/stream";

  useEffect(() => {
    async function fetchUserLikes() {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            setUserLikes(data.likes || []);
          } else {
            setUserLikes([]);
          }
        } catch (err) {
          console.error("Failed to load user likes", err);
          setUserLikes([]);
        }
      } else {
        setUserLikes([]);
      }
    }
    fetchUserLikes();
  }, [user]);

  const togglePlay = (trackUrl: string = streamUrl) => {
    if (!audioRef.current) return;
    
    if (isPlaying && currentTrackUrl === trackUrl) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (currentTrackUrl !== trackUrl) {
        if (trackUrl === streamUrl) {
          audioRef.current.src = `${trackUrl}?cb=${Date.now()}`;
        } else {
          audioRef.current.src = trackUrl;
        }
        setCurrentTrackUrl(trackUrl);
      }
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(err => {
          if (err.name !== 'AbortError' && err.name !== 'NotSupportedError') {
            setIsPlaying(false);
          }
        });
      } else {
        setIsPlaying(true);
      }
    }
  };

  const handleToggleLike = async (itemId: string) => {
    if (!user) {
      navigate('/profile');
      return;
    }
    
    const exists = userLikes.includes(itemId);
    let newLikes: string[];
    if (exists) {
      newLikes = userLikes.filter(id => id !== itemId);
    } else {
      newLikes = [...userLikes, itemId];
    }
    
    setUserLikes(newLikes);
    
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, { likes: newLikes });
    } catch (e) {
      console.error("Failed to update likes", e);
      setUserLikes(userLikes); // revert state
    }
  };

  const handleBack = () => {
    const path = location.pathname;
    
    if (path.includes('/song/')) {
      const parentPath = path.substring(0, path.indexOf('/song/'));
      navigate(parentPath);
    } else if (path.startsWith('/playlist/')) {
      navigate('/playlist');
    } else if (path.startsWith('/podcast/')) {
      navigate('/podcast');
    } else if (path.startsWith('/djset/')) {
      navigate('/djset');
    } else if (path === '/playlist' || path === '/podcast' || path === '/djset') {
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
            <div className="absolute inset-0 bg-black/55 pointer-events-none font-display"></div>
          </div>
        ) : (
          <>
            {location.pathname !== '/programmi/musik-talk' && (
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
            <Route path="/" element={
              <HomeView 
                isPlaying={isPlaying && (currentTrackUrl === streamUrl || currentTrackUrl === null)} 
                userLikes={userLikes} 
                togglePlay={() => togglePlay(streamUrl)} 
                toggleLike={handleToggleLike} 
              />
            } />
            <Route path="/playlist" element={
              <PlaylistView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/playlist/:id" element={
              <SinglePlaylistView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/playlist/:id/song/:songIndex" element={
              <SingleSongView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/podcast" element={
              <PodcastView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/podcast/:id" element={
              <SinglePodcastView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
              />
            } />
            <Route path="/podcast/:id/song/:songIndex" element={
              <SinglePodcastEpisodeView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/djset" element={
              <DjSetView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/djset/:id" element={
              <SingleDjSetView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/djset/:id/song/:songIndex" element={
              <SingleDjSetTrackView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/programmi" element={
              <ProgrammiView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/programmi/musik-talk" element={
              <MusikTalkView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                currentTrackUrl={currentTrackUrl} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
              />
            } />
            <Route path="/programmi/musik-talk/:id" element={
              <SingleMusikTalkEpisodeView 
                isPlaying={isPlaying} 
                togglePlay={togglePlay} 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
                currentTrackUrl={currentTrackUrl} 
              />
            } />
            <Route path="/explore" element={
              <ExploreView />
            } />
            <Route path="/profile" element={
              <ProfilePage 
                userLikes={userLikes} 
                toggleLike={handleToggleLike} 
              />
            } />
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

      <audio 
        ref={audioRef} 
        preload="none" 
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          if (!audioRef.current?.src || audioRef.current?.src === window.location.href) return;
          setIsPlaying(false);
        }}
      ></audio>
    </div>
  );
}

const PlayerTicker = ({ 
  text, 
  duration = 45, 
  href = "https://disclaimerofficial.com/", 
  ctaText = "WWW.DISCLAIMEROFFICIAL.COM"
}: { 
  text?: string; 
  duration?: number; 
  href?: string; 
  ctaText?: string; 
}) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="w-full h-[36px] glass-panel overflow-hidden flex items-center shrink-0 mb-[11px] mt-auto border-y border-white/10 bg-white/5 cursor-pointer hover:border-white/20 transition-all hover:bg-white/10 group/ticker"
    title={`Visita ${href.replace("https://", "").replace("www.", "")}`}
  >
    <motion.div
      className="whitespace-nowrap inline-block text-[13px] sm:text-[15px] font-space font-black text-white tracking-wider uppercase pl-[100%] group-hover/ticker:text-cyan-400 transition-colors"
      initial={{ x: "0%" }}
      animate={{ x: "-100%" }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
    >
      {text ? (
        <>
          {text} &nbsp;&bull;&nbsp; VISITA IL SITO UFFICIALE: {ctaText} &nbsp;&bull;&nbsp; {text} &nbsp;&bull;&nbsp; VISITA IL SITO UFFICIALE: {ctaText}
        </>
      ) : (
        <>
          Creatività urbana, stile senza compromessi. Esprimi la tua identità con DISCLAIMER &nbsp;&bull;&nbsp; VISITA IL SITO: {ctaText} &nbsp;&bull;&nbsp; "Non chiedere il permesso di essere te stesso." &nbsp;&bull;&nbsp; Chi si veste DISCLAIMER non ha niente da spiegare. &nbsp;&bull;&nbsp; VISITA IL SITO: {ctaText}
        </>
      )}
    </motion.div>
  </a>
);

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
