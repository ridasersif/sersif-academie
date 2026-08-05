import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import Background3D from "@/components/Background3D";
import { BookOpen, CheckCircle, Lightbulb } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 relative">
      {/* Arrière-plan élégant (Fixé en fond pour toute la page) */}
      <div className="fixed inset-0 z-0">
        <Background3D />
      </div>

      {/* Navbar Ultra Minimalist & Responsive (Plus fine) */}
      <header className="w-full px-4 sm:px-6 py-2 sm:py-3 flex justify-between items-center bg-background/70 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-gradient-to-br from-primary to-blue-600 text-primary-foreground font-bold text-[10px] sm:text-xs tracking-tighter shadow-md">
            SA
          </div>
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground ml-1">
            Sersif <span className="text-muted-foreground font-medium hidden sm:inline">Académie</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <nav>
            <ul className="flex space-x-3 sm:space-x-5 text-xs sm:text-sm font-semibold">
              <li>
                <Link href="/physique" className="text-muted-foreground hover:text-foreground transition-colors">
                  Physique
                </Link>
              </li>
              <li>
                <Link href="/chimie" className="text-muted-foreground hover:text-foreground transition-colors">
                  Chimie
                </Link>
              </li>
            </ul>
          </nav>
          <div className="h-3 sm:h-4 w-px bg-border"></div>
          <ThemeToggle />
        </div>
      </header>

      {/* Contenu principal de la page */}
      <main className="flex-1 flex flex-col w-full z-10">
        
        {/* --- Hero Section --- */}
        <section className="flex flex-col items-center justify-center pt-16 pb-20 px-4 sm:px-8 text-center w-full min-h-[85vh]">
          <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col items-center">
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 text-foreground leading-[1.15]">
              Préparez-vous avec <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Sersif Académie</span>
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
              Et maximisez considérablement vos chances de réussite au concours de l'enseignement en <span className="text-foreground">Physique</span> et <span className="text-foreground">Chimie</span>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
              <Link href="/physique" className="group block text-left w-full">
                <div className="h-full bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="relative w-full h-48 sm:h-56 bg-muted overflow-hidden">
                    <Image 
                      src="/physics.png" 
                      alt="Physique" 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-5 left-5 text-white z-10">
                      <h3 className="text-xl font-bold mb-1 tracking-tight">Physique</h3>
                      <p className="text-white/80 text-xs font-medium line-clamp-1">Mécanique, Électromagnétisme, Thermodynamique...</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/chimie" className="group block text-left w-full">
                <div className="h-full bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform group-hover:-translate-y-1">
                  <div className="relative w-full h-48 sm:h-56 bg-muted overflow-hidden">
                    <Image 
                      src="/chemistry.png" 
                      alt="Chimie" 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-5 left-5 text-white z-10">
                      <h3 className="text-xl font-bold mb-1 tracking-tight">Chimie</h3>
                      <p className="text-white/80 text-xs font-medium line-clamp-1">Atomistique, Cinétique, Thermochimie...</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* --- Section: Pourquoi Nous Choisir ? --- */}
        <section className="py-20 px-4 sm:px-8 bg-card/30 backdrop-blur-sm border-y border-border/40">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-12">Pourquoi choisir <span className="text-primary">Sersif Académie</span> ?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="flex flex-col items-center p-6 bg-background/50 rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Cours Détaillés</h3>
                <p className="text-sm text-muted-foreground">Des résumés clairs et complets pour chaque module, focalisés sur l'essentiel pour le concours.</p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center p-6 bg-background/50 rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Exercices Corrigés</h3>
                <p className="text-sm text-muted-foreground">Entraînez-vous avec des séries d'exercices et d'anciens examens avec corrections détaillées.</p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center p-6 bg-background/50 rounded-2xl border border-border/50 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Astuces & Méthodologie</h3>
                <p className="text-sm text-muted-foreground">Apprenez à gérer votre temps et découvrez les secrets pour réussir les épreuves écrites et orales.</p>
              </div>
            </div>
          </div>
        </section>
        
      </main>

      {/* --- Footer Complet --- */}
      <footer className="w-full py-12 px-6 bg-background border-t border-border/40 z-10 relative">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 text-primary-foreground font-bold text-xs">
                SA
              </div>
              <span className="text-lg font-bold">Sersif Académie</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Votre partenaire d'excellence pour la préparation au concours de l'enseignement en Physique-Chimie au Maroc.
            </p>
          </div>

          {/* Navigation Rapide */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-semibold mb-4">Navigation Rapide</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/physique" className="hover:text-primary transition-colors">Module Physique</Link></li>
              <li><Link href="/chimie" className="hover:text-primary transition-colors">Module Chimie</Link></li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="font-semibold mb-4">Contactez-nous</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Rejoignez notre communauté pour ne rien rater des nouveautés.
            </p>
            <div className="flex gap-4">
              {/* WhatsApp Button */}
              <a href="#" aria-label="WhatsApp" className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
              {/* Facebook Button */}
              <a href="#" aria-label="Facebook" className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 text-center text-xs font-medium text-muted-foreground">
          &copy; {new Date().getFullYear()} Sersif Académie. Révision &bull; Accompagnement &bull; Réussite.
        </div>
      </footer>
    </div>
  );
}
