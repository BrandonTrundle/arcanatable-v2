const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
  name: String,
  gameSystem: String,
  description: String,
  imageUrl: String,
  inviteCode: String,
  creatorId: { type: Schema.Types.ObjectId, ref: "User" },
  rules: [String], // or ObjectId[] if you're referencing a Rule model later
  players: [{ type: Schema.Types.ObjectId, ref: "User" }],
  nextSession: Date,
});

module.exports = mongoose.model("Campaign", CampaignSchema);
