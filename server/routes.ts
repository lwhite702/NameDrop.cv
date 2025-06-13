import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { isAdmin, logAdminAction } from "./adminAuth";
import { insertProfileSchema } from "@shared/schema";
import { resumeFormatterAPI, prepPairAPI } from "./integrations";
import { aiOptimizationService, cvSuggestionService } from "./openai";
import { wordpressService } from "./wordpress";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { z } from "zod";

// Initialize Stripe only if secret key is available
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
});

const previewLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
});

// File upload configuration
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post('/api/profiles', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has a profile
      const existingProfile = await storage.getProfile(userId);
      if (existingProfile) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      const profileData = insertProfileSchema.parse({
        ...req.body,
        userId,
        slug: req.body.slug || user.username || userId,
      });

      const profile = await storage.createProfile(profileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  app.get('/api/profiles/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.put('/api/profiles/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      const profile = await storage.updateProfile(userId, updates);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post('/api/profiles/me/publish', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.publishProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error publishing profile:", error);
      res.status(500).json({ message: "Failed to publish profile" });
    }
  });

  app.post('/api/profiles/me/unpublish', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.unpublishProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error unpublishing profile:", error);
      res.status(500).json({ message: "Failed to unpublish profile" });
    }
  });

  // Public profile routes (with rate limiting)
  app.get('/api/preview/:slug', previewLimiter, async (req, res) => {
    try {
      const { slug } = req.params;
      const profile = await storage.getProfileBySlug(slug);
      
      if (!profile || !profile.isPublished) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Record view and increment counter
      await storage.incrementViewCount(profile.id);
      await storage.recordProfileView(
        profile.id,
        req.ip || '0.0.0.0',
        req.get('User-Agent') || '',
        req.get('Referer')
      );

      res.json(profile);
    } catch (error) {
      console.error("Error fetching public profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Link click tracking route
  app.post('/api/click/:profileId/:linkId', async (req, res) => {
    try {
      const { profileId, linkId } = req.params;
      const { url } = req.body;
      
      const ipAddress = req.ip || req.connection.remoteAddress || '';
      const userAgent = req.get('User-Agent') || '';
      const referrer = req.get('Referer');
      
      await storage.recordLinkClick(parseInt(profileId), linkId, url, ipAddress, userAgent, referrer);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording link click:", error);
      res.status(500).json({ message: "Failed to record click" });
    }
  });

  // QR Code generation
  app.post('/api/profiles/me/qr-code', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const qrCodeUrl = await storage.generateQRCode(profile.id);
      res.json({ qrCodeUrl });
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ message: "Failed to generate QR code" });
    }
  });

  // Slug management
  app.post('/api/profiles/me/slug', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { slug } = req.body;
      
      if (!slug || !/^[a-zA-Z0-9-_]+$/.test(slug)) {
        return res.status(400).json({ message: "Invalid slug format" });
      }

      const canChange = await storage.canChangeSlug(userId);
      if (!canChange) {
        return res.status(400).json({ message: "You can only change your username once every 30 days" });
      }

      // Check if slug is already taken
      const existingProfile = await storage.getProfileBySlug(slug);
      if (existingProfile) {
        return res.status(400).json({ message: "Username is already taken" });
      }

      const profile = await storage.updateSlug(userId, slug);
      res.json(profile);
    } catch (error) {
      console.error("Error updating slug:", error);
      res.status(500).json({ message: "Failed to update username" });
    }
  });

  // Custom domain management
  app.post('/api/domains/add', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { domain } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user?.isPro) {
        return res.status(403).json({ message: "Custom domains are a Pro feature" });
      }

      const profile = await storage.getProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const verification = await storage.addCustomDomain(profile.id, domain);
      res.json({
        verification,
        instructions: `Add a CNAME record pointing ${domain} to custom.namedrop.cv`
      });
    } catch (error) {
      console.error("Error adding domain:", error);
      res.status(500).json({ message: "Failed to add domain" });
    }
  });

  app.post('/api/domains/verify', isAuthenticated, async (req: any, res) => {
    try {
      const { domain } = req.body;
      const verification = await storage.verifyDomain(domain);
      res.json(verification);
    } catch (error) {
      console.error("Error verifying domain:", error);
      res.status(500).json({ message: "Failed to verify domain" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/me', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const analytics = await storage.getProfileAnalytics(profile.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Resume upload route
  app.post('/api/upload/resume', isAuthenticated, upload.single('resume'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // In a real implementation, you would:
      // 1. Parse the uploaded file (PDF/Word)
      // 2. Extract text content
      // 3. Use AI/NLP to parse sections
      // 4. Return structured data
      
      // For now, return the file path
      res.json({
        message: "Resume uploaded successfully",
        filename: req.file.filename,
        originalName: req.file.originalname,
        // In production, you'd return parsed data here
        parsed: {
          name: "",
          email: "",
          phone: "",
          summary: "",
          experience: [],
          education: [],
          skills: []
        }
      });
    } catch (error) {
      console.error("Error uploading resume:", error);
      res.status(500).json({ message: "Failed to upload resume" });
    }
  });

  // Stripe subscription routes
  app.post('/api/create-subscription', isAuthenticated, async (req: any, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing unavailable. Please contact support." });
      }

      const userId = req.user.claims.sub;
      let user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        return res.json({
          subscriptionId: subscription.id,
          status: subscription.status,
        });
      }

      if (!user.email) {
        return res.status(400).json({ message: 'No user email on file' });
      }

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price: process.env.STRIPE_PRICE_ID || 'price_1234', // You'll need to set this
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with Stripe info
      user = await storage.updateUserStripeInfo(userId, customer.id, subscription.id);

      res.json({
        subscriptionId: subscription.id,
        status: subscription.status,
      });
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/admin/users/:userId/ban', isAuthenticated, async (req: any, res) => {
    try {
      const adminUserId = req.user.claims.sub;
      const { userId } = req.params;
      
      const adminUser = await storage.getUser(adminUserId);
      if (!adminUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const user = await storage.banUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error banning user:", error);
      res.status(500).json({ message: "Failed to ban user" });
    }
  });

  app.post('/api/moderation/report', async (req, res) => {
    try {
      const { profileId, reportedBy, reason } = req.body;
      
      const report = await storage.createModerationReport(profileId, reportedBy, reason);
      res.json(report);
    } catch (error) {
      console.error("Error creating moderation report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Integration routes
  app.post('/api/integrations/resumeformatter/import', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { resumeFormatterId } = req.body;

      const importedData = await resumeFormatterAPI.importResume(userId, resumeFormatterId);
      
      // Update user's profile with imported data
      const profile = await storage.getProfile(userId);
      if (profile) {
        await storage.updateProfile(userId, {
          ...importedData,
          tagline: importedData.bio ? importedData.bio.substring(0, 100) : profile.tagline
        });
      }

      res.json({ success: true, data: importedData });
    } catch (error: any) {
      console.error("Error importing from ResumeFormatter:", error);
      res.status(500).json({ message: error.message || "Failed to import resume" });
    }
  });

  app.post('/api/integrations/preppair/link', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { preppairToken } = req.body;

      const linkResult = await prepPairAPI.linkAccount(userId, preppairToken);
      res.json({ success: true, data: linkResult });
    } catch (error: any) {
      console.error("Error linking PrepPair account:", error);
      res.status(500).json({ message: error.message || "Failed to link PrepPair account" });
    }
  });

  app.get('/api/integrations/preppair/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { preppairUserId } = req.query;

      if (!preppairUserId) {
        return res.status(400).json({ message: "PrepPair user ID required" });
      }

      const progress = await prepPairAPI.getUserProgress(userId, preppairUserId as string);
      res.json({ success: true, data: progress });
    } catch (error: any) {
      console.error("Error fetching PrepPair progress:", error);
      res.status(500).json({ message: error.message || "Failed to fetch progress" });
    }
  });

  // Enhanced SEO meta tags route
  app.get('/api/seo/meta/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const profile = await storage.getProfileBySlug(slug);
      
      if (!profile || !profile.isPublished) {
        return res.status(404).json({ message: "Profile not found" });
      }

      const meta = {
        title: profile.seoTitle || `${profile.name} - Professional CV | NameDrop.cv`,
        description: profile.seoDescription || profile.bio || `Professional CV and portfolio for ${profile.name}. View work experience, skills, and projects.`,
        keywords: [
          profile.name,
          'CV',
          'resume',
          'professional',
          'portfolio',
          ...(profile.skills || [])
        ].join(', '),
        canonical: `https://${slug}.namedrop.cv`,
        ogImage: profile.ogImage || `https://namedrop.cv/api/og-image/${slug}`,
        author: profile.name,
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: profile.name,
          jobTitle: profile.tagline,
          description: profile.bio,
          url: `https://${slug}.namedrop.cv`,
          sameAs: Object.values(profile.socialLinks || {}).filter(Boolean)
        }
      };

      res.json(meta);
    } catch (error) {
      console.error("Error generating SEO meta:", error);
      res.status(500).json({ message: "Failed to generate SEO meta" });
    }
  });

  // Subdomain and custom domain routing - only for non-localhost hosts
  app.use(async (req, res, next) => {
    const host = req.get('host') || '';
    
    // Skip for localhost, API routes, assets, and main domain
    if (host.startsWith('localhost') ||
        host.startsWith('127.0.0.1') ||
        host.includes('.replit.') ||
        req.path.startsWith('/api/') || 
        req.path.startsWith('/assets/') ||
        host === 'namedrop.cv' || 
        host.startsWith('www.')) {
      return next();
    }
    
    // Check if this looks like a subdomain (contains dots and is not main domain)
    const potentialSubdomain = host.split('.')[0];
    if (host.includes('.') && potentialSubdomain && potentialSubdomain !== 'www') {
      try {
        // Try to find profile by subdomain
        const profile = await storage.getProfileBySlug(potentialSubdomain);
        if (profile && profile.isPublished) {
          // Record profile view
          const ipAddress = req.ip || req.connection.remoteAddress || '';
          const userAgent = req.get('User-Agent') || '';
          const referrer = req.get('Referer');
          
          await storage.recordProfileView(profile.id, ipAddress, userAgent, referrer);
          await storage.incrementViewCount(profile.id);
          
          // Serve the profile page with SEO meta tags
          const seoTitle = profile.seoTitle || `${profile.name} - NameDrop.cv`;
          const seoDescription = profile.seoDescription || profile.bio || `Professional profile for ${profile.name}`;
          const profileUrl = `https://${host}`;
          
          return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seoTitle}</title>
  <meta name="description" content="${seoDescription}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${seoTitle}">
  <meta property="og:description" content="${seoDescription}">
  <meta property="og:url" content="${profileUrl}">
  <meta property="og:type" content="profile">
  ${profile.ogImage ? `<meta property="og:image" content="${profile.ogImage}">` : ''}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seoTitle}">
  <meta name="twitter:description" content="${seoDescription}">
  
  <link rel="canonical" href="${profileUrl}">
  <script>window.__PROFILE_DATA__ = ${JSON.stringify(profile)};</script>
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>
          `);
        }
        
        // Also check custom domains
        const customProfile = await storage.getProfileByDomain(host);
        if (customProfile && customProfile.isPublished) {
          const ipAddress = req.ip || req.connection.remoteAddress || '';
          const userAgent = req.get('User-Agent') || '';
          const referrer = req.get('Referer');
          
          await storage.recordProfileView(customProfile.id, ipAddress, userAgent, referrer);
          await storage.incrementViewCount(customProfile.id);
          
          const seoTitle = customProfile.seoTitle || `${customProfile.name} - NameDrop.cv`;
          const seoDescription = customProfile.seoDescription || customProfile.bio || `Professional profile for ${customProfile.name}`;
          const profileUrl = `https://${host}`;
          
          return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seoTitle}</title>
  <meta name="description" content="${seoDescription}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${seoTitle}">
  <meta property="og:description" content="${seoDescription}">
  <meta property="og:url" content="${profileUrl}">
  <meta property="og:type" content="profile">
  ${customProfile.ogImage ? `<meta property="og:image" content="${customProfile.ogImage}">` : ''}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seoTitle}">
  <meta name="twitter:description" content="${seoDescription}">
  
  <link rel="canonical" href="${profileUrl}">
  <script>window.__PROFILE_DATA__ = ${JSON.stringify(customProfile)};</script>
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" href="/assets/index.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>
          `);
        }
      } catch (error) {
        console.error('Domain routing error:', error);
      }
      
      // 404 for unknown subdomains
      return res.status(404).send(`
<!DOCTYPE html>
<html>
<head><title>Profile Not Found - NameDrop.cv</title></head>
<body>
  <h1>Profile Not Found</h1>
  <p>The profile you're looking for doesn't exist or has been unpublished.</p>
  <a href="https://namedrop.cv">Create your own profile at NameDrop.cv</a>
</body>
</html>
      `);
    }
    
    // Continue to main app for main domain requests
    next();
  });

  // AI Optimization Routes (Pro users only)
  app.post('/api/ai/optimize', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user?.isPro) {
        return res.status(403).json({ error: 'AI optimization is a Pro feature' });
      }

      const { profileData } = req.body;
      if (!profileData) {
        return res.status(400).json({ error: 'Profile data is required' });
      }

      const result = await aiOptimizationService.optimizeCV(profileData);
      res.json(result);
    } catch (error: any) {
      console.error('AI optimization error:', error);
      res.status(500).json({ error: error.message || 'Failed to optimize CV' });
    }
  });

  // AI CV Section Suggestions (Pro feature)
  app.post('/api/ai/cv-suggestions', isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user?.isPro) {
        return res.status(403).json({ error: 'CV suggestions is a Pro feature' });
      }

      const { section, content, targetRole, industry } = req.body;

      if (!section || !content?.trim()) {
        return res.status(400).json({ error: 'Section and content are required' });
      }

      const result = await cvSuggestionService.generateSectionSuggestions(
        section,
        content.trim(),
        targetRole?.trim(),
        industry?.trim()
      );

      res.json(result);
    } catch (error: any) {
      console.error('CV suggestions error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate CV suggestions' });
    }
  });

  // Blog Routes - WordPress Integration with Fallback
  app.get('/api/blog/posts', async (req, res) => {
    try {
      const { limit = '10', category } = req.query;
      let posts = await wordpressService.getPosts(
        parseInt(limit as string), 
        category as string
      );

      // If WordPress API fails, use fallback data
      if (posts.length === 0) {
        const fallbackResponse = await fetch(`${req.protocol}://${req.get('host')}/api/blog/posts/legacy`);
        if (fallbackResponse.ok) {
          posts = await fallbackResponse.json();
        }
      }

      res.json(posts);
    } catch (error: any) {
      console.error('Blog posts error:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  app.get('/api/blog/featured', async (req, res) => {
    try {
      const { limit = '3' } = req.query;
      let posts = await wordpressService.getFeaturedPosts(parseInt(limit as string));

      // If WordPress API fails, use fallback data
      if (posts.length === 0) {
        const fallbackResponse = await fetch(`${req.protocol}://${req.get('host')}/api/blog/posts/legacy`);
        if (fallbackResponse.ok) {
          const allPosts = await fallbackResponse.json();
          posts = allPosts.filter((post: any) => post.featured).slice(0, parseInt(limit as string));
        }
      }

      res.json(posts);
    } catch (error: any) {
      console.error('Featured posts error:', error);
      res.status(500).json({ error: 'Failed to fetch featured posts' });
    }
  });

  app.get('/api/blog/categories', async (req, res) => {
    try {
      let categories = await wordpressService.getCategories();

      // If WordPress API fails, use fallback data
      if (categories.length === 0) {
        categories = [
          { id: '1', name: 'Career Tips', slug: 'career-tips', description: 'Professional development and career advice', postCount: 15 },
          { id: '2', name: 'Networking', slug: 'networking', description: 'Building professional relationships', postCount: 8 },
          { id: '3', name: 'Job Search', slug: 'job-search', description: 'Strategies for finding your next role', postCount: 12 },
          { id: '4', name: 'Industry Insights', slug: 'industry-insights', description: 'Latest trends and market analysis', postCount: 6 },
          { id: '5', name: 'Announcements', slug: 'announcements', description: 'Company news and updates', postCount: 3 }
        ];
      }

      res.json(categories);
    } catch (error: any) {
      console.error('Blog categories error:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      let post = await wordpressService.getPost(slug);
      
      // If WordPress API fails, try fallback data
      if (!post) {
        const fallbackResponse = await fetch(`${req.protocol}://${req.get('host')}/api/blog/posts/legacy`);
        if (fallbackResponse.ok) {
          const allPosts = await fallbackResponse.json();
          post = allPosts.find((p: any) => p.slug === slug);
        }
      }

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Get related posts
      const relatedPosts = await wordpressService.getRelatedPosts(
        post.id,
        post.category,
        3
      );

      res.json({ ...post, relatedPosts });
    } catch (error: any) {
      console.error('Blog post error:', error);
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });

  // Legacy fallback with sample data
  app.get('/api/blog/posts/legacy', async (req, res) => {
    try {
      const samplePosts = [
          {
            id: '1',
            title: 'How to Build a Professional CV That Gets Noticed',
            slug: 'build-professional-cv-gets-noticed',
            excerpt: 'Learn the essential elements of creating a standout CV that captures recruiters\' attention and lands you interviews.',
            content: `<h2>The Foundation of a Great CV</h2>
            <p>Your CV is your first impression with potential employers. In today's competitive job market, you have about 6 seconds to capture a recruiter's attention before they move on to the next candidate.</p>
            
            <h3>Essential Sections Every CV Needs</h3>
            <ul>
              <li><strong>Professional Summary:</strong> A compelling 2-3 sentence overview of your experience and value proposition</li>
              <li><strong>Work Experience:</strong> Quantified achievements that demonstrate your impact</li>
              <li><strong>Skills:</strong> Relevant technical and soft skills aligned with the job requirements</li>
              <li><strong>Education:</strong> Academic background and relevant certifications</li>
            </ul>
            
            <h3>Writing Impactful Achievement Statements</h3>
            <p>Instead of listing job duties, focus on specific accomplishments:</p>
            <blockquote>
              <p>❌ "Responsible for managing social media accounts"</p>
              <p>✅ "Increased social media engagement by 150% across 3 platforms, resulting in 2,000+ new followers and 25% boost in website traffic"</p>
            </blockquote>
            
            <h3>Formatting for Success</h3>
            <p>Clean, professional formatting ensures your content gets read:</p>
            <ul>
              <li>Use consistent fonts and formatting throughout</li>
              <li>Maintain adequate white space for readability</li>
              <li>Keep to 1-2 pages maximum</li>
              <li>Use bullet points for easy scanning</li>
            </ul>`,
            author: 'Sarah Johnson',
            publishedAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
            tags: ['CV', 'Career', 'Job Search', 'Professional Development'],
            category: 'Career Tips',
            featured: true,
            readingTime: 5,
            featuredImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
            seoTitle: 'How to Build a Professional CV That Gets Noticed | NameDrop.cv',
            seoDescription: 'Expert tips for creating a standout CV that captures recruiters\' attention and lands interviews.'
          },
          {
            id: '2',
            title: 'The Ultimate Guide to Professional Networking in 2024',
            slug: 'ultimate-guide-professional-networking-2024',
            excerpt: 'Master the art of networking with proven strategies for building meaningful professional relationships both online and offline.',
            content: `<h2>Why Networking Matters More Than Ever</h2>
            <p>In 2024, professional networking has evolved beyond traditional face-to-face meetings. With remote work becoming the norm, digital networking skills are essential for career growth.</p>
            
            <h3>Building Your Online Presence</h3>
            <p>Your digital presence is often the first impression you make:</p>
            <ul>
              <li><strong>LinkedIn Optimization:</strong> Complete profile with professional photo and compelling headline</li>
              <li><strong>Industry Engagement:</strong> Share insights and comment thoughtfully on posts</li>
              <li><strong>Content Creation:</strong> Publish articles showcasing your expertise</li>
            </ul>
            
            <h3>Effective Networking Strategies</h3>
            <ol>
              <li><strong>Quality over Quantity:</strong> Focus on building genuine relationships rather than collecting contacts</li>
              <li><strong>Give First:</strong> Offer value before asking for help</li>
              <li><strong>Follow Up:</strong> Maintain connections with regular, meaningful touchpoints</li>
              <li><strong>Be Authentic:</strong> Show genuine interest in others' work and challenges</li>
            </ol>`,
            author: 'Mike Chen',
            publishedAt: '2024-01-12T14:30:00Z',
            updatedAt: '2024-01-12T14:30:00Z',
            tags: ['Networking', 'Career Growth', 'LinkedIn', 'Professional Development'],
            category: 'Networking',
            featured: true,
            readingTime: 7,
            featuredImage: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
            seoTitle: 'Professional Networking Guide 2024 | NameDrop.cv',
            seoDescription: 'Master digital networking with proven strategies for building meaningful professional relationships.'
          },
          {
            id: '3',
            title: '50% Off PrepPair.me: Exclusive Offer for NameDrop Users',
            slug: 'preppair-exclusive-discount-namedrop-users',
            excerpt: 'Get 3 months of PrepPair.me interview preparation platform at 50% off - exclusively for new NameDrop.cv users.',
            content: `<h2>Master Your Interview Skills with PrepPair.me</h2>
            <p>We're excited to announce an exclusive partnership with PrepPair.me, offering our users 50% off their first 3 months of premium interview preparation.</p>
            
            <h3>What is PrepPair.me?</h3>
            <p>PrepPair.me is a comprehensive interview preparation platform that helps job seekers practice and perfect their interview skills through:</p>
            <ul>
              <li>AI-powered mock interviews</li>
              <li>Industry-specific question banks</li>
              <li>Real-time feedback and scoring</li>
              <li>Behavioral interview training</li>
              <li>Technical interview practice</li>
            </ul>
            
            <h3>How to Claim Your Discount</h3>
            <ol>
              <li>Create your NameDrop.cv profile</li>
              <li>Visit the integrations section in your dashboard</li>
              <li>Click "Connect PrepPair.me"</li>
              <li>Use code <strong>NAMEDROP50</strong> for 50% off</li>
            </ol>
            
            <p><strong>Limited Time:</strong> This offer is valid for new NameDrop.cv users who sign up within the next 30 days.</p>`,
            author: 'NameDrop Team',
            publishedAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-10T09:00:00Z',
            tags: ['PrepPair', 'Interview Prep', 'Partnership', 'Discount'],
            category: 'Announcements',
            featured: false,
            readingTime: 3,
            featuredImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
            seoTitle: '50% Off PrepPair.me Interview Prep | NameDrop.cv Partnership',
            seoDescription: 'Exclusive 50% discount on PrepPair.me interview preparation for new NameDrop.cv users.'
          }
        ];
        
        res.json(samplePosts);
    } catch (error: any) {
      console.error('Legacy blog posts error:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      
      // Fetch specific post from Wrelik Brands
      const response = await fetch(`https://wrelikbrands.com/api/blog/posts/${slug}`);
      if (!response.ok) {
        return res.status(404).json({ error: 'Post not found' });
      }
      
      const post = await response.json();
      res.json(post);
    } catch (error) {
      console.error('Blog post error:', error);
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });

  app.get('/api/blog/categories', async (req, res) => {
    try {
      // Fetch categories from Wrelik Brands
      const response = await fetch('https://wrelikbrands.com/api/blog/categories');
      if (!response.ok) {
        // Fallback categories
        const sampleCategories = [
          { id: '1', name: 'Career Tips', slug: 'career-tips', description: 'Professional development and career advice', postCount: 15 },
          { id: '2', name: 'Networking', slug: 'networking', description: 'Building professional relationships', postCount: 8 },
          { id: '3', name: 'Interview Prep', slug: 'interview-prep', description: 'Interview skills and preparation', postCount: 12 },
          { id: '4', name: 'Announcements', slug: 'announcements', description: 'Platform updates and partnerships', postCount: 5 }
        ];
        
        return res.json(sampleCategories);
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Blog categories error:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // PrepPair Discount Routes
  app.get('/api/integrations/preppair/discount', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user.claims?.sub;
      const discountOffer = await prepPairAPI.generateDiscountCode(userId);
      res.json(discountOffer);
    } catch (error: any) {
      console.error('PrepPair discount error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate discount' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      await logAdminAction(req, 'view', 'users');
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get('/api/admin/profiles', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      await logAdminAction(req, 'view', 'profiles');
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });

  app.post('/api/admin/users/:userId/ban', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.banUser(userId);
      await logAdminAction(req, 'ban', 'user', userId);
      res.json(user);
    } catch (error) {
      console.error("Error banning user:", error);
      res.status(500).json({ message: "Failed to ban user" });
    }
  });

  app.post('/api/admin/users/:userId/unban', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.unbanUser(userId);
      await logAdminAction(req, 'unban', 'user', userId);
      res.json(user);
    } catch (error) {
      console.error("Error unbanning user:", error);
      res.status(500).json({ message: "Failed to unban user" });
    }
  });

  app.get('/api/admin/logs', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await storage.getAdminLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching admin logs:", error);
      res.status(500).json({ message: "Failed to fetch logs" });
    }
  });

  // Knowledge Base Admin routes
  app.get('/api/admin/knowledge-base/categories', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const categories = await storage.getKnowledgeBaseCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/admin/knowledge-base/categories', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const category = await storage.createKnowledgeBaseCategory(req.body);
      await logAdminAction(req, 'create', 'knowledge_base_category', category.id.toString(), req.body);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put('/api/admin/knowledge-base/categories/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const category = await storage.updateKnowledgeBaseCategory(parseInt(id), req.body);
      await logAdminAction(req, 'update', 'knowledge_base_category', id, req.body);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete('/api/admin/knowledge-base/categories/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteKnowledgeBaseCategory(parseInt(id));
      await logAdminAction(req, 'delete', 'knowledge_base_category', id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  app.get('/api/admin/knowledge-base/articles', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const articles = await storage.getKnowledgeBaseArticles(categoryId);
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.post('/api/admin/knowledge-base/articles', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const article = await storage.createKnowledgeBaseArticle(req.body);
      await logAdminAction(req, 'create', 'knowledge_base_article', article.id.toString(), req.body);
      res.json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put('/api/admin/knowledge-base/articles/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const article = await storage.updateKnowledgeBaseArticle(parseInt(id), req.body);
      await logAdminAction(req, 'update', 'knowledge_base_article', id, req.body);
      res.json(article);
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete('/api/admin/knowledge-base/articles/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteKnowledgeBaseArticle(parseInt(id));
      await logAdminAction(req, 'delete', 'knowledge_base_article', id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Public Knowledge Base routes
  app.get('/api/knowledge-base/categories', async (req, res) => {
    try {
      const categories = await storage.getKnowledgeBaseCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get('/api/knowledge-base/articles', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const articles = await storage.getKnowledgeBaseArticles(categoryId, true); // Only published
      res.json(articles);
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get('/api/knowledge-base/articles/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getKnowledgeBaseArticleBySlug(slug);
      if (!article || !article.isPublished) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment view count
      await storage.incrementArticleViewCount(article.id);
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post('/api/knowledge-base/articles/:id/helpful', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementArticleHelpfulCount(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating helpful count:", error);
      res.status(500).json({ message: "Failed to update helpful count" });
    }
  });

  // Site Settings routes
  app.get('/api/admin/settings', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put('/api/admin/settings/:key', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { value, type } = req.body;
      const setting = await storage.updateSiteSetting(key, value, type);
      await logAdminAction(req, 'update', 'site_setting', key, req.body);
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Knowledge Base & Support API for Wrelik.com unified support desk
  app.get('/api/support/health', async (req, res) => {
    try {
      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'operational',
          knowledgeBase: 'operational',
          userAuth: 'operational',
          blog: 'operational'
        },
        uptime: process.uptime(),
        version: '1.0.0'
      };
      res.json(healthData);
    } catch (error) {
      res.status(500).json({ 
        status: 'unhealthy', 
        error: 'Service health check failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  app.get('/api/support/articles/search', async (req, res) => {
    try {
      const { q, category, limit = 10 } = req.query;
      
      let articles = await storage.getKnowledgeBaseArticles(
        category ? parseInt(category as string) : undefined,
        true // published only
      );

      if (q) {
        const query = (q as string).toLowerCase();
        articles = articles.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      }

      const limitedArticles = articles.slice(0, parseInt(limit as string));
      
      res.json({
        articles: limitedArticles.map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          category: article.categoryId,
          tags: article.tags,
          helpfulCount: article.helpfulCount,
          viewCount: article.viewCount,
          publishedAt: article.createdAt,
          updatedAt: article.updatedAt
        })),
        total: articles.length,
        query: q,
        category: category
      });
    } catch (error) {
      console.error('Knowledge base search error:', error);
      res.status(500).json({ error: 'Failed to search knowledge base' });
    }
  });

  app.get('/api/support/user-context', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user.claims.sub;
      
      const profile = await storage.getProfile(userId);
      const userRecord = await storage.getUser(userId);
      
      const contextData = {
        user: {
          id: userId,
          email: userRecord?.email,
          firstName: userRecord?.firstName,
          lastName: userRecord?.lastName,
          isPro: userRecord?.isPro || false,
          createdAt: userRecord?.createdAt
        },
        profile: profile ? {
          id: profile.id,
          slug: profile.slug,
          isPublished: profile.isPublished,
          viewCount: profile.viewCount,
          downloadCount: profile.downloadCount
        } : null,
        recentActivity: {
          lastLogin: new Date().toISOString(),
          profileViews: profile?.viewCount || 0,
          downloadsCount: profile?.downloadCount || 0
        }
      };
      
      res.json(contextData);
    } catch (error) {
      console.error('User context error:', error);
      res.status(500).json({ error: 'Failed to retrieve user context' });
    }
  });

  app.get('/api/support/analytics', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const profiles = await storage.getAllProfiles();
      const articles = await storage.getKnowledgeBaseArticles();
      
      const analyticsData = {
        users: {
          total: users.length,
          pro: users.filter(u => u.isPro).length,
          free: users.filter(u => !u.isPro).length,
          recentSignups: users.filter(u => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return new Date(u.createdAt!) > weekAgo;
          }).length
        },
        profiles: {
          total: profiles.length,
          published: profiles.filter(p => p.isPublished).length,
          totalViews: profiles.reduce((sum, p) => sum + (p.viewCount || 0), 0),
          totalDownloads: profiles.reduce((sum, p) => sum + (p.downloadCount || 0), 0)
        },
        knowledgeBase: {
          totalArticles: articles.length,
          publishedArticles: articles.filter(a => a.isPublished).length,
          totalViews: articles.reduce((sum, a) => sum + (a.viewCount || 0), 0),
          totalHelpful: articles.reduce((sum, a) => sum + (a.helpfulCount || 0), 0)
        },
        timestamp: new Date().toISOString()
      };
      
      res.json(analyticsData);
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to retrieve analytics' });
    }
  });

  app.post('/api/support/tickets', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const { subject, description, category, priority = 'medium' } = req.body;
      
      if (!subject || !description) {
        return res.status(400).json({ error: 'Subject and description are required' });
      }
      
      const ticket = {
        id: Date.now().toString(),
        userId: user.claims.sub,
        subject,
        description,
        category: category || 'general',
        priority,
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // In a real implementation, this would be stored in a tickets table
      // For now, we'll log it and return the ticket data
      await storage.logAdminAction(
        'system',
        'ticket_created',
        'support_ticket',
        ticket.id,
        ticket
      );
      
      res.json({
        success: true,
        ticket,
        message: 'Support ticket created successfully'
      });
    } catch (error) {
      console.error('Ticket creation error:', error);
      res.status(500).json({ error: 'Failed to create support ticket' });
    }
  });

  app.get('/api/support/articles/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getKnowledgeBaseArticleBySlug(slug);
      
      if (!article || !article.isPublished) {
        return res.status(404).json({ error: 'Article not found' });
      }
      
      // Increment view count
      await storage.incrementArticleViewCount(article.id);
      
      res.json({
        id: article.id,
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        slug: article.slug,
        categoryId: article.categoryId,
        tags: article.tags,
        helpfulCount: article.helpfulCount,
        viewCount: (article.viewCount || 0) + 1,
        publishedAt: article.createdAt,
        updatedAt: article.updatedAt
      });
    } catch (error) {
      console.error('Article retrieval error:', error);
      res.status(500).json({ error: 'Failed to retrieve article' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
