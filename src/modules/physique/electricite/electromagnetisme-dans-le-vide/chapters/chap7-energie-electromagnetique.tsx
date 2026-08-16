"use client";

import React from "react";
import LatexMath from "@/components/ui/LatexMath";
import dynamic from 'next/dynamic';
import LazyMount from "@/components/ui/LazyMount";

const EMEnergyDensity3DCanvas = dynamic(() => import("../components/EMEnergyDensity3DCanvas"), { ssr: false });
const PoyntingWave3DCanvas = dynamic(() => import("../components/PoyntingWave3DCanvas"), { ssr: false });
const PoyntingWire3DCanvas = dynamic(() => import("../components/PoyntingWire3DCanvas"), { ssr: false });
const PoyntingDipoleRadiation3DCanvas = dynamic(() => import("../components/PoyntingDipoleRadiation3DCanvas"), { ssr: false });

import { Calculator, Compass, Layers, Sparkles, Activity, Zap, Flame, Radio } from "lucide-react";

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

export default function Chap7EnergieElectromagnetique() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 1: DENSITE D'ENERGIE                   */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Partie 1 • Densité d'Énergie Électromagnétique</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          1. L'Énergie stockée dans les champs <LatexMath math="\vec{E}" /> et <LatexMath math="\vec{B}" />
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Une région de l'espace où règnent un champ électrique et un champ magnétique possède de l'énergie. L'énergie totale est la somme de l'énergie électrique et de l'énergie magnétique. On définit la <strong>densité volumique d'énergie électromagnétique</strong> <LatexMath math="u_{em}" /> (en Joules par mètre cube).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="space-y-4">
            <FormulaCard label="Densité d'énergie Électromagnétique" color="cyan">
              <span className="text-blue-400">
                <LatexMath math="u_{em} = \frac{1}{2} \varepsilon_0 E^2 + \frac{B^2}{2\mu_0}" />
              </span>
            </FormulaCard>

            <div className="bg-background border border-border p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" /> Énergie Électrique (<LatexMath math="u_e" />)
              </h3>
              <p className="text-sm text-muted-foreground mb-1 leading-relaxed">
                Stockée principalement dans les condensateurs.
              </p>
              <div className="flex justify-center">
                <LatexMath math="u_e = \frac{1}{2} \varepsilon_0 E^2" />
              </div>
            </div>
            
            <div className="bg-background border border-border p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" /> Énergie Magnétique (<LatexMath math="u_m" />)
              </h3>
              <p className="text-sm text-muted-foreground mb-1 leading-relaxed">
                Stockée principalement dans les bobines et inductances.
              </p>
              <div className="flex justify-center">
                <LatexMath math="u_m = \frac{B^2}{2\mu_0}" />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <LazyMount height="400px" fallbackText="Chargement Condensateur vs Bobine 3D...">
              <EMEnergyDensity3DCanvas />
            </LazyMount>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Modifie la tension (Champ E) et le courant (Champ B) pour voir comment se répartit l'énergie volumique.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 2: LE VECTEUR DE POYNTING            */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Partie 2 • Le Vecteur de Poynting</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          2. Définition et Onde Électromagnétique
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          L'énergie électromagnétique peut se déplacer dans l'espace. Le <strong>vecteur de Poynting</strong>, noté <LatexMath math="\vec{\Pi}" /> (ou <LatexMath math="\vec{S}" /> en anglais), représente la densité surfacique de puissance (en <LatexMath math="\text{W} \cdot \text{m}^{-2}" />). Sa direction indique la direction de propagation de l'énergie.
        </p>

        <div className="mb-6">
          <FormulaCard label="Vecteur de Poynting" color="purple">
            <span className="text-purple-400">
              <LatexMath math="\vec{\Pi} = \frac{\vec{E} \wedge \vec{B}}{\mu_0}" />
            </span>
          </FormulaCard>
        </div>

        <div className="flex flex-col mb-6">
          <LazyMount height="400px" fallbackText="Chargement Onde Plane 3D...">
            <PoyntingWave3DCanvas />
          </LazyMount>
          <p className="text-xs text-center text-muted-foreground mt-2 italic">
            Dans une onde plane progressive, <LatexMath math="\vec{E}" /> et <LatexMath math="\vec{B}" /> oscillent perpendiculairement, et <LatexMath math="\vec{\Pi}" /> (violet) pointe toujours dans le sens de la propagation à la vitesse <LatexMath math="c" />.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 3: BILAN ÉNERGÉTIQUE (EFFET JOULE)     */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-extrabold mb-3">
          <Flame className="w-3.5 h-3.5" />
          <span>Partie 3 • Bilan Énergétique Local</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          3. Théorème de Poynting et Effet Joule
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="space-y-4">
            <div className="bg-background border border-border p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-foreground mb-2">Théorème de Poynting</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Il traduit la conservation de l'énergie. La diminution de l'énergie électromagnétique dans un volume sert à :
                <br/>1) Fournir de la puissance mécanique aux charges (<LatexMath math="\vec{j}\cdot\vec{E}" />).
                <br/>2) Faire sortir de l'énergie par la surface (flux de Poynting).
              </p>
              <div className="flex justify-center mb-1">
                <LatexMath math="-\frac{\partial u_{em}}{\partial t} = \text{div}(\vec{\Pi}) + \vec{j} \cdot \vec{E}" />
              </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-red-400 mb-2">L'Effet Joule vu par Poynting</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                C'est un résultat fascinant ! Dans un conducteur ohmique (résistance), l'énergie qui se transforme en chaleur ne voyage pas *à l'intérieur* du fil, mais à l'extérieur. Le vecteur de Poynting <strong>plonge radialement de la surface vers le centre du fil</strong> pour y être dissipé sous forme de chaleur.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col">
            <LazyMount height="400px" fallbackText="Chargement Effet Joule 3D...">
              <PoyntingWire3DCanvas />
            </LazyMount>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Fil conducteur avec un courant constant. Observe comment le vecteur <LatexMath math="\vec{\Pi}" /> (violet) pointe vers le centre du fil !
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 4: RAYONNEMENT DIPOLAIRE               */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight flex items-center gap-2">
          <Radio className="w-5 h-5 text-amber-500" />
          4. Application : Rayonnement d'une antenne dipolaire
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col justify-center space-y-4">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Une charge accélérée ou un dipôle oscillant rayonne de l'énergie dans l'espace. C'est le principe de fonctionnement de toutes les antennes radio (Wi-Fi, 4G, 5G).
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Le vecteur de Poynting moyen s'éloigne radialement, transportant la puissance électromagnétique. Cette puissance rayonnée (formule de Larmor) est proportionnelle à la fréquence à la puissance 4 (<LatexMath math="\omega^4" />).
            </p>
          </div>
          
          <div className="flex flex-col">
            <LazyMount height="350px" fallbackText="Chargement Rayonnement 3D...">
              <PoyntingDipoleRadiation3DCanvas />
            </LazyMount>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Ondes sphériques rayonnées par un dipôle oscillant au centre.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
