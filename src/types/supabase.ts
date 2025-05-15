
import { Database } from '@/integrations/supabase/types';

// Types derived from the Database types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Widget = Database['public']['Tables']['widgets']['Row'];

// Extended types for our application
export type WidgetContent = 
  | LinkWidgetContent
  | SocialWidgetContent
  | TextWidgetContent
  | ImageWidgetContent
  | MapWidgetContent;

export type LinkWidgetContent = {
  url: string;
  label: string;
  icon?: string;
};

export type SocialWidgetContent = {
  platform: string;
  username: string;
  url: string;
  icon?: string;
};

export type TextWidgetContent = {
  text: string;
};

export type ImageWidgetContent = {
  images: string[];
  captions?: string[];
};

export type MapWidgetContent = {
  location: string;
  description?: string;
};

// Type guards to check widget content types
export function isLinkWidget(content: WidgetContent): content is LinkWidgetContent {
  return 'url' in content && 'label' in content;
}

export function isSocialWidget(content: WidgetContent): content is SocialWidgetContent {
  return 'platform' in content && 'username' in content;
}

export function isTextWidget(content: WidgetContent): content is TextWidgetContent {
  return 'text' in content;
}

export function isImageWidget(content: WidgetContent): content is ImageWidgetContent {
  return 'images' in content;
}

export function isMapWidget(content: WidgetContent): content is MapWidgetContent {
  return 'location' in content;
}
