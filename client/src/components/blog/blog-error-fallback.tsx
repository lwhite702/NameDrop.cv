import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface BlogErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
}

export function BlogErrorFallback({ error, onRetry }: BlogErrorFallbackProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <CardTitle>Unable to Load Content</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          {error || "We're experiencing technical difficulties loading the blog content. This may be due to temporary connectivity issues with our content management system."}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
        <p className="text-xs text-muted-foreground">
          If the problem persists, please check back later.
        </p>
      </CardContent>
    </Card>
  );
}