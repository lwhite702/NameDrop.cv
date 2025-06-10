import {
  users,
  profiles,
  profileViews,
  moderationReports,
  linkClicks,
  domainVerifications,
  type User,
  type UpsertUser,
  type InsertProfile,
  type Profile,
  type ProfileView,
  type ModerationReport,
  type LinkClick,
  type DomainVerification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, gte } from "drizzle-orm";

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
  getProfileAnalytics(profileId: number): Promise<{ views: number; downloads: number; }>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllProfiles(): Promise<Profile[]>;
  banUser(userId: string): Promise<User>;
  unbanUser(userId: string): Promise<User>;
  createModerationReport(profileId: number, reportedBy: string, reason: string): Promise<ModerationReport>;
  getModerationReports(): Promise<ModerationReport[]>;
  updateModerationReport(reportId: number, status: string): Promise<ModerationReport>;
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
        viewCount: profiles.viewCount + 1,
      })
      .where(eq(profiles.id, profileId));
  }

  async incrementDownloadCount(profileId: number): Promise<void> {
    await db
      .update(profiles)
      .set({
        downloadCount: profiles.downloadCount + 1,
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

  async getProfileAnalytics(profileId: number): Promise<{ views: number; downloads: number; }> {
    const [profile] = await db
      .select({
        views: profiles.viewCount,
        downloads: profiles.downloadCount,
      })
      .from(profiles)
      .where(eq(profiles.id, profileId));
    
    return {
      views: profile?.views || 0,
      downloads: profile?.downloads || 0,
    };
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
}

export const storage = new DatabaseStorage();
