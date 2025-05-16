import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { UserProfile } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getBackgroundStyle } from "@/utils/backgroundStyles";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileFooter from "@/components/profile/ProfileFooter";
import BentoGrid from "@/components/widgets/BentoGrid";
import { motion } from "framer-motion";

const ProfileView = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { user } = useAuth();
  const isPreview = window.location.pathname === '/real';
  const isCurrentUser = user?.username === username;

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
              background: { 
                type: 'gradient', 
                value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
              },
              position: widget.position,
              // Since width and height properties don't exist in the database schema,
              // we provide default values
              width: 300,
              height: 200
            })) || [],
            // Theme doesn't exist in the profiles table, so we provide a default theme
            theme: {
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
    <div className="min-h-screen relative">
      {/* Fixed Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {isPreview && (
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </Link>
          )}
          
          {isCurrentUser && !isPreview && (
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            </Link>
          )}
          
          {!isPreview && !isCurrentUser && (
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          )}
          
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-bento-purple flex items-center justify-center text-white font-bold">
              B
            </div>
            <span className="font-medium">Bento Profile</span>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <motion.section 
        className="py-16 px-4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={getBackgroundStyle(profile)}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <motion.div 
              className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img
                src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.displayName.replace(" ", "+")}&background=random`}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mt-4 mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {profile.displayName}
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              @{profile.username}
            </motion.p>
            {profile.bio && (
              <motion.p 
                className="text-gray-600 max-w-lg mx-auto mt-4 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {profile.bio}
              </motion.p>
            )}
          </div>
        </div>
      </motion.section>
      
      {/* Bento Grid Section */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <BentoGrid 
            widgets={profile.widgets.sort((a, b) => {
              // Sort by position if available, otherwise keep original order
              if (a.position !== undefined && b.position !== undefined) {
                return a.position - b.position;
              }
              return 0;
            })} 
            isPreview={true}
          />
        </div>
      </section>
      
      <ProfileFooter />
    </div>
  );
};

export default ProfileView;
