import type { RequestHandler } from "express";
import { storage } from "./storage";

export const isAdmin: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.claims?.sub) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const dbUser = await storage.getUser(user.claims.sub);
    if (!dbUser || !dbUser.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Add user to request for logging
    req.adminUser = dbUser;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to log admin actions
export const logAdminAction = async (
  req: any,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: any
) => {
  if (req.adminUser) {
    await storage.logAdminAction(
      req.adminUser.id,
      action,
      resourceType,
      resourceId,
      details,
      req.ip,
      req.get("User-Agent")
    );
  }
};