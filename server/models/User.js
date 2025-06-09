const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "" },
  tier: { type: String, enum: ["Free", "Gold", "Platinum"], default: "Free" },
  memberSince: { type: Date, default: Date.now },
  hoursPlayed: { type: Number, default: 0 },
  onboarded: { type: Boolean, default: false },
  experience: { type: [String], default: [] },
  preferredRole: { type: [String], default: [] },
  playStyle: { type: [String], default: [] },
  campaigns: { type: [String], default: [] },

  role: {
    type: String,
    enum: ["User", "Owner", "Admin"],
    default: "User",
  },
});

module.exports = mongoose.model("User", UserSchema);
