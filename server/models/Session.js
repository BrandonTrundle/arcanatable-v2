const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  sessionCode: { type: String, required: true, unique: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  currentMapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Map",
    default: null,
  },
});

module.exports = mongoose.model("Session", SessionSchema);
