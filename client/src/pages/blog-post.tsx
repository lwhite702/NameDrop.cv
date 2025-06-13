import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { CrossPromotionCTA } from "@/components/blog/cross-promotion-cta";
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2 } from "lucide-react";
import { Link } from "wouter";
import { BlogPost, RelatedArticle } from "@shared/blog-schema";

export default function BlogPostPage() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: postData, isLoading, error } = useQuery<BlogPost & { relatedPosts: RelatedArticle[] }>({
    queryKey: ["/api/blog/posts", slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/posts/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Article not found");
        }
        throw new Error("Failed to fetch article");
      }
      return response.json();
    },
    enabled: !!slug,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareArticle = async () => {
    if (navigator.share && postData) {
      try {
        await navigator.share({
          title: postData.title,
          text: postData.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-muted rounded mb-8"></div>
              <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-4 bg-muted rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Breadcrumb */}
              <div className="mb-6">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Link>
                </Button>
              </div>

              {/* Article Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{postData.category}</Badge>
                  {postData.featured && (
                    <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  {postData.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Published {formatDate(postData.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{postData.readingTime} min read</span>
                  </div>
                  <div>
                    <span>By {postData.author}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={shareArticle}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                {postData.excerpt && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {postData.excerpt}
                  </p>
                )}
              </div>

              {/* Featured Image */}
              {postData.featuredImage && (
                <div className="mb-8">
                  <img
                    src={postData.featuredImage}
                    alt={postData.title}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-12">
                <div 
                  dangerouslySetInnerHTML={{ __html: postData.content }}
                  className="
                    [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4
                    [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-8 [&>h2]:mb-4
                    [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3
                    [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:mt-6 [&>h4]:mb-3
                    [&>p]:mb-4 [&>p]:leading-relaxed
                    [&>ul]:mb-4 [&>ul]:pl-6 [&>li]:mb-2
                    [&>ol]:mb-4 [&>ol]:pl-6 [&>li]:mb-2
                    [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6
                    [&>pre]:bg-muted [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4
                    [&>code]:bg-muted [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm
                    [&>img]:rounded-lg [&>img]:my-6
                    [&>hr]:my-8 [&>hr]:border-muted
                    [&_a]:text-primary [&_a]:underline [&_a:hover]:no-underline
                    [&_strong]:font-semibold
                    [&_em]:italic
                  "
                />
              </div>

              {/* Tags */}
              {postData.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {postData.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-8" />

              {/* Cross-Promotion CTA */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Accelerate Your Career</h3>
                <CrossPromotionCTA />
              </div>

              {/* Related Articles */}
              {postData.relatedPosts && postData.relatedPosts.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {postData.relatedPosts.map((post) => (
                      <Card key={post.id} className="group hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Clock className="h-4 w-4" />
                            {post.readingTime} min read
                          </div>
                          <CardTitle className="line-clamp-2 text-lg">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                            {post.excerpt}
                          </p>
                          <Button asChild variant="ghost" size="sm" className="w-full">
                            <Link href={`/blog/${post.slug}`}>
                              Read Article
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <TableOfContents content={postData.content} />
              
              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stay Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get the latest career insights and professional development tips delivered to your inbox.
                  </p>
                  <Button asChild className="w-full">
                    <Link href="/blog">
                      View All Articles
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}