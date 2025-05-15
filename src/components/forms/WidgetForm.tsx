
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WidgetType, BackgroundType } from "@/types";
import ImageUploader from "@/components/ImageUploader";
import { gradients } from "@/utils/backgroundStyles";

export interface WidgetFormData {
  title: string;
  linkUrl: string;
  linkLabel: string;
  socialPlatform: string;
  socialUsername: string;
  text: string;
  imageUrl: string;
  location: string;
  locationDescription: string;
  spotifyUrl: string;
  youtubeUrl: string;
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundGradient: string;
  backgroundImage: string;
}

interface WidgetFormProps {
  widgetType: WidgetType;
  formData: WidgetFormData;
  setFormData: React.Dispatch<React.SetStateAction<WidgetFormData>>;
  onWidgetTypeChange?: (type: WidgetType) => void;
}

const WidgetForm: React.FC<WidgetFormProps> = ({
  widgetType,
  formData,
  setFormData,
  onWidgetTypeChange
}) => {
  const handleWidgetImageUploaded = (imageUrl: string) => {
    setFormData({
      ...formData,
      imageUrl,
      backgroundImage: imageUrl
    });
  };

  const renderContentFields = () => {
    switch (widgetType) {
      case "link":
        return renderLinkFields();
      case "social":
        return renderSocialFields();
      case "text":
        return renderTextFields();
      case "image":
        return renderImageFields();
      case "map":
        return renderMapFields();
      case "spotify":
        return renderSpotifyFields();
      case "youtube":
        return renderYoutubeFields();
      default:
        return null;
    }
  };

  const renderLinkFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input
          id="title"
          className="col-span-3"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="link-url" className="text-right">
          URL
        </Label>
        <Input
          id="link-url"
          className="col-span-3"
          placeholder="https://example.com"
          value={formData.linkUrl}
          onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="link-label" className="text-right">
          Label
        </Label>
        <Input
          id="link-label"
          className="col-span-3"
          placeholder="Visit my website"
          value={formData.linkLabel}
          onChange={(e) => setFormData({ ...formData, linkLabel: e.target.value })}
        />
      </div>
    </>
  );

  const renderSocialFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="social-platform" className="text-right">
          Platform
        </Label>
        <Select
          value={formData.socialPlatform}
          onValueChange={(value) => setFormData({ ...formData, socialPlatform: value })}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instagram">Instagram</SelectItem>
            <SelectItem value="twitter">Twitter</SelectItem>
            <SelectItem value="github">GitHub</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="social-username" className="text-right">
          Username
        </Label>
        <Input
          id="social-username"
          className="col-span-3"
          placeholder="yourusername"
          value={formData.socialUsername}
          onChange={(e) => setFormData({ ...formData, socialUsername: e.target.value })}
        />
      </div>
    </>
  );

  const renderTextFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="text-title" className="text-right">
          Title
        </Label>
        <Input
          id="text-title"
          className="col-span-3"
          placeholder="About Me"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="text-content" className="text-right">
          Text
        </Label>
        <Textarea
          id="text-content"
          className="col-span-3"
          placeholder="Write something about yourself..."
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        />
      </div>
    </>
  );

  const renderImageFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="image-title" className="text-right">
          Title
        </Label>
        <Input
          id="image-title"
          className="col-span-3"
          placeholder="My Photo"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="image-url" className="text-right pt-2">
          Image
        </Label>
        <div className="col-span-3">
          <ImageUploader 
            onImageUploaded={handleWidgetImageUploaded}
            defaultImage={formData.imageUrl}
          />
        </div>
      </div>
    </>
  );

  const renderMapFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location" className="text-right">
          Location
        </Label>
        <Input
          id="location"
          className="col-span-3"
          placeholder="New York, USA"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="location-desc" className="text-right">
          Description
        </Label>
        <Input
          id="location-desc"
          className="col-span-3"
          placeholder="Where I live"
          value={formData.locationDescription}
          onChange={(e) => setFormData({ ...formData, locationDescription: e.target.value })}
        />
      </div>
    </>
  );

  const renderSpotifyFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="spotify-title" className="text-right">
          Title
        </Label>
        <Input
          id="spotify-title"
          className="col-span-3"
          placeholder="My Favorite Song"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="spotify-url" className="text-right">
          Spotify URL
        </Label>
        <Input
          id="spotify-url"
          className="col-span-3"
          placeholder="https://open.spotify.com/track/..."
          value={formData.spotifyUrl}
          onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
        />
      </div>
      <div className="col-span-4 pl-[25%]">
        <p className="text-xs text-gray-500">Paste the URL of a Spotify track</p>
      </div>
    </>
  );

  const renderYoutubeFields = () => (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="youtube-title" className="text-right">
          Title
        </Label>
        <Input
          id="youtube-title"
          className="col-span-3"
          placeholder="My Video"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="youtube-url" className="text-right">
          YouTube URL
        </Label>
        <Input
          id="youtube-url"
          className="col-span-3"
          placeholder="https://youtube.com/watch?v=..."
          value={formData.youtubeUrl}
          onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
        />
      </div>
      <div className="col-span-4 pl-[25%]">
        <p className="text-xs text-gray-500">Paste the URL of a YouTube video</p>
      </div>
    </>
  );

  const renderStyleFields = () => (
    <div className="grid gap-4 py-2">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="background-type" className="text-right">
          Background
        </Label>
        <Select
          value={formData.backgroundType}
          onValueChange={(value) => setFormData({ ...formData, backgroundType: value as BackgroundType })}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Background Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">Solid Color</SelectItem>
            <SelectItem value="gradient">Gradient</SelectItem>
            <SelectItem value="image">Image</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.backgroundType === 'color' && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="widget-bg-color" className="text-right">
            Color
          </Label>
          <div className="col-span-3 flex gap-2">
            <input
              type="color"
              id="widget-bg-color"
              value={formData.backgroundColor}
              onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
              className="w-10 h-10"
            />
            <Input
              value={formData.backgroundColor}
              onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
            />
          </div>
        </div>
      )}
      
      {formData.backgroundType === 'gradient' && (
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right pt-2">
            Gradient
          </Label>
          <div className="col-span-3 grid grid-cols-3 gap-2">
            {gradients.map((gradient, index) => (
              <button
                key={index}
                type="button"
                className={`h-12 rounded-md transition-all ${formData.backgroundGradient === gradient ? 'ring-2 ring-blue-500' : ''}`}
                style={{ background: gradient }}
                onClick={() => setFormData({ ...formData, backgroundGradient: gradient })}
              />
            ))}
          </div>
        </div>
      )}
      
      {formData.backgroundType === 'image' && (
        <div className="grid grid-cols-4 items-start gap-4">
          <Label className="text-right pt-2">
            Image
          </Label>
          <div className="col-span-3">
            <ImageUploader 
              onImageUploaded={(url) => setFormData({ ...formData, backgroundImage: url })}
              defaultImage={formData.backgroundImage}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Tabs defaultValue="content">
      <TabsList className="w-full">
        <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
        <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
      </TabsList>
      
      <TabsContent value="content" className="space-y-4 mt-4">
        {onWidgetTypeChange && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="widget-type" className="text-right">
              Type
            </Label>
            <Select
              value={widgetType}
              onValueChange={(value) => onWidgetTypeChange(value as WidgetType)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select widget type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="link">Link</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="map">Location</SelectItem>
                <SelectItem value="spotify">Spotify</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="grid gap-4 py-2">
          {renderContentFields()}
        </div>
      </TabsContent>
      
      <TabsContent value="style" className="mt-4">
        {renderStyleFields()}
      </TabsContent>
    </Tabs>
  );
};

export default WidgetForm;
