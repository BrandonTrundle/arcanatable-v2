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
    tags: "",
    campaigns: [currentCampaign],
    ...defaultValues,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit(
      {
        ...formData,
        tags: cleanTags,
        imageFile,
      },
      currentCampaign
    );
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Map Asset</h2>

      <label>
        Name:
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Asset Name"
        />
      </label>

      <label>
        Image:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      {imagePreview && (
        <img src={imagePreview} alt="Preview" className={styles.preview} />
      )}

      <label>
        Width (squares):
        <input
          name="width"
          type="number"
          value={formData.width}
          onChange={handleChange}
        />
      </label>

      <label>
        Height (squares):
        <input
          name="height"
          type="number"
          value={formData.height}
          onChange={handleChange}
        />
      </label>

      <label>
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Tags (comma-separated):
        <input name="tags" value={formData.tags} onChange={handleChange} />
      </label>

      <button type="submit" className={styles.submitBtn}>
        Save Asset
      </button>
    </form>
  );
}
