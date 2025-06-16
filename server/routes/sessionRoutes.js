const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sessionController");
const authenticate = require("../middleware/authMiddleware");

router.post("/", authenticate, sessionController.createSession);
router.get("/:code", sessionController.getSessionByCode);

module.exports = router;
