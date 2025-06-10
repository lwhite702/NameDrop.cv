import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Check, Crown, Star } from "lucide-react";
import { Link } from "wouter";

export default function Pricing() {
  const { isAuthenticated, user } = useAuth();

  const features = {
    free: [
      "1 Professional CV",
      "namedrop.cv subdomain",
      "3 Coral-themed templates",
      "Mobile responsive design",
      "Resume import",
      "Basic analytics",
    ],
    pro: [
      "Everything in Free",
      "Custom domain connection",
      "Advanced analytics dashboard",
      "PDF export functionality",
      "Verified badge",
      "Priority support",
      "SEO optimization tools",
      "Custom themes (coming soon)",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start free, upgrade when you're ready to unlock advanced features and take your professional presence to the next level.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <div className="text-4xl font-bold mt-4 mb-2">$0</div>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {features.free.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  asChild
                >
                  {isAuthenticated ? (
                    <Link href="/dashboard">Go to Dashboard</Link>
                  ) : (
                    <a href="/api/login">Get Started Free</a>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-primary shadow-lg coral-gradient text-white">
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/20 text-white border-white/30">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold flex items-center justify-center">
                  <Crown className="h-6 w-6 mr-2" />
                  Pro
                </CardTitle>
                <div className="text-4xl font-bold mt-4 mb-2">
                  $7<span className="text-lg font-normal">/month</span>
                </div>
                <p className="text-white/80">Or $49/year (save 30%)</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {features.pro.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-white mr-3 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {user?.isPro ? (
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-primary hover:bg-gray-100" 
                    size="lg"
                    disabled
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-primary hover:bg-gray-100" 
                    size="lg"
                    asChild
                  >
                    {isAuthenticated ? (
                      <Link href="/subscribe">Upgrade to Pro</Link>
                    ) : (
                      <a href="/api/login">Start Pro Trial</a>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">What happens to my custom domain if I downgrade?</h3>
                  <p className="text-muted-foreground">
                    If you downgrade from Pro to Free, your custom domain will be disabled, but your CV will remain accessible via your namedrop.cv subdomain.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Is there a free trial for Pro?</h3>
                  <p className="text-muted-foreground">
                    We offer a 7-day free trial for Pro features. No credit card required - just sign up and start exploring advanced features.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How does the custom domain work?</h3>
                  <p className="text-muted-foreground">
                    Pro users can connect their own domain (like yourname.com) to their CV. We provide easy DNS setup instructions and support.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">What analytics are included?</h3>
                  <p className="text-muted-foreground">
                    Pro users get detailed insights including visitor demographics, traffic sources, engagement metrics, and download tracking.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Can I export my data?</h3>
                  <p className="text-muted-foreground">
                    Yes, both Free and Pro users can export their CV data. Pro users also get PDF export functionality for sharing offline.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16 py-16 coral-gradient rounded-2xl text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Elevate Your Career?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals who've transformed their career prospects with a stunning NameDrop.cv profile.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-gray-100"
                asChild
              >
                {isAuthenticated ? (
                  <Link href="/dashboard">Get Started Now</Link>
                ) : (
                  <a href="/api/login">Create Your CV</a>
                )}
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
                asChild
              >
                <a href="#demo">View Examples</a>
              </Button>
            </div>
            
            <p className="text-sm opacity-75 mt-6">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
