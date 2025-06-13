import React, { useState } from "react";
import styles from "../../../styles/DMToolkit/TokenForm.module.css";

export default function TokenForm({
  defaultValues = {},
  onSubmit,
  campaignList = [],
  currentCampaign = "none",
}) {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    maxHp: 10,
    initiative: 0,
    size: { width: 1, height: 1 },
    rotation: 0,
    notes: "",
    campaignId:
      defaultValues.campaignId ??
      (currentCampaign === "none" ? "" : currentCampaign),
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
        placeholder="Name"
      />

      <label>Image URL or Upload</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setFormData((prev) => ({
              ...prev,
              image: file, // store the File object directly
            }));
          }
        }}
      />

      {formData.image && (
        <div style={{ marginTop: "1rem" }}>
          <p>Image Preview:</p>
          <img
            src={
              formData.image instanceof File
                ? URL.createObjectURL(formData.image)
                : formData.image
            }
            alt="Token Preview"
            style={{ maxWidth: "200px", borderRadius: "8px" }}
          />
        </div>
      )}

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

      <label>Notes</label>
      <textarea name="notes" value={formData.notes} onChange={handleChange} />

      <label>Assign to Campaign</label>
      <select
        name="campaignId"
        value={formData.campaignId}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, campaignId: e.target.value }))
        }
      >
        <option value="">None</option>
        {campaignList.map((campaign) => (
          <option key={campaign._id} value={campaign._id}>
            {campaign.name}
          </option>
        ))}
      </select>

      <button type="submit" className={styles.submitBtn}>
        Save Token
      </button>
    </form>
  );
}
