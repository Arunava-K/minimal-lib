
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Widget } from "@/types";
import { Link } from "react-router-dom";
import { Eye, MoveVertical, Settings, LogOut, ChevronDown } from "lucide-react";
import BentoGrid from "@/components/widgets/BentoGrid";
import WidgetList from "@/components/widgets/WidgetList";
import ProfileCard from "@/components/profile/ProfileCard";
import AddWidgetDialog from "@/components/dialogs/AddWidgetDialog";
import EditWidgetDialog from "@/components/dialogs/EditWidgetDialog";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import WidgetGrid from "@/components/widgets/WidgetGrid";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { profile, updateProfile, addWidget, updateWidget, deleteWidget } = useProfile();
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);
  const { toast } = useToast();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 text-center"
        >
          <div className="animate-spin h-10 w-10 border-4 border-bento-purple border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </motion.div>
      </div>
    );
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
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-bento-purple flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-xl">Bento Profile</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to={`/${profile.username}`} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
              <Eye className="h-4 w-4 mr-1" /> View Profile
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <h1 className="text-3xl font-bold">Your Bento Page</h1>
              <p className="text-gray-500 mt-1">Customize your profile with widgets and layouts</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to={`/${profile.username}`}>
                <Button variant="outline" className="flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </Link>
              <AddWidgetDialog onAddWidget={addWidget} />
            </div>
          </motion.div>

          <EditWidgetDialog
            widget={editingWidget}
            onClose={() => setEditingWidget(null)}
            onUpdateWidget={updateWidget}
          />
          
          {/* Profile Card - Floating Style */}
          <motion.div 
            className="mx-auto w-full max-w-3xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-white rounded-2xl shadow-bento overflow-hidden p-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-sm flex-shrink-0">
                  <img 
                    src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.displayName.replace(" ", "+")}&background=random`}
                    alt={profile.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                  <p className="text-gray-500">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-gray-700 mt-2 line-clamp-2">{profile.bio}</p>
                  )}
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingProfile(true)}
                    className="flex items-center gap-1"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Edit</span>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
              
              {editingProfile && (
                <div className="mt-6 border-t pt-6">
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
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Tabs defaultValue="preview" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="preview">Preview Grid</TabsTrigger>
                  <TabsTrigger value="edit">Manage Widgets</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="preview" className="mt-0">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-6">
                  <div className="flex justify-end mb-6">
                    <div className="flex items-center">
                      <MoveVertical className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-500 mr-2">Edit Mode:</span>
                      <Switch
                        checked={isDraggingEnabled}
                        onCheckedChange={setIsDraggingEnabled}
                      />
                    </div>
                  </div>
                  
                  {isDraggingEnabled ? (
                    <WidgetGrid 
                      widgets={profile.widgets} 
                      isPreview={false}
                      onEdit={setEditingWidget}
                      onDelete={deleteWidget}
                      onReorder={handleWidgetReorder}
                      onResize={handleWidgetResize}
                      isEditing={isDraggingEnabled}
                    />
                  ) : (
                    <BentoGrid 
                      widgets={profile.widgets} 
                      isPreview={false}
                      onEdit={setEditingWidget}
                      onDelete={deleteWidget}
                    />
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="edit" className="mt-0">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
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
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
