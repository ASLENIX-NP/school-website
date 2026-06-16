import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/* ==========================================
   GET ALL NOTICES
========================================== */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notices",
    });
  }
});

/* ==========================================
   GET TOP 3 NOTICES (Homepage)
========================================== */
router.get("/latest/top3", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
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
    res.status(500).json({
      success: false,
      message: "Failed to fetch notice",
    });
  }
});

router.delete("/", async (req, res) => {
    const { error } = await supabase
      .from("notices")
      .delete()
      .neq("id", 0);
  
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  
    res.json({
      success: true,
    });
  });

/* ==========================================
   CREATE NOTICE
========================================== */
router.post("/", async (req, res) => {
  try {
    const {
      title,
      category,
      notice_date,
      description,
      pdf_url,
      pinned,
    } = req.body;

    const { data, error } = await supabase
      .from("notices")
      .insert([
        {
          title,
          category,
          notice_date,
          description,
          pdf_url,
          pinned,
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
      message: "Notice created successfully",
      data,
    });
  } catch (error) {
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
    const {
      title,
      category,
      notice_date,
      description,
      pdf_url,
      pinned,
    } = req.body;

    const { data, error } = await supabase
      .from("notices")
      .update({
        title,
        category,
        notice_date,
        description,
        pdf_url,
        pinned,
      })
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
    res.status(500).json({
      success: false,
      message: "Failed to update notice",
    });
  }
});

/* ==========================================
   DELETE NOTICE
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
    res.status(500).json({
      success: false,
      message: "Failed to delete notice",
    });
  }
});

export default router;