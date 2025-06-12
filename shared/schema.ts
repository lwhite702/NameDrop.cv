import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: varchar("username").unique(),
  isPro: boolean("is_pro").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  isAdmin: boolean("is_admin").default(false),
  isBanned: boolean("is_banned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  slug: varchar("slug").notNull().unique(),
  name: text("name"),
  tagline: text("tagline"),
  bio: text("bio"),
  skills: text("skills").array(),
  workHistory: jsonb("work_history"),
  projects: jsonb("projects"),
  socialLinks: jsonb("social_links"),
  externalLinks: jsonb("external_links"), // Link-in-bio tiles
  resumeUrl: text("resume_url"),
  customDomain: text("custom_domain"),
  customDomainVerified: boolean("custom_domain_verified").default(false),
  theme: varchar("theme").default("classic"),
  isPublished: boolean("is_published").default(false),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  ogImage: text("og_image"),
  qrCodeUrl: text("qr_code_url"),
  viewCount: integer("view_count").default(0),
  downloadCount: integer("download_count").default(0),
  linkClickCount: integer("link_click_count").default(0),
  lastSlugChange: timestamp("last_slug_change"),
  aiOptimizationScore: integer("ai_optimization_score"),
  lastAiOptimization: timestamp("last_ai_optimization"),
  aiSuggestions: jsonb("ai_suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profileViews = pgTable("profile_views", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const moderationReports = pgTable("moderation_reports", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  reportedBy: varchar("reported_by"),
  reason: text("reason"),
  status: varchar("status").default("pending"), // pending, reviewed, dismissed
  createdAt: timestamp("created_at").defaultNow(),
});

export const linkClicks = pgTable("link_clicks", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  linkId: varchar("link_id"), // External link ID
  linkUrl: text("link_url"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const domainVerifications = pgTable("domain_verifications", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  domain: varchar("domain").notNull(),
  verificationStatus: varchar("verification_status").default("pending"), // pending, verified, failed
  cnameTarget: varchar("cname_target").default("custom.namedrop.cv"),
  dnsRecords: jsonb("dns_records"),
  sslStatus: varchar("ssl_status").default("pending"), // pending, issued, failed
  lastChecked: timestamp("last_checked"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Knowledge Base tables
export const knowledgeBaseCategories = pgTable("knowledge_base_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  slug: varchar("slug").notNull().unique(),
  description: text("description"),
  icon: varchar("icon"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const knowledgeBaseArticles = pgTable("knowledge_base_articles", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => knowledgeBaseCategories.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  slug: varchar("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  metaTitle: varchar("meta_title"),
  metaDescription: text("meta_description"),
  featuredImage: varchar("featured_image"),
  author: varchar("author").notNull(),
  tags: text("tags").array(),
  sortOrder: integer("sort_order").default(0),
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  helpfulCount: integer("helpful_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key").notNull().unique(),
  value: text("value"),
  type: varchar("type").notNull(), // string, number, boolean, json
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  adminId: varchar("admin_id").notNull().references(() => users.id),
  action: varchar("action").notNull(),
  resourceType: varchar("resource_type").notNull(),
  resourceId: varchar("resource_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type KnowledgeBaseCategory = typeof knowledgeBaseCategories.$inferSelect;
export type InsertKnowledgeBaseCategory = typeof knowledgeBaseCategories.$inferInsert;

export type KnowledgeBaseArticle = typeof knowledgeBaseArticles.$inferSelect;
export type InsertKnowledgeBaseArticle = typeof knowledgeBaseArticles.$inferInsert;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = typeof adminLogs.$inferInsert;

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type ProfileView = typeof profileViews.$inferSelect;
export type ModerationReport = typeof moderationReports.$inferSelect;
export type LinkClick = typeof linkClicks.$inferSelect;
export type DomainVerification = typeof domainVerifications.$inferSelect;

// Work history and projects interfaces
export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  current: boolean;
}

export interface Project {
  name: string;
  description: string;
  url?: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface ExternalLink {
  id: string;
  label: string;
  url: string;
  icon?: string;
  clickCount: number;
  isActive: boolean;
}
