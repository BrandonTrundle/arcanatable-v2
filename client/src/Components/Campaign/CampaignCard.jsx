import React from "react";
import styles from "../../styles/Campaign/CampaignDashboard.module.css";
import defaultAvatar from "../../assets/defaultav.png";
import placeholderImg from "../../assets/FantasyMapBackground.png";

export default function CampaignCard({ campaign, onInfoClick }) {
  return (
    <li className={styles.card}>
      <img
        src={campaign.imageUrl || placeholderImg}
        alt={campaign.name}
        className={styles.image}
      />

      <div className={styles.info}>
        <strong>{campaign.name}</strong> – {campaign.gameSystem}
        <p className={styles.inviteCode}>Invite Code: {campaign.inviteCode}</p>
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
          onClick={() => onInfoClick(campaign)}
        >
          Info
        </button>
      </div>
    </li>
  );
}
