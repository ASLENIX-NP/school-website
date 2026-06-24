import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

/* GET ALL */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

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

/* CREATE */
router.post("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .insert([req.body])
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

/* UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .update(req.body)
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