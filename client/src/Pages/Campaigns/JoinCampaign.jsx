// JoinCampaign.jsx
import React, { useState, useContext } from "react";
import styles from "../../styles/Campaign/JoinCampaign.module.css";
import Navbar from "../../Components/General/Navbar";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const JoinCampaign = () => {
  const [code, setCode] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/campaigns/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // 👈 Ensure AuthContext is available
        },
        body: JSON.stringify({ inviteCode: code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to join campaign");

      alert("Successfully joined campaign!");
      navigate("/campaign-dashboard");
    } catch (err) {
      console.error("Join failed:", err);
      alert(`Join failed: ${err.message}`);
    }
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
