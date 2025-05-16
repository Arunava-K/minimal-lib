
export type WidgetType = 'link' | 'social' | 'text' | 'image' | 'map' | 'spotify' | 'youtube' | 'instagram' | 'custom';
export type BackgroundType = 'color' | 'gradient' | 'image' | 'none';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  content: unknown;
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
    trackName?: string;
    artistName?: string;
    albumArtUrl?: string;
  };
}

export interface YouTubeWidget extends Widget {
  type: 'youtube';
  content: {
    videoId: string;
    embedUrl: string;
    url: string;
    thumbnailUrl?: string;
    channelName?: string;
    viewCount?: string | number;
  };
}

export interface InstagramWidget extends Widget {
  type: 'instagram';
  content: {
    url: string;
    username?: string;
    profilePicUrl?: string;
    postCount?: string | number;
    followerCount?: string | number;
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

// Placeholder for CustomWidget content, adjust as needed
export interface CustomWidgetContent {
  data: Record<string, any>; // Example: a generic data object
  componentType?: string; // Example: identifier for a custom component
}

export interface CustomWidget extends Widget {
  type: 'custom';
  content: CustomWidgetContent;
}

// Union of all specific widget types
export type AnyWidget =
  | LinkWidget
  | SocialWidget
  | TextWidget
  | ImageWidget
  | MapWidget
  | SpotifyWidget
  | YouTubeWidget
  | InstagramWidget
  | CustomWidget;

// Re-export from our Supabase custom types
export * from './supabase';
