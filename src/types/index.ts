
export type WidgetType = 'link' | 'social' | 'text' | 'image' | 'map';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  content: any;
  gridSpan?: 1 | 2;
  rowSpan?: 1 | 2;
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

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  widgets: Widget[];
}

// Re-export from our Supabase custom types
export * from './supabase';
