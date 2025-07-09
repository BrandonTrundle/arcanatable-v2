import React, { useState, useEffect, useContext } from "react";
import styles from "../../../styles/DMToolkit/MapAssetForm.module.css";
import { AuthContext } from "../../../context/AuthContext";
import { fetchCampaigns } from "../../../hooks/dmtoolkit/fetchCampaigns";

export default function MapAssetForm({
  onSubmit,
  currentCampaign,
  userId,
  defaultValues = {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    width: 1,
    height: 1,
    description: "",
    tags: "",
    campaignId: currentCampaign || "", // default from props
    ...defaultValues,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { user } = useContext(AuthContext);
  const [campaignList, setCampaignList] = useState([]);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaigns = await fetchCampaigns(user);
        setCampaignList(campaigns);
      } catch (err) {
        console.error("Could not load campaigns:", err);
      }
    };

    if (user?.token) {
      loadCampaigns();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "width" || name === "height" ? parseInt(value) : value,
    }));
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

    if (!imageFile) {
      alert("Please select an image for this asset.");
      return;
    }

    const cleanTags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("width", formData.width.toString());
    payload.append("height", formData.height.toString());
    payload.append("description", formData.description);
    payload.append("tags", JSON.stringify(cleanTags));
    payload.append("userId", userId);
    payload.append("campaignId", currentCampaign);
    payload.append("image", imageFile);

    for (let [key, value] of payload.entries()) {
      console.log(`${key}:`, value);
    }

    onSubmit(payload); // send to backend
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
          required
        />
      </label>

      <label>
        Image:
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      </label>
      {imagePreview && (
        <img src={imagePreview} alt="Preview" className={styles.preview} />
      )}

      <label>
        Width (squares):
        <input
          name="width"
          type="number"
          min="1"
          value={formData.width}
          onChange={handleChange}
        />
      </label>

      <label>
        Height (squares):
        <input
          name="height"
          type="number"
          min="1"
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

      <label>
        Assign to Campaign
        <select
          name="campaignId"
          value={formData.campaignId}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              campaignId: e.target.value,
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
      </label>

      <button type="submit" className={styles.submitBtn}>
        Save Asset
      </button>
    </form>
  );
}
