const mongoose = require("mongoose");

const MapAssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  description: { type: String },
  tags: [String],
  image: { type: String, required: true },
  userId: { type: String, required: true },
});

module.exports = mongoose.model("MapAsset", MapAssetSchema);
