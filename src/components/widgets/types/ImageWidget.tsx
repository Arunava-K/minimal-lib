import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface ImageWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const ImageWidget: React.FC<ImageWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  // Assuming content for image widget is { images: string[], alt?: string } or { src: string, alt?: string }
  // For simplicity, let's assume content.images is an array and we display the first one.
  // Or content.src for a single image.
  const imageUrl = (content as any).images?.[0] || (content as any).src;
  const altText = (content as any).alt || title || 'Image widget';

  if (!imageUrl) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4 text-center text-muted-foreground">
          <p>Image URL not provided.</p>
        </div>
      </BaseWidgetCard>
    );
  }

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-2">
          {/* In preview, we might want a simpler layout or just the image */}
          <AspectRatio ratio={16 / 9} className="bg-muted rounded-md overflow-hidden">
            <img 
              src={imageUrl} 
              alt={altText} 
              className="w-full h-full object-cover"
            />
          </AspectRatio>
          {title && <p className="text-xs text-muted-foreground mt-1 truncate text-center">{title}</p>}
        </div>
      </BaseWidgetCard>
    );
  }

  return (
    <BaseWidgetCard 
      widget={widget} 
      onEdit={onEdit} 
      onDelete={onDelete} 
      isPreview={isPreview} 
      style={style} 
      className={cn('group/imagewidget overflow-hidden', widget.title ? '' : 'p-0')}
    >
      {/* If there's no title, the BaseWidgetCard header won't render, so AspectRatio can take full space if p-0 is applied */}
      <AspectRatio ratio={16 / 9} className={cn({'m-4 mb-0': !!widget.title, 'rounded-lg overflow-hidden': !!widget.title})}>
        <img 
          src={imageUrl} 
          alt={altText} 
          className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover/imagewidget:scale-105"
        />
      </AspectRatio>
      {/* BaseWidgetCard handles title display. If more complex layout needed below image, add here */}
      {/* For example, if there's content specific to image widget to show below the image but inside the card */}
      {/* This example assumes title is handled by BaseWidgetCard and image is primary content */}
    </BaseWidgetCard>
  );
};

export default ImageWidget;