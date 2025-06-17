import React from "react";
import styles from "../../styles/DMToolbar.module.css";

// Import icons
import selectorIcon from "../../../assets/icons/selectorIcon.png";
import combatIcon from "../../../assets/icons/combatIcon.png";
import d20Icon from "../../../assets/icons/d20Icon.png";
import dmIcon from "../../../assets/icons/dmIcon.png";
import fogIcon from "../../../assets/icons/fogIcon.png";
import gIcon from "../../../assets/icons/gIcon.png";
import mapIcon from "../../../assets/icons/mapIcon.png";
import musicIcon from "../../../assets/icons/musicIcon.png";
import pcIcon from "../../../assets/icons/pcIcon.png";
import settingsIcon from "../../../assets/icons/settingsIcon.png";
import tokenIcon from "../../../assets/icons/tokenIcon.png";

const DMToolbar = ({
  onToggleMaps,
  isMapsPanelOpen,
  onSelectTool,
  currentTool,
}) => {
  const icons = [
    {
      src: selectorIcon,
      alt: "Selector",
      onClick: () => {
        //       console.log("Selector clicked");
        onSelectTool(currentTool === "select" ? null : "select");
      },
      key: "select",
    },
    { src: combatIcon, alt: "Combat", onClick: null },
    { src: d20Icon, alt: "Dice", onClick: null },
    { src: dmIcon, alt: "DM Tools", onClick: null },
    { src: fogIcon, alt: "Fog", onClick: null },
    { src: gIcon, alt: "Grid", onClick: null },
    {
      src: mapIcon,
      alt: "Map",
      onClick: onToggleMaps,
      active: isMapsPanelOpen,
    },
    { src: musicIcon, alt: "Music", onClick: null },
    { src: pcIcon, alt: "PC Tools", onClick: null },
    { src: tokenIcon, alt: "Tokens", onClick: null },
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
          <img
            src={icon.src}
            alt={icon.alt}
            title={icon.alt}
            className={styles.icon}
          />
        </div>
      ))}
    </div>
  );
};

export default DMToolbar;
