const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const {
  createCharacter,
  getUserCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} = require("../controllers/characterController");

const authMiddleware = require("../middleware/authMiddleware");

// Create character with image uploads
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "portraitImage", maxCount: 1 },
    { name: "symbolImage", maxCount: 1 },
  ]),
  createCharacter
);

// Update character with image handling
router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "portraitImage", maxCount: 1 },
    { name: "symbolImage", maxCount: 1 },
  ]),
  updateCharacter
);

// Other character routes
router.get("/", authMiddleware, getUserCharacters);
router.get("/:id", authMiddleware, getCharacterById);
router.delete("/:id", authMiddleware, deleteCharacter);

module.exports = router;
