const mongoose = require("mongoose");

const MonsterContentSchema = new mongoose.Schema({
  name: String,
  size: String,
  type: String,
  alignment: String,
  initiative: String,
  armorClass: String,
  hitPoints: String,
  hitDice: String,
  image: String,
  description: String,
  speed: {
    walk: String,
    fly: String,
    swim: String,
    climb: String,
    burrow: String,
  },
  abilityScores: {
    str: String,
    dex: String,
    con: String,
    int: String,
    wis: String,
    cha: String,
  },
  savingThrows: [
    {
      stat: String,
      value: String,
    },
  ],
  skills: [
    {
      skill: String,
      value: String,
    },
  ],
  senses: mongoose.Schema.Types.Mixed,
  languages: String,
  challengeRating: String,
  proficiencyBonus: String,
  damageVulnerabilities: [String],
  damageResistances: [String],
  damageImmunities: [String],
  conditionImmunities: [String],
  traits: [{ name: String, desc: String }],
  actions: [{ name: String, desc: String }],
  reactions: [mongoose.Schema.Types.Mixed],
  legendaryResistances: [mongoose.Schema.Types.Mixed],
  legendaryActions: [mongoose.Schema.Types.Mixed],
  lairActions: [mongoose.Schema.Types.Mixed],
  regionalEffects: [mongoose.Schema.Types.Mixed],
  extraSections: [mongoose.Schema.Types.Mixed],
  campaigns: [{ type: mongoose.Schema.Types.ObjectId, ref: "Campaign" }],
  tokenSize: String,
});

const MonsterSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  toolkitType: {
    type: String,
    default: "Monster",
  },
  title: String,
  content: MonsterContentSchema, // ✅ this is key
});

module.exports = mongoose.model("Monster", MonsterSchema);
