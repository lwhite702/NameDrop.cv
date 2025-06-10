import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { CVEditor } from "@/components/cv/cv-editor";
import { CVPreview } from "@/components/cv/cv-preview";
import { ThemeSelector } from "@/components/cv/theme-selector";
import { 
  Save, 
  Eye, 
  Globe, 
  Settings, 
  Palette,
  FileText
} from "lucide-react";

export default function Editor() {
  const [activeTab, setActiveTab] = useState("content");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: profile, isLoading: profileLoading, error } = useQuery({
    queryKey: ["/api/profiles/me"],
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: async (profileData: any) => {
      return apiRequest("PUT", "/api/profiles/me", profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/me"] });
      setUnsavedChanges(false);
      toast({
        title: "Changes saved",
        description: "Your CV has been updated successfully.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to save",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/profiles/me/publish");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/me"] });
      toast({
        title: "Profile published!",
        description: "Your CV is now live and can be viewed by others.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Failed to publish",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = (profileData: any) => {
    saveMutation.mutate(profileData);
  };

  const handlePublish = () => {
    if (!profile?.name || !profile?.tagline) {
      toast({
        title: "Profile incomplete",
        description: "Please add your name and tagline before publishing.",
        variant: "destructive",
      });
      return;
    }
    publishMutation.mutate();
  };

  const handleProfileChange = () => {
    setUnsavedChanges(true);
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error && error.message.includes('404')) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="p-8">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">No CV Found</h1>
              <p className="text-muted-foreground mb-6">
                You haven't created a CV yet. Let's get started!
              </p>
              <Button asChild>
                <a href="/onboarding">Create Your First CV</a>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Unable to load profile</h2>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16">
        {/* Editor Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold">CV Editor</h1>
                {unsavedChanges && (
                  <span className="text-sm text-amber-600 dark:text-amber-400">
                    • Unsaved changes
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSave(profile)}
                  disabled={saveMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saveMutation.isPending ? "Saving..." : "Save"}
                </Button>
                
                {profile.isPublished ? (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/preview/${profile.slug}`} target="_blank" rel="noopener noreferrer">
                      <Eye className="h-4 w-4 mr-2" />
                      View Live
                    </a>
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handlePublish}
                    disabled={publishMutation.isPending}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {publishMutation.isPending ? "Publishing..." : "Publish"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-200px)]">
            {/* Editor Panel */}
            <div className="flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="theme" className="flex items-center">
                    <Palette className="h-4 w-4 mr-2" />
                    Theme
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex-1 mt-4">
                  <TabsContent value="content" className="h-full">
                    <CVEditor
                      profile={profile}
                      onSave={handleSave}
                      onChange={handleProfileChange}
                    />
                  </TabsContent>
                  
                  <TabsContent value="theme" className="h-full">
                    <ThemeSelector
                      profile={profile}
                      onSave={handleSave}
                      onChange={handleProfileChange}
                    />
                  </TabsContent>
                  
                  <TabsContent value="settings" className="h-full">
                    <Card className="h-full">
                      <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Public URL</label>
                            <p className="text-muted-foreground">
                              {profile.slug}.namedrop.cv
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Status</label>
                            <p className={`text-sm ${
                              profile.isPublished ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {profile.isPublished ? 'Published' : 'Draft'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Preview Panel */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Live Preview</h3>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/preview/${profile.slug}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    Full Screen
                  </a>
                </Button>
              </div>
              
              <div className="flex-1 border border-border rounded-lg overflow-hidden">
                <CVPreview profile={profile} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
