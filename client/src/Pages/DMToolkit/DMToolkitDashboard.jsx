import React from "react";
import styles from "../../styles/DMToolkit/DMToolkitDashboard.module.css";

export default function DMToolkitDashboard() {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dungeon Master's Toolkit</h1>

      <div className={styles.section}>
        <h2>What is the DMToolkit?</h2>
        <p>
          This is your personalized space to create and manage homebrew content
          like monsters, items, and maps, tied directly to your campaigns. You
          can also bypass creation, and just upload images of creatures and NPCs
          you want to add to a session. ArcanaTable recommends that you at least
          update the image, and hp of the creatures and NPCs that you want to
          use.
        </p>
      </div>

      <div className={styles.section}>
        <h2>How to Use It</h2>
        <p>
          Navigate to one of the Toolkit options from the left, select a
          campaign that you have created and then have fun creating!
        </p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h1>Monsters</h1> Create stat blocks and assign them to campaigns.
        </div>
        <div className={styles.card}>
          <h1>NPCs</h1> Save unique characters and lore.
        </div>
        <div className={styles.card}>
          <h1>Potions</h1> Create Potions for your campaign.
        </div>
        <div className={styles.card}>
          <h1>Items</h1> Create items and artifacts.
        </div>
        <div className={styles.card}>
          <h1>Maps</h1> Upload your maps.
        </div>
        <div className={styles.card}>
          <h1>Rules</h1> Create custom rules and quick references.
        </div>
        <div className={styles.card}>
          <h1>Cheat Sheet</h1> Create a custom cheet sheet to use during
          sessions.
        </div>
      </div>
    </div>
  );
}
