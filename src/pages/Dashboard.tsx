
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Widget, WidgetType } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { Edit, ExternalLink, Plus, Trash2, Eye, Instagram, Twitter, Github, Linkedin, Youtube, Facebook } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { profile, updateProfile, addWidget, updateWidget, deleteWidget } = useProfile();
  const { toast } = useToast();
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>("link");
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null);
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || "",
    bio: profile?.bio || "",
    avatarUrl: profile?.avatarUrl || "",
  });

  const [newWidgetData, setNewWidgetData] = useState({
    title: "",
    linkUrl: "",
    linkLabel: "",
    socialPlatform: "instagram",
    socialUsername: "",
    text: "",
    imageUrl: "",
    location: "",
    locationDescription: "",
  });

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Loading profile...</div>;
  }

  const handleProfileUpdate = () => {
    updateProfile({
      displayName: formData.displayName,
      bio: formData.bio,
      avatarUrl: formData.avatarUrl,
    });
    setEditingProfile(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleAddWidget = () => {
    let widget: Omit<Widget, "id">;

    switch (newWidgetType) {
      case "link":
        widget = {
          type: "link",
          title: newWidgetData.title,
          content: {
            url: newWidgetData.linkUrl,
            label: newWidgetData.linkLabel,
          },
        };
        break;
      case "social":
        widget = {
          type: "social",
          title: newWidgetData.socialPlatform,
          content: {
            platform: newWidgetData.socialPlatform,
            username: newWidgetData.socialUsername,
            url: `https://${newWidgetData.socialPlatform}.com/${newWidgetData.socialUsername}`,
          },
        };
        break;
      case "text":
        widget = {
          type: "text",
          title: newWidgetData.title,
          content: {
            text: newWidgetData.text,
          },
        };
        break;
      case "image":
        widget = {
          type: "image",
          title: newWidgetData.title,
          content: {
            images: [newWidgetData.imageUrl],
          },
        };
        break;
      case "map":
        widget = {
          type: "map",
          title: newWidgetData.location,
          content: {
            location: newWidgetData.location,
            description: newWidgetData.locationDescription,
          },
        };
        break;
      default:
        return;
    }

    addWidget(widget);
    
    // Reset form
    setNewWidgetData({
      title: "",
      linkUrl: "",
      linkLabel: "",
      socialPlatform: "instagram",
      socialUsername: "",
      text: "",
      imageUrl: "",
      location: "",
      locationDescription: "",
    });
    
    toast({
      title: "Widget added",
      description: "Your new widget has been added to your profile",
    });
  };

  const handleUpdateWidget = () => {
    if (!editingWidget) return;

    let updates: Partial<Widget> = {
      title: newWidgetData.title,
    };

    switch (editingWidget.type) {
      case "link":
        updates = {
          ...updates,
          content: {
            url: newWidgetData.linkUrl,
            label: newWidgetData.linkLabel,
          },
        };
        break;
      case "social":
        updates = {
          ...updates,
          content: {
            platform: newWidgetData.socialPlatform,
            username: newWidgetData.socialUsername,
            url: `https://${newWidgetData.socialPlatform}.com/${newWidgetData.socialUsername}`,
          },
        };
        break;
      case "text":
        updates = {
          ...updates,
          content: {
            text: newWidgetData.text,
          },
        };
        break;
      case "image":
        updates = {
          ...updates,
          content: {
            images: [newWidgetData.imageUrl],
          },
        };
        break;
      case "map":
        updates = {
          ...updates,
          content: {
            location: newWidgetData.location,
            description: newWidgetData.locationDescription,
          },
        };
        break;
    }

    updateWidget(editingWidget.id, updates);
    setEditingWidget(null);
    
    toast({
      title: "Widget updated",
      description: "Your widget has been updated successfully",
    });
  };

  const handleDeleteWidget = (id: string) => {
    deleteWidget(id);
    toast({
      title: "Widget deleted",
      description: "Your widget has been removed from your profile",
    });
  };

  const startEditingWidget = (widget: Widget) => {
    setEditingWidget(widget);
    
    switch (widget.type) {
      case "link":
        setNewWidgetData({
          ...newWidgetData,
          title: widget.title,
          linkUrl: widget.content.url,
          linkLabel: widget.content.label,
        });
        break;
      case "social":
        setNewWidgetData({
          ...newWidgetData,
          title: widget.title,
          socialPlatform: widget.content.platform,
          socialUsername: widget.content.username,
        });
        break;
      case "text":
        setNewWidgetData({
          ...newWidgetData,
          title: widget.title,
          text: widget.content.text,
        });
        break;
      case "image":
        setNewWidgetData({
          ...newWidgetData,
          title: widget.title,
          imageUrl: widget.content.images[0],
        });
        break;
      case "map":
        setNewWidgetData({
          ...newWidgetData,
          title: widget.title,
          location: widget.content.location,
          locationDescription: widget.content.description || "",
        });
        break;
    }
  };

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

  const renderWidgetPreview = (widget: Widget) => {
    switch (widget.type) {
      case "link":
        return (
          <Card key={widget.id} className="group relative">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="icon" onClick={() => startEditingWidget(widget)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDeleteWidget(widget.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 mr-2" />
                <span>{widget.content.label}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2 truncate">{widget.content.url}</p>
            </CardContent>
          </Card>
        );
      
      case "social":
        return (
          <Card key={widget.id} className="group relative">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="icon" onClick={() => startEditingWidget(widget)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDeleteWidget(widget.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {getSocialIcon(widget.content.platform)}
                <span className="ml-2">@{widget.content.username}</span>
              </div>
            </CardContent>
          </Card>
        );
      
      case "text":
        return (
          <Card key={widget.id} className="group relative">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="icon" onClick={() => startEditingWidget(widget)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDeleteWidget(widget.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{widget.content.text}</p>
            </CardContent>
          </Card>
        );
      
      case "image":
        return (
          <Card key={widget.id} className="group relative">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Button variant="outline" size="icon" onClick={() => startEditingWidget(widget)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDeleteWidget(widget.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md overflow-hidden">
                <img 
                  src={widget.content.images[0]} 
                  alt={widget.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
        );
      
      case "map":
        return (
          <Card key={widget.id} className="group relative">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="outline" size="icon" onClick={() => startEditingWidget(widget)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => handleDeleteWidget(widget.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-md p-4 text-center">
                <p>📍 {widget.content.location}</p>
                {widget.content.description && <p className="text-sm mt-2">{widget.content.description}</p>}
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
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
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your public profile information</CardDescription>
              </CardHeader>
              {!editingProfile ? (
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
                </CardContent>
              ) : (
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username}
                      disabled
                    />
                    <p className="text-xs text-gray-500">Username cannot be changed</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                </CardContent>
              )}
              <CardFooter>
                {!editingProfile ? (
                  <Button onClick={() => setEditingProfile(true)}>Edit Profile</Button>
                ) : (
                  <div className="flex gap-2 w-full">
                    <Button onClick={() => setEditingProfile(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleProfileUpdate} className="flex-1">
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>

            <div className="mt-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add New Widget
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Widget</DialogTitle>
                    <DialogDescription>
                      Choose a widget type and fill in the details.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="widget-type" className="text-right">
                        Type
                      </Label>
                      <Select
                        value={newWidgetType}
                        onValueChange={(value) => setNewWidgetType(value as WidgetType)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select widget type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="link">Link</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="map">Location</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Widget specific fields */}
                    {newWidgetType === "link" && (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            className="col-span-3"
                            value={newWidgetData.title}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, title: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="link-url" className="text-right">
                            URL
                          </Label>
                          <Input
                            id="link-url"
                            className="col-span-3"
                            placeholder="https://example.com"
                            value={newWidgetData.linkUrl}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, linkUrl: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="link-label" className="text-right">
                            Label
                          </Label>
                          <Input
                            id="link-label"
                            className="col-span-3"
                            placeholder="Visit my website"
                            value={newWidgetData.linkLabel}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, linkLabel: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {newWidgetType === "social" && (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="social-platform" className="text-right">
                            Platform
                          </Label>
                          <Select
                            value={newWidgetData.socialPlatform}
                            onValueChange={(value) => setNewWidgetData({ ...newWidgetData, socialPlatform: value })}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="twitter">Twitter</SelectItem>
                              <SelectItem value="github">GitHub</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="social-username" className="text-right">
                            Username
                          </Label>
                          <Input
                            id="social-username"
                            className="col-span-3"
                            placeholder="yourusername"
                            value={newWidgetData.socialUsername}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, socialUsername: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {newWidgetType === "text" && (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="text-title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="text-title"
                            className="col-span-3"
                            placeholder="About Me"
                            value={newWidgetData.title}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, title: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="text-content" className="text-right">
                            Text
                          </Label>
                          <Textarea
                            id="text-content"
                            className="col-span-3"
                            placeholder="Write something about yourself..."
                            value={newWidgetData.text}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, text: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {newWidgetType === "image" && (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="image-title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="image-title"
                            className="col-span-3"
                            placeholder="My Photo"
                            value={newWidgetData.title}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, title: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="image-url" className="text-right">
                            Image URL
                          </Label>
                          <Input
                            id="image-url"
                            className="col-span-3"
                            placeholder="https://example.com/image.jpg"
                            value={newWidgetData.imageUrl}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, imageUrl: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {newWidgetType === "map" && (
                      <>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="location" className="text-right">
                            Location
                          </Label>
                          <Input
                            id="location"
                            className="col-span-3"
                            placeholder="New York, USA"
                            value={newWidgetData.location}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, location: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="location-desc" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="location-desc"
                            className="col-span-3"
                            placeholder="Where I live"
                            value={newWidgetData.locationDescription}
                            onChange={(e) => setNewWidgetData({ ...newWidgetData, locationDescription: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <DialogFooter>
                    <Button onClick={handleAddWidget}>Add Widget</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {editingWidget && (
                <Dialog open={!!editingWidget} onOpenChange={(open) => !open && setEditingWidget(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Widget</DialogTitle>
                      <DialogDescription>
                        Update the details of your widget.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      {editingWidget.type === "link" && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="edit-title"
                              className="col-span-3"
                              value={newWidgetData.title}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, title: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-link-url" className="text-right">
                              URL
                            </Label>
                            <Input
                              id="edit-link-url"
                              className="col-span-3"
                              value={newWidgetData.linkUrl}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, linkUrl: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-link-label" className="text-right">
                              Label
                            </Label>
                            <Input
                              id="edit-link-label"
                              className="col-span-3"
                              value={newWidgetData.linkLabel}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, linkLabel: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      {editingWidget.type === "social" && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-social-platform" className="text-right">
                              Platform
                            </Label>
                            <Select
                              value={newWidgetData.socialPlatform}
                              onValueChange={(value) => setNewWidgetData({ ...newWidgetData, socialPlatform: value })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="github">GitHub</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="facebook">Facebook</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-social-username" className="text-right">
                              Username
                            </Label>
                            <Input
                              id="edit-social-username"
                              className="col-span-3"
                              value={newWidgetData.socialUsername}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, socialUsername: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      {editingWidget.type === "text" && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-text-title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="edit-text-title"
                              className="col-span-3"
                              value={newWidgetData.title}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, title: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-text-content" className="text-right">
                              Text
                            </Label>
                            <Textarea
                              id="edit-text-content"
                              className="col-span-3"
                              value={newWidgetData.text}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, text: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      {editingWidget.type === "image" && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-image-title" className="text-right">
                              Title
                            </Label>
                            <Input
                              id="edit-image-title"
                              className="col-span-3"
                              value={newWidgetData.title}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, title: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-image-url" className="text-right">
                              Image URL
                            </Label>
                            <Input
                              id="edit-image-url"
                              className="col-span-3"
                              value={newWidgetData.imageUrl}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, imageUrl: e.target.value })}
                            />
                          </div>
                        </>
                      )}

                      {editingWidget.type === "map" && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-location" className="text-right">
                              Location
                            </Label>
                            <Input
                              id="edit-location"
                              className="col-span-3"
                              value={newWidgetData.location}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, location: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-location-desc" className="text-right">
                              Description
                            </Label>
                            <Input
                              id="edit-location-desc"
                              className="col-span-3"
                              value={newWidgetData.locationDescription}
                              onChange={(e) => setNewWidgetData({ ...newWidgetData, locationDescription: e.target.value })}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditingWidget(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateWidget}>
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
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
                      <div className="w-24 h-24 bento-avatar mb-4">
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.widgets.map((widget) => renderWidgetPreview(widget))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="edit" className="mt-0">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="grid grid-cols-1 gap-4">
                    {profile.widgets.map((widget) => (
                      <Card key={widget.id} className="flex flex-col md:flex-row md:items-center justify-between p-4">
                        <div className="flex items-center">
                          <div className="mr-4 p-2 bg-gray-100 rounded">
                            {widget.type === "link" && <ExternalLink className="h-5 w-5" />}
                            {widget.type === "social" && getSocialIcon(widget.content.platform)}
                            {widget.type === "text" && <ExternalLink className="h-5 w-5" />}
                            {widget.type === "image" && <ExternalLink className="h-5 w-5" />}
                            {widget.type === "map" && <ExternalLink className="h-5 w-5" />}
                          </div>
                          <div>
                            <h3 className="font-medium">{widget.title}</h3>
                            <p className="text-sm text-gray-500">Type: {widget.type}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4 md:mt-0">
                          <Button variant="outline" size="sm" onClick={() => startEditingWidget(widget)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteWidget(widget.id)}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </Button>
                        </div>
                      </Card>
                    ))}
                    
                    {profile.widgets.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">You haven't added any widgets yet.</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Plus className="mr-2 h-4 w-4" /> Add Your First Widget
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            {/* Content is the same as the Add New Widget dialog */}
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
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
