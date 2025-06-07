import React from "react";
import styles from "../../styles/Campaign/ManageCampaigns.module.css";

export default function ManageCampaignCard({ campaign, onEdit }) {
  return (
    <li className={styles.card}>
      <div>
        <h2>{campaign.name}</h2>
        <p>{campaign.gameSystem}</p>
      </div>

      <div>
        <p>
          <strong>Invite Code:</strong> {campaign.inviteCode}
        </p>
        <p>
          <strong>Next Session:</strong> {campaign.nextSession}
        </p>
      </div>

      <div className={styles.players}>
        <strong>Players:</strong>
        <ul>
          {campaign.players.map((p) => (
            <li key={p._id}>{p.username}</li>
          ))}
        </ul>
      </div>

      <div className={styles.actions}>
        <button className={styles.editButton} onClick={() => onEdit(campaign)}>
          Edit
        </button>
        <button className={styles.editButton}>Leave</button>
      </div>
    </li>
  );
}
