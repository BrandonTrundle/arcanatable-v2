const express = require("express");
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");
const {
  updateOnboarding,
  updateUserAvatar,
  updateUserAccount,
} = require("../controllers/userController");

const router = express.Router();

// Configure avatar upload with file size and MIME type validation
const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG, PNG, and WEBP are allowed."));
    }
  },
});

// Update onboarding profile data
router.put("/onboarding", verifyToken, updateOnboarding);

// Upload and update avatar
router.put(
  "/:userId/avatar",
  verifyToken,
  upload.single("avatar"),
  updateUserAvatar
);

// Update username, email, and/or password (requires current password)
router.put("/:userId", verifyToken, updateUserAccount);

module.exports = router;
