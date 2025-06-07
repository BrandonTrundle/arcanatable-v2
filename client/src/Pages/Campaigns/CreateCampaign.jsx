import React, { useState } from "react";
import styles from "../../styles/Campaign/CreateCampaign.module.css";
import Navbar from "../../Components/General/Navbar";
import placeholderImg from "../../assets/FantasyMapBackground.png";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic goes here (send form to API/backend)
    console.log("Campaign created:", form);
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
                <img
                  src={form.imageUrl || placeholderImg}
                  alt="Preview"
                  className={styles.preview}
                />
                <button type="button" className={styles.uploadBtn}>
                  Choose Image (Placeholder)
                </button>
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
