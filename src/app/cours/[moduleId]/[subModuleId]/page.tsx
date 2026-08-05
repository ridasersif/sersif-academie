"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScientificBackground from "@/components/ScientificBackground";
import { ThemeToggle } from "@/components/theme-toggle";
import MusicPlayer from "@/components/MusicPlayer";
import { ArrowLeft, BookOpen, CheckCircle2, FileText, GraduationCap, Sparkles, Download, PlayCircle, Layers } from "lucide-react";
import { COURSES_DATA } from "@/data/courses";

export default function SubModulePage({ params }: { params: Promise<{ moduleId: string; subModuleId: string }> }) {
  const resolvedParams = use(params);
  const { moduleId, subModuleId } = resolvedParams;

  const parentModule = COURSES_DATA[moduleId];
  const subModule = parentModule?.subModules?.find((s) => s.id === subModuleId);

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"syllabus" | "exercices" | "examens">("syllabus");
  const [disabledNotice, setDisabledNotice] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setCompletedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDisabledClick = (featureName: string) => {
    setDisabledNotice(`Le module "${featureName}" est en cours de développement. Il sera bientôt disponible !`);
    setTimeout(() => setDisabledNotice(null), 4000);
  };

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

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 relative">
      {/* Arrière-plan holographique */}
      <div className="fixed inset-0 z-0">
        <ScientificBackground type={moduleId === "mecanique-du-point-et-du-solide" ? "mecanique" : parentModule.subject} />
      </div>

      {/* Header Minimalist */}
      <header className="w-full px-4 sm:px-8 py-3.5 flex justify-between items-center bg-background/80 backdrop-blur-xl sticky top-0 z-50 border-b border-border/40 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href={`/cours/${moduleId}`}
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-xs sm:text-sm font-semibold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{parentModule.title}</span>
          </Link>
          
          <span className="text-border/60">|</span>
          
          <h1 className="text-xs sm:text-sm font-bold tracking-tight text-foreground truncate max-w-[180px] sm:max-w-none">
            {subModule.title}
          </h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <MusicPlayer />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-5xl mx-auto w-full z-10">
        
        {/* Banner Notification if user clicks disabled feature */}
        {disabledNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <span>🔒 {disabledNotice}</span>
            <button onClick={() => setDisabledNotice(null)} className="text-muted-foreground hover:text-foreground">✕</button>
          </div>
        )}

        {/* Banner Card */}
        <div className="bg-card/85 backdrop-blur-xl border border-border/80 rounded-[32px] p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="md:col-span-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-3">
                <GraduationCap className="w-4 h-4" />
                <span>{subModule.code} • {subModule.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black mb-3 text-foreground tracking-tight">
                {subModule.title}
              </h2>
              
              <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed mb-6">
                {subModule.description}
              </p>

              {/* Action Tabs with Cours 3D FIRST & Disabled Locks */}
              <div className="flex flex-wrap gap-2">
                {/* 1st Tab: Cours 3D & Simulation (LINKS DIRECTLY TO ETUDE PAGE) */}
                <Link
                  href={`/cours/${moduleId}/${subModuleId}/etude`}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:scale-[1.03]"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>🎮 Cours 3D & Interactive</span>
                </Link>

                {/* 2nd Tab: Programme Officiel (ACTIVE) */}
                <button
                  onClick={() => setActiveTab("syllabus")}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    activeTab === "syllabus"
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted/70 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Programme Officiel</span>
                </button>

                {/* 3rd Tab: Exercices (DISABLED) */}
                <button
                  onClick={() => handleDisabledClick("Séries d'exercices")}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-muted/40 text-muted-foreground/50 border border-border/40 flex items-center gap-2 cursor-not-allowed group relative opacity-70"
                  title="En cours de développement"
                >
                  <span>✏️ Exercices</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    Bientôt
                  </span>
                </button>

                {/* 4th Tab: Examens (DISABLED) */}
                <button
                  onClick={() => handleDisabledClick("Examens & Annales")}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-muted/40 text-muted-foreground/50 border border-border/40 flex items-center gap-2 cursor-not-allowed group relative opacity-70"
                  title="En cours de développement"
                >
                  <span>📝 Examens</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    Bientôt
                  </span>
                </button>
              </div>
            </div>

            {/* 3D Image Preview */}
            <div className="relative w-full h-48 md:h-56 rounded-2xl overflow-hidden bg-slate-950 border border-black/10 shadow-inner">
              <Image
                src={subModule.image}
                alt={subModule.title}
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>

        {/* Tab Content 1: Syllabus Elements List */}
        {activeTab === "syllabus" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center justify-between">
              <span>Éléments du programme officiel (Cocher pour réviser)</span>
              <span className="text-xs font-semibold text-muted-foreground">
                {Object.values(completedItems).filter(Boolean).length} / {subModule.elements.length} complétés
              </span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {subModule.elements.map((el) => {
                const isChecked = !!completedItems[el.id];
                return (
                  <div
                    key={el.id}
                    onClick={() => toggleItem(el.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isChecked
                        ? "bg-emerald-500/10 border-emerald-500/40 shadow-sm"
                        : "bg-card/80 backdrop-blur-xl border-border/80 hover:border-primary/40"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                      isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-border text-transparent"
                    }`}>
                      <CheckCircle2 className="w-4 h-4" />
                    </div>

                    <div className="flex-1">
                      <h4 className={`text-base font-bold mb-1 ${isChecked ? "text-emerald-600 dark:text-emerald-400 line-through" : "text-foreground"}`}>
                        {el.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                        {el.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2, 3, 4: Resources placeholders */}
        {activeTab !== "syllabus" && (
          <div className="bg-card/80 backdrop-blur-xl border border-border/80 rounded-3xl p-8 text-center">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground capitalize">
              Ressources: {activeTab}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6 font-medium leading-relaxed">
              Les fichiers PDF et exercices interactifs pour <strong>{subModule.title}</strong> sont en cours de mise en ligne.
            </p>
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-xs font-bold inline-flex items-center gap-2 shadow-md">
              <Download className="w-4 h-4" />
              <span>Télécharger le guide de révision</span>
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
