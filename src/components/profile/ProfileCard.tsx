
import React, { useState } from "react";
import { UserProfile, BackgroundType } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getBackgroundStyle, gradients } from "@/utils/backgroundStyles";
import ImageUploader from "@/components/ImageUploader";
import { useToast } from "@/hooks/use-toast";

interface ProfileCardProps {
  profile: UserProfile;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onUpdate: (updatedProfile: Partial<UserProfile>) => void;
  children?: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isEditing,
  onEdit,
  onCancel,
  onUpdate,
  children
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    backgroundType: profile.theme?.background?.type || 'color' as BackgroundType,
    backgroundColor: profile.theme?.background?.type === 'color' ? profile.theme.background.value : "#f5f7fa",
    backgroundGradient: profile.theme?.background?.type === 'gradient' ? profile.theme.background.value : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    backgroundImage: profile.theme?.background?.type === 'image' ? profile.theme.background.value : "",
  });

  const handleUpdate = () => {
    // Set background based on type selected
    let background = { type: formData.backgroundType, value: "" };
    
    if (formData.backgroundType === 'color') {
      background.value = formData.backgroundColor;
    } else if (formData.backgroundType === 'gradient') {
      background.value = formData.backgroundGradient;
    } else if (formData.backgroundType === 'image') {
      background.value = formData.backgroundImage;
    }

    onUpdate({
      displayName: formData.displayName,
      bio: formData.bio,
      avatarUrl: formData.avatarUrl,
      theme: {
        background,
        accentColor: profile.theme?.accentColor || '#5c6ac4'
      }
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleAvatarImageUploaded = (imageUrl: string) => {
    setFormData({
      ...formData,
      avatarUrl: imageUrl
    });
  };

  const handleBackgroundImageUploaded = (imageUrl: string) => {
    setFormData({
      ...formData,
      backgroundImage: imageUrl
    });
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your public profile information</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Profile Picture</Label>
            <ImageUploader 
              onImageUploaded={handleAvatarImageUploaded}
              defaultImage={formData.avatarUrl}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username}
              disabled
            />
            <p className="text-xs text-gray-500">Username cannot be changed</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Profile Background</Label>
            <Select
              value={formData.backgroundType}
              onValueChange={(value) => setFormData({ ...formData, backgroundType: value as BackgroundType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Background Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="color">Solid Color</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.backgroundType === 'color' && (
              <div className="mt-2">
                <Label htmlFor="backgroundColor">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="color"
                    id="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="w-10 h-10"
                  />
                  <Input
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                    className="flex-1"
                  />
                </div>
              </div>
            )}
            
            {formData.backgroundType === 'gradient' && (
              <div className="mt-2 space-y-2">
                <Label>Choose a Gradient</Label>
                <div className="grid grid-cols-3 gap-2">
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
              <div className="mt-2">
                <Label>Background Image</Label>
                <ImageUploader 
                  onImageUploaded={handleBackgroundImageUploaded}
                  defaultImage={formData.backgroundImage}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleUpdate}>Save Changes</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your public profile information</CardDescription>
      </CardHeader>
      
      {children || (
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.displayName.replace(" ", "+")}&background=random`}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div>
            <h3 className="font-medium">Display Name</h3>
            <p>{profile.displayName}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Username</h3>
            <p>@{profile.username}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Bio</h3>
            <p>{profile.bio}</p>
          </div>
          
          <div>
            <h3 className="font-medium">Profile Theme</h3>
            <div className="flex gap-2 mt-1">
              <div 
                className="w-8 h-8 rounded-full border border-gray-200" 
                style={getBackgroundStyle(profile)}
              ></div>
              <p className="text-sm">{profile.theme?.background?.type || "Default"}</p>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter>
        <Button onClick={onEdit} className="w-full">Edit Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
