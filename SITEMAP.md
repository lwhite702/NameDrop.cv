# NameDrop CV - Complete Sitemap

## Public Pages (Accessible without authentication)

### Main Site
- `/` - Landing page with hero, features, pricing tiers, and testimonials
- `/preview/demo` - Demo CV preview showcasing platform capabilities
- `/preview/:slug` - Public CV profiles (username.namedrop.cv format)
- `/pricing` - Pricing plans (Free vs Pro features)
- `/blog` - Blog homepage with latest articles
- `/blog/:slug` - Individual blog posts
- `/knowledge-base` - Public knowledge base homepage
- `/knowledge-base/:slug` - Individual knowledge base articles

### Legal & Support
- `/terms` - Terms of Service
- `/privacy` - Privacy Policy  
- `/cookie-policy` - Cookie Policy
- `/help` - Help center and FAQ

### Authentication
- `/api/login` - Login via Replit Auth
- `/api/logout` - Logout endpoint
- `/api/callback` - OAuth callback

## Authenticated User Pages

### Core Application
- `/` - User dashboard (redirects from landing when authenticated)
- `/dashboard` - Analytics, profile management, Pro features
- `/onboarding` - Initial setup wizard for new users
- `/editor` - CV builder and editor interface
- `/settings` - Account settings and preferences

### Pro Features
- `/cv-wizard` - AI-powered CV optimization suggestions (Pro only)
- `/subscribe` - Subscription management and billing

### Custom Domains & Subdomains
- `username.namedrop.cv` - User's public CV profile
- `custom-domain.com` - Custom domain pointing to user's CV (Pro feature)

## Admin Area (Admin users only)

### Admin Dashboard
- `/admin` - Main admin dashboard with overview metrics
- `/admin?tab=overview` - Platform statistics and key metrics
- `/admin?tab=users` - User management (ban/unban, view Pro status)
- `/admin?tab=profiles` - CV profile moderation and management
- `/admin?tab=knowledge-base` - Knowledge base content management
- `/admin?tab=settings` - Site-wide settings and configuration
- `/admin?tab=logs` - Admin activity logs and audit trail

## API Endpoints

### Authentication & User Management
- `GET /api/auth/user` - Get current user info
- `POST /api/users/upgrade` - Upgrade to Pro subscription
- `GET /api/users/subscription` - Get subscription status

### Profile & CV Management
- `GET /api/profiles/:userId` - Get user's CV profile
- `POST /api/profiles` - Create new CV profile
- `PUT /api/profiles/:userId` - Update CV profile
- `POST /api/profiles/:userId/publish` - Publish CV profile
- `POST /api/profiles/:userId/unpublish` - Unpublish CV profile
- `GET /api/profiles/:slug/public` - Get public CV profile
- `POST /api/profiles/:profileId/view` - Record profile view
- `POST /api/profiles/:profileId/download` - Record CV download
- `GET /api/profiles/:profileId/analytics` - Get profile analytics

### AI Features (Pro)
- `POST /api/ai/cv-suggestions` - Get AI-powered CV optimization suggestions
- `POST /api/ai/optimize-section` - Optimize specific CV section with AI

### Custom Domains (Pro)
- `POST /api/domains/verify` - Verify custom domain ownership
- `GET /api/domains/:domain/status` - Check domain verification status
- `POST /api/domains/:domain/ssl` - Request SSL certificate

### Integrations
- `GET /api/integrations/preppair/discount` - Get PrepPair discount code
- `POST /api/integrations/resumeformatter/import` - Import from ResumeFormatter

### Knowledge Base (Public)
- `GET /api/knowledge-base/categories` - Get all categories
- `GET /api/knowledge-base/articles` - Get published articles
- `GET /api/knowledge-base/articles/:slug` - Get specific article
- `POST /api/knowledge-base/articles/:id/helpful` - Mark article as helpful

### Admin API Endpoints
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/profiles` - Get all profiles (admin only)
- `POST /api/admin/users/:userId/ban` - Ban user (admin only)
- `POST /api/admin/users/:userId/unban` - Unban user (admin only)
- `GET /api/admin/logs` - Get admin activity logs
- `GET /api/admin/knowledge-base/categories` - Manage KB categories
- `POST /api/admin/knowledge-base/categories` - Create KB category
- `PUT /api/admin/knowledge-base/categories/:id` - Update KB category
- `DELETE /api/admin/knowledge-base/categories/:id` - Delete KB category
- `GET /api/admin/knowledge-base/articles` - Manage KB articles
- `POST /api/admin/knowledge-base/articles` - Create KB article
- `PUT /api/admin/knowledge-base/articles/:id` - Update KB article
- `DELETE /api/admin/knowledge-base/articles/:id` - Delete KB article
- `GET /api/admin/settings` - Get site settings
- `PUT /api/admin/settings/:key` - Update site setting

### Payment & Billing
- `POST /api/stripe/create-checkout` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `GET /api/billing/portal` - Access billing portal

## Database Schema

### Core Tables
- `users` - User accounts with Replit Auth integration
- `profiles` - CV profiles with content and settings
- `sessions` - User session management (required for Replit Auth)

### Analytics & Tracking
- `profile_views` - Track profile visits with analytics
- `link_clicks` - Track external link clicks from CVs
- `domain_verifications` - Custom domain verification status

### Knowledge Base
- `knowledge_base_categories` - Article categories and organization
- `knowledge_base_articles` - Help articles and documentation
- `site_settings` - Global site configuration

### Admin & Moderation
- `moderation_reports` - User-generated content reports
- `admin_logs` - Admin action audit trail

## Key Features

### Free Tier
- Basic CV builder with templates
- username.namedrop.cv subdomain
- Basic analytics (views, downloads)
- Standard export options

### Pro Tier ($9/month)
- AI-powered CV optimization suggestions
- Custom domain support with SSL
- Advanced analytics and insights
- Priority support
- 50% discount on PrepPair.me
- Integration with ResumeFormatter.io
- Advanced export options

### Admin Features
- Complete user and content management
- Knowledge base content management
- Site-wide settings and configuration
- Comprehensive activity logging
- Moderation tools and reporting

## SEO & Marketing

### Blog Integration
- Technical tutorials and CV best practices
- Industry insights and career advice
- Platform updates and feature announcements
- Guest posts from career experts

### Knowledge Base Categories
- Getting Started
- CV Writing Tips
- Platform Features
- Troubleshooting
- Pro Features
- Integrations

## Security & Compliance

### Authentication
- Replit OpenID Connect integration
- Secure session management
- Admin role-based access control

### Data Protection
- GDPR-compliant privacy controls
- Secure data storage and transmission
- Regular security audits and monitoring

### Performance
- CDN integration for global content delivery
- Database optimization and caching
- Mobile-first responsive design

This comprehensive sitemap covers all aspects of the NameDrop CV platform, from public-facing pages to admin functionality, ensuring a complete professional CV creation and publishing solution.