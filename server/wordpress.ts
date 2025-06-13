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
  
  private async fetchWithAuth(url: string): Promise<any> {
    try {
      const auth = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Non-JSON response received');
      }

      return await response.json();
    } catch (error) {
      console.error(`WordPress API fetch failed for ${url}:`, error);
      return null;
    }
  }

  async getPosts(limit: number = 10, category?: string): Promise<BlogPost[]> {
    let url = `${this.baseUrl}/posts?per_page=${limit}&_embed=1`;
    
    if (category) {
      const categories = await this.getCategories();
      const categoryObj = categories.find(cat => cat.slug === category);
      if (categoryObj) {
        url += `&categories=${categoryObj.id}`;
      }
    }

    const data = await this.fetchWithAuth(url);
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map(this.transformPost);
  }

  async getPost(slug: string): Promise<BlogPost | null> {
    const data = await this.fetchWithFallback(`${this.baseUrl}/posts?slug=${slug}&_embed=1`);
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }

    return this.transformPost(data[0]);
  }

  async getCategories(): Promise<BlogCategory[]> {
    const data = await this.fetchWithFallback(`${this.baseUrl}/categories?per_page=100`);
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map(this.transformCategory);
  }

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    const data = await this.fetchWithFallback(`${this.baseUrl}/posts?per_page=${limit}&sticky=true&_embed=1`);
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      // If no sticky posts available, get recent posts
      return this.getPosts(limit);
    }

    const transformedPosts = data.map(this.transformPost);
    
    // If we don't have enough sticky posts, fill with recent posts
    if (transformedPosts.length < limit) {
      const recentPosts = await this.getPosts(limit - transformedPosts.length);
      const stickyIds = transformedPosts.map(p => p.id);
      const additionalPosts = recentPosts.filter(p => !stickyIds.includes(p.id));
      return [...transformedPosts, ...additionalPosts].slice(0, limit);
    }

    return transformedPosts;
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