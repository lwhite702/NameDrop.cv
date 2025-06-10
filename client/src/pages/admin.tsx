import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, formatNumber } from "@/lib/utils";
import { 
  Shield, 
  Users, 
  FileText, 
  AlertTriangle, 
  Ban, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Eye,
  Download
} from "lucide-react";

export default function Admin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect to home if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !user?.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      return;
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: !!user?.isAdmin,
    retry: false,
  });

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["/api/admin/profiles"],
    enabled: !!user?.isAdmin,
    retry: false,
  });

  const { data: reports, isLoading: reportsLoading } = useQuery({
    queryKey: ["/api/admin/reports"],
    enabled: !!user?.isAdmin,
    retry: false,
  });

  const banUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest("POST", `/api/admin/users/${userId}/ban`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "User banned",
        description: "The user has been banned successfully.",
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
        title: "Failed to ban user",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleBanUser = (userId: string) => {
    if (confirm("Are you sure you want to ban this user?")) {
      banUserMutation.mutate(userId);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="p-8">
              <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                You don't have permission to access the admin dashboard.
              </p>
              <Button asChild>
                <a href="/">Go Home</a>
              </Button>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalUsers = users?.length || 0;
  const proUsers = users?.filter((u: any) => u.isPro)?.length || 0;
  const bannedUsers = users?.filter((u: any) => u.isBanned)?.length || 0;
  const publishedProfiles = profiles?.filter((p: any) => p.isPublished)?.length || 0;
  const totalViews = profiles?.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0) || 0;
  const totalDownloads = profiles?.reduce((sum: number, p: any) => sum + (p.downloadCount || 0), 0) || 0;

  const filteredUsers = users?.filter((user: any) => 
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Shield className="h-8 w-8 mr-3" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage users, monitor content, and oversee platform health.
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">{formatNumber(totalUsers)}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pro Users</p>
                    <p className="text-3xl font-bold">{formatNumber(proUsers)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Published CVs</p>
                    <p className="text-3xl font-bold">{formatNumber(publishedProfiles)}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <p className="text-3xl font-bold">{formatNumber(totalViews)}</p>
                  </div>
                  <Eye className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="users" className="space-y-6">
            <TabsList>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <div className="flex justify-between items-center">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">User</th>
                            <th className="text-left py-2 px-4">Email</th>
                            <th className="text-left py-2 px-4">Status</th>
                            <th className="text-left py-2 px-4">Joined</th>
                            <th className="text-left py-2 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((user: any) => (
                            <tr key={user.id} className="border-b">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4">{user.email}</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  {user.isPro && (
                                    <Badge className="bg-primary text-white">Pro</Badge>
                                  )}
                                  {user.isBanned && (
                                    <Badge variant="destructive">Banned</Badge>
                                  )}
                                  {user.isAdmin && (
                                    <Badge variant="secondary">Admin</Badge>
                                  )}
                                  {!user.isPro && !user.isBanned && !user.isAdmin && (
                                    <Badge variant="outline">Free</Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-muted-foreground">
                                {formatDate(user.createdAt)}
                              </td>
                              <td className="py-3 px-4">
                                {!user.isBanned && user.id !== user?.id && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleBanUser(user.id)}
                                    disabled={banUserMutation.isPending}
                                  >
                                    <Ban className="h-4 w-4 mr-1" />
                                    Ban
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profiles Tab */}
            <TabsContent value="profiles" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {profilesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Profile</th>
                            <th className="text-left py-2 px-4">URL</th>
                            <th className="text-left py-2 px-4">Status</th>
                            <th className="text-left py-2 px-4">Views</th>
                            <th className="text-left py-2 px-4">Downloads</th>
                            <th className="text-left py-2 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profiles?.map((profile: any) => (
                            <tr key={profile.id} className="border-b">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">{profile.name || 'Untitled'}</p>
                                  <p className="text-sm text-muted-foreground">{profile.tagline}</p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <a 
                                  href={`/preview/${profile.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline"
                                >
                                  {profile.slug}.namedrop.cv
                                </a>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant={profile.isPublished ? "default" : "secondary"}>
                                  {profile.isPublished ? 'Published' : 'Draft'}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">{formatNumber(profile.viewCount || 0)}</td>
                              <td className="py-3 px-4">{formatNumber(profile.downloadCount || 0)}</td>
                              <td className="py-3 px-4">
                                <Button variant="outline" size="sm">
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Moderation Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {reportsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : reports?.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Reports</h3>
                      <p className="text-muted-foreground">No moderation reports have been submitted.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reports?.map((report: any) => (
                        <div key={report.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">Report #{report.id}</h4>
                              <p className="text-sm text-muted-foreground">
                                Reported by: {report.reportedBy}
                              </p>
                            </div>
                            <Badge 
                              variant={
                                report.status === 'pending' ? 'secondary' :
                                report.status === 'reviewed' ? 'default' : 'outline'
                              }
                            >
                              {report.status}
                            </Badge>
                          </div>
                          <p className="text-sm mb-3">{report.reason}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive">
                              <XCircle className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users:</span>
                      <span className="font-semibold">{formatNumber(totalUsers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pro Users:</span>
                      <span className="font-semibold">{formatNumber(proUsers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Free Users:</span>
                      <span className="font-semibold">{formatNumber(totalUsers - proUsers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Banned Users:</span>
                      <span className="font-semibold">{formatNumber(bannedUsers)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Content Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Profiles:</span>
                      <span className="font-semibold">{formatNumber(profiles?.length || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Published Profiles:</span>
                      <span className="font-semibold">{formatNumber(publishedProfiles)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Views:</span>
                      <span className="font-semibold">{formatNumber(totalViews)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Downloads:</span>
                      <span className="font-semibold">{formatNumber(totalDownloads)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
