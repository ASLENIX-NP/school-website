import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import { supabase } from "../config/supabase.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

const MAX_ACTIVE_ADMIN_SESSIONS = 4;
const ADMIN_SESSION_DAYS = 7;
const ADMIN_ACTIVE_STALE_HOURS = 24;

function normalizeRole(role) {
  return String(role || "admin")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

function getSessionExpiryDate() {
  return new Date(Date.now() + ADMIN_SESSION_DAYS * 24 * 60 * 60 * 1000);
}

function getClientIp(req) {
  const forwardedFor = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();

  return forwardedFor || req.ip || req.socket?.remoteAddress || "";
}

function getSessionDeviceKey(session = {}) {
  return `${session.user_agent || ""}|||${session.ip_address || ""}`;
}

async function revokeSessionIds(ids = []) {
  if (!Array.isArray(ids) || ids.length === 0) return;

  await supabase
    .from("admin_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .in("id", ids);
}

async function cleanupExpiredAdminSessions() {
  const now = new Date().toISOString();

  await supabase
    .from("admin_sessions")
    .update({ revoked_at: now })
    .is("revoked_at", null)
    .lte("expires_at", now);
}

async function cleanupStaleAdminSessions() {
  const now = new Date();
  const staleCutoff = new Date(
    now.getTime() - ADMIN_ACTIVE_STALE_HOURS * 60 * 60 * 1000
  ).toISOString();

  await supabase
    .from("admin_sessions")
    .update({ revoked_at: now.toISOString() })
    .is("revoked_at", null)
    .is("last_seen_at", null);

  await supabase
    .from("admin_sessions")
    .update({ revoked_at: now.toISOString() })
    .is("revoked_at", null)
    .lt("last_seen_at", staleCutoff);
}

async function cleanupDuplicateDeviceSessions(adminEmail) {
  const now = new Date().toISOString();

  const { data: sessions, error } = await supabase
    .from("admin_sessions")
    .select("id, token_id, user_agent, ip_address, expires_at, last_seen_at")
    .eq("admin_email", adminEmail)
    .is("revoked_at", null)
    .gt("expires_at", now);

  if (error || !Array.isArray(sessions)) return [];

  const sortedSessions = [...sessions].sort((a, b) => {
    const aTime = new Date(a.last_seen_at || a.expires_at || 0).getTime();
    const bTime = new Date(b.last_seen_at || b.expires_at || 0).getTime();

    return bTime - aTime;
  });

  const seenDeviceKeys = new Set();
  const duplicateIds = [];
  const uniqueSessions = [];

  for (const session of sortedSessions) {
    const key = getSessionDeviceKey(session);

    if (seenDeviceKeys.has(key)) {
      duplicateIds.push(session.id);
      continue;
    }

    seenDeviceKeys.add(key);
    uniqueSessions.push(session);
  }

  await revokeSessionIds(duplicateIds);

  return uniqueSessions;
}

async function cleanupAdminSessions(adminEmail) {
  await cleanupExpiredAdminSessions();
  await cleanupStaleAdminSessions();
  return cleanupDuplicateDeviceSessions(adminEmail);
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing in backend .env file.",
      });
    }

    const cleanEmail = String(email || "").trim();

    const { data: admin, error } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("admin_email", cleanEmail)
      .single();

    if (error || !admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email",
      });
    }

    if (admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const userAgent = req.headers["user-agent"] || "";
    const ipAddress = getClientIp(req);
    const now = new Date().toISOString();

    await cleanupAdminSessions(admin.admin_email);

    await supabase
      .from("admin_sessions")
      .update({ revoked_at: now })
      .eq("admin_email", admin.admin_email)
      .eq("user_agent", userAgent)
      .eq("ip_address", ipAddress)
      .is("revoked_at", null);

    const activeSessions = await cleanupDuplicateDeviceSessions(
      admin.admin_email
    );

    if ((activeSessions || []).length >= MAX_ACTIVE_ADMIN_SESSIONS) {
      return res.status(403).json({
        success: false,
        message:
          "Maximum admin device limit reached. Please logout from another device first.",
      });
    }

    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const device = result.os.name || "Unknown Device";
    const browser = result.browser.name || "Unknown Browser";

    await supabase.from("admin_login_activity").insert([
      {
        device,
        browser,
        location: "Kathmandu, Nepal",
        status: "Success",
      },
    ]);

    const normalizedRole = normalizeRole(admin.role);
    const tokenId = crypto.randomUUID();
    const expiresAt = getSessionExpiryDate().toISOString();

    const { error: sessionInsertError } = await supabase
      .from("admin_sessions")
      .insert([
        {
          admin_email: admin.admin_email,
          token_id: tokenId,
          user_agent: userAgent,
          ip_address: ipAddress,
          expires_at: expiresAt,
          last_seen_at: now,
        },
      ]);

    if (sessionInsertError) {
      console.error("Admin session insert error:", sessionInsertError);

      return res.status(500).json({
        success: false,
        message: "Could not create admin session.",
      });
    }

    const token = jwt.sign(
      {
        email: admin.admin_email,
        role: normalizedRole,
        tokenId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: `${ADMIN_SESSION_DAYS}d`,
      }
    );

    return res.json({
      success: true,
      token,
      admin: {
        email: admin.admin_email,
        role: normalizedRole,
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token || !process.env.JWT_SECRET) {
      return res.json({
        success: true,
        message: "Logged out.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.tokenId) {
      await supabase
        .from("admin_sessions")
        .update({ revoked_at: new Date().toISOString() })
        .eq("token_id", decoded.tokenId);
    }

    return res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.json({
      success: true,
      message: "Logged out.",
    });
  }
});

router.post("/logout-all", protectAdmin, async (req, res) => {
  try {
    await supabase
      .from("admin_sessions")
      .update({ revoked_at: new Date().toISOString() })
      .eq("admin_email", req.admin.email)
      .is("revoked_at", null);

    return res.json({
      success: true,
      message: "All admin devices logged out successfully.",
    });
  } catch (error) {
    console.error("Logout all admin sessions error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not logout all devices.",
    });
  }
});

router.get("/me", protectAdmin, async (req, res) => {
  res.status(200).json({
    success: true,
    admin: {
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

export default router;
