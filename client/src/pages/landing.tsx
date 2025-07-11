import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Tour } from "@/components/ui/tour";
import { FeaturedPosts } from "@/components/blog/featured-posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroWithMockup } from "@/components/blocks/hero-with-mockup";
import { CVPreview } from "@/components/cv-preview";
import { NameDropSlogan } from "@/components/branding/NameDropSlogan";
import { Link } from "wouter";
import { 
  Edit, 
  Upload, 
  Palette, 
  Globe, 
  Smartphone, 
  BarChart3,
  Check,
  Eye,
  Download,
  PieChart,
  Search,
  ExternalLink,
  Share,
  FileText,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <HeroWithMockup
        title="Drop Your Name, Stand Out Your Way"
        description="Create your personal CV website with custom branding, verification badges, and professional credibility. Your story deserves more than a plain link."
        primaryCta={{
          text: "Build Your CV Site",
          href: "/api/login"
        }}
        secondaryCta={{
          text: "View Demo",
          href: "/preview/demo"
        }}
        tertiaryCta={{
          text: "Learn How",
          component: (
            <Tour 
              triggerText="Learn How" 
              triggerVariant="ghost" 
            />
          )
        }}
        className="pt-20"
      >
        <CVPreview />
      </HeroWithMockup>

      {/* Rotating Slogan Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-primary/5 border-y">
        <div className="max-w-4xl mx-auto text-center">
          <NameDropSlogan 
            variant="rotating" 
            className="text-2xl md:text-3xl font-bold text-primary"
            animationDuration={3500}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            Experience the power of professional branding with rotating messaging
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Professional Identity, Amplified</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Build credibility with verification, custom domains, and smart integrations that work for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Edit className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart CV Builder</h3>
                <p className="text-muted-foreground">Create your story with real-time editing. What you see is what your audience gets—polished and professional.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Instant Import</h3>
                <p className="text-muted-foreground">Bring your existing resume to life online. Upload once, share everywhere with confidence.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Palette className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Personal Branding</h3>
                <p className="text-muted-foreground">Express your unique style with themes that reflect who you are. Stand out authentically.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Your Name, Your Domain</h3>
                <p className="text-muted-foreground">Claim yourname.namedrop.cv and own your professional presence. Share one link that says it all.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Always Accessible</h3>
                <p className="text-muted-foreground">Your professional story looks sharp on every screen. Desktop meetings, mobile networking—you're ready.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Know Your Impact</h3>
                <p className="text-muted-foreground">See who's viewing your profile and downloading your CV. Data that helps you understand your reach.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CV Editor Demo */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Build Your Story, Your Way</h2>
            <p className="text-xl text-muted-foreground">Powerful editing that feels natural. Your professional narrative, crafted with confidence.</p>
          </div>
          
          <Card className="overflow-hidden shadow-2xl">
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Editor Panel */}
              <div className="bg-muted/50 p-6 border-r border-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">CV Editor</h3>
                  <div className="flex space-x-2">
                    <Badge variant="default">Preview</Badge>
                    <Badge variant="secondary">Settings</Badge>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <div className="w-full px-4 py-3 border border-border rounded-lg bg-background">Alex Smith</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Professional Tagline</label>
                    <div className="w-full px-4 py-3 border border-border rounded-lg bg-background">Senior Software Engineer & Tech Lead</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio</label>
                    <div className="w-full px-4 py-3 border border-border rounded-lg bg-background h-20 flex items-start">
                      <span className="text-sm text-muted-foreground">Passionate software engineer with 8+ years of experience building scalable web applications...</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge>JavaScript</Badge>
                      <Badge>React</Badge>
                      <Badge>Node.js</Badge>
                      <Badge>AWS</Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview Panel */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Live Preview</h3>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open Full Preview
                  </Button>
                </div>
                
                {/* CV Preview */}
                <Card className="p-6 shadow-sm">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold">Alex Smith</h2>
                    <p className="text-primary font-medium">Senior Software Engineer & Tech Lead</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">Passionate software engineer with 8+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud architecture.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">JavaScript</Badge>
                      <Badge variant="secondary" className="text-xs">React</Badge>
                      <Badge variant="secondary" className="text-xs">Node.js</Badge>
                      <Badge variant="secondary" className="text-xs">AWS</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section id="blog" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FeaturedPosts limit={3} showHeader={true} />
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Templates</h2>
            <p className="text-xl text-muted-foreground">Choose from our coral-themed designs that make your CV stand out.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Template 1: Classic */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-4 coral-gradient">
                <Card className="p-4 text-center bg-white/90">
                  <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-2"></div>
                  <h4 className="font-semibold text-sm">Sarah Johnson</h4>
                  <p className="text-xs text-muted-foreground">Product Designer</p>
                </Card>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Classic Coral</h3>
                <p className="text-sm text-muted-foreground mb-4">Clean and professional with coral accents. Perfect for any industry.</p>
                <Button className="w-full" variant="outline">
                  Use Template
                </Button>
              </CardContent>
            </Card>
            
            {/* Template 2: Modern */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-4 bg-gradient-to-r from-primary via-accent to-primary">
                <Card className="p-4 bg-white/90">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Mike Chen</h4>
                      <p className="text-xs text-muted-foreground">Software Engineer</p>
                    </div>
                  </div>
                </Card>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Modern Gradient</h3>
                <p className="text-sm text-muted-foreground mb-4">Contemporary design with bold coral gradients for creative professionals.</p>
                <Button className="w-full" variant="outline">
                  Use Template
                </Button>
              </CardContent>
            </Card>
            
            {/* Template 3: Minimal */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-4 border-l-4 border-primary bg-white/50">
                <div className="text-left">
                  <h4 className="font-semibold text-sm mb-1">Emma Davis</h4>
                  <p className="text-xs text-primary font-medium">Marketing Director</p>
                  <div className="mt-2 space-y-1">
                    <div className="w-full h-1 bg-muted rounded"></div>
                    <div className="w-3/4 h-1 bg-muted rounded"></div>
                    <div className="w-1/2 h-1 bg-primary rounded"></div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Minimal Coral</h3>
                <p className="text-sm text-muted-foreground mb-4">Ultra-clean layout with subtle coral highlights for executive profiles.</p>
                <Button className="w-full" variant="outline">
                  Use Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Start free, upgrade when you're ready to unlock advanced features.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-2">$0</div>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>1 Professional CV</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>namedrop.cv subdomain</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>3 Coral-themed templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Mobile responsive</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>Resume import</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full" asChild>
                <a href="/api/login">Get Started Free</a>
              </Button>
            </Card>
            
            {/* Pro Plan */}
            <Card className="coral-gradient p-8 text-white shadow-2xl relative">
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 text-white">Most Popular</Badge>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">$7<span className="text-lg font-normal">/month</span></div>
                <p className="text-white/80">Or $49/year (save 30%)</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>Custom domain connection</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>PDF export</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>Verified badge</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-white mr-3" />
                  <span>Priority support</span>
                </li>
              </ul>
              
              <Button variant="secondary" className="w-full bg-white text-primary hover:bg-gray-100" asChild>
                <a href="/api/login">Upgrade to Pro</a>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Dashboard</h2>
            <p className="text-xl text-muted-foreground">Manage your CV, track performance, and optimize your professional presence.</p>
          </div>
          
          <Card className="p-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Stats Cards */}
              <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Profile Views</h4>
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">2,847</div>
                  <p className="text-sm text-green-600">+12% this month</p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Resume Downloads</h4>
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">156</div>
                  <p className="text-sm text-green-600">+8% this month</p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Profile Completeness</h4>
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">95%</div>
                  <p className="text-sm text-muted-foreground">Almost complete!</p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">SEO Score</h4>
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">87</div>
                  <p className="text-sm text-yellow-600">Good optimization</p>
                </Card>
              </div>
              
              {/* Quick Actions */}
              <div>
                <h4 className="font-semibold mb-6">Quick Actions</h4>
                <div className="space-y-4">
                  <Button className="w-full justify-start">
                    <Edit className="h-4 w-4 mr-3" />
                    Edit Your CV
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="h-4 w-4 mr-3" />
                    View Public CV
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-3" />
                    Download PDF
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Share className="h-4 w-4 mr-3" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 coral-gradient">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Launch Your Career?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of professionals who've elevated their careers with NameDrop.cv</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100" asChild>
              <a href="/api/login">Start Building Your CV</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <a href="#demo">View Live Examples</a>
            </Button>
          </div>
          
          <p className="text-sm opacity-75">No credit card required • Free forever plan available</p>
        </div>
      </section>

      {/* Featured Blog Posts Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Latest Career Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert advice and tips to accelerate your professional growth and career development.
            </p>
          </div>
          
          <FeaturedPosts limit={3} showHeader={false} />
          
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline">
              <Link href="/blog">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
