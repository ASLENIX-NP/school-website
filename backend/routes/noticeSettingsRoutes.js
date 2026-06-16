import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("notice_settings")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  res.json({
    success: true,
    data,
  });
});

router.put("/", async (req, res) => {
  const { error } = await supabase
    .from("notice_settings")
    .update(req.body)
    .eq("id", 1);

  if (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  res.json({
    success: true,
    message: "Notice settings updated",
  });
});

export default router;