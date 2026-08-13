"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';
import LazyMount from "@/components/ui/LazyMount";

const FaradayLaw3DCanvas = dynamic(() => import("../components/FaradayLaw3DCanvas"), { ssr: false });
const LaplaceRail3DCanvas = dynamic(() => import("../components/LaplaceRail3DCanvas"), { ssr: false });

import LatexMath from "@/components/ui/LatexMath";
import { ChevronDown, ChevronUp, Zap, Activity, Magnet, RefreshCw, Compass, ShieldAlert } from "lucide-react";

export default function Chap4InductionElectromagnetique() {
  const [showLenzProof, setShowLenzProof] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* PARTIE 1: LOI DE FARADAY ET LENZ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Induction • Lois Fondamentales</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Loi de Lenz et Loi de Faraday
        </h2>
        
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          L'induction électromagnétique est le phénomène par lequel une variation de flux magnétique à travers un circuit induit une force électromotrice (f.e.m) dans ce circuit.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
              <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4" /> La Loi de Faraday
              </h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                La force électromotrice induite <LatexMath math="e" /> dans un circuit est égale à l'opposé de la dérivée par rapport au temps du flux magnétique <LatexMath math="\Phi" /> traversant ce circuit.
              </p>
              <div className="bg-background/80 p-3 sm:p-4 rounded-lg flex justify-center border border-border/50 overflow-x-auto shadow-inner">
                <LatexMath math="e = -\frac{d\Phi}{dt}" />
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
              <h3 className="font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> La Loi de Lenz
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Le courant induit s'oppose par ses effets à la cause qui lui donne naissance. Le signe (-) dans la loi de Faraday traduit directement ce principe de modération.
              </p>
            </div>
            
            <div className="bg-blue-500/5 border border-blue-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Champ Électromoteur</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Le champ électromoteur d'induction <LatexMath math="\vec{E}_m" /> est relié à la f.e.m par la circulation sur le contour <LatexMath math="\Gamma" /> du circuit :
              </p>
              <div className="bg-background/80 p-2 sm:p-3 rounded-lg flex justify-center border border-border/50 shadow-inner">
                <LatexMath math="e = \oint_{\Gamma} \vec{E}_m \cdot d\vec{l}" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <LazyMount height="400px" fallbackText="Chargement Simulateur Loi de Faraday...">
              <FaradayLaw3DCanvas />
            </LazyMount>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Expérience de l'aimant et de la bobine : Le galvanomètre dévie lors du mouvement de l'aimant.
            </p>
          </div>
        </div>
      </section>

      {/* PARTIE 2: RAIL DE LAPLACE */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Application • Freinage par Induction</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          2. Rail de Laplace et Freinage
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="flex flex-col justify-center">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
              L'expérience du rail de Laplace illustre parfaitement le couplage électromécanique. Une tige conductrice glisse sur des rails dans un champ magnétique uniforme <LatexMath math="\vec{B}" />. 
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
              En se déplaçant à la vitesse <LatexMath math="\vec{v}" />, la tige "coupe" les lignes de champ, créant une f.e.m de mouvement. Cette f.e.m génère un courant induit <LatexMath math="i" /> qui, à son tour, subit une force de Laplace <LatexMath math="\vec{F}_L" /> s'opposant au mouvement.
            </p>
            <div className="bg-background/80 p-3 sm:p-4 rounded-lg flex flex-col gap-2 border border-border/50 shadow-inner overflow-x-auto">
              <LatexMath math="e = B \cdot L \cdot v" />
              <LatexMath math="\vec{F}_L = i(\vec{L} \times \vec{B})" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <LazyMount height="400px" fallbackText="Chargement Simulateur Rail de Laplace...">
              <LaplaceRail3DCanvas />
            </LazyMount>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Freinage par induction : La barre lancée à <LatexMath math="v_0" /> s'arrête progressivement.
            </p>
          </div>
        </div>
        
        {/* Bilan Energétique */}
        <div className="bg-slate-900 text-slate-200 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md border border-slate-700/50">
          <h3 className="font-bold text-amber-400 mb-3 text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4" /> Bilan Énergétique
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
            L'énergie cinétique initiale de la barre est entièrement convertie en chaleur par effet Joule dans la résistance <LatexMath math="R" /> du circuit. La puissance mécanique est égale, au signe près, à la puissance électrique.
          </p>
          <div className="flex justify-center bg-slate-950 p-3 rounded-lg border border-slate-800 shadow-inner">
            <LatexMath math="\mathcal{P}_{méc} + \mathcal{P}_{élec} = 0 \implies -F_L \cdot v = R \cdot i^2" />
          </div>
        </div>
      </section>

      {/* PARTIE 3: CADRE TOURNANT & FOUCAULT */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-500" />
          3. Cadre Tournant, Haut-Parleur et Foucault
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
            <h3 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2">Cadre Tournant</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Un cadre de surface <LatexMath math="S" /> tournant à la vitesse angulaire <LatexMath math="\omega" /> dans un champ <LatexMath math="\vec{B}" /> constant est traversé par un flux variable :
            </p>
            <LatexMath math="\Phi(t) = B \cdot S \cos(\omega t)" />
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              Il en résulte une f.e.m sinusoïdale (Principe de l'alternateur).
            </p>
          </div>

          <div className="bg-purple-500/5 border border-purple-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
            <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Haut-parleur</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le haut-parleur électrodynamique exploite la force de Laplace. Une bobine mobile, parcourue par un courant variable issu d'un amplificateur, plonge dans l'entrefer d'un aimant permanent. La bobine vibre et entraîne la membrane.
            </p>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl md:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-orange-600 dark:text-orange-400 mb-2">Courants de Foucault</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ce sont des courants induits qui naissent dans des masses métalliques massives soumises à une variation de flux. Ils dissipent beaucoup d'énergie par effet Joule, utilisés pour le freinage (camions) ou le chauffage à induction.
            </p>
          </div>
        </div>
      </section>

      {/* PARTIE 4: INDUCTANCES ET ENERGIE */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-3">
          <Magnet className="w-3.5 h-3.5" />
          <span>Auto-Induction • Énergie Magnétique</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          4. Inductance Propre et Mutuelle
        </h2>
        
        <div className="space-y-4">
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl">
            <h3 className="font-bold text-foreground mb-2">Auto-induction (Inductance Propre <LatexMath math="L" />)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Un circuit parcouru par un courant <LatexMath math="i" /> crée son propre flux magnétique <LatexMath math="\Phi_P" /> à travers lui-même. Ce flux est proportionnel à l'intensité :
            </p>
            <div className="flex justify-center mb-3">
              <LatexMath math="\Phi_P = L \cdot i \implies e_L = -L \frac{di}{dt}" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le coefficient <LatexMath math="L" /> est toujours positif et s'exprime en Henry (H).
            </p>
          </div>

          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl">
            <h3 className="font-bold text-foreground mb-2">Inductance Mutuelle (<LatexMath math="M" />)</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              Pour deux circuits filiformes 1 et 2, le flux magnétique envoyé par le circuit 1 à travers le circuit 2 est proportionnel au courant <LatexMath math="i_1" />. Le théorème de Neumann garantit que <LatexMath math="M_{12} = M_{21} = M" />.
            </p>
            <div className="flex justify-center">
              <LatexMath math="\Phi_{1 \rightarrow 2} = M \cdot i_1" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-rose-950 to-slate-900 border border-rose-900/50 p-4 sm:p-6 rounded-xl">
            <h3 className="font-bold text-rose-400 mb-2 text-sm sm:text-base uppercase tracking-wider">
              Énergie Magnétique
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              L'énergie emmagasinée par une bobine (ou un circuit) traversée par un courant <LatexMath math="i" /> est stockée sous forme de champ magnétique.
            </p>
            <div className="flex justify-center bg-black/40 p-4 rounded-lg shadow-inner">
              <LatexMath math="E_{m} = \frac{1}{2} L i^2" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
