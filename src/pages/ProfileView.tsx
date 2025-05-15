
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Instagram, Twitter, Github, Linkedin, Youtube, Facebook, ArrowLeft } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Widget as SupabaseWidget, WidgetContent, isLinkWidget, isSocialWidget, isTextWidget, isImageWidget, isMapWidget } from "@/types/supabase";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const ProfileView = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { user } = useAuth();
  const isPreview = window.location.pathname === '/real';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First try to fetch from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError || !profileData) {
          // If not found in Supabase, check localStorage as fallback
          const findLocalProfile = () => {
            const allItems = { ...localStorage };
            const profileKeys = Object.keys(allItems).filter(key => key.startsWith('bentoProfile-'));
            
            for (const key of profileKeys) {
              const storedProfile = JSON.parse(localStorage.getItem(key) || "{}");
              if (storedProfile.username === username) {
                return storedProfile;
              }
            }
            return null;
          };
          
          const localProfile = findLocalProfile();
          if (localProfile) {
            setProfile(localProfile);
          } else {
            setNotFound(true);
          }
        } else {
          // Profile found in Supabase, now fetch their widgets
          const { data: widgetsData, error: widgetsError } = await supabase
            .from('widgets')
            .select('*')
            .eq('user_id', profileData.id)
            .order('position');

          if (widgetsError) {
            toast({
              title: "Error",
              description: "Could not load widgets",
              variant: "destructive",
            });
          }

          // Convert the Supabase format to our app's format
          const userProfile: UserProfile = {
            id: profileData.id,
            username: profileData.username,
            displayName: profileData.display_name,
            bio: profileData.bio || "",
            avatarUrl: profileData.avatar_url || "",
            widgets: widgetsData?.map(widget => ({
              id: widget.id,
              type: widget.type as any,
              title: widget.title || "",
              content: widget.content as any,
              gridSpan: (widget.grid_span || 1) as 1 | 2,
              rowSpan: (widget.row_span || 1) as 1 | 2,
            })) || [],
          };

          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (username || isPreview) {
      fetchProfile();
    }
  }, [username, isPreview]);

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

  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-br from-pink-50 to-pink-100",
      "bg-gradient-to-br from-blue-50 to-blue-100",
      "bg-gradient-to-br from-green-50 to-green-100",
      "bg-gradient-to-br from-purple-50 to-purple-100",
      "bg-gradient-to-br from-yellow-50 to-yellow-100",
      "bg-gradient-to-br from-teal-50 to-teal-100",
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const renderWidget = (widget: any) => {
    const baseCardClasses = "transition-all duration-300 hover:shadow-lg overflow-hidden rounded-xl";
    
    switch (widget.type) {
      case "link":
        return (
          <a 
            href={widget.content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${baseCardClasses} group hover:scale-[1.02]`}
            key={widget.id}
          >
            <Card className={`h-full ${getRandomGradient()} border-0`}>
              <div className="p-4 h-full flex flex-col justify-between">
                <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
                <div className="flex items-center mt-2">
                  <ExternalLink className="h-4 w-4 mr-2 group-hover:text-bento-blue transition-colors" />
                  <span className="text-sm">{widget.content.label}</span>
                </div>
              </div>
            </Card>
          </a>
        );
      
      case "social":
        const platformIcon = getSocialIcon(widget.content.platform);
        return (
          <a 
            href={widget.content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${baseCardClasses} group hover:scale-[1.02]`}
            key={widget.id}
          >
            <Card className={`h-full ${getRandomGradient()} border-0`}>
              <div className="p-4 h-full flex flex-col">
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
      
      case "text":
        return (
          <Card className={`${baseCardClasses} ${getRandomGradient()} border-0`} key={widget.id}>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
              <p className="text-sm text-gray-700">{widget.content.text}</p>
            </div>
          </Card>
        );
      
      case "image":
        return (
          <Card className={`${baseCardClasses} group border-0 overflow-hidden`} key={widget.id}>
            <AspectRatio ratio={16/9}>
              <img 
                src={widget.content.images[0]} 
                alt={widget.title} 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
            </AspectRatio>
            <div className="p-3 bg-white">
              <h3 className="font-medium">{widget.title}</h3>
            </div>
          </Card>
        );
      
      case "map":
        return (
          <Card className={`${baseCardClasses} ${getRandomGradient()} border-0`} key={widget.id}>
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">{widget.title}</h3>
              <div className="bg-white bg-opacity-70 rounded-md p-3 text-center">
                <p className="font-medium">📍 {widget.content.location}</p>
                {widget.content.description && <p className="text-sm mt-2 text-gray-700">{widget.content.description}</p>}
              </div>
            </div>
          </Card>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-gray-600 mb-8">We couldn't find a profile for @{username}</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {isPreview && (
        <div className="max-w-xl mx-auto mb-6">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      )}
      
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bento-avatar mb-4 bg-white">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
          {profile.widgets.map((widget) => {
            const span = widget.gridSpan === 2 ? "sm:col-span-2" : "";
            return (
              <div key={widget.id} className={span}>
                {renderWidget(widget)}
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Powered by <Link to="/" className="text-bento-purple hover:underline">Bento Clone</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
