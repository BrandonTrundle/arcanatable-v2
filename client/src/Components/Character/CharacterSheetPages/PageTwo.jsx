import React, { useState } from "react";
import styles from "../../../styles/Characters/PageTwo.module.css";

// Component Imports
import CharacterDetailsBlock from "../../../Components/Character/PageTwoComponents/CharacterDetailsBlock";
import CharacterAppearanceBlock from "../../../Components/Character/PageTwoComponents/CharacterAppearanceBlock";
import CharacterBackstoryBlock from "../../../Components/Character/PageTwoComponents/CharacterBackstoryBlock";
import AlliesOrganizationsBlock from "../../../Components/Character/PageTwoComponents/AlliesOrganizationsBlock";
import AdditionalFeaturesBlock from "../../../Components/Character/PageTwoComponents/AdditionalFeaturesBlock";
import TreasureBlock from "../../../Components/Character/PageTwoComponents/TreasureBlock";

const PageTwo = ({ characterData, setCharacterData }) => {
  const updateDetails = (key, value) => {
    setCharacterData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: value,
      },
    }));
  };

  const updateField = (field, value) => {
    setCharacterData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateOrganization = (value, image) => {
    setCharacterData((prev) => ({
      ...prev,
      organization: {
        ...prev.organization,
        name: value,
        symbolImage: image,
      },
    }));
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.columns}>
        <div className={styles.leftColumn}>
          <CharacterAppearanceBlock
            value={characterData.appearance}
            onChange={(val) => updateField("appearance", val)}
            image={characterData.portraitImage}
            onImageChange={(val) => updateField("portraitImage", val)}
          />
          <CharacterBackstoryBlock
            value={characterData.backstory}
            onChange={(val) => updateField("backstory", val)}
          />
        </div>

        <div className={styles.rightColumn}>
          <CharacterDetailsBlock
            details={characterData.details}
            onChange={updateDetails}
          />
          <AlliesOrganizationsBlock
            value={characterData.organization.name}
            onChange={(val) =>
              updateOrganization(val, characterData.organization.symbolImage)
            }
            image={characterData.organization.symbolImage}
            onImageChange={(val) =>
              updateOrganization(characterData.organization.name, val)
            }
          />
          <AdditionalFeaturesBlock
            value={characterData.additionalFeatures}
            onChange={(val) => updateField("additionalFeatures", val)}
          />
          <TreasureBlock
            value={characterData.treasure}
            onChange={(val) => updateField("treasure", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default PageTwo;
