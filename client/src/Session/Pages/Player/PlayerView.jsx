import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import PlayerToolbar from "../../Components/Player/PlayerToolbar";
import PlayerMapCanvas from "./PlayerMapCanvas";
import styles from "../../styles/PlayerView.module.css";
import socket from "../../../socket";

export default function PlayerView({ inviteCode }) {
  const { user } = useContext(AuthContext);
  const [campaign, setCampaign] = useState(null);
  const [maps, setMaps] = useState([]);
  const [activeMap, setActiveMap] = useState(null);
  const [fogVisible, setFogVisible] = useState(false);

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

    socket.on("playerReceiveMap", handleReceiveMap);

    return () => {
      socket.off("playerReceiveMap", handleReceiveMap);
    };
  }, []);

  return (
    <div className={styles.playerView}>
      <PlayerToolbar />
      {activeMap ? (
        <PlayerMapCanvas map={activeMap} fogVisible={fogVisible} />
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
    </div>
  );
}
