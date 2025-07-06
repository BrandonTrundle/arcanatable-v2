import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../styles/DMView.module.css";
import PlayerToolbar from "../../Components/Player/PlayerToolbar";
import PlayerMapCanvas from "./PlayerMapCanvas";
import CharacterPanel from "../../Components/Shared/CharacterPanel";
import CharacterSheetPanel from "../../Components/Shared/CharacterSheetPanel";
import ChatPanel from "../../Components/Shared/ChatPanel";
import DiceRollerPanel from "../../Components/Shared/DiceRollerPanel";
import SelectorBar from "../../Components/Shared/SelectorBar";

import usePlayerSocketHandlers from "./hooks/usePlayerSocketHandlers";
import usePlayerSessionLoader from "./hooks/usePlayerSessionLoader";
import { usePlayerChatEmitter } from "./hooks/usePlayerSocketHandlers";

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
  const [showDicePanel, setShowDicePanel] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [selectorMode, setSelectorMode] = useState("selector");
  const [activeTurnTokenId, setActiveTurnTokenId] = useState(null);

  const stageRef = useRef();

  const playerOwnedTokens = (activeMap?.layers?.player?.tokens || []).filter(
    (token) =>
      Array.isArray(token.ownerIds) && token.ownerIds.includes(user?.id)
  );

  const handleSendMessage = (message) => {
    const fullMessage = {
      sender: message.sender || user?.username || "Player",
      text: message.text,
      image: message.image || null,
    };

    sendChatMessage(fullMessage);
    setChatMessages((prev) => [...prev, fullMessage]);
  };

  usePlayerSessionLoader(inviteCode, user, setCampaign, setMaps, setActiveMap);

  usePlayerSocketHandlers(
    inviteCode,
    user,
    setActiveMap,
    (message) => {
      if (!message._local) {
        setChatMessages((prev) => [...prev, message]);
      }
    },
    stageRef,
    activeMap,
    setActiveTurnTokenId
  );

  return (
    <div className={styles.dmView}>
      <PlayerToolbar
        onSelectCharacters={() => setShowCharacterPanel(true)}
        onSelectTool={setToolMode}
        currentTool={toolMode}
        onToggleDice={() => setShowDicePanel((prev) => !prev)}
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

      {activeMap ? (
        <PlayerMapCanvas
          sessionCode={inviteCode}
          map={activeMap}
          fogVisible={fogVisible}
          setActiveMap={setActiveMap}
          toolMode={toolMode}
          campaign={campaign}
          stageRef={stageRef}
          selectorMode={selectorMode}
          activeTurnTokenId={activeTurnTokenId}
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

      {showDicePanel && (
        <DiceRollerPanel
          isDM={false}
          onClose={() => setShowDicePanel(false)}
          sendMessage={handleSendMessage}
          selectedToken={playerOwnedTokens.find(
            (t) => t.id === selectedTokenId
          )}
          defaultSender={user?.username}
        />
      )}

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

      {toolMode === "select" && (
        <SelectorBar
          selectorMode={selectorMode}
          setSelectorMode={setSelectorMode}
          isDM={false}
        />
      )}

      <ChatPanel
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        availableTokens={playerOwnedTokens}
        defaultSender={user?.username}
        onSelectToken={setSelectedTokenId}
      />
    </div>
  );
}
