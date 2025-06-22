import { useEffect, useState } from "react";
import styles from "../../../styles/DiceRollerPanel.module.css";

const diceTypes = ["d4", "d6", "d8", "d10", "d12", "d20", "d100"];

export default function SavedRollsPanel({
  isDM,
  savedRolls,
  newRoll,
  setNewRoll,
  handleRoll,
  createRoll,
  deleteRoll,
}) {
  const [selectedRollId, setSelectedRollId] = useState("");
  const selectedRoll = savedRolls.find((r) => r._id === selectedRollId);

  return (
    <div className={styles.savedRolls}>
      <div className={styles.savedRollDropdown}>
        <select
          value={selectedRollId}
          onChange={(e) => setSelectedRollId(e.target.value)}
        >
          <option value="">Select Saved Roll</option>
          {savedRolls.map((roll) => (
            <option key={roll._id} value={roll._id}>
              {roll.name} ({roll.formula})
            </option>
          ))}
        </select>

        {selectedRoll && (
          <div className={styles.rollOptions}>
            <button
              onClick={() =>
                handleRoll(selectedRoll.formula, "normal", selectedRoll.name)
              }
            >
              Roll
            </button>
            <button
              onClick={() =>
                handleRoll(selectedRoll.formula, "advantage", selectedRoll.name)
              }
            >
              Adv
            </button>
            <button
              onClick={() =>
                handleRoll(
                  selectedRoll.formula,
                  "disadvantage",
                  selectedRoll.name
                )
              }
            >
              Dis
            </button>
            {isDM && (
              <button
                onClick={() =>
                  handleRoll(selectedRoll.formula, "secret", selectedRoll.name)
                }
              >
                Secret
              </button>
            )}
            <button onClick={() => deleteRoll(selectedRoll._id)}>✖</button>
          </div>
        )}
      </div>

      <div className={styles.newRollForm}>
        <label className={styles.SRPLabel}>Name the Dice Roll</label>
        <input
          placeholder="Name"
          value={newRoll.name}
          onChange={(e) => setNewRoll({ ...newRoll, name: e.target.value })}
        />
        <label className={styles.SRPLabel}>Dice Type</label>
        <select
          className={styles.diceType}
          value={newRoll.diceType}
          onChange={(e) => setNewRoll({ ...newRoll, diceType: e.target.value })}
        >
          {diceTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <label className={styles.SRPLabel}>Number of Dice</label>
        <input
          type="number"
          min="1"
          value={newRoll.diceCount}
          onChange={(e) =>
            setNewRoll({
              ...newRoll,
              diceCount: parseInt(e.target.value, 10) || 1,
            })
          }
        />
        <label className={styles.SRPLabel}>Dice Modifier</label>
        <input
          type="number"
          value={newRoll.modifier}
          onChange={(e) =>
            setNewRoll({
              ...newRoll,
              modifier: parseInt(e.target.value, 10) || 0,
            })
          }
        />
        <button onClick={createRoll}>Add Roll</button>
      </div>
    </div>
  );
}
