"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import MusicPlayer from "@/components/MusicPlayer";
import Chapter1MathRefresher from "@/components/lessons/mecanique-du-point/Chapter1MathRefresher";
import Chapter2Cinematique from "@/components/lessons/mecanique-du-point/Chapter2Cinematique";
import { 
  ArrowLeft, 
  BookOpen, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Menu, 
  X, 
  ChevronLeft,
  GraduationCap,
  Layers
} from "lucide-react";
import { COURSES_DATA } from "@/data/courses";

interface Chapter {
  id: string;
  num: string;
  title: string;
  subtitle: string;
}

export default function EtudePage({ params }: { params: Promise<{ moduleId: string; subModuleId: string }> }) {
  const resolvedParams = use(params);
  const { moduleId, subModuleId } = resolvedParams;

  const parentModule = COURSES_DATA[moduleId];
  const subModule = parentModule?.subModules?.find((s) => s.id === subModuleId);

  // Chapters list for Mécanique du Point
  const chapters: Chapter[] = [
    {
      id: "chap-1",
      num: "01",
      title: "Rappels Mathématiques",
      subtitle: "Vecteurs, dérivation & systèmes de coordonnées"
    },
    {
      id: "chap-2",
      num: "02",
      title: "Cinématique du Point",
      subtitle: "Position, vitesse, accélération & Frenet"
    },
    {
      id: "chap-3",
      num: "03",
      title: "Dynamique du Point",
      subtitle: "Principes fondamentaux (PFD)"
    },
    {
      id: "chap-4",
      num: "04",
      title: "Travail et Énergie",
      subtitle: "Théorème de l'énergie cinétique"
    },
    {
      id: "chap-5",
      num: "05",
      title: "Oscillateurs Harmoniques",
      subtitle: "Oscillations libres, amorties & résonance"
    },
    {
      id: "chap-6",
      num: "06",
      title: "Forces Centrales",
      subtitle: "Planètes, Kepler & vitesses cosmiques"
    },
    {
      id: "chap-7",
      num: "07",
      title: "Chocs et Collisions",
      subtitle: "Chocs élastiques & inélastiques"
    }
  ];

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const currentChapter = chapters[activeChapterIndex];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 bg-background text-foreground relative">
      
      {/* Top Header Workspace Navigation */}
      <header className="w-full px-4 sm:px-6 py-3 flex justify-between items-center bg-background/95 backdrop-blur-md sticky top-0 z-50 border-b border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-muted hover:bg-accent text-foreground transition-colors md:hidden"
            title="Menu chapitres"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link 
            href={`/cours/${moduleId}/${subModuleId}`}
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-xs font-semibold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Retour</span>
          </Link>
          
          <span className="text-border/60">|</span>
          
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <span className="text-primary truncate max-w-[100px] sm:max-w-none">{subModule.title}</span>
            <span className="text-muted-foreground font-normal">/</span>
            <span className="text-foreground truncate font-extrabold">Chapitre {currentChapter.num}: {currentChapter.title}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <MusicPlayer />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full relative">
        
        {/* --- LEFT SIDEBAR: STICKY CHAPTERS NAVIGATION --- */}
        <aside 
          className={`w-60 sm:w-64 bg-card/95 backdrop-blur-md border-r border-border/60 flex flex-col justify-between shrink-0 sticky top-[57px] h-[calc(100vh-57px)] z-30 transition-all duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-3.5 border-b border-border/40 flex items-center justify-between bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
                <Layers className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-foreground tracking-tight">Sommaire du Cours</h3>
                <p className="text-[10px] text-muted-foreground font-medium">{chapters.length} Chapitres</p>
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5 custom-scrollbar">
            {chapters.map((chap, idx) => {
              const isActive = idx === activeChapterIndex;
              return (
                <button
                  key={chap.id}
                  onClick={() => {
                    setActiveChapterIndex(idx);
                    if (window.innerWidth < 768) setSidebarOpen(false);
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
          <div className="p-3 border-t border-border/40 bg-muted/10">
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
        <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full flex flex-col justify-between min-h-[calc(100vh-57px)]">
          
          <div>
            {/* Dynamic Render of Modular Chapter Files */}
            {activeChapterIndex === 0 && <Chapter1MathRefresher />}
            {activeChapterIndex === 1 && <Chapter2Cinematique />}
            {activeChapterIndex > 1 && (
              <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm min-h-[420px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-foreground tracking-tight">
                      Chapitre {currentChapter.num}: {currentChapter.title}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-extrabold border border-primary/20">
                      {currentChapter.subtitle}
                    </span>
                  </div>

                  <div className="py-12 text-center border-2 border-dashed border-border/60 rounded-xl bg-muted/20">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-1">
                      Espace de cours direct • {currentChapter.title}
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
          <div className="pt-6 my-6 border-t border-border/40 flex items-center justify-between gap-4">
            <button
              onClick={() => setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))}
              disabled={activeChapterIndex === 0}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                activeChapterIndex === 0
                  ? "opacity-40 cursor-not-allowed bg-muted border-border/30 text-muted-foreground"
                  : "bg-card hover:bg-muted text-foreground border-border/80 cursor-pointer shadow-sm"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>

            <button
              onClick={() => setActiveChapterIndex(Math.min(chapters.length - 1, activeChapterIndex + 1))}
              disabled={activeChapterIndex === chapters.length - 1}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
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
