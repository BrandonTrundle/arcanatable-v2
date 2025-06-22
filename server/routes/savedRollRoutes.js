const express = require("express");
const router = express.Router();
const SavedRoll = require("../models/SavedRoll");

// Middleware to require authentication (assumes req.user is set)
const verifyToken = require("../middleware/authMiddleware");

// Get all saved rolls for the current user
router.get("/", verifyToken, async (req, res) => {
  try {
    const rolls = await SavedRoll.find({ userId: req.user.id });
    res.json(rolls);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch saved rolls" });
  }
});

// Create a new saved roll
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, formula } = req.body;
    if (!name || !formula) {
      return res.status(400).json({ error: "Missing name or formula" });
    }

    const newRoll = new SavedRoll({
      userId: req.user.id,
      name,
      formula,
    });
    await newRoll.save();
    res.status(201).json(newRoll);
  } catch (err) {
    res.status(500).json({ error: "Failed to create saved roll" });
  }
});

// Delete a saved roll
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SavedRoll.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!deleted) {
      return res.status(404).json({ error: "Saved roll not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete saved roll" });
  }
});

module.exports = router;
