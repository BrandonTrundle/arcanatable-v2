const Map = require("../models/Map");
const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.createMap = async (req, res) => {
  try {
    console.log("📥 Incoming request body:", req.body);
    console.log("📁 Incoming file:", req.file);

    const rawMapData = req.body.map;
    if (!rawMapData) {
      return res
        .status(400)
        .json({ error: "Missing 'map' field in request body" });
    }

    let mapData;
    try {
      mapData = JSON.parse(rawMapData);
    } catch (parseErr) {
      console.error("❌ Failed to parse 'map' JSON:", parseErr);
      return res
        .status(400)
        .json({ error: "Invalid JSON format in 'map' field" });
    }

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const fileName = `map_${uuidv4()}${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("map-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) {
        console.error("❌ Supabase upload failed:", uploadError);
        return res.status(500).json({
          error: "Failed to upload image to Supabase",
          detail: uploadError.message,
        });
      }

      mapData.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/map-images/${fileName}`;
    } else {
      console.warn("⚠️ No image file provided with the request");
    }

    const newMap = new Map(mapData);
    await newMap.save();

    console.log("✅ Map created successfully:", newMap._id);
    return res.status(201).json(newMap);
  } catch (err) {
    console.error("❌ Error creating map:", err);
    return res.status(500).json({
      error: "Internal server error while creating map",
      details: err.message,
    });
  }
};

exports.getMapsByCampaign = async (req, res) => {
  try {
    const { campaignId } = req.query;
    const maps = await Map.find({ campaignId });
    res.json(maps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch maps." });
  }
};

exports.deleteMap = async (req, res) => {
  try {
    const { id } = req.params;

    const map = await Map.findById(id);
    if (!map) {
      return res.status(404).json({ error: "Map not found" });
    }

    // Handle Supabase image deletion
    const imageUrl = map.image;
    if (imageUrl) {
      const baseUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/map-images/`;
      const fileName = imageUrl.startsWith(baseUrl)
        ? imageUrl.slice(baseUrl.length)
        : null;

      console.log("🧹 Preparing to delete map image. fileName:", fileName);

      if (fileName) {
        const { error: deleteError } = await supabase.storage
          .from("map-images")
          .remove([fileName]);

        if (deleteError) {
          console.warn(
            "⚠️ Failed to delete image from Supabase:",
            deleteError.message
          );
        } else {
          console.log("✅ Supabase image deleted successfully.");
        }
      } else {
        console.warn(
          "⚠️ Supabase image URL did not match expected format:",
          imageUrl
        );
      }
    }

    // Delete map from database
    await Map.findByIdAndDelete(id);
    res.status(200).json({ message: "Map and image deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting map:", err.message);
    res
      .status(500)
      .json({ error: "Failed to delete map", details: err.message });
  }
};

exports.addNoteToMap = async (req, res) => {
  const { id } = req.params;
  const { name, body, cell } = req.body;

  if (
    !name ||
    !cell ||
    typeof cell.x !== "number" ||
    typeof cell.y !== "number"
  ) {
    return res.status(400).json({ error: "Invalid note data." });
  }

  const newNote = {
    id: `note-${Date.now()}`,
    name,
    body,
    cell,
  };

  try {
    const updatedMap = await Map.findByIdAndUpdate(
      id,
      { $push: { notes: newNote }, $set: { lastEditedAt: new Date() } },
      { new: true }
    );

    if (!updatedMap) {
      return res.status(404).json({ error: "Map not found." });
    }

    res.status(201).json({ note: newNote });
  } catch (err) {
    console.error("❌ Error adding note to map:", err.message);
    res.status(500).json({ error: "Failed to add note to map." });
  }
};

exports.getMapById = async (req, res) => {
  try {
    const map = await Map.findById(req.params.id);
    if (!map) {
      return res.status(404).json({ error: "Map not found" });
    }
    res.json(map);
  } catch (err) {
    console.error("Error fetching map by ID:", err.message);
    res.status(500).json({ error: "Failed to fetch map" });
  }
};

exports.updateMap = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedMap = await Map.findByIdAndUpdate(
      id,
      {
        ...updatedData,
        lastEditedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedMap) {
      return res.status(404).json({ error: "Map not found" });
    }

    res.json(updatedMap);
  } catch (err) {
    console.error("❌ Error updating map:", err.message);
    res
      .status(500)
      .json({ error: "Failed to update map", details: err.message });
  }
};
