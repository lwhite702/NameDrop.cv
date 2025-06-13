import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { BlogPost, BlogCategory } from "@shared/blog-schema";

interface BlogSearchProps {
  posts: BlogPost[];
  categories: BlogCategory[];
  onFilter: (filteredPosts: BlogPost[]) => void;
  onCategoryChange: (category: string | null) => void;
  selectedCategory: string | null;
}

export function BlogSearch({ posts, categories, onFilter, onCategoryChange, selectedCategory }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      onFilter(posts);
      return;
    }

    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(term.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(term.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))
    );
    
    onFilter(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onFilter(posts);
  };

  const handleCategorySelect = (categorySlug: string | null) => {
    onCategoryChange(categorySlug);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search articles, topics, or keywords..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
            onClick={() => handleCategorySelect(null)}
          >
            All Articles
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.slug ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
              onClick={() => handleCategorySelect(category.slug)}
            >
              {category.name} ({category.postCount})
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || selectedCategory) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Search: "{searchTerm}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={clearSearch}
              />
            </Badge>
          )}
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c.slug === selectedCategory)?.name}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCategorySelect(null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}