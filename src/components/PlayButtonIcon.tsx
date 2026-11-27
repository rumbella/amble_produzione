import React from 'react';
import { Loader2, Pause, Play } from 'lucide-react';

export function PlayButtonIcon({ playing, loading, size = 28 }: { playing: boolean; loading: boolean; size?: number }) {
  if (loading) return <Loader2 size={size} strokeWidth={2.5} className="animate-spin text-black" aria-label="Connessione in corso" />;
  if (playing) return <Pause size={size} strokeWidth={2} className="fill-black" />;
  return <Play size={size} strokeWidth={2} className="ml-1 fill-black" />;
}
