import { BlogPost, BlogCategory, RelatedArticle } from "@shared/blog-schema";

interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  yoast_head_json?: {
    title?: string;
    description?: string;
  };
  _embedded?: {
    author?: Array<{ name: string }>;
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    'wp:term'?: Array<Array<{ name: string; slug: string }>>;
  };
}

interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
}

export class WordPressService {
  private baseUrl = 'https://wrelikbrands.com/wp-json/wp/v2';

  async getPosts(limit: number = 10, category?: string): Promise<BlogPost[]> {
    try {
      let url = `${this.baseUrl}/posts?per_page=${limit}&_embed=1`;
      
      if (category) {
        const categories = await this.getCategories();
        const categoryObj = categories.find(cat => cat.slug === category);
        if (categoryObj) {
          url += `&categories=${categoryObj.id}`;
        }
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('WordPress API returned non-JSON response');
      }

      const posts: WordPressPost[] = await response.json();
      return posts.map(this.transformPost);
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
      // Return empty array to allow fallback to legacy endpoint
      return [];
    }
  }

  async getPost(slug: string): Promise<BlogPost | null> {
    try {
      const response = await fetch(`${this.baseUrl}/posts?slug=${slug}&_embed=1`);
      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const posts: WordPressPost[] = await response.json();
      if (posts.length === 0) {
        return null;
      }

      return this.transformPost(posts[0]);
    } catch (error) {
      console.error('Error fetching WordPress post:', error);
      throw error;
    }
  }

  async getCategories(): Promise<BlogCategory[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories?per_page=100`);
      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const categories: WordPressCategory[] = await response.json();
      return categories.map(this.transformCategory);
    } catch (error) {
      console.error('Error fetching WordPress categories:', error);
      throw error;
    }
  }

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${this.baseUrl}/posts?per_page=${limit}&sticky=true&_embed=1`);
      if (!response.ok) {
        // If no sticky posts, get recent posts
        return this.getPosts(limit);
      }

      const posts: WordPressPost[] = await response.json();
      const transformedPosts = posts.map(this.transformPost);
      
      // If we don't have enough sticky posts, fill with recent posts
      if (transformedPosts.length < limit) {
        const recentPosts = await this.getPosts(limit - transformedPosts.length);
        const stickyIds = transformedPosts.map(p => p.id);
        const additionalPosts = recentPosts.filter(p => !stickyIds.includes(p.id));
        return [...transformedPosts, ...additionalPosts].slice(0, limit);
      }

      return transformedPosts;
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return this.getPosts(limit);
    }
  }

  async getRelatedPosts(postId: string, category: string, limit: number = 3): Promise<RelatedArticle[]> {
    try {
      const posts = await this.getPosts(10, category);
      return posts
        .filter(post => post.id !== postId)
        .slice(0, limit)
        .map(post => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          publishedAt: post.publishedAt,
          readingTime: post.readingTime,
          category: post.category
        }));
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  }

  private transformPost(post: WordPressPost): BlogPost {
    const author = post._embedded?.author?.[0]?.name || 'Wrelik Brands';
    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    const categories = post._embedded?.['wp:term']?.[0] || [];
    const tags = post._embedded?.['wp:term']?.[1] || [];

    // Calculate reading time (average 200 words per minute)
    const wordCount = this.getWordCount(post.content.rendered);
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      id: post.id.toString(),
      title: this.stripHtml(post.title.rendered),
      slug: post.slug,
      excerpt: this.stripHtml(post.excerpt.rendered),
      content: post.content.rendered,
      author,
      publishedAt: post.date,
      updatedAt: post.modified,
      tags: tags.map((tag: any) => tag.name),
      category: categories[0]?.name || 'Uncategorized',
      featured: post.sticky || false,
      readingTime,
      featuredImage,
      seoTitle: post.yoast_head_json?.title,
      seoDescription: post.yoast_head_json?.description
    };
  }

  private transformCategory(category: WordPressCategory): BlogCategory {
    return {
      id: category.id.toString(),
      name: category.name,
      slug: category.slug,
      description: this.stripHtml(category.description),
      postCount: category.count
    };
  }

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }

  private getWordCount(html: string): number {
    const text = this.stripHtml(html);
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}

export const wordpressService = new WordPressService();