const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const authenticate = require("../middleware/authMiddleware");

// More specific route must come first
router.get("/by-code/:code", sessionController.getSessionByCode);

// Create a session (or return existing one)
router.post("/", authenticate, sessionController.createSession);

// Generic get by MongoDB ID (fallback)
router.get("/:id", sessionController.getSessionById);

router.post(
  "/:sessionCode/set-active-map",
  authenticate,
  sessionController.setActiveMap
);

module.exports = router;
