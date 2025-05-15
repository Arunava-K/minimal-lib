
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Instagram, Twitter, Github, Linkedin, Youtube, Facebook } from "lucide-react";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Widget as SupabaseWidget, WidgetContent, isLinkWidget, isSocialWidget, isTextWidget, isImageWidget, isMapWidget } from "@/types/supabase";
import { toast } from "@/hooks/use-toast";

const ProfileView = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

    if (username) {
      fetchProfile();
    }
  }, [username]);

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

  const renderWidget = (widget: any) => {
    switch (widget.type) {
      case "link":
        return (
          <a 
            href={widget.content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bento-card block group hover:scale-[1.01] transition-transform cursor-pointer"
            key={widget.id}
          >
            <h3 className="font-medium mb-2">{widget.title}</h3>
            <div className="flex items-center">
              <ExternalLink className="h-5 w-5 mr-2 group-hover:text-bento-blue transition-colors" />
              <span>{widget.content.label}</span>
            </div>
          </a>
        );
      
      case "social":
        return (
          <a 
            href={widget.content.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bento-card block group hover:scale-[1.01] transition-transform cursor-pointer"
            key={widget.id}
          >
            <h3 className="font-medium mb-2">{widget.title}</h3>
            <div className="flex items-center">
              {getSocialIcon(widget.content.platform)}
              <span className="ml-2">@{widget.content.username}</span>
            </div>
          </a>
        );
      
      case "text":
        return (
          <div className="bento-card" key={widget.id}>
            <h3 className="font-medium mb-2">{widget.title}</h3>
            <p>{widget.content.text}</p>
          </div>
        );
      
      case "image":
        return (
          <div className="bento-card" key={widget.id}>
            <h3 className="font-medium mb-2">{widget.title}</h3>
            <div className="rounded-md overflow-hidden">
              <img 
                src={widget.content.images[0]} 
                alt={widget.title} 
                className="w-full h-auto"
              />
            </div>
          </div>
        );
      
      case "map":
        return (
          <div className="bento-card" key={widget.id}>
            <h3 className="font-medium mb-2">{widget.title}</h3>
            <div className="bg-gray-50 rounded-md p-4 text-center">
              <p>📍 {widget.content.location}</p>
              {widget.content.description && <p className="text-sm mt-2">{widget.content.description}</p>}
            </div>
          </div>
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
      <div className="max-w-xl mx-auto">
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-24 h-24 bento-avatar mb-4">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {profile.widgets.map((widget) => renderWidget(widget))}
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
