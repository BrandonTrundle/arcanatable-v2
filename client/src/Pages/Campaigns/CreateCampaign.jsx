import React, { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Campaign/CreateCampaign.module.css";
import Navbar from "../../Components/General/Navbar";
import placeholderImg from "../../assets/FantasyMapBackground.png";
import { AuthContext } from "../../context/AuthContext";

// Simulated available rules (replace with backend/API later)
const MOCK_RULES = [
  {
    _id: "rule-001",
    title: "Lingering Injuries",
  },
  {
    _id: "rule-002",
    title: "Critical Fumbles",
  },
];

const CreateCampaign = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    gameSystem: "",
    description: "",
    imageUrl: "",
    rules: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, imageUrl: previewUrl }));
    }
  };

  const handleAddRule = (ruleId) => {
    if (!form.rules.includes(ruleId)) {
      setForm((prev) => ({
        ...prev,
        rules: [...prev.rules, ruleId],
      }));
    }
  };

  const handleRemoveRule = (ruleId) => {
    setForm((prev) => ({
      ...prev,
      rules: prev.rules.filter((id) => id !== ruleId),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      // Upload image first if one is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
            body: formData,
          }
        );

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          throw new Error(uploadData.message || "Image upload failed");
        }

        imageUrl = uploadData.imageUrl;
      }

      // Proceed with campaign creation
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/campaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ ...form, imageUrl }),
        }
      );

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned unexpected response");
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to create campaign");
      }

      console.log("Campaign created:", data.campaign);
      navigate("/campaign-dashboard");
    } catch (err) {
      console.error("Error creating campaign:", err);
      alert(`Campaign creation failed: ${err.message}`);
    }
  };

  const assignedRules = MOCK_RULES.filter((r) => form.rules.includes(r._id));
  const unassignedRules = MOCK_RULES.filter((r) => !form.rules.includes(r._id));

  return (
    <>
      <Navbar />
      <div className={styles.createcampaign}>
        <div className={styles.wrapper}>
          <h1>Create New Campaign</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Campaign Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="gameSystem">Game System</label>
              <input
                type="text"
                name="gameSystem"
                value={form.gameSystem}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="description">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            <div className={styles.field}>
              <label>Campaign Image</label>
              <div className={styles.imagePicker}>
                <div className={styles.imagePicker}>
                  <img
                    src={form.imageUrl || placeholderImg}
                    alt="Preview"
                    className={styles.preview}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ cursor: "pointer" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <button
                    type="button"
                    className={styles.uploadBtn}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Image
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label>Assign Custom Rules</label>

              {form.rules.length > 0 ? (
                <ul>
                  {assignedRules.map((rule) => (
                    <li key={rule._id}>
                      {rule.title}
                      <button
                        type="button"
                        className={styles.uploadBtn}
                        onClick={() => handleRemoveRule(rule._id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontStyle: "italic" }}>No rules assigned.</p>
              )}

              {unassignedRules.length > 0 && (
                <>
                  <label htmlFor="rulePicker">Add a Rule</label>
                  <select
                    name="rulePicker"
                    onChange={(e) => {
                      handleAddRule(e.target.value);
                      e.target.value = "";
                    }}
                  >
                    <option value="">Select a rule to add...</option>
                    {unassignedRules.map((rule) => (
                      <option key={rule._id} value={rule._id}>
                        {rule.title}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            <button type="submit" className={styles.submitBtn}>
              Create Campaign
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateCampaign;
