const mongoose = require("mongoose");

const npcContentSchema = new mongoose.Schema(
  {
    name: String,
    title: String,
    race: String,
    class: String,
    gender: String,
    age: String,
    background: String,
    occupation: String,
    size: String,
    tokenSize: String,
    type: String,
    alignment: String,
    armorClass: String,
    hitPoints: String,
    hitDice: String,
    initiative: String,
    speed: {
      walk: String,
      fly: String,
      swim: String,
      climb: String,
      burrow: String,
    },
    proficiencyBonus: String,
    challengeRating: String,
    languages: { type: [String], default: [] },
    abilityScores: {
      str: Number,
      dex: Number,
      con: Number,
      int: Number,
      wis: Number,
      cha: Number,
    },
    savingThrows: [
      {
        name: String,
        value: String,
      },
    ],
    skills: [
      {
        name: String,
        value: String,
      },
    ],
    senses: {
      darkvision: String,
      blindsight: String,
      tremorsense: String,
      truesight: String,
      passivePerception: String,
    },
    damageVulnerabilities: [String],
    damageResistances: [String],
    damageImmunities: [String],
    conditionImmunities: [String],
    traits: [
      {
        name: String,
        desc: String,
      },
    ],
    actions: [
      {
        name: String,
        desc: String,
      },
    ],
    reactions: [
      {
        name: String,
        desc: String,
      },
    ],
    legendaryResistances: [
      {
        name: String,
        desc: String,
      },
    ],
    legendaryActions: [
      {
        name: String,
        desc: String,
      },
    ],
    lairActions: [
      {
        name: String,
        desc: String,
      },
    ],
    regionalEffects: [
      {
        name: String,
        desc: String,
      },
    ],
    description: String,
    image: String,
    extraSections: [
      {
        name: String,
        desc: String,
      },
    ],
    campaigns: [String],
  },
  { _id: false }
);

const npcSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: npcContentSchema,
    required: true,
  },
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
  toolkitType: {
    type: String,
    default: "NPC", // optional default
  },
});

const modelName = "NPC";
if (mongoose.models[modelName]) {
  delete mongoose.models[modelName];
}

module.exports = mongoose.model(modelName, npcSchema);
