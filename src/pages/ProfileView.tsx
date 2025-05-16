import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getBackgroundStyle } from "@/utils/backgroundStyles";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileFooter from "@/components/profile/ProfileFooter";
import WidgetGrid from "@/components/widgets/WidgetGrid";

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
        if (!username && !isPreview) {
          setNotFound(true);
          return;
        }

        // First try to fetch from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) {
          // Check if it's a "no rows returned" error
          if (profileError.message?.includes('returned 0 rows') || profileError.code === 'PGRST116') {
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
            // Handle other types of errors
            console.error("Error fetching profile:", profileError);
            toast({
              title: "Error",
              description: "Failed to load profile",
              variant: "destructive",
            });
            setNotFound(true);
          }
        } else if (!profileData) {
          setNotFound(true);
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
              background: widget.background as any || { type: 'gradient', value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
              position: widget.position,
              width: widget.width,
              height: widget.height
            })) || [],
            theme: profileData.theme || {
              background: { type: 'color', value: '#f5f7fa' },
              accentColor: '#5c6ac4'
            }
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

    fetchProfile();
  }, [username]);

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
    <div className="min-h-screen py-12 px-4" style={getBackgroundStyle(profile)}>
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
        <ProfileHeader profile={profile} />
        
        <WidgetGrid 
          widgets={profile.widgets.sort((a, b) => {
            // Sort by position if available, otherwise keep original order
            if (a.position !== undefined && b.position !== undefined) {
              return a.position - b.position;
            }
            return 0;
          })} 
        />
        
        <ProfileFooter />
      </div>
    </div>
  );
};

export default ProfileView;
