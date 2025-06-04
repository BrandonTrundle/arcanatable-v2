import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/General/Navbar";
import styles from "../styles/Pages/Dashboard.module.css";
import UserInfoPanel from "../Components/General/UserInfoPanel";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <UserInfoPanel />
      <div className={styles.dashboard}>
        <div className={styles.welcomeCard}>
          <h1 className={styles.title}>Welcome back, Adventurer!</h1>
          <p className={styles.subtitle}>
            Your journey continues — choose your next destination.
          </p>
        </div>

        <div className={styles.tiles}>
          <div
            className={styles.tile}
            onClick={() => navigate("/campaign-dashboard")}
            style={{ cursor: "pointer" }}
          >
            <h2>Campaigns</h2>
            <p>Manage your adventures.</p>
          </div>
          <div className={styles.tile}>
            <h2>Characters</h2>
            <p>Customize your heroes.</p>
          </div>
          <div
            className={styles.tile}
            onClick={() => navigate("/dmtoolkit")}
            style={{ cursor: "pointer" }}
          >
            <h2>DM Toolkit</h2>
            <p>Your source for all of your adventure needs.</p>
          </div>
          <div className={styles.tile}>
            <h2>Messages</h2>
            <p>View your inbox.</p>
          </div>
          <div className={styles.tile}>
            <h2>News</h2>
            <p>ArcanaTable news!</p>
          </div>
          <div className={styles.tile}>
            <h2>Learn</h2>
            <p>Explore ArcanaTable features.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
