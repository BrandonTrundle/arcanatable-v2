const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  getNPCs,
  createNPC,
  uploadNPCImage, // <— must be listed
  updateNPC,
  deleteNPC,
} = require("../controllers/npcController");
const auth = require("../middleware/authMiddleware");

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  },
});

// Routes
router.get("/", auth, getNPCs);
router.post("/", auth, upload.single("image"), createNPC);
router.put("/:id", auth, upload.single("image"), updateNPC);
router.delete("/:id", auth, deleteNPC);

// 🖼 Optional: NPC image upload route
//router.post("/upload-image", auth, upload.single("image"), uploadNPCImage);

module.exports = router;
