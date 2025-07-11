import { useEffect } from "react";
import socket from "../../../../socket";

export default function useMusicSocketHandlers(music, musicConsent) {
  useEffect(() => {
    const handleDMPlayTrack = ({ track }) => {
      if (musicConsent === null) {
        const wantsMusic = window.confirm(
          "The DM wants to play music for the session. Would you like to hear it?"
        );
        localStorage.setItem("musicConsent", wantsMusic ? "true" : "false");
        if (!wantsMusic) return;
      }

      if (
        musicConsent === true ||
        localStorage.getItem("musicConsent") === "true"
      ) {
        music.playTrack(track);
      }
    };

    const handleDMPlayPlaylist = ({ tracks }) => {
      const stored = localStorage.getItem("musicConsent");
      if (stored === null) {
        const wantsMusic = window.confirm(
          "The DM wants to play a playlist. Would you like to hear it?"
        );
        localStorage.setItem("musicConsent", wantsMusic ? "true" : "false");
        if (!wantsMusic) return;
      }

      if (localStorage.getItem("musicConsent") === "true") {
        music.playPlaylist(tracks);
      }
    };

    const handleDMPauseTrack = () => {
      if (localStorage.getItem("musicConsent") === "true") {
        import("../../../Pages/DM/hooks/useMusicPlayer").then((mod) => {
          mod.default().pause();
        });
      }
    };

    const handleDMResumeTrack = () => {
      if (localStorage.getItem("musicConsent") === "true") {
        import("../../../Pages/DM/hooks/useMusicPlayer").then((mod) => {
          mod.default().resume();
        });
      }
    };

    const handleDMSkipNextTrack = () => {
      if (localStorage.getItem("musicConsent") === "true") {
        import("../../../Pages/DM/hooks/useMusicPlayer").then((mod) => {
          mod.default().skipToNext();
        });
      }
    };

    const handleDMSkipPrevTrack = () => {
      if (localStorage.getItem("musicConsent") === "true") {
        import("../../../Pages/DM/hooks/useMusicPlayer").then((mod) => {
          mod.default().skipToPrevious();
        });
      }
    };

    const handleDMToggleLoop = ({ loop }) => {
      if (localStorage.getItem("musicConsent") === "true") {
        import("../../../Pages/DM/hooks/useMusicPlayer").then((mod) => {
          mod.default().setLoop(loop);
        });
      }
    };

    socket.on("dmPlayTrack", handleDMPlayTrack);
    socket.on("dmPlayPlaylist", handleDMPlayPlaylist);
    socket.on("dmPauseTrack", handleDMPauseTrack);
    socket.on("dmResumeTrack", handleDMResumeTrack);
    socket.on("dmSkipNextTrack", handleDMSkipNextTrack);
    socket.on("dmSkipPrevTrack", handleDMSkipPrevTrack);
    socket.on("dmToggleLoop", handleDMToggleLoop);

    return () => {
      socket.off("dmPlayTrack", handleDMPlayTrack);
      socket.off("dmPlayPlaylist", handleDMPlayPlaylist);
      socket.off("dmPauseTrack", handleDMPauseTrack);
      socket.off("dmResumeTrack", handleDMResumeTrack);
      socket.off("dmSkipNextTrack", handleDMSkipNextTrack);
      socket.off("dmSkipPrevTrack", handleDMSkipPrevTrack);
      socket.off("dmToggleLoop", handleDMToggleLoop);
    };
  }, [music, musicConsent]);
}
