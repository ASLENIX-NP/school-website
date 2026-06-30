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
import announcementRoutes from "./routes/announcementRoutes.js";
console.log("JWT_SECRET =", process.env.JWT_SECRET);

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
app.use("/api/announcements", announcementRoutes);

function normalizePhone(phone = "") {
  return String(phone).replace(/[^\d+]/g, "").trim();
}

function isValidPhone(phone = "") {
  const cleaned = normalizePhone(phone);

  // Accepts Nepal/international style numbers:
  // 10 digits local, or +countrycode with 7 to 15 total digits.
  const digitsOnly = cleaned.replace(/\D/g, "");

  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

app.post("/api/contact", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      source = "contact",
    } = req.body;

    const cleanName = String(name || "").trim();
    const cleanEmail = String(email || "").trim();
    const cleanPhone = normalizePhone(phone);
    const cleanSubject = String(subject || "").trim();
    const cleanMessage = String(message || "").trim();

    const cleanSource =
      source === "admission" || source === "contact" ? source : "contact";

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, and message are required.",
      });
    }

    if (!isValidPhone(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    const { data, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          source: cleanSource,
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          subject: cleanSubject,
          message: cleanMessage,
          is_read: false,
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
      message: "Message sent successfully.",
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

app.get("/api/contact-messages", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Get contact messages error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.patch("/api/contact-messages/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_read } = req.body;

    const { data, error } = await supabase
      .from("contact_messages")
      .update({ is_read: Boolean(is_read) })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: Boolean(is_read) ? "Marked as read." : "Marked as unread.",
      data,
    });
  } catch (error) {
    console.error("Update message read status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.delete("/api/contact-messages/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact message error:", error);

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