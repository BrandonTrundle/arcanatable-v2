// ➕ CREATE new NPC
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { createClient } = require("@supabase/supabase-js");
const NPC = require("../models/NPC");
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 📥 GET all NPCs (filtered by campaign)
exports.getNPCs = async (req, res) => {
  try {
    const { campaignId, unassigned } = req.query;
    const query = campaignId
      ? { campaigns: campaignId }
      : unassigned === "true"
      ? { campaigns: { $size: 0 } }
      : {};

    const npcs = await NPC.find(query);
    res.json(npcs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch NPCs." });
  }
};

exports.createNPC = [
  async (req, res) => {
    try {
      const userId = req.user.id;
      const raw = req.body.content;

      if (!raw)
        return res.status(400).json({ error: "Missing content payload" });

      const content = JSON.parse(raw);

      // Clean campaigns
      content.campaigns = Array.isArray(content.campaigns)
        ? content.campaigns.filter(
            (id) => typeof id === "string" && id.trim() !== ""
          )
        : [];

      // Handle image file
      if (req.file) {
        const ext = path.extname(req.file.originalname);
        const fileName = `npc_${userId}_${uuidv4()}${ext}`;
        const fileBuffer = req.file.buffer; // Use memory buffer (no disk)

        const { error: uploadError } = await supabase.storage
          .from("npc-images")
          .upload(fileName, fileBuffer, {
            contentType: req.file.mimetype,
          });

        if (uploadError) {
          return res
            .status(500)
            .json({ error: "Supabase upload failed", detail: uploadError });
        }

        content.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/npc-images/${fileName}`;
      }
      console.log("Parsed NPC content:", JSON.stringify(content, null, 2));
      const npc = new NPC({
        userId, // ✅ attach userId
        content,
        campaigns: content.campaigns || [],
      });
      console.log(
        "Schema says content is:",
        NPC.schema.path("content").instance
      );
      await npc.save();
      res.status(201).json(npc);
    } catch (err) {
      console.error("❌ Error creating NPC:", err.message);
      res.status(500).json({ error: "Failed to create NPC" });
    }
  },
];

exports.updateNPC = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Add debugging
    console.log("🧾 Raw req.body.content:", req.body.content);

    let parsed;
    try {
      parsed = JSON.parse(req.body.content);
    } catch (parseError) {
      console.error("❌ JSON parse failed:", parseError);
      return res.status(400).json({ error: "Invalid JSON content." });
    }

    const content = parsed; // ✅ FIXED: parsed is the content
    const file = req.file;

    let imageUrl = content.image || "";

    if (file) {
      const { data, error } = await supabase.storage
        .from("npc-images")
        .upload(`npcs/${Date.now()}_${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) throw error;

      const { publicURL } = supabase.storage
        .from("npc-images")
        .getPublicUrl(data.path);

      imageUrl = publicURL;
    }

    const updated = await NPC.findByIdAndUpdate(
      id,
      {
        content: { ...content, image: imageUrl },
        campaigns: content.campaigns || [],
      },
      { new: true }
    );

    console.log("✅ Updated NPC:", updated);
    res.json(updated);
  } catch (err) {
    console.error("🔥 Failed to update NPC:", err);
    res.status(500).json({ error: "Failed to update NPC." });
  }
};

// ❌ DELETE NPC
exports.deleteNPC = async (req, res) => {
  try {
    const { id } = req.params;
    const npc = await NPC.findById(id);
    if (!npc) return res.status(404).json({ error: "NPC not found" });

    // Optionally delete the Supabase image if you want to manage cleanup
    await NPC.findByIdAndDelete(id);
    res.json({ message: "NPC deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete NPC." });
  }
};

exports.uploadNPCImage = async (req, res) => {
  res.status(200).json({ message: "NPC image upload not yet implemented." });
};
