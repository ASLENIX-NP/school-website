import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./config/supabase.js";

import healthRoutes from "./routes/healthRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import siteContentRoutes from "./routes/siteContentRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import noticeSettingsRoutes from "./routes/noticeSettingsRoutes.js";
import adminSettingsRoutes from "./routes/adminSettingsRoutes.js";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/health", healthRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/notice-settings", noticeSettingsRoutes);
app.use("/api/admin-settings", adminSettingsRoutes);

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name,
          email,
          phone,
          subject,
          message,
        },
      ])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Contact message sent successfully",
      data,
    });
  } catch (error) {
    console.error("Contact message server error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});