import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../styles/DMView.module.css";
import MapsPanel from "../../Components/DM/Panel/MapsPanel";
import DMTokenPanel from "../../Components/DM/Panel/DMTokenPanel";
import DMMapCanvas from "./DMMapCanvas";
import DMToolbar from "../../Components/DM/DMToolbar";
import ChatPanel from "../../Components/Shared/ChatPanel";
import DiceRollerPanel from "../../Components/Shared/DiceRollerPanel";
import SelectorBar from "../../Components/Shared/SelectorBar";
import CombatTracker from "../../Components/DM/Panel/CombatTracker";
import socket from "../../../socket";

import { useDMInitialData } from "./hooks/useDMInitialData";
import { useDMSocketEvents } from "./hooks/useDMSocketEvents";
import { useDMMapPanelControl } from "./hooks/useDMMapPanelControl";
import { useDMChatEmitter } from "./hooks/useDMSocketEvents";

export default function DMView({ sessionCode }) {
  const { user } = useContext(AuthContext);
  const [toolMode, setToolMode] = useState(null);
  const [activeLayer, setActiveLayer] = useState("dm");
  const [activeNoteCell, setActiveNoteCell] = useState(null);
  const [selectedNoteCell, setSelectedNoteCell] = useState(null);
  const [selectedMapId, setSelectedMapId] = useState(null);
  const [gridVisible, setGridVisible] = useState(true);
  const [fogVisible, setFogVisible] = useState(false);
  const [showTokenPanel, setShowTokenPanel] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const sendChatMessage = useDMChatEmitter(sessionCode);
  const [showDicePanel, setShowDicePanel] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [selectorMode, setSelectorMode] = useState("selector");
  const [showCombatTracker, setShowCombatTracker] = useState(false);
  const [activeTurnTokenId, setActiveTurnTokenId] = useState(null);

  const { campaign, maps, activeMap, setActiveMap } = useDMInitialData(
    sessionCode,
    user
  );

  const dmOwnedTokens = Object.values(activeMap?.layers || {})
    .flatMap((layer) => layer.tokens || [])
    .filter(
      (token) =>
        Array.isArray(token.ownerIds) && token.ownerIds.includes(user?.id)
    );

  const handleSendMessage = (message) => {
    const fullMessage = {
      sender: message.sender || user?.username || "DM",
      text: message.text,
      image: message.image || null,
      senderId: user?.id, // ✅ tag sender
    };

    if (message._local) {
      setChatMessages((prev) => [...prev, fullMessage]); // only local, do not emit
    } else {
      setChatMessages((prev) => [...prev, fullMessage]);
      sendChatMessage(fullMessage); // emit if not local
    }
  };

  const toggleTokenPanel = () => setShowTokenPanel((prev) => !prev);

  useDMSocketEvents(
    setActiveMap,
    sessionCode,
    (message) => {
      if (message.senderId !== user?.id) {
        setChatMessages((prev) => [...prev, message]);
      }
    },
    user
  );

  const { showMapsPanel, toggleMapsPanel, handleLoadMap } =
    useDMMapPanelControl({
      maps,
      selectedMapId,
      setSelectedMapId,
      setActiveMap,
      sessionCode,
      user,
    });

  useEffect(() => {
    setSelectedTokenId(""); // Clear selection when turn changes
  }, [activeTurnTokenId]);

  return (
    <div className={styles.dmView}>
      <DMToolbar
        onToggleMaps={toggleMapsPanel}
        onToggleDice={() => setShowDicePanel((prev) => !prev)}
        isMapsPanelOpen={showMapsPanel}
        onToggleTokens={toggleTokenPanel}
        isTokenPanelOpen={showTokenPanel}
        onSelectTool={setToolMode}
        currentTool={toolMode}
        onToggleCombat={() => {
          setShowCombatTracker((prev) => {
            const next = !prev;
            if (!next) {
              setSelectedTokenId(""); // Deselect any selected token
              setActiveTurnTokenId(null); // Clear active turn indicator

              socket.emit("activeTurnChanged", {
                sessionCode,
                tokenId: null, // Inform players to clear active turn highlight
              });
            }
            return next;
          });
        }}
      />
      {showMapsPanel && (
        <MapsPanel
          maps={maps}
          selectedMapId={selectedMapId}
          setSelectedMapId={setSelectedMapId}
          onLoadMap={handleLoadMap}
          onClosePanel={() => toggleMapsPanel()}
          sessionCode={sessionCode}
        />
      )}
      {showTokenPanel && campaign && (
        <DMTokenPanel
          campaignId={campaign._id}
          userId={user.id}
          sessionCode={sessionCode}
          onClosePanel={() => setShowTokenPanel(false)}
        />
      )}
      <DMMapCanvas
        user={user}
        campaign={campaign}
        sessionCode={sessionCode}
        map={activeMap}
        notes={activeMap?.notes || []}
        gridVisible={gridVisible}
        onCanvasDrop={() => {}}
        setMapData={setActiveMap}
        activeLayer={activeLayer}
        fogVisible={fogVisible}
        toolMode={toolMode}
        setActiveNoteCell={setActiveNoteCell}
        activeNoteCell={activeNoteCell}
        selectedNoteCell={selectedNoteCell}
        selectorMode={selectorMode}
        onSelectToken={(token) =>
          console.log("Token selected in DMView:", token)
        }
        activeTurnTokenId={activeTurnTokenId}
      />
      {showDicePanel && (
        <DiceRollerPanel
          isDM={true}
          onClose={() => setShowDicePanel(false)}
          sendMessage={handleSendMessage}
          selectedToken={dmOwnedTokens.find((t) => t.id === selectedTokenId)}
          defaultSender={user?.username}
        />
      )}

      {showCombatTracker && activeMap && (
        <CombatTracker
          activeMap={activeMap}
          setMapData={setActiveMap}
          sendMessage={handleSendMessage}
          sessionCode={sessionCode}
          setActiveTurnTokenId={setActiveTurnTokenId}
        />
      )}

      {toolMode === "select" && (
        <SelectorBar
          selectorMode={selectorMode}
          setSelectorMode={setSelectorMode}
          isDM={true}
        />
      )}

      <ChatPanel
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        availableTokens={dmOwnedTokens}
        defaultSender={user?.username}
        onSelectToken={setSelectedTokenId}
      />
    </div>
  );
}
