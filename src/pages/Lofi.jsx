import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Info, SkipForward, Check } from 'lucide-react';

const shuffleSongs = (songs) => songs.sort(() => Math.random() - 0.5);

const LofiPlayerComponent = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState(null);
  const [copied, setCopied] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    // Load the songs from map.json dynamically
    const loadSongs = async () => {
      try {
        const response = await fetch('https://ehxuban11.github.io/yawningStudioTools/lofi/map.json');
        const data = await response.json();
        const songList = Object.values(data.songs);
        const shuffledSongs = shuffleSongs(songList);
        setPlaylist(shuffledSongs);
        setCurrentSong(shuffledSongs[0]);
        audioRef.current = new Audio(shuffledSongs[0]);
      } catch (error) {
        console.error('Failed to load songs:', error);
      }
    };

    loadSongs();
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = volume / 100;

    const handleSongEnd = () => {
      playNextSong();
    };

    audioRef.current.addEventListener('ended', handleSongEnd);

    return () => {
      audioRef.current.removeEventListener('ended', handleSongEnd);
    };
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.src = currentSong;

    if (isPlaying) {
      audioRef.current.play().catch((error) => console.error('Play error:', error));
    }
  }, [currentSong]);

  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => console.error('Play error:', error));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = () => {
    if (!audioRef.current) return;

    setIsMuted((prev) => {
      audioRef.current.muted = !prev;
      return !prev;
    });
  };

  const handleVolumeChange = (event) => {
    const newValue = event.target.value;
    setVolume(newValue);
    if (audioRef.current) {
      audioRef.current.volume = newValue / 100;
    }
    if (newValue === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const playNextSong = () => {
    if (!playlist.length) return;
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(playlist[nextIndex]);
  };

  const copyAttribution = () => {
    if (!currentSong) return;
    const attribution = currentSong.split('/').pop().replace(/_/g, ' ').replace('.mp3', '');
    navigator.clipboard.writeText(attribution).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className="flex items-start justify-center h-screen bg-gray-900 px-4"
      style={{
        overflow: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      <div className="relative inline-block p-1 rounded-[20px] mt-10 bg-[#1F2937]">
        <div className="bg-[#1F2937] text-[#e5e7eb] rounded-[20px] p-5 flex flex-col items-center gap-4 w-full max-w-[400px]">
          <h1 className="text-3xl font-bold text-[#ebb305]">Lofi Player 🎧</h1>

          <button
            onClick={togglePlayPause}
            className="p-2 bg-[#ebb305] text-[#101827] rounded-full shadow-md"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <div className="flex items-center gap-4 w-full justify-center">
            <button onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-32 cursor-pointer"
            />

            <button onClick={playNextSong}>
              <SkipForward size={24} />
            </button>
          </div>

          <button
            onClick={copyAttribution}
            className="flex items-center gap-1 text-xs text-gray-400 cursor-pointer"
          >
            <Info size={14} /> {copied ? <span className="text-green-400 flex items-center gap-1">Copied! <Check size={14} /></span> : 'Copy Attribution'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LofiPlayerComponent;
