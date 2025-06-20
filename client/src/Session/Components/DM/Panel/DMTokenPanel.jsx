import { useRef, useState } from "react";
import styles from "../../../styles/TokenPanel.module.css";
import tokenIcon from "../../../../assets/icons/tokenIcon.png";
import fetchTokens from "../../../../hooks/dmtoolkit/fetchTokens";
import TokenCreationModal from "./TokenCreationModal";

export default function DMTokenPanel({ campaignId, onClosePanel, userId }) {
  const { tokens, loading, error } = fetchTokens(campaignId);
  const panelRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const startDrag = (e) => {
    const panel = panelRef.current;
    pos.current = {
      x: e.clientX - panel.offsetLeft,
      y: e.clientY - panel.offsetTop,
    };
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  };

  const handleTokenCreated = (newToken) => {
    // For immediate UI update (not ideal for sync with backend pagination)
    tokens.push(newToken);
  };

  const drag = (e) => {
    const panel = panelRef.current;
    panel.style.left = `${e.clientX - pos.current.x}px`;
    panel.style.top = `${e.clientY - pos.current.y}px`;
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
  };

  const filteredTokens = tokens.filter((token) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.panel} ref={panelRef} style={{ top: 80, left: 360 }}>
      <div
        className={styles.header}
        onMouseDown={startDrag}
        onDoubleClick={() => setIsCollapsed((prev) => !prev)}
      >
        <img
          src={tokenIcon}
          alt="Tokens"
          className={styles.icon}
          onMouseDown={(e) => e.stopPropagation()}
        />
        <span>Tokens</span>
        <button onClick={onClosePanel}>×</button>
      </div>

      {!isCollapsed && (
        <div className={styles.content}>
          {loading && <div>Loading tokens...</div>}
          {error && <div>Error loading tokens.</div>}
          {!loading && !error && filteredTokens.length === 0 && (
            <div>No tokens found.</div>
          )}
          {!loading && !error && (
            <>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className={styles.tokenGrid}>
                {filteredTokens.map((token) => (
                  <div
                    key={token.id}
                    className={styles.tokenEntry}
                    draggable
                    onDragStart={(e) => {
                      const tokenPayload = {
                        activeToken: false,
                        effects: [],
                        id: crypto.randomUUID(),
                        name: token.name,
                        image: token.image,
                        size: token.size || { width: 1, height: 1 },
                        position: { x: 0, y: 0 },
                        hp: token.hp || 1,
                        maxHp: token.maxHp || 1,
                        isVisible: true,
                        lightEmit: null,
                        rotation: token.rotation || 0,
                        isPC: token.entityType === "PC",
                        entityType: token.entityType || "NPC",
                        pcId:
                          token.entityType === "PC"
                            ? token.entityId
                            : undefined,
                        entityId: token.entityId,
                        ownerId: userId,
                        ownerIds: [userId],
                      };

                      e.dataTransfer.setData(
                        "application/json",
                        JSON.stringify(tokenPayload)
                      );
                    }}
                  >
                    <div
                      className={styles.tokenImage}
                      style={{ backgroundImage: `url(${token.image})` }}
                    />
                    <div className={styles.tokenName}>{token.name}</div>
                  </div>
                ))}
              </div>
              <button
                className={styles.createButton}
                onClick={() => setShowCreateModal(true)}
              >
                Create New Token
              </button>
            </>
          )}
          {showCreateModal && (
            <TokenCreationModal
              campaignId={campaignId}
              onClose={() => setShowCreateModal(false)}
              onCreated={handleTokenCreated}
            />
          )}
        </div>
      )}
    </div>
  );
}
