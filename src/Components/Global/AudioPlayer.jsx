"use client";
import React, { useRef, useState } from "react";
import { FiPlay, FiPause, FiStop, FiVolume2 } from "react-icons/fi";

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setProgress(0);
    setIsPlaying(false);
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg bg-gray-100 w-full">
      {/* Play/Pause Button */}
      <button onClick={togglePlay} className="text-2xl text-blue-600">
        {isPlaying ? <FiPause /> : <FiPlay />}
      </button>

      {/* Stop Button */}
      <button onClick={stopAudio} className="text-2xl text-red-600">
        <FiStop />
      </button>

      {/* Progress Bar */}
      <input
        type="range"
        value={progress}
        onChange={handleProgressChange}
        className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
      />

      {/* Volume Control */}
      <FiVolume2 className="text-xl text-gray-600" />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
        className="w-20 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
      />

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={updateProgress}
        onEnded={stopAudio}
      />
    </div>
  );
};

export default AudioPlayer;
