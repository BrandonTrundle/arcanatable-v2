import React, { useState, useRef } from "react";
import styles from "../../styles/DiceRollerPanel.module.css";
import d4Icon from "../../../assets/icons/d4Icon.png";
import d6Icon from "../../../assets/icons/d6Icon.png";
import d8Icon from "../../../assets/icons/d8Icon.png";
import d10Icon from "../../../assets/icons/d10Icon.png";
import d12Icon from "../../../assets/icons/d12Icon.png";
import d20Icon from "../../../assets/icons/d20Icon.png";
import d100Icon from "../../../assets/icons/d100Icon.png";

import { useDiceRoller } from "./DiceRollerPanel/useDiceRoller";
import { useSavedRolls } from "./DiceRollerPanel/useSavedRolls";
import SavedRollsPanel from "./DiceRollerPanel/SavedRollsPanel";
import DiceIconList from "./DiceRollerPanel/DiceIconList";
import ModifierInputs from "./DiceRollerPanel/ModifierInputs";
import RollControls from "./DiceRollerPanel/RollControls";
import { getNextZIndex } from "../../utils/zIndexManager";

const diceTypes = [
  { type: "d4", icon: d4Icon },
  { type: "d6", icon: d6Icon },
  { type: "d8", icon: d8Icon },
  { type: "d10", icon: d10Icon },
  { type: "d12", icon: d12Icon },
  { type: "d20", icon: d20Icon },
  { type: "d100", icon: d100Icon },
];

export default function DiceRollerPanel({
  isDM,
  onClose,
  sendMessage,
  selectedToken,
  defaultSender,
  defaultSenderId,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [isSavedRollsView, setIsSavedRollsView] = useState(false);
  const [zIndex, setZIndex] = useState(getNextZIndex());

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const {
    modifier,
    setModifier,
    diceCount,
    setDiceCount,
    selectedDie,
    setSelectedDie,
    handleRoll,
  } = useDiceRoller({
    isDM,
    sendMessage,
    selectedToken,
    defaultSender,
    defaultSenderId,
  });

  const {
    savedRolls,
    setSavedRolls,
    newRoll,
    setNewRoll,
    createRoll,
    deleteRoll,
  } = useSavedRolls(isSavedRollsView, API_BASE);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const handleMouseDown = (e) => {
    setZIndex(getNextZIndex());
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div
      className={styles.panel}
      style={{
        left: position.x,
        top: position.y,
        zIndex,
        position: "absolute",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.header} onMouseDown={handleMouseDown}>
        <span>Dice Roller</span>
        <div className={styles.controls}>
          <button onClick={() => setIsSavedRollsView((v) => !v)}>
            {isSavedRollsView ? "Saved" : "Rolls"}
          </button>
          <button onClick={toggleCollapse}>{isCollapsed ? "+" : "-"}</button>
          <button onClick={onClose}>x</button>
        </div>
      </div>

      {!isCollapsed && (
        <div className={styles.content}>
          {isSavedRollsView ? (
            <SavedRollsPanel
              isDM={isDM}
              savedRolls={savedRolls}
              newRoll={newRoll}
              setNewRoll={setNewRoll}
              handleRoll={handleRoll}
              createRoll={createRoll}
              deleteRoll={deleteRoll}
            />
          ) : (
            <>
              <DiceIconList
                diceTypes={diceTypes}
                selectedDie={selectedDie}
                setSelectedDie={setSelectedDie}
              />
              <ModifierInputs
                diceCount={diceCount}
                setDiceCount={setDiceCount}
                modifier={modifier}
                setModifier={setModifier}
              />
              <RollControls
                isDM={isDM}
                selectedDie={selectedDie}
                handleRoll={handleRoll}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
