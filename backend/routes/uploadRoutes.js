import express from "express";
import multer from "multer";
import imagekit from "../config/imagekit.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/gallery",
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, category } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image selected",
        });
      }

      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: `${Date.now()}-${req.file.originalname}`,
        folder: "/Baljagriti/gallery",
      });

      const { data, error } = await supabase
        .from("gallery_images")
        .insert([
          {
            title,
            category,
            image_url: uploadedImage.url,
          },
        ])
        .select();

      if (error) throw error;

      res.status(201).json({
        success: true,
        image: data,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;