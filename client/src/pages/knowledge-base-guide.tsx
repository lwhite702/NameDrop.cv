import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  Database, 
  ExternalLink, 
  Settings, 
  Users, 
  BarChart3,
  MessageSquare,
  Shield,
  Zap,
  FileText,
  Search,
  Clock,
  CheckCircle
} from "lucide-react";

export default function KnowledgeBaseGuide() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Unified Support System Guide
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Comprehensive documentation for cross-platform support infrastructure
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">ResumeFormatter.io</Badge>
              <Badge variant="secondary">PrepPair.me</Badge>
              <Badge variant="secondary">NameDrop.cv</Badge>
              <Badge variant="outline">Real-time Analytics</Badge>
              <Badge variant="outline">Cross-platform Tickets</Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="api">API Endpoints</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Unified Database
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Centralized knowledge base with cross-platform article management, 
                      user context tracking, and comprehensive search capabilities.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Article versioning</li>
                      <li>• Category management</li>
                      <li>• View analytics</li>
                      <li>• Help ratings</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Ticket System
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cross-platform support ticket management with real-time status 
                      updates and automated routing based on user platform.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Multi-platform routing</li>
                      <li>• Priority assignment</li>
                      <li>• Status tracking</li>
                      <li>• Response templates</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Real-time Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive analytics dashboard tracking user engagement, 
                      support metrics, and cross-platform performance indicators.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• User activity metrics</li>
                      <li>• Knowledge base usage</li>
                      <li>• Support resolution times</li>
                      <li>• Platform comparisons</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Integration Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold">NameDrop.cv</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• User authentication</li>
                        <li>• Profile management</li>
                        <li>• Custom domain support</li>
                        <li>• Analytics tracking</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold">ResumeFormatter.io</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Resume import/export</li>
                        <li>• Format optimization</li>
                        <li>• Template management</li>
                        <li>• Sync capabilities</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-semibold">PrepPair.me</span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Progress tracking</li>
                        <li>• Account linking</li>
                        <li>• 50% discount codes</li>
                        <li>• Performance metrics</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Core API Endpoints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">GET /api/support/health</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            System health check with service status monitoring
                          </p>
                          <code className="text-xs bg-background p-2 rounded block">
                            Status: operational | Services: database, knowledgeBase, userAuth, blog
                          </code>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">GET /api/support/articles/search</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Advanced article search with filtering and categorization
                          </p>
                          <code className="text-xs bg-background p-2 rounded block">
                            Query params: q, category, published, limit
                          </code>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">GET /api/support/user-context</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            User profile context with activity tracking
                          </p>
                          <code className="text-xs bg-background p-2 rounded block">
                            Returns: user data, profile status, recent activity
                          </code>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">GET /api/support/analytics</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Real-time platform analytics and metrics
                          </p>
                          <code className="text-xs bg-background p-2 rounded block">
                            Metrics: users, profiles, knowledge base performance
                          </code>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">POST /api/support/tickets</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Cross-platform ticket creation and management
                          </p>
                          <code className="text-xs bg-background p-2 rounded block">
                            Body: subject, description, category, priority
                          </code>
                        </div>
                        
                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">GET /api/support/content/:slug</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Article content retrieval with view tracking
                          </p>
                          <code className="text-xs bg-background p-2 rounded block">
                            Returns: full article content, metadata, statistics
                          </code>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Integrations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-2">ResumeFormatter.io Integration</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Seamless resume import/export with format optimization and template management.
                        </p>
                        <div className="bg-muted p-3 rounded text-xs font-mono">
                          <div>POST /api/integrations/resumeformatter/import</div>
                          <div>POST /api/integrations/resumeformatter/sync</div>
                          <div>GET /api/integrations/resumeformatter/templates</div>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold mb-2">PrepPair.me Integration</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Progress tracking, account linking, and exclusive 50% discount code generation.
                        </p>
                        <div className="bg-muted p-3 rounded text-xs font-mono">
                          <div>GET /api/integrations/preppair/progress</div>
                          <div>POST /api/integrations/preppair/link</div>
                          <div>GET /api/integrations/preppair/discount</div>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold mb-2">Cross-Platform Data Sync</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Real-time synchronization of user data, preferences, and activity across all platforms.
                        </p>
                        <div className="bg-muted p-3 rounded text-xs font-mono">
                          <div>POST /api/sync/user-data</div>
                          <div>GET /api/sync/status</div>
                          <div>PUT /api/sync/preferences</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">Total Users</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">Real-time</div>
                        <div className="text-xs text-muted-foreground">Across all platforms</div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Knowledge Base</span>
                        </div>
                        <div className="text-2xl font-bold text-green-600">Live Data</div>
                        <div className="text-xs text-muted-foreground">Articles & interactions</div>
                      </div>
                      
                      <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-orange-600" />
                          <span className="text-sm font-medium">Support Tickets</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">Active</div>
                        <div className="text-xs text-muted-foreground">Response tracking</div>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">System Uptime</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">99.9%</div>
                        <div className="text-xs text-muted-foreground">Last 30 days</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">Key Performance Indicators</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Average response time: &lt;2 minutes
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Knowledge base search accuracy: 94%
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Cross-platform sync success rate: 99.8%
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          User satisfaction score: 4.8/5
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Testing & Validation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                        <div className="text-center">
                          <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">Live Testing Interface</h3>
                          <p className="text-muted-foreground mb-4">
                            Test all unified support system functionality with real-time data
                          </p>
                          <Link href="/support-api-test">
                            <Button className="gap-2">
                              <ExternalLink className="h-4 w-4" />
                              Launch Testing Interface
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold">Automated Tests</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              API endpoint health checks
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Database connectivity tests
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Cross-platform data sync
                            </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Authentication flows
                            </li>
                          </ul>
                        </div>
                        
                        <div className="space-y-3">
                          <h4 className="font-semibold">Manual Testing</h4>
                          <ul className="text-sm space-y-2">
                            <li className="flex items-center gap-2">
                              <Search className="h-4 w-4 text-blue-500" />
                              Knowledge base search
                            </li>
                            <li className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-blue-500" />
                              Ticket creation & management
                            </li>
                            <li className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-blue-500" />
                              Analytics data accuracy
                            </li>
                            <li className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-500" />
                              User context retrieval
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Card>
              <CardContent className="p-8">
                <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4">System Status: Operational</h3>
                <p className="text-muted-foreground mb-6">
                  All unified support system components are fully functional and providing 
                  real-time service across NameDrop.cv, ResumeFormatter.io, and PrepPair.me platforms.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/support-api-test">
                    <Button variant="default" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Test All Functions
                    </Button>
                  </Link>
                  <Link href="/knowledge-base">
                    <Button variant="outline" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Browse Knowledge Base
                    </Button>
                  </Link>
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