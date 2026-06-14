import express from "express";
import multer from "multer";
import ImageKit from "imagekit";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    if (
      !process.env.IMAGEKIT_PUBLIC_KEY ||
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.IMAGEKIT_URL_ENDPOINT
    ) {
      return res.status(500).json({
        success: false,
        message: "ImageKit environment variables are missing.",
      });
    }

    const uploadedFile = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "/school-website",
    });

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully.",
      url: uploadedFile.url,
      imageUrl: uploadedFile.url,
      fileId: uploadedFile.fileId,
      name: uploadedFile.name,
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed.",
    });
  }
});

export default router;