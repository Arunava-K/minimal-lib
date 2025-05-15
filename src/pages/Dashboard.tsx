
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Widget } from "@/types";
import { Link } from "react-router-dom";
import { Eye, MoveVertical } from "lucide-react";
import WidgetGrid from "@/components/widgets/WidgetGrid";
import WidgetList from "@/components/widgets/WidgetList";
import ProfileCard from "@/components/profile/ProfileCard";
import AddWidgetDialog from "@/components/dialogs/AddWidgetDialog";
import EditWidgetDialog from "@/components/dialogs/EditWidgetDialog";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { profile, updateProfile, addWidget, updateWidget, deleteWidget } = useProfile();
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);
  const { toast } = useToast();

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  }

  const handleWidgetReorder = (updatedWidgets: Widget[]) => {
    updateProfile({
      ...profile,
      widgets: updatedWidgets
    });
    
    toast({
      title: "Layout updated",
      description: "Your widget layout has been saved",
    });
  };

  const handleWidgetResize = (id: string, width: number, height: number) => {
    const updatedWidgets = profile.widgets.map(widget => 
      widget.id === id ? { ...widget, width, height } : widget
    );
    
    updateProfile({
      ...profile,
      widgets: updatedWidgets
    });
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
              onUpdate={(updatedProfile) => {
                updateProfile(updatedProfile);
                setEditingProfile(false);
              }}
            />

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
                    <div className="flex flex-col items-center mb-8">
                      <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-white">
                        <img
                          src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.displayName.replace(" ", "+")}&background=random`}
                          alt={profile.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h1 className="text-2xl font-bold mb-1">{profile.displayName}</h1>
                      <p className="text-gray-600 mb-2">@{profile.username}</p>
                      <p className="text-center max-w-md">{profile.bio}</p>
                    </div>
                    
                    <div className="flex justify-end mb-4">
                      <div className="flex items-center">
                        <MoveVertical className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm text-gray-500 mr-2">Arrange Layout:</span>
                        <Switch
                          checked={isDraggingEnabled}
                          onCheckedChange={setIsDraggingEnabled}
                        />
                      </div>
                    </div>
                    
                    <WidgetGrid 
                      widgets={profile.widgets} 
                      isPreview={true}
                      onEdit={setEditingWidget}
                      onDelete={deleteWidget}
                      onReorder={handleWidgetReorder}
                      isEditing={isDraggingEnabled}
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
