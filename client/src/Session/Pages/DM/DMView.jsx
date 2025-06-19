import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../styles/DMView.module.css";
import MapsPanel from "../../Components/DM/Panel/MapsPanel";
import DMMapCanvas from "./DMMapCanvas";
import DMToolbar from "../../Components/DM/DMToolbar";
import socket from "../../../socket";

export default function DMView({ sessionCode }) {
  const { user } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(null);
  const [maps, setMaps] = useState([]);
  const [selectedMapId, setSelectedMapId] = useState(null);
  const [activeMap, setActiveMap] = useState(null);
  const [showMapsPanel, setShowMapsPanel] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [fogVisible, setFogVisible] = useState(false);
  const [toolMode, setToolMode] = useState(null);
  const [activeLayer, setActiveLayer] = useState("dm");
  const [activeNoteCell, setActiveNoteCell] = useState(null);
  const [selectedNoteCell, setSelectedNoteCell] = useState(null);

  useEffect(() => {
    const fetchSessionAndData = async () => {
      try {
        const token = user.token;

        const sessionRes = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/sessions/by-code/${sessionCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const sessionData = await sessionRes.json();
        const campaignId = sessionData.session.campaignId;

        const campaignRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/campaigns/${campaignId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const campaignData = await campaignRes.json();
        setCampaign(campaignData.campaign);

        //  console.log("Fetching maps for campaign:", campaignId);
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
        console.log(mapData);

        if (sessionData.session.currentMapId) {
          const active = mapData.find(
            (m) => m._id === sessionData.session.currentMapId
          );
          if (active) setActiveMap(active);
        }
      } catch (err) {
        console.error("Error loading session data:", err);
      }
    };

    if (sessionCode && user?.token) {
      fetchSessionAndData();
    }
  }, [sessionCode, user]);

  useEffect(() => {
    if (sessionCode) {
      socket.emit("joinSession", { sessionCode });
    }
  }, [sessionCode]);

  const handleLoadMap = async () => {
    const map = maps.find((m) => m._id === selectedMapId);
    if (!map) return;

    setActiveMap(map);

    // Emit the map to players
    socket.emit("dmLoadMap", { sessionCode, map });

    // Persist the map as the current map for the session
    try {
      await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/sessions/${sessionCode}/set-active-map`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ mapId: selectedMapId }),
        }
      );
    } catch (error) {
      console.error("Failed to set current map:", error);
    }
  };

  const toggleMapsPanel = () => {
    setShowMapsPanel((prev) => !prev);
  };

  useEffect(() => {
    function handlePlayerDropToken({ mapId, token }) {
      setActiveMap((prev) => {
        if (!prev || prev._id !== mapId) return prev;

        const playerLayer = prev.layers.player || { tokens: [], assets: [] };
        const updatedTokens = [...(playerLayer.tokens || []), token];

        return {
          ...prev,
          layers: {
            ...prev.layers,
            player: {
              ...playerLayer,
              tokens: updatedTokens,
            },
          },
        };
      });
    }

    function handleTokenDelete({ tokenId, layer }) {
      setActiveMap((prev) => {
        if (!prev?.layers?.[layer]) return prev;
        const updatedTokens = prev.layers[layer].tokens.filter(
          (t) => t.id !== tokenId
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
    }

    socket.on("playerDropToken", handlePlayerDropToken);
    socket.on("playerReceiveTokenDelete", handleTokenDelete);

    return () => {
      socket.off("playerDropToken", handlePlayerDropToken);
      socket.off("playerReceiveTokenDelete", handleTokenDelete);
    };
  }, []);

  const handleToolSelect = (tool) => {
    //    console.log("Tool selected:", tool);
    setToolMode(tool);
  };

  useEffect(() => {
    const handlePlayerTokenMove = ({ id, newPos, layer }) => {
      console.log(
        "[DM] Received player token move:",
        id,
        newPos,
        "on layer",
        layer
      );
      setActiveMap((prevMap) => {
        const updatedTokens = prevMap.layers[layer].tokens.map((token) =>
          token.id === id ? { ...token, position: newPos } : token
        );
        return {
          ...prevMap,
          layers: {
            ...prevMap.layers,
            [layer]: {
              ...prevMap.layers[layer],
              tokens: updatedTokens,
            },
          },
        };
      });
    };

    socket.on("playerReceiveTokenMove", handlePlayerTokenMove);
    return () => socket.off("playerReceiveTokenMove", handlePlayerTokenMove);
  }, []);

  return (
    <div className={styles.dmView}>
      <DMToolbar
        onToggleMaps={toggleMapsPanel}
        isMapsPanelOpen={showMapsPanel}
        onSelectTool={handleToolSelect}
        currentTool={toolMode}
      />
      {showMapsPanel && (
        <MapsPanel
          maps={maps}
          selectedMapId={selectedMapId}
          setSelectedMapId={setSelectedMapId}
          onLoadMap={(map) => setActiveMap(map)}
          onClosePanel={() => setShowMapsPanel(false)}
          sessionCode={sessionCode}
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
    </div>
  );
}
