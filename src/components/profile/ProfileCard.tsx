
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { getBackgroundStyle } from "@/utils/backgroundStyles";

interface ProfileCardProps {
  profile: UserProfile;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isEditing,
  onEdit,
  onCancel,
  children
}) => {
  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your public profile information</CardDescription>
        </CardHeader>
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
        <CardFooter>
          <Button onClick={onEdit}>Edit Profile</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
