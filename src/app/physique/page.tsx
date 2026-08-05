import Link from "next/link";

export default function PhysiquePage() {
  const modules = [
    { id: "mecanique-du-point", title: "Mécanique du point" },
    { id: "mecanique-du-solide", title: "Mécanique du solide" },
    { id: "electrostatique", title: "Électrostatique" },
    { id: "electromagnetisme-dans-le-vide", title: "Électromagnétisme dans le vide" },
    { id: "electronique", title: "Électronique" },
    { id: "thermodynamique", title: "Thermodynamique" },
    { id: "optique-geometrique", title: "Optique géométrique" },
    { id: "physique-quantique", title: "Physique quantique" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full p-6 border-b border-gray-200 dark:border-gray-800 flex items-center">
        <Link href="/" className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Retour
        </Link>
        <h1 className="text-2xl font-bold ml-6 text-foreground">Modules de Physique</h1>
      </header>

      <main className="flex-1 p-8 md:p-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <Link key={mod.id} href={`/cours/${mod.id}`} className="group block">
              <div className="bg-card text-card-foreground border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200 transform group-hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 font-bold text-xl">
                  {mod.title.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{mod.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  Cliquez pour accéder aux cours, exercices et examens de {mod.title.toLowerCase()}.
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
