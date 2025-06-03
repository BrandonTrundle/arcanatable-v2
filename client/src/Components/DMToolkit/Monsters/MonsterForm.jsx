import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/MonsterForm.module.css";

export default function MonsterForm({
  onSubmit,
  currentCampaign,
  defaultValues = {},
}) {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    size: "",
    type: "",
    alignment: "",
    initiative: "",
    armorClass: "",
    hitPoints: "",
    hitDice: "",
    image: "",
    description: "",
    speed: {
      walk: "",
      fly: "",
      swim: "",
      climb: "",
      burrow: "",
    },
    abilityScores: {
      str: "",
      dex: "",
      con: "",
      int: "",
      wis: "",
      cha: "",
    },
    savingThrows: {
      CON: "",
    },
    skills: {
      Stealth: "",
    },
    senses: {
      darkvision: "",
      blindsight: "",
      tremorsense: "",
      truesight: "",
      passivePerception: "",
    },
    languages: "",
    challengeRating: "",
    proficiencyBonus: "",
    damageVulnerabilities: [],
    damageResistances: [],
    damageImmunities: [],
    conditionImmunities: [],
    traits: [],
    actions: [],
    reactions: [],
    legendaryResistances: [],
    legendaryActions: [],
    lairActions: [],
    regionalEffects: [],
    extraSections: [],
    campaigns: [currentCampaign],
    ...defaultValues,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      if (keys.length === 1) updated[keys[0]] = value;
      else if (keys.length === 2)
        updated[keys[0]] = { ...updated[keys[0]], [keys[1]]: value };
      return updated;
    });
  };

  const handleListChange = (key, index, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[key] = [...updated[key]];
      updated[key][index] = { ...updated[key][index], [field]: value };
      return updated;
    });
  };

  const addListItem = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], { name: "", desc: "" }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, currentCampaign);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Overview</h2>
      <h3 className="entryname">Name</h3>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        value={formData.name}
      />
      <h3 className="entryname">Size</h3>
      <input
        name="size"
        placeholder="Size"
        onChange={handleChange}
        value={formData.size}
      />
      <h3 className="entryname">Type</h3>
      <input
        name="type"
        placeholder="Type"
        onChange={handleChange}
        value={formData.type}
      />
      <h3 className="entryname">Alignment</h3>
      <input
        name="alignment"
        placeholder="Alignment"
        onChange={handleChange}
        value={formData.alignment}
      />
      <h3 className="entryname">Initiative</h3>
      <input
        name="initiative"
        placeholder="Initiative"
        onChange={handleChange}
        value={formData.initiative}
      />
      <h3 className="entryname">Image</h3>
      <input
        name="image"
        placeholder="Image URL"
        onChange={handleChange}
        value={formData.image}
      />
      <h3 className="entryname">Description</h3>
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        value={formData.description}
      />

      <h2>Stats</h2>
      <h3 className="entryname">Armor Class</h3>
      <input
        name="armorClass"
        placeholder="Armor Class"
        onChange={handleChange}
        value={formData.armorClass}
      />
      <h3 className="entryname">Hit Points</h3>
      <input
        name="hitPoints"
        placeholder="Hit Points"
        onChange={handleChange}
        value={formData.hitPoints}
      />
      <h3 className="entryname">Hit Dice</h3>
      <input
        name="hitDice"
        placeholder="Hit Dice"
        onChange={handleChange}
        value={formData.hitDice}
      />

      <h2>Speed</h2>
      {["walk", "fly", "swim", "climb", "burrow"].map((type) => (
        <div key={type}>
          <h3 className="entryname">
            {type.charAt(0).toUpperCase() + type.slice(1)} Speed
          </h3>
          <input
            name={`speed.${type}`}
            placeholder={`${type} Speed`}
            onChange={handleChange}
            value={formData.speed[type]}
          />
        </div>
      ))}

      <h2>Ability Scores</h2>
      {["str", "dex", "con", "int", "wis", "cha"].map((stat) => (
        <div key={stat}>
          <h3 className="entryname">{stat.toUpperCase()}</h3>
          <input
            name={`abilityScores.${stat}`}
            placeholder={stat.toUpperCase()}
            onChange={handleChange}
            value={formData.abilityScores[stat]}
          />
        </div>
      ))}

      <h2>Saving Throws</h2>
      <h3 className="entryname">CON</h3>
      <input
        name="savingThrows.CON"
        placeholder="CON"
        onChange={handleChange}
        value={formData.savingThrows.CON}
      />

      <h2>Skills</h2>
      <h3 className="entryname">Stealth</h3>
      <input
        name="skills.Stealth"
        placeholder="Stealth"
        onChange={handleChange}
        value={formData.skills.Stealth}
      />

      <h2>Senses & Challenge Rating</h2>
      {[
        "darkvision",
        "blindsight",
        "tremorsense",
        "truesight",
        "passivePerception",
      ].map((sense) => (
        <div key={sense}>
          <h3 className="entryname">
            {sense.charAt(0).toUpperCase() + sense.slice(1)}
          </h3>
          <input
            name={`senses.${sense}`}
            placeholder={sense}
            onChange={handleChange}
            value={formData.senses[sense]}
          />
        </div>
      ))}

      <h3 className="entryname">Languages</h3>
      <input
        name="languages"
        placeholder="Languages"
        onChange={handleChange}
        value={formData.languages}
      />
      <h3 className="entryname">Challenge Rating</h3>
      <input
        name="challengeRating"
        placeholder="Challenge Rating"
        onChange={handleChange}
        value={formData.challengeRating}
      />
      <h3 className="entryname">Proficiency Bonus</h3>
      <input
        name="proficiencyBonus"
        placeholder="Proficiency Bonus"
        onChange={handleChange}
        value={formData.proficiencyBonus}
      />

      <h2>Traits & Actions</h2>
      {["traits", "actions"].map((section) => (
        <div key={section}>
          <h3 className="entryname">
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </h3>
          {formData[section].map((item, index) => (
            <div key={index}>
              <h4>Name</h4>
              <input
                placeholder="Name"
                value={item.name}
                onChange={(e) =>
                  handleListChange(section, index, "name", e.target.value)
                }
              />
              <h4>Description</h4>
              <textarea
                placeholder="Description"
                value={item.desc}
                onChange={(e) =>
                  handleListChange(section, index, "desc", e.target.value)
                }
              />
            </div>
          ))}
          <button type="button" onClick={() => addListItem(section)}>
            + Add {section.slice(0, -1)}
          </button>
        </div>
      ))}

      <button type="submit" className={styles.submitBtn}>
        Create Monster
      </button>
    </form>
  );
}
