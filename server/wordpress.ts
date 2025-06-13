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
        console.log(`WordPress API error: ${response.status} - falling back to sample data`);
        return null;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        console.log('WordPress API returned non-JSON - falling back to sample data');
        return null;
      }

      return await response.json();
    } catch (error) {
      console.log(`WordPress API unavailable - using sample data for demonstration`);
      return null;
    }
  }

  private getSamplePosts(): BlogPost[] {
    return [
      {
        id: '1',
        title: 'The Future of Personal Branding in 2025',
        slug: 'future-personal-branding-2025',
        excerpt: 'Discover how personal branding is evolving in 2025 and why having a professional online presence is more crucial than ever for career success.',
        content: `<h2>Why Personal Branding Matters More Than Ever</h2>
        <p>In today's digital-first world, your personal brand isn't just a nice-to-have—it's essential for career advancement and professional opportunities.</p>
        
        <h3>The New Landscape</h3>
        <p>With remote work becoming the norm and digital networking replacing traditional face-to-face interactions, your online presence often serves as the first impression for potential employers, clients, and collaborators.</p>
        
        <h3>Key Trends for 2025</h3>
        <ul>
        <li><strong>Authentic Storytelling:</strong> Moving beyond polished corporate speak to genuine, relatable narratives</li>
        <li><strong>Visual Identity:</strong> Consistent visual branding across all digital touchpoints</li>
        <li><strong>Niche Expertise:</strong> Establishing yourself as a thought leader in specific areas</li>
        <li><strong>Cross-Platform Presence:</strong> Maintaining consistency across LinkedIn, personal websites, and social media</li>
        </ul>
        
        <h3>Building Your Brand Foundation</h3>
        <p>Start with a professional CV website that showcases your unique value proposition. Tools like NameDrop.cv make it easy to create a compelling online presence that stands out from traditional PDF resumes.</p>`,
        author: 'Wrelik Brands Team',
        publishedAt: '2025-01-10T10:00:00Z',
        updatedAt: '2025-01-10T10:00:00Z',
        tags: ['Personal Branding', 'Career Development', 'Digital Presence'],
        category: 'Career Advice',
        featured: true,
        readingTime: 4,
        featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
        seoTitle: 'The Future of Personal Branding in 2025 | Wrelik Brands',
        seoDescription: 'Discover how personal branding is evolving in 2025 and why having a professional online presence is more crucial than ever for career success.'
      },
      {
        id: '2',
        title: 'CV Design Trends That Actually Get You Hired',
        slug: 'cv-design-trends-that-get-hired',
        excerpt: 'Learn about the latest CV design trends that catch recruiters\' attention and increase your chances of landing interviews.',
        content: `<h2>What Recruiters Really Want to See</h2>
        <p>Modern recruiters spend an average of 6 seconds scanning a CV. Here's how to make those seconds count with strategic design choices.</p>
        
        <h3>Clean, Scannable Layout</h3>
        <p>The days of cramming everything onto one page are over. White space is your friend—it helps guide the reader's eye to the most important information.</p>
        
        <h3>Strategic Use of Color</h3>
        <p>A single accent color can make your CV memorable without appearing unprofessional. Use it sparingly for section headers or your name.</p>
        
        <h3>Typography That Works</h3>
        <ul>
        <li>Stick to 1-2 professional fonts maximum</li>
        <li>Use consistent font sizes and weights</li>
        <li>Ensure readability both on screen and in print</li>
        </ul>
        
        <h3>Digital-First Design</h3>
        <p>With most CVs being viewed digitally first, optimize for screen reading. This means clear hierarchy, good contrast, and proper spacing.</p>`,
        author: 'Wrelik Brands Team',
        publishedAt: '2025-01-08T14:30:00Z',
        updatedAt: '2025-01-08T14:30:00Z',
        tags: ['CV Design', 'Resume Tips', 'Job Applications'],
        category: 'Design Tips',
        featured: true,
        readingTime: 3,
        featuredImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop',
        seoTitle: 'CV Design Trends That Actually Get You Hired | Wrelik Brands',
        seoDescription: 'Learn about the latest CV design trends that catch recruiters\' attention and increase your chances of landing interviews.'
      },
      {
        id: '3',
        title: 'How to Optimize Your Professional Profile for ATS Systems',
        slug: 'optimize-profile-ats-systems',
        excerpt: 'Understanding Applicant Tracking Systems and how to ensure your profile gets past the initial screening process.',
        content: `<h2>Beating the Robots: ATS Optimization</h2>
        <p>Over 75% of large companies use Applicant Tracking Systems (ATS) to filter applications. Here's how to ensure your profile makes it through.</p>
        
        <h3>Keyword Strategy</h3>
        <p>Study job descriptions carefully and incorporate relevant keywords naturally throughout your profile. Don't just stuff keywords—use them in context.</p>
        
        <h3>Format for Success</h3>
        <ul>
        <li>Use standard section headings like "Work Experience" and "Education"</li>
        <li>Avoid complex formatting, tables, and graphics in ATS-submitted versions</li>
        <li>Use common file formats (PDF or Word)</li>
        <li>Include both acronyms and full terms (e.g., "Search Engine Optimization (SEO)")</li>
        </ul>
        
        <h3>The Human Touch</h3>
        <p>While optimizing for ATS is important, remember that humans will ultimately review your application. Balance optimization with readability and personality.</p>`,
        author: 'Wrelik Brands Team',
        publishedAt: '2025-01-05T09:15:00Z',
        updatedAt: '2025-01-05T09:15:00Z',
        tags: ['ATS', 'Job Search', 'Resume Optimization'],
        category: 'Career Advice',
        featured: true,
        readingTime: 5,
        featuredImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        seoTitle: 'How to Optimize Your Professional Profile for ATS Systems | Wrelik Brands',
        seoDescription: 'Understanding Applicant Tracking Systems and how to ensure your profile gets past the initial screening process.'
      }
    ];
  }

  private getSampleCategories(): BlogCategory[] {
    return [
      {
        id: '1',
        name: 'Career Advice',
        slug: 'career-advice',
        description: 'Professional guidance for career development and advancement.',
        postCount: 8
      },
      {
        id: '2',
        name: 'Design Tips',
        slug: 'design-tips',
        description: 'Visual design best practices for professional materials.',
        postCount: 5
      },
      {
        id: '3',
        name: 'Industry Insights',
        slug: 'industry-insights',
        description: 'Latest trends and developments across various industries.',
        postCount: 12
      }
    ];
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
      // Use sample data until WordPress is properly configured
      const samplePosts = this.getSamplePosts();
      if (category) {
        return samplePosts.filter(post => post.category.toLowerCase().replace(/\s+/g, '-') === category).slice(0, limit);
      }
      return samplePosts.slice(0, limit);
    }

    return data.map(this.transformPost);
  }

  async getPost(slug: string): Promise<BlogPost | null> {
    const data = await this.fetchWithAuth(`${this.baseUrl}/posts?slug=${slug}&_embed=1`);
    if (!data || !Array.isArray(data) || data.length === 0) {
      // Use sample data until WordPress is properly configured
      const samplePosts = this.getSamplePosts();
      return samplePosts.find(post => post.slug === slug) || null;
    }

    return this.transformPost(data[0]);
  }

  async getCategories(): Promise<BlogCategory[]> {
    const data = await this.fetchWithAuth(`${this.baseUrl}/categories?per_page=100`);
    if (!data || !Array.isArray(data)) {
      // Use sample categories until WordPress is properly configured
      return this.getSampleCategories();
    }

    return data.map(this.transformCategory);
  }

  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    const data = await this.fetchWithAuth(`${this.baseUrl}/posts?per_page=${limit}&sticky=true&_embed=1`);
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      // Use sample featured posts until WordPress is properly configured
      const samplePosts = this.getSamplePosts();
      return samplePosts.filter(post => post.featured).slice(0, limit);
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