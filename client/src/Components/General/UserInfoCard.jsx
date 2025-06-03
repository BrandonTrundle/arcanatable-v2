import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/General/UserInfoCard.module.css";
import defaultAvatar from "../../assets/defaultav.png";

const UserInfoCard = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.card}>
      <img src={defaultAvatar} alt="User Avatar" className={styles.avatar} />

      <div className={styles.details}>
        <h3 className={styles.name}>Adventurer</h3>
        <p className={styles.subscription}>Tier: Free</p>
        <p className={styles.date}>Member since: 01/01/2024</p>
        <p className={styles.hours}>Hours Played: 12 hrs 30 mins</p>

        <button className={styles.button} onClick={() => navigate("/account")}>
          Manage Account
        </button>

        <div className={styles.actions}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>📬 Messages:</span>
            <span className={styles.statValue}>3</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>🔔 Notifications:</span>
            <span className={styles.statValue}>5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
