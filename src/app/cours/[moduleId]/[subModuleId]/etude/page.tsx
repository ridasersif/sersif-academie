"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import MusicPlayer from "@/components/MusicPlayer";
import { MECANIQUE_DU_POINT_CHAPTERS } from "@/modules/physique/mecanique-du-point-et-du-solide/mecanique-du-point/chapters";
import { ELECTROSTATIQUE_CHAPTERS } from "@/modules/physique/electricite/electrostatique/chapters";
import { ELECTROMAGNETISME_VIDE_CHAPTERS } from "@/modules/physique/electricite/electromagnetisme-dans-le-vide/chapters";
import { ELECTROMAGNETISME_MATIERE_CHAPTERS } from "@/modules/physique/electricite/electromagnetisme-dans-la-matiere/chapters";
import { ELECTRONIQUE_CHAPTERS } from "@/modules/physique/electricite/electronique/chapters";
import { 
  ArrowLeft, 
  BookOpen, 
  ChevronRight, 
  Menu, 
  X, 
  ChevronLeft,
  Layers
} from "lucide-react";
import { COURSES_DATA } from "@/data/courses";

// Helper function to synchronously compute active chapter index before 1st render
function getInitialChapterIndex(subModuleId: string, totalChapters: number): number {
  if (typeof window === "undefined") return 0;
  try {
    // 1. URL search parameter ?chap=X (1-indexed)
    const params = new URLSearchParams(window.location.search);
    const chapParam = params.get("chap");
    if (chapParam !== null) {
      const parsed = parseInt(chapParam, 10) - 1;
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalChapters) {
        return parsed;
      }
    }

    // 2. localStorage persistence
    const saved = localStorage.getItem(`sersif_active_chap_${subModuleId}`);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalChapters) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading saved chapter index:", err);
  }
  return 0;
}

export default function EtudePage({ params }: { params: Promise<{ moduleId: string; subModuleId: string }> }) {
  const resolvedParams = use(params);
  const { moduleId, subModuleId } = resolvedParams;

  const parentModule = COURSES_DATA[moduleId];
  const subModule = parentModule?.subModules?.find((s) => s.id === subModuleId);

  let chapters: any[] = [];
  if (subModuleId === "mecanique-du-point") {
    chapters = MECANIQUE_DU_POINT_CHAPTERS;
  } else if (subModuleId === "electrostatique") {
    chapters = ELECTROSTATIQUE_CHAPTERS;
  } else if (subModuleId === "electromagnetisme-dans-le-vide") {
    chapters = ELECTROMAGNETISME_VIDE_CHAPTERS;
  } else if (subModuleId === "electromagnetisme-dans-la-matiere") {
    chapters = ELECTROMAGNETISME_MATIERE_CHAPTERS;
  } else if (subModuleId === "electronique") {
    chapters = ELECTRONIQUE_CHAPTERS;
  }

  // Always initialize to 0 for SSR to avoid hydration mismatch
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync state changes to URL search params and localStorage
  const handleChapterChange = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= chapters.length) return;
    setActiveChapterIndex(newIndex);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`sersif_active_chap_${subModuleId}`, String(newIndex));
        const url = new URL(window.location.href);
        url.searchParams.set("chap", String(newIndex + 1));
        window.history.replaceState({}, "", url.toString());
      } catch (err) {
        console.error("Error saving chapter state:", err);
      }
    }
  };

  // Read from localStorage/URL after mount to avoid hydration errors
  useEffect(() => {
    setIsMounted(true);
    const initial = getInitialChapterIndex(subModuleId, chapters.length);
    if (initial !== 0) {
      setActiveChapterIndex(initial);
    }
  }, [subModuleId, chapters.length]);

  // Close mobile drawer when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!subModule) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Sous-module non trouvé</h2>
        <Link href="/physique" className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold text-xs">
          Retour aux modules
        </Link>
      </div>
    );
  }

  const currentChapter = chapters[activeChapterIndex] || chapters[0];
  const ChapterComponent = currentChapter?.component;

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 bg-background text-foreground relative w-full">
      
      {/* Top Header Workspace Navigation - Sticky Header (56px) */}
      <header className="w-full h-14 px-3 sm:px-6 flex justify-between items-center bg-background/95 backdrop-blur-md sticky top-0 z-50 border-b border-border/60 shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger Menu button for mobile/tablet (<1024px) */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-muted hover:bg-accent text-foreground transition-colors lg:hidden shrink-0"
            title="Menu chapitres"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link 
            href={`/cours/${moduleId}/${subModuleId}`}
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-xs font-semibold group shrink-0"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Retour</span>
          </Link>
          
          <span className="text-border/60 shrink-0">|</span>
          
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-foreground min-w-0 truncate">
            <span className="text-primary truncate max-w-[90px] sm:max-w-none">{subModule.title}</span>
            <span className="text-muted-foreground font-normal shrink-0">/</span>
            <span className="text-foreground truncate font-extrabold">Chap {currentChapter?.num}: {currentChapter?.title}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 ml-2">
          <MusicPlayer />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full relative items-start">
        
        {/* Dark Backdrop Overlay on Mobile/Tablet when sidebar drawer is open */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden animate-in fade-in duration-200"
          />
        )}

        {/* --- LEFT SIDEBAR (STICKY ON DESKTOP, DRAWER ON MOBILE) --- */}
        <aside 
          className={`
            fixed lg:sticky top-14 left-0 z-40
            w-72 sm:w-80 h-[calc(100vh-56px)] 
            bg-card border-r border-border/80 
            flex flex-col shrink-0 shadow-xl lg:shadow-none
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Sidebar Header */}
          <div className="p-3.5 border-b border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-foreground tracking-tight">Sommaire du Cours</h3>
                <p className="text-[10px] text-muted-foreground font-medium">{chapters.length} Chapitres</p>
              </div>
            </div>

            {/* Close button for Mobile/Tablet drawer */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground lg:hidden"
              title="Fermer le menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chapters List (Scrollable internally) */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
            {chapters.map((chap, idx) => {
              const isActive = idx === activeChapterIndex;
              return (
                <button
                  key={chap.id}
                  onClick={() => {
                    handleChapterChange(idx);
                    setSidebarOpen(false); // Auto close mobile drawer upon selection
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-2.5 border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm font-bold"
                      : "bg-background/50 hover:bg-muted/60 text-foreground border-border/30 hover:border-border/60"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                    isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}>
                    {chap.num}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold leading-tight truncate">
                      {chap.title}
                    </h4>
                  </div>

                  {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Progress */}
          <div className="p-3 border-t border-border/40 bg-muted/10 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
              <span className="text-muted-foreground">Progression</span>
              <span className="text-primary font-extrabold">{activeChapterIndex + 1} / {chapters.length}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((activeChapterIndex + 1) / chapters.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </aside>

        {/* --- MAIN WORKSPACE CONTENT AREA --- */}
        <main className="flex-1 p-3 sm:p-6 max-w-5xl mx-auto w-full min-w-0 flex flex-col justify-between min-h-[calc(100vh-56px)] overflow-x-hidden">
          
          <div className="w-full min-w-0">
            {/* Dynamic Render of Modular Chapter Component */}
            {ChapterComponent ? (
              <ChapterComponent />
            ) : (
              <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-8 shadow-sm min-h-[380px] flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                      Chapitre {currentChapter?.num}: {currentChapter?.title}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] sm:text-xs font-extrabold border border-primary/20">
                      {currentChapter?.subtitle}
                    </span>
                  </div>

                  <div className="py-12 text-center border-2 border-dashed border-border/60 rounded-xl bg-muted/20 px-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">
                      Espace de cours direct • {currentChapter?.title}
                    </h3>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">
                      Le composant modulaire pour ce chapitre est prêt à recevoir le cours et les visualisations 3D.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls: Previous / Next Chapter */}
          <div className="pt-5 my-5 border-t border-border/40 flex items-center justify-between gap-3">
            <button
              onClick={() => handleChapterChange(Math.max(0, activeChapterIndex - 1))}
              disabled={activeChapterIndex === 0}
              className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                activeChapterIndex === 0
                  ? "opacity-40 cursor-not-allowed bg-muted border-border/30 text-muted-foreground"
                  : "bg-card hover:bg-muted text-foreground border-border/80 cursor-pointer shadow-sm"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <button
              onClick={() => handleChapterChange(Math.min(chapters.length - 1, activeChapterIndex + 1))}
              disabled={activeChapterIndex === chapters.length - 1}
              className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all ${
                activeChapterIndex === chapters.length - 1
                  ? "opacity-40 cursor-not-allowed bg-muted border border-border/30 text-muted-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              }`}
            >
              <span>Suivant</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </main>

      </div>

    </div>
  );
}
