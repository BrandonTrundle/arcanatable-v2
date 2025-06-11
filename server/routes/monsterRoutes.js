const express = require("express");
const multer = require("multer");
const router = express.Router();

const {
  getMonsters,
  createMonster,
  uploadMonsterImage,
  updateMonster,
  deleteMonster,
} = require("../controllers/monsterController");
const auth = require("../middleware/authMiddleware");

// Multer config (same as campaigns)
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
router.get("/", auth, getMonsters);
router.post("/", auth, createMonster);
router.put("/:id", auth, updateMonster);
router.delete("/:id", auth, deleteMonster);

// 🖼 Monster image upload
router.post("/upload-image", auth, upload.single("image"), uploadMonsterImage);

module.exports = router;
