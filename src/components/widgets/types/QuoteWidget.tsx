
import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { Quote } from 'lucide-react';

interface QuoteWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const QuoteWidget: React.FC<QuoteWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { text, author } = content as { text: string; author?: string };

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          {title && <h3 className="font-medium text-base mb-2 truncate">{title}</h3>}
          <blockquote className="text-sm text-muted-foreground italic">
            <p className='mb-1'>"{text}"</p>
            {author && <footer className="text-xs text-right">- {author}</footer>}
          </blockquote>
        </div>
      </BaseWidgetCard>
    );
  }

  return (
    <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
      <div className="h-full flex flex-col justify-center items-center text-center">
        <blockquote className="relative max-w-md">
          <Quote className="h-8 w-8 absolute -top-4 -left-2 text-black/10" />
          <p className="text-xl md:text-2xl font-display text-gray-800 leading-relaxed">
            {text}
          </p>
          {author && (
            <footer className="mt-6 text-base text-gray-500">
              &mdash; {author}
            </footer>
          )}
        </blockquote>
      </div>
    </BaseWidgetCard>
  );
};

export default QuoteWidget;
