import React from "react";
import styles from "../../styles/PlayerToolbar.module.css";

// Import icons
import d20Icon from "../../../assets/icons/d20Icon.png";
import pcIcon from "../../../assets/icons/pcIcon.png";
import settingsIcon from "../../../assets/icons/settingsIcon.png";
import selectorIcon from "../../../assets/icons/selectorIcon.png";
import aoeIcon from "../../../assets/icons/AoEIcon.png";
import rulerIcon from "../../../assets/icons/rulerIcon.png";

const PlayerToolbar = ({
  onSelectCharacters,
  onSelectTool,
  currentTool,
  onToggleDice,
}) => {
  const icons = [
    {
      src: selectorIcon,
      alt: "Selector",
      key: "select",
      onClick: () => onSelectTool(currentTool === "select" ? null : "select"),
    },
    {
      src: d20Icon,
      alt: "Roll Dice",
      onClick: onToggleDice,
      key: "dice",
    },
    {
      src: aoeIcon,
      alt: "AoE Tool",
      onClick: () => onSelectTool(currentTool === "aoe" ? null : "aoe"),
      key: "aoe",
    },
    {
      src: rulerIcon,
      alt: "Ruler Tool",
      onClick: () => onSelectTool(currentTool === "ruler" ? null : "ruler"),
      key: "ruler",
    },
    { src: pcIcon, alt: "Characters", onClick: onSelectCharacters },
    { src: settingsIcon, alt: "Settings", onClick: null },
  ];

  return (
    <div className={styles.toolbar}>
      {icons.map((icon, idx) => (
        <div
          key={idx}
          className={`${styles.iconWrapper} ${
            icon.key === currentTool ? styles.active : ""
          }`}
          onClick={icon.onClick}
        >
          <img src={icon.src} alt={icon.alt} className={styles.icon} />
        </div>
      ))}
    </div>
  );
};

export default PlayerToolbar;
