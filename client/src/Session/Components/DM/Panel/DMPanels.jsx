import React from "react";
import CharacterPanel from "../../Shared/CharacterPanel";
import CharacterSheetPanel from "../../Shared/CharacterSheetPanel";
import MapsPanel from "./MapsPanel";
import DMTokenPanel from "./DMTokenPanel";
import MusicPanel from "./MusicPanel";
import NowPlayingPanel from "../../Shared/NowPlayingPanel";
import DiceRollerPanel from "../../Shared/DiceRollerPanel";
import CombatTracker from "./CombatTracker";
import SettingsPanel from "../../Shared/SettingsPanel";
import SelectorBar from "../../Shared/SelectorBar";
import AoEControlPanel from "../../Shared/AoEControlPanel";
import MeasurementPanel from "../../Shared/MeasurementPanel";
import MapAssetsPanel from "./MapAssetsPanel";
import socket from "../../../../socket";

export default function DMPanels({
  user,
  campaign,
  maps,
  mapAssets,
  filteredMapAssets = [],
  selectedMapId,
  setSelectedMapId,
  handleLoadMap,
  showMapAssetsPanel,
  showMapsPanel,
  showTokenPanel,
  showMusicPanel,
  showNowPlaying,
  showCharacterPanel,
  activeCharacter,
  setActiveCharacter,
  showDicePanel,
  showCombatTracker,
  showSettingsPanel,
  toolMode,
  selectorMode,
  setSelectorMode,
  selectedShape,
  setSelectedShape,
  isAnchored,
  setIsAnchored,
  shapeSettings,
  setShapeSettings,
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
  activeMap,
  setActiveMap,
  sessionCode,
  handleSendMessage,
  dmOwnedTokens,
  selectedTokenId,
  setActiveTurnTokenId,
  setFilteredMapAssets,
  music,
  characterPanelRef,
  onCloseCharacterPanel,
  onCloseTokenPanel,
  onCloseMusicPanel,
  onCloseNowPlaying,
  onCloseSettingsPanel,
  onCloseDicePanel,
  onCloseMapAssetsPanel,
  onCloseMapsPanel,
  setShowNowPlaying,
}) {
  return (
    <>
      {showCharacterPanel && campaign && user && (
        <CharacterPanel
          ref={characterPanelRef}
          onClose={onCloseCharacterPanel}
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
          onClosePanel={onCloseMapsPanel}
          sessionCode={sessionCode}
        />
      )}

      {showTokenPanel && campaign && (
        <DMTokenPanel
          campaignId={campaign._id}
          userId={user.id}
          sessionCode={sessionCode}
          onClosePanel={onCloseTokenPanel}
        />
      )}

      {showMusicPanel && (
        <MusicPanel
          onPlayTrack={(input, options = {}) => {
            if (options.isPlaylist && Array.isArray(input)) {
              music.playPlaylist(input);
              socket.emit("dmPlayPlaylist", { sessionCode, tracks: input });
            } else {
              music.playTrack(input);
              socket.emit("dmPlayTrack", { sessionCode, track: input });
            }
            setShowNowPlaying(true);
          }}
          onClose={onCloseMusicPanel}
        />
      )}

      {showNowPlaying && (
        <NowPlayingPanel
          currentTrack={music.currentTrack}
          isPlaying={music.isPlaying}
          onPlayPause={() => {
            if (music.isPlaying) {
              music.pause();
              socket.emit("dmPauseTrack", { sessionCode });
            } else {
              music.resume();
              socket.emit("dmResumeTrack", { sessionCode });
            }
          }}
          onSkipNext={() => {
            music.skipToNext();
            socket.emit("dmSkipNextTrack", { sessionCode });
          }}
          onSkipPrev={() => {
            music.skipToPrevious();
            socket.emit("dmSkipPrevTrack", { sessionCode });
          }}
          onToggleLoop={() => {
            const newLoop = !music.loop;
            music.setLoop(newLoop);
            socket.emit("dmToggleLoop", { sessionCode, loop: newLoop });
          }}
          loop={music.loop}
          volume={music.volume}
          onVolumeChange={music.updateVolume}
          onClose={onCloseNowPlaying}
        />
      )}

      {showDicePanel && (
        <DiceRollerPanel
          isDM={true}
          onClose={onCloseDicePanel}
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
          gridVisible={activeMap?.gridVisible}
          setGridVisible={activeMap?.setGridVisible}
          gridColor={activeMap?.gridColor}
          setGridColor={activeMap?.setGridColor}
          onClose={onCloseSettingsPanel}
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

      {(() => {
        if (showMapAssetsPanel && Array.isArray(filteredMapAssets)) {
          return (
            <MapAssetsPanel
              assets={filteredMapAssets}
              onSearch={(query) => {
                const lower = query.toLowerCase();
                const newFiltered = mapAssets.filter((asset) =>
                  asset.name.toLowerCase().includes(lower)
                );

                setFilteredMapAssets(newFiltered);
              }}
              onSelectAsset={(asset) => {}}
              onCreateNew={() => {}}
              onClose={() => {
                onCloseMapAssetsPanel();
              }}
            />
          );
        } else {
          return null;
        }
      })()}

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
    </>
  );
}
