
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image, Link } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  defaultImage?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  defaultImage,
  className = "" 
}) => {
  const [imageUrl, setImageUrl] = useState<string>(defaultImage || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");

  // For file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // For now we'll use a simple FileReader to convert to base64
    // In a production app, you'd upload to a service like Supabase Storage
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageUrl(result);
      onImageUploaded(result);
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your image",
        variant: "destructive",
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // For fetching an image from URL
  const fetchImageFromUrl = async () => {
    if (!externalUrl) {
      toast({
        title: "No URL provided",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      // Check if URL is valid
      const urlPattern = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
      if (!urlPattern.test(externalUrl)) {
        throw new Error("Invalid URL format");
      }
      
      // For production, you'd want to proxy this through your backend
      // to avoid CORS issues
      setImageUrl(externalUrl);
      onImageUploaded(externalUrl);
      
      toast({
        title: "Image fetched",
        description: "Image URL has been set successfully",
      });
    } catch (error) {
      toast({
        title: "Error fetching image",
        description: error instanceof Error ? error.message : "Failed to fetch image from URL",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setImageUrl("");
    setExternalUrl("");
    onImageUploaded("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {imageUrl && (
        <div className="relative rounded-md overflow-hidden bg-gray-100">
          <img 
            src={imageUrl} 
            alt="Selected" 
            className="w-full h-40 object-cover"
            onError={() => {
              toast({
                title: "Image error",
                description: "The image could not be loaded",
                variant: "destructive",
              });
              clearImage();
            }}
          />
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link className="h-4 w-4 mr-2" />
            From URL
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-2">
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Choose Image"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="mt-2">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              disabled={isLoading} 
              onClick={fetchImageFromUrl}
            >
              {isLoading ? "Loading..." : "Fetch"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageUploader;
