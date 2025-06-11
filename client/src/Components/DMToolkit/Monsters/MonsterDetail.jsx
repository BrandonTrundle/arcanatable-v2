import React from "react";
import styles from "../../../styles/DMToolkit/MonsterDetail.module.css";
import parchment from "../../../assets/ParchmentPaper.png";

export default function MonsterDetail({ monster, onClose }) {
  if (!monster) return null;

  const data = monster.content || {};

  const renderEntry = (entry, i) => (
    <div key={i} className={styles.entryBlock}>
      <h3>{entry.name}</h3>
      <p>{entry.desc}</p>
    </div>
  );

  const formatSpeed = (speed) =>
    Object.entries(speed || {})
      .filter(([_, val]) => val && val !== "0")
      .map(([type, val]) => `${type} ${val} ft.`)
      .join(", ");

  const renderAbilityScores = (scores) =>
    Object.entries(scores || {}).map(([stat, val]) => (
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
            <h1>{data.name}</h1>
            <p>
              <em>
                {data.size} {data.type}, {data.alignment}
              </em>
            </p>
          </div>

          <div className={styles.statBlock}>
            <p>
              <strong>Armor Class:</strong> {data.armorClass}
            </p>
            <p>
              <strong>Hit Points:</strong> {data.hitPoints} ({data.hitDice})
            </p>
            <p>
              <strong>Initiative:</strong> {data.initiative}
            </p>
            <p>
              <strong>Proficiency Bonus:</strong> {data.proficiencyBonus}
            </p>
            <p>
              <strong>Challenge Rating:</strong> {data.challengeRating}
            </p>
            <p>
              <strong>Speed:</strong> {formatSpeed(data.speed)}
            </p>
          </div>

          <div className={styles.abilityScores}>
            {renderAbilityScores(data.abilityScores)}
          </div>

          <div className={styles.section}>
            <h2>Saves & Skills</h2>
            {Array.isArray(data.savingThrows) &&
              data.savingThrows.length > 0 && (
                <p>
                  <strong>Saving Throws:</strong>{" "}
                  {data.savingThrows
                    .map((entry) => `${entry.stat} ${entry.value}`)
                    .join(", ")}
                </p>
              )}
            {Array.isArray(data.skills) && data.skills.length > 0 && (
              <p>
                <strong>Skills:</strong>{" "}
                {data.skills
                  .map((entry) => `${entry.skill} ${entry.value}`)
                  .join(", ")}
              </p>
            )}
          </div>

          <div className={styles.section}>
            <h2>Senses</h2>
            <ul>
              {Object.entries(data.senses || {}).map(
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
            <p>{data.languages || "—"}</p>
          </div>

          <div className={styles.section}>
            <h2>Description</h2>
            <p className={styles.description}>{data.description}</p>
          </div>

          {data.traits?.length > 0 && (
            <div className={styles.section}>
              <h2>Traits</h2>
              {data.traits.map(renderEntry)}
            </div>
          )}

          {data.actions?.length > 0 && (
            <div className={styles.section}>
              <h2>Actions</h2>
              {data.actions.map(renderEntry)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
