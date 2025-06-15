const mongoose = require("mongoose");

const savingThrowSchema = new mongoose.Schema({
  checked: Boolean,
  bonus: String,
});

const skillSchema = new mongoose.Schema({
  name: String,
  checked: Boolean,
  bonus: String,
});

const attackSchema = new mongoose.Schema({
  name: String,
  bonus: String,
  damage: String,
});

const currencySchema = new mongoose.Schema({
  cp: Number,
  sp: Number,
  ep: Number,
  gp: Number,
  pp: Number,
});

const deathSavesSchema = new mongoose.Schema({
  successes: [Boolean],
  failures: [Boolean],
});

const spellLevelSchema = new mongoose.Schema({
  level: Number,
  slotsMax: Number,
  slotsUsed: Number,
  spells: [String],
});

const characterSchema = new mongoose.Schema(
  {
    name: String,
    playername: String,
    class: String,
    level: Number,
    race: String,
    background: String,
    alignment: String,
    experiencepoints: Number,
    portraitImage: String,
    details: {
      age: String,
      height: String,
      weight: String,
      eyes: String,
      skin: String,
      hair: String,
    },
    abilities: {
      Strength: Number,
      Dexterity: Number,
      Constitution: Number,
      Intelligence: Number,
      Wisdom: Number,
      Charisma: Number,
    },
    savingThrows: {
      Strength: savingThrowSchema,
      Dexterity: savingThrowSchema,
      Constitution: savingThrowSchema,
      Intelligence: savingThrowSchema,
      Wisdom: savingThrowSchema,
      Charisma: savingThrowSchema,
    },
    skills: [skillSchema],
    inspiration: Number,
    proficiencyBonus: Number,
    ac: Number,
    initiative: Number,
    speed: String,
    maxHp: Number,
    currenthp: Number,
    temphp: Number,
    hitdice: String,
    deathSaves: deathSavesSchema,
    attacks: [attackSchema],
    attackNotes: String,
    equipment: [String],
    currency: currencySchema,
    languages: String,
    traits: {
      personalityTraits: String,
      ideals: String,
      bonds: String,
      flaws: String,
      features: String,
    },
    appearance: String,
    backstory: String,
    organization: {
      name: String,
      symbolImage: String,
    },
    additionalFeatures: String,
    treasure: String,
    spellcasting: {
      class: String,
      ability: String,
      saveDC: String,
      attackBonus: String,
    },
    spellLevels: [spellLevelSchema],
    campaignIds: [mongoose.Schema.Types.ObjectId],
    isPublic: Boolean,
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Character", characterSchema);
