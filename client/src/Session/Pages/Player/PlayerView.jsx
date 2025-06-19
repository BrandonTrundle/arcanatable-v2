import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import PlayerToolbar from "../../Components/Player/PlayerToolbar";
import PlayerMapCanvas from "./PlayerMapCanvas";
import CharacterPanel from "../../Components/Shared/CharacterPanel";
import CharacterSheetPanel from "../../Components/Shared/CharacterSheetPanel";
import styles from "../../styles/PlayerView.module.css";
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

  usePlayerSessionLoader(inviteCode, user, setCampaign, setMaps, setActiveMap);
  usePlayerSocketHandlers(inviteCode, user, setActiveMap);

  return (
    <div className={styles.playerView}>
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
        <div className={styles.info}>
          <h2>Welcome to the game!</h2>
          <p>
            You have joined the session with invite code:{" "}
            <strong>{inviteCode}</strong>
          </p>
          <p>Waiting for the DM to select a map...</p>
        </div>
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
    </div>
  );
}
