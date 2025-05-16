
export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  widgets: Widget[];
  theme: Theme;
}

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  content: any;
  gridSpan: 1 | 2;
  rowSpan: 1 | 2;
  background: Background;
  position: number;
  width: number;
  height: number;
}

// A type that encompasses any specific widget type
export type Widget = Widget;

export type WidgetType = 
  | 'link' 
  | 'social' 
  | 'text' 
  | 'image' 
  | 'map' 
  | 'spotify' 
  | 'youtube'
  | 'quote'
  | 'instagram'
  | 'github'
  | 'calendar';

export interface Theme {
  background: Background;
  accentColor: string;
}

export interface Background {
  type: BackgroundType;
  value: string;
}

export type BackgroundType = 'color' | 'gradient' | 'image';
