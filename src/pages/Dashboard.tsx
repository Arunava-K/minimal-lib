
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Widget, BackgroundType } from "@/types";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import WidgetGrid from "@/components/widgets/WidgetGrid";
import WidgetList from "@/components/widgets/WidgetList";
import ProfileCard from "@/components/profile/ProfileCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileEditForm from "@/components/forms/ProfileEditForm";
import AddWidgetDialog from "@/components/dialogs/AddWidgetDialog";
import EditWidgetDialog from "@/components/dialogs/EditWidgetDialog";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { profile, updateProfile, addWidget, updateWidget, deleteWidget } = useProfile();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || "",
    bio: profile?.bio || "",
    avatarUrl: profile?.avatarUrl || "",
    backgroundColor: profile?.theme?.background?.type === 'color' ? profile.theme.background.value : "#f5f7fa",
    backgroundType: (profile?.theme?.background?.type || 'color') as BackgroundType,
    backgroundGradient: profile?.theme?.background?.type === 'gradient' ? profile.theme.background.value : "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    backgroundImage: profile?.theme?.background?.type === 'image' ? profile.theme.background.value : "",
  });

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  }

  const handleProfileUpdate = () => {
    // Set background based on type selected
    let background = { type: formData.backgroundType, value: "" };
    
    if (formData.backgroundType === 'color') {
      background.value = formData.backgroundColor;
    } else if (formData.backgroundType === 'gradient') {
      background.value = formData.backgroundGradient;
    } else if (formData.backgroundType === 'image') {
      background.value = formData.backgroundImage;
    }

    updateProfile({
      displayName: formData.displayName,
      bio: formData.bio,
      avatarUrl: formData.avatarUrl,
      theme: {
        background,
        accentColor: '#5c6ac4'
      }
    });
    
    setEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-bento-purple flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-xl">Bento Clone</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to={`/${profile.username}`} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <Eye className="h-4 w-4 mr-1" /> View Profile
            </Link>
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <ProfileCard 
              profile={profile}
              isEditing={editingProfile}
              onEdit={() => setEditingProfile(true)}
              onCancel={() => setEditingProfile(false)}
            >
              <ProfileEditForm
                formData={formData}
                setFormData={setFormData}
                onCancel={() => setEditingProfile(false)}
                onSave={handleProfileUpdate}
              />
            </ProfileCard>

            <div className="mt-8">
              <AddWidgetDialog onAddWidget={addWidget} />

              <EditWidgetDialog
                widget={editingWidget}
                onClose={() => setEditingWidget(null)}
                onUpdateWidget={updateWidget}
              />
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <Tabs defaultValue="preview">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Bento Page</h2>
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="edit">Edit Widgets</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="preview" className="mt-0">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="max-w-xl mx-auto">
                    <ProfileHeader profile={profile} />
                    
                    <WidgetGrid 
                      widgets={profile.widgets} 
                      isPreview={true}
                      onEdit={setEditingWidget}
                      onDelete={deleteWidget}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="edit" className="mt-0">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <WidgetList 
                    widgets={profile.widgets}
                    onEdit={setEditingWidget}
                    onDelete={deleteWidget}
                  />
                  
                  {profile.widgets.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">You haven't added any widgets yet.</p>
                      <AddWidgetDialog onAddWidget={addWidget} />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
