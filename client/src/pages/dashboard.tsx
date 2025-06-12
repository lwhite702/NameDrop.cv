import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { AnalyticsCards } from "@/components/dashboard/analytics-cards";
import { PrepPairDiscount } from "@/components/integrations/preppair-discount";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Eye, 
  Download, 
  Globe, 
  Edit, 
  Settings,
  ExternalLink,
  Share,
  FileText,
  Wand2,
  Crown
} from "lucide-react";
import { Link } from "wouter";
import { formatNumber } from "@/lib/utils";

export default function Dashboard() {
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

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
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
            <Card className="p-8">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">No CV Found</h1>
              <p className="text-muted-foreground mb-6">
                You haven't created a CV yet. Let's get started!
              </p>
              <Button asChild>
                <Link href="/onboarding">Create Your First CV</Link>
              </Button>
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your CV performance and manage your professional presence.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              {/* Analytics Overview */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Overview
                </h2>
                
                {analyticsLoading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <Card key={i} className="p-6">
                        <div className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                          <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <AnalyticsCards analytics={analytics} />
                )}
              </div>

              {/* Profile Status */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Your CV Profile
                </h2>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{profile.name || 'Untitled CV'}</h3>
                        <p className="text-muted-foreground">{profile.slug}.namedrop.cv</p>
                        {profile.tagline && (
                          <p className="text-sm text-primary mt-1">{profile.tagline}</p>
                        )}
                      </div>
                      <Badge variant={profile.isPublished ? "default" : "secondary"}>
                        {profile.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm">
                        <Link href="/editor">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit CV
                        </Link>
                      </Button>
                      
                      <Button asChild size="sm" variant="outline" className="border-primary/20 hover:bg-primary/5">
                        <Link href="/cv-wizard">
                          <Wand2 className="h-4 w-4 mr-2" />
                          AI Suggestions
                          <Crown className="h-3 w-3 ml-1 text-primary" />
                        </Link>
                      </Button>
                      
                      {profile.isPublished && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/preview/${profile.slug}`} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Public
                          </a>
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/settings">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                
                <Card>
                  <CardContent className="p-6">
                    {analytics && (analytics.views > 0 || analytics.downloads > 0) ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 text-muted-foreground mr-3" />
                            <span className="text-sm">Profile views this month</span>
                          </div>
                          <span className="text-sm font-medium">{formatNumber(analytics.views)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div className="flex items-center">
                            <Download className="h-4 w-4 text-muted-foreground mr-3" />
                            <span className="text-sm">Resume downloads this month</span>
                          </div>
                          <span className="text-sm font-medium">{formatNumber(analytics.downloads)}</span>
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-muted-foreground mr-3" />
                            <span className="text-sm">Profile status</span>
                          </div>
                          <Badge variant={profile.isPublished ? "default" : "secondary"} className="text-xs">
                            {profile.isPublished ? 'Live' : 'Draft'}
                          </Badge>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No activity yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Publish your CV to start tracking views and engagement.
                        </p>
                        {!profile.isPublished && (
                          <Button asChild>
                            <Link href="/editor">Publish Your CV</Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/editor">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Your CV
                    </Link>
                  </Button>
                  
                  {profile.isPublished && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`/preview/${profile.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Public CV
                      </a>
                    </Button>
                  )}
                  
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                  
                  {profile.isPublished && (
                    <Button variant="outline" className="w-full justify-start">
                      <Share className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* PrepPair Discount Offer */}
              <PrepPairDiscount />

              {/* Upgrade Prompt for Free Users */}
              {!user?.isPro && (
                <Card className="coral-gradient text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Upgrade to Pro</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white/90 mb-4">
                      Unlock custom domains, advanced analytics, PDF exports, and priority support.
                    </p>
                    <div className="space-y-2">
                      <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100" asChild>
                        <Link href="/pricing">View Plans</Link>
                      </Button>
                      <p className="text-xs text-white/80 text-center">
                        Starting at $7/month
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Profile Completeness */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completeness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Basic Info</span>
                      <span className={profile.name && profile.tagline ? 'text-green-600' : 'text-muted-foreground'}>
                        {profile.name && profile.tagline ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Bio/Summary</span>
                      <span className={profile.bio ? 'text-green-600' : 'text-muted-foreground'}>
                        {profile.bio ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Skills</span>
                      <span className={profile.skills?.length ? 'text-green-600' : 'text-muted-foreground'}>
                        {profile.skills?.length ? '✓' : '○'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Work Experience</span>
                      <span className={profile.workHistory ? 'text-green-600' : 'text-muted-foreground'}>
                        {profile.workHistory ? '✓' : '○'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
