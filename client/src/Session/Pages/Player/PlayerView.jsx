import PlayerToolbar from "../../Components/Player/PlayerToolbar";
import styles from "../../styles/PlayerView.module.css";

export default function PlayerView({ inviteCode }) {
  return (
    <div className={styles.playerView}>
      <PlayerToolbar />
      <div className={styles.info}>
        <h2>Welcome to the game!</h2>
        <p>
          You have joined the session with invite code:{" "}
          <strong>{inviteCode}</strong>
        </p>
        <p>Waiting for the DM to select a map...</p>
      </div>
    </div>
  );
}
