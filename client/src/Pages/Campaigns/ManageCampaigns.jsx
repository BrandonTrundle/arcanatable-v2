import React, { useState } from "react";
import styles from "../../styles/Campaign/ManageCampaigns.module.css";
import Navbar from "../../Components/General/Navbar";

const MOCK_CAMPAIGNS = Array.from({ length: 4 }, (_, i) => ({
  _id: `manage-${i}`,
  name: `The Lost Realms ${i + 1}`,
  gameSystem: "D&D 5e",
  inviteCode: `JOINME${i}`,
  nextSession: "July 22, 6PM EST",
  players: [
    { _id: "u1", username: "DMHero" },
    { _id: "u2", username: "BardBarian" },
    { _id: "u3", username: "Clerica" },
  ],
}));

const ManageCampaigns = () => {
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isClosing, setIsClosing] = useState(false);

  const startEditing = (campaign) => {
    setEditingCampaign(campaign._id);
    setFormData({ ...campaign }); // shallow copy
  };

  const stopEditing = () => {
    setIsClosing(true);
    setTimeout(() => {
      setEditingCampaign(null);
      setFormData(null);
      setIsClosing(false);
    }, 300); // match fade-out duration
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const removePlayer = (id) => {
    setFormData((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p._id !== id),
    }));
  };

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <h1 className={styles.title}>Manage Campaigns</h1>

        <ul className={styles.grid}>
          {MOCK_CAMPAIGNS.map((c) => (
            <li key={c._id} className={styles.card}>
              <div>
                <h2>{c.name}</h2>
                <p>{c.gameSystem}</p>
              </div>

              <div>
                <p>
                  <strong>Invite Code:</strong> {c.inviteCode}
                </p>
                <p>
                  <strong>Next Session:</strong> {c.nextSession}
                </p>
              </div>

              <div className={styles.players}>
                <strong>Players:</strong>
                <ul>
                  {c.players.map((p) => (
                    <li key={p._id}>{p.username}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => startEditing(c)}
                >
                  Edit
                </button>
                <button className={styles.editButton}>Leave</button>
              </div>
            </li>
          ))}
        </ul>
        {editingCampaign && (
          <div
            className={`${styles.overlay} ${isClosing ? styles.fadeOut : ""}`}
            onClick={stopEditing}
          >
            <div
              className={styles.editPanel}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Edit Campaign</h2>

              <label>
                TTRPG System:
                <input
                  type="text"
                  name="gameSystem"
                  value={formData.gameSystem}
                  onChange={handleFormChange}
                />
              </label>

              <label>
                Next Session:
                <input
                  type="text"
                  name="nextSession"
                  value={formData.nextSession}
                  onChange={handleFormChange}
                />
              </label>

              <div className={styles.players}>
                <strong>Players:</strong>
                <ul>
                  {formData.players.map((p) => (
                    <li key={p._id}>
                      {p.username}
                      <button
                        className={styles.removeBtn}
                        onClick={() => removePlayer(p._id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button className={styles.inviteBtn}>
                Send Invite (Placeholder)
              </button>
              <button className={styles.closeBtn} onClick={stopEditing}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageCampaigns;
