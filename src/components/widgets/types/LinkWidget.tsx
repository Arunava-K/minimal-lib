
import React from 'react';
import { Widget } from '@/types';
import BaseWidgetCard, { BaseWidgetCardProps } from '../BaseWidgetCard';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface LinkWidgetProps extends Omit<BaseWidgetCardProps, 'children'> {}

const LinkWidget: React.FC<LinkWidgetProps> = ({ widget, isPreview, onEdit, onDelete, style }) => {
  const { title, content } = widget;
  const { url = '', label = '', icon = '' } = (content as { url?: string; label?: string; icon?: string }) || {};

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

  // Function to validate URL and extract domain
  const getValidUrl = (urlString: string): { isValid: boolean; domain: string; faviconUrl: string } => {
    try {
      // Handle empty or undefined URLs
      if (!urlString || urlString.trim() === '') {
        return {
          isValid: false,
          domain: 'unknown',
          faviconUrl: ''
        };
      }
      
      // Check if URL has a protocol, if not add https://
      const urlWithProtocol = urlString.startsWith('http://') || urlString.startsWith('https://')
        ? urlString
        : `https://${urlString}`;
      
      const urlObj = new URL(urlWithProtocol);
      const domain = urlObj.hostname;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      
      return {
        isValid: true,
        domain,
        faviconUrl
      };
    } catch (error) {
      console.error('Invalid URL:', urlString, error);
      return {
        isValid: false,
        domain: 'unknown',
        faviconUrl: ''
      };
    }
  };

  // Validate and extract info from URL
  const { isValid, domain, faviconUrl } = getValidUrl(url || '');

  // If URL is invalid, show a message
  if (!isValid) {
    return (
      <BaseWidgetCard 
        widget={widget} 
        onEdit={onEdit} 
        onDelete={onDelete} 
        isPreview={isPreview} 
        style={style} 
        className="overflow-hidden"
      >
        <div className="h-full flex flex-col items-center justify-center p-4 text-center">
          <ExternalLink className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-semibold mb-1">{title || 'Link Widget'}</h3>
          <p className="text-sm text-muted-foreground">Invalid URL. Please edit this widget to set a valid URL.</p>
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
        className="group-hover/linkwidget:ring-2 group-hover/linkwidget:ring-primary/50 overflow-hidden h-full"
      >
        <div className="h-full flex flex-col items-start justify-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <img 
                src={faviconUrl} 
                alt={domain} 
                className="h-full w-full object-cover"
                onError={(e) => {
                  // If favicon fails to load, show a fallback icon
                  e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold group-hover/linkwidget:text-primary transition-colors line-clamp-1">
                {title || label || domain}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{domain}</p>
            </div>
          </div>
          
          <motion.div 
            className="w-full p-3 rounded-xl bg-gray-50 group-hover/linkwidget:bg-gray-100 transition-colors text-center"
            whileHover={{ y: -2 }}
          >
            <span className="text-sm font-medium flex items-center justify-center">
              <ExternalLink className="h-3 w-3 mr-1.5 flex-shrink-0" />
              {label || "Visit Link"}
            </span>
          </motion.div>
        </div>
      </BaseWidgetCard>
    </a>
  );
};

export default LinkWidget;
