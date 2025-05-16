
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Widget, WidgetType, BackgroundType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import WidgetForm, { WidgetFormData } from "@/components/forms/WidgetForm";
import { extractSpotifyId, extractYoutubeId } from "@/utils/mediaHelpers";

interface EditWidgetDialogProps {
  widget: Widget | null;
  onClose: () => void;
  onUpdateWidget: (id: string, updates: Partial<Widget>) => void;
}

const EditWidgetDialog: React.FC<EditWidgetDialogProps> = ({ 
  widget, 
  onClose, 
  onUpdateWidget 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<WidgetFormData>({
    title: "",
    linkUrl: "",
    linkLabel: "",
    socialPlatform: "instagram",
    socialUsername: "",
    text: "",
    imageUrl: "",
    location: "",
    locationDescription: "",
    spotifyUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    backgroundType: 'gradient',
    backgroundColor: "#ffffff",
    backgroundGradient: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    backgroundImage: "",
  });

  useEffect(() => {
    if (widget) {
      // Set background values
      let backgroundType: BackgroundType = 'gradient';
      let backgroundColor = "#ffffff";
      let backgroundGradient = "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)";
      let backgroundImage = "";
      
      if (widget.background) {
        backgroundType = widget.background.type;
        if (widget.background.type === 'color') {
          backgroundColor = widget.background.value;
        } else if (widget.background.type === 'gradient') {
          backgroundGradient = widget.background.value;
        } else if (widget.background.type === 'image') {
          backgroundImage = widget.background.value;
        }
      }
      
      switch (widget.type) {
        case "link":
          setFormData({
            ...formData,
            title: widget.title,
            linkUrl: widget.content.url,
            linkLabel: widget.content.label,
            backgroundType,
            backgroundColor,
            backgroundGradient,
            backgroundImage
          });
          break;
        case "social":
          setFormData({
            ...formData,
            title: widget.title,
            socialPlatform: widget.content.platform,
            socialUsername: widget.content.username,
            backgroundType,
            backgroundColor,
            backgroundGradient,
            backgroundImage
          });
          break;
        case "text":
          setFormData({
            ...formData,
            title: widget.title,
            text: widget.content.text,
            backgroundType,
            backgroundColor,
            backgroundGradient,
            backgroundImage
          });
          break;
        case "image":
          setFormData({
            ...formData,
            title: widget.title,
            imageUrl: widget.content.images[0],
            backgroundType,
            backgroundColor,
            backgroundGradient,
            backgroundImage
          });
          break;
        case "map":
          setFormData({
            ...formData,
            title: widget.title,
            location: widget.content.location,
            locationDescription: widget.content.description || "",
            backgroundType,
            backgroundColor,
            backgroundGradient,
            backgroundImage
          });
          break;
        case "spotify":
          setFormData({
            ...formData,
            title: widget.title,
            spotifyUrl: widget.content.url || "",
            backgroundType,
            backgroundColor,
            backgroundGradient,
            backgroundImage
          });
          break;
        case "youtube":
          setFormData({
            ...formData,
            title: widget.title,
            youtubeUrl: widget.content.url || "",
            backgroundType,
            backgroundColor,
            backgroundGradient,
            backgroundImage
          });
          break;
        case "instagram":
          setFormData({
            ...formData,
            title: widget.title,
            instagramUrl: widget.content.url || "",
            backgroundType,
            backgroundColor,
            backgroundGradient,
            backgroundImage
          });
          break;
      }
    }
  }, [widget]);

  const getWidgetBackground = () => {
    if (formData.backgroundType === 'color') {
      return {
        type: 'color' as BackgroundType,
        value: formData.backgroundColor
      };
    } else if (formData.backgroundType === 'gradient') {
      return {
        type: 'gradient' as BackgroundType,
        value: formData.backgroundGradient
      };
    } else if (formData.backgroundType === 'image') {
      return {
        type: 'image' as BackgroundType,
        value: formData.backgroundImage
      };
    }
    return undefined;
  };

  const handleUpdateWidget = () => {
    if (!widget) return;

    let updates: Partial<Widget> = {
      title: formData.title,
    };

    const background = getWidgetBackground();
    updates.background = background;

    switch (widget.type) {
      case "link":
        updates = {
          ...updates,
          content: {
            url: formData.linkUrl,
            label: formData.linkLabel,
          },
        };
        break;
      case "social":
        updates = {
          ...updates,
          content: {
            platform: formData.socialPlatform,
            username: formData.socialUsername,
            url: `https://${formData.socialPlatform}.com/${formData.socialUsername}`,
          },
        };
        break;
      case "text":
        updates = {
          ...updates,
          content: {
            text: formData.text,
          },
        };
        break;
      case "image":
        updates = {
          ...updates,
          content: {
            images: [formData.imageUrl],
          },
        };
        break;
      case "map":
        updates = {
          ...updates,
          content: {
            location: formData.location,
            description: formData.locationDescription,
          },
        };
        break;
      case "spotify":
        const spotifyId = extractSpotifyId(formData.spotifyUrl);
        updates = {
          ...updates,
          content: {
            trackId: spotifyId,
            embedUrl: `https://open.spotify.com/embed/track/${spotifyId}`,
            url: formData.spotifyUrl
            // TODO: Add fields like trackName, artistName, albumArtUrl here if fetched/available
          },
        };
        break;
      case "youtube":
        const youtubeId = extractYoutubeId(formData.youtubeUrl);
        updates = {
          ...updates,
          content: {
            videoId: youtubeId,
            embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
            url: formData.youtubeUrl
            // TODO: Add fields like thumbnailUrl, channelName, viewCount here if fetched/available
          },
        };
        break;
      case "instagram":
        updates = {
          ...updates,
          content: {
            url: formData.instagramUrl
            // TODO: Add fields like username, profilePicUrl here if fetched/available
          },
        };
        break;
    }

    onUpdateWidget(widget.id, updates);
    onClose();
    
    toast({
      title: "Widget updated",
      description: "Your widget has been updated successfully",
    });
  };

  if (!widget) return null;

  return (
    <Dialog open={!!widget} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Widget</DialogTitle>
          <DialogDescription>
            Update the details of your widget.
          </DialogDescription>
        </DialogHeader>

        <WidgetForm
          widgetType={widget.type}
          formData={formData}
          setFormData={setFormData}
        />

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdateWidget}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditWidgetDialog;
