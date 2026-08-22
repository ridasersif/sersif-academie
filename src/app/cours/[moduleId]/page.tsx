"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import ScientificBackground from "@/components/ScientificBackground";
import ElectricBackground from "@/components/ElectricBackground";
import { ThemeToggle } from "@/components/theme-toggle";
import MusicPlayer from "@/components/MusicPlayer";
import { ArrowLeft, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { COURSES_DATA } from "@/data/courses";

export default function CoursePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.moduleId;
  const courseModule = COURSES_DATA[moduleId];

  // If module has sub-modules (like Mécanique: Point & Solide)
  if (courseModule && courseModule.subModules) {
    return (
      <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 relative">
        {/* Background Holographique */}
        <div className="fixed inset-0 z-0">
          {moduleId === "electricite" ? (
            <ElectricBackground />
          ) : (
            <ScientificBackground type={moduleId === "mecanique-du-point-et-du-solide" ? "mecanique" : courseModule.subject} />
          )}
        </div>

        {/* Header Navigation Minimalist */}
        <header className="w-full px-4 sm:px-8 py-3.5 flex justify-between items-center bg-background/80 backdrop-blur-xl sticky top-0 z-50 border-b border-border/40 shadow-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href={`/${courseModule.subject}`}
              className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-xs sm:text-sm font-semibold group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="capitalize">{courseModule.subject}</span>
            </Link>
            
            <span className="text-border/60">|</span>
            
            <h1 className="text-xs sm:text-sm font-bold tracking-tight text-foreground truncate max-w-[200px] sm:max-w-none">
              Sersif Académie <span className="text-muted-foreground font-normal">/</span> <span className="text-primary font-bold">{courseModule.title}</span>
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <MusicPlayer />
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 p-4 sm:p-8 md:p-12 ${courseModule.subModules.length > 2 ? "max-w-7xl" : "max-w-5xl"} mx-auto w-full z-10`}>
          
          {/* Header Title */}
          <div className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3">
              <GraduationCap className="w-4 h-4" />
              <span>{courseModule.code} • Programme Officiel</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-foreground tracking-tight">
              {courseModule.title}
            </h2>
            
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Choisissez le sous-module que vous souhaitez réviser.
            </p>
          </div>

          {/* Sub-Module Cards */}
          <div className={`grid grid-cols-1 ${courseModule.subModules.length > 2 ? "md:grid-cols-2 lg:grid-cols-3 gap-6" : "md:grid-cols-2 gap-8"}`}>
            {courseModule.subModules.map((sub) => (
              <Link 
                key={sub.id} 
                href={`/cours/${moduleId}/${sub.id}`} 
                className="group block h-full"
              >
                <div className="h-full bg-card/85 backdrop-blur-xl border border-border/80 rounded-[32px] p-4 sm:p-5 shadow-lg hover:shadow-2xl hover:border-primary/50 transition-all duration-300 transform group-hover:-translate-y-1.5 flex flex-col justify-between">
                  
                  <div>
                    {/* 3D Image Header Container */}
                    <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-slate-950 border border-black/10 shadow-inner mb-5">
                      <Image
                        src={sub.image}
                        alt={sub.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Floating Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-extrabold text-white border border-white/20 shadow-sm">
                          {sub.code}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-2">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                          {sub.title}
                        </h3>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                          {sub.badge}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-6">
                        {sub.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-2 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary/90">
                    <span>Accéder au sous-module</span>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </main>
      </div>
    );
  }

  // Fallback for other modules
  const formattedTitle = moduleId
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 relative">
      <div className="fixed inset-0 z-0">
        <ScientificBackground type="physique" />
      </div>

      <header className="w-full px-4 sm:px-8 py-3.5 flex justify-between items-center bg-background/80 backdrop-blur-xl sticky top-0 z-50 border-b border-border/40 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href="/physique" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-xs sm:text-sm font-semibold group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Retour</span>
          </Link>
          
          <span className="text-border/60">|</span>
          
          <h1 className="text-xs sm:text-sm font-bold tracking-tight text-foreground truncate">
            {formattedTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <MusicPlayer />
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="max-w-md w-full bg-card/85 backdrop-blur-xl border border-border/80 rounded-[32px] p-10 shadow-2xl">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-foreground">{formattedTitle}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mb-8 leading-relaxed font-medium">
            Nous préparons les fiches de cours, séries d&apos;exercices et corrigés d&apos;examens pour ce module.
          </p>
          
          <Link 
            href="/physique" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-xs py-3 px-8 rounded-full shadow-lg hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux modules</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
