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
  const [toolMode, setToolMode] = useState(null);

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

    const handleTokenOwnershipChange = ({ tokenId, newOwnerIds }) => {
      setActiveMap((prev) => {
        if (!prev) return prev;

        const layerKey = Object.entries(prev.layers).find(([_, l]) =>
          (l.tokens || []).some((t) => t.id === tokenId)
        )?.[0];

        if (!layerKey) return prev;

        const updatedTokens = prev.layers[layerKey].tokens.map((t) =>
          t.id === tokenId ? { ...t, ownerIds: newOwnerIds } : t
        );

        return {
          ...prev,
          layers: {
            ...prev.layers,
            [layerKey]: {
              ...prev.layers[layerKey],
              tokens: updatedTokens,
            },
          },
        };
      });
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

    const handleTokenLayerChange = ({ tokenId, fromLayer, toLayer }) => {
      setActiveMap((prev) => {
        if (!prev?.layers?.[fromLayer] || !prev.layers[toLayer]) return prev;

        const token = prev.layers[fromLayer].tokens.find(
          (t) => t.id === tokenId
        );
        if (!token) return prev;

        const fromTokens = prev.layers[fromLayer].tokens.filter(
          (t) => t.id !== tokenId
        );
        const toTokens = [...(prev.layers[toLayer].tokens || []), token];

        return {
          ...prev,
          layers: {
            ...prev.layers,
            [fromLayer]: { ...prev.layers[fromLayer], tokens: fromTokens },
            [toLayer]: { ...prev.layers[toLayer], tokens: toTokens },
          },
        };
      });
    };

    socket.on("playerReceiveMap", handleReceiveMap);
    socket.on("playerReceiveTokenOwnershipChange", handleTokenOwnershipChange);
    socket.on("playerReceiveTokenMove", handleTokenMove);
    socket.on("playerReceiveTokenLayerChange", handleTokenLayerChange);

    return () => {
      socket.off("playerReceiveMap", handleReceiveMap);
      socket.off(
        "playerReceiveTokenOwnershipChange",
        handleTokenOwnershipChange
      );
      socket.off("playerReceiveTokenMove", handleTokenMove);
      socket.off("playerReceiveTokenLayerChange", handleTokenLayerChange);
    };
  }, []);

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
