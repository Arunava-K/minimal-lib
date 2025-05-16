
export type WidgetType = 'link' | 'social' | 'text' | 'image' | 'map' | 'spotify' | 'youtube' | 'custom';
export type BackgroundType = 'color' | 'gradient' | 'image' | 'none';

export interface Widget {
  id: string;
  type: WidgetType;
  title?: string;
  content: any;
  gridSpan?: 1 | 2;
  rowSpan?: 1 | 2;
  position?: number;
  background?: {
    type: BackgroundType;
    value: string;
  };
  borderRadius?: string;
  textColor?: string;
  width?: number;
  height?: number;
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
    caption?: string;
  };
}

export interface SpotifyWidget extends Widget {
  type: 'spotify';
  content: {
    trackId: string;
    embedUrl: string;
    url?: string;
  };
}

export interface YouTubeWidget extends Widget {
  type: 'youtube';
  content: {
    videoId: string;
    embedUrl: string;
    url?: string;
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
