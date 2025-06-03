import React, { useState } from "react";
import styles from "../../styles/General/UserInfoPanel.module.css";
import UserInfoCard from "./UserInfoCard";

const UserInfoPanel = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      {/* Toggle Tab */}
      <div
        className={`${styles.toggleTab} ${open ? styles.open : ""}`}
        onClick={() => setOpen(!open)}
      >
        {window.innerWidth < 1900 ? (open ? "˄" : "˅") : open ? "×" : "<"}
      </div>

      {/* Floating Panel */}
      <div className={`${styles.panel} ${open ? styles.panelOpen : ""}`}>
        <UserInfoCard />
      </div>
    </div>
  );
};

export default UserInfoPanel;
