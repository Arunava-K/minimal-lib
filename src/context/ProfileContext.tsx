
import React, { createContext, useContext, useState, useEffect } from "react";
import { Widget, UserProfile } from "../types";
import { useAuth } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";

interface ProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addWidget: (widget: Omit<Widget, "id">) => void;
  updateWidget: (id: string, updates: Partial<Widget>) => void;
  deleteWidget: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Mock data for demo purposes
const defaultWidgets: Widget[] = [
  {
    id: uuidv4(),
    type: "text",
    title: "About Me",
    content: {
      text: "Hello! I'm a designer passionate about creating beautiful interfaces."
    },
    gridSpan: 1,
    rowSpan: 1,
    background: { 
      type: 'gradient', 
      value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
    },
    position: 0,
    width: 300,
    height: 200
  },
  {
    id: uuidv4(),
    type: "social",
    title: "Instagram",
    content: {
      platform: "instagram",
      username: "designguru",
      url: "https://instagram.com/designguru",
      icon: "instagram"
    },
    gridSpan: 1,
    rowSpan: 1,
    background: { 
      type: 'gradient', 
      value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
    },
    position: 1,
    width: 300,
    height: 200
  },
  {
    id: uuidv4(),
    type: "link",
    title: "My Portfolio",
    content: {
      label: "Check out my work",
      url: "https://myportfolio.com",
      icon: "external-link"
    },
    gridSpan: 1,
    rowSpan: 1,
    background: { 
      type: 'gradient', 
      value: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' 
    },
    position: 2,
    width: 300,
    height: 200
  }
];

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Load profile from localStorage or initialize with defaults
      const savedProfile = localStorage.getItem(`bentoProfile-${user.id}`);
      
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        // Initialize with default profile if not found
        const defaultProfile: UserProfile = {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          bio: "Your bio here...",
          avatarUrl: `https://ui-avatars.com/api/?name=${user.displayName.replace(" ", "+")}&background=random`,
          widgets: defaultWidgets,
          theme: {
            background: { type: 'color', value: '#f5f7fa' },
            accentColor: '#5c6ac4'
          }
        };
        
        setProfile(defaultProfile);
        localStorage.setItem(`bentoProfile-${user.id}`, JSON.stringify(defaultProfile));
      }
    } else {
      setProfile(null);
    }
    
    setLoading(false);
  }, [user]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile || !user) return;
    
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem(`bentoProfile-${user.id}`, JSON.stringify(updatedProfile));
  };

  const addWidget = (widget: Omit<Widget, "id">) => {
    if (!profile || !user) return;
    
    const newWidget = { 
      ...widget, 
      id: uuidv4(),
      width: widget.width || 300,
      height: widget.height || 200,
      position: profile.widgets.length
    };
    
    const updatedProfile = { 
      ...profile, 
      widgets: [...profile.widgets, newWidget] 
    };
    
    setProfile(updatedProfile);
    localStorage.setItem(`bentoProfile-${user.id}`, JSON.stringify(updatedProfile));
  };

  const updateWidget = (id: string, updates: Partial<Widget>) => {
    if (!profile || !user) return;
    
    const updatedWidgets = profile.widgets.map(widget => 
      widget.id === id ? { ...widget, ...updates } : widget
    );
    
    const updatedProfile = { ...profile, widgets: updatedWidgets };
    setProfile(updatedProfile);
    localStorage.setItem(`bentoProfile-${user.id}`, JSON.stringify(updatedProfile));
  };

  const deleteWidget = (id: string) => {
    if (!profile || !user) return;
    
    const updatedWidgets = profile.widgets.filter(widget => widget.id !== id);
    const updatedProfile = { ...profile, widgets: updatedWidgets };
    
    setProfile(updatedProfile);
    localStorage.setItem(`bentoProfile-${user.id}`, JSON.stringify(updatedProfile));
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        updateProfile,
        addWidget,
        updateWidget,
        deleteWidget
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
