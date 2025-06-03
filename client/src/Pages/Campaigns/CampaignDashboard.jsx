// CampaignDashboard.jsx
import React, { useState } from "react";
import styles from "../../styles/Campaign/CampaignDashboard.module.css";
import defaultAvatar from "../../assets/defaultav.png";
import placeholderImg from "../../assets/FantasyMapBackground.png";
import Navbar from "../../Components/General/Navbar";

const MOCK_CAMPAIGNS = Array.from({ length: 8 }, (_, i) => ({
  _id: `mock-${i}`,
  name: `Campaign ${i + 1}`,
  gameSystem: "D&D 5e",
  inviteCode: `ABC123${i}`,
  imageUrl: "",
  creator: `user-0`,
  players: [
    { _id: `user-0`, username: "DungeonMaster", avatarUrl: "" },
    { _id: `user-1`, username: "RogueOne", avatarUrl: "" },
    { _id: `user-2`, username: "WizardGuy", avatarUrl: "" },
  ],
}));

const CampaignDashboard = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  return (
    <>
      <Navbar />
      <div className={styles.dashboard}>
        <h1 className={styles.title}>Your Campaigns</h1>
        <div className={styles.actions}>
          <button className={styles.createBtn}>Create New Campaign</button>
          <button className={styles.manageBtn}>
            Manage Your DM'd Campaigns
          </button>
          <button className={styles.joinBtn}>Join Campaign</button>
        </div>

        <ul className={styles.campaignList}>
          {MOCK_CAMPAIGNS.map((campaign) => (
            <li key={campaign._id} className={styles.card}>
              <img
                src={campaign.imageUrl || placeholderImg}
                alt={campaign.name}
                className={styles.image}
              />

              {selectedCampaign && (
                <div
                  className={styles.overlay}
                  onClick={() => setSelectedCampaign(null)}
                >
                  <div
                    className={styles.infoPanel}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2>{selectedCampaign.name}</h2>
                    <p>
                      <strong>System:</strong> {selectedCampaign.gameSystem}
                    </p>
                    <p>
                      <strong>Players:</strong>{" "}
                      {selectedCampaign.players.length}
                    </p>
                    <ul>
                      {selectedCampaign.players.map((p) => (
                        <li key={p._id}>{p.username}</li>
                      ))}
                    </ul>
                    <p>
                      <strong>House Rules:</strong> No metagaming. Respect
                      initiative order.
                    </p>
                    <p>
                      <strong>Next Session:</strong> July 15th, 7PM EST
                    </p>
                    <button
                      onClick={() => setSelectedCampaign(null)}
                      className={styles.closeBtn}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <div className={styles.info}>
                <strong>{campaign.name}</strong> – {campaign.gameSystem}
                <p className={styles.inviteCode}>
                  Invite Code: {campaign.inviteCode}
                </p>
              </div>

              <div className={styles.avatars}>
                {campaign.players.map((p) => (
                  <img
                    key={p._id}
                    src={p.avatarUrl || defaultAvatar}
                    alt={p.username}
                    className={styles.avatar}
                    title={p.username}
                  />
                ))}
              </div>

              <div className={styles.cardActions}>
                <button className={styles.launchBtn}>Launch</button>
                <button className={styles.deleteBtn}>Leave</button>
                <button
                  className={styles.infoBtn}
                  onClick={() => setSelectedCampaign(campaign)}
                >
                  Info
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CampaignDashboard;
