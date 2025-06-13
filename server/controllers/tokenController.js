// controllers/tokenController.js
const Token = require("../models/Token");
const { createClient } = require("@supabase/supabase-js");
const { v4: uuidv4 } = require("uuid");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.createToken = async (req, res) => {
  try {
    const {
      name,
      maxHp,
      initiative,
      sizeWidth,
      sizeHeight,
      rotation,
      notes,
      campaignId,
    } = req.body;

    let imageUrl = "/images/default-token.png";
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `token-${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("token-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("token-images")
        .getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const newTokenData = {
      name,
      displayName: name,
      image: imageUrl,
      hp: maxHp,
      maxHp,
      initiative,
      size: { width: sizeWidth, height: sizeHeight },
      rotation,
      notes,
    };

    if (campaignId) {
      newTokenData.campaignId = campaignId;
    }

    const newToken = new Token(newTokenData);
    await newToken.save(); // ✅ Save the token

    res.status(201).json(newToken);
  } catch (err) {
    console.error("Failed to create token:", err);
    res
      .status(500)
      .json({ message: "Token creation failed", error: err.message });
  }
};

exports.getTokens = async (req, res) => {
  try {
    const { campaignId, unassigned } = req.query;

    let query = {};
    if (campaignId) {
      query.campaignId = campaignId;
    } else if (unassigned === "true") {
      query.$or = [{ campaignId: { $exists: false } }, { campaignId: null }];
    }

    const tokens = await Token.find(query);
    console.log("Query:", query);
    console.log("Tokens:", tokens);

    res.json(tokens);
  } catch (err) {
    console.error("Failed to fetch tokens:", err);
    res
      .status(500)
      .json({ message: "Fetching tokens failed", error: err.message });
  }
};

exports.deleteToken = async (req, res) => {
  try {
    const { id } = req.params;
    const token = await Token.findById(id);
    if (!token) return res.status(404).json({ error: "Token not found" });

    // 🔍 Extract file name from token.image
    const baseUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/token-images/`;
    const fileName = token.image?.startsWith(baseUrl)
      ? token.image.slice(baseUrl.length)
      : null;

    if (fileName) {
      const { error: deleteError } = await supabase.storage
        .from("token-images")
        .remove([fileName]);

      if (deleteError) {
        console.warn(
          "⚠️ Failed to delete image from Supabase:",
          deleteError.message
        );
      }
    }

    await Token.findByIdAndDelete(id);
    res.json({ message: "Token and image deleted" });
  } catch (err) {
    console.error("❌ Error deleting token:", err.message);
    res.status(500).json({ error: "Failed to delete token." });
  }
};
