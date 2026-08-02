/**
 * Centralized Type Definitions for Radio Amblè Application
 */

// ==========================================
// MEDIA & TRACK TYPES
// ==========================================

export interface Song {
  id?: string | number;
  title: string;
  duration?: string;
  audioUrl: string;
  imageUrl?: string;
  artist?: string;
  author?: string;
  tag?: string;
  backgroundUrl?: string;
}

export interface SpotlightTrack {
  title: string;
  artist: string;
  audioUrl: string;
  imageUrl: string;
}

// ==========================================
// CATEGORY & COLLECTION ITEMS
// ==========================================

export interface MediaCategoryItem {
  id: number;
  title: string;
  author: string;
  imageUrl?: string;
  seed?: number;
  tag?: string;
  subtitle?: string;
  teaser?: string;
  time?: string;
  type?: string;
  targetId?: number | null;
}

// Category-specific aliases for explicit semantic domain representation
export type PodcastItem = MediaCategoryItem;
export type PlaylistCategoryItem = MediaCategoryItem;
export type PlaylistItem = MediaCategoryItem;
export type DJSetItem = MediaCategoryItem;
export type ProgramItem = MediaCategoryItem;
export type CarouselItem = MediaCategoryItem;

export interface MusikTalkEpisode {
  id: number;
  title: string;
  imageUrl: string;
  audioUrl: string;
  duration: string;
  author: string;
  tag: string;
}

// ==========================================
// GRID & CAROUSEL LAYOUT TYPES
// ==========================================

export interface GridItem {
  id: string;
  type: 'image' | 'video';
  mediaUrl: string;
  aspectRatio: number;
  title?: string;
  brandName?: string;
  overflowMenu?: boolean;
}

export interface FeaturedSlot {
  id: string;
  type: 'adv' | 'promo' | 'djset' | 'podcast' | 'video_art' | 'tracklist';
  isSponsored: boolean;
  brandName?: string;
  title: string;
  subtitle?: string;
  videoUrl?: string;
  expiresAt?: string;
  isHighlight?: boolean;
  isFirstTracklist?: boolean;
  tracks?: (Song | SpotlightTrack)[];
}

export interface ContentGridProps {
  items: GridItem[];
  featuredSlots: FeaturedSlot[];
  itemsPerSlot?: number;
  onActionClick?: (item: GridItem | FeaturedSlot, actionType: string) => void;
  onCardClick?: (item: GridItem) => void;
  isPlaying?: boolean;
  togglePlay?: (url: string) => void;
  currentTrackUrl?: string | null;
  spotlightTracks?: (Song | SpotlightTrack)[];
}

export interface ContentCardProps {
  key?: string | number;
  item: GridItem;
  onActionClick?: (item: GridItem | FeaturedSlot, actionType: string) => void;
  onCardClick?: (item: GridItem) => void;
  isWideOnDesktop?: boolean;
}

export interface InfiniteCarouselProps {
  items: CarouselItem[];
  type: 'playlist' | 'podcast' | 'djset';
  onItemClick: (id: number) => void;
}

export interface WebGLBackgroundProps {
  images: string[];
  currentIndex: number;
}
