import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../../styles/DMToolkit/NPCForm.module.css";
import { fetchCampaigns } from "../../../hooks/dmtoolkit/fetchCampaigns";

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
    size: "",
    tokenSize: "",
    alignment: "",
    armorClass: "",
    hitPoints: "",
    hitDice: "",
    initiative: "",
    proficiencyBonus: "",
    challengeRating: "",
    languages: [],
    newLang: "",
    abilityScores: {
      str: "",
      dex: "",
      con: "",
      int: "",
      wis: "",
      cha: "",
    },
    savingThrows: {},
    newSaveKey: "",
    newSaveValue: "",
    skills: {},
    newSkillKey: "",
    newSkillValue: "",
    traits: [],
    actions: [],
    description: "",
    image: "",
    speed: {
      walk: "",
      fly: "",
      swim: "",
      climb: "",
      burrow: "",
    },
    senses: {
      passivePerception: "",
    },
    campaigns: currentCampaign === "none" ? [] : [currentCampaign],
    ...defaultValues,
  });
  const { user } = useContext(AuthContext);
  const [availableCampaigns, setAvailableCampaigns] = useState([]);

  useEffect(() => {
    const loadCampaigns = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const campaigns = await fetchCampaigns({ token });
        setAvailableCampaigns(campaigns);
      }
    };

    loadCampaigns();
  }, []);

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
      updated[key][index] = field
        ? { ...updated[key][index], [field]: value }
        : value;
      return updated;
    });
  };

  const addListItem = (key, item) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], item],
    }));
  };

  const removeListItem = (key, index) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("content", JSON.stringify(formData));
    if (formData.image instanceof File) {
      payload.append("image", formData.image);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/npcs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: payload,
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("❌ Backend error:", error);
        alert("Failed to create NPC.");
        return;
      }

      const savedNPC = await res.json();
      onSubmit(savedNPC);
    } catch (err) {
      console.error("❌ Exception:", err);
      alert("Unexpected error.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>NPC Details</h2>

      {[
        "name",
        "race",
        "class",
        "gender",
        "age",
        "alignment",
        "background",
        "occupation",
        "armorClass",
        "hitPoints",
        "hitDice",
        "initiative",
        "proficiencyBonus",
        "challengeRating",
        "description",
      ].map((field) => (
        <div key={field} className={styles.inputGroup}>
          <label htmlFor={field}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </label>
          <input
            id={field}
            name={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* Speed Fields */}
      <h3>Speed</h3>
      {["walk", "fly", "swim", "climb", "burrow"].map((type) => (
        <div key={type} className={styles.inputGroup}>
          <label htmlFor={`speed.${type}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)} Speed
          </label>
          <input
            id={`speed.${type}`}
            name={`speed.${type}`}
            placeholder={`${
              type.charAt(0).toUpperCase() + type.slice(1)
            } Speed`}
            value={formData.speed[type]}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* Image Upload */}
      <h3>Image Upload</h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setFormData((prev) => ({
              ...prev,
              image: file, // Store the File object directly
            }));
          }
        }}
      />

      {formData.image && (
        <div className={styles.imagePreview}>
          <img
            src={
              formData.image instanceof File
                ? URL.createObjectURL(formData.image)
                : formData.image
            }
            alt="NPC Portrait Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              marginTop: "0.5rem",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      {/* Token Size Dropdown */}
      <div>
        <label>Token Size</label>
        <select
          value={formData.tokenSize}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, tokenSize: e.target.value }))
          }
        >
          <option value="">Select...</option>
          {["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"].map(
            (size) => (
              <option key={size} value={size}>
                {size}
              </option>
            )
          )}
        </select>
      </div>

      {/* Ability Scores */}
      <h3>Ability Scores</h3>
      {Object.keys(formData.abilityScores).map((attr) => (
        <div key={attr} className={styles.inputGroup}>
          <label htmlFor={`abilityScores.${attr}`}>{attr.toUpperCase()}</label>
          <input
            id={`abilityScores.${attr}`}
            name={`abilityScores.${attr}`}
            placeholder={attr.toUpperCase()}
            value={formData.abilityScores[attr]}
            onChange={handleChange}
          />
        </div>
      ))}

      {/* Saving Throws */}
      <h3>Saving Throws</h3>
      {Object.entries(formData.savingThrows).map(([key, val]) => (
        <div key={key}>
          <input readOnly value={key} />
          <input
            value={val}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                savingThrows: { ...prev.savingThrows, [key]: e.target.value },
              }))
            }
          />
          <button
            type="button"
            onClick={() => {
              const updated = { ...formData.savingThrows };
              delete updated[key];
              setFormData((prev) => ({
                ...prev,
                savingThrows: updated,
              }));
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <input
        placeholder="Save Name"
        value={formData.newSaveKey}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, newSaveKey: e.target.value }))
        }
      />
      <input
        placeholder="Value"
        value={formData.newSaveValue}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, newSaveValue: e.target.value }))
        }
      />
      <button
        type="button"
        onClick={() => {
          if (formData.newSaveKey && formData.newSaveValue) {
            setFormData((prev) => ({
              ...prev,
              savingThrows: {
                ...prev.savingThrows,
                [prev.newSaveKey]: prev.newSaveValue,
              },
              newSaveKey: "",
              newSaveValue: "",
            }));
          }
        }}
      >
        Add Saving Throw
      </button>

      {/* Skills */}
      <h3>Skills</h3>
      {Object.entries(formData.skills).map(([key, val]) => (
        <div key={key}>
          <input readOnly value={key} />
          <input
            value={val}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                skills: { ...prev.skills, [key]: e.target.value },
              }))
            }
          />
          <button
            type="button"
            onClick={() => {
              const updated = { ...formData.skills };
              delete updated[key];
              setFormData((prev) => ({
                ...prev,
                skills: updated,
              }));
            }}
          >
            Remove
          </button>
        </div>
      ))}
      <input
        placeholder="Skill Name"
        value={formData.newSkillKey}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, newSkillKey: e.target.value }))
        }
      />
      <input
        placeholder="Value"
        value={formData.newSkillValue}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, newSkillValue: e.target.value }))
        }
      />
      <button
        type="button"
        onClick={() => {
          if (formData.newSkillKey && formData.newSkillValue) {
            setFormData((prev) => ({
              ...prev,
              skills: {
                ...prev.skills,
                [prev.newSkillKey]: prev.newSkillValue,
              },
              newSkillKey: "",
              newSkillValue: "",
            }));
          }
        }}
      >
        Add Skill
      </button>

      {/* Traits / Actions */}
      {["traits", "actions"].map((key) => (
        <div key={key}>
          <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
          {formData[key].map((item, i) => (
            <div key={i}>
              <input
                placeholder="Name"
                value={item.name}
                onChange={(e) =>
                  handleListChange(key, i, "name", e.target.value)
                }
              />
              <textarea
                placeholder="Description"
                value={item.desc}
                onChange={(e) =>
                  handleListChange(key, i, "desc", e.target.value)
                }
              />
              <button type="button" onClick={() => removeListItem(key, i)}>
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem(key, { name: "", desc: "" })}
          >
            + Add {key.slice(0, -1)}
          </button>
        </div>
      ))}

      {/* Languages */}
      <h3>Languages</h3>
      <ul>
        {formData.languages.map((lang, i) => (
          <li key={i}>
            <input
              value={lang}
              onChange={(e) =>
                handleListChange("languages", i, null, e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeListItem("languages", i)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <input
        placeholder="New language"
        value={formData.newLang}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, newLang: e.target.value }))
        }
      />
      <button
        type="button"
        onClick={() => {
          if (formData.newLang) {
            setFormData((prev) => ({
              ...prev,
              languages: [...prev.languages, formData.newLang],
              newLang: "",
            }));
          }
        }}
      >
        Add
      </button>

      <h3>Assign to Campaign</h3>
      <select
        value={formData.campaigns[0] || "none"}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            campaigns: e.target.value === "none" ? [] : [e.target.value],
          }))
        }
      >
        <option value="none">None</option>
        {availableCampaigns?.map?.((campaign) => (
          <option key={campaign._id} value={campaign._id}>
            {campaign.name}
          </option>
        ))}
      </select>

      <button type="submit" className={styles.submitBtn}>
        Create NPC
      </button>
    </form>
  );
}
