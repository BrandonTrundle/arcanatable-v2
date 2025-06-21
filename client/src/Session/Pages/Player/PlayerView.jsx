import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import PlayerToolbar from "../../Components/Player/PlayerToolbar";
import PlayerMapCanvas from "./PlayerMapCanvas";
import CharacterPanel from "../../Components/Shared/CharacterPanel";
import CharacterSheetPanel from "../../Components/Shared/CharacterSheetPanel";
import ChatPanel from "../../Components/Shared/ChatPanel";
import { usePlayerChatEmitter } from "./hooks/usePlayerSocketHandlers";

import styles from "../../styles/DMView.module.css";
import usePlayerSocketHandlers from "./hooks/usePlayerSocketHandlers";
import usePlayerSessionLoader from "./hooks/usePlayerSessionLoader";

export default function PlayerView({ inviteCode }) {
  const { user } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(null);
  const [maps, setMaps] = useState([]);
  const [activeMap, setActiveMap] = useState(null);
  const [fogVisible, setFogVisible] = useState(false);
  const [showCharacterPanel, setShowCharacterPanel] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const characterPanelRef = useRef();
  const [toolMode, setToolMode] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const sendChatMessage = usePlayerChatEmitter(inviteCode);

  const handleSendMessage = (message) => {
    const fullMessage = {
      sender: message.sender || user?.username || "Player",
      text: message.text,
      image: message.image || null,
    };

    sendChatMessage(fullMessage); // Emit to server
    setChatMessages((prev) => [...prev, fullMessage]); // Optimistically update
  };
  const playerOwnedTokens = (activeMap?.layers?.player?.tokens || []).filter(
    (token) =>
      Array.isArray(token.ownerIds) && token.ownerIds.includes(user?.id)
  );

  usePlayerSessionLoader(inviteCode, user, setCampaign, setMaps, setActiveMap);
  usePlayerSocketHandlers(inviteCode, user, setActiveMap, (message) => {
    setChatMessages((prev) => [...prev, message]);
  });

  return (
    <div className={styles.dmView}>
      <PlayerToolbar
        onSelectCharacters={() => setShowCharacterPanel(true)}
        onSelectTool={setToolMode}
        currentTool={toolMode}
      />

      {showCharacterPanel && (
        <CharacterPanel
          ref={characterPanelRef}
          onClose={() => setShowCharacterPanel(false)}
          campaign={campaign}
          user={user}
          onOpenCharacter={(char) => setActiveCharacter(char)}
        />
      )}

      <div className={styles.mapContainer}>
        {activeMap ? (
          <PlayerMapCanvas
            sessionCode={inviteCode}
            map={activeMap}
            fogVisible={fogVisible}
            setActiveMap={setActiveMap}
            toolMode={toolMode}
            campaign={campaign}
          />
        ) : (
          <div className={styles.selectMapPrompt}>
            <h2>Welcome to the game!</h2>
            <p>
              You have joined the session with invite code:{" "}
              <strong>{inviteCode}</strong>
            </p>
            <p>Waiting for the DM to select a map...</p>
          </div>
        )}
        <ChatPanel
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          availableTokens={playerOwnedTokens}
          defaultSender={user?.username}
        />
      </div>

      {activeCharacter && (
        <CharacterSheetPanel
          character={activeCharacter}
          onClose={(saved) => {
            setActiveCharacter(null);
            if (saved && characterPanelRef.current?.refreshCharacters) {
              characterPanelRef.current.refreshCharacters();
            }
          }}
        />
      )}
    </div>
  );
}
