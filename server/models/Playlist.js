const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String, required: true },
});

const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tracks: [TrackSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Playlist", PlaylistSchema);
