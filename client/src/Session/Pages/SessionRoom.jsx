import { useParams } from "react-router-dom";
import React, { useEffect, useContext } from "react";
import DMView from "./DM/DMView";
import PlayerView from "./Player/PlayerView";
import styles from "../../Session/styles/SessionRoom.module.css";
import socket from "../../socket";
import { AuthContext } from "../../context/AuthContext";

export default function SessionRoom() {
  const { code, role } = useParams();
  const { user } = useContext(AuthContext);

  if (!code || !role) {
    return <div className={styles.error}>Invalid session URL.</div>;
  }

  useEffect(() => {
    if (user?.id) {
      socket.emit("joinSession", { sessionCode: code, userId: user.id });
    }
  }, [code, user?.id]);

  return (
    <div className={styles.sessionRoom}>
      {role === "dm" ? (
        <DMView sessionCode={code} />
      ) : (
        <PlayerView inviteCode={code} />
      )}
    </div>
  );
}
