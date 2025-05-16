
import React from 'react';
import { Widget } from '@/types';
import { cn } from '@/lib/utils';
import { Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export interface BaseWidgetCardProps {
  widget: Widget;
  children: React.ReactNode;
  className?: string;
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
  isPreview?: boolean;
  style?: React.CSSProperties;
}

// Pastel background colors for cards
const pastelBackgrounds = [
  'bg-[#FFF6F6]', // Soft red
  'bg-[#F6FFF9]', // Soft green
  'bg-[#F6F9FF]', // Soft blue
  'bg-[#FFF9F6]', // Soft orange
  'bg-[#F9F6FF]', // Soft purple
  'bg-[#FFFEF6]', // Soft yellow
  'bg-[#F6FCFF]', // Soft cyan
  'bg-[#FFF6FA]', // Soft pink
];

const BaseWidgetCard: React.FC<BaseWidgetCardProps> = ({
  widget,
  children,
  className,
  onEdit,
  onDelete,
  isPreview = false,
  style = {},
}) => {
  // Deterministically select a background color based on widget id
  const colorIndex = widget.id.charCodeAt(0) % pastelBackgrounds.length;
  const bgColor = pastelBackgrounds[colorIndex];

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
    <motion.div 
      className={cn(
        'group relative h-full w-full overflow-hidden flex flex-col rounded-2xl shadow-sm transition-all duration-200 ease-in-out',
        bgColor,
        !isPreview && onEdit && onDelete ? 'hover:shadow-lg' : '',
        className
      )}
      style={style}
      whileHover={{ 
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {!isPreview && onEdit && onDelete && (
        <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            onClick={handleEdit}
            className="p-1.5 bg-white hover:bg-gray-100 rounded-md shadow-sm"
            aria-label="Edit widget"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit size={16} className="text-gray-600" />
          </motion.button>
          <motion.button
            onClick={handleDelete}
            className="p-1.5 bg-white hover:bg-red-50 rounded-md shadow-sm"
            aria-label="Delete widget"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={16} className="text-red-500" />
          </motion.button>
        </div>
      )}
      {widget.title && (
        <div className="pt-4 pb-2 px-4">
          <h3 className="text-base font-semibold truncate">{widget.title}</h3>
        </div>
      )}
      <div className={cn('flex-grow p-4 overflow-auto', { 'pt-2': widget.title })}>
        {children}
      </div>
    </motion.div>
  );
};

export default BaseWidgetCard;
