import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";
const SkillsBlock = ({ skills, setSkills, addSkill }) => {
  const handleChange = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  return (
    <div className={styles.skills_section}>
      <label className={styles.section_label}>Skills</label>
      {skills.map((skill, index) => (
        <div key={index} className={styles.st_row}>
          <input
            type="checkbox"
            checked={skill.checked}
            onChange={(e) => handleChange(index, "checked", e.target.checked)}
          />
          <input
            type="text"
            className={styles.st_bonus_input}
            placeholder="+0"
            value={skill.bonus}
            onChange={(e) => handleChange(index, "bonus", e.target.value)}
          />
          <input
            type="text"
            className={styles.st_label_input}
            placeholder="Skill Name"
            value={skill.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
          />
        </div>
      ))}

      <button
        type="button"
        className={styles.add_skill_button}
        onClick={addSkill}
      >
        + Add Skill
      </button>
    </div>
  );
};

export default SkillsBlock;
