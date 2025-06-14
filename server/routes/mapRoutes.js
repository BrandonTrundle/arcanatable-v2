const express = require("express");
const multer = require("multer");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const mapController = require("../controllers/mapController");

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  },
});

// Routes
router.get("/", auth, mapController.getMapsByCampaign);
router.post("/", auth, upload.single("image"), mapController.createMap);
router.post("/:id/notes", auth, mapController.addNoteToMap);
router.delete("/:id", auth, mapController.deleteMap);
router.get("/:id", auth, mapController.getMapById);
router.put("/:id", auth, mapController.updateMap);

module.exports = router;
