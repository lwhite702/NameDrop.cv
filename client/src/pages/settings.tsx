import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import { 
  User, 
  Crown, 
  Globe, 
  Shield, 
  CreditCard, 
  AlertTriangle,
  Settings as SettingsIcon,
  ExternalLink
} from "lucide-react";

export default function Settings() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [customDomain, setCustomDomain] = useState("");

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

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      return apiRequest("PUT", "/api/profiles/me", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles/me"] });
      toast({
        title: "Settings updated",
        description: "Your profile settings have been saved.",
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
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (profile?.customDomain) {
      setCustomDomain(profile.customDomain);
    }
  }, [profile]);

  const handleCustomDomainSave = () => {
    if (!user?.isPro) {
      toast({
        title: "Pro feature required",
        description: "Custom domains are only available for Pro users.",
        variant: "destructive",
      });
      return;
    }

    updateProfileMutation.mutate({ customDomain });
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <SettingsIcon className="h-8 w-8 mr-3" />
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account, subscription, and CV preferences.
            </p>
          </div>

          <div className="space-y-8">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input value={user?.firstName || ''} disabled />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input value={user?.lastName || ''} disabled />
                  </div>
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <p className="text-sm text-muted-foreground">
                  Account information is managed through your Replit account.
                </p>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">
                        {user?.isPro ? 'Pro Plan' : 'Free Plan'}
                      </h3>
                      <Badge variant={user?.isPro ? "default" : "secondary"}>
                        {user?.isPro ? 'Active' : 'Basic'}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {user?.isPro 
                        ? 'You have access to all Pro features including custom domains and advanced analytics.'
                        : 'Upgrade to Pro for custom domains, advanced analytics, and PDF exports.'
                      }
                    </p>
                  </div>
                </div>
                
                {user?.isPro ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Pro Features Unlocked</h4>
                      <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <li>• Custom domain connection</li>
                        <li>• Advanced analytics and insights</li>
                        <li>• PDF export functionality</li>
                        <li>• Verified badge</li>
                        <li>• Priority support</li>
                      </ul>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Billing
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                      <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Upgrade to Pro</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                        Unlock powerful features to enhance your professional presence.
                      </p>
                      <Button asChild>
                        <Link href="/pricing">
                          <Crown className="h-4 w-4 mr-2" />
                          View Pro Plans
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CV Settings */}
            {profile && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    CV Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Public URL */}
                  <div>
                    <Label>Public URL</Label>
                    <div className="mt-1">
                      <Input 
                        value={`${profile.slug}.namedrop.cv`} 
                        disabled 
                        className="bg-muted"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your CV is accessible at this URL
                    </p>
                  </div>

                  <Separator />

                  {/* Custom Domain */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Custom Domain</Label>
                      {!user?.isPro && (
                        <Badge variant="outline" className="text-xs">
                          Pro Feature
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Input
                        placeholder="yourdomain.com"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        disabled={!user?.isPro}
                      />
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          {user?.isPro 
                            ? 'Connect your own domain to your CV'
                            : 'Upgrade to Pro to use a custom domain'
                          }
                        </p>
                        {user?.isPro && (
                          <Button 
                            size="sm" 
                            onClick={handleCustomDomainSave}
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* SEO Settings */}
                  <div>
                    <Label>SEO Settings</Label>
                    <div className="mt-2 space-y-3">
                      <div>
                        <Label className="text-sm">Meta Title</Label>
                        <Input 
                          placeholder="Auto-generated from your name and tagline"
                          value={profile.seoTitle || ''}
                          disabled
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Meta Description</Label>
                        <Input 
                          placeholder="Auto-generated from your bio"
                          value={profile.seoDescription || ''}
                          disabled
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        SEO tags are automatically optimized based on your CV content
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Account Security</h4>
                    <p className="text-sm text-muted-foreground">
                      Your account is secured through Replit's authentication system.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Public Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      {profile?.isPublished 
                        ? 'Your CV is currently public and visible to anyone with the link.'
                        : 'Your CV is currently private and not accessible publicly.'
                      }
                    </p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" asChild>
                    <Link href="/privacy">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Privacy Policy
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center text-destructive">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Delete Account</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm" disabled>
                      Delete Account
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Contact support to delete your account
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
