import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/MapForm.module.css";

export default function MapForm({
  onSubmit,
  currentCampaign,
  defaultValues = {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    width: 30,
    height: 30,
    gridSize: 70,
    gridType: "square",
    fogOfWarEnabled: false,
    snapToGrid: true,
    campaigns: [currentCampaign],
    ...defaultValues,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData, currentCampaign);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Map Details</h2>

      <label>Name</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Map Name"
      />

      <label>Image URL</label>
      <input
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
      />

      <label>Width (tiles)</label>
      <input
        type="number"
        name="width"
        value={formData.width}
        onChange={handleChange}
      />

      <label>Height (tiles)</label>
      <input
        type="number"
        name="height"
        value={formData.height}
        onChange={handleChange}
      />

      <label>Grid Size (px)</label>
      <input
        type="number"
        name="gridSize"
        value={formData.gridSize}
        onChange={handleChange}
      />

      <label>Grid Type</label>
      <select name="gridType" value={formData.gridType} onChange={handleChange}>
        <option value="square">Square</option>
        <option value="hex">Hex</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="fogOfWarEnabled"
          checked={formData.fogOfWarEnabled}
          onChange={handleChange}
        />
        Enable Fog of War
      </label>

      <label>
        <input
          type="checkbox"
          name="snapToGrid"
          checked={formData.snapToGrid}
          onChange={handleChange}
        />
        Snap Tokens to Grid
      </label>

      <button type="submit" className={styles.submitBtn}>
        Save Map
      </button>
    </form>
  );
}
