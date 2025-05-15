
export type WidgetType = 'link' | 'social' | 'text' | 'image' | 'map' | 'spotify' | 'youtube' | 'custom';
export type BackgroundType = 'color' | 'gradient' | 'image' | 'none';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  content: any;
  gridSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  background?: {
    type: BackgroundType;
    value: string;
  };
  position?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

export interface LinkWidget extends Widget {
  type: 'link';
  content: {
    url: string;
    label: string;
    icon?: string;
  };
}

export interface SocialWidget extends Widget {
  type: 'social';
  content: {
    platform: string;
    username: string;
    url: string;
    icon?: string;
    description?: string;
  };
}

export interface TextWidget extends Widget {
  type: 'text';
  content: {
    text: string;
  };
}

export interface ImageWidget extends Widget {
  type: 'image';
  content: {
    images: string[];
    captions?: string[];
  };
}

export interface MapWidget extends Widget {
  type: 'map';
  content: {
    location: string;
    description?: string;
  };
}

export interface SpotifyWidget extends Widget {
  type: 'spotify';
  content: {
    trackId: string;
    embedUrl: string;
    url: string;
  };
}

export interface YouTubeWidget extends Widget {
  type: 'youtube';
  content: {
    videoId: string;
    embedUrl: string;
    url: string;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  widgets: Widget[];
  theme?: {
    background?: {
      type: BackgroundType;
      value: string;
    };
    fontFamily?: string;
    accentColor?: string;
  };
}

// Re-export from our Supabase custom types
export * from './supabase';
