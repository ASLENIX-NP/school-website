import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UAParser } from "ua-parser-js";
import { supabase } from "../config/supabase.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

const MAX_ACTIVE_ADMIN_SESSIONS = 4;
const ADMIN_SESSION_DAYS = 7;

function normalizeRole(role) {
  return String(role || "admin")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

function getSessionExpiryDate() {
  return new Date(Date.now() + ADMIN_SESSION_DAYS * 24 * 60 * 60 * 1000);
}

async function cleanupExpiredAdminSessions() {
  const now = new Date().toISOString();

  await supabase
    .from("admin_sessions")
    .update({ revoked_at: now })
    .is("revoked_at", null)
    .lte("expires_at", now);
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

    await cleanupExpiredAdminSessions();

    const { data: activeSessions, error: activeSessionError } = await supabase
      .from("admin_sessions")
      .select("id")
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString());

    if (activeSessionError) {
      return res.status(500).json({
        success: false,
        message: "Could not check active admin sessions.",
      });
    }

    if ((activeSessions || []).length >= MAX_ACTIVE_ADMIN_SESSIONS) {
      return res.status(403).json({
        success: false,
        message:
          "Maximum admin device limit reached. Please logout from another device first.",
      });
    }

    const parser = new UAParser(req.headers["user-agent"]);
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
          user_agent: req.headers["user-agent"] || "",
          ip_address: req.ip || "",
          expires_at: expiresAt,
        },
      ]);

    if (sessionInsertError) {
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