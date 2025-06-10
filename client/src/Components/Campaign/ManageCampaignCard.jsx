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
          <strong>Next Session:</strong>{" "}
          {campaign.nextSession
            ? new Date(campaign.nextSession).toLocaleString(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })
            : "Not scheduled"}
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
      </div>
    </li>
  );
}
