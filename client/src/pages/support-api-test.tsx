import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Heart, 
  Eye, 
  Clock, 
  Users, 
  FileText, 
  Activity,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Send
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface SupportArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: number;
  tags: string[];
  helpfulCount: number;
  viewCount: number;
  publishedAt: string;
  updatedAt: string;
}

interface HealthStatus {
  status: string;
  timestamp: string;
  services: {
    database: string;
    knowledgeBase: string;
    userAuth: string;
    blog: string;
  };
  uptime: number;
  version: string;
}

interface UserContext {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isPro: boolean;
    createdAt: string;
  };
  profile: {
    id: number;
    slug: string;
    isPublished: boolean;
    viewCount: number;
    downloadCount: number;
  } | null;
  recentActivity: {
    lastLogin: string;
    profileViews: number;
    downloadsCount: number;
  };
}

interface Analytics {
  users: {
    total: number;
    pro: number;
    free: number;
    recentSignups: number;
  };
  profiles: {
    total: number;
    published: number;
    totalViews: number;
    totalDownloads: number;
  };
  knowledgeBase: {
    totalArticles: number;
    publishedArticles: number;
    totalViews: number;
    totalHelpful: number;
  };
  timestamp: string;
}

export default function SupportAPITest() {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketCategory, setTicketCategory] = useState("general");
  const [ticketPriority, setTicketPriority] = useState("medium");

  // Health Check Query
  const { data: healthData, isLoading: healthLoading, refetch: refetchHealth } = useQuery<HealthStatus>({
    queryKey: ["/api/support/health"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Articles Search Query
  const { data: articlesData, isLoading: articlesLoading, refetch: refetchArticles } = useQuery({
    queryKey: ["/api/support/articles/search", searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
      params.append("limit", "20");
      
      const response = await fetch(`/api/support/articles/search?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to search articles");
      return response.json();
    },
    enabled: true,
  });

  // User Context Query (only for authenticated users)
  const { data: userContext, isLoading: contextLoading } = useQuery<UserContext>({
    queryKey: ["/api/support/user-context"],
    enabled: isAuthenticated,
  });

  // Analytics Query (admin only)
  const { data: analytics, isLoading: analyticsLoading } = useQuery<Analytics>({
    queryKey: ["/api/support/analytics"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Ticket Creation Mutation
  const createTicketMutation = useMutation({
    mutationFn: async (ticketData: any) => {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        body: JSON.stringify(ticketData),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to create ticket");
      return response.json();
    },
    onSuccess: () => {
      setTicketSubject("");
      setTicketDescription("");
      setTicketCategory("general");
      setTicketPriority("medium");
    },
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;
    
    createTicketMutation.mutate({
      subject: ticketSubject,
      description: ticketDescription,
      category: ticketCategory,
      priority: ticketPriority,
    });
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Knowledge Base & Support API Test
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive testing interface for the Wrelik.com unified support desk integration
            </p>
          </div>

          <Tabs defaultValue="health" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="health">Health Check</TabsTrigger>
              <TabsTrigger value="search">Article Search</TabsTrigger>
              <TabsTrigger value="context">User Context</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
            </TabsList>

            {/* Health Check Tab */}
            <TabsContent value="health">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    System Health Status
                  </CardTitle>
                  <Button onClick={() => refetchHealth()} size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  {healthLoading ? (
                    <div className="text-center py-8">Loading health data...</div>
                  ) : healthData ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2">
                        {healthData.status === 'healthy' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-semibold capitalize">{healthData.status}</span>
                        <Badge variant={healthData.status === 'healthy' ? 'default' : 'destructive'}>
                          {healthData.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(healthData.services).map(([service, status]) => (
                          <div key={service} className="text-center p-4 border rounded-lg">
                            <div className="font-medium capitalize">{service}</div>
                            <Badge 
                              variant={status === 'operational' ? 'default' : 'destructive'}
                              className="mt-2"
                            >
                              {status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{formatUptime(healthData.uptime)}</div>
                          <div className="text-sm text-muted-foreground">Uptime</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{healthData.version}</div>
                          <div className="text-sm text-muted-foreground">Version</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {new Date(healthData.timestamp).toLocaleTimeString()}
                          </div>
                          <div className="text-sm text-muted-foreground">Last Check</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Failed to load health data
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Article Search Tab */}
            <TabsContent value="search">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Knowledge Base Search
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1">
                        <Input
                          placeholder="Search articles..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="1">Getting Started</SelectItem>
                          <SelectItem value="2">Account Management</SelectItem>
                          <SelectItem value="3">Technical Issues</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {articlesLoading ? (
                      <div className="text-center py-8">Searching articles...</div>
                    ) : articlesData ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Found {articlesData.total} articles
                          </span>
                          {articlesData.query && (
                            <Badge variant="outline">Query: {articlesData.query}</Badge>
                          )}
                        </div>
                        
                        <div className="grid gap-4">
                          {articlesData.articles?.map((article: SupportArticle) => (
                            <Card key={article.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="pt-6">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold">{article.title}</h3>
                                  <Badge variant="outline">#{article.category}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {article.excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {article.viewCount} views
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Heart className="h-3 w-3" />
                                    {article.helpfulCount} helpful
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(article.publishedAt).toLocaleDateString()}
                                  </span>
                                </div>
                                {article.tags && article.tags.length > 0 && (
                                  <div className="flex gap-1 mt-3">
                                    {article.tags.map((tag, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No articles found
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* User Context Tab */}
            <TabsContent value="context">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Context Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isAuthenticated ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Please log in to view user context data
                      </p>
                      <Button onClick={() => window.location.href = '/api/login'}>
                        Log In
                      </Button>
                    </div>
                  ) : contextLoading ? (
                    <div className="text-center py-8">Loading user context...</div>
                  ) : userContext ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">User Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Name</label>
                            <div className="text-sm text-muted-foreground">
                              {userContext.user.firstName} {userContext.user.lastName}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Email</label>
                            <div className="text-sm text-muted-foreground">
                              {userContext.user.email}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Account Type</label>
                            <Badge variant={userContext.user.isPro ? "default" : "secondary"}>
                              {userContext.user.isPro ? "Pro" : "Free"}
                            </Badge>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Member Since</label>
                            <div className="text-sm text-muted-foreground">
                              {new Date(userContext.user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="font-semibold mb-3">Profile Information</h3>
                        {userContext.profile ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                              <div className="text-2xl font-bold">{userContext.profile.viewCount}</div>
                              <div className="text-sm text-muted-foreground">Profile Views</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <div className="text-2xl font-bold">{userContext.profile.downloadCount}</div>
                              <div className="text-sm text-muted-foreground">Downloads</div>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                              <Badge variant={userContext.profile.isPublished ? "default" : "secondary"}>
                                {userContext.profile.isPublished ? "Published" : "Draft"}
                              </Badge>
                              <div className="text-sm text-muted-foreground mt-2">Status</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            No profile created yet
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Failed to load user context
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Platform Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isAuthenticated ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Analytics requires admin authentication
                      </p>
                    </div>
                  ) : analyticsLoading ? (
                    <div className="text-center py-8">Loading analytics...</div>
                  ) : analytics ? (
                    <div className="space-y-8">
                      <div>
                        <h3 className="font-semibold mb-4">User Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.users.total}</div>
                            <div className="text-sm text-muted-foreground">Total Users</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.users.pro}</div>
                            <div className="text-sm text-muted-foreground">Pro Users</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.users.free}</div>
                            <div className="text-sm text-muted-foreground">Free Users</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.users.recentSignups}</div>
                            <div className="text-sm text-muted-foreground">This Week</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-4">Profile Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.profiles.total}</div>
                            <div className="text-sm text-muted-foreground">Total Profiles</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.profiles.published}</div>
                            <div className="text-sm text-muted-foreground">Published</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.profiles.totalViews}</div>
                            <div className="text-sm text-muted-foreground">Total Views</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.profiles.totalDownloads}</div>
                            <div className="text-sm text-muted-foreground">Downloads</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-4">Knowledge Base Statistics</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.knowledgeBase.totalArticles}</div>
                            <div className="text-sm text-muted-foreground">Total Articles</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.knowledgeBase.publishedArticles}</div>
                            <div className="text-sm text-muted-foreground">Published</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.knowledgeBase.totalViews}</div>
                            <div className="text-sm text-muted-foreground">Article Views</div>
                          </div>
                          <div className="text-center p-4 border rounded-lg">
                            <div className="text-2xl font-bold">{analytics.knowledgeBase.totalHelpful}</div>
                            <div className="text-sm text-muted-foreground">Helpful Votes</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center text-xs text-muted-foreground">
                        Last updated: {new Date(analytics.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No analytics data available or insufficient permissions
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tickets Tab */}
            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Support Ticket Creation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isAuthenticated ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Please log in to create support tickets
                      </p>
                      <Button onClick={() => window.location.href = '/api/login'}>
                        Log In
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleTicketSubmit} className="space-y-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Subject</label>
                        <Input
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={ticketDescription}
                          onChange={(e) => setTicketDescription(e.target.value)}
                          placeholder="Please provide detailed information about your issue..."
                          rows={5}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Category</label>
                          <Select value={ticketCategory} onValueChange={setTicketCategory}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Support</SelectItem>
                              <SelectItem value="technical">Technical Issue</SelectItem>
                              <SelectItem value="billing">Billing Question</SelectItem>
                              <SelectItem value="feature">Feature Request</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Priority</label>
                          <Select value={ticketPriority} onValueChange={setTicketPriority}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={createTicketMutation.isPending || !ticketSubject || !ticketDescription}
                        className="w-full"
                      >
                        {createTicketMutation.isPending ? "Creating Ticket..." : "Create Support Ticket"}
                      </Button>
                      
                      {createTicketMutation.isSuccess && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 text-green-800">
                            <CheckCircle className="h-4 w-4" />
                            <span className="font-medium">Ticket created successfully!</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            Your support ticket has been submitted and you'll receive a response soon.
                          </p>
                        </div>
                      )}
                      
                      {createTicketMutation.isError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-800">
                            <AlertCircle className="h-4 w-4" />
                            <span className="font-medium">Failed to create ticket</span>
                          </div>
                          <p className="text-sm text-red-700 mt-1">
                            Please try again or contact support directly.
                          </p>
                        </div>
                      )}
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}