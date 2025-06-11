const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const Monster = require("../models/Monster");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const upload = multer({ dest: "uploads/" });

exports.getMonsters = async (req, res) => {
  const { campaignId, unassigned } = req.query;
  const userId = req.user.id;

  const query = { userId };

  if (campaignId) {
    query["content.campaigns"] = campaignId;
  } else if (unassigned === "true") {
    query["$or"] = [
      { "content.campaigns": { $exists: false } },
      { "content.campaigns": { $size: 0 } },
    ];
  }

  try {
    const monsters = await Monster.find(query);
    res.json(monsters);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching monsters" });
  }
};

exports.createMonster = [
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const raw = req.body.data;

      if (!raw) return res.status(400).json({ error: "Missing data payload" });

      const parsed = JSON.parse(raw);
      const { content, ...rest } = parsed;

      // Ensure campaigns is an array of valid non-empty strings
      content.campaigns = Array.isArray(content.campaigns)
        ? content.campaigns.filter(
            (id) => typeof id === "string" && id.trim() !== ""
          )
        : [];

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const fileName = `monster_${userId}_${uuidv4()}${ext}`;
        const fileBuffer = fs.readFileSync(req.file.path);

        const { error: uploadError } = await supabase.storage
          .from("monster-images")
          .upload(fileName, fileBuffer, {
            contentType: req.file.mimetype,
          });

        fs.unlinkSync(req.file.path);

        if (uploadError) {
          return res
            .status(500)
            .json({ error: "Supabase upload failed", detail: uploadError });
        }

        content.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/monster-images/${fileName}`;
      }

      const monster = new Monster({
        userId,
        title: content.name,
        content,
        ...rest,
      });

      await monster.save();
      res.status(201).json(monster);
    } catch (err) {
      console.error("❌ Error creating monster:", err.message);
      res.status(500).json({ error: "Failed to create monster" });
    }
  },
];

exports.uploadMonsterImage = async (req, res) => {
  const file = req.file;
  const userId = req.user?.id;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const ext = path.extname(file.originalname);
    const fileName = `monster_${userId}_${uuidv4()}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("monster-images")
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      return res.status(500).json({
        message: "Upload failed",
        error: uploadError.message,
      });
    }

    const { data, error: urlError } = supabase.storage
      .from("monster-images")
      .getPublicUrl(fileName);

    if (urlError) {
      return res.status(500).json({
        message: "Failed to get image URL",
        error: urlError.message,
      });
    }

    res.json({ imageUrl: data.publicUrl });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateMonster = [
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const raw = req.body.data;

      if (!raw) return res.status(400).json({ error: "Missing data payload" });

      const parsed = JSON.parse(raw);
      const { content, ...rest } = parsed;

      // Ensure campaigns is an array of valid non-empty strings
      content.campaigns = Array.isArray(content.campaigns)
        ? content.campaigns.filter(
            (id) => typeof id === "string" && id.trim() !== ""
          )
        : [];

      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const fileName = `monster_${userId}_${uuidv4()}${ext}`;
        const fileBuffer = fs.readFileSync(req.file.path);

        const { error: uploadError } = await supabase.storage
          .from("monster-images")
          .upload(fileName, fileBuffer, {
            contentType: req.file.mimetype,
          });

        fs.unlinkSync(req.file.path);

        if (uploadError) {
          return res
            .status(500)
            .json({ error: "Supabase upload failed", detail: uploadError });
        }

        content.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/monster-images/${fileName}`;
      }

      const updated = await Monster.findByIdAndUpdate(
        id,
        {
          userId,
          title: content.name,
          content,
          ...rest,
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Monster not found" });
      }

      res.json(updated);
    } catch (err) {
      console.error("❌ Error updating monster:", err.message);
      res.status(500).json({ error: "Failed to update monster" });
    }
  },
];

exports.deleteMonster = async (req, res) => {
  try {
    const { id } = req.params;

    const monster = await Monster.findById(id);
    if (!monster) {
      return res.status(404).json({ message: "Monster not found" });
    }

    // Extract image path from public URL
    const imageUrl = monster.content?.image;
    if (imageUrl) {
      const baseUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/monster-images/`;
      const fileName = imageUrl.startsWith(baseUrl)
        ? imageUrl.slice(baseUrl.length)
        : null;

      if (fileName) {
        const { error: deleteError } = await supabase.storage
          .from("monster-images")
          .remove([fileName]);

        if (deleteError) {
          console.warn(
            "⚠️ Failed to delete image from Supabase:",
            deleteError.message
          );
        }
      }
    }

    await Monster.findByIdAndDelete(id);
    res.json({ message: "Monster and image deleted" });
  } catch (err) {
    console.error("❌ Error deleting monster:", err.message);
    res.status(500).json({ error: "Failed to delete monster" });
  }
};
