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
import aoeIcon from "../../../assets/icons/AoEIcon.png";
import rulerIcon from "../../../assets/icons/rulerIcon.png";
import mapAssetIcon from "../../../assets/icons/mapAssetIcon.png";

const DMToolbar = ({
  onToggleMaps,
  isMapsPanelOpen,
  onToggleTokens,
  isTokenPanelOpen,
  onSelectTool,
  currentTool,
  onToggleDice,
  onToggleCombat,
  isMapAssetsPanelOpen,
  onToggleMapAssets,
  onToggleCharacters,
  onToggleSettings,
  onToggleMusicPanel,
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
    { src: combatIcon, alt: "Combat", onClick: onToggleCombat, key: "combat" },
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
    {
      src: d20Icon,
      alt: "Dice",
      onClick: onToggleDice,
      key: "dice",
    },
    { src: dmIcon, alt: "DM Tools", onClick: null },
    { src: fogIcon, alt: "Fog", onClick: null },
    { src: gIcon, alt: "Grid", onClick: null },
    {
      src: mapIcon,
      alt: "Map",
      onClick: onToggleMaps,
      active: isMapsPanelOpen,
    },
    { src: musicIcon, alt: "Music", onClick: onToggleMusicPanel, key: "music" },
    {
      src: pcIcon,
      alt: "Characters",
      onClick: onToggleCharacters, // 👈 Use the new handler
      key: "characters", // 👈 Add a unique key
    },
    {
      src: tokenIcon,
      alt: "Tokens",
      onClick: () => onToggleTokens(),
      active: isTokenPanelOpen,
      key: "tokens",
    },
    {
      src: mapAssetIcon,
      alt: "Map Assets",
      onClick: onToggleMapAssets,
      active: isMapAssetsPanelOpen,
      key: "mapAsset",
    },
    {
      src: settingsIcon,
      alt: "Settings",
      onClick: onToggleSettings, // ✅ wire it up
      key: "settings",
    },
  ];

  return (
    <div className={styles.toolbar}>
      {icons.map((icon, idx) => (
        <div
          key={idx}
          className={`${styles.iconWrapper} ${
            icon.key === currentTool || icon.active ? styles.active : ""
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
