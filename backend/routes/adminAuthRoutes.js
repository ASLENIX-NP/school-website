import express from "express";
import jwt from "jsonwebtoken";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
      });
    }

    const token = jwt.sign(
      {
        email,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        email,
        role: "admin",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error during admin login.",
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
