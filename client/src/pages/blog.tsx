import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BlogLayout } from '@/components/blog/blog-layout';
import { BlogPost, BlogCategory, TableOfContentsItem, RelatedArticle } from '@shared/blog-schema';

export default function Blog() {
  const [selectedPost, setSelectedPost] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Fetch blog posts from Wrelik Brands
  const { data: blogData, isLoading } = useQuery({
    queryKey: ['/api/blog/posts', searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await fetch(`/api/blog/posts?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch blog posts');
      return response.json();
    }
  });

  // Fetch specific post
  const { data: currentPost } = useQuery({
    queryKey: ['/api/blog/posts', selectedPost],
    queryFn: async () => {
      if (!selectedPost) return null;
      const response = await fetch(`/api/blog/posts/${selectedPost}`);
      if (!response.ok) throw new Error('Failed to fetch blog post');
      return response.json();
    },
    enabled: !!selectedPost
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/blog/categories'],
    queryFn: async () => {
      const response = await fetch('/api/blog/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  // Generate table of contents from post content
  const generateTableOfContents = (content: string): TableOfContentsItem[] => {
    if (!content) return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    return Array.from(headings).map((heading, index) => ({
      id: heading.id || `heading-${index}`,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }));
  };

  // Get related articles
  const getRelatedArticles = (post: BlogPost): RelatedArticle[] => {
    if (!post || !blogData?.posts) return [];
    
    return blogData.posts
      .filter((p: BlogPost) => 
        p.id !== post.id && 
        (p.category === post.category || 
         p.tags.some((tag: string) => post.tags.includes(tag)))
      )
      .slice(0, 3)
      .map((p: BlogPost) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        publishedAt: p.publishedAt,
        readingTime: p.readingTime,
        category: p.category
      }));
  };

  const handlePostSelect = (slug: string) => {
    setSelectedPost(slug);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setSelectedPost(''); // Reset to list view
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedPost(''); // Reset to list view
  };

  return (
    <BlogLayout
      posts={blogData?.posts || []}
      currentPost={currentPost}
      categories={categories}
      relatedArticles={currentPost ? getRelatedArticles(currentPost) : []}
      tableOfContents={currentPost ? generateTableOfContents(currentPost.content) : []}
      onPostSelect={handlePostSelect}
      onCategorySelect={handleCategorySelect}
      onSearch={handleSearch}
      loading={isLoading}
    />
  );
}