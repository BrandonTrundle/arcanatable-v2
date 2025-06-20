const mongoose = require("mongoose");

const positionSchema = {
  x: { type: Number, required: true },
  y: { type: Number, required: true },
};

const sizeSchema = {
  width: { type: Number, required: true },
  height: { type: Number, required: true },
};

const effectSchema = new mongoose.Schema(
  {
    name: String,
    icon: String,
    duration: Number,
  },
  { _id: false }
);

const lightEmitSchema = {
  radius: Number,
  color: String,
  intensity: Number,
  flicker: Boolean,
};

const tokenSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // Token instance ID
    entityType: {
      type: String,
      enum: ["Monster", "NPC", "Token", "PC"],
      required: true,
    },
    entityId: { type: String, required: true }, // ID of the source entity
    name: String,
    displayName: String,
    image: String,
    position: positionSchema,
    size: sizeSchema,
    rotation: { type: Number, default: 0 },
    hp: Number,
    maxHp: Number,
    initiative: Number,
    statusConditions: [String],
    effects: [effectSchema],
    ownerIds: [String],
    isVisible: { type: Boolean, default: true },
    activeToken: { type: Boolean, default: false },
    lightEmit: lightEmitSchema,
    notes: String,
  },
  { _id: false }
);

const assetSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    entityType: { type: String, enum: ["MapAsset"], required: true },
    entityId: { type: String, required: true },
    image: String,
    name: String,
    position: positionSchema,
    size: sizeSchema,
    rotation: { type: Number, default: 0 },
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: String,
    body: String,
    cell: positionSchema,
  },
  { _id: false }
);

const fogSchema = {
  revealedCells: [positionSchema],
  blockingCells: [positionSchema],
};

const layerSchema = new mongoose.Schema(
  {
    tokens: [tokenSchema],
    assets: [assetSchema],
  },
  { _id: false }
);

const mapSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  userId: { type: String, required: true },
  campaignId: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  gridSize: { type: Number, required: true },
  gridType: { type: String, enum: ["square", "hex"], required: true },
  fogOfWarEnabled: { type: Boolean, default: false },
  snapToGrid: { type: Boolean, default: true },
  visibleLayers: [String],
  fogOfWar: fogSchema,
  notes: [noteSchema],
  layers: {
    player: layerSchema,
    dm: layerSchema,
    hidden: layerSchema,
  },
  lastEditedAt: { type: Date, default: Date.now },
  generalNotes: String,
});

module.exports = mongoose.model("Map", mapSchema);
