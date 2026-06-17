import express from "express";
import jwt from "jsonwebtoken";
import { UAParser } from "ua-parser-js";
import { supabase } from "../config/supabase.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";


const router = express.Router();
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: admin, error } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("admin_email", email)
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
    const parser = new UAParser(req.headers["user-agent"]);
const result = parser.getResult();

const device =
  result.os.name || "Unknown Device";

const browser =
  result.browser.name || "Unknown Browser";

await supabase
  .from("admin_login_activity")
  .insert([
    {
      device,
      browser,
      location: "Kathmandu, Nepal",
      status: "Success",
    },
  ]);

    const token = jwt.sign(
      {
        email: admin.admin_email,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      success: true,
      token,
      admin: {
        email: admin.admin_email,
        role: admin.role,
      },
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
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
