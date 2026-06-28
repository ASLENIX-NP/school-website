import jwt from "jsonwebtoken";

function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
}

export const protectAdmin = (req, res, next) => {
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
        message: `Not authorized as admin. Current role: ${decoded?.role || "missing"}`,
      });
    }

    req.admin = {
      ...decoded,
      role,
    };

    next();
  } catch (error) {
    console.error("Admin auth middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};