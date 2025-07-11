import { useCallback } from "react";
import socket from "../../../../socket";
import { useDMChatEmitter } from "./useDMSocketEvents";

export default function useDMViewHandlers({
  user,
  sessionCode,
  setChatMessages,
  music,
  setShowNowPlaying,
  setShowTokenPanel,
  setSelectedTokenId,
  setActiveTurnTokenId,
}) {
  const sendChatMessage = useDMChatEmitter(sessionCode);

  const handleSendMessage = useCallback(
    (message) => {
      const fullMessage = {
        sender: message.sender || user?.username || "DM",
        text: message.text,
        image: message.image || null,
        senderId: user?.id,
      };

      if (message._local) {
        setChatMessages((prev) => [...prev, fullMessage]);
      } else {
        setChatMessages((prev) => [...prev, fullMessage]);
        sendChatMessage(fullMessage);
      }
    },
    [user, setChatMessages, sendChatMessage]
  );

  const toggleTokenPanel = useCallback(() => {
    setShowTokenPanel((prev) => !prev);
  }, [setShowTokenPanel]);

  const handleDMPlayTrack = useCallback(
    (track) => {
      music.playTrack(track);
      if (sessionCode) {
        socket.emit("dmPlayTrack", { sessionCode, track });
      }
    },
    [music, sessionCode]
  );

  const handleToggleCombat = useCallback(() => {
    const next = (prev) => {
      const result = !prev;
      if (!result) {
        setSelectedTokenId("");
        setActiveTurnTokenId(null);
        socket.emit("activeTurnChanged", {
          sessionCode,
          tokenId: null,
        });
      }
      return result;
    };
    return next;
  }, [setSelectedTokenId, setActiveTurnTokenId, sessionCode]);

  const handlePlayMusicPanel = useCallback(
    (input, options = {}) => {
      if (options.isPlaylist && Array.isArray(input)) {
        music.playPlaylist(input);
        socket.emit("dmPlayPlaylist", {
          sessionCode,
          tracks: input,
        });
      } else {
        music.playTrack(input);
        socket.emit("dmPlayTrack", {
          sessionCode,
          track: input,
        });
      }

      setShowNowPlaying(true);
    },
    [music, sessionCode, setShowNowPlaying]
  );

  return {
    handleSendMessage,
    toggleTokenPanel,
    handleDMPlayTrack,
    handleToggleCombat,
    handlePlayMusicPanel,
  };
}
