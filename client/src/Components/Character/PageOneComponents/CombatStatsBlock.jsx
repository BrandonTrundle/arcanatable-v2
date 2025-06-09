import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

const CombatStatsBlock = ({
  ac,
  setAc,
  initiative,
  setInitiative,
  speed,
  setSpeed,
  maxHp,
  setMaxHp,
  currentHp,
  setCurrentHp,
  tempHp,
  setTempHp,
  hitDice,
  setHitDice,
  deathSaves,
  setDeathSaves,
}) => {
  return (
    <>
      <div className={styles.defense_section}>
        <div className={styles.defense_box}>
          <div className={styles.defense_label}>AC</div>
          <input
            type="number"
            className={styles.defense_value}
            value={ac}
            onChange={(e) => setAc(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className={styles.defense_box}>
          <div className={styles.defense_label}>Initiative</div>
          <input
            type="number"
            className={styles.defense_value}
            value={initiative}
            onChange={(e) => setInitiative(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className={styles.defense_box}>
          <div className={styles.defense_label}>Speed</div>
          <input
            type="text"
            className={styles.defense_value}
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.hp_section}>
        <label>Maximum Hit Points</label>
        <input
          type="number"
          className={styles.hp_value}
          value={maxHp}
          onChange={(e) => setMaxHp(parseInt(e.target.value) || 0)}
        />
      </div>

      <div className={styles.hp_section}>
        <label>Current Hit Points</label>
        <input
          type="number"
          className={styles.hp_value}
          value={currentHp}
          onChange={(e) => setCurrentHp(parseInt(e.target.value) || 0)}
        />
      </div>

      <div className={styles.temp_hp_section}>
        <label>Temporary Hit Points</label>
        <input
          type="number"
          className={styles.hp_value}
          value={tempHp}
          onChange={(e) => setTempHp(parseInt(e.target.value) || 0)}
        />
      </div>

      <div className={styles.hitdice_section}>
        <div className={styles.hitdice_box}>
          <div className={styles.hitdice_label}>Hit Dice</div>
          <input
            type="text"
            className={styles.hitdice_value}
            value={hitDice ?? ""}
            onChange={(e) => setHitDice(e.target.value)}
          />
        </div>

        <div className={styles.deathsaves_box}>
          <div className={styles.deathsaves_label}>Death Saves</div>

          <div className={styles.deathsaves_row}>
            <span className={styles.deathsaves_subtitle}>Successes:</span>
            {deathSaves.successes.map((checked, i) => (
              <input
                key={`success-${i}`}
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const updated = [...deathSaves.successes];
                  updated[i] = !updated[i];
                  setDeathSaves({ ...deathSaves, successes: updated });
                }}
              />
            ))}
          </div>

          <div className={styles.deathsaves_row}>
            <span className={styles.deathsaves_subtitle}>Failures:</span>
            {deathSaves.failures.map((checked, i) => (
              <input
                key={`failure-${i}`}
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const updated = [...deathSaves.failures];
                  updated[i] = !updated[i];
                  setDeathSaves({ ...deathSaves, failures: updated });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CombatStatsBlock;
