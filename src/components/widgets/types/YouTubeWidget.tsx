import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubeWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const YouTubeWidget: React.FC<YouTubeWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { url, videoId, thumbnailUrl, channelName, viewCount } = content as {
    url: string;
    videoId?: string;
    thumbnailUrl?: string;
    channelName?: string;
    viewCount?: string | number;
  };

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <Video className="h-4 w-4 mr-2 flex-shrink-0 text-red-600" />
            <div>
              <h3 className="font-medium text-sm truncate">{title || 'YouTube Video'}</h3>
              {channelName && <p className="text-xs text-muted-foreground truncate">{channelName}</p>}
            </div>
          </div>
          {thumbnailUrl && (
            <div className="mt-2 aspect-video w-full bg-muted rounded overflow-hidden">
              <img src={thumbnailUrl} alt={title || 'Video thumbnail'} className="w-full h-full object-cover" />
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
      className="block h-full w-full no-underline text-current group/youtubewidget"
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
        className="group-hover/youtubewidget:ring-2 group-hover/youtubewidget:ring-red-500/50 overflow-hidden h-full"
      >
        <div className="p-4 h-full flex flex-col">
          {thumbnailUrl ? (
            <div className="mb-3 aspect-video w-full bg-muted rounded overflow-hidden shadow-md relative group/thumbnail">
              <img src={thumbnailUrl} alt={title || 'Video thumbnail'} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/thumbnail:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                  <Video className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-3 h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <Video className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <h3 className="font-medium text-base group-hover/youtubewidget:text-red-600 dark:group-hover/youtubewidget:text-red-400 transition-colors line-clamp-2">
              {title || 'YouTube Video'}
            </h3>
            {channelName && <span className="text-sm text-muted-foreground block truncate">{channelName}</span>}
            {viewCount && <span className="text-xs text-muted-foreground block truncate">{viewCount} views</span>}
          </div>
        </div>
      </BaseWidgetCard>
    </a>
  );
};

export default YouTubeWidget;