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
  getCampaignCharacters,
} = require("../controllers/characterController");

const authMiddleware = require("../middleware/authMiddleware");

// ------------------------------------
// DM: Get all characters in a campaign
// ------------------------------------
router.get("/campaign", authMiddleware, getCampaignCharacters);

// ------------------------------------
// Player: Get own characters
// ------------------------------------
router.get("/", authMiddleware, getUserCharacters);
router.get("/:id", authMiddleware, getCharacterById);

// ------------------------------------
// Create, update, delete
// ------------------------------------
router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "portraitImage", maxCount: 1 },
    { name: "symbolImage", maxCount: 1 },
  ]),
  createCharacter
);

router.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "portraitImage", maxCount: 1 },
    { name: "symbolImage", maxCount: 1 },
  ]),
  updateCharacter
);

router.delete("/:id", authMiddleware, deleteCharacter);

module.exports = router;
