import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, TrendingUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface AIOptimizationProps {
  profile: any;
  onSave: (profileData: any) => void;
  onChange: () => void;
}

interface OptimizationResult {
  optimizedContent: string;
  suggestions: string[];
  improvements: string[];
  score: number;
}

export function AIOptimization({ profile, onSave, onChange }: AIOptimizationProps) {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const optimizeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileData: profile })
      });
      return response.json();
    },
    onSuccess: (data) => {
      setOptimizationResult(data);
      toast({
        title: "AI Optimization Complete",
        description: `Your CV has been analyzed with a score of ${data.score}/100`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Optimization Failed",
        description: error.message || "Failed to optimize your CV",
        variant: "destructive"
      });
    }
  });

  const applyOptimizationMutation = useMutation({
    mutationFn: async (updates: any) => {
      const response = await fetch(`/api/profiles/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      return response.json();
    },
    onSuccess: (updatedProfile) => {
      onSave(updatedProfile);
      onChange();
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      toast({
        title: "Profile Updated",
        description: "AI optimizations have been applied to your profile"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to apply optimizations",
        variant: "destructive"
      });
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const applyOptimizations = () => {
    if (!optimizationResult) return;
    
    const [optimizedBio, optimizedTagline] = optimizationResult.optimizedContent.split('\n\n');
    
    applyOptimizationMutation.mutate({
      bio: optimizedBio || profile.bio,
      tagline: optimizedTagline || profile.tagline,
      aiOptimizationScore: optimizationResult.score,
      lastAiOptimization: new Date().toISOString(),
      aiSuggestions: optimizationResult.suggestions
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Powered CV Optimization
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Pro Feature
            </Badge>
          </CardTitle>
          <CardDescription>
            Get AI-powered suggestions to improve your CV's professional impact and visibility.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => optimizeMutation.mutate()}
            disabled={optimizeMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {optimizeMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Your CV...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Optimize My CV with AI
              </>
            )}
          </Button>

          {optimizationResult && (
            <div className="space-y-4 mt-6">
              <Separator />
              
              {/* Score Display */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Professional Impact Score</h4>
                    <p className="text-sm text-muted-foreground">
                      {getScoreText(optimizationResult.score)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-12 h-12 rounded-full ${getScoreColor(optimizationResult.score)} flex items-center justify-center text-white font-bold`}>
                    {optimizationResult.score}
                  </div>
                </div>
              </div>

              {/* Improvements */}
              {optimizationResult.improvements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Key Improvements Made
                  </h4>
                  <ul className="space-y-1">
                    {optimizationResult.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {optimizationResult.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    Additional Recommendations
                  </h4>
                  <ul className="space-y-1">
                    {optimizationResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={applyOptimizations}
                disabled={applyOptimizationMutation.isPending}
                className="w-full"
                variant="default"
              >
                {applyOptimizationMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Applying Optimizations...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply AI Optimizations
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}