"use client";

import { useState } from "react";
import { Play, Pause, SkipForward, ListMusic } from "lucide-react";
import { useAudio, PLAYLIST } from "@/context/AudioContext";

export default function MusicPlayer() {
  const { isPlaying, currentIndex, currentTrack, togglePlay, nextTrack, selectTrack } = useAudio();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelectTrack = (idx: number) => {
    selectTrack(idx);
    setShowDropdown(false);
  };

  return (
    <div className="relative flex items-center gap-1.5 z-50">
      {/* Main Play/Pause Button */}
      <button
        onClick={togglePlay}
        title={isPlaying ? "Pause" : "Lecture"}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border shadow-sm ${
          isPlaying
            ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/40 shadow-emerald-500/10"
            : "bg-muted/70 text-muted-foreground border-border/70 hover:text-foreground hover:bg-accent/70"
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-current text-emerald-500" />
            <span className="hidden sm:inline font-bold max-w-[110px] truncate">
              {currentTrack.title}
            </span>
            
            {/* Animated Equalizer */}
            <div className="flex items-end gap-0.5 h-3 ml-0.5">
              <span className="w-0.5 h-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0.1s" }}></span>
              <span className="w-0.5 h-2/3 bg-emerald-500 animate-bounce" style={{ animationDelay: "0.3s" }}></span>
              <span className="w-0.5 h-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            </div>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline font-semibold">Musique calme</span>
          </>
        )}
      </button>

      {/* Skip Next Track Button */}
      <button
        onClick={nextTrack}
        title="Morceau suivant"
        className="p-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-accent/70 border border-border/60 transition-colors"
      >
        <SkipForward className="w-3.5 h-3.5" />
      </button>

      {/* Playlist Selector Dropdown Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        title="Liste des morceaux"
        className="p-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-accent/70 border border-border/60 transition-colors"
      >
        <ListMusic className="w-3.5 h-3.5" />
      </button>

      {/* Dropdown Menu Popup */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-60 bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-1.5 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider border-b border-border/40 mb-1">
            Playlist ({PLAYLIST.length} morceaux)
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto">
            {PLAYLIST.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(idx)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                  idx === currentIndex
                    ? "bg-emerald-500/15 text-emerald-500 font-bold"
                    : "text-foreground hover:bg-accent/60"
                }`}
              >
                <div className="truncate pr-2">
                  <div className="font-bold truncate">{track.title}</div>
                  <div className="text-[10px] text-muted-foreground font-normal truncate">
                    {track.subtitle}
                  </div>
                </div>

                {idx === currentIndex && isPlaying && (
                  <span className="flex h-2 w-2 relative shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
