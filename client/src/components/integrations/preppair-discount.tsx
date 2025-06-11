import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Gift, Clock, CheckCircle, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DiscountOffer {
  code: string;
  discount: number;
  durationMonths: number;
  expiresAt: string;
  claimUrl: string;
}

export function PrepPairDiscount() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { data: discountOffer, isLoading } = useQuery({
    queryKey: ['/api/integrations/preppair/discount'],
    queryFn: async (): Promise<DiscountOffer> => {
      const response = await fetch('/api/integrations/preppair/discount');
      if (!response.ok) throw new Error('Failed to fetch discount offer');
      return response.json();
    }
  });

  const copyDiscountCode = async () => {
    if (!discountOffer) return;
    
    try {
      await navigator.clipboard.writeText(discountOffer.code);
      setCopied(true);
      toast({
        title: "Code Copied",
        description: "Discount code copied to clipboard"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the code",
        variant: "destructive"
      });
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!discountOffer) return null;

  return (
    <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-green-600" />
            <CardTitle className="text-green-700 dark:text-green-300">
              Exclusive PrepPair.me Offer
            </CardTitle>
          </div>
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Limited Time
          </Badge>
        </div>
        <CardDescription className="text-green-600 dark:text-green-400">
          Get {discountOffer.discount}% off your first {discountOffer.durationMonths} months of interview preparation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Discount Highlight */}
        <div className="text-center p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {discountOffer.discount}% OFF
          </div>
          <div className="text-sm text-muted-foreground">
            First {discountOffer.durationMonths} months
          </div>
        </div>

        <Separator />

        {/* What's Included */}
        <div className="space-y-3">
          <h4 className="font-medium text-green-700 dark:text-green-300">
            What's included with PrepPair.me:
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              AI-powered mock interviews
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Industry-specific question banks
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Real-time feedback and scoring
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Behavioral interview training
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Technical interview practice
            </li>
          </ul>
        </div>

        <Separator />

        {/* Discount Code */}
        <div className="space-y-3">
          <h4 className="font-medium text-green-700 dark:text-green-300">
            Your Exclusive Discount Code:
          </h4>
          <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border">
            <code className="flex-1 font-mono text-lg font-bold text-center">
              {discountOffer.code}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyDiscountCode}
              className="flex items-center gap-1"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* Expiry Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Expires on {formatExpiryDate(discountOffer.expiresAt)}
        </div>

        {/* CTA Button */}
        <Button
          asChild
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          size="lg"
        >
          <a href={discountOffer.claimUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Claim Your 50% Discount
          </a>
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By clicking above, you'll be redirected to PrepPair.me to create your account with the discount automatically applied.
        </p>
      </CardContent>
    </Card>
  );
}