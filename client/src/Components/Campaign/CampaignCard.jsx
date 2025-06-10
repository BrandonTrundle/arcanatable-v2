import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/Campaign/CampaignDashboard.module.css";
import defaultAvatar from "../../assets/defaultav.png";
import placeholderImg from "../../assets/FantasyMapBackground.png";

export default function CampaignCard({ campaign, onInfoClick, onDelete }) {
  const { user } = useContext(AuthContext);
  const isCreator = campaign.creatorId === user?.id;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/campaigns/${campaign._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete campaign");

      onDelete(campaign._id); // 👈 Notify parent to update state
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete campaign.");
    }
  };

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
        {isCreator ? (
          <button className={styles.deleteBtn} onClick={handleDelete}>
            Delete
          </button>
        ) : (
          <button className={styles.deleteBtn}>Leave</button>
        )}
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
