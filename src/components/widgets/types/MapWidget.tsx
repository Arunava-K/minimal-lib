
import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const MapWidget: React.FC<MapWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { 
    location,
    latitude, 
    longitude,
    address,
    mapImageUrl // Static image fallback
  } = content as {
    location: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    mapImageUrl?: string;
  };

  // Fallback map image (static Google Maps or placeholder)
  const fallbackMapUrl = mapImageUrl || `https://placehold.co/600x400/F6F9FF/9da4b0?text=Map+of+${encodeURIComponent(location)}`;

  // Generate Google Maps URL
  const googleMapsUrl = latitude && longitude
    ? `https://www.google.com/maps?q=${latitude},${longitude}`
    : `https://www.google.com/maps/search/${encodeURIComponent(location)}`;

  if (isPreview) {
    return (
      <BaseWidgetCard widget={widget} onEdit={onEdit} onDelete={onDelete} isPreview={isPreview} style={style} className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
            <div>
              <h3 className="font-medium text-sm truncate">{title || location}</h3>
              {address && <p className="text-xs text-muted-foreground truncate">{address}</p>}
            </div>
          </div>
          <div className="mt-2 bg-gray-100 rounded-md h-20 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-blue-500" />
          </div>
        </div>
      </BaseWidgetCard>
    );
  }

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full w-full no-underline text-current group/mapwidget"
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
        className="group-hover/mapwidget:ring-2 group-hover/mapwidget:ring-blue-500/30 overflow-hidden h-full"
      >
        <div className="h-full flex flex-col p-0">
          <div className="flex-grow relative overflow-hidden rounded-lg">
            <img
              src={fallbackMapUrl}
              alt={`Map of ${location}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-20 h-20 flex items-center justify-center"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 1,
                  ease: "easeInOut"
                }}
              >
                <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg">
                  <MapPin className="h-6 w-6" />
                </div>
              </motion.div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="font-semibold text-white text-lg">{title || location}</h3>
              {address && <p className="text-white/80 text-sm">{address}</p>}
            </div>
          </div>
        </div>
      </BaseWidgetCard>
    </a>
  );
};

export default MapWidget;
