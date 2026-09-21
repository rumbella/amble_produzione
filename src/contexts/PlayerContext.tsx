import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

export interface PlayerContextType {
  isPlaying: boolean;
  currentTrackUrl: string | null;
  togglePlay: (trackUrl?: string) => void;
  playTrack: (trackUrl: string) => void;
  pauseTrack: () => void;
  userLikes: string[];
  toggleLike: (itemId: string) => Promise<void>;
  streamUrl: string;
}

const STREAM_URL = "https://mqugxowc-lbmedia.radioca.st/stream";

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch user likes from Firestore when user changes
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

  const playTrack = (trackUrl: string) => {
    if (!audioRef.current) return;
    if (currentTrackUrl !== trackUrl) {
      if (trackUrl === STREAM_URL) {
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
  };

  const pauseTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = (trackUrl: string = STREAM_URL) => {
    if (!audioRef.current) return;

    if (isPlaying && currentTrackUrl === trackUrl) {
      pauseTrack();
    } else {
      playTrack(trackUrl);
    }
  };

  const toggleLike = async (itemId: string) => {
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

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        currentTrackUrl,
        togglePlay,
        playTrack,
        pauseTrack,
        userLikes,
        toggleLike,
        streamUrl: STREAM_URL,
      }}
    >
      {children}
      <audio
        ref={audioRef}
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          if (!audioRef.current?.src || audioRef.current?.src === window.location.href) return;
          setIsPlaying(false);
        }}
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
