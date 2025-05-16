
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Widget, WidgetType, BackgroundType, AnyWidget } from "@/types";
import { useToast } from "@/hooks/use-toast";
import WidgetForm, { WidgetFormData } from "@/components/forms/WidgetForm";
import { extractSpotifyId, extractYoutubeId } from "@/utils/mediaHelpers";

interface AddWidgetDialogProps {
  onAddWidget: (widget: Omit<AnyWidget, "id">) => void;
}

const AddWidgetDialog: React.FC<AddWidgetDialogProps> = ({ onAddWidget }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>("link");
  const [newWidgetData, setNewWidgetData] = useState<WidgetFormData>({
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

  const getWidgetBackground = () => {
    if (newWidgetData.backgroundType === 'color') {
      return {
        type: 'color' as BackgroundType,
        value: newWidgetData.backgroundColor
      };
    } else if (newWidgetData.backgroundType === 'gradient') {
      return {
        type: 'gradient' as BackgroundType,
        value: newWidgetData.backgroundGradient
      };
    } else if (newWidgetData.backgroundType === 'image') {
      return {
        type: 'image' as BackgroundType,
        value: newWidgetData.backgroundImage
      };
    }
    return undefined;
  };

  const handleAddWidget = () => {
    let widget: Omit<AnyWidget, "id">;
    const background = getWidgetBackground();

    switch (newWidgetType) {
      case "link":
        widget = {
          type: "link",
          title: newWidgetData.title,
          content: {
            url: newWidgetData.linkUrl,
            label: newWidgetData.linkLabel,
          },
          background
        };
        break;
      case "social":
        widget = {
          type: "social",
          title: newWidgetData.socialPlatform,
          content: {
            platform: newWidgetData.socialPlatform,
            username: newWidgetData.socialUsername,
            url: `https://${newWidgetData.socialPlatform}.com/${newWidgetData.socialUsername}`,
          },
          background
        };
        break;
      case "text":
        widget = {
          type: "text",
          title: newWidgetData.title,
          content: {
            text: newWidgetData.text,
          },
          background
        };
        break;
      case "image":
        widget = {
          type: "image",
          title: newWidgetData.title,
          content: {
            images: [newWidgetData.imageUrl],
          },
          background
        };
        break;
      case "map":
        widget = {
          type: "map",
          title: newWidgetData.location,
          content: {
            location: newWidgetData.location,
            description: newWidgetData.locationDescription,
          },
          background
        };
        break;
      case "spotify":
        const spotifyId = extractSpotifyId(newWidgetData.spotifyUrl);
        widget = {
          type: "spotify" as WidgetType,
          title: newWidgetData.title || "Spotify Track",
          content: {
            trackId: spotifyId,
            embedUrl: `https://open.spotify.com/embed/track/${spotifyId}`,
            url: newWidgetData.spotifyUrl
            // TODO: Add fields like trackName, artistName, albumArtUrl here if fetched
          },
          background
        };
        break;
      case "youtube":
        const youtubeId = extractYoutubeId(newWidgetData.youtubeUrl);
        widget = {
          type: "youtube" as WidgetType,
          title: newWidgetData.title || "YouTube Video",
          content: {
            videoId: youtubeId,
            embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
            url: newWidgetData.youtubeUrl
            // TODO: Add fields like thumbnailUrl, channelName, viewCount here if fetched
          },
          background
        };
        break;
      case "instagram":
        widget = {
          type: "instagram" as WidgetType,
          title: newWidgetData.title || "Instagram Post",
          content: {
            url: newWidgetData.instagramUrl
            // TODO: Add fields like username, profilePicUrl here if fetched
          },
          background
        };
        break;
      default:
        return;
    }

    onAddWidget(widget);
    setOpen(false);
    
    // Reset form
    setNewWidgetData({
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
    
    toast({
      title: "Widget added",
      description: "Your new widget has been added to your profile",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add New Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Widget</DialogTitle>
          <DialogDescription>
            Choose a widget type and fill in the details.
          </DialogDescription>
        </DialogHeader>

        <WidgetForm
          widgetType={newWidgetType}
          formData={newWidgetData}
          setFormData={setNewWidgetData}
          onWidgetTypeChange={setNewWidgetType}
        />

        <DialogFooter>
          <Button onClick={handleAddWidget}>Add Widget</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddWidgetDialog;
