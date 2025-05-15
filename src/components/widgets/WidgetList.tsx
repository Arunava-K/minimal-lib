
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, Instagram, Twitter, Github, Linkedin, Youtube, Facebook, Music, Video } from "lucide-react";
import { Widget } from "@/types";

interface WidgetListProps {
  widgets: Widget[];
  onEdit: (widget: Widget) => void;
  onDelete: (id: string) => void;
}

const WidgetList: React.FC<WidgetListProps> = ({ widgets, onEdit, onDelete }) => {
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
      case 'spotify':
        return <Music className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  const getWidgetIcon = (widget: Widget) => {
    switch (widget.type) {
      case "link":
        return <ExternalLink className="h-5 w-5" />;
      case "social":
        return getSocialIcon(widget.content.platform);
      case "text":
        return <ExternalLink className="h-5 w-5" />;
      case "image":
        return <ExternalLink className="h-5 w-5" />;
      case "map":
        return <ExternalLink className="h-5 w-5" />;
      case "spotify":
        return <Music className="h-5 w-5" />;
      case "youtube":
        return <Video className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  if (widgets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">You haven't added any widgets yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {widgets.map((widget) => (
        <Card key={widget.id} className="flex flex-col md:flex-row md:items-center justify-between p-4">
          <div className="flex items-center">
            <div className="mr-4 p-2 bg-gray-100 rounded">
              {getWidgetIcon(widget)}
            </div>
            <div>
              <h3 className="font-medium">{widget.title}</h3>
              <p className="text-sm text-gray-500">Type: {widget.type}</p>
            </div>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={() => onEdit(widget)}>
              <Edit className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(widget.id)}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default WidgetList;
