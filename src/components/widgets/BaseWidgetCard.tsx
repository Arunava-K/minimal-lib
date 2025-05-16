import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Widget } from '@/types';
import { cn } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';

export interface BaseWidgetCardProps {
  widget: Widget;
  children: React.ReactNode;
  className?: string;
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
  style?: React.CSSProperties;
}

const BaseWidgetCard: React.FC<BaseWidgetCardProps> = ({
  widget,
  children,
  className,
  onEdit,
  onDelete,
  isPreview = false,
  style = {},
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click or drag
    if (onEdit) {
      onEdit(widget);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click or drag
    if (onDelete) {
      onDelete(widget.id);
    }
  };

  return (
    <Card 
      className={cn(
        'group relative h-full w-full overflow-hidden flex flex-col transition-all duration-200 ease-in-out',
        !isPreview && onEdit && onDelete ? 'hover:shadow-xl' : '',
        className
      )}
      style={style}
    >
      {!isPreview && onEdit && onDelete && (
        <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleEdit}
            className="p-1.5 bg-background/80 hover:bg-muted rounded-md backdrop-blur-sm"
            aria-label="Edit widget"
          >
            <Edit size={16} className="text-foreground/80" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-background/80 hover:bg-muted rounded-md backdrop-blur-sm"
            aria-label="Delete widget"
          >
            <Trash2 size={16} className="text-destructive/80" />
          </button>
        </div>
      )}
      {widget.title && (
        <CardHeader className="pt-4 pb-2 px-4">
          <CardTitle className="text-sm font-medium truncate">{widget.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn('flex-grow p-4 overflow-auto', { 'pt-2': widget.title })}>
        {children}
      </CardContent>
      {/* Optional Footer can be added here if needed by specific widgets */}
    </Card>
  );
};

export default BaseWidgetCard;