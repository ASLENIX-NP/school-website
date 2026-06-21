import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

function cleanNoticePayload(body = {}) {
  return {
    title: String(body.title || "").trim(),
    category: String(body.category || "").trim(),
    notice_date: body.notice_date || null,
    description: String(body.description || "").trim(),
    pdf_url: body.pdf_url || "",
    pinned: Boolean(body.pinned),
  };
}

/* ==========================================
   GET ALL NOTICES
   Newest added notice first
========================================== */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false })
      .order("notice_date", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Fetch notices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
});

/* ==========================================
   GET TOP 3 NOTICES FOR HOMEPAGE
   Newest added notices only
========================================== */
router.get("/latest/top3", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false })
      .order("notice_date", { ascending: false })
      .limit(3);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      data: data || [],
    });
  } catch (error) {
    console.error("Fetch latest notices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch latest notices",
    });
  }
});

/* ==========================================
   GET SINGLE NOTICE
========================================== */
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Fetch single notice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notice",
    });
  }
});

/* ==========================================
   CREATE NOTICE
========================================== */
router.post("/", async (req, res) => {
  try {
    const notice = cleanNoticePayload(req.body);

    if (!notice.title) {
      return res.status(400).json({
        success: false,
        message: "Notice title is required",
      });
    }

    const { data, error } = await supabase
      .from("notices")
      .insert([notice])
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data,
    });
  } catch (error) {
    console.error("Create notice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create notice",
    });
  }
});

/* ==========================================
   UPDATE NOTICE
========================================== */
router.put("/:id", async (req, res) => {
  try {
    const notice = cleanNoticePayload(req.body);

    if (!notice.title) {
      return res.status(400).json({
        success: false,
        message: "Notice title is required",
      });
    }

    const { data, error } = await supabase
      .from("notices")
      .update(notice)
      .eq("id", req.params.id)
      .select();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update notice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update notice",
    });
  }
});

/* ==========================================
   DELETE ONE NOTICE
   Used by AdminNotices delete button
========================================== */
router.delete("/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("notices")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Delete notice error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete notice",
    });
  }
});

/* ==========================================
   DELETE ALL NOTICES
   Keep this only for emergency/admin bulk logic
========================================== */
router.delete("/", async (req, res) => {
  try {
    const { error } = await supabase
      .from("notices")
      .delete()
      .not("id", "is", null);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "All notices deleted successfully",
    });
  } catch (error) {
    console.error("Delete all notices error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete notices",
    });
  }
});

export default router;