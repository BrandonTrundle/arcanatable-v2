import React from "react";
import styles from "../../styles/SelectorBar.module.css";
import selectorIcon from "../../../assets/icons/selectorIcon.png";
import pointDownIcon from "../../../assets/icons/pointDownIcon.png";
import ringIcon from "../../../assets/icons/ringIcon.png";
import { motion, AnimatePresence } from "framer-motion";

const SelectorBar = ({ selectorMode, setSelectorMode, isDM = false }) => {
  const icons = [
    { key: "selector", src: selectorIcon, alt: "Selector" },
    ...(isDM ? [{ key: "point", src: pointDownIcon, alt: "Point Down" }] : []),
    { key: "ring", src: ringIcon, alt: "Ring" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className={styles.selectorBar}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {icons.map((icon) => (
          <img
            key={icon.key}
            src={icon.src}
            alt={icon.alt}
            title={icon.alt}
            className={`${styles.selectorIcon} ${
              selectorMode === icon.key ? styles.active : ""
            }`}
            onClick={() => setSelectorMode(icon.key)}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectorBar;
