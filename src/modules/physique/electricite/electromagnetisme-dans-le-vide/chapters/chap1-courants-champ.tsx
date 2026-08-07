"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";
import CurrentDensity3DCanvas from "../components/CurrentDensity3DCanvas";
import CurrentFlux3DCanvas from "../components/CurrentFlux3DCanvas";
import DriftVelocity3DCanvas from "../components/DriftVelocity3DCanvas";
import MagneticSymmetry3DCanvas from "../components/MagneticSymmetry3DCanvas";
import RightHandRule3DCanvas from "../components/RightHandRule3DCanvas";
import { ChevronDown, ChevronUp, BookOpen, Zap, Layers, Compass, Magnet, Wind } from "lucide-react";

export default function Chap1CourantsChamp() {
  const [showContinuityProof, setShowContinuityProof] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* PARTIE 1: COURANT ÉLECTRIQUE ET DENSITÉ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Partie 1 • Courant Électrique et Densité de Courant</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Modélisation du Courant Électrique
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
          Le courant électrique est un déplacement d&apos;ensemble de porteurs de charge (électrons dans un métal, ions dans une solution). Pour le modéliser localement, on définit le <strong>vecteur densité de courant</strong> <LatexMath math="\vec{j}" />.
        </p>

        {/* 1. Mouvement Thermique vs Entraînement */}
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          A. Agitation Thermique vs Vitesse de Dérive
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          En l&apos;absence de champ électrique, les électrons libres ont un mouvement chaotique très rapide (vitesse thermique). La vitesse moyenne est nulle. En appliquant un champ <LatexMath math="\vec{E}" />, ils acquièrent une lente <strong>vitesse de dérive</strong> superposée à ce chaos.
        </p>
        <div className="mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <DriftVelocity3DCanvas />
        </div>

        {/* 2. Vecteur Densité de Courant */}
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          B. Vecteur Densité de Courant <LatexMath math="\vec{j}" />
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Le vecteur <LatexMath math="\vec{j}" /> modélise ce déplacement localement. Son sens dépend du signe des porteurs de charge. Utilisez les contrôles pour voir l&apos;inversion du vecteur pour les électrons.
        </p>
        
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <CurrentDensity3DCanvas />
        </div>

        {/* 3. L'intensité (Flux) */}
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          C. Intensité du Courant (Flux de <LatexMath math="\vec{j}" />)
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          L&apos;intensité <LatexMath math="I" /> (en Ampères) correspond au <strong>flux</strong> du vecteur densité de courant à travers une surface <LatexMath math="S" />. Ce flux dépend de l&apos;angle entre <LatexMath math="\vec{j}" /> et la surface.
        </p>
        
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <CurrentFlux3DCanvas />
        </div>
      </section>

      {/* PARTIE 2: CONSERVATION DE LA CHARGE & REGIME PERMANENT */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Partie 2 • Loi de Conservation de la Charge</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          2. Équation de Continuité et Loi des Nœuds
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          La charge électrique est une grandeur conservative. Toute variation de charge dans un volume est obligatoirement due à un courant (flux) traversant sa surface frontière.
        </p>

        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-4 shadow-sm">
          <div className="text-center font-mono text-lg text-amber-500 mb-2 overflow-x-auto custom-scrollbar p-2">
            <LatexMath math="\text{div}(\vec{j}) + \frac{\partial \rho}{\partial t} = 0" block />
          </div>
          <p className="text-[11px] text-center text-amber-600/70 dark:text-amber-400/70 font-semibold">
            Équation Locale de la Conservation de la Charge
          </p>
        </div>

        {/* ACCORDION DEMONSTRATION CONTINUITE */}
        <div className="mb-6">
          <button
            onClick={() => setShowContinuityProof(!showContinuityProof)}
            className="w-full flex items-center justify-between text-xs font-bold text-amber-500 hover:text-amber-400 transition-all p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-sm"
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Démonstration : Obtention de l&apos;Équation de Continuité</span>
            </span>
            {showContinuityProof ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showContinuityProof && (
            <div className="mt-2 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-4 leading-relaxed animate-in fade-in duration-200">
              <p>Considérons un volume fixe <LatexMath math="(V)" /> délimité par une surface fermée <LatexMath math="(\Sigma)" />. La charge totale à l&apos;intérieur est :</p>
              <p className="text-center"><LatexMath math="Q_{int}(t) = \iiint_{(V)} \rho(\vec{r}, t) \, d\tau" /></p>
              <p>Par conservation, la variation de charge est due au flux sortant de courant :</p>
              <p className="text-center text-red-400"><LatexMath math="\frac{dQ_{int}}{dt} = - \iint_{(\Sigma)} \vec{j} \cdot d\vec{S}" /></p>
              <p>D&apos;après le <strong>théorème d&apos;Ostrogradski (Divergence-Flux)</strong> :</p>
              <p className="text-center text-emerald-400"><LatexMath math="\iint_{(\Sigma)} \vec{j} \cdot d\vec{S} = \iiint_{(V)} \text{div}(\vec{j}) \, d\tau" /></p>
              <p>En égalisant, l&apos;intégrande est nul : <LatexMath math="\text{div}(\vec{j}) + \frac{\partial \rho}{\partial t} = 0" /></p>
            </div>
          )}
        </div>

        {/* Régime Permanent et Loi des Nœuds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl sm:rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <span className="text-xs font-bold text-cyan-400 block mb-2">Régime Permanent (Stationnaire)</span>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
              Les grandeurs sont indépendantes du temps : <LatexMath math="\frac{\partial \rho}{\partial t} = 0" />.
            </p>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-cyan-300">
              <LatexMath math="\text{div}(\vec{j}) = 0" />
            </div>
            <p className="text-[10px] text-cyan-400/80 text-center mt-2">Le vecteur courant est à flux conservatif.</p>
          </div>
          
          <div className="p-4 rounded-xl sm:rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <span className="text-xs font-bold text-indigo-400 block mb-2">Forme Intégrale : Loi des Nœuds</span>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
              Puisque <LatexMath math="\text{div}(\vec{j}) = 0" />, le flux à travers toute surface fermée (un nœud) est nul.
            </p>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-indigo-300">
              <LatexMath math="\sum I_{entrant} = \sum I_{sortant}" />
            </div>
            <p className="text-[10px] text-indigo-400/80 text-center mt-2">Conservation des courants à un nœud.</p>
          </div>
        </div>
      </section>

      {/* PARTIE 3: FORCES MAGNETIQUES ET EFFET HALL */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <Magnet className="w-3.5 h-3.5" />
          <span>Partie 3 • Forces de Lorentz, Laplace et Effet Hall</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          3. Action du Champ Magnétique
        </h2>

        {/* Lorentz & Laplace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-bold text-purple-400 mb-2 border-b border-purple-500/20 pb-1">Force de Lorentz (Microscopique)</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Une particule de charge <LatexMath math="q" /> animée d&apos;une vitesse <LatexMath math="\vec{v}" /> dans un champ électromagnétique subit la force de Lorentz :
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-purple-300 shadow-inner mb-2">
              <LatexMath math="\vec{F} = q(\vec{E} + \vec{v} \wedge \vec{B})" block />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              La composante purement magnétique est <LatexMath math="\vec{F}_m = q(\vec{v} \wedge \vec{B})" />. Elle ne travaille jamais car elle est toujours perpendiculaire à <LatexMath math="\vec{v}" />.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-pink-400 mb-2 border-b border-pink-500/20 pb-1">Force de Laplace (Macroscopique)</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Pour un fil conducteur parcouru par un courant <LatexMath math="I" />, la résultante des forces de Lorentz sur les électrons donne la force de Laplace élémentaire :
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-pink-300 shadow-inner mb-2">
              <LatexMath math="d\vec{F} = I d\vec{l} \wedge \vec{B}" block />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              C&apos;est le principe de fonctionnement des moteurs électriques et des rails de Laplace.
            </p>
          </div>
        </div>

        {/* Right Hand Rule 3D Simulator */}
        <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
          Laboratoire 3D : Règle de la main droite (Lorentz)
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Modifiez le signe de la particule pour observer le sens de la force magnétique <LatexMath math="\vec{F}_m" /> résultant du produit vectoriel.
        </p>
        <div className="mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <RightHandRule3DCanvas />
        </div>

        {/* Effet Hall */}
        <h3 className="text-sm font-bold text-amber-400 mb-3 border-b border-amber-500/20 pb-1">L&apos;Effet Hall Classique</h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
          Lorsqu&apos;un ruban conducteur parcouru par un courant est placé dans un champ magnétique perpendiculaire, les porteurs de charge sont déviés par la force de Lorentz. Ils s&apos;accumulent sur un bord, créant un champ électrique de Hall <LatexMath math="\vec{E}_H" /> qui s&apos;oppose à cette déviation jusqu&apos;à l&apos;équilibre.
        </p>
        
        <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[11px] text-amber-500 font-bold block mb-1">Équilibre des forces :</span>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 text-center">
                <LatexMath math="q\vec{E}_H + q(\vec{v} \wedge \vec{B}) = \vec{0}" />
              </div>
            </div>
            <div>
              <span className="text-[11px] text-amber-500 font-bold block mb-1">Champ de Hall :</span>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 text-center">
                <LatexMath math="\vec{E}_H = -\vec{v} \wedge \vec{B}" />
              </div>
            </div>
          </div>
          <p className="text-[10px] text-amber-600/80 mt-3 italic text-center">
            Cette accumulation crée une tension mesurable (Tension de Hall <LatexMath math="V_H" />) qui permet notamment de déterminer le signe des porteurs de charge (effet très utilisé dans les capteurs magnétiques).
          </p>
        </div>
      </section>

      {/* PARTIE 4: CHAMP MAGNETOSTATIQUE ET SYMETRIES */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Partie 4 • Propriétés du Champ Magnétique</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          4. Nature du champ B et Symétries
        </h2>

        {/* Nature of B and Flux Conservation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-bold text-emerald-400 mb-2 border-b border-emerald-500/20 pb-1 flex items-center gap-2">
              Nature de <LatexMath math="\vec{B}" /> : Pseudo-Vecteur
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Contrairement au champ électrique (vecteur vrai), le champ magnétique est un <strong>vecteur axial (pseudo-vecteur)</strong> car il est issu d&apos;un produit vectoriel (Biot et Savart). Ses propriétés de symétrie sont <strong>inversées</strong> par rapport à celles d&apos;un vecteur classique.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-teal-400 mb-2 border-b border-teal-500/20 pb-1 flex items-center gap-2">
              <Wind className="w-4 h-4" /> Conservation du Flux Propre
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Il n&apos;existe pas de monopôles magnétiques isolés (charges magnétiques). Les lignes de champ B sont toujours fermées sur elles-mêmes.
            </p>
            <div className="flex flex-col gap-2 font-mono text-[11px] text-teal-300">
              <div className="bg-slate-950 border border-slate-800 p-2 rounded text-center">
                <LatexMath math="\text{div}(\vec{B}) = 0" /> (Locale)
              </div>
              <div className="bg-slate-950 border border-slate-800 p-2 rounded text-center">
                <LatexMath math="\iint_{(\Sigma \text{ fermée})} \vec{B} \cdot d\vec{S} = 0" /> (Intégrale)
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          Le principe de Curie stipule que &quot;les effets conservent les symétries des causes&quot;. Comprendre les plans de symétrie <LatexMath math="\Pi" /> et d&apos;antisymétrie <LatexMath math="\Pi^*" /> est crucial pour simplifier les calculs de <LatexMath math="\vec{B}" />.
        </p>

        {/* 3D Simulation for Symmetries */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <MagneticSymmetry3DCanvas />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/30 transition-all"></div>
            <span className="text-[13px] font-bold text-blue-500 block mb-2 font-sans flex items-center gap-2 relative z-10">
              Plan de Symétrie (<LatexMath math="\Pi" />)
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 relative z-10">
              Un plan est de symétrie si la distribution de courants y est symétrique (les courants &quot;appartiennent&quot; ou &quot;longent&quot; le plan).
            </p>
            <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-800/50 text-center font-mono text-sm text-blue-300 shadow-inner relative z-10">
              <LatexMath math="\vec{B}(M) \perp \Pi" />
            </div>
            <p className="text-[10px] text-blue-400 mt-2 text-center italic relative z-10">Conséquence du fait que B est un pseudo-vecteur.</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/30 transition-all"></div>
            <span className="text-[13px] font-bold text-emerald-500 block mb-2 font-sans flex items-center gap-2 relative z-10">
              Plan d&apos;Antisymétrie (<LatexMath math="\Pi^*" />)
            </span>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 relative z-10">
              Un plan est d&apos;antisymétrie si les courants le traversent perpendiculairement de part et d&apos;autre avec le même sens.
            </p>
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-center font-mono text-sm text-emerald-300 shadow-inner relative z-10">
              <LatexMath math="\vec{B}(M) \in \Pi^*" />
            </div>
            <p className="text-[10px] text-emerald-400 mt-2 text-center italic relative z-10">Le champ B appartient au plan.</p>
          </div>
        </div>

      </section>

    </div>
  );
}
