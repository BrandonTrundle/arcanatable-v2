import { useState, useRef } from "react";
import styles from "../../../styles/CombatTracker.module.css";

export default function CombatTracker({ activeMap, setMapData, sendMessage }) {
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [combatActive, setCombatActive] = useState(false);
  const [showPCList, setShowPCList] = useState(false);
  const [showNPCList, setShowNPCList] = useState(false);
  const [showMonsterList, setShowMonsterList] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const trackerRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const availableConditions = [
    "Stunned",
    "Poisoned",
    "Blinded",
    "Paralyzed",
    "Charmed",
  ];

  const npcTokens = Object.values(activeMap?.layers || {})
    .flatMap((layer) => layer.tokens || [])
    .filter((token) => token.entityType === "NPC");

  const monsterTokens = Object.values(activeMap?.layers || {})
    .flatMap((layer) => layer.tokens || [])
    .filter((token) => token.entityType === "Monster");

  const pcTokens = Object.values(activeMap?.layers || {})
    .flatMap((layer) => layer.tokens || [])
    .filter((token) => token.entityType === "PC");

  const handleMouseDown = (e) => {
    isDragging.current = true;
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const rollInitiative = () => {
    const rolls = [...npcTokens, ...monsterTokens].map((token) => {
      const mod = parseInt(token.initiative) || 0;
      const roll = Math.floor(Math.random() * 20) + 1;
      return { tokenId: token.id, name: token.name, initiative: roll + mod };
    });
    rolls.sort((a, b) => b.initiative - a.initiative);
    setInitiativeOrder(rolls);
  };

  const updateHP = (tokenId, newValue, isMax) => {
    const updatedMap = { ...activeMap };
    for (const layer of Object.values(updatedMap.layers || {})) {
      const token = layer.tokens?.find((t) => t.id === tokenId);
      if (token) {
        if (isMax) token.maxHp = Math.max(1, newValue);
        else token.hp = Math.max(0, newValue);
      }
    }
    setMapData(updatedMap);
  };

  const toggleCondition = (tokenId, condition) => {
    const updatedMap = { ...activeMap };
    for (const layer of Object.values(updatedMap.layers || {})) {
      const token = layer.tokens?.find((t) => t.id === tokenId);
      if (token) {
        token.statusConditions = token.statusConditions || [];
        if (token.statusConditions.includes(condition)) {
          token.statusConditions = token.statusConditions.filter(
            (c) => c !== condition
          );
        } else {
          token.statusConditions.push(condition);
        }
      }
    }
    setMapData(updatedMap);
  };

  const startCombat = () => {
    setCombatActive(true);
    sendMessage({ text: "Combat has started!" });
  };

  const addToInitiative = (token) => {
    const roll = prompt(`Enter initiative for ${token.name}:`, "0");
    const initiative = parseInt(roll);
    if (!isNaN(initiative)) {
      const updatedOrder = [
        ...initiativeOrder,
        { tokenId: token.id, name: token.name, initiative },
      ];
      updatedOrder.sort((a, b) => b.initiative - a.initiative);
      setInitiativeOrder(updatedOrder);
      setShowPCList(false);
      setShowNPCList(false);
      setShowMonsterList(false);
    }
  };

  return (
    <div
      ref={trackerRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      <div className={styles.combatTracker}>
        <div
          className={styles.header}
          style={{ cursor: "move" }}
          onMouseDown={handleMouseDown}
        >
          <h3>Combat Tracker</h3>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "Expand" : "Collapse"}
          </button>
        </div>

        {!collapsed && (
          <>
            {!combatActive ? (
              <button onClick={startCombat}>Start Combat</button>
            ) : (
              <>
                <button onClick={rollInitiative}>Roll Initiative</button>
                <button onClick={() => setShowPCList(!showPCList)}>
                  Add PCs
                </button>
                <button onClick={() => setShowNPCList(!showNPCList)}>
                  Add NPC
                </button>
                <button onClick={() => setShowMonsterList(!showMonsterList)}>
                  Add Monster
                </button>

                {showPCList && (
                  <div className={styles.tokenList}>
                    <h4>PCs Available:</h4>
                    {pcTokens.map((pc) => (
                      <div
                        key={pc.id}
                        className={styles.tokenRow}
                        onClick={() => addToInitiative(pc)}
                      >
                        <strong>{pc.name}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {showNPCList && (
                  <div className={styles.tokenList}>
                    <h4>NPCs Available:</h4>
                    {npcTokens.map((npc) => (
                      <div
                        key={npc.id}
                        className={styles.tokenRow}
                        onClick={() => addToInitiative(npc)}
                      >
                        <strong>{npc.name}</strong>
                      </div>
                    ))}
                  </div>
                )}

                {showMonsterList && (
                  <div className={styles.tokenList}>
                    <h4>Monsters Available:</h4>
                    {monsterTokens.map((monster) => (
                      <div
                        key={monster.id}
                        className={styles.tokenRow}
                        onClick={() => addToInitiative(monster)}
                      >
                        <strong>{monster.name}</strong>
                      </div>
                    ))}
                  </div>
                )}

                <div className={styles.tokenList}>
                  {initiativeOrder.map((entry) => {
                    const token = Object.values(activeMap.layers || {})
                      .flatMap((layer) => layer.tokens || [])
                      .find((t) => t.id === entry.tokenId);
                    if (!token) return null;
                    return (
                      <div className={styles.tokenRow} key={token.id}>
                        <div className={styles.tokenHeader}>
                          <span className={styles.initiative}>
                            {entry.initiative}
                          </span>
                          <strong className={styles.name}>{token.name}</strong>
                          <label>
                            Max HP:
                            <input
                              type="number"
                              min="1"
                              value={token.maxHp || 1}
                              onChange={(e) =>
                                updateHP(
                                  token.id,
                                  parseInt(e.target.value) || 1,
                                  true
                                )
                              }
                              className={styles.hpInput}
                            />
                          </label>
                          <label>
                            HP:
                            <input
                              type="number"
                              min="0"
                              value={token.hp || 0}
                              onChange={(e) =>
                                updateHP(
                                  token.id,
                                  parseInt(e.target.value) || 0,
                                  false
                                )
                              }
                              className={styles.hpInput}
                            />
                          </label>
                          <select
                            value=""
                            onChange={(e) =>
                              toggleCondition(token.id, e.target.value)
                            }
                          >
                            <option value="">Add Condition</option>
                            {availableConditions.map((cond) => (
                              <option key={cond} value={cond}>
                                {cond}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className={styles.conditions}>
                          {token.statusConditions?.map((cond) => (
                            <span key={cond} className={styles.conditionBadge}>
                              {cond}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
