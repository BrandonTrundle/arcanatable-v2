const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");
const MapAsset = require("../models/MapAsset");
const { v4: uuidv4 } = require("uuid");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.createMapAsset = async (req, res) => {
  try {
    const { name, width, height, description, tags, userId, campaignId } =
      req.body;
    const parsedTags = JSON.parse(tags);

    if (!req.file)
      return res.status(400).json({ message: "Image file is required." });

    const fileExt = req.file.originalname.split(".").pop();
    const fileName = `mapasset-${uuidv4()}.${fileExt}`;
    const filePath = fileName;

    const { error: uploadError } = await supabase.storage
      .from("map-assets")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("map-assets")
      .getPublicUrl(filePath);

    const newAsset = new MapAsset({
      name,
      width,
      height,
      description,
      tags: parsedTags,
      image: publicUrlData.publicUrl,
      userId,
      campaignId,
      entityId: crypto.randomUUID(), // or new mongoose.Types.ObjectId().toString()
      entityType: "mapAsset",
    });

    await newAsset.save();
    res.status(201).json({ mapAsset: newAsset });
  } catch (err) {
    console.error("MapAsset upload error:", err.message);
    res.status(500).json({ message: "Failed to upload map asset." });
  }
};

exports.getAllMapAssets = async (req, res) => {
  try {
    const { campaignId } = req.query;

    const query = campaignId ? { campaignId } : {};

    const assets = await MapAsset.find(query).sort({ name: 1 });
    res.json({ mapAssets: assets });
  } catch (err) {
    console.error("Error fetching map assets:", err.message);
    res.status(500).json({ message: "Failed to fetch map assets." });
  }
};

exports.deleteMapAsset = async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await MapAsset.findById(id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });

    // Extract filename from URL
    const imageUrl = asset.image;
    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1];

    // Delete from Supabase
    const { error: storageError } = await supabase.storage
      .from("map-assets")
      .remove([fileName]);

    if (storageError) throw storageError;

    await MapAsset.findByIdAndDelete(id);

    res.json({ message: "Map asset deleted" });
  } catch (err) {
    console.error("Error deleting map asset:", err.message);
    res.status(500).json({ message: "Failed to delete map asset" });
  }
};
