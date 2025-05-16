import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card'; // Keep for preview consistency if needed
import { cn } from '@/lib/utils';

interface LinkWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const LinkWidget: React.FC<LinkWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { url, label } = content as { url: string; label: string }; // Type assertion for link content

  // Background style logic can be centralized or passed if complex
  // For now, assuming BaseWidgetCard handles basic styling or it's passed via `style` prop

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          <h3 className="font-medium text-base mb-1 truncate">{title || 'Link Widget'}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <ExternalLink className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{label || url}</span>
          </div>
          {/* <p className="text-xs text-gray-500 mt-1 truncate">{url}</p> */}
        </div>
      </BaseWidgetCard>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full w-full no-underline text-current group/linkwidget"
      onClick={(e) => { 
        // Prevent navigation if editing is active or if it's a preview click
        if (!onEdit) return; // Allow click if not in edit mode (i.e., actual link click)
        e.preventDefault(); 
      }}
    >
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="group-hover/linkwidget:ring-2 group-hover/linkwidget:ring-primary/50 overflow-hidden">
        <div className="p-4 h-full flex flex-col justify-center">
          <h3 className="font-medium text-base mb-1 truncate">{title || 'Link Widget'}</h3>
          <div className="flex items-center text-sm text-muted-foreground group-hover/linkwidget:text-primary transition-colors">
            <ExternalLink className="h-4 w-4 mr-1.5 flex-shrink-0" />
            <span className="truncate">{label || url}</span>
          </div>
        </div>
      </BaseWidgetCard>
    </a>
  );
};

export default LinkWidget;