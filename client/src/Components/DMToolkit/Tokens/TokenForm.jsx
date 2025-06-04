import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/TokenForm.module.css";

export default function TokenForm({ defaultValues = {}, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    image: "",
    hp: 10,
    maxHp: 10,
    initiative: 0,
    size: { width: 1, height: 1 },
    isVisible: true,
    rotation: 0,
    notes: "",
    ...defaultValues,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["width", "height"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        size: {
          ...prev.size,
          [name]: Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>New Token</h2>

      <label>Name</label>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Internal name"
      />

      <label>Display Name</label>
      <input
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
        placeholder="Visible name"
      />

      <label>Image URL</label>
      <input
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="/images/token.png"
      />

      <label>HP</label>
      <input
        type="number"
        name="hp"
        value={formData.hp}
        onChange={handleChange}
      />

      <label>Max HP</label>
      <input
        type="number"
        name="maxHp"
        value={formData.maxHp}
        onChange={handleChange}
      />

      <label>Initiative</label>
      <input
        type="number"
        name="initiative"
        value={formData.initiative}
        onChange={handleChange}
      />

      <label>Width (tiles)</label>
      <input
        type="number"
        name="width"
        value={formData.size.width}
        onChange={handleChange}
      />

      <label>Height (tiles)</label>
      <input
        type="number"
        name="height"
        value={formData.size.height}
        onChange={handleChange}
      />

      <label>Rotation (deg)</label>
      <input
        type="number"
        name="rotation"
        value={formData.rotation}
        onChange={handleChange}
      />

      <label>
        <input
          type="checkbox"
          name="isVisible"
          checked={formData.isVisible}
          onChange={handleChange}
        />
        Token is visible to players
      </label>

      <label>Notes</label>
      <textarea name="notes" value={formData.notes} onChange={handleChange} />

      <button type="submit" className={styles.submitBtn}>
        Save Token
      </button>
    </form>
  );
}
