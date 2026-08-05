import Link from "next/link";
import Image from "next/image";
import ScientificBackground from "@/components/ScientificBackground";
import { ThemeToggle } from "@/components/theme-toggle";
import MusicPlayer from "@/components/MusicPlayer";
import { ArrowRight, BookOpen } from "lucide-react";

export default function PhysiquePage() {
  const modules = [
    { 
      id: "mecanique-du-point-et-du-solide", 
      title: "Mécanique du point et du solide", 
      code: "Module 01",
      image: "/modules/mecanique_v2.png",
      description: "Cinématique du point, dynamique newtonienne, travail, énergie, et mécanique des systèmes de solides."
    },
    { 
      id: "thermodynamique", 
      title: "Thermodynamique", 
      code: "Module 02",
      image: "/modules/thermodynamique_v2.png",
      description: "Premier et second principe, échanges thermiques, machines d'Carnot et étude des fluides."
    },
    { 
      id: "optique-et-ondes", 
      title: "Optique et ondes", 
      code: "Module 03",
      image: "/modules/optique_v2.png",
      description: "Optique géométrique, réfraction, interférences lumineuses, diffraction et propagation d'ondes."
    },
    { 
      id: "electricite-et-electromagnetisme", 
      title: "Électricité et électromagnétisme", 
      code: "Module 04",
      image: "/modules/electromagnetisme_v2.png",
      description: "Électrostatique, lois de Kirchhoff, champ magnétique, équations de Maxwell et induction."
    },
    { 
      id: "physique-quantique-atomique-et-nucleaire", 
      title: "Physique quantique & nucléaire", 
      code: "Module 05",
      image: "/modules/quantique_v2.png",
      description: "Dualité onde-corpuscule, équation de Schrödinger, niveaux d'énergie atomiques et désintégrations."
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 relative">
      {/* Background Scientifique Holographique */}
      <div className="fixed inset-0 z-0">
        <ScientificBackground type="physique" />
      </div>

      {/* Header Minimalist */}
      <header className="w-full px-4 sm:px-8 py-3.5 flex justify-between items-center bg-background/80 backdrop-blur-xl sticky top-0 z-50 border-b border-border/40 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link 
            href="/" 
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 text-xs sm:text-sm font-semibold group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Retour</span>
          </Link>
          
          <span className="text-border/60">|</span>
          
          <h1 className="text-xs sm:text-sm font-bold tracking-tight text-foreground">
            Sersif Académie <span className="text-muted-foreground font-normal">/</span> <span className="text-primary font-bold">Physique</span>
          </h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <MusicPlayer />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 md:p-12 max-w-6xl mx-auto w-full z-10">
        
        {/* Title Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Programme Officiel de Physique</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-foreground tracking-tight">
            Modules de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Physique</span>
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl font-medium leading-relaxed">
            Cours magistraux structurés, fiches de formules essentielles et séries d'exercices d'examens corrigés.
          </p>
        </div>

        {/* Professional MasterClass Style Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <Link key={mod.id} href={`/cours/${mod.id}`} className="group block h-full">
              <div className="h-full bg-card/85 backdrop-blur-xl border border-border/80 rounded-[28px] p-3 shadow-md hover:shadow-2xl hover:border-primary/50 transition-all duration-300 transform group-hover:-translate-y-1.5 flex flex-col justify-between">
                
                <div>
                  {/* Crisp 3D Image Container */}
                  <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-950 border border-black/10 shadow-inner">
                    <Image
                      src={mod.image}
                      alt={mod.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Module Code Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-extrabold text-white border border-white/20 shadow-sm">
                        {mod.code}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 pt-5">
                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-3">
                      {mod.description}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-1 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary/90">
                  <span>Consulter le cours</span>
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
