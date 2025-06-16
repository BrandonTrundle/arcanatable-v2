import { useParams } from "react-router-dom";
import DMView from "./DM/DMView";
import PlayerView from "./Player/PlayerView";
import styles from "../../Session/styles/SessionRoom.module.css";

export default function SessionRoom() {
  const { code, role } = useParams();

  if (!code || !role) {
    return <div className={styles.error}>Invalid session URL.</div>;
  }

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
