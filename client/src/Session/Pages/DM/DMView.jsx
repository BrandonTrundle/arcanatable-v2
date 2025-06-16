import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "../../styles/DMView.module.css";
import MapsPanel from "../../Components/DM/Panel/MapsPanel";
import DMMapCanvas from "./DMMapCanvas";
import DMToolbar from "../../Components/DM/DMToolbar";

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
          `${import.meta.env.VITE_API_BASE_URL}/api/sessions/${sessionCode}`,
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

        console.log("Fetching maps for campaign:", campaignId);
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
      } catch (err) {
        console.error("Error loading session data:", err);
      }
    };

    if (sessionCode && user?.token) {
      fetchSessionAndData();
    }
  }, [sessionCode, user]);

  const handleLoadMap = () => {
    const map = maps.find((m) => m._id === selectedMapId);
    setActiveMap(map);
  };

  const toggleMapsPanel = () => {
    setShowMapsPanel((prev) => !prev);
  };

  return (
    <div className={styles.dmView}>
      <DMToolbar
        onToggleMaps={toggleMapsPanel}
        isMapsPanelOpen={showMapsPanel}
      />
      {showMapsPanel && (
        <MapsPanel
          maps={maps}
          selectedMapId={selectedMapId}
          setSelectedMapId={setSelectedMapId}
          onLoadMap={(map) => setActiveMap(map)}
        />
      )}
      <DMMapCanvas
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
        onSelectToken={() => {}}
      />
    </div>
  );
}
