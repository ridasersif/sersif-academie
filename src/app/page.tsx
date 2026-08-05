import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar Simple */}
      <header className="w-full p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Sersif Académie</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/physique" className="text-foreground hover:text-primary transition-colors">
                Physique
              </Link>
            </li>
            <li>
              <Link href="/chimie" className="text-foreground hover:text-primary transition-colors">
                Chimie
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-3xl">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground leading-tight">
            Maîtrisez la <span className="text-primary">Physique</span> et la <span className="text-primary">Chimie</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            La plateforme d'excellence pour préparer votre concours de l'enseignement au Maroc. Découvrez des modules structurés et professionnels.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* Carte Physique */}
            <Link href="/physique" className="group">
              <div className="bg-card text-card-foreground border border-gray-200 dark:border-gray-800 rounded-2xl p-8 w-full sm:w-72 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Physique</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Mécanique, Électromagnétisme, Thermodynamique...</p>
              </div>
            </Link>

            {/* Carte Chimie */}
            <Link href="/chimie" className="group">
              <div className="bg-card text-card-foreground border border-gray-200 dark:border-gray-800 rounded-2xl p-8 w-full sm:w-72 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden flex flex-col items-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Chimie</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Atomistique, Cinétique, Thermochimie...</p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-gray-500 border-t border-gray-200 dark:border-gray-800">
        &copy; {new Date().getFullYear()} Sersif Académie. Tous droits réservés.
      </footer>
    </div>
  );
}
