import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/MapAssetForm.module.css";

export default function MapAssetForm({
  onSubmit,
  currentCampaign,
  defaultValues = {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    width: 1,
    height: 1,
    description: "",
    tags: [],
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
    const cleanTags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({ ...formData, tags: cleanTags }, currentCampaign);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Map Asset</h2>

      <input
        name="name"
        placeholder="Asset Name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
      />
      <input
        name="width"
        type="number"
        placeholder="Width (squares)"
        value={formData.width}
        onChange={handleChange}
      />
      <input
        name="height"
        type="number"
        placeholder="Height (squares)"
        value={formData.height}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        name="tags"
        placeholder="Tags (comma-separated)"
        value={formData.tags}
        onChange={handleChange}
      />

      <button type="submit" className={styles.submitBtn}>
        Save Asset
      </button>
    </form>
  );
}
