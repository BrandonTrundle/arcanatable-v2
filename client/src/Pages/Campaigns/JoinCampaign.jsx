// JoinCampaign.jsx
import React, { useState } from "react";
import styles from "../../styles/Campaign/JoinCampaign.module.css";
import Navbar from "../../Components/General/Navbar";

const JoinCampaign = () => {
  const [code, setCode] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();
    console.log("Joining campaign with code:", code);
    // Placeholder for API integration
  };

  return (
    <>
      <Navbar />
      <div className={styles.joinPage}>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Join a Campaign</h1>
          <form className={styles.form} onSubmit={handleJoin}>
            <label htmlFor="inviteCode">Invite Code</label>
            <input
              type="text"
              id="inviteCode"
              name="inviteCode"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter invite code..."
              required
            />
            <button type="submit" className={styles.joinBtn}>
              Join
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default JoinCampaign;
