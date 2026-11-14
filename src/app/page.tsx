import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import MusicPlayer from "@/components/MusicPlayer";
import HomeParticles from "@/components/HomeParticles";
import { BookOpen, GraduationCap, Target, Users, Award, Mail, Phone, MapPin, Send } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 relative bg-background">
      
      {/* Navbar Ultra Minimalist */}
      <header className="w-full px-4 sm:px-6 py-2 sm:py-3 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Sersif Académie Logo" width={28} height={28} className="rounded-md object-contain shadow-sm" />
          <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground ml-1">
            Sersif <span className="text-muted-foreground font-medium hidden sm:inline">Académie</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden md:block">
            <ul className="flex space-x-6 text-sm font-semibold">
              <li><a href="#parcours" className="text-muted-foreground hover:text-foreground transition-colors">Parcours</a></li>
              <li><a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">À Propos</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </nav>
          <div className="h-4 w-px bg-border hidden md:block"></div>
          <MusicPlayer />
          <ThemeToggle />
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section id="parcours" className="relative flex flex-col items-center justify-center w-full min-h-[90vh] z-10 px-4 sm:px-8 py-12">
        {/* Arrière-plan animé */}
        <div className="absolute inset-0 z-[-1]">
          <HomeParticles />
        </div>
        
        <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 flex flex-col items-center text-center">
          
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm">
            LA RÉFÉRENCE DE L'EXCELLENCE
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-foreground leading-[1.15]">
            Bienvenue sur <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">Sersif Académie</span>
          </h2>
          
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Choisissez votre parcours pour accéder aux ressources pédagogiques adaptées à vos objectifs, que ce soit pour le concours de l'enseignement ou vos études universitaires.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
            {/* Carte Concours */}
            <Link href="/concours" className="group block text-left w-full h-full">
              <div className="h-full bg-card/60 backdrop-blur-xl border border-border/60 rounded-3xl overflow-hidden hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col">
                <div className="relative w-full h-48 sm:h-56 overflow-hidden flex-shrink-0 bg-black">
                  <Image 
                    src="/real-concours.jpg" 
                    alt="Concours de l'Enseignement" 
                    fill 
                    className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700 ease-in-out group-hover:opacity-100"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground p-2.5 rounded-full shadow-lg backdrop-blur-md">
                    <BookOpen size={28} />
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">
                      Concours de l'Enseignement
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Préparez-vous de manière optimale pour le concours des enseignants avec nos cours, résumés et exercices corrigés en Physique et Chimie.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-primary font-semibold text-sm">
                    <span>Découvrir le programme</span>
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Carte Etudes Universitaires */}
            <Link href="/faculte" className="group block text-left w-full h-full">
              <div className="h-full bg-card/60 backdrop-blur-xl border border-border/60 rounded-3xl overflow-hidden hover:border-emerald-500/60 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform group-hover:-translate-y-2 flex flex-col">
                <div className="relative w-full h-48 sm:h-56 overflow-hidden flex-shrink-0 bg-black">
                  <Image 
                    src="/real-faculte.jpg" 
                    alt="Études Universitaires" 
                    fill 
                    className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-700 ease-in-out group-hover:opacity-100"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-emerald-500/90 text-white p-2.5 rounded-full shadow-lg backdrop-blur-md">
                    <GraduationCap size={28} />
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight group-hover:text-emerald-500 transition-colors">
                      Études Universitaires (La Fac)
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      Accédez aux ressources académiques pour votre parcours universitaire : filières SMPC, FST, SMAI et bien d'autres spécialités scientifiques.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-emerald-500 font-semibold text-sm">
                    <span>Explorer les filières</span>
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* --- ABOUT US SECTION --- */}
      <section id="about" className="py-24 px-4 sm:px-8 bg-muted/30 border-y border-border/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-sm font-semibold">
              <Target size={16} /> À PROPOS DE NOUS
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 leading-tight">
              Votre partenaire d'excellence pour la réussite.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Sersif Académie est née de la volonté d'accompagner les étudiants marocains vers l'excellence. Que vous visiez la réussite au concours des enseignants ou l'obtention de vos diplômes universitaires, nous mettons à votre disposition des ressources pédagogiques de haute qualité.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Notre approche se base sur la clarté, la pratique et l'actualisation continue de nos contenus pour répondre parfaitement aux exigences des programmes nationaux.
            </p>
            <div className="flex items-center gap-4">
              <a href="#parcours" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-full transition-all shadow-lg shadow-primary/25">
                Explorer nos parcours
              </a>
              <a href="#contact" className="bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 px-6 rounded-full transition-all border border-border/50">
                Nous contacter
              </a>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Cours Détaillés</h3>
              <p className="text-sm text-muted-foreground">Des résumés clairs focalisés sur l'essentiel pour gagner du temps.</p>
            </div>
            <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm translate-y-0 sm:translate-y-8">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Qualité Garantie</h3>
              <p className="text-sm text-muted-foreground">Un contenu rédigé et vérifié par des experts du domaine.</p>
            </div>
            <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Communauté</h3>
              <p className="text-sm text-muted-foreground">Rejoignez des milliers d'étudiants qui préparent les mêmes objectifs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-24 px-4 sm:px-8 bg-background relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Contactez-nous</h2>
          <p className="text-muted-foreground">Une question ? Un besoin d'accompagnement ? Notre équipe est là pour vous aider.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Info Contact */}
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Email</h4>
                <p className="text-muted-foreground text-sm">contact@sersif-academie.ma</p>
                <p className="text-muted-foreground text-sm">support@sersif-academie.ma</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">WhatsApp / Téléphone</h4>
                <p className="text-muted-foreground text-sm">+212 6 94 40 28 47</p>
                <a href="https://wa.me/212694402847" target="_blank" rel="noopener noreferrer" className="text-green-500 text-sm font-semibold hover:underline mt-1 inline-block">Discuter sur WhatsApp &rarr;</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Emplacement</h4>
                <p className="text-muted-foreground text-sm">Disponible en ligne 24/7</p>
                <p className="text-muted-foreground text-sm">Partout au Maroc</p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="md:col-span-3">
            <form className="bg-card/50 backdrop-blur-sm border border-border/50 p-8 rounded-3xl shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Nom complet</label>
                  <input type="text" id="name" placeholder="John Doe" className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Adresse Email</label>
                  <input type="email" id="email" placeholder="john@example.com" className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <label htmlFor="subject" className="text-sm font-medium">Sujet</label>
                <input type="text" id="subject" placeholder="Comment pouvons-nous vous aider ?" className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              </div>
              <div className="space-y-2 mb-8">
                <label htmlFor="message" className="text-sm font-medium">Message</label>
                <textarea id="message" rows={4} placeholder="Votre message..." className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"></textarea>
              </div>
              <button type="button" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all">
                Envoyer le message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full py-12 px-6 bg-muted/50 border-t border-border/40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Sersif Académie Logo" width={36} height={36} className="rounded-md object-contain shadow-sm" />
              <span className="text-xl font-bold tracking-tight">Sersif Académie</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Votre plateforme e-learning de référence pour exceller dans vos études universitaires et réussir le concours de l'enseignement au Maroc.
            </p>
            <div className="flex gap-4">
              {/* WhatsApp Button */}
              <a href="https://wa.me/212694402847" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
              {/* Facebook Button */}
              <a href="https://www.facebook.com/profile.php?id=61590537488663" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-6">Navigation</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Accueil</Link></li>
              <li><Link href="/concours" className="hover:text-primary transition-colors">Concours Enseignement</Link></li>
              <li><Link href="/faculte" className="hover:text-primary transition-colors">Études Universitaires</Link></li>
              <li><a href="#about" className="hover:text-primary transition-colors">À Propos de nous</a></li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-bold mb-6">Légal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Conditions d'utilisation</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Mentions légales</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Sersif Académie. Tous droits réservés.</p>
          <p>Révision &bull; Accompagnement &bull; Réussite</p>
        </div>
      </footer>
    </div>
  );
}
