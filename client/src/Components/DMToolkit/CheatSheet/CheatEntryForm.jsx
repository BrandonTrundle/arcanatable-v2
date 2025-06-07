import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/CheatEntryForm.module.css";

export default function CheatEntryForm({
  onSubmit,
  currentCampaign,
  defaultValues = {},
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [],
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
      <h2>Cheat Sheet Entry</h2>

      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        rows={6}
      />
      <input
        name="tags"
        placeholder="Tags (comma-separated)"
        value={formData.tags}
        onChange={handleChange}
      />

      <button type="submit" className={styles.submitBtn}>
        Save Entry
      </button>
    </form>
  );
}
