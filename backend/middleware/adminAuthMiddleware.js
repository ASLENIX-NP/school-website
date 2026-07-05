import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";

function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is missing in backend .env file.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const role = normalizeRole(decoded.role);
    const allowedRoles = ["admin", "super admin"];

    if (!decoded || !allowedRoles.includes(role)) {
      return res.status(401).json({
        success: false,
        message: `Not authorized as admin. Current role: ${
          decoded?.role || "missing"
        }`,
      });
    }

    if (!decoded.tokenId) {
      return res.status(401).json({
        success: false,
        message: "Admin session expired. Please login again.",
      });
    }

    const now = new Date().toISOString();

    const { data: activeSession, error: sessionError } = await supabase
      .from("admin_sessions")
      .select("id, token_id, admin_email, expires_at, revoked_at")
      .eq("token_id", decoded.tokenId)
      .is("revoked_at", null)
      .gt("expires_at", now)
      .maybeSingle();

    if (sessionError || !activeSession) {
      return res.status(401).json({
        success: false,
        message: "Admin session expired or logged out.",
      });
    }

    await supabase
      .from("admin_sessions")
      .update({ last_seen_at: now })
      .eq("token_id", decoded.tokenId);

    req.admin = {
      ...decoded,
      role,
    };

    req.adminSession = activeSession;

    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};