import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface InstagramWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const InstagramWidget: React.FC<InstagramWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { url, username, profilePicUrl, postCount, followerCount } = content as {
    url: string;
    username?: string;
    profilePicUrl?: string;
    postCount?: string | number;
    followerCount?: string | number;
  };

  const defaultUsername = url.split('/').filter(Boolean).pop() || 'Instagram';

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <Instagram className="h-4 w-4 mr-2 flex-shrink-0 text-pink-600" />
            <div>
              <h3 className="font-medium text-sm truncate">{title || username || defaultUsername}</h3>
              {followerCount && <p className="text-xs text-muted-foreground truncate">{followerCount} followers</p>}
            </div>
          </div>
          {profilePicUrl && (
            <div className="mt-2 aspect-square w-16 h-16 bg-muted rounded-full overflow-hidden mx-auto">
              <img src={profilePicUrl} alt={username || 'Profile picture'} className="w-full h-full object-cover" />
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
      className="block h-full w-full no-underline text-current group/instagramwidget"
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
        className="group-hover/instagramwidget:ring-2 group-hover/instagramwidget:ring-pink-500/50 overflow-hidden h-full"
      >
        <div className="p-4 h-full flex flex-col items-center justify-center text-center">
          {profilePicUrl ? (
            <div className="mb-3 w-20 h-20 bg-muted rounded-full overflow-hidden shadow-md">
              <img src={profilePicUrl} alt={username || 'Profile'} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="mb-3 h-12 w-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
              <Instagram className="h-6 w-6 text-white" />
            </div>
          )}
          <h3 className="font-semibold text-base group-hover/instagramwidget:text-pink-600 dark:group-hover/instagramwidget:text-pink-400 transition-colors truncate">
            {title || username || defaultUsername}
          </h3>
          {followerCount && <span className="text-sm text-muted-foreground truncate">{followerCount} Followers</span>}
          {postCount && <span className="text-xs text-muted-foreground truncate">{postCount} Posts</span>}
          
          <Button 
            variant="outline"
            size="sm"
            className="mt-auto text-xs bg-background hover:bg-muted px-4 py-1.5 h-auto group-hover/instagramwidget:border-pink-500 group-hover/instagramwidget:text-pink-600 transition-colors border-foreground/20"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(url, '_blank'); }}
          >
            Follow
          </Button>
        </div>
      </BaseWidgetCard>
    </a>
  );
};

export default InstagramWidget;