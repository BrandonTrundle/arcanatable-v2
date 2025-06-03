import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/ItemForm.module.css";

export default function ItemForm({
  onSubmit,
  currentCampaign,
  defaultValues = {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    type: "",
    rarity: "",
    isMagical: false,
    attunementRequired: false,
    damage: "",
    properties: "",
    charges: 0,
    effects: [],
    description: "",
    weight: "",
    value: "",
    image: "",
    campaigns: [currentCampaign],
    ...defaultValues,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleListChange = (index, field, value) => {
    const updated = [...formData.effects];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, effects: updated }));
  };

  const addEffect = () => {
    setFormData((prev) => ({
      ...prev,
      effects: [...prev.effects, { name: "", desc: "" }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, currentCampaign);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Item Info</h2>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
      />
      <input
        name="type"
        placeholder="Type (e.g., Weapon, Artifact)"
        value={formData.type}
        onChange={handleChange}
      />
      <input
        name="rarity"
        placeholder="Rarity (e.g., Common, Rare)"
        value={formData.rarity}
        onChange={handleChange}
      />
      <label>
        <input
          type="checkbox"
          name="isMagical"
          checked={formData.isMagical}
          onChange={handleChange}
        />
        Magical
      </label>
      <label>
        <input
          type="checkbox"
          name="attunementRequired"
          checked={formData.attunementRequired}
          onChange={handleChange}
        />
        Requires Attunement
      </label>
      <input
        name="damage"
        placeholder="Damage (e.g., 1d8 + 1 fire)"
        value={formData.damage}
        onChange={handleChange}
      />
      <input
        name="properties"
        placeholder="Properties (e.g., Versatile)"
        value={formData.properties}
        onChange={handleChange}
      />
      <input
        name="charges"
        type="number"
        placeholder="Charges"
        value={formData.charges}
        onChange={handleChange}
      />
      <input
        name="weight"
        placeholder="Weight (e.g., 3 lbs)"
        value={formData.weight}
        onChange={handleChange}
      />
      <input
        name="value"
        placeholder="Value (e.g., 500 gp)"
        value={formData.value}
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

      <h2>Effects</h2>
      {formData.effects.map((effect, index) => (
        <div key={index}>
          <input
            placeholder="Effect Name"
            value={effect.name}
            onChange={(e) => handleListChange(index, "name", e.target.value)}
          />
          <textarea
            placeholder="Effect Description"
            value={effect.desc}
            onChange={(e) => handleListChange(index, "desc", e.target.value)}
          />
        </div>
      ))}
      <button type="button" onClick={addEffect}>
        + Add Effect
      </button>

      <button type="submit" className={styles.submitBtn}>
        Create Item
      </button>
    </form>
  );
}
