import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Clock, 
  ThumbsUp,
  ArrowRight,
  HelpCircle,
  FileText,
  Users,
  Zap,
  Shield
} from "lucide-react";

interface KnowledgeBaseCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
}

interface KnowledgeBaseArticle {
  id: number;
  categoryId: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  viewCount: number;
  helpfulCount: number;
  createdAt: string;
  category?: KnowledgeBaseCategory;
}

export default function KnowledgeBase() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["/api/knowledge-base/categories"],
  });

  const { data: articles } = useQuery({
    queryKey: ["/api/knowledge-base/articles", selectedCategory],
    queryFn: () => {
      const url = selectedCategory 
        ? `/api/knowledge-base/articles?categoryId=${selectedCategory}`
        : "/api/knowledge-base/articles";
      return fetch(url).then(res => res.json());
    },
  });

  const filteredArticles = articles?.filter((article: KnowledgeBaseArticle) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const featuredArticles = articles?.filter((article: KnowledgeBaseArticle) => 
    article.helpfulCount > 5 || article.viewCount > 100
  )?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container text-center">
          <div className="mx-auto max-w-3xl">
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Build With Confidence</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Expert guidance for creating your professional CV website. Your success story starts here.
            </p>
            
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Articles
                  </Button>
                  {categories?.map((category: KnowledgeBaseCategory) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/help">
                    <Button variant="ghost" className="w-full justify-start">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help Center
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button variant="ghost" className="w-full justify-start">
                      <Zap className="h-4 w-4 mr-2" />
                      Pricing
                    </Button>
                  </Link>
                  <a href="mailto:support@namedrop.cv">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Articles */}
            {!searchTerm && !selectedCategory && featuredArticles.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6">Popular Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredArticles.map((article: KnowledgeBaseArticle) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-3 line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {article.helpfulCount}
                          </span>
                        </div>
                        <Link href={`/knowledge-base/${article.slug}`}>
                          <Button size="sm" className="w-full">
                            Read More
                            <ArrowRight className="h-3 w-3 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Categories Grid */}
            {!searchTerm && !selectedCategory && (
              <section>
                <h2 className="text-2xl font-semibold mb-6">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories?.map((category: KnowledgeBaseCategory) => (
                    <Card 
                      key={category.id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{category.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {category.description}
                            </p>
                            <div className="flex items-center text-sm text-primary">
                              <span>View articles</span>
                              <ArrowRight className="h-3 w-3 ml-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Articles List */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">
                  {selectedCategory 
                    ? `${categories?.find((c: KnowledgeBaseCategory) => c.id === selectedCategory)?.name} Articles`
                    : searchTerm 
                    ? `Search Results for "${searchTerm}"`
                    : "All Articles"
                  }
                </h2>
                {selectedCategory && (
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCategory(null)}
                  >
                    View All
                  </Button>
                )}
              </div>

              <div className="space-y-6">
                {filteredArticles.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No articles found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? "Try adjusting your search terms"
                          : "No articles available in this category yet"
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredArticles.map((article: KnowledgeBaseArticle) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/knowledge-base/${article.slug}`}>
                              <h3 className="text-xl font-semibold mb-3 hover:text-primary cursor-pointer">
                                {article.title}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                              <span>By {article.author}</span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(article.createdAt).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                {article.helpfulCount} helpful
                              </span>
                            </div>
                          </div>
                          <Link href={`/knowledge-base/${article.slug}`}>
                            <Button size="sm">
                              Read Article
                              <ArrowRight className="h-3 w-3 ml-2" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}