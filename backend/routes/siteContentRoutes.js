import express from "express";
import { supabase } from "../config/supabase.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/:section", async (req, res) => {
  try {
    const { section } = req.params;

    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("section", section)
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!data) {
      return res.status(200).json({
        success: true,
        data: {
          section,
          content: {},
        },
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching site content.",
    });
  }
});

router.put("/:section", protectAdmin, async (req, res) => {
  try {
    const { section } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== "object") {
      return res.status(400).json({
        success: false,
        message: "Content object is required.",
      });
    }

    const { data, error } = await supabase
      .from("site_content")
      .upsert(
        {
          section,
          content,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "section",
        }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Site content updated successfully.",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while updating site content.",
    });
  }
});

export default router;