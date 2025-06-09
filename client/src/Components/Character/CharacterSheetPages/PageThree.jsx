import React, { useState } from "react";
import styles from "../../../styles/Characters/PageThree.module.css";

import SpellcastingHeaderBlock from "../../../Components/Character/PageThreeComponents/SpellcastingHeaderBlock";
import SpellLevelBlock from "../../../Components/Character/PageThreeComponents/SpellLevelBlock";

const PageThree = ({ characterData, setCharacterData }) => {
  const updateSpellcasting = (key, value) => {
    setCharacterData((prev) => ({
      ...prev,
      spellcasting: {
        ...prev.spellcasting,
        [key]: value,
      },
    }));
  };

  const updateSpellLevel = (levelIndex, updatedData) => {
    setCharacterData((prev) => ({
      ...prev,
      spellLevels: prev.spellLevels.map((entry, idx) =>
        idx === levelIndex ? { ...entry, ...updatedData } : entry
      ),
    }));
  };

  return (
    <div className={styles.pageContainer}>
      <SpellcastingHeaderBlock
        data={characterData.spellcasting}
        onChange={updateSpellcasting}
      />

      <div className={styles.spellLevels}>
        {characterData.spellLevels.map((levelData, index) => (
          <SpellLevelBlock
            key={index}
            data={levelData}
            onChange={(updated) => updateSpellLevel(index, updated)}
          />
        ))}
      </div>
    </div>
  );
};

export default PageThree;
