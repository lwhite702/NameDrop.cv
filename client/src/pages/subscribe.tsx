import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Check, Crown, CreditCard, Shield, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/dashboard",
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to Pro!",
        description: "Your subscription is active. Enjoy your Pro features!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement />
      </div>
      
      <Button type="submit" disabled={!stripe} className="w-full" size="lg">
        <CreditCard className="h-4 w-4 mr-2" />
        Subscribe to Pro
      </Button>
      
      <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Secured by Stripe • Cancel anytime</span>
      </div>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
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

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;

    // Create subscription intent as soon as the page loads
    apiRequest("POST", "/api/create-subscription", { billingPeriod })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
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
          title: "Setup Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive",
        });
      });
  }, [isAuthenticated, authLoading, billingPeriod, toast]);

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

  if (user?.isPro) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">You're Already Pro!</h1>
              <p className="text-muted-foreground mb-6">
                You already have an active Pro subscription. Enjoy all the premium features!
              </p>
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Setting up your subscription...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const proFeatures = [
    "Custom domain connection",
    "Advanced analytics dashboard",
    "PDF export functionality", 
    "Verified badge",
    "Priority support",
    "SEO optimization tools",
    "Remove NameDrop branding",
    "Custom themes (coming soon)"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button variant="outline" size="sm" className="mb-4" asChild>
              <Link href="/pricing">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pricing
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center">
              <Crown className="h-8 w-8 mr-3 text-primary" />
              Upgrade to Pro
            </h1>
            <p className="text-muted-foreground">
              Unlock advanced features and take your professional presence to the next level.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pro Plan Features</span>
                  <Badge className="coral-gradient text-white">
                    Popular Choice
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Billing Toggle */}
                <div className="flex items-center justify-center space-x-4 p-4 bg-muted rounded-lg">
                  <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      billingPeriod === 'monthly'
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      billingPeriod === 'yearly'
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Yearly
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Save 30%
                    </Badge>
                  </button>
                </div>

                {/* Pricing */}
                <div className="text-center py-4">
                  <div className="text-4xl font-bold">
                    ${billingPeriod === 'monthly' ? '7' : '49'}
                    <span className="text-lg font-normal text-muted-foreground">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingPeriod === 'yearly' && (
                    <p className="text-sm text-green-600 mt-1">
                      Save $35 compared to monthly billing
                    </p>
                  )}
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold mb-3">What you'll get:</h3>
                  <ul className="space-y-2">
                    {proFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Guarantee */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <h4 className="font-medium text-green-800 dark:text-green-200">
                        30-Day Money-Back Guarantee
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Not satisfied? Get a full refund within 30 days.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <SubscribeForm />
                </Elements>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium mb-2">Subscription Details</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Billing starts immediately after confirmation</p>
                    <p>• Cancel anytime from your account settings</p>
                    <p>• Automatic renewal unless cancelled</p>
                    <p>• All features activate instantly</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Stripe Payments</span>
              </div>
              <div className="flex items-center">
                <Check className="h-4 w-4 mr-2" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
