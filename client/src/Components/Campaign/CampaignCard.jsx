import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/Campaign/CampaignDashboard.module.css";
import defaultAvatar from "../../assets/defaultav.png";
import placeholderImg from "../../assets/FantasyMapBackground.png";
import { useNavigate } from "react-router-dom";

export default function CampaignCard({ campaign, onInfoClick, onDelete }) {
  const { user } = useContext(AuthContext);
  const isCreator = campaign.creatorId === user?.id;
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/campaigns/${campaign._id}`,
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

  const handleLaunch = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ campaignId: campaign._id }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create session");

      const sessionCode = data.session.sessionCode;
      navigate(`/session/${sessionCode}/dm`); // ← Redirect to session room
    } catch (err) {
      console.error("Launch failed:", err);
      alert("Failed to launch session.");
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
        {isCreator ? (
          <button className={styles.launchBtn} onClick={handleLaunch}>
            Launch
          </button>
        ) : (
          <button
            className={styles.launchBtn}
            onClick={() => navigate(`/session/${campaign.inviteCode}/player`)}
          >
            Join
          </button>
        )}

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
