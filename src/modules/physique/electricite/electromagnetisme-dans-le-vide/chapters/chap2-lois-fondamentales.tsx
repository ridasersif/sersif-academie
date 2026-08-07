"use client";

import React from "react";
import LatexMath from "@/components/ui/LatexMath";
import BiotSavart3DCanvas from "../components/BiotSavart3DCanvas";
import AmpereTheorem3DCanvas from "../components/AmpereTheorem3DCanvas";
import { Magnet, RotateCw, Calculator, Compass, Layers } from "lucide-react";

export default function Chap2LoisFondamentales() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* PARTIE 1: LOI DE BIOT-SAVART */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Partie 1 • Loi de Biot-Savart (Méthode Locale)</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Calcul de proche en proche du Champ Magnétique
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
          La loi de Biot et Savart permet de calculer le champ magnétique total créé par un circuit en sommant (intégrant) les contributions élémentaires <LatexMath math="d\vec{B}" /> de chaque petit bout de fil <LatexMath math="d\vec{l}" />.
        </p>

        <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-900/50 border border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)] mb-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl"></div>
          <div className="text-center font-mono text-lg text-blue-400 mb-2 py-2 overflow-visible flex items-center justify-center">
            <LatexMath math="d\vec{B}(M) = \frac{\mu_0 I}{4\pi} \frac{d\vec{l} \wedge \vec{u}}{r^2}" />
          </div>
          <p className="text-[10px] text-center text-blue-500/80 font-bold uppercase tracking-wider">
            Formule Élémentaire de Biot-Savart
          </p>
        </div>

        {/* Simulateur 3D Biot-Savart */}
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          Laboratoire 3D : L'élément de courant
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Observez comment le champ élémentaire <LatexMath math="d\vec{B}" /> dépend de la distance <LatexMath math="r" /> et de l'angle d'observation <LatexMath math="\theta" />. Remarquez que <LatexMath math="d\vec{B}" /> est nul dans l'alignement du fil (<LatexMath math="\theta = 0" /> ou <LatexMath math="180^\circ" />) à cause du produit vectoriel.
        </p>
        
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <BiotSavart3DCanvas />
        </div>

        {/* Cas classiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl sm:rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <span className="text-xs font-bold text-slate-300 block mb-2">Fil Infini (distance r)</span>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-emerald-400">
              <LatexMath math="B = \frac{\mu_0 I}{2\pi r}" />
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">Le champ s'enroule autour du fil et décroît en 1/r.</p>
          </div>
          
          <div className="p-4 rounded-xl sm:rounded-2xl bg-slate-800/30 border border-slate-700/50">
            <span className="text-xs font-bold text-slate-300 block mb-2">Centre d'une Spire (rayon R)</span>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-purple-400">
              <LatexMath math="B = \frac{\mu_0 I}{2 R}" />
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">Le champ est perpendiculaire au plan de la spire.</p>
          </div>
        </div>
      </section>

      {/* PARTIE 2: THEOREME D'AMPERE */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Partie 2 • Le Théorème d'Ampère (Méthode Globale)</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          2. La Circulation du Champ Magnétique
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          Tout comme le théorème de Gauss facilite le calcul du champ électrique, le <strong>théorème d'Ampère</strong> simplifie le calcul du champ magnétique lorsque la distribution de courants présente un haut degré de symétrie (cylindre, tore, solénoïde).
        </p>

        <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-900/50 border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)] mb-6 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 rounded-l-xl"></div>
          <div className="text-center font-mono text-lg text-amber-400 mb-2 py-2 overflow-visible flex items-center justify-center">
            <LatexMath math="\oint_{(C)} \vec{B} \cdot d\vec{l} = \mu_0 \sum I_{enlac\acute{e}s}" />
          </div>
          <p className="text-[10px] text-center text-amber-500/80 font-bold uppercase tracking-wider">
            Théorème d'Ampère (Forme Intégrale)
          </p>
        </div>

        {/* Règle des signes */}
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-100/80 leading-relaxed">
          <strong>Comment compter les courants ?</strong> Pour déterminer le signe des courants enlacés <LatexMath math="\Sigma I_{enl}" />, on oriente le contour fermé <LatexMath math="(C)" />. D'après la règle de la main droite, on définit le vecteur normal <LatexMath math="\vec{n}" /> à la surface délimitée par ce contour. Tout courant circulant dans le même sens que <LatexMath math="\vec{n}" /> est compté <strong>positivement</strong>, sinon négativement.
        </div>

        {/* Simulateur 3D Ampère */}
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          Laboratoire 3D : Courants Enlacés
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Allumez ou éteignez les différents câbles pour voir comment le bilan des courants enlacés est calculé. Notez que le câble mauve (I3), qui passe <strong>à l'extérieur</strong> du contour, ne participe jamais à la circulation de <LatexMath math="\vec{B}" /> !
        </p>
        
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <AmpereTheorem3DCanvas />
        </div>

        {/* Méthodologie */}
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 mt-8">
          <Layers className="w-4 h-4 text-slate-400" />
          Méthodologie d'application
        </h3>
        <div className="space-y-3">
          {[
            { step: "1", text: "Étudier les symétries et invariances pour déterminer la direction et la dépendance spatiale de B." },
            { step: "2", text: "Choisir un contour d'Ampère (C) pertinent (cercle, rectangle) tangent à B ou perpendiculaire." },
            { step: "3", text: "Calculer la circulation de B sur ce contour (elle se simplifie souvent en B × L)." },
            { step: "4", text: "Calculer algébriquement la somme des courants I qui traversent la surface s'appuyant sur (C)." },
            { step: "5", text: "Appliquer l'égalité et isoler l'expression de B." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-center bg-slate-900/40 p-3 rounded-lg border border-slate-800/60">
              <div className="w-6 h-6 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                {item.step}
              </div>
              <p className="text-[11px] text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>

      </section>
      
    </div>
  );
}
