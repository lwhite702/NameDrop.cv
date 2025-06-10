import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProfileSchema } from "@shared/schema";
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
  // Subdomain and custom domain routing middleware
  app.use(async (req, res, next) => {
    const host = req.get('host') || '';
    
    // Skip for API routes and main domain
    if (req.path.startsWith('/api/') || host === 'namedrop.cv' || host.startsWith('www.')) {
      return next();
    }
    
    try {
      const profile = await storage.getProfileByDomain(host);
      if (profile) {
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
    } catch (error) {
      console.error('Domain routing error:', error);
    }
    
    // 404 for unknown domains/subdomains
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
  });

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

  const httpServer = createServer(app);
  return httpServer;
}
