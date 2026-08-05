"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

export default function CoursePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  // Formatage du moduleId pour l'affichage (ex: "mecanique-du-point" -> "Mécanique du point")
  const formattedTitle = resolvedParams.moduleId
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-card border border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-xl">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-foreground">{formattedTitle}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-lg">
          Nous travaillons sur la préparation de ce cours. Il sera bientôt disponible !
        </p>
        
        <button 
          onClick={() => router.back()} 
          className="inline-block bg-primary text-primary-foreground font-semibold py-3 px-8 rounded-full shadow-md hover:bg-primary/90 hover:shadow-lg transition-all cursor-pointer"
        >
          Retour aux modules
        </button>
      </div>
    </div>
  );
}
