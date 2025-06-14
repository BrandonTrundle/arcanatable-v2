import React, { useState, useEffect, useContext } from "react";
import styles from "../../../styles/DMToolkit/MapForm.module.css";
import { AuthContext } from "../../../context/AuthContext";
import { fetchCampaigns } from "../../../hooks/dmtoolkit/fetchCampaigns";

export default function MapForm({
  onSubmit,
  currentCampaign,
  defaultValues = {},
}) {
  const { user } = useContext(AuthContext);
  const [campaignList, setCampaignList] = useState([]);
  const safeDefaults = defaultValues || {};
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
    ...safeDefaults,
  });

  const [imagePreview, setImagePreview] = useState(
    typeof safeDefaults.image === "string" ? safeDefaults.image : ""
  );

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns(user);
        setCampaignList(campaigns);
      } catch (err) {
        console.error("Could not load campaigns:", err);
      }
    };

    if (user?.token) loadCampaigns();
  }, [user]);

  useEffect(() => {
    if (formData.image instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(formData.image);
    } else if (typeof formData.image === "string") {
      setImagePreview(formData.image);
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
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

      <label>Upload Image</label>
      <input type="file" accept="image/*" onChange={handleChange} />

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Map Preview"
          className={styles.previewImage}
        />
      )}

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

      <label>Assign to Campaign</label>
      <select
        name="campaigns"
        value={formData.campaigns[0] || ""}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            campaigns: [e.target.value],
          }))
        }
      >
        <option value="">-- Select a campaign --</option>
        {campaignList.map((campaign) => (
          <option key={campaign._id} value={campaign._id}>
            {campaign.name}
          </option>
        ))}
      </select>

      <button type="submit" className={styles.submitBtn}>
        Save Map
      </button>
    </form>
  );
}
