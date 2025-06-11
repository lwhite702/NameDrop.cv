import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Calendar, User, Search, ChevronRight, ArrowLeft } from 'lucide-react';
import { BlogPost, BlogCategory, TableOfContentsItem, RelatedArticle } from '@shared/blog-schema';
import { SEOHead } from '@/components/seo/seo-head';

interface BlogLayoutProps {
  posts?: BlogPost[];
  currentPost?: BlogPost;
  categories?: BlogCategory[];
  relatedArticles?: RelatedArticle[];
  tableOfContents?: TableOfContentsItem[];
  onPostSelect?: (slug: string) => void;
  onCategorySelect?: (slug: string) => void;
  onSearch?: (query: string) => void;
  loading?: boolean;
}

export function BlogLayout({ 
  posts = [], 
  currentPost,
  categories = [],
  relatedArticles = [],
  tableOfContents = [],
  onPostSelect,
  onCategorySelect,
  onSearch,
  loading = false
}: BlogLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    if (currentPost && tableOfContents.length > 0) {
      const handleScroll = () => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let current = '';
        
        headings.forEach((heading) => {
          const rect = heading.getBoundingClientRect();
          if (rect.top <= 100) {
            current = heading.id;
          }
        });
        
        setActiveSection(current);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [currentPost, tableOfContents]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Blog Post View
  if (currentPost) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead
          title={currentPost.seoTitle || `${currentPost.title} | NameDrop.cv Blog`}
          description={currentPost.seoDescription || currentPost.excerpt}
          canonical={`https://namedrop.cv/blog/${currentPost.slug}`}
          ogImage={currentPost.featuredImage}
          author={currentPost.author}
          structuredData={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": currentPost.title,
            "description": currentPost.excerpt,
            "author": {
              "@type": "Person",
              "name": currentPost.author
            },
            "datePublished": currentPost.publishedAt,
            "dateModified": currentPost.updatedAt
          }}
        />
        
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => onPostSelect && onPostSelect('')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border p-8">
                {/* Article Header */}
                <header className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{currentPost.category}</Badge>
                    {currentPost.featured && (
                      <Badge className="bg-purple-100 text-purple-700">Featured</Badge>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                    {currentPost.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {currentPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(currentPost.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {currentPost.readingTime} min read
                    </div>
                  </div>
                  
                  {currentPost.featuredImage && (
                    <img 
                      src={currentPost.featuredImage} 
                      alt={currentPost.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                </header>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: currentPost.content }}
                />

                {/* Tags */}
                {currentPost.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-sm font-medium mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentPost.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <nav className="space-y-1">
                        {tableOfContents.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`block w-full text-left text-sm px-3 py-2 rounded transition-colors ${
                              activeSection === item.id
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                            style={{ paddingLeft: `${item.level * 12 + 12}px` }}
                          >
                            {item.text}
                          </button>
                        ))}
                      </nav>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Related Articles</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {relatedArticles.map((article) => (
                      <div 
                        key={article.id}
                        className="cursor-pointer group"
                        onClick={() => onPostSelect && onPostSelect(article.slug)}
                      >
                        <h4 className="font-medium text-sm group-hover:text-purple-600 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(article.publishedAt)} • {article.readingTime} min read
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Blog List View
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Blog | NameDrop.cv - Career Tips & Professional Growth"
        description="Discover career tips, professional development insights, and industry trends from the NameDrop.cv blog."
        canonical="https://namedrop.cv/blog"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Career Growth & Professional Tips
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert insights on building your career, optimizing your professional presence, and succeeding in today's job market.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Featured Posts */}
            {posts.filter(post => post.featured).length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.filter(post => post.featured).slice(0, 2).map((post) => (
                    <Card 
                      key={post.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow group"
                      onClick={() => onPostSelect && onPostSelect(post.slug)}
                    >
                      {post.featuredImage && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img 
                            src={post.featuredImage} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">
                          {post.category}
                        </Badge>
                        <CardTitle className="group-hover:text-purple-600 transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription>{post.excerpt}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{post.author}</span>
                          <span>{formatDate(post.publishedAt)}</span>
                          <span>{post.readingTime} min read</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Posts */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">All Articles</h2>
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                posts.map((post) => (
                  <Card 
                    key={post.id}
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => onPostSelect && onPostSelect(post.slug)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{post.category}</Badge>
                            {post.featured && (
                              <Badge className="bg-purple-100 text-purple-700">Featured</Badge>
                            )}
                          </div>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-3">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{post.author}</span>
                            <span>{formatDate(post.publishedAt)}</span>
                            <span>{post.readingTime} min read</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            {categories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategorySelect && onCategorySelect(category.slug)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-muted transition-colors flex justify-between items-center"
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs text-muted-foreground">{category.postCount}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Newsletter Signup */}
            <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="text-sm">Stay Updated</CardTitle>
                <CardDescription>
                  Get the latest career tips and professional insights delivered to your inbox.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input placeholder="Enter your email" type="email" />
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}