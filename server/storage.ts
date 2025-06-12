import {
  users,
  profiles,
  profileViews,
  moderationReports,
  linkClicks,
  domainVerifications,
  knowledgeBaseCategories,
  knowledgeBaseArticles,
  siteSettings,
  adminLogs,
  type User,
  type UpsertUser,
  type InsertProfile,
  type Profile,
  type ProfileView,
  type ModerationReport,
  type LinkClick,
  type DomainVerification,
  type KnowledgeBaseCategory,
  type InsertKnowledgeBaseCategory,
  type KnowledgeBaseArticle,
  type InsertKnowledgeBaseArticle,
  type SiteSetting,
  type InsertSiteSetting,
  type AdminLog,
  type InsertAdminLog,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, gte, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  upgradeUserToPro(userId: string): Promise<User>;
  
  // Profile operations
  createProfile(profile: InsertProfile): Promise<Profile>;
  getProfile(userId: string): Promise<Profile | undefined>;
  getProfileBySlug(slug: string): Promise<Profile | undefined>;
  updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile>;
  publishProfile(userId: string): Promise<Profile>;
  unpublishProfile(userId: string): Promise<Profile>;
  incrementViewCount(profileId: number): Promise<void>;
  incrementDownloadCount(profileId: number): Promise<void>;
  
  // Analytics operations
  recordProfileView(profileId: number, ipAddress: string, userAgent: string, referrer?: string): Promise<ProfileView>;
  getProfileAnalytics(profileId: number): Promise<{ views: number; downloads: number; linkClicks: number; }>;
  recordLinkClick(profileId: number, linkId: string, linkUrl: string, ipAddress: string, userAgent: string, referrer?: string): Promise<LinkClick>;
  
  // Domain operations
  addCustomDomain(profileId: number, domain: string): Promise<DomainVerification>;
  verifyDomain(domain: string): Promise<DomainVerification>;
  getProfileByDomain(domain: string): Promise<Profile | undefined>;
  canChangeSlug(userId: string): Promise<boolean>;
  updateSlug(userId: string, newSlug: string): Promise<Profile>;
  
  // Link management
  generateQRCode(profileId: number): Promise<string>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllProfiles(): Promise<Profile[]>;
  banUser(userId: string): Promise<User>;
  unbanUser(userId: string): Promise<User>;
  createModerationReport(profileId: number, reportedBy: string, reason: string): Promise<ModerationReport>;
  getModerationReports(): Promise<ModerationReport[]>;
  updateModerationReport(reportId: number, status: string): Promise<ModerationReport>;
  logAdminAction(adminId: string, action: string, resourceType: string, resourceId?: string, details?: any, ipAddress?: string, userAgent?: string): Promise<AdminLog>;
  getAdminLogs(limit?: number): Promise<AdminLog[]>;
  
  // Knowledge Base operations
  createKnowledgeBaseCategory(category: InsertKnowledgeBaseCategory): Promise<KnowledgeBaseCategory>;
  getKnowledgeBaseCategories(): Promise<KnowledgeBaseCategory[]>;
  updateKnowledgeBaseCategory(id: number, updates: Partial<InsertKnowledgeBaseCategory>): Promise<KnowledgeBaseCategory>;
  deleteKnowledgeBaseCategory(id: number): Promise<void>;
  
  createKnowledgeBaseArticle(article: InsertKnowledgeBaseArticle): Promise<KnowledgeBaseArticle>;
  getKnowledgeBaseArticles(categoryId?: number, published?: boolean): Promise<KnowledgeBaseArticle[]>;
  getKnowledgeBaseArticleBySlug(slug: string): Promise<KnowledgeBaseArticle | undefined>;
  updateKnowledgeBaseArticle(id: number, updates: Partial<InsertKnowledgeBaseArticle>): Promise<KnowledgeBaseArticle>;
  deleteKnowledgeBaseArticle(id: number): Promise<void>;
  incrementArticleViewCount(id: number): Promise<void>;
  incrementArticleHelpfulCount(id: number): Promise<void>;
  
  // Site Settings operations
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  updateSiteSetting(key: string, value: string, type: string): Promise<SiteSetting>;
  createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async upgradeUserToPro(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        isPro: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Profile operations
  async createProfile(profile: InsertProfile): Promise<Profile> {
    const [newProfile] = await db
      .insert(profiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async getProfile(userId: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId));
    return profile;
  }

  async getProfileBySlug(slug: string): Promise<Profile | undefined> {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.slug, slug));
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  }

  async publishProfile(userId: string): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set({
        isPublished: true,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  }

  async unpublishProfile(userId: string): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set({
        isPublished: false,
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  }

  async incrementViewCount(profileId: number): Promise<void> {
    await db
      .update(profiles)
      .set({
        viewCount: sql`${profiles.viewCount} + 1`,
      })
      .where(eq(profiles.id, profileId));
  }

  async incrementDownloadCount(profileId: number): Promise<void> {
    await db
      .update(profiles)
      .set({
        downloadCount: sql`${profiles.downloadCount} + 1`,
      })
      .where(eq(profiles.id, profileId));
  }

  // Analytics operations
  async recordProfileView(profileId: number, ipAddress: string, userAgent: string, referrer?: string): Promise<ProfileView> {
    const [view] = await db
      .insert(profileViews)
      .values({
        profileId,
        ipAddress,
        userAgent,
        referrer,
      })
      .returning();
    return view;
  }

  async getProfileAnalytics(profileId: number): Promise<{ views: number; downloads: number; linkClicks: number; }> {
    const [profile] = await db
      .select({
        views: profiles.viewCount,
        downloads: profiles.downloadCount,
        linkClicks: profiles.linkClickCount,
      })
      .from(profiles)
      .where(eq(profiles.id, profileId));
    
    return {
      views: profile?.views || 0,
      downloads: profile?.downloads || 0,
      linkClicks: profile?.linkClicks || 0,
    };
  }

  async recordLinkClick(profileId: number, linkId: string, linkUrl: string, ipAddress: string, userAgent: string, referrer?: string): Promise<LinkClick> {
    // Record the click event
    const [click] = await db
      .insert(linkClicks)
      .values({
        profileId,
        linkId,
        linkUrl,
        ipAddress,
        userAgent,
        referrer,
      })
      .returning();

    // Increment the profile's link click count
    await db
      .update(profiles)
      .set({
        linkClickCount: sql`${profiles.linkClickCount} + 1`,
      })
      .where(eq(profiles.id, profileId));

    return click;
  }

  // Domain operations
  async addCustomDomain(profileId: number, domain: string): Promise<DomainVerification> {
    const [verification] = await db
      .insert(domainVerifications)
      .values({
        profileId,
        domain,
        verificationStatus: "pending",
        cnameTarget: "custom.namedrop.cv",
      })
      .returning();
    return verification;
  }

  async verifyDomain(domain: string): Promise<DomainVerification> {
    const [verification] = await db
      .update(domainVerifications)
      .set({
        verificationStatus: "verified",
        lastChecked: new Date(),
      })
      .where(eq(domainVerifications.domain, domain))
      .returning();
    return verification;
  }

  async getProfileByDomain(domain: string): Promise<Profile | undefined> {
    // Check if it's a subdomain (username.namedrop.cv)
    if (domain.includes('.namedrop.cv') && !domain.startsWith('www.')) {
      const subdomain = domain.split('.')[0];
      const [profile] = await db
        .select()
        .from(profiles)
        .where(and(eq(profiles.slug, subdomain), eq(profiles.isPublished, true)));
      return profile;
    }

    // Check custom domains
    const [verification] = await db
      .select()
      .from(domainVerifications)
      .innerJoin(profiles, eq(domainVerifications.profileId, profiles.id))
      .where(and(
        eq(domainVerifications.domain, domain),
        eq(domainVerifications.verificationStatus, "verified"),
        eq(profiles.isPublished, true)
      ));
    
    return verification?.profiles;
  }

  async canChangeSlug(userId: string): Promise<boolean> {
    const [profile] = await db
      .select({ lastSlugChange: profiles.lastSlugChange })
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (!profile?.lastSlugChange) return true;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return profile.lastSlugChange < thirtyDaysAgo;
  }

  async updateSlug(userId: string, newSlug: string): Promise<Profile> {
    const [profile] = await db
      .update(profiles)
      .set({
        slug: newSlug,
        lastSlugChange: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, userId))
      .returning();
    return profile;
  }

  async generateQRCode(profileId: number): Promise<string> {
    const [profile] = await db
      .select({ slug: profiles.slug })
      .from(profiles)
      .where(eq(profiles.id, profileId));

    if (!profile) throw new Error("Profile not found");

    const profileUrl = `https://${profile.slug}.namedrop.cv`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
    
    // Update the profile with QR code URL
    await db
      .update(profiles)
      .set({
        qrCodeUrl,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, profileId));

    return qrCodeUrl;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles).orderBy(desc(profiles.createdAt));
  }

  async banUser(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        isBanned: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async unbanUser(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        isBanned: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async createModerationReport(profileId: number, reportedBy: string, reason: string): Promise<ModerationReport> {
    const [report] = await db
      .insert(moderationReports)
      .values({
        profileId,
        reportedBy,
        reason,
      })
      .returning();
    return report;
  }

  async getModerationReports(): Promise<ModerationReport[]> {
    return await db
      .select()
      .from(moderationReports)
      .orderBy(desc(moderationReports.createdAt));
  }

  async updateModerationReport(reportId: number, status: string): Promise<ModerationReport> {
    const [report] = await db
      .update(moderationReports)
      .set({
        status,
      })
      .where(eq(moderationReports.id, reportId))
      .returning();
    return report;
  }

  async logAdminAction(adminId: string, action: string, resourceType: string, resourceId?: string, details?: any, ipAddress?: string, userAgent?: string): Promise<AdminLog> {
    const [log] = await db
      .insert(adminLogs)
      .values({
        adminId,
        action,
        resourceType,
        resourceId,
        details,
        ipAddress,
        userAgent,
      })
      .returning();
    return log;
  }

  async getAdminLogs(limit: number = 50): Promise<AdminLog[]> {
    return await db
      .select()
      .from(adminLogs)
      .orderBy(desc(adminLogs.createdAt))
      .limit(limit);
  }

  // Knowledge Base operations
  async createKnowledgeBaseCategory(category: InsertKnowledgeBaseCategory): Promise<KnowledgeBaseCategory> {
    const [newCategory] = await db
      .insert(knowledgeBaseCategories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getKnowledgeBaseCategories(): Promise<KnowledgeBaseCategory[]> {
    return await db
      .select()
      .from(knowledgeBaseCategories)
      .where(eq(knowledgeBaseCategories.isActive, true))
      .orderBy(knowledgeBaseCategories.sortOrder);
  }

  async updateKnowledgeBaseCategory(id: number, updates: Partial<InsertKnowledgeBaseCategory>): Promise<KnowledgeBaseCategory> {
    const [updated] = await db
      .update(knowledgeBaseCategories)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(knowledgeBaseCategories.id, id))
      .returning();
    return updated;
  }

  async deleteKnowledgeBaseCategory(id: number): Promise<void> {
    await db
      .update(knowledgeBaseCategories)
      .set({ isActive: false })
      .where(eq(knowledgeBaseCategories.id, id));
  }

  async createKnowledgeBaseArticle(article: InsertKnowledgeBaseArticle): Promise<KnowledgeBaseArticle> {
    const [newArticle] = await db
      .insert(knowledgeBaseArticles)
      .values(article)
      .returning();
    return newArticle;
  }

  async getKnowledgeBaseArticles(categoryId?: number, published?: boolean): Promise<KnowledgeBaseArticle[]> {
    let query = db.select().from(knowledgeBaseArticles);
    
    const conditions = [];
    if (categoryId) {
      conditions.push(eq(knowledgeBaseArticles.categoryId, categoryId));
    }
    if (published !== undefined) {
      conditions.push(eq(knowledgeBaseArticles.isPublished, published));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(knowledgeBaseArticles.sortOrder, desc(knowledgeBaseArticles.createdAt));
  }

  async getKnowledgeBaseArticleBySlug(slug: string): Promise<KnowledgeBaseArticle | undefined> {
    const [article] = await db
      .select()
      .from(knowledgeBaseArticles)
      .where(eq(knowledgeBaseArticles.slug, slug));
    return article;
  }

  async updateKnowledgeBaseArticle(id: number, updates: Partial<InsertKnowledgeBaseArticle>): Promise<KnowledgeBaseArticle> {
    const [updated] = await db
      .update(knowledgeBaseArticles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(knowledgeBaseArticles.id, id))
      .returning();
    return updated;
  }

  async deleteKnowledgeBaseArticle(id: number): Promise<void> {
    await db
      .delete(knowledgeBaseArticles)
      .where(eq(knowledgeBaseArticles.id, id));
  }

  async incrementArticleViewCount(id: number): Promise<void> {
    await db
      .update(knowledgeBaseArticles)
      .set({ 
        viewCount: sql`${knowledgeBaseArticles.viewCount} + 1` 
      })
      .where(eq(knowledgeBaseArticles.id, id));
  }

  async incrementArticleHelpfulCount(id: number): Promise<void> {
    await db
      .update(knowledgeBaseArticles)
      .set({ 
        helpfulCount: sql`${knowledgeBaseArticles.helpfulCount} + 1` 
      })
      .where(eq(knowledgeBaseArticles.id, id));
  }

  // Site Settings operations
  async getSiteSettings(): Promise<SiteSetting[]> {
    return await db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, key));
    return setting;
  }

  async updateSiteSetting(key: string, value: string, type: string): Promise<SiteSetting> {
    const [updated] = await db
      .insert(siteSettings)
      .values({ key, value, type, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, type, updatedAt: new Date() }
      })
      .returning();
    return updated;
  }

  async createSiteSetting(setting: InsertSiteSetting): Promise<SiteSetting> {
    const [newSetting] = await db
      .insert(siteSettings)
      .values(setting)
      .returning();
    return newSetting;
  }
}

export const storage = new DatabaseStorage();
