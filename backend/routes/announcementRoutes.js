import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/* GET ALL */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("popup_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* CREATE */
router.post("/", async (req, res) => {
  try {
    const payload = {
      ...req.body,
      popup_order:
        req.body.popup_order === "" || req.body.popup_order === undefined
          ? null
          : req.body.popup_order,
    };

    const { data, error } = await supabase
      .from("announcements")
      .insert([payload])
      .select();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* UPDATE POPUP ORDER */
router.patch("/popup-order", async (req, res) => {
  try {
    const orders = Array.isArray(req.body.orders) ? req.body.orders : [];

    if (orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No popup order data received.",
      });
    }

    const updates = orders.map((item) =>
      supabase
        .from("announcements")
        .update({ popup_order: item.popup_order })
        .eq("id", item.id)
    );

    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);

    if (failed?.error) throw failed.error;

    res.json({
      success: true,
      message: "Popup order updated.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


/* RECORD ONE PUBLIC ANNOUNCEMENT VIEW */
router.post("/:id/view", async (req, res) => {
  try {
    const { data: currentAnnouncement, error: readError } = await supabase
      .from("announcements")
      .select("id, view_count")
      .eq("id", req.params.id)
      .single();

    if (readError || !currentAnnouncement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    const nextViewCount =
      Math.max(0, Number(currentAnnouncement.view_count) || 0) + 1;

    const { data, error } = await supabase
      .from("announcements")
      .update({
        view_count: nextViewCount,
      })
      .eq("id", req.params.id)
      .select("id, view_count")
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Record announcement view error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to record announcement view",
    });
  }
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const payload = {
      ...req.body,
      popup_order:
        req.body.popup_order === "" || req.body.popup_order === undefined
          ? null
          : req.body.popup_order,
    };

    const { data, error } = await supabase
      .from("announcements")
      .update(payload)
      .eq("id", req.params.id)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;
