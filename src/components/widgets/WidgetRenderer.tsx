import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Widget, BackgroundType } from "@/types";
import { ExternalLink, Instagram, Twitter, Github, Linkedin, Youtube, Facebook, Music, Video, Edit, Trash2 } from "lucide-react";

const getBackgroundStyle = (widget: any) => {
  if (!widget.background) {
    return {};
  }

  switch (widget.background.type) {
    case 'color':
      return { backgroundColor: widget.background.value };
    case 'gradient':
      return { background: widget.background.value };
    case 'image':
      return { 
        backgroundImage: `url(${widget.background.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    default:
      return {};
  }
};

interface WidgetRendererProps {
  widget: Widget;
  isPreview?: boolean;
  onEdit?: (widget: Widget) => void;
  onDelete?: (id: string) => void;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  isPreview = false,
  onEdit,
  onDelete
}) => {
  const baseCardClasses = "transition-all duration-300 hover:shadow-md overflow-hidden rounded-xl";
  const backgroundStyle = getBackgroundStyle(widget);

  const renderWidgetContent = () => {
    switch (widget.type) {
      case "link":
        return renderLinkWidget();
      case "social":
        return renderSocialWidget();
      case "text":
        return renderTextWidget();
      case "image":
        return renderImageWidget();
      case "map":
        return renderMapWidget();
      case "spotify":
        return renderSpotifyWidget();
      case "youtube":
        return renderYouTubeWidget();
      default:
        return null;
    }
  };

  const renderLinkWidget = () => {
    if (isPreview) {
      return (
        <Card className="group relative" style={backgroundStyle}>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {renderEditButtons()}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
            <div className="flex items-center">
              <ExternalLink className="h-5 w-5 mr-2" />
              <span>{widget.content.label}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2 truncate">{widget.content.url}</p>
          </div>
        </Card>
      );
    }

    return (
      <a 
        href={widget.content.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${baseCardClasses} group hover:scale-[1.01]`}
      >
        <Card className="h-full border-0 overflow-hidden" style={backgroundStyle}>
          <div className="p-4 h-full flex flex-col justify-between relative z-10">
            <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
            <div className="flex items-center mt-2">
              <ExternalLink className="h-4 w-4 mr-2 group-hover:text-blue-500 transition-colors" />
              <span className="text-sm">{widget.content.label}</span>
            </div>
          </div>
        </Card>
      </a>
    );
  };

  const renderSocialWidget = () => {
    const platformIcon = getSocialIcon(widget.content.platform);
    
    if (isPreview) {
      return (
        <Card className="group relative" style={backgroundStyle}>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {renderEditButtons()}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
            <div className="flex items-center">
              {platformIcon}
              <span className="ml-2">@{widget.content.username}</span>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <a 
        href={widget.content.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`${baseCardClasses} group hover:scale-[1.01]`}
      >
        <Card className="h-full border-0 overflow-hidden" style={backgroundStyle}>
          <div className="p-4 h-full flex flex-col relative z-10">
            <div className="flex items-center mb-3">
              <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                {React.cloneElement(platformIcon, { className: "h-5 w-5" })}
              </div>
              <div>
                <h3 className="font-medium text-lg">{widget.content.platform}</h3>
                <span className="text-sm text-gray-600">@{widget.content.username}</span>
              </div>
            </div>
            {widget.content.description && (
              <p className="text-sm mt-1 text-gray-700">{widget.content.description}</p>
            )}
            <div className="mt-auto pt-2">
              <Button 
                variant="secondary" 
                className="text-xs bg-white bg-opacity-80 hover:bg-opacity-100 px-3 py-1 h-auto"
                size="sm"
              >
                Follow
              </Button>
            </div>
          </div>
        </Card>
      </a>
    );
  };

  const renderTextWidget = () => {
    if (isPreview) {
      return (
        <Card className="group relative" style={backgroundStyle}>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {renderEditButtons()}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
            <p>{widget.content.text}</p>
          </div>
        </Card>
      );
    }

    return (
      <Card className={`${baseCardClasses} border-0 overflow-hidden`} style={backgroundStyle}>
        <div className="p-4 relative z-10">
          <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
          <p className="text-sm text-gray-700">{widget.content.text}</p>
        </div>
      </Card>
    );
  };

  const renderImageWidget = () => {
    if (isPreview) {
      return (
        <Card className="group relative">
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {renderEditButtons()}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
            <div className="aspect-video rounded-md overflow-hidden">
              <img 
                src={widget.content.images[0]} 
                alt={widget.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className={`${baseCardClasses} group border-0 overflow-hidden`}>
        <AspectRatio ratio={16/9}>
          <img 
            src={widget.content.images[0]} 
            alt={widget.title} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
        </AspectRatio>
        <div className="p-3 bg-white relative z-10">
          <h3 className="font-medium">{widget.title}</h3>
        </div>
      </Card>
    );
  };

  const renderMapWidget = () => {
    if (isPreview) {
      return (
        <Card className="group relative" style={backgroundStyle}>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {renderEditButtons()}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
            <div className="bg-gray-100 rounded-md p-4 text-center">
              <p>📍 {widget.content.location}</p>
              {widget.content.description && <p className="text-sm mt-2">{widget.content.description}</p>}
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className={`${baseCardClasses} border-0 overflow-hidden`} style={backgroundStyle}>
        <div className="p-4 relative z-10">
          <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
          <div className="bg-white bg-opacity-70 rounded-md p-3 text-center">
            <p className="font-medium">📍 {widget.content.location}</p>
            {widget.content.description && <p className="text-sm mt-2 text-gray-700">{widget.content.description}</p>}
          </div>
        </div>
      </Card>
    );
  };

  const renderSpotifyWidget = () => {
    if (isPreview) {
      return (
        <Card className="group relative" style={backgroundStyle}>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {renderEditButtons()}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg flex items-center">
              <Music className="h-4 w-4 mr-2" />
              {widget.title}
            </h3>
            <div className="rounded overflow-hidden mt-2">
              <iframe
                src={widget.content.embedUrl}
                width="100%"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
              ></iframe>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className={`${baseCardClasses} border-0 overflow-hidden`} style={backgroundStyle}>
        <div className="p-4 relative z-10">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 bg-green-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
              <Music className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-medium text-lg">{widget.title}</h3>
          </div>
          <div className="bg-black bg-opacity-5 rounded-md p-2">
            <iframe 
              src={widget.content.embedUrl} 
              width="100%" 
              height="80" 
              frameBorder="0" 
              allow="encrypted-media"
              className="rounded"
            ></iframe>
          </div>
        </div>
      </Card>
    );
  };

  const renderYouTubeWidget = () => {
    if (isPreview) {
      return (
        <Card className="group relative" style={backgroundStyle}>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            {renderEditButtons()}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-lg flex items-center">
              <Video className="h-4 w-4 mr-2" />
              {widget.title}
            </h3>
            <div className="aspect-video rounded overflow-hidden mt-2">
              <iframe
                src={widget.content.embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </Card>
      );
    }

    return (
      <Card className={`${baseCardClasses} border-0 overflow-hidden`} style={backgroundStyle}>
        <div className="p-4 relative z-10">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center mr-3 shadow-sm">
              <Video className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-medium text-lg">{widget.title}</h3>
          </div>
          <div className="rounded-md overflow-hidden">
            <AspectRatio ratio={16/9}>
              <iframe 
                src={widget.content.embedUrl} 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0"
              ></iframe>
            </AspectRatio>
          </div>
        </div>
      </Card>
    );
  };

  const renderEditButtons = () => {
    if (!onEdit || !onDelete) return null;
    
    return (
      <>
        <Button variant="outline" size="icon" onClick={() => onEdit(widget)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onDelete(widget.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    );
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      case 'github':
        return <Github className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'youtube':
        return <Youtube className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  return renderWidgetContent();
};

export default WidgetRenderer;