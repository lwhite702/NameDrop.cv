import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CVSuggestionWizard } from "@/components/ai/cv-suggestion-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CVWizard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">Smart CV Optimization</h1>
              <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Pro Feature
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              AI-powered insights to strengthen your professional story. Get targeted suggestions that make your experience shine.
            </p>
          </div>

          {/* Pro Upgrade Card - Show for non-Pro users */}
          <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Amplify Your Professional Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <p className="mb-4 text-muted-foreground">
                    Smart insights that strengthen your professional narrative:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      ATS-friendly optimization for better visibility
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Impact-driven language that showcases achievements
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Industry keywords that resonate with employers
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      Professional clarity that builds credibility
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Starting at $9/month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CV Suggestion Wizard */}
          <CVSuggestionWizard />
        </div>
      </div>

      <Footer />
    </div>
  );
}