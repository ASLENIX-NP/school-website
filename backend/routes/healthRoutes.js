import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "School website backend is running",
  });
});

export default router;