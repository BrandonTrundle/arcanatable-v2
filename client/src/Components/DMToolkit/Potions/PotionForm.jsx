import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/PotionForm.module.css";

export default function PotionForm({
  onSubmit,
  currentCampaign,
  defaultValues = {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    rarity: "",
    type: "Consumable",
    effect: "",
    duration: "",
    sideEffects: "",
    description: "",
    cost: "",
    weight: "",
    uses: 1,
    image: "",
    campaigns: [currentCampaign],
    ...defaultValues,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, currentCampaign);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>New Potion</h2>

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="rarity"
        placeholder="Rarity (e.g. Common, Rare)"
        value={formData.rarity}
        onChange={handleChange}
      />
      <input
        name="type"
        placeholder="Type"
        value={formData.type}
        onChange={handleChange}
      />
      <input
        name="effect"
        placeholder="Effect"
        value={formData.effect}
        onChange={handleChange}
      />
      <input
        name="duration"
        placeholder="Duration"
        value={formData.duration}
        onChange={handleChange}
      />
      <input
        name="sideEffects"
        placeholder="Side Effects (optional)"
        value={formData.sideEffects}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        name="cost"
        placeholder="Cost (e.g. 50 gp)"
        value={formData.cost}
        onChange={handleChange}
      />
      <input
        name="weight"
        placeholder="Weight (e.g. 0.5 lbs)"
        value={formData.weight}
        onChange={handleChange}
      />
      <input
        name="uses"
        placeholder="Uses"
        type="number"
        value={formData.uses}
        onChange={handleChange}
      />
      <input
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
      />

      <button type="submit" className={styles.submitBtn}>
        Create Potion
      </button>
    </form>
  );
}
