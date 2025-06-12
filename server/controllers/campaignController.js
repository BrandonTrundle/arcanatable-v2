const { v4: uuidv4 } = require("uuid");
const Campaign = require("../models/Campaign");
const path = require("path");
const supabase = require("../utils/supabase");
const mongoose = require("mongoose");
const { Types } = mongoose;

const NPC = require("../models/NPC");
const Monster = require("../models/Monster");
// const Item = require("../models/Item");     // Placeholder
// const Lore = require("../models/Lore");     // Placeholder
// const Note = require("../models/Note");     // Placeholder

const createCampaign = async (req, res) => {
  const { name, gameSystem, description, imageUrl, rules } = req.body;
  const userId = req.user.id;

  try {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const campaign = new Campaign({
      name,
      gameSystem,
      description,
      imageUrl: imageUrl || "",
      inviteCode,
      creatorId: userId,
      rules: rules || [],
      players: [{ _id: userId, username: req.user.username }],
      nextSession: null,
    });

    await campaign.save();
    res.status(201).json({ message: "Campaign created", campaign });
  } catch (err) {
    console.error("Campaign creation failed:", err);
    res
      .status(500)
      .json({ message: "Failed to create campaign", error: err.message });
  }
};

const uploadCampaignImage = async (req, res) => {
  const file = req.file;
  const userId = req.user?.id;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const ext = path.extname(file.originalname);
    const fileName = `campaign_${userId}_${uuidv4()}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("campaign-images")
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
      .from("campaign-images")
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

const getUserCampaigns = async (req, res) => {
  try {
    const userId = req.user.id;
    //   console.log("req.user.id:", req.user.id);
    //   console.log("typeof req.user.id:", typeof req.user.id);
    const campaigns = await Campaign.find({
      $or: [{ creatorId: userId }, { players: userId }],
    }).populate("players", "username avatar");

    // console.log("Raw populated campaigns:", JSON.stringify(campaigns, null, 2));

    const updatedCampaigns = campaigns.map((c) => {
      const players = c.players.map((p) => ({
        _id: p._id,
        username: p.username,
        avatarUrl: p.avatar, // mapping explicitly
      }));
      //  console.log("Mapped players with avatar URLs:", players);

      const obj = {
        ...c.toObject(),
        players,
      };

      //  console.log("Transformed campaign:", JSON.stringify(obj, null, 2));
      return obj;
    });

    // console.log("Sending campaigns to frontend:", updatedCampaigns);
    res.json({ campaigns: updatedCampaigns });
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCampaign = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findById(id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    // 🧼 Clean up Supabase image
    if (campaign.imageUrl) {
      const imagePath = new URL(campaign.imageUrl).pathname.split(
        "/campaign-images/"
      )[1];

      if (imagePath) {
        const { data, error } = await supabase.storage
          .from("campaign-images")
          .remove([imagePath]);

        if (error) {
          console.error("❌ Supabase image deletion error:", error.message);
        } else {
          //        console.log("✅ Supabase image deleted:", data);
        }
      } else {
        console.warn("Could not resolve Supabase image path from URL");
      }
    }

    // 🧍 Remove campaign ID from NPCs
    await NPC.updateMany(
      { "content.campaigns": id },
      { $pull: { "content.campaigns": id } }
    );

    // 🐉 Remove campaign ID from Monsters
    await Monster.updateMany(
      { "content.campaigns": id },
      { $pull: { "content.campaigns": id } }
    );

    // 🪓 Items (placeholder)
    // await Item.updateMany(
    //   { "content.campaigns": id },
    //   { $pull: { "content.campaigns": id } }
    // );

    // 🧠 Lore entries (placeholder)
    // await Lore.updateMany(
    //   { "content.campaigns": id },
    //   { $pull: { "content.campaigns": id } }
    // );

    // 🧭 Notes, Journal entries, etc. (placeholder)
    // await Note.updateMany(
    //   { "content.campaigns": id },
    //   { $pull: { "content.campaigns": id } }
    // );

    // 📦 Finally, delete the campaign itself
    await campaign.deleteOne();

    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const joinCampaignByCode = async (req, res) => {
  const { inviteCode } = req.body;
  const userId = req.user?.id;
  const username = req.user?.username; // optional, if available

  try {
    const campaign = await Campaign.findOne({ inviteCode });
    if (!campaign)
      return res.status(404).json({ message: "Invalid invite code." });

    // Already joined?
    const alreadyInCampaign = campaign.players.some((p) => p._id === userId);
    if (alreadyInCampaign) {
      return res
        .status(400)
        .json({ message: "You're already in this campaign." });
    }

    // Add player
    campaign.players.push({
      _id: new Types.ObjectId(userId),
      username,
    });

    await campaign.save();

    res.status(200).json({ message: "Successfully joined campaign", campaign });
  } catch (err) {
    console.error("Join failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getDMCampaigns = async (req, res) => {
  try {
    const userId = req.user.id;

    const campaigns = await Campaign.find({ creatorId: userId }).populate(
      "players",
      "username avatar"
    );

    const formatted = campaigns.map((c) => ({
      ...c.toObject(),
      players: c.players.map((p) => ({
        _id: p._id,
        username: p.username,
        avatarUrl: p.avatar,
      })),
    }));

    res.json({ campaigns: formatted });
  } catch (err) {
    console.error("Error fetching DM campaigns:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateCampaign = async (req, res) => {
  // console.log("PATCH /campaigns/:id");
  //  console.log("Incoming body:", JSON.stringify(req.body, null, 2));
  try {
    const campaignId = req.params.id;
    const userId = req.user.id;

    // Fetch the campaign and verify ownership
    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.creatorId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this campaign" });
    }

    // Apply allowed updates
    if (req.body.players) {
      req.body.players = req.body.players.map((p) =>
        typeof p === "string" ? p : p._id
      );
    }
    const allowedFields = ["gameSystem", "nextSession", "players", "rules"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        campaign[field] = req.body[field];
      }
    });

    await campaign.save();

    const populated = await campaign.populate("players", "username avatar");
    const result = {
      ...populated.toObject(),
      players: populated.players.map((p) => ({
        _id: p._id,
        username: p.username,
        avatarUrl: p.avatar,
      })),
    };

    res.json({ campaign: result });
  } catch (err) {
    console.error("Error updating campaign:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createCampaign,
  uploadCampaignImage,
  getUserCampaigns,
  deleteCampaign,
  joinCampaignByCode,
  getDMCampaigns,
  updateCampaign,
};
