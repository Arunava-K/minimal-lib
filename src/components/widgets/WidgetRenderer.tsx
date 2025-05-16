
import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard from './BaseWidgetCard';
import LinkWidget from './types/LinkWidget';
import TextWidget from './types/TextWidget';
import QuoteWidget from './types/QuoteWidget';
import SocialWidget from './types/SocialWidget';
import ImageWidget from './types/ImageWidget';
import SpotifyWidget from './types/SpotifyWidget';
import InstagramWidget from './types/InstagramWidget';
import YouTubeWidget from './types/YouTubeWidget';
import MapWidget from './types/MapWidget';
import GithubWidget from './types/GithubWidget';
import CalendarWidget from './types/CalendarWidget';

import { cn } from "@/lib/utils";
import { getBackgroundStyle } from '@/utils/backgroundStyles';

interface WidgetRendererProps {
  widget: Widget;
  isPreview?: boolean;
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  isPreview = false,
  onEdit,
  onDelete
}) => {
  const backgroundStyle = getBackgroundStyle(widget);

  switch (widget.type) {
    case 'link':
      return (
        <LinkWidget 
          widget={widget} 
          isPreview={isPreview} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          style={backgroundStyle} 
        />
      );
    case 'text':
      return (
        <TextWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    case 'quote':
      return (
        <QuoteWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    case 'social':
      return (
        <SocialWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    case 'image':
      return (
        <ImageWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    case 'spotify':
      return (
        <SpotifyWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    case 'instagram':
      return (
        <InstagramWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    case 'youtube':
      return (
        <YouTubeWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    case 'map':
      return (
        <MapWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    case 'github':
      return (
        <GithubWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    case 'calendar':
      return (
        <CalendarWidget
          widget={widget}
          isPreview={isPreview}
          onEdit={onEdit}
          onDelete={onDelete}
          style={backgroundStyle}
        />
      );
    default:
      // Fallback for unknown or not-yet-implemented widget types
      return (
        <BaseWidgetCard 
          widget={widget} 
          isPreview={isPreview} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          style={backgroundStyle}
          className="border-dashed border-muted-foreground"
        >
          <div className="p-4 text-center text-muted-foreground">
            <p className="font-semibold">{widget.title || 'Widget'}</p>
            <p className="text-sm">Type: {widget.type}</p>
            <p className="text-xs mt-2">Renderer not implemented yet.</p>
          </div>
        </BaseWidgetCard>
      );
  }
};

export default WidgetRenderer;
