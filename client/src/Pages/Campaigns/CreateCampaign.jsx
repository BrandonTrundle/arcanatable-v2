// CreateCampaign.jsx
import React, { useState } from "react";
import styles from "../../styles/Campaign/CreateCampaign.module.css";
import Navbar from "../../Components/General/Navbar";
import placeholderImg from "../../assets/FantasyMapBackground.png";

const CreateCampaign = () => {
  const [form, setForm] = useState({
    name: "",
    gameSystem: "",
    description: "",
    imageUrl: "", // placeholder only
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //   console.log("Creating campaign:", form);
    // API logic will go here
  };

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
