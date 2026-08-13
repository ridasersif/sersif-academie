"use client";

import React from "react";
import LatexMath from "@/components/ui/LatexMath";
import dynamic from 'next/dynamic';
import LazyMount from "@/components/ui/LazyMount";

const ARQSCondition3DCanvas = dynamic(() => import("../components/ARQSCondition3DCanvas"), { ssr: false });
const DisplacementCurrent3DCanvas = dynamic(() => import("../components/DisplacementCurrent3DCanvas"), { ssr: false });
const SkinEffect3DCanvas = dynamic(() => import("../components/SkinEffect3DCanvas"), { ssr: false });

import { Scale, Zap, Waves, AlertTriangle } from "lucide-react";

/* ── Formula Card ── */
function FormulaCard({ children, label, color = "cyan" }: { children: React.ReactNode; label: string; color?: string }) {
  const borderColor = color === "cyan" ? "border-cyan-500/40" : color === "emerald" ? "border-emerald-500/40" : color === "amber" ? "border-amber-500/40" : "border-purple-500/40";
  const shadowColor = color === "cyan" ? "rgba(6,182,212,0.1)" : color === "emerald" ? "rgba(16,185,129,0.1)" : color === "amber" ? "rgba(245,158,11,0.1)" : "rgba(168,85,247,0.1)";
  const barColor = color === "cyan" ? "bg-cyan-500" : color === "emerald" ? "bg-emerald-500" : color === "amber" ? "bg-amber-500" : "bg-purple-500";
  const labelColor = color === "cyan" ? "text-cyan-500/80" : color === "emerald" ? "text-emerald-500/80" : color === "amber" ? "text-amber-500/80" : "text-purple-500/80";

  return (
    <div className={`max-w-lg mx-auto p-3 sm:p-4 rounded-xl bg-muted/50 dark:bg-slate-900/50 border ${borderColor} flex flex-col items-center justify-center relative overflow-hidden`} style={{ boxShadow: `0 0 15px ${shadowColor}` }}>
      <div className={`absolute top-0 left-0 w-1 h-full ${barColor} rounded-l-xl`} />
      <div className="text-center font-mono text-sm sm:text-base mb-1 py-1 overflow-visible flex items-center justify-center">
        {children}
      </div>
      <p className={`text-[10px] text-center ${labelColor} font-bold uppercase tracking-wider`}>
        {label}
      </p>
    </div>
  );
}

export default function Chap6ARQS() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 1: CONDITION DE L'ARQS               */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Partie 1 • La Condition Fondamentale</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          1. L'Approximation des Régimes Quasi-Stationnaires (ARQS)
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Dans la réalité, les effets électromagnétiques se propagent à la vitesse de la lumière <LatexMath math="c" />. Si un circuit de taille <LatexMath math="L" /> est soumis à un signal de fréquence <LatexMath math="f" />, le signal met un temps <LatexMath math="\tau = L/c" /> pour le traverser. L'ARQS consiste à négliger ce temps de propagation.
        </p>

        <div className="mb-6">
          <FormulaCard label="Condition de validité de l'ARQS" color="cyan">
            <span className="text-cyan-400">
              <LatexMath math="L \ll \lambda = \frac{c}{f} \quad \text{ou} \quad \tau = \frac{L}{c} \ll T" />
            </span>
          </FormulaCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="space-y-4 flex flex-col justify-center">
            <div className="bg-background border border-border p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-foreground mb-2">Que signifie l'ARQS physiquement ?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cela signifie que l'état électromagnétique (courant, tension) est considéré comme <strong>instantanément identique</strong> en tout point du circuit. Les lois de l'électrocinétique classique (lois de Kirchhoff, loi des mailles, loi des nœuds) ne sont valables <strong>que</strong> dans l'ARQS !
              </p>
            </div>
            
            <div className="bg-orange-500/5 border border-orange-500/20 p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-orange-400 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Les limites de l'ARQS
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pour le réseau EDF (50 Hz), <LatexMath math="\lambda \approx 6000 \text{ km}" />. L'ARQS est valable pour des lignes de plusieurs kilomètres. 
                <br/><br/>
                Mais pour un processeur d'ordinateur (3 GHz), <LatexMath math="\lambda \approx 10 \text{ cm}" />. La taille de la carte mère (<LatexMath math="L \approx 30 \text{ cm}" />) est plus grande que <LatexMath math="\lambda" /> : l'ARQS n'est plus valable, il faut utiliser la théorie des lignes de transmission ou les équations de Maxwell complètes !
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <LazyMount height="400px" fallbackText="Chargement ARQS Visualizer...">
              <ARQSCondition3DCanvas />
            </LazyMount>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Comparaison entre la taille du circuit $L$ et la longueur d'onde $\lambda$ selon la fréquence.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 2: COURANT DE DÉPLACEMENT            */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Partie 2 • L'ARQS Magnétique</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          2. Le Courant de Déplacement de Maxwell
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Dans l'équation de Maxwell-Ampère complète, un terme supplémentaire apparaît : le <strong>courant de déplacement</strong> <LatexMath math="\vec{j}_D" />. Dans l'ARQS dit "magnétique" (le plus courant), on néglige ce terme devant le courant de conduction <LatexMath math="\vec{j}" />... sauf à l'intérieur d'un condensateur !
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="flex flex-col">
            <LazyMount height="400px" fallbackText="Chargement Courant de Déplacement...">
              <DisplacementCurrent3DCanvas />
            </LazyMount>
          </div>
          
          <div className="space-y-4">
            <FormulaCard label="Équation de Maxwell-Ampère complète" color="purple">
              <span className="text-purple-400">
                <LatexMath math="\text{rot}(\vec{B}) = \mu_0 (\vec{j} + \varepsilon_0 \frac{\partial \vec{E}}{\partial t})" />
              </span>
            </FormulaCard>

            <div className="bg-background border border-border p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-foreground mb-2">Le Paradoxe du Condensateur</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Considérons un condensateur en train de se charger. Le courant de conduction <LatexMath math="I" /> (les électrons) circule dans les fils, mais s'arrête net sur les plaques. Entre les plaques, il y a du vide (donc <LatexMath math="\vec{j} = \vec{0}" />).
                <br/><br/>
                La loi des nœuds serait violée sans Maxwell ! Pour rétablir la continuité, Maxwell a introduit le courant de déplacement : la variation du champ électrique entre les plaques agit "comme un courant" <LatexMath math="\vec{j}_D = \varepsilon_0 \frac{\partial \vec{E}}{\partial t}" /> pour fermer le circuit !
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 3: L'EFFET DE PEAU                   */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-extrabold mb-3">
          <Waves className="w-3.5 h-3.5" />
          <span>Partie 3 • Conséquences Hautes Fréquences</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          3. L'Effet de Peau (Skin Effect)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              En courant continu, le courant se répartit uniformément dans toute la section d'un fil conducteur. Mais en courant alternatif, plus la fréquence augmente, plus le champ électromagnétique a du mal à pénétrer dans le métal.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
              Conséquence : le courant est repoussé vers la surface extérieure du conducteur. C'est l'<strong>Effet Pelliculaire</strong> (ou Effet de Peau).
            </p>

            <FormulaCard label="Épaisseur de peau" color="sky">
              <span className="text-sky-400">
                <LatexMath math="\delta = \sqrt{\frac{2}{\mu_0 \gamma \omega}}" />
              </span>
            </FormulaCard>

            <div className="bg-sky-500/5 border border-sky-500/20 p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-sky-400 mb-2">Implications Technologiques</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-2">
                <li><strong>Câbles Creux :</strong> À très haute fréquence, le centre d'un câble ne sert à rien puisqu'aucun courant n'y passe. On utilise donc des tubes creux pour économiser du cuivre et du poids.</li>
                <li><strong>Fil de Litz :</strong> Pour réduire la résistance due à l'effet de peau, on utilise plusieurs petits brins isolés les uns des autres au lieu d'un seul gros fil.</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col">
            <LazyMount height="400px" fallbackText="Chargement Effet de Peau 3D...">
              <SkinEffect3DCanvas />
            </LazyMount>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Augmente la fréquence pour observer le courant se concentrer sur la "peau" du cylindre.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
