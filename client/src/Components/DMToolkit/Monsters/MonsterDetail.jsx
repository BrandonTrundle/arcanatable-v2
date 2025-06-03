import React from "react";
import styles from "../../../styles/DMToolkit/MonsterDetail.module.css";
import parchment from "../../../assets/ParchmentPaper.png";

export default function MonsterDetail({ monster, onClose }) {
  if (!monster) return null;

  const renderEntry = (entry, i) => (
    <div key={i} className={styles.entryBlock}>
      <h3>{entry.name}</h3>
      <p>{entry.desc}</p>
    </div>
  );

  const formatSpeed = (speed) =>
    Object.entries(speed)
      .filter(([_, val]) => val && val !== "0")
      .map(([type, val]) => `${type} ${val} ft.`)
      .join(", ");

  const renderAbilityScores = (scores) =>
    Object.entries(scores).map(([stat, val]) => (
      <div key={stat} className={styles.abilityScore}>
        <strong>{stat.toUpperCase()}</strong>
        <div>{val}</div>
      </div>
    ));

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
            <h1>{monster.name}</h1>
            <p>
              <em>
                {monster.size} {monster.type}, {monster.alignment}
              </em>
            </p>
          </div>

          <div className={styles.statBlock}>
            <p>
              <strong>Armor Class:</strong> {monster.armorClass}
            </p>
            <p>
              <strong>Hit Points:</strong> {monster.hitPoints} (
              {monster.hitDice})
            </p>
            <p>
              <strong>Initiative:</strong> {monster.initiative}
            </p>
            <p>
              <strong>Proficiency Bonus:</strong> {monster.proficiencyBonus}
            </p>
            <p>
              <strong>Challenge Rating:</strong> {monster.challengeRating}
            </p>
            <p>
              <strong>Speed:</strong> {formatSpeed(monster.speed)}
            </p>
          </div>

          <div className={styles.abilityScores}>
            {renderAbilityScores(monster.abilityScores)}
          </div>

          <div className={styles.section}>
            <h2>Saves & Skills</h2>
            <p>
              <strong>Saving Throws:</strong> {monster.savingThrows.CON}
            </p>
            <p>
              <strong>Skills:</strong> Stealth {monster.skills.Stealth}
            </p>
          </div>

          <div className={styles.section}>
            <h2>Senses</h2>
            <ul>
              {Object.entries(monster.senses).map(
                ([sense, val]) =>
                  val && (
                    <li key={sense}>
                      <strong>{sense}:</strong> {val}
                    </li>
                  )
              )}
            </ul>
          </div>

          <div className={styles.section}>
            <h2>Languages</h2>
            <p>{monster.languages || "—"}</p>
          </div>

          <div className={styles.section}>
            <h2>Description</h2>
            <p className={styles.description}>{monster.description}</p>
          </div>

          {monster.traits.length > 0 && (
            <div className={styles.section}>
              <h2>Traits</h2>
              {monster.traits.map(renderEntry)}
            </div>
          )}

          {monster.actions.length > 0 && (
            <div className={styles.section}>
              <h2>Actions</h2>
              {monster.actions.map(renderEntry)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
