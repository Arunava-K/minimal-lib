
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
  'bg-bento-pastel-red', // Soft red
  'bg-bento-pastel-green', // Soft green
  'bg-bento-pastel-blue', // Soft blue
  'bg-bento-pastel-orange', // Soft orange
  'bg-bento-pastel-purple', // Soft purple
  'bg-bento-pastel-yellow', // Soft yellow
  'bg-bento-pastel-cyan', // Soft cyan
  'bg-bento-pastel-pink', // Soft pink
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
        'group relative h-full w-full overflow-hidden flex flex-col rounded-2xl shadow-bento transition-all duration-200 ease-in-out',
        bgColor,
        !isPreview && onEdit && onDelete ? 'hover:shadow-bento-hover' : '',
        className
      )}
      style={style}
      whileHover={{ 
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
        y: -4,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {!isPreview && onEdit && onDelete && (
        <div className="absolute top-3 right-3 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            onClick={handleEdit}
            className="p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-sm"
            aria-label="Edit widget"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Edit size={16} className="text-gray-600" />
          </motion.button>
          <motion.button
            onClick={handleDelete}
            className="p-2 bg-white/80 backdrop-blur-sm hover:bg-red-50 rounded-full shadow-sm"
            aria-label="Delete widget"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trash2 size={16} className="text-red-500" />
          </motion.button>
        </div>
      )}
      {widget.title && (
        <div className="pt-6 pb-2 px-6">
          <h3 className="text-lg font-semibold leading-relaxed">{widget.title}</h3>
        </div>
      )}
      <div className={cn('flex-grow p-6 overflow-auto', { 'pt-3': widget.title })}>
        {children}
      </div>
    </motion.div>
  );
};

export default BaseWidgetCard;
