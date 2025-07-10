const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  getUserPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
} = require("../controllers/playlistController");

// All routes require auth
router.get("/", verifyToken, getUserPlaylists);
router.post("/", verifyToken, createPlaylist);
router.put("/:id", verifyToken, updatePlaylist);
router.delete("/:id", verifyToken, deletePlaylist);

module.exports = router;
