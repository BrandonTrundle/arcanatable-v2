import React from "react";
import styles from "../../styles/PlayerToolbar.module.css";

// Import icons
import d20Icon from "../../../assets/icons/d20Icon.png";
import pcIcon from "../../../assets/icons/pcIcon.png";
import settingsIcon from "../../../assets/icons/settingsIcon.png";
import selectorIcon from "../../../assets/icons/selectorIcon.png";

const PlayerToolbar = ({ onSelectCharacters }) => {
  const icons = [
    { src: selectorIcon, alt: "Selector", onClick: null },
    { src: d20Icon, alt: "Roll Dice", onClick: null },
    { src: pcIcon, alt: "Characters", onClick: onSelectCharacters },
    { src: settingsIcon, alt: "Settings", onClick: null },
  ];

  return (
    <div className={styles.toolbar}>
      {icons.map((icon, idx) => (
        <div key={idx} className={styles.iconWrapper} onClick={icon.onClick}>
          <img src={icon.src} alt={icon.alt} className={styles.icon} />
        </div>
      ))}
    </div>
  );
};

export default PlayerToolbar;
