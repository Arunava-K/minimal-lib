import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpotifyWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { url, trackName, artistName, albumArtUrl } = content as {
    url: string;
    trackName?: string;
    artistName?: string;
    albumArtUrl?: string;
  };

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <Music className="h-4 w-4 mr-2 flex-shrink-0 text-green-500" />
            <div>
              <h3 className="font-medium text-sm truncate">{title || trackName || 'Spotify Track'}</h3>
              {artistName && <p className="text-xs text-muted-foreground truncate">{artistName}</p>}
            </div>
          </div>
          {albumArtUrl && (
            <div className="mt-2 aspect-square w-full bg-muted rounded overflow-hidden">
              <img src={albumArtUrl} alt={trackName || 'Album art'} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </BaseWidgetCard>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full w-full no-underline text-current group/spotifywidget"
      onClick={(e) => { 
        if (!onEdit) return; 
        e.preventDefault(); 
      }}
    >
      <BaseWidgetCard 
        widget={widget} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        isPreview={isPreview} 
        style={style} 
        className="group-hover/spotifywidget:ring-2 group-hover/spotifywidget:ring-green-500/50 overflow-hidden h-full"
      >
        <div className={cn(
          "p-4 h-full flex flex-col",
          albumArtUrl ? "justify-between" : "justify-center"
        )}>
          {albumArtUrl && (
            <div className="mb-3 aspect-video w-full bg-muted rounded overflow-hidden shadow-md">
              <img src={albumArtUrl} alt={trackName || 'Album art'} className="w-full h-full object-cover" />
            </div>
          )}
          <div className={cn("flex items-center", !albumArtUrl && "mb-1")}>
            <div className={cn(
              "flex items-center justify-center mr-3 flex-shrink-0 rounded-full bg-green-500 text-white",
              albumArtUrl ? "h-8 w-8" : "h-10 w-10"
            )}>
              <Music className={cn(albumArtUrl ? "h-4 w-4" : "h-5 w-5")} />
            </div>
            <div>
              <h3 className="font-medium group-hover/spotifywidget:text-green-600 dark:group-hover/spotifywidget:text-green-400 transition-colors truncate leading-tight",
                style={{ fontSize: albumArtUrl ? '0.875rem' : '1rem' }} // Smaller title if album art is present
              >
                {title || trackName || 'Spotify Track'}
              </h3>
              {artistName && <span className="text-sm text-muted-foreground truncate">{artistName}</span>}
            </div>
          </div>
          {!albumArtUrl && url && (
             <p className="text-xs text-muted-foreground mt-1 truncate group-hover/spotifywidget:text-green-600 dark:group-hover/spotifywidget:text-green-400 transition-colors">
                {url.replace(/^https?:\/\//, '')}
            </p>
          )}
        </div>
      </BaseWidgetCard>
    </a>
  );
};

export default SpotifyWidget;