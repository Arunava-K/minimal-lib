
import React from "react";
import { Link } from "react-router-dom";
import { UserProfile } from "@/types";

interface ProfileHeaderProps {
  profile: UserProfile;
  isPreview?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile, isPreview = false }) => {
  return (
    <div className="flex flex-col items-center mb-8 animate-fade-in">
      <div className="w-24 h-24 bento-avatar mb-4 bg-white rounded-full overflow-hidden">
        <img
          src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.displayName.replace(" ", "+")}&background=random`}
          alt={profile.displayName}
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-2xl font-bold mb-1">{profile.displayName}</h1>
      <p className="text-gray-600 mb-4">@{profile.username}</p>
      <p className="text-center max-w-md">{profile.bio}</p>
    </div>
  );
};

export default ProfileHeader;
