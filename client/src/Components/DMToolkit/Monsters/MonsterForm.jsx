import React, { useState, useContext } from "react";
import styles from "../../../styles/DMToolkit/MonsterForm.module.css";
import { AuthContext } from "../../../context/AuthContext";

export default function MonsterForm({
  onSubmit,
  onClose,
  campaignList,
  defaultValues = {},
  mode = "create",
  monsterId = null,
}) {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState(() => {
    const hasDefaultCampaigns =
      defaultValues.campaigns && defaultValues.campaigns.length > 0;

    return {
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
      savingThrows: defaultValues.savingThrows || [],
      skills: defaultValues.skills || [],
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
      campaigns: hasDefaultCampaigns ? defaultValues.campaigns : [],
      ...defaultValues,
    };
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

  const handleCampaignChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setFormData((prev) => ({ ...prev, campaigns: selected }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚩 In handleSubmit - formData:", formData);

    if (!formData.name.trim() || !formData.hitPoints.trim()) {
      alert("Please enter a Name and Hit Points before submitting.");
      return;
    }

    // Ensure campaigns are handled
    if ((formData.campaigns || []).includes("none")) {
      formData.campaigns = [];
    }

    // Use FormData to send data + image
    const payload = new FormData();
    payload.append("data", JSON.stringify({ content: { ...formData } }));
    if (imageFile) {
      payload.append("image", imageFile);
    }

    const endpoint =
      mode === "edit"
        ? `${import.meta.env.VITE_API_BASE_URL}/api/monsters/${monsterId}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/monsters`;

    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: payload,
      });

      if (!res.ok) {
        const errMsg = await res.text();
        console.error("❌ Backend responded with error:", errMsg);
        alert("Failed to save monster.");
        return;
      }

      const savedMonster = await res.json();

      if (mode === "edit") {
        onSubmit(savedMonster);
      } else {
        // ✅ Trigger a full refresh via parent
        onSubmit(); // tell parent something was created
        onClose(); // close the form
      }
    } catch (error) {
      console.error("❌ Error during monster save:", error);
      alert("An unexpected error occurred.");
    }
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
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          setImageFile(file); // Store for upload on submit

          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewUrl(reader.result); // local preview
            };
            reader.readAsDataURL(file);
          } else {
            setPreviewUrl(null);
          }
        }}
      />

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={{ maxWidth: "150px", marginTop: "10px" }}
        />
      )}
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
      {formData.savingThrows.map((entry, index) => (
        <div key={index}>
          <input
            placeholder="Stat (e.g., DEX)"
            value={entry.stat}
            onChange={(e) => {
              const updated = [...formData.savingThrows];
              updated[index].stat = e.target.value.toUpperCase();
              setFormData({ ...formData, savingThrows: updated });
            }}
          />
          <input
            placeholder="Value (e.g., +4)"
            value={entry.value}
            onChange={(e) => {
              const updated = [...formData.savingThrows];
              updated[index].value = e.target.value;
              setFormData({ ...formData, savingThrows: updated });
            }}
          />
          <button
            type="button"
            onClick={() => {
              const updated = [...formData.savingThrows];
              updated.splice(index, 1);
              setFormData({ ...formData, savingThrows: updated });
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setFormData({
            ...formData,
            savingThrows: [...formData.savingThrows, { stat: "", value: "" }],
          })
        }
      >
        + Add Saving Throw
      </button>

      <h2>Skills</h2>
      {formData.skills.map((entry, index) => (
        <div key={index}>
          <input
            placeholder="Skill (e.g., Perception)"
            value={entry.skill}
            onChange={(e) => {
              const updated = [...formData.skills];
              updated[index].skill = e.target.value;
              setFormData({ ...formData, skills: updated });
            }}
          />
          <input
            placeholder="Value (e.g., +3)"
            value={entry.value}
            onChange={(e) => {
              const updated = [...formData.skills];
              updated[index].value = e.target.value;
              setFormData({ ...formData, skills: updated });
            }}
          />
          <button
            type="button"
            onClick={() => {
              const updated = [...formData.skills];
              updated.splice(index, 1);
              setFormData({ ...formData, skills: updated });
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setFormData({
            ...formData,
            skills: [...formData.skills, { skill: "", value: "" }],
          })
        }
      >
        + Add Skill
      </button>

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
          <h2>Assign to Campaign</h2>

          <button type="button" onClick={() => addListItem(section)}>
            + Add {section.slice(0, -1)}
          </button>
        </div>
      ))}
      <select
        multiple
        value={formData.campaigns}
        onChange={handleCampaignChange}
        className={styles.select}
      >
        <option value="">None</option>
        {campaignList?.map?.((campaign) => (
          <option key={campaign._id} value={campaign._id}>
            {campaign.name}
          </option>
        ))}
      </select>

      <button type="submit">
        {mode === "edit" ? "Update Monster" : "Create Monster"}
      </button>
    </form>
  );
}
