import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../styles/DMView.module.css";
import DMMapCanvas from "./DMMapCanvas";
import DMToolbar from "../../Components/DM/DMToolbar";
import ChatPanel from "../../Components/Shared/ChatPanel";
import useMapAssets from "./hooks/useMapAssets";
import useDMViewState from "./hooks/useDMViewState";
import useDMViewHandlers from "./hooks/useDMViewHandlers";
import useDMComputedValues from "./hooks/useDMComputedValues";
import DMPanels from "../../Components/DM/Panel/DMPanels";
import { useDMInitialData } from "./hooks/useDMInitialData";
import { useDMSocketEvents } from "./hooks/useDMSocketEvents";
import { useDMMapPanelControl } from "./hooks/useDMMapPanelControl";

export default function DMView({ sessionCode }) {
  const { user } = useContext(AuthContext);
  const {
    toolMode,
    setToolMode,
    activeLayer,
    setActiveLayer,
    activeNoteCell,
    setActiveNoteCell,
    selectedNoteCell,
    setSelectedNoteCell,
    selectedMapId,
    setSelectedMapId,
    gridVisible,
    setGridVisible,
    gridColor,
    setGridColor,
    fogVisible,
    setFogVisible,
    showTokenPanel,
    setShowTokenPanel,
    chatMessages,
    setChatMessages,
    showDicePanel,
    setShowDicePanel,
    selectedTokenId,
    setSelectedTokenId,
    selectorMode,
    setSelectorMode,
    showCombatTracker,
    setShowCombatTracker,
    activeTurnTokenId,
    setActiveTurnTokenId,
    aoes,
    setAoes,
    selectedShape,
    setSelectedShape,
    shapeSettings,
    setShapeSettings,
    isAnchored,
    setIsAnchored,
    snapMode,
    setSnapMode,
    broadcastEnabled,
    setBroadcastEnabled,
    measurementColor,
    setMeasurementColor,
    snapSetting,
    setSnapSetting,
    lockMeasurement,
    setLockMeasurement,
    lockedMeasurements,
    setLockedMeasurements,
    showMapAssetsPanel,
    setShowMapAssetsPanel,
    stagePosRef,
    stageRenderPos,
    setStagePos,
    showCharacterPanel,
    setShowCharacterPanel,
    activeCharacter,
    setActiveCharacter,
    characterPanelRef,
    showSettingsPanel,
    setShowSettingsPanel,
    showMusicPanel,
    setShowMusicPanel,
    showNowPlaying,
    setShowNowPlaying,
    music,
  } = useDMViewState(user);

  const {
    handleSendMessage,
    toggleTokenPanel,
    handleDMPlayTrack,
    handleToggleCombat,
    handlePlayMusicPanel,
  } = useDMViewHandlers({
    user,
    sessionCode,
    setChatMessages,
    music,
    setShowNowPlaying,
    setShowTokenPanel,
    setSelectedTokenId,
    setActiveTurnTokenId,
  });

  const { campaign, maps, activeMap, setActiveMap } = useDMInitialData(
    sessionCode,
    user
  );

  const { mapAssets, loading: assetsLoading } = useMapAssets(campaign?._id);
  useEffect(() => {}, [mapAssets]);

  const { filteredMapAssets, setFilteredMapAssets, dmOwnedTokens } =
    useDMComputedValues({
      activeMap,
      user,
      mapAssets,
    });

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
        onToggleMapAssets={() => {
          setShowMapAssetsPanel((prev) => !prev);
        }}
        isMapAssetsPanelOpen={showMapAssetsPanel}
        onToggleCombat={() => setShowCombatTracker(handleToggleCombat())}
        onToggleMusicPanel={() => setShowMusicPanel((prev) => !prev)}
      />

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
        onSelectToken={token}
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

      <DMPanels
        user={user}
        campaign={campaign}
        maps={maps}
        mapAssets={mapAssets}
        selectedMapId={selectedMapId}
        setSelectedMapId={setSelectedMapId}
        handleLoadMap={handleLoadMap}
        showMapsPanel={showMapsPanel}
        showTokenPanel={showTokenPanel}
        showMusicPanel={showMusicPanel}
        showNowPlaying={showNowPlaying}
        showCharacterPanel={showCharacterPanel}
        showMapAssetsPanel={showMapAssetsPanel}
        activeCharacter={activeCharacter}
        setActiveCharacter={setActiveCharacter}
        onCloseCharacterPanel={() => setShowCharacterPanel(false)}
        onCloseTokenPanel={() => setShowTokenPanel(false)}
        onCloseMusicPanel={() => setShowMusicPanel(false)}
        onCloseNowPlaying={() => setShowNowPlaying(false)}
        onCloseSettingsPanel={() => setShowSettingsPanel(false)}
        onCloseDicePanel={() => setShowDicePanel(false)}
        onCloseMapAssetsPanel={() => setShowMapAssetsPanel(false)}
        onCloseMapsPanel={() => toggleMapsPanel()}
        showDicePanel={showDicePanel}
        showCombatTracker={showCombatTracker}
        showSettingsPanel={showSettingsPanel}
        toolMode={toolMode}
        selectorMode={selectorMode}
        setSelectorMode={setSelectorMode}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        isAnchored={isAnchored}
        setIsAnchored={setIsAnchored}
        shapeSettings={shapeSettings}
        setShapeSettings={setShapeSettings}
        snapMode={snapMode}
        setSnapMode={setSnapMode}
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
        activeMap={activeMap}
        setActiveMap={setActiveMap}
        sessionCode={sessionCode}
        handleSendMessage={handleSendMessage}
        dmOwnedTokens={dmOwnedTokens}
        selectedTokenId={selectedTokenId}
        setActiveTurnTokenId={setActiveTurnTokenId}
        filteredMapAssets={filteredMapAssets}
        setFilteredMapAssets={setFilteredMapAssets}
        music={music}
        characterPanelRef={characterPanelRef}
      />

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
