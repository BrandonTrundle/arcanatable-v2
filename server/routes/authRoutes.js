const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

// POST /api/auth/signup
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;

router.get("/me", verifyToken, (req, res) => {
  res.json({ message: "Token is valid", userId: req.user.id });
});
