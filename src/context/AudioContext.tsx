"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

export interface Track {
  id: string;
  title: string;
  subtitle: string;
  src: string;
}

export const PLAYLIST: Track[] = [
  {
    id: "study-music",
    title: "Rahat Al-Aasab",
    subtitle: "Focus & Sérénité",
    src: "/audio/study-music.mp3",
  },
  {
    id: "emerald-nights",
    title: "Emerald Nights",
    subtitle: "Oud & Warm Strings",
    src: "/audio/emerald-nights.mp3",
  },
  {
    id: "cheb-hasni-instrumental",
    title: "Cheb Hasni Instrumental",
    subtitle: "Mousiqa Samita - Tarik Tawil",
    src: "/audio/cheb-hasni-instrumental.mp3",
  },
];

interface AudioContextType {
  isPlaying: boolean;
  currentIndex: number;
  currentTrack: Track;
  togglePlay: () => void;
  nextTrack: () => void;
  selectTrack: (index: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = PLAYLIST[currentIndex];

  // Initialize single global persistent audio element
  useEffect(() => {
    const audio = new Audio(currentTrack.src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Handle track change smoothly without stopping if currently playing
  useEffect(() => {
    if (!audioRef.current) return;

    const wasPlaying = isPlaying;
    audioRef.current.pause();
    audioRef.current.src = currentTrack.src;
    audioRef.current.load();

    if (wasPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [currentIndex]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Global Audio playback error:", error);
      }
    }
  };

  const nextTrack = () => {
    const nextIdx = (currentIndex + 1) % PLAYLIST.length;
    setCurrentIndex(nextIdx);
  };

  const selectTrack = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentIndex,
        currentTrack,
        togglePlay,
        nextTrack,
        selectTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
