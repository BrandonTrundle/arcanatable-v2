import { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../../../context/AuthContext";
import PlayerToolbar from "../../Components/Player/PlayerToolbar";
import PlayerMapCanvas from "./PlayerMapCanvas";
import CharacterPanel from "../../Components/Shared/CharacterPanel";
import CharacterSheetPanel from "../../Components/Shared/CharacterSheetPanel";
import styles from "../../styles/PlayerView.module.css";
import socket from "../../../socket";

export default function PlayerView({ inviteCode }) {
  const { user } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(null);
  const [maps, setMaps] = useState([]);
  const [activeMap, setActiveMap] = useState(null);
  const [fogVisible, setFogVisible] = useState(false);
  const [showCharacterPanel, setShowCharacterPanel] = useState(false);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const characterPanelRef = useRef();

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const token = user.token;

        const sessionRes = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/sessions/by-code/${inviteCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sessionData = await sessionRes.json();
        if (!sessionData?.session) {
          console.error("Invalid session response:", sessionData);
          return;
        }
        const campaignId = sessionData.session.campaignId;

        const campaignRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns/${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const campaignData = await campaignRes.json();
        setCampaign(campaignData.campaign);

        const mapsRes = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/maps?campaignId=${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const mapData = await mapsRes.json();
        setMaps(mapData || []);

        if (sessionData.session.currentMapId) {
          const active = mapData.find(
            (m) => m._id === sessionData.session.currentMapId
          );
          if (active) setActiveMap(active);
        }
      } catch (err) {
        console.error("PlayerView fetch error:", err);
      }
    };

    if (inviteCode && user?.token) {
      fetchSessionData();
    }
  }, [inviteCode, user]);

  useEffect(() => {
    if (inviteCode) {
      socket.emit("joinSession", { sessionCode: inviteCode });
    }
  }, [inviteCode]);

  useEffect(() => {
    const handleReceiveMap = (map) => {
      setActiveMap(map);
    };

    const handleTokenMove = ({ id, newPos, layer }) => {
      console.log("Received token move:", id, newPos, layer);
      setActiveMap((prev) => {
        if (!prev?.layers?.[layer]) return prev;

        const updatedTokens = prev.layers[layer].tokens.map((token) =>
          token.id === id ? { ...token, position: newPos } : token
        );

        return {
          ...prev,
          layers: {
            ...prev.layers,
            [layer]: {
              ...prev.layers[layer],
              tokens: updatedTokens,
            },
          },
        };
      });
    };

    socket.on("playerReceiveMap", handleReceiveMap);
    socket.on("playerReceiveTokenMove", handleTokenMove);

    return () => {
      socket.off("playerReceiveMap", handleReceiveMap);
      socket.off("playerReceiveTokenMove", handleTokenMove);
    };
  }, []);

  return (
    <div className={styles.playerView}>
      <PlayerToolbar onSelectCharacters={() => setShowCharacterPanel(true)} />

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
