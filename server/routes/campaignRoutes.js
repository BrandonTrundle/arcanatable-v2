const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  createCampaign,
  uploadCampaignImage,
  getUserCampaigns,
  deleteCampaign,
  joinCampaignByCode,
  getDMCampaigns,
  updateCampaign,
} = require("../controllers/campaignController");
const verifyToken = require("../middleware/authMiddleware");

// Multer config: 20MB max, images only
const storage = multer.memoryStorage(); // 👈 Needed for file.buffer to work
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  },
});

// Campaign Routes
router.post("/", verifyToken, createCampaign);
router.post("/join", verifyToken, joinCampaignByCode);
router.get("/", verifyToken, getUserCampaigns);
router.delete("/:id", verifyToken, deleteCampaign);
router.get("/dm", verifyToken, getDMCampaigns);
router.patch("/:id", verifyToken, updateCampaign);

// 🖼 Campaign image upload
router.post(
  "/upload",
  verifyToken,
  upload.single("image"),
  uploadCampaignImage
);

module.exports = router;
