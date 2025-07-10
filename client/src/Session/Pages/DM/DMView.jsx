import { useContext, useState, useEffect, useRef } from "react";
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
import AoEControlPanel from "../../Components/Shared/AoEControlPanel";
import MeasurementPanel from "../../Components/Shared/MeasurementPanel";
import MapAssetsPanel from "../../Components/DM/Panel/MapAssetsPanel";
import useMapAssets from "./hooks/useMapAssets";
import CharacterPanel from "../../Components/Shared/CharacterPanel";
import CharacterSheetPanel from "../../Components/Shared/CharacterSheetPanel";
import SettingsPanel from "../../Components/Shared/SettingsPanel";
import MusicPanel from "../../Components/DM/Panel/MusicPanel";
import useMusicPlayer from "./hooks/useMusicPlayer";
import NowPlayingPanel from "../../Components/Shared/NowPlayingPanel";

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
  const [gridColor, setGridColor] = useState("#444444");
  const [fogVisible, setFogVisible] = useState(false);
  const [showTokenPanel, setShowTokenPanel] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const sendChatMessage = useDMChatEmitter(sessionCode);
  const [showDicePanel, setShowDicePanel] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState("");
  const [selectorMode, setSelectorMode] = useState("selector");
  const [showCombatTracker, setShowCombatTracker] = useState(false);
  const [activeTurnTokenId, setActiveTurnTokenId] = useState(null);
  const [aoes, setAoes] = useState([]);
  const [selectedShape, setSelectedShape] = useState("circle");
  const [shapeSettings, setShapeSettings] = useState({});
  const [isAnchored, setIsAnchored] = useState(false);
  const [snapMode, setSnapMode] = useState("center");
  const [broadcastEnabled, setBroadcastEnabled] = useState(false);
  const [measurementColor, setMeasurementColor] = useState("#ff0000");
  const [snapSetting, setSnapSetting] = useState("center");
  const [lockMeasurement, setLockMeasurement] = useState(false);
  const [lockedMeasurements, setLockedMeasurements] = useState([]);
  const [showMapAssetsPanel, setShowMapAssetsPanel] = useState(false);
  const stagePosRef = useRef({ x: 0, y: 0 });
  const [stageRenderPos, setStageRenderPos] = useState(stagePosRef.current);
  const [showCharacterPanel, setShowCharacterPanel] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const characterPanelRef = useRef();
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showMusicPanel, setShowMusicPanel] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(true);
  const music = useMusicPlayer();

  const setStagePos = (pos) => {
    stagePosRef.current = pos;
    setStageRenderPos(pos); // triggers re-render in canvas
  };

  const { campaign, maps, activeMap, setActiveMap } = useDMInitialData(
    sessionCode,
    user
  );

  const { mapAssets, loading: assetsLoading } = useMapAssets(campaign?._id);
  const [filteredMapAssets, setFilteredMapAssets] = useState([]);

  useEffect(() => {
    if (mapAssets.length > 0) {
      setFilteredMapAssets(mapAssets);
    }
  }, [mapAssets]);

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
    user,
    setAoes,
    setLockedMeasurements
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
        onToggleCharacters={() => setShowCharacterPanel((prev) => !prev)}
        onToggleSettings={() => setShowSettingsPanel((prev) => !prev)}
        isMapsPanelOpen={showMapsPanel}
        onToggleTokens={toggleTokenPanel}
        isTokenPanelOpen={showTokenPanel}
        onSelectTool={setToolMode}
        currentTool={toolMode}
        onToggleMapAssets={() => setShowMapAssetsPanel((prev) => !prev)}
        isMapAssetsPanelOpen={showMapAssetsPanel}
        onToggleCombat={() => {
          setShowCombatTracker((prev) => {
            const next = !prev;
            if (!next) {
              setSelectedTokenId("");
              setActiveTurnTokenId(null);
              socket.emit("activeTurnChanged", {
                sessionCode,
                tokenId: null,
              });
            }
            return next;
          });
        }}
        onToggleMusicPanel={() => setShowMusicPanel((prev) => !prev)} // ✅ ADD THIS
      />

      {showCharacterPanel && campaign && user && (
        <CharacterPanel
          ref={characterPanelRef}
          onClose={() => setShowCharacterPanel(false)}
          campaign={campaign}
          user={{ ...user, _id: user?._id || user?.id }}
          onOpenCharacter={(char) => setActiveCharacter(char)}
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

      {showMusicPanel && (
        <MusicPanel
          onPlayTrack={(input, options = {}) => {
            if (options.isPlaylist && Array.isArray(input)) {
              music.playPlaylist(input);
            } else {
              music.playTrack(input);
            }
            setShowNowPlaying(true);
          }}
          onClose={() => setShowMusicPanel(false)}
        />
      )}

      {showNowPlaying && (
        <NowPlayingPanel
          currentTrack={music.currentTrack}
          isPlaying={music.isPlaying}
          onPlayPause={() => {
            music.isPlaying ? music.pause() : music.resume();
          }}
          onSkipNext={music.skipToNext}
          onSkipPrev={music.skipToPrevious}
          onToggleLoop={() => music.setLoop(!music.loop)}
          loop={music.loop}
          volume={music.volume}
          onVolumeChange={music.updateVolume}
          onClose={() => setShowNowPlaying(false)}
        />
      )}

      <DMMapCanvas
        user={user}
        campaign={campaign}
        sessionCode={sessionCode}
        map={activeMap}
        notes={activeMap?.notes || []}
        gridVisible={gridVisible}
        gridColor={gridColor}
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
        aoes={aoes}
        setAoes={setAoes}
        selectedShape={selectedShape}
        shapeSettings={shapeSettings}
        snapMode={snapMode}
        measurementColor={measurementColor}
        broadcastEnabled={broadcastEnabled}
        lockMeasurement={lockMeasurement}
        setLockedMeasurements={setLockedMeasurements}
        lockedMeasurements={lockedMeasurements}
        stagePos={stageRenderPos}
        setStagePos={setStagePos}
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

      {showSettingsPanel && (
        <SettingsPanel
          gridVisible={gridVisible}
          setGridVisible={setGridVisible}
          gridColor={gridColor}
          setGridColor={setGridColor}
          onClose={() => setShowSettingsPanel(false)}
        />
      )}

      {toolMode === "select" && (
        <SelectorBar
          selectorMode={selectorMode}
          setSelectorMode={setSelectorMode}
          isDM={true}
        />
      )}

      {toolMode === "aoe" && (
        <AoEControlPanel
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
          isAnchored={isAnchored}
          setIsAnchored={setIsAnchored}
          shapeSettings={shapeSettings}
          setShapeSettings={setShapeSettings}
          snapMode={snapMode}
          setSnapMode={setSnapMode}
        />
      )}

      {toolMode === "ruler" && (
        <MeasurementPanel
          broadcastEnabled={broadcastEnabled}
          setBroadcastEnabled={setBroadcastEnabled}
          measurementColor={measurementColor}
          setMeasurementColor={setMeasurementColor}
          snapSetting={snapSetting}
          setSnapSetting={setSnapSetting}
          lockMeasurement={lockMeasurement}
          setLockMeasurement={setLockMeasurement}
          lockedMeasurements={lockedMeasurements}
          setLockedMeasurements={setLockedMeasurements}
          isDM={true}
          mapId={activeMap?._id}
          userId={user?.id}
          socket={socket}
          onClose={() => setToolMode(null)}
          sessionCode={sessionCode}
        />
      )}

      {showMapAssetsPanel && (
        <MapAssetsPanel
          assets={filteredMapAssets}
          onSearch={(query) => {
            const lower = query.toLowerCase();
            setFilteredMapAssets(
              mapAssets.filter((asset) =>
                asset.name.toLowerCase().includes(lower)
              )
            );
          }}
          onSelectAsset={(asset) => {
            // TODO: handle selection or drag
          }}
          onCreateNew={() => {
            console.log("Create new asset clicked");
          }}
          onClose={() => setShowMapAssetsPanel(false)}
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
