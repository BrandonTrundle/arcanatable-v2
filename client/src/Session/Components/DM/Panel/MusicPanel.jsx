import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import usePlaylists from "../../../Pages/DM/hooks/usePlaylists";
import styles from "../../../styles/MusicPanel.module.css";
import { getNextZIndex } from "../../../utils/zIndexManager";
import trackList from "../../../data/trackList";

export default function MusicPanel({ onPlayTrack, onClose }) {
  const { user, token } = useContext(AuthContext);
  const { playlists, createPlaylist, updatePlaylist, refresh } = usePlaylists(
    user?.id,
    token
  );

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 120, y: 120 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(getNextZIndex());

  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const selectedPlaylist = playlists.find((p) => p._id === selectedPlaylistId);

  const handleMouseDown = (e) => {
    setZIndex(getNextZIndex());
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  const handleAddToPlaylist = (track) => {
    if (!selectedPlaylist) return;
    const exists = selectedPlaylist.tracks.some((t) => t.id === track.id);
    if (exists) return;

    const updatedTracks = [...selectedPlaylist.tracks, track];
    updatePlaylist(selectedPlaylist._id, { tracks: updatedTracks });
  };

  const handleRemoveFromPlaylist = (trackId) => {
    if (!selectedPlaylist) return;
    const updatedTracks = selectedPlaylist.tracks.filter(
      (t) => t.id !== trackId
    );
    updatePlaylist(selectedPlaylist._id, { tracks: updatedTracks });
  };

  const handleCreatePlaylist = () => {
    const trimmed = newPlaylistName.trim();
    if (!trimmed) return;
    createPlaylist(trimmed);
    setNewPlaylistName("");
  };

  return (
    <div
      className={styles.panel}
      style={{ left: position.x, top: position.y, zIndex }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.header} onMouseDown={handleMouseDown}>
        <span>Music Library</span>
        <div className={styles.controls}>
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? "+" : "-"}
          </button>
          <button onClick={onClose}>×</button>
        </div>
      </div>

      {!isCollapsed && (
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <h4>Playlists</h4>
            <select
              className={styles.playlistDropdown}
              value={selectedPlaylistId || ""}
              onChange={(e) => setSelectedPlaylistId(e.target.value)}
            >
              <option value="" disabled>
                Select a playlist
              </option>
              {playlists.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className={styles.newPlaylist}>
              <input
                type="text"
                placeholder="New playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
              />
              <button onClick={handleCreatePlaylist}>Create</button>
            </div>
          </div>

          <div className={styles.trackList}>
            {selectedPlaylist && (
              <div className={styles.playlistTracks}>
                <h4>{selectedPlaylist.name} Contents</h4>
                {selectedPlaylist?.tracks.length > 0 && (
                  <button
                    className={styles.playlistPlayButton}
                    onClick={() =>
                      onPlayTrack(selectedPlaylist.tracks, { isPlaylist: true })
                    }
                  >
                    ▶ Play Playlist
                  </button>
                )}
                {selectedPlaylist.tracks.length === 0 ? (
                  <p>This playlist has no tracks yet.</p>
                ) : (
                  selectedPlaylist.tracks.map((track) => (
                    <div key={track.id} className={styles.track}>
                      <span>{track.name}</span>
                      <div className={styles.trackActions}>
                        <button onClick={() => onPlayTrack(track)}>▶</button>
                        <button
                          onClick={() => handleRemoveFromPlaylist(track.id)}
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <hr />
              </div>
            )}

            <h4>Track Library</h4>
            {trackList.map((track) => (
              <div key={track.id} className={styles.track}>
                <span>{track.name}</span>
                <div className={styles.trackActions}>
                  <button onClick={() => onPlayTrack(track)}>▶</button>
                  {selectedPlaylist && (
                    <button onClick={() => handleAddToPlaylist(track)}>
                      ➕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
