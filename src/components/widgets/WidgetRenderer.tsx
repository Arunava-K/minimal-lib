import React from 'react';
import { Widget } from '@/types';
import { ExternalLink } from 'lucide-react';
import BaseWidgetCard from './BaseWidgetCard';
import LinkWidget from './types/LinkWidget';
import TextWidget from './types/TextWidget';
import QuoteWidget from './types/QuoteWidget';
import SocialWidget from './types/SocialWidget';
import ImageWidget from './types/ImageWidget';
import SpotifyWidget from './types/SpotifyWidget';
import InstagramWidget from './types/InstagramWidget';
import YouTubeWidget from './types/YouTubeWidget';
// Import other specific widget components here as they are created

import { cn } from "@/lib/utils"; // cn might still be useful for wrapper styling if any

const getBackgroundStyle = (widget: any) => {
  if (!widget.background) {
    return {};
  }

  switch (widget.background.type) {
    case 'color':
      return { backgroundColor: widget.background.value };
    case 'gradient':
      return { background: widget.background.value };
    case 'image':
      return { 
        backgroundImage: `url(${widget.background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    default:
      return {};
  }
};

interface WidgetRendererProps {
  widget: Widget;
  isPreview?: boolean;
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ // Changed export to default at the end
  widget,
  isPreview = false,
  onEdit,
  onDelete
}) => {
  const backgroundStyle = getBackgroundStyle(widget);

  // Note: getSocialIcon function is removed as its logic is now within SocialWidget.tsx

  switch (widget.type) {
    case 'link':
      // Basic link widget, platform-specific links should ideally be their own types e.g. 'spotify'
      return (
        <LinkWidget 
          widget={widget} 
          isPreview={isPreview} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          style={backgroundStyle} 
        />
      );
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
    // Add cases for other widget types here
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