const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // memory storage for Supabase
const { createMapAsset } = require("../controllers/mapAssetController");
const { getAllMapAssets } = require("../controllers/mapAssetController");
const { deleteMapAsset } = require("../controllers/mapAssetController");

router.post("/", upload.single("image"), createMapAsset);
router.get("/", getAllMapAssets);
router.delete("/:id", deleteMapAsset);

module.exports = router;
