import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function usePlaylists(userId, incomingToken) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fallback to localStorage if token isn't passed
  const token = incomingToken || localStorage.getItem("token");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchPlaylists = async () => {
    if (!token) {
      console.warn("⚠️ No token found — skipping playlist fetch.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/playlists`, {
        headers: authHeaders,
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("❌ Playlist fetch failed:", error);
        return;
      }

      const data = await res.json();
      setPlaylists(data);
    } catch (err) {
      console.error("❌ Error fetching playlists:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPlaylist = async (name) => {
    if (!token) {
      console.warn("⚠️ No token — cannot create playlist.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/playlists`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ name, tracks: [] }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("❌ Playlist creation failed:", error);
        return;
      }

      const data = await res.json();
      setPlaylists((prev) => [...prev, data]);
    } catch (err) {
      console.error("❌ Error creating playlist:", err);
    }
  };

  const updatePlaylist = async (id, updates) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/playlists/${id}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      setPlaylists((prev) => prev.map((p) => (p._id === id ? data : p)));
    } catch (err) {
      console.error("❌ Failed to update playlist:", err);
    }
  };

  const deletePlaylist = async (id) => {
    if (!token) return;

    try {
      await fetch(`${API_BASE}/api/playlists/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      setPlaylists((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete playlist:", err);
    }
  };

  useEffect(() => {
    if (userId && token) {
      console.log("🎵 Fetching playlists with token:", token);
      fetchPlaylists();
    }
  }, [userId, token]);

  return {
    playlists,
    loading,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    refresh: fetchPlaylists,
  };
}
