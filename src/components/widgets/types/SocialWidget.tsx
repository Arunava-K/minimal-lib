import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { Button } from '@/components/ui/button';
import { Github, Twitter, Instagram, Linkedin, Youtube, Facebook, ExternalLink } from 'lucide-react';

interface SocialWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const SocialWidget: React.FC<SocialWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { platform, username, url, description, callToAction } = content as {
    platform: string;
    username: string;
    url: string;
    description?: string;
    callToAction?: string;
  };

  const getSocialIcon = (platformName: string) => {
    const lowerPlatform = platformName.toLowerCase();
    const iconProps = { className: "h-5 w-5 group-hover/socialwidget:text-primary transition-colors" };
    const previewIconProps = { className: "h-4 w-4" };
    const displayIconProps = isPreview ? previewIconProps : iconProps;

    switch (lowerPlatform) {
      case 'github':
        return <Github {...displayIconProps} />;
      case 'twitter':
        return <Twitter {...displayIconProps} />;
      case 'instagram':
        return <Instagram {...displayIconProps} />;
      case 'linkedin':
        return <Linkedin {...displayIconProps} />;
      case 'youtube':
        return <Youtube {...displayIconProps} />;
      case 'facebook':
        return <Facebook {...displayIconProps} />;
      default:
        return <ExternalLink {...displayIconProps} />;
    }
  };

  const platformIcon = getSocialIcon(platform);

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className="mr-2 flex-shrink-0">{platformIcon}</div>
            <div>
              <h3 className="font-medium text-sm truncate">{title || platform}</h3>
              <p className="text-xs text-muted-foreground truncate">@{username}</p>
            </div>
          </div>
          {description && <p className="text-xs text-muted-foreground truncate mt-1">{description}</p>}
        </div>
      </BaseWidgetCard>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full w-full no-underline text-current group/socialwidget"
      onClick={(e) => { 
        if (!onEdit) return;
        e.preventDefault(); 
      }}
    >
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="group-hover/socialwidget:ring-2 group-hover/socialwidget:ring-primary/50 overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 bg-muted/50 dark:bg-muted/20 rounded-lg flex items-center justify-center mr-3 shadow-sm flex-shrink-0">
              {React.cloneElement(platformIcon, { className: "h-5 w-5 text-foreground/80" })}
            </div>
            <div>
              <h3 className="font-medium text-base group-hover/socialwidget:text-primary transition-colors truncate">{title || platform}</h3>
              <span className="text-sm text-muted-foreground truncate">@{username}</span>
            </div>
          </div>
          {description && (
            <p className="text-sm mt-1 text-muted-foreground flex-grow break-words">
              {description}
            </p>
          )}
          {callToAction && (
            <div className="mt-auto pt-2 flex justify-start">
              <Button 
                variant="secondary"
                size="sm"
                className="text-xs bg-background hover:bg-muted px-3 py-1 h-auto group-hover/socialwidget:bg-primary/10 group-hover/socialwidget:text-primary transition-colors"
                onClick={(e) => { e.preventDefault(); window.open(url, '_blank'); }} // Ensure button click also navigates
              >
                {callToAction || 'Follow'}
              </Button>
            </div>
          )}
        </div>
      </BaseWidgetCard>
    </a>
  );
};

export default SocialWidget;