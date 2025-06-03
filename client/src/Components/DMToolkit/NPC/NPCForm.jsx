import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/NPCForm.module.css";

export default function NPCForm({
  onSubmit,
  currentCampaign,
  defaultValues = {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    race: "",
    class: "",
    gender: "",
    age: "",
    background: "",
    occupation: "",
    size: "Medium",
    alignment: "",
    armorClass: "",
    hitPoints: "",
    hitDice: "",
    speed: {
      walk: "",
      fly: "",
      swim: "",
      climb: "",
      burrow: "",
    },
    proficiencyBonus: "",
    challengeRating: "",
    languages: "",
    abilityScores: {
      str: "",
      dex: "",
      con: "",
      int: "",
      wis: "",
      cha: "",
    },
    savingThrows: {},
    skills: {},
    senses: {
      passivePerception: "",
    },
    traits: [],
    actions: [],
    description: "",
    image: "",
    campaigns: [currentCampaign],
    ...defaultValues,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      if (keys.length === 1) updated[keys[0]] = value;
      else updated[keys[0]] = { ...updated[keys[0]], [keys[1]]: value };
      return updated;
    });
  };

  const handleListChange = (key, index, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
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
      <h2>NPC Overview</h2>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="race"
        placeholder="Race"
        value={formData.race}
        onChange={handleChange}
      />
      <input
        name="class"
        placeholder="Class"
        value={formData.class}
        onChange={handleChange}
      />
      <input
        name="gender"
        placeholder="Gender"
        value={formData.gender}
        onChange={handleChange}
      />
      <input
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
      />
      <input
        name="background"
        placeholder="Background"
        value={formData.background}
        onChange={handleChange}
      />
      <input
        name="occupation"
        placeholder="Occupation"
        value={formData.occupation}
        onChange={handleChange}
      />
      <input
        name="alignment"
        placeholder="Alignment"
        value={formData.alignment}
        onChange={handleChange}
      />
      <input
        name="armorClass"
        placeholder="Armor Class"
        value={formData.armorClass}
        onChange={handleChange}
      />
      <input
        name="hitPoints"
        placeholder="Hit Points"
        value={formData.hitPoints}
        onChange={handleChange}
      />
      <input
        name="hitDice"
        placeholder="Hit Dice"
        value={formData.hitDice}
        onChange={handleChange}
      />
      <input
        name="proficiencyBonus"
        placeholder="Proficiency Bonus"
        value={formData.proficiencyBonus}
        onChange={handleChange}
      />
      <input
        name="challengeRating"
        placeholder="Challenge Rating"
        value={formData.challengeRating}
        onChange={handleChange}
      />
      <input
        name="languages"
        placeholder="Languages"
        value={formData.languages}
        onChange={handleChange}
      />
      <input
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />

      <h2>Ability Scores</h2>
      {["str", "dex", "con", "int", "wis", "cha"].map((stat) => (
        <input
          key={stat}
          name={`abilityScores.${stat}`}
          placeholder={stat.toUpperCase()}
          value={formData.abilityScores[stat]}
          onChange={handleChange}
        />
      ))}

      <h2>Traits</h2>
      {formData.traits.map((trait, index) => (
        <div key={index}>
          <input
            placeholder="Name"
            value={trait.name}
            onChange={(e) =>
              handleListChange("traits", index, "name", e.target.value)
            }
          />
          <textarea
            placeholder="Description"
            value={trait.desc}
            onChange={(e) =>
              handleListChange("traits", index, "desc", e.target.value)
            }
          />
        </div>
      ))}
      <button type="button" onClick={() => addListItem("traits")}>
        + Add Trait
      </button>

      <h2>Actions</h2>
      {formData.actions.map((action, index) => (
        <div key={index}>
          <input
            placeholder="Name"
            value={action.name}
            onChange={(e) =>
              handleListChange("actions", index, "name", e.target.value)
            }
          />
          <textarea
            placeholder="Description"
            value={action.desc}
            onChange={(e) =>
              handleListChange("actions", index, "desc", e.target.value)
            }
          />
        </div>
      ))}
      <button type="button" onClick={() => addListItem("actions")}>
        + Add Action
      </button>

      <button type="submit" className={styles.submitBtn}>
        Create NPC
      </button>
    </form>
  );
}
