import React from "react";
import styles from "../../styles/Campaign/ManageCampaigns.module.css";

export default function EditCampaignOverlay({
  formData,
  onChange,
  onClose,
  onRemovePlayer,
  isClosing,
  availableRules = [],
  onAddRule,
  onRemoveRule,
  onSave,
}) {
  if (!formData) return null;

  const assignedRules = availableRules.filter((rule) =>
    formData.rules?.includes(rule._id)
  );

  const unassignedRules = availableRules.filter(
    (rule) => !formData.rules?.includes(rule._id)
  );

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.fadeOut : ""}`}
      onClick={onClose}
    >
      <div className={styles.editPanel} onClick={(e) => e.stopPropagation()}>
        <h2>Edit Campaign</h2>

        <label>
          TTRPG System:
          <input
            type="text"
            name="gameSystem"
            value={formData.gameSystem ?? ""}
            onChange={onChange}
          />
        </label>

        <label>
          Next Session Date:
          <input
            type="date"
            name="nextSessionDate"
            value={formData.nextSessionDate ?? ""}
            onChange={(e) =>
              onChange({
                target: {
                  name: "nextSessionDate",
                  value: e.target.value,
                },
              })
            }
          />
        </label>

        <label>
          Time:
          <input
            type="time"
            name="nextSessionTime"
            value={formData.nextSessionTime ?? ""}
            onChange={(e) =>
              onChange({
                target: {
                  name: "nextSessionTime",
                  value: e.target.value,
                },
              })
            }
          />
        </label>

        <div className={styles.players}>
          <strong>Players:</strong>
          <ul>
            {formData.players
              .filter((p) => p._id !== formData.creatorId)
              .map((p) => (
                <li key={p._id}>
                  {p.username}
                  <button
                    className={styles.removeBtn}
                    onClick={() => onRemovePlayer(p._id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        </div>

        <div className={styles.rulesSection}>
          <strong>Assigned Rules:</strong>
          <ul>
            {assignedRules.length ? (
              assignedRules.map((rule) => (
                <li key={rule._id}>
                  {rule.title}
                  <button
                    className={styles.removeBtn}
                    onClick={() => onRemoveRule(rule._id)}
                  >
                    Remove
                  </button>
                </li>
              ))
            ) : (
              <li>No rules assigned yet.</li>
            )}
          </ul>

          {unassignedRules.length > 0 && (
            <>
              <label>Add a Rule:</label>
              <select
                onChange={(e) => {
                  const ruleId = e.target.value;
                  if (ruleId) onAddRule(ruleId);
                  e.target.value = ""; // reset dropdown
                }}
              >
                <option value="">Select a rule to add...</option>
                {unassignedRules.map((rule) => (
                  <option key={rule._id} value={rule._id}>
                    {rule.title}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        <button className={styles.inviteBtn}>Send Invite (Placeholder)</button>
        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
        <button
          className={styles.saveBtn}
          onClick={(e) => {
            e.stopPropagation();
            onSave?.();
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
