import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
// import { Card } from '@/components/ui/card'; // Keep for preview consistency if needed, but likely not for simple text

interface TextWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const TextWidget: React.FC<TextWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { text } = content as { text: string }; // Type assertion for text content

  // Preview mode for TextWidget might be simpler, just showing the text within BaseWidgetCard
  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          {title && <h3 className="font-medium text-base mb-1 truncate">{title}</h3>}
          <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{text}</p>
        </div>
      </BaseWidgetCard>
    );
  }

  return (
    <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
      <div className="p-4 h-full flex flex-col">
        {/* Title is handled by BaseWidgetCard if present */}
        <p className="text-sm text-foreground whitespace-pre-wrap break-words flex-grow">
          {text}
        </p>
      </div>
    </BaseWidgetCard>
  );
};

export default TextWidget;
