import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Clock, 
  ThumbsUp,
  Eye,
  Share,
  BookOpen
} from "lucide-react";

interface KnowledgeBaseArticle {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  viewCount: number;
  helpfulCount: number;
  createdAt: string;
  tags: string[];
}

export default function KnowledgeBaseArticle() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ["/api/knowledge-base/articles", slug],
    queryFn: () => fetch(`/api/knowledge-base/articles/${slug}`).then(res => res.json()),
    enabled: !!slug,
  });

  const helpfulMutation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/knowledge-base/articles/${article.id}/helpful`, {
        method: "POST",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12">
          <div className="max-w-4xl mx-auto text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/knowledge-base">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/knowledge-base">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Knowledge Base
              </Button>
            </Link>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-6">
              <span>By {article.author}</span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {article.viewCount} views
              </span>
              <span className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {article.helpfulCount} helpful
              </span>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="flex items-center space-x-2 mb-6">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <Separator />
          </div>

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8">
                  <div 
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
                  />
                </CardContent>
              </Card>

              {/* Article Actions */}
              <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => helpfulMutation.mutate()}
                    disabled={helpfulMutation.isPending}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {helpfulMutation.isPending ? "..." : "Helpful"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.share?.({
                        title: article.title,
                        url: window.location.href,
                      }) || navigator.clipboard.writeText(window.location.href);
                    }}
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  Was this article helpful?
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Need More Help?</h3>
                    <div className="space-y-3">
                      <Link href="/help">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Visit Help Center
                        </Button>
                      </Link>
                      <a href="mailto:support@namedrop.cv">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Contact Support
                        </Button>
                      </a>
                      <Link href="/knowledge-base">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Browse All Articles
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Quick Links</h3>
                    <div className="space-y-3">
                      <Link href="/editor">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          CV Editor
                        </Button>
                      </Link>
                      <Link href="/dashboard">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/pricing">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          Pricing
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}