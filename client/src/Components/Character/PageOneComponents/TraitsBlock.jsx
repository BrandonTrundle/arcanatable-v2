import React from "react";
import styles from "../../../styles/Characters/PageOne.module.css";

const TraitsBlock = ({ traits, setTraits }) => {
  return (
    <div className={styles.column3}>
      <p>Personality Traits</p>
      <textarea
        className={styles.personality_section}
        placeholder="Enter personality traits..."
        value={traits.personalityTraits}
        onChange={(e) => setTraits({ personalityTraits: e.target.value })}
      />

      <p>Ideals</p>
      <textarea
        className={styles.personality_section}
        placeholder="Enter ideals..."
        value={traits.ideals}
        onChange={(e) => setTraits({ ideals: e.target.value })}
      />

      <p>Bonds</p>
      <textarea
        className={styles.personality_section}
        placeholder="Enter bonds..."
        value={traits.bonds}
        onChange={(e) => setTraits({ bonds: e.target.value })}
      />

      <p>Flaws</p>
      <textarea
        className={styles.personality_section}
        placeholder="Enter flaws..."
        value={traits.flaws}
        onChange={(e) => setTraits({ flaws: e.target.value })}
      />

      <p>Features & Traits</p>
      <textarea
        className={styles.features_section}
        placeholder="Enter features and traits..."
        value={traits.features}
        onChange={(e) => setTraits({ features: e.target.value })}
      />
    </div>
  );
};

export default TraitsBlock;
