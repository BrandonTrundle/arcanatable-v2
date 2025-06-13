// models/Token.js
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  maxHp: { type: Number, default: 10 },
  initiative: { type: Number, default: 0 },
  size: {
    width: { type: Number, default: 1 },
    height: { type: Number, default: 1 },
  },
  notes: { type: String },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
});

module.exports = mongoose.model("Token", tokenSchema);
