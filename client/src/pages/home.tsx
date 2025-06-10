import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Plus, 
  Edit, 
  Eye, 
  Settings, 
  TrendingUp,
  FileText,
  Globe
} from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

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

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profiles/me"],
    retry: false,
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/me"],
    retry: false,
  });

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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4">Welcome to NameDrop.cv!</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Let's create your professional CV website in just a few minutes.
              </p>
            </div>
            
            <Card className="p-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-primary mr-3" />
                  Create Your First CV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Start by importing your existing resume or building from scratch with our guided editor.
                </p>
                <div className="space-y-4">
                  <Button size="lg" className="w-full" onClick={() => setLocation("/onboarding")}>
                    <Plus className="h-5 w-5 mr-2" />
                    Get Started
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={() => setLocation("/editor")}>
                    <Edit className="h-5 w-5 mr-2" />
                    Start from Scratch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || 'there'}!
            </h1>
            <p className="text-muted-foreground">
              Manage your professional CV and track your career progress.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Your CV Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{profile.name || 'Untitled CV'}</h3>
                      <p className="text-muted-foreground">{profile.slug}.namedrop.cv</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        profile.isPublished 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {profile.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={() => setLocation("/editor")}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit CV
                    </Button>
                    {profile.isPublished && (
                      <Button variant="outline" asChild>
                        <a href={`/preview/${profile.slug}`} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Public
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setLocation("/settings")}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics */}
              {analytics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{analytics.views}</div>
                        <p className="text-sm text-muted-foreground">Profile Views</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{analytics.downloads}</div>
                        <p className="text-sm text-muted-foreground">Resume Downloads</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => setLocation("/editor")}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Your CV
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLocation("/dashboard")}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start" onClick={() => setLocation("/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Upgrade Prompt */}
              {!user?.isPro && (
                <Card className="coral-gradient text-white">
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/90 mb-4">
                      Unlock custom domains, advanced analytics, and PDF exports.
                    </p>
                    <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100" onClick={() => setLocation("/pricing")}>
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
