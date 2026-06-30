import express from "express";
import { supabase } from "../config/supabase.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
});

const router = express.Router();

/*
GET SETTINGS
*/
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("admin_settings")
    .select("*")
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

/*
UPDATE SETTINGS
*/
router.put("/", async (req, res) => {
  const { error } = await supabase
    .from("admin_settings")
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
    message: "Settings updated successfully",
  });
});
router.put("/change-password", async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
  
      const { data: admin } = await supabase
        .from("admin_settings")
        .select("*")
        .eq("id", 1)
        .single();
  
      if (!admin) {
        return res.status(404).json({
          success: false,
          message: "Admin not found",
        });
      }
  
      if (admin.password !== currentPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }
  
      const { error } = await supabase
        .from("admin_settings")
        .update({
          password: newPassword,
        })
        .eq("id", 1);
  
      if (error) throw error;
  
      res.json({
        success: true,
        message: "Password updated successfully",
      });
  
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  });
router.put("/email", async (req, res) => {
    try {
      const { email } = req.body;
  
      const { error } = await supabase
        .from("admin_settings")
        .update({
          admin_email: email,
        })
        .eq("id", 1);
  
      if (error) {
        return res.status(500).json({
          success: false,
          error,
        });
      }
  
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

  router.post(
    "/upload-photo",
    upload.single("image"),
    async (req, res) => {
      try {
  
        console.log("=== UPLOAD START ===");
        console.log("FILE:", req.file);
  
        const file = req.file;
  
        if (!file) {
          return res.status(400).json({
            success: false,
            message: "No file uploaded",
          });
        }
  
        const extension = file.originalname.split(".").pop();

const fileName =
  `${Date.now()}.${extension}`;
  
        const { error: uploadError } =
          await supabase.storage
            .from("admin-profile")
            .upload(fileName, file.buffer, {
              contentType: file.mimetype,
            });
  
            if (uploadError) {
                console.log("UPLOAD ERROR:", uploadError);
                throw uploadError;
              }
  
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("admin-profile")
          .getPublicUrl(fileName);
          console.log("PUBLIC URL:", publicUrl);
        const { error } = await supabase
          .from("admin_settings")
          .update({
            profile_photo: publicUrl,
          })
          .eq("id", 1);
  
          if (error) {
            console.log("DB ERROR:", error);
            throw error;
          }
          console.log("PROFILE UPDATED SUCCESSFULLY");
        res.json({
          success: true,
          image: publicUrl,
        });
  
      } catch (err) {

        console.log("UPLOAD ROUTE FAILED");
        console.log(err);
      
        res.status(500).json({
          success: false,
          message: err.message,
        });
        
      }
    }
  );
  router.get("/login-activity", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("admin_login_activity")
        .select("*")
        .order("login_time", { ascending: false })
        .limit(10);
  
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
  router.get("/login-activity", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("admin_login_activity")
        .select("*")
        .order("login_time", {
          ascending: false,
        });
  
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
export default router;