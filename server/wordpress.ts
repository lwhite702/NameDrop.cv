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
  private username = 'lwhite702';
  private password = 'vqX1 9KrT YFna rOqL pXXx EwMl';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  
  private async fetchWithAuth(url: string): Promise<any> {
    // Check cache first
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Exponential backoff for rate limiting
      let retries = 3;
      let delay = 1000;
      
      while (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
        const response = await fetch(url, {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json',
            'User-Agent': 'NameDrop.cv/1.0'
          }
        });
        
        if (response.status === 429) {
          retries--;
          delay *= 2; // Exponential backoff
          if (retries === 0) {
            throw new Error(`Rate limited after retries: ${response.status}`);
          }
          continue;
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Non-JSON response received');
        }

        const data = await response.json();
        
        // Cache successful responses
        this.cache.set(url, { data, timestamp: Date.now() });
        
        return data;
      }
    } catch (error) {
      console.error(`WordPress API error for ${url}:`, error);
      throw error;
    }
  }



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

      const data = await this.fetchWithAuth(url);
      if (data && Array.isArray(data)) {
        return data.map(this.transformPost);
      }
    } catch (error) {
      console.error('WordPress API unavailable:', error);
    }
    
    return [];
  }

  async getPost(slug: string): Promise<BlogPost | null> {
    try {
      const data = await this.fetchWithAuth(`${this.baseUrl}/posts?slug=${slug}&_embed=1`);
      if (data && Array.isArray(data) && data.length > 0) {
        return this.transformPost(data[0]);
      }
    } catch (error) {
      console.error('WordPress API unavailable for post:', error);
    }
    return null;
  }

  async getCategories(): Promise<BlogCategory[]> {
    try {
      const data = await this.fetchWithAuth(`${this.baseUrl}/categories?per_page=100`);
      if (data && Array.isArray(data)) {
        return data.map(this.transformCategory);
      }
    } catch (error) {
      console.error('WordPress API unavailable for categories:', error);
    }
    return [];
  }

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    try {
      const data = await this.fetchWithAuth(`${this.baseUrl}/posts?per_page=${limit}&sticky=true&_embed=1`);
      
      if (data && Array.isArray(data) && data.length > 0) {
        const transformedPosts = data.map(this.transformPost);
        
        // If we don't have enough sticky posts, fill with recent posts
        if (transformedPosts.length < limit) {
          const recentPosts = await this.getPosts(limit - transformedPosts.length);
          const stickyIds = transformedPosts.map(p => p.id);
          const additionalPosts = recentPosts.filter(p => !stickyIds.includes(p.id));
          return [...transformedPosts, ...additionalPosts].slice(0, limit);
        }

        return transformedPosts;
      } else {
        // If no sticky posts, get recent posts
        return this.getPosts(limit);
      }
    } catch (error) {
      console.error('WordPress API unavailable for featured posts:', error);
    }
    return [];
  }

  async getRelatedPosts(postId: string, category: string, limit: number = 3): Promise<RelatedArticle[]> {
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