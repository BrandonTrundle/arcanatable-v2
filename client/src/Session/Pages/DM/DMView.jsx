import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../styles/DMView.module.css";
import MapsPanel from "../../Components/DM/Panel/MapsPanel";
import DMTokenPanel from "../../Components/DM/Panel/DMTokenPanel";
import DMMapCanvas from "./DMMapCanvas";
import DMToolbar from "../../Components/DM/DMToolbar";
import ChatPanel from "../../Components/Shared/ChatPanel";

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
      _local: true, // Add a private flag
    };

    sendChatMessage(fullMessage);
  };

  const toggleTokenPanel = () => setShowTokenPanel((prev) => !prev);

  useDMSocketEvents(
    setActiveMap,
    sessionCode,
    (message) => {
      setChatMessages((prev) => [...prev, message]);
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

  return (
    <div className={styles.dmView}>
      <DMToolbar
        onToggleMaps={toggleMapsPanel}
        isMapsPanelOpen={showMapsPanel}
        onToggleTokens={toggleTokenPanel}
        isTokenPanelOpen={showTokenPanel}
        onSelectTool={setToolMode}
        currentTool={toolMode}
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
        onSelectToken={(token) =>
          console.log("Token selected in DMView:", token)
        }
      />
      <ChatPanel
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        availableTokens={dmOwnedTokens}
        defaultSender={user?.username}
      />
    </div>
  );
}
