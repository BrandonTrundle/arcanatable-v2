import React from "react";
import styles from "../../../styles/DMToolkit/NPCDetail.module.css";
import parchment from "../../../assets/ParchmentPaper.png";

export default function NPCDetail({ npc, onClose }) {
  if (!npc) return null;

  const renderEntry = (entry, i) => (
    <div key={i} className={styles.entryBlock}>
      <h3>{entry.name}</h3>
      <p>{entry.desc}</p>
    </div>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.container}
        style={{ backgroundImage: `url(${parchment})` }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.header}>
            <h1>{npc.name}</h1>
            <p>
              <em>
                {npc.race} {npc.class}, {npc.alignment}
              </em>
            </p>
            <p className={styles.subtitle}>{npc.occupation}</p>
          </div>

          <div className={styles.statBlock}>
            <p>
              <strong>Armor Class:</strong> {npc.armorClass}
            </p>
            <p>
              <strong>Hit Points:</strong> {npc.hitPoints} ({npc.hitDice})
            </p>
            <p>
              <strong>Proficiency Bonus:</strong> {npc.proficiencyBonus}
            </p>
            <p>
              <strong>Challenge Rating:</strong> {npc.challengeRating}
            </p>
            <p>
              <strong>Speed:</strong> {npc.speed.walk} ft.
            </p>
          </div>

          <div className={styles.abilityScores}>
            {Object.entries(npc.abilityScores).map(([stat, val]) => (
              <div key={stat} className={styles.abilityScore}>
                <strong>{stat.toUpperCase()}</strong>
                <div>{val}</div>
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <h2>Saves & Skills</h2>
            <p>
              <strong>Saving Throws:</strong>{" "}
              {Object.entries(npc.savingThrows)
                .map(([k, v]) => `${k} ${v}`)
                .join(", ")}
            </p>
            <p>
              <strong>Skills:</strong>{" "}
              {Object.entries(npc.skills)
                .map(([k, v]) => `${k} ${v}`)
                .join(", ")}
            </p>
          </div>

          <div className={styles.section}>
            <h2>Languages</h2>
            <p>{npc.languages || "—"}</p>
          </div>

          <div className={styles.section}>
            <h2>Description</h2>
            <p className={styles.description}>{npc.description}</p>
          </div>

          {npc.traits?.length > 0 && (
            <div className={styles.section}>
              <h2>Traits</h2>
              {npc.traits.map(renderEntry)}
            </div>
          )}

          {npc.actions?.length > 0 && (
            <div className={styles.section}>
              <h2>Actions</h2>
              {npc.actions.map(renderEntry)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
