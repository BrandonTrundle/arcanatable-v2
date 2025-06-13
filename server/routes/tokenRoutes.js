const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();

const tokenController = require("../controllers/tokenController");

router.get("/", tokenController.getTokens); // Add this line
router.post("/", upload.single("image"), tokenController.createToken);
router.delete("/:id", tokenController.deleteToken);

module.exports = router;
