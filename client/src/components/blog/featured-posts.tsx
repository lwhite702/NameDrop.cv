import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Calendar } from "lucide-react";
import { Link } from "wouter";
import { BlogPost } from "@shared/blog-schema";
// Remove date-fns import since it's not available

interface FeaturedPostsProps {
  limit?: number;
  showHeader?: boolean;
}

export function FeaturedPosts({ limit = 3, showHeader = true }: FeaturedPostsProps) {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/featured", limit],
    queryFn: async () => {
      const response = await fetch(`/api/blog/featured?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch featured posts");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        {showHeader && (
          <div className="text-center">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-2"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse"></div>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showHeader && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Latest Insights</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert guidance and industry insights to accelerate your career growth
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            {post.featuredImage && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {post.category}
                  </Badge>
                </div>
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readingTime} min read
                </div>
              </div>
              <CardTitle className="line-clamp-2 leading-tight">
                {post.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  By {post.author}
                </span>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showHeader && (
        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}