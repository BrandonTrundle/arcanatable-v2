const mongoose = require("mongoose");

const SavedRollSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  formula: {
    type: String,
    required: true,
    maxlength: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SavedRoll", SavedRollSchema);
