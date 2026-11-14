import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import MusicPlayer from "@/components/MusicPlayer";
import FaculteParticles from "@/components/FaculteParticles";
import { ArrowLeft, Beaker, Atom, Calculator, Code } from "lucide-react";

export default function FaculteHome() {
  const filieres = [
    {
      id: "smpc",
      title: "SMPC",
      description: "Sciences de la Matière Physique et Chimie. Fondamentaux en thermodynamique, mécanique, électromagnétisme et chimie organique.",
      icon: <Atom size={32} className="text-blue-500" />,
      color: "blue",
      href: "/faculte/smpc" // Placeholder pour l'instant
    },
    {
      id: "smai",
      title: "SMAI",
      description: "Sciences Mathématiques et Applications Informatiques. Algèbre, analyse, probabilités et programmation.",
      icon: <Calculator size={32} className="text-emerald-500" />,
      color: "emerald",
      href: "/faculte/smai"
    },
    {
      id: "fst",
      title: "FST (MIP/BCG)",
      description: "Faculté des Sciences et Techniques. Tronc commun Mathématiques, Informatique, Physique ou Biologie, Chimie, Géologie.",
      icon: <Beaker size={32} className="text-amber-500" />,
      color: "amber",
      href: "/faculte/fst"
    },
    {
      id: "informatique",
      title: "Informatique & Dev",
      description: "Génie logiciel, algorithmique avancée, structures de données et technologies du web.",
      icon: <Code size={32} className="text-purple-500" />,
      color: "purple",
      href: "/faculte/informatique"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-emerald-500/20 relative">
      {/* Arrière-plan animé */}
      <div className="fixed inset-0 z-0">
        <FaculteParticles />
      </div>

      {/* Navbar Ultra Minimalist */}
      <header className="w-full px-4 sm:px-6 py-2 sm:py-3 flex justify-between items-center bg-background/70 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
            <ArrowLeft size={16} className="text-foreground" />
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground ml-1">
            Retour <span className="text-muted-foreground font-medium hidden sm:inline">à l'accueil</span>
          </h1>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-5">
          <MusicPlayer />
          <ThemeToggle />
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col items-center justify-start w-full z-10 px-4 sm:px-8 py-12 lg:py-20">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-semibold tracking-wide">
            ÉTUDES UNIVERSITAIRES
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground leading-[1.15]">
            Explorez vos filières à <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">La Faculté</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-16 max-w-2xl mx-auto leading-relaxed font-medium">
            Des ressources, résumés et examens corrigés spécialement conçus pour les étudiants des facultés marocaines (FS, FST, etc.).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {filieres.map((filiere) => (
              <Link href={filiere.href} key={filiere.id} className="group block h-full text-left">
                <div className="h-full flex flex-col bg-card/60 backdrop-blur-md border border-border/60 rounded-3xl p-6 sm:p-8 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform group-hover:-translate-y-2">
                  <div className={`w-14 h-14 rounded-2xl bg-${filiere.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {filiere.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 tracking-tight group-hover:text-emerald-500 transition-colors">
                    {filiere.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                    {filiere.description}
                  </p>
                  
                  <div className="mt-6 flex items-center text-foreground font-semibold text-sm group-hover:text-emerald-500 transition-colors">
                    <span>Voir les modules</span>
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="w-full py-6 px-6 bg-background/50 backdrop-blur-sm border-t border-border/40 z-10 text-center">
        <div className="text-xs font-medium text-muted-foreground">
          &copy; {new Date().getFullYear()} Sersif Académie. Révision &bull; Accompagnement &bull; Réussite.
        </div>
      </footer>
    </div>
  );
}
