const Playlist = require("../models/Playlist");

// GET all playlists for current user
const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    const playlists = await Playlist.find({ userId });
    res.status(200).json(playlists);
  } catch (err) {
    console.error("❌ Error fetching playlists:", err.message);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
};

// POST create new playlist
const createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, tracks } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Playlist name is required" });
    }

    const newPlaylist = new Playlist({
      name,
      userId,
      tracks: Array.isArray(tracks) ? tracks : [],
    });

    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (err) {
    console.error("❌ Error creating playlist:", err.message);
    res.status(500).json({ error: "Failed to create playlist" });
  }
};

// PUT update playlist (e.g., rename, change tracks)
const updatePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, tracks } = req.body;

    const playlist = await Playlist.findOne({ _id: id, userId });
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    if (name) playlist.name = name;
    if (Array.isArray(tracks)) playlist.tracks = tracks;

    await playlist.save();
    res.status(200).json(playlist);
  } catch (err) {
    console.error("❌ Error updating playlist:", err.message);
    res.status(500).json({ error: "Failed to update playlist" });
  }
};

// DELETE a playlist
const deletePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const playlist = await Playlist.findOneAndDelete({ _id: id, userId });
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({ message: "Playlist deleted" });
  } catch (err) {
    console.error("❌ Error deleting playlist:", err.message);
    res.status(500).json({ error: "Failed to delete playlist" });
  }
};

module.exports = {
  getUserPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
};
