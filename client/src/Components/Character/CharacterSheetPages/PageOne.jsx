import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

// Component Imports
import CharacterHeader from "../PageOneComponents/CharacterHeader";
import AbilitiesBlock from "../PageOneComponents/AbilitiesBlock";
import ProficiencyBlock from "../PageOneComponents/ProficiencyBlock";
import SavingThrowsBlock from "../PageOneComponents/SavingThrowsBlock";
import SkillsBlock from "../PageOneComponents/SkillsBlock";
import CombatStatsBlock from "../PageOneComponents/CombatStatsBlock";
import EquipmentBlock from "../PageOneComponents/EquipmentBlock";
import TraitsBlock from "../PageOneComponents/TraitsBlock";
import WeaponsBlock from "../PageOneComponents/WeaponsBlock";

const PageOne = ({ characterData, setCharacterData }) => {
  // Helper functions to update nested fields
  const updateField = (field, value) => {
    setCharacterData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAbilities = (ability, value) => {
    setCharacterData((prev) => ({
      ...prev,
      abilities: {
        ...prev.abilities,
        [ability]: parseInt(value, 10) || 0,
      },
    }));
  };

  const updateSavingThrows = (updatedField) => {
    setCharacterData((prev) => ({
      ...prev,
      savingThrows: {
        ...prev.savingThrows,
        ...updatedField,
      },
    }));
  };

  const addSkill = () => {
    updateField("skills", [
      ...characterData.skills,
      { name: "", checked: false, bonus: "" },
    ]);
  };

  const updateAttack = (index, field, value) => {
    const updated = [...characterData.attacks];
    updated[index][field] = value;
    updateField("attacks", updated);
  };

  const addAttack = () => {
    updateField("attacks", [
      ...characterData.attacks,
      { name: "", bonus: "", damage: "" },
    ]);
  };

  const removeAttack = (index) => {
    const updated = [...characterData.attacks];
    updated.splice(index, 1);
    updateField("attacks", updated);
  };

  const updateEquipment = (index, value) => {
    const updated = [...characterData.equipment];
    updated[index] = value;
    updateField("equipment", updated);
  };

  const addEquipment = () => {
    updateField("equipment", [...characterData.equipment, ""]);
  };

  const removeEquipment = (index) => {
    const updated = [...characterData.equipment];
    updated.splice(index, 1);
    updateField("equipment", updated);
  };

  const updateHeaderField = (field, value) => {
    const map = {
      Class: "class",
      Level: "level",
      Background: "background",
      Race: "race",
      Alignment: "alignment",
      "Experience Points": "experiencepoints",
    };

    const key = map[field];
    if (key) {
      updateField(key, value);
    }
  };

  return (
    <div className={styles.main_container}>
      {/* Header */}
      <CharacterHeader
        characterName={characterData.name}
        setCharacterName={(val) => updateField("name", val)}
        headerFields={{
          Class: characterData.class,
          Level: characterData.level,
          Background: characterData.background,
          Race: characterData.race,
          Alignment: characterData.alignment,
          "Experience Points": characterData.experiencepoints,
        }}
        setHeaderFields={updateHeaderField}
      />

      {/* Main Body */}
      <div className={styles.second_container}>
        {/* Column 1 */}
        <div className={styles.column1_wrapper}>
          <div className={styles.column1}>
            <AbilitiesBlock
              abilities={characterData.abilities}
              onAbilityChange={updateAbilities}
            />
            <div className={styles.right_column}>
              <ProficiencyBlock
                inspirationBonus={characterData.inspiration}
                setInspirationBonus={(val) =>
                  updateField("inspiration", parseInt(val) || 0)
                }
                proficiencyBonus={characterData.proficiencyBonus}
                setProficiencyBonus={(val) =>
                  updateField("proficiencyBonus", parseInt(val) || 0)
                }
              />
              <SavingThrowsBlock
                savingThrows={characterData.savingThrows}
                setSavingThrows={updateSavingThrows}
              />
              <SkillsBlock
                skills={characterData.skills}
                setSkills={(val) => updateField("skills", val)}
                addSkill={addSkill}
              />
            </div>
          </div>

          <div className={styles.passive_section}>
            <div className={styles.prof_row}>
              <input
                type="number"
                className={styles.prof_value}
                value={characterData.passiveWisdom}
                onChange={(e) =>
                  updateField("passiveWisdom", parseInt(e.target.value) || 0)
                }
              />
              <div className={styles.prof_box}>Passive Wisdom (Perception)</div>
            </div>
          </div>
          <p className={styles.OPL}>Other Proficiencies and Languages</p>
          <div className={styles.languages_section}>
            <textarea
              className={styles.languages_textarea}
              placeholder="Enter other proficiencies and languages..."
              value={characterData.languages}
              onChange={(e) => updateField("languages", e.target.value)}
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className={styles.column2}>
          <CombatStatsBlock
            ac={characterData.ac}
            setAc={(val) => updateField("ac", val)}
            initiative={characterData.initiative}
            setInitiative={(val) => updateField("initiative", val)}
            speed={characterData.speed}
            setSpeed={(val) => updateField("speed", val)}
            maxHp={characterData.maxHp}
            setMaxHp={(val) => updateField("maxHp", val)} // <-- Add this line
            currentHp={characterData.currenthp}
            setCurrentHp={(val) => updateField("currenthp", val)}
            tempHp={characterData.temphp}
            setTempHp={(val) => updateField("temphp", val)}
            hitDice={characterData.hitdice}
            setHitDice={(val) => updateField("hitdice", val)}
            deathSaves={characterData.deathSaves}
            setDeathSaves={(val) => updateField("deathSaves", val)}
          />

          <WeaponsBlock
            attacks={characterData.attacks}
            handleChange={updateAttack}
            addAttack={addAttack}
            removeAttack={removeAttack}
            notes={characterData.attackNotes}
            setNotes={(val) => updateField("attackNotes", val)}
          />
          <EquipmentBlock
            equipment={characterData.equipment}
            handleEquipmentChange={updateEquipment}
            addEquipment={addEquipment}
            removeEquipment={removeEquipment}
            currency={characterData.currency}
            setCurrency={(val) => updateField("currency", val)}
          />
        </div>

        {/* Column 3 */}
        <TraitsBlock
          traits={{
            personalityTraits: characterData.personalityTraits,
            ideals: characterData.ideals,
            bonds: characterData.bonds,
            flaws: characterData.flaws,
            features: characterData.features,
          }}
          setTraits={(newTraits) =>
            setCharacterData((prev) => ({
              ...prev,
              ...newTraits,
            }))
          }
        />
      </div>
    </div>
  );
};

export default PageOne;
