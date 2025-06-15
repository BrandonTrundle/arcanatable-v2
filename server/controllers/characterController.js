const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { createClient } = require("@supabase/supabase-js");
const Character = require("../models/Character");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const createCharacter = async (req, res) => {
  try {
    const userId = req.user.id;
    const raw = req.body.characterData;
    if (!raw) {
      console.error("❌ Missing character data");
      return res.status(400).json({ error: "Missing character data" });
    }

    const parsed = JSON.parse(raw);
    console.log("📦 Parsed character data:", parsed);

    // Upload portrait image
    if (req.files?.portraitImage?.[0]) {
      const file = req.files.portraitImage[0];
      const ext = path.extname(file.originalname);
      const fileName = `character_${userId}_${uuidv4()}${ext}`;
      console.log("⬆️ Uploading portrait image:", fileName);

      const { error } = await supabase.storage
        .from("character-portraits")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        console.error("❌ Portrait image upload failed:", error);
        return res
          .status(500)
          .json({ error: "Failed to upload portraitImage", detail: error });
      }

      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/character-portraits/${fileName}`;
      console.log("✅ Portrait image uploaded:", publicUrl);
      parsed.portraitImage = publicUrl;
    } else {
      console.log("ℹ️ No portrait image provided");
    }

    // Upload organization symbol
    if (req.files?.symbolImage?.[0]) {
      const file = req.files.symbolImage[0];
      const ext = path.extname(file.originalname);
      const fileName = `orgsymbol_${userId}_${uuidv4()}${ext}`;
      console.log("⬆️ Uploading organization symbol:", fileName);

      const { error } = await supabase.storage
        .from("organization-portraits")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        console.error("❌ Symbol image upload failed:", error);
        return res
          .status(500)
          .json({ error: "Failed to upload symbolImage", detail: error });
      }

      const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/organization-portraits/${fileName}`;
      console.log("✅ Symbol image uploaded:", publicUrl);
      parsed.organization.symbolImage = publicUrl;
    } else {
      console.log("ℹ️ No organization symbol provided");
    }

    const newCharacter = new Character({
      ...parsed,
      creator: userId,
    });

    await newCharacter.save();
    console.log("✅ Character saved with ID:", newCharacter._id);
    res.status(201).json(newCharacter);
  } catch (err) {
    console.error("❌ Error creating character:", err.message);
    res.status(500).json({ error: "Failed to create character" });
  }
};

const getUserCharacters = async (req, res) => {
  try {
    const userId = req.user.id;
    const characters = await Character.find({ creator: userId });
    res.status(200).json({ characters });
  } catch (error) {
    console.error("Error fetching characters:", error);
    res.status(500).json({ error: "Failed to fetch characters" });
  }
};

const getCharacterById = async (req, res) => {
  try {
    const userId = req.user.id;
    const character = await Character.findOne({
      _id: req.params.id,
      creator: userId,
    });

    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }

    res.status(200).json(character);
  } catch (err) {
    console.error("Error fetching character:", err.message);
    res.status(500).json({ error: "Failed to retrieve character" });
  }
};

const deleteCharacter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const character = await Character.findOne({ _id: id, creator: userId });
    if (!character) {
      return res.status(404).json({ error: "Character not found" });
    }

    // Construct expected public base URLs
    const basePortraitURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/character-portraits/`;
    const baseSymbolURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/organization-portraits/`;

    const portraitUrl = character.portraitImage;
    const symbolUrl = character.organization?.symbolImage;

    const portraitPath = portraitUrl?.startsWith(basePortraitURL)
      ? portraitUrl.slice(basePortraitURL.length)
      : null;

    const symbolPath = symbolUrl?.startsWith(baseSymbolURL)
      ? symbolUrl.slice(baseSymbolURL.length)
      : null;

    console.log("🖼️ Cleaned portrait path:", portraitPath);
    console.log("🏷️ Cleaned symbol path:", symbolPath);

    if (portraitPath) {
      const { error } = await supabase.storage
        .from("character-portraits")
        .remove([portraitPath]);

      if (error) {
        console.error("❌ Failed to delete portrait image:", error);
      } else {
        console.log("✅ Deleted portrait image from Supabase.");
      }
    }

    if (symbolPath) {
      const { error } = await supabase.storage
        .from("organization-portraits")
        .remove([symbolPath]);

      if (error) {
        console.error("❌ Failed to delete symbol image:", error);
      } else {
        console.log("✅ Deleted organization symbol from Supabase.");
      }
    }

    await Character.deleteOne({ _id: id });
    console.log("🗑️ Character document deleted from MongoDB.");

    res.status(200).json({ message: "Character deleted" });
  } catch (err) {
    console.error("❌ Error deleting character:", err.message);
    res.status(500).json({ error: "Failed to delete character" });
  }
};

const updateCharacter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const existingCharacter = await Character.findOne({
      _id: id,
      creator: userId,
    });
    if (!existingCharacter) {
      return res.status(404).json({ error: "Character not found" });
    }

    const parsed = JSON.parse(req.body.characterData);

    // Handle portrait image replacement
    if (req.files?.portraitImage?.[0]) {
      const oldPortrait = existingCharacter.portraitImage;
      if (
        oldPortrait?.includes("/storage/v1/object/public/character-portraits/")
      ) {
        const oldPath = oldPortrait.split("/character-portraits/")[1];
        await supabase.storage.from("character-portraits").remove([oldPath]);
      }

      const file = req.files.portraitImage[0];
      const ext = path.extname(file.originalname);
      const fileName = `character_${userId}_${uuidv4()}${ext}`;
      const { error, data } = await supabase.storage
        .from("character-portraits")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) {
        return res.status(500).json({
          error: "Failed to upload new portrait image",
          detail: error,
        });
      }

      parsed.portraitImage = `${process.env.SUPABASE_URL}/storage/v1/object/public/character-portraits/${fileName}`;
    }

    // Handle organization symbol replacement
    if (req.files?.symbolImage?.[0]) {
      const oldSymbol = existingCharacter.organization?.symbolImage;
      if (
        oldSymbol?.includes("/storage/v1/object/public/organization-portraits/")
      ) {
        const oldPath = oldSymbol.split("/organization-portraits/")[1];
        await supabase.storage.from("organization-portraits").remove([oldPath]);
      }

      const file = req.files.symbolImage[0];
      const ext = path.extname(file.originalname);
      const fileName = `orgsymbol_${userId}_${uuidv4()}${ext}`;
      const { error, data } = await supabase.storage
        .from("organization-portraits")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (error) {
        return res
          .status(500)
          .json({ error: "Failed to upload new symbol image", detail: error });
      }

      parsed.organization = parsed.organization || {};
      parsed.organization.symbolImage = `${process.env.SUPABASE_URL}/storage/v1/object/public/organization-portraits/${fileName}`;
    }

    const updatedCharacter = await Character.findByIdAndUpdate(id, parsed, {
      new: true,
    });

    res.status(200).json(updatedCharacter);
  } catch (err) {
    console.error("❌ Error updating character:", err.message);
    res.status(500).json({ error: "Failed to update character" });
  }
};

module.exports = {
  createCharacter,
  getUserCharacters,
  getCharacterById,
  deleteCharacter,
  updateCharacter,
};
