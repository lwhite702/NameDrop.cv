import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BlogSearch } from "@/components/blog/blog-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Calendar, Search, ArrowRight, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { BlogPost, BlogCategory } from "@shared/blog-schema";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      
      const response = await fetch(`/api/blog/posts?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
  });

  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ["/api/blog/categories"],
    queryFn: async () => {
      const response = await fetch("/api/blog/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Insights & Tips</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Expert guidance from Wrelik Brands to accelerate your professional growth and career success
            </p>
          </div>

          {/* Enhanced Search Component */}
          <BlogSearch
            posts={posts}
            categories={categories}
            onFilter={handleFilter}
            onCategoryChange={handleCategoryChange}
            selectedCategory={selectedCategory}
          />

          {/* Blog Posts Grid */}
          {postsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your criteria.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
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
                      {post.featured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-primary text-primary-foreground">
                            Featured
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.publishedAt)}
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

                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

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
          )}

          {/* Load More Button (for pagination in future) */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <p className="text-muted-foreground">
                Showing {filteredPosts.length} of {posts.length} articles
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}