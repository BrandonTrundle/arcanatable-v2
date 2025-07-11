import { useState, useRef } from "react";
import useMusicPlayer from "./useMusicPlayer";

export default function useDMViewState(user) {
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
    setStageRenderPos(pos);
  };

  return {
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
  };
}
