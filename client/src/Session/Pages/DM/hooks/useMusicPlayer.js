import { useEffect, useRef, useState } from "react";

export default function useMusicPlayer() {
  const audioRef = useRef(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [loop, setLoop] = useState(false);
  const [playlistQueue, setPlaylistQueue] = useState([]);
  const [playlistIndex, setPlaylistIndex] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (loop) {
        // If playlist is active and loop is on, repeat the playlist
        if (playlistQueue.length > 0) {
          const currentIndex = playlistQueue.findIndex(
            (t) => t.id === currentTrack?.id
          );
          const nextIndex = currentIndex + 1;

          if (nextIndex < playlistQueue.length) {
            playTrack(playlistQueue[nextIndex]);
            setPlaylistIndex(nextIndex);
          } else {
            // Restart from beginning
            playTrack(playlistQueue[0]);
            setPlaylistIndex(0);
          }
        } else {
          // Looping a standalone track
          audio.play();
        }
        return;
      }

      // If not looping
      if (playlistQueue.length > 0) {
        const currentIndex = playlistQueue.findIndex(
          (t) => t.id === currentTrack?.id
        );
        const nextTrack = playlistQueue[currentIndex + 1];
        if (nextTrack) {
          playTrack(nextTrack);
          setPlaylistIndex(currentIndex + 1);
        } else {
          setPlaylistQueue([]);
          setPlaylistIndex(null);
        }
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [loop, playlistQueue, currentTrack]);

  const playPlaylist = (tracks) => {
    if (!tracks || tracks.length === 0) return;
    setPlaylistQueue(tracks);
    setPlaylistIndex(0);
    playTrack(tracks[0]);
  };

  const playTrack = (track) => {
    if (!track || !audioRef.current) return;
    audioRef.current.src = track.url;
    audioRef.current.play();
    setCurrentTrack(track);

    // Sync index if in a playlist
    const indexInQueue = playlistQueue.findIndex((t) => t.id === track.id);
    if (indexInQueue !== -1) {
      setPlaylistIndex(indexInQueue);
    } else {
      setPlaylistIndex(null); // standalone track
    }

    setIsPlaying(true);
  };

  const playQueue = (trackList, startIndex = 0) => {
    setQueue(trackList);
    setCurrentTrackIndex(startIndex);
    playTrack(trackList[startIndex]);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    audioRef.current.play();
    setIsPlaying(true);
  };

  const skipToNext = () => {
    if (
      playlistQueue.length > 0 &&
      playlistIndex !== null &&
      playlistIndex + 1 < playlistQueue.length
    ) {
      const nextTrack = playlistQueue[playlistIndex + 1];
      setPlaylistIndex(playlistIndex + 1);
      playTrack(nextTrack);
    }
  };

  const skipToPrevious = () => {
    if (
      playlistQueue.length > 0 &&
      playlistIndex !== null &&
      playlistIndex > 0
    ) {
      const prevTrack = playlistQueue[playlistIndex - 1];
      setPlaylistIndex(playlistIndex - 1);
      playTrack(prevTrack);
    }
  };

  const updateVolume = (value) => {
    setVolume(value);
    audioRef.current.volume = value;
  };

  return {
    currentTrack,
    isPlaying,
    playTrack,
    playQueue,
    pause,
    resume,
    skipToNext,
    skipToPrevious,
    volume,
    updateVolume,
    loop,
    setLoop,
    playPlaylist,
  };
}
