import express from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { UAParser } from "ua-parser-js";
import { supabase } from "../config/supabase.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

const MAX_ACTIVE_ADMIN_SESSIONS = 4;
const ADMIN_SESSION_DAYS = 7;
const ADMIN_ACTIVE_STALE_HOURS = 24;
const PASSWORD_RESET_TOKEN_MINUTES = 30;

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


function getFrontendUrl() {
  return String(
    process.env.FRONTEND_URL || "https://baljagriti.aslenix.tech"
  ).replace(/\/+$/, "");
}

function hashResetToken(token) {
  return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function getPasswordResetExpiryDate() {
  return new Date(Date.now() + PASSWORD_RESET_TOKEN_MINUTES * 60 * 1000);
}

async function sendPasswordResetEmail({ to, resetUrl }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing in backend environment.");
  }

  const from =
    process.env.RESET_EMAIL_FROM ||
    "Baljagriti School <reset@noreply.aslenix.tech>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Reset your Baljagriti admin password",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
          <h2 style="margin-bottom: 10px;">Baljagriti Admin Password Reset</h2>
          <p>A password reset was requested for the Baljagriti School admin panel.</p>
          <p>This link will expire in ${PASSWORD_RESET_TOKEN_MINUTES} minutes.</p>
          <p>
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 18px; background: #168A3A; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 700;">
              Reset Password
            </a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #334155;">${resetUrl}</p>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `,
    }),
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`Resend email failed: ${responseText}`);
  }
}

async function isPasswordMatch(plainPassword, storedPassword) {
  const cleanPlainPassword = String(plainPassword || "");
  const cleanStoredPassword = String(storedPassword || "");

  if (!cleanStoredPassword) return false;

  if (
    cleanStoredPassword.startsWith("$2a$") ||
    cleanStoredPassword.startsWith("$2b$") ||
    cleanStoredPassword.startsWith("$2y$")
  ) {
    return bcrypt.compare(cleanPlainPassword, cleanStoredPassword);
  }

  return cleanStoredPassword === cleanPlainPassword;
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


router.post("/forgot-password", async (req, res) => {
  const genericMessage =
    "If this admin email exists, a password reset link has been sent.";

  try {
    const cleanEmail = String(req.body?.email || "").trim();

    if (!cleanEmail) {
      return res.status(400).json({
        success: false,
        message: "Admin email is required.",
      });
    }

    const { data: admin, error } = await supabase
      .from("admin_settings")
      .select("admin_email")
      .eq("admin_email", cleanEmail)
      .maybeSingle();

    if (error) {
      console.error("Forgot password admin lookup error:", error);

      return res.status(500).json({
        success: false,
        message: "Could not check admin account.",
      });
    }

    if (!admin) {
      return res.json({
        success: true,
        message: genericMessage,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = hashResetToken(resetToken);
    const expiresAt = getPasswordResetExpiryDate().toISOString();

    const { error: updateError } = await supabase
      .from("admin_settings")
      .update({
        reset_token_hash: resetTokenHash,
        reset_token_expires_at: expiresAt,
        reset_token_used_at: null,
      })
      .eq("admin_email", cleanEmail);

    if (updateError) {
      console.error("Forgot password token save error:", updateError);

      return res.status(500).json({
        success: false,
        message:
          "Could not create reset token. Please make sure reset columns are added in Supabase.",
      });
    }

    const resetUrl = `${getFrontendUrl()}/admin/reset-password?email=${encodeURIComponent(
      cleanEmail
    )}&token=${resetToken}`;

    await sendPasswordResetEmail({
      to: cleanEmail,
      resetUrl,
    });

    return res.json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Could not send reset email. Please try again later.",
    });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const cleanEmail = String(req.body?.email || "").trim();
    const token = String(req.body?.token || "").trim();
    const password = String(req.body?.password || "").trim();

    if (!cleanEmail || !token || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, reset token, and new password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const { data: admin, error } = await supabase
      .from("admin_settings")
      .select(
        "admin_email, reset_token_hash, reset_token_expires_at, reset_token_used_at"
      )
      .eq("admin_email", cleanEmail)
      .maybeSingle();

    if (error || !admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link.",
      });
    }

    const tokenHash = hashResetToken(token);
    const savedTokenHash = String(admin.reset_token_hash || "");
    const expiresAt = admin.reset_token_expires_at
      ? new Date(admin.reset_token_expires_at).getTime()
      : 0;

    if (
      !savedTokenHash ||
      savedTokenHash !== tokenHash ||
      admin.reset_token_used_at ||
      !expiresAt ||
      Date.now() > expiresAt
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("admin_settings")
      .update({
        password: hashedPassword,
        reset_token_hash: null,
        reset_token_expires_at: null,
        reset_token_used_at: now,
      })
      .eq("admin_email", cleanEmail);

    if (updateError) {
      console.error("Reset password update error:", updateError);

      return res.status(500).json({
        success: false,
        message: "Could not update password.",
      });
    }

    await supabase
      .from("admin_sessions")
      .update({ revoked_at: now })
      .eq("admin_email", cleanEmail)
      .is("revoked_at", null);

    return res.json({
      success: true,
      message: "Password reset successfully. Please login again.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Could not reset password.",
    });
  }
});


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

    const passwordMatches = await isPasswordMatch(password, admin.password);

    if (!passwordMatches) {
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
