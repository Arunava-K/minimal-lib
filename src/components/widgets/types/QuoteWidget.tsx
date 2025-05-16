import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { MessageSquare } from 'lucide-react'; // Or a more specific quote icon

interface QuoteWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const QuoteWidget: React.FC<QuoteWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { text, author } = content as { text: string; author?: string }; // Type assertion for quote content

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
      <div className="p-6 h-full flex flex-col justify-center items-center text-center bg-slate-50 dark:bg-slate-800">
        {/* Icon can be placed here if desired */}
        {/* <MessageSquare size={24} className="mb-3 text-slate-400 dark:text-slate-500" /> */}
        <blockquote className="relative">
          <p className="text-lg md:text-xl font-serif text-slate-700 dark:text-slate-300 leading-relaxed">
            <span className='absolute -left-3 -top-1 text-4xl text-slate-300 dark:text-slate-600'>&ldquo;</span>
            {text}
            <span className='absolute -right-3 -bottom-1 text-4xl text-slate-300 dark:text-slate-600'>&rdquo;</span>
          </p>
          {author && (
            <footer className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              &mdash; {author}
            </footer>
          )}
        </blockquote>
      </div>
    </BaseWidgetCard>
  );
};

export default QuoteWidget;