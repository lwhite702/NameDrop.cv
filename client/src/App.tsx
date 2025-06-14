import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Onboarding from "@/pages/onboarding";
import Editor from "@/pages/editor";
import Dashboard from "@/pages/dashboard";
import Settings from "@/pages/settings";
import Pricing from "@/pages/pricing";
import Subscribe from "@/pages/subscribe";
import Preview from "@/pages/preview";
import Admin from "@/pages/admin";
import Terms from "@/pages/legal/terms";
import Privacy from "@/pages/legal/privacy";
import CookiePolicy from "@/pages/legal/cookie-policy";
import Help from "@/pages/help";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import CVWizard from "@/pages/cv-wizard";
import KnowledgeBase from "@/pages/knowledge-base";
import KnowledgeBaseArticle from "@/pages/knowledge-base-article";
import KnowledgeBaseGuide from "@/pages/knowledge-base-guide";
import SupportAPITest from "@/pages/support-api-test";
import SloganDemo from "@/pages/slogan-demo";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/preview/:slug" component={Preview} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/help" component={Help} />
          <Route path="/knowledge-base-guide" component={KnowledgeBaseGuide} />
          <Route path="/support-api-test" component={SupportAPITest} />
          <Route path="/slogan-demo" component={SloganDemo} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/cookie-policy" component={CookiePolicy} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/editor" component={Editor} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/settings" component={Settings} />
          <Route path="/cv-wizard" component={CVWizard} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/subscribe" component={Subscribe} />
          <Route path="/preview/:slug" component={Preview} />
          <Route path="/admin" component={Admin} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/help" component={Help} />
          <Route path="/knowledge-base" component={KnowledgeBase} />
          <Route path="/knowledge-base/:slug" component={KnowledgeBaseArticle} />
          <Route path="/knowledge-base-guide" component={KnowledgeBaseGuide} />
          <Route path="/support-api-test" component={SupportAPITest} />
          <Route path="/slogan-demo" component={SloganDemo} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/cookie-policy" component={CookiePolicy} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="namedrop-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
