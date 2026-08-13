"use client";

import React from "react";
import LatexMath from "@/components/ui/LatexMath";
import dynamic from 'next/dynamic';
import LazyMount from "@/components/ui/LazyMount";

const VectorPotential3DCanvas = dynamic(() => import("../components/VectorPotential3DCanvas"), { ssr: false });
const MagneticDipole3DCanvas = dynamic(() => import("../components/MagneticDipole3DCanvas"), { ssr: false });
const HallEffect3DCanvas = dynamic(() => import("../components/HallEffect3DCanvas"), { ssr: false });

import { Calculator, Compass, Layers, Sparkles, Activity, Magnet } from "lucide-react";

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

export default function Chap3PotentielDipole() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 1: LE POTENTIEL VECTEUR              */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Partie 1 • Le Potentiel Vecteur (A)</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          1. Définition et Équations de <LatexMath math="\vec{A}" />
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Puisque le champ magnétique a une divergence nulle (<LatexMath math="\text{div}(\vec{B}) = 0" />), l'analyse vectorielle nous autorise à définir un vecteur <LatexMath math="\vec{A}" /> tel que son rotationnel soit égal au champ magnétique. Ce vecteur est appelé le <strong>Potentiel Vecteur</strong>.
        </p>

        <div className="mb-6">
          <FormulaCard label="Définition du Potentiel Vecteur" color="purple">
            <span className="text-purple-400">
              <LatexMath math="\vec{B} = \vec{\nabla} \wedge \vec{A} = \text{rot}(\vec{A})" />
            </span>
          </FormulaCard>
        </div>

        {/* Section Démonstrations Dépliantes */}
        <div className="space-y-4 mb-8">
          
          {/* Démonstration depuis Biot et Savart */}
          <details className="group bg-slate-900/40 border border-purple-500/20 rounded-xl overflow-hidden cursor-pointer transition-colors hover:border-purple-500/40">
            <summary className="p-5 font-bold text-purple-400 text-sm uppercase tracking-wide flex items-center justify-between outline-none">
              Démonstration : Origine de <LatexMath math="\vec{A}" /> depuis Biot-Savart
              <span className="text-purple-500 group-open:rotate-180 transition-transform duration-300">▼</span>
            </summary>
            
            <div className="p-5 pt-0 border-t border-purple-500/10 mt-2 text-sm text-muted-foreground space-y-4">
              <p>À partir de la loi de Biot et Savart pour une distribution volumique :</p>
              <div className="flex justify-center bg-black/20 p-2 rounded">
                <LatexMath math="\vec{B}(M) = \frac{\mu_0}{4\pi} \iiint \frac{\vec{j}(P) \wedge \vec{u}}{r^2} d\tau" />
              </div>
              
              <p>Remarquons une relation géométrique importante : <LatexMath math="\frac{\vec{u}}{r^2} = -\vec{\text{grad}}_M\left(\frac{1}{r}\right)" />. En utilisant l'identité vectorielle <LatexMath math="\vec{V} \wedge \vec{\text{grad}}(f) = f \cdot \text{rot}(\vec{V}) - \text{rot}(f\vec{V})" /> et sachant que le courant <LatexMath math="\vec{j}(P)" /> ne dépend pas du point d'observation <LatexMath math="M" /> (donc <LatexMath math="\text{rot}_M(\vec{j}(P)) = \vec{0}" />) :</p>
              <div className="flex justify-center bg-black/20 p-2 rounded text-xs sm:text-base overflow-x-auto">
                <LatexMath math="\vec{j}(P) \wedge \frac{\vec{u}}{r^2} = \vec{j}(P) \wedge \left(-\vec{\text{grad}}_M\frac{1}{r}\right) = \text{rot}_M\left(\frac{\vec{j}(P)}{r}\right)" />
              </div>
              
              <p>En réinjectant ce résultat dans l'intégrale et en sortant l'opérateur rotationnel (qui n'agit que sur <LatexMath math="M" /> et non sur la variable d'intégration <LatexMath math="P" />) :</p>
              <div className="flex justify-center bg-black/20 p-3 rounded text-xs sm:text-base overflow-x-auto shadow-inner border border-purple-500/20">
                <LatexMath math="\vec{B}(M) = \text{rot}_M \left( \frac{\mu_0}{4\pi} \iiint \frac{\vec{j}(P)}{r} d\tau \right) = \text{rot}_M(\vec{A}(M))" />
              </div>
              <p className="text-purple-300 italic text-center">On retrouve bien l'expression du Potentiel Vecteur !</p>
            </div>
          </details>

          {/* Démonstration Flux */}
          <details className="group bg-emerald-500/5 border border-emerald-500/20 rounded-xl overflow-hidden cursor-pointer transition-colors hover:border-emerald-500/40">
            <summary className="p-5 font-bold text-emerald-400 text-sm uppercase tracking-wide flex items-center justify-between outline-none">
              Démonstration : Flux Magnétique & Théorème de Stokes
              <span className="text-emerald-500 group-open:rotate-180 transition-transform duration-300">▼</span>
            </summary>
            
            <div className="p-5 pt-0 border-t border-emerald-500/10 mt-2 text-sm text-muted-foreground space-y-4">
              <p>Comment lier le flux magnétique <LatexMath math="\Phi" /> et le potentiel vecteur <LatexMath math="\vec{A}" /> ?</p>
              <p>Le flux à travers une surface <LatexMath math="S" /> s'appuyant sur un contour fermé <LatexMath math="\mathcal{C}" /> est défini par :</p>
              <div className="flex justify-center bg-black/20 p-2 rounded">
                <LatexMath math="\Phi = \iint_S \vec{B} \cdot d\vec{S} = \iint_S \text{rot}(\vec{A}) \cdot d\vec{S}" />
              </div>
              
              <p>D'après le célèbre <strong>Théorème de Stokes-Ampère</strong>, le flux du rotationnel d'un champ vectoriel à travers une surface est égal à la circulation de ce champ le long de son contour. On obtient directement :</p>
              <div className="flex justify-center bg-black/20 p-3 rounded shadow-inner border border-emerald-500/20">
                <LatexMath math="\Phi = \oint_{\mathcal{C}} \vec{A} \cdot d\vec{l}" />
              </div>
              
              <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg flex flex-col items-center gap-2 border border-emerald-500/30">
                <span className="text-emerald-400 font-bold">Corollaire (Surface fermée)</span>
                <span className="text-emerald-300">Pour une surface fermée (sans contour), la circulation est nulle : <LatexMath math="\oiint \vec{B} \cdot d\vec{S} = 0" /></span>
                <span className="text-xs italic text-emerald-500">C'est la preuve qu'il n'existe pas de monopôle magnétique.</span>
              </div>
            </div>
          </details>

        </div>

        {/* Résumé des distributions */}
        <div className="bg-background border border-border p-5 rounded-xl mb-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-blue-400" /> Bilan : Expressions de <LatexMath math="\vec{A}" /> selon le type de source</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
              <span className="font-bold mb-3 text-foreground/80">Courant Linéique (Fil)</span>
              <LatexMath math="\vec{A}(M) = \frac{\mu_0}{4\pi} \int_{\mathcal{C}} \frac{I d\vec{l}}{r}" />
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
              <span className="font-bold mb-3 text-foreground/80">Courant Surfacique (Plaque)</span>
              <LatexMath math="\vec{A}(M) = \frac{\mu_0}{4\pi} \iint_S \frac{\vec{j}_s dS}{r}" />
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
              <span className="font-bold mb-3 text-foreground/80">Courant Volumique (Cylindre)</span>
              <LatexMath math="\vec{A}(M) = \frac{\mu_0}{4\pi} \iiint_{\tau} \frac{\vec{j}_v d\tau}{r}" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl h-full flex flex-col">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-400" /> La Jauge de Coulomb
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed flex-1">
              Le vecteur <LatexMath math="\vec{A}" /> n'est pas unique. On fixe généralement sa divergence à zéro en magnétostatique (Jauge de Coulomb) :
            </p>
            <div className="flex justify-center mb-3">
              <LatexMath math="\text{div}(\vec{A}) = 0" />
            </div>
          </div>
          
          <div className="bg-background border border-border p-4 sm:p-5 rounded-xl h-full flex flex-col">
            <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" /> Équation de Poisson
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed flex-1">
              Avec la jauge de Coulomb et le théorème d'Ampère local (<LatexMath math="\text{rot}(\vec{B}) = \mu_0 \vec{j}" />), on obtient l'équation de Poisson vectorielle, analogue à l'électrostatique :
            </p>
            <div className="flex justify-center">
              <LatexMath math="\Delta \vec{A} + \mu_0 \vec{j} = \vec{0}" />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-[950px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Simulateur 3D : Lignes de <LatexMath math="\vec{A}" /> et <LatexMath math="\vec{B}" />
            </h3>
            <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
              Observer la relation entre <LatexMath math="\vec{A}" />, <LatexMath math="\vec{B}" /> et le courant <LatexMath math="I" />
            </div>
          </div>
          
          <div className="w-full">
            <LazyMount height="380px" fallbackText="Chargement Potentiel Vecteur 3D...">
              <VectorPotential3DCanvas />
            </LazyMount>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 2: LE DIPOLE MAGNETIQUE              */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-extrabold mb-3">
          <Magnet className="w-3.5 h-3.5" />
          <span>Partie 2 • Le Dipôle Magnétique</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          2. Moment Magnétique et Approximation Dipolaire
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Un circuit filiforme plan fermé parcouru par un courant <LatexMath math="I" /> constitue un dipôle magnétique. Il est caractérisé par son <strong>moment magnétique</strong> <LatexMath math="\vec{m}" />. L'approximation dipolaire consiste à calculer le champ à une distance <LatexMath math="r" /> très grande devant les dimensions du circuit.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="flex flex-col">
            <LazyMount height="400px" fallbackText="Chargement Dipôle Magnétique 3D...">
              <MagneticDipole3DCanvas />
            </LazyMount>
          </div>
          
          <div className="space-y-4">
            <FormulaCard label="Moment Magnétique" color="amber">
              <span className="text-yellow-500">
                <LatexMath math="\vec{m} = I \iint d\vec{S} = I \cdot S \cdot \vec{n}" />
              </span>
            </FormulaCard>

            <div className="bg-background border border-border p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Expressions en lointain (Coordonnées Sphériques)
              </h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Le potentiel vecteur créé par le dipôle en un point éloigné est :
              </p>
              <div className="flex justify-center mb-3">
                <LatexMath math="\vec{A}(M) = \frac{\mu_0}{4\pi} \frac{\vec{m} \wedge \vec{u}_r}{r^2}" />
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Le champ magnétique dipolaire (qui dérive de <LatexMath math="\vec{A}" />) est :
              </p>
              <div className="flex justify-center">
                <LatexMath math="\vec{B}(M) = \frac{\mu_0}{4\pi r^3} [3(\vec{m}\cdot\vec{u}_r)\vec{u}_r - \vec{m}]" />
              </div>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-red-400 mb-2">Actions Mécaniques</h3>
              <p className="text-[13px] text-muted-foreground mb-2">Placé dans un champ <LatexMath math="\vec{B}_{ext}" /> uniforme, le dipôle subit un couple (moment des forces) tendant à l'aligner avec le champ :</p>
              <div className="flex justify-center mb-2"><LatexMath math="\vec{\Gamma} = \vec{m} \wedge \vec{B}_{ext}" /></div>
              <p className="text-[13px] text-muted-foreground mb-2">Son énergie potentielle est minimale lorsqu'il est aligné :</p>
              <div className="flex justify-center"><LatexMath math="E_p = -\vec{m} \cdot \vec{B}_{ext}" /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 3: L'EFFET HALL                      */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Partie 3 • Application Classique</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          3. L'Effet Hall
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Découvert par Edwin Hall en 1879, cet effet se produit lorsqu'un conducteur parcouru par un courant <LatexMath math="I" /> est placé dans un champ magnétique <LatexMath math="\vec{B}" /> perpendiculaire. La force de Lorentz dévie les porteurs de charge, créant une accumulation sur les bords de la plaque, générant ainsi un <strong>Champ de Hall</strong> <LatexMath math="\vec{E}_H" /> et une tension mesurable.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="space-y-4">
            <div className="bg-background border border-border p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-foreground mb-2">Origine Physique</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Les porteurs animés à la vitesse <LatexMath math="\vec{v}" /> subissent la force de Lorentz <LatexMath math="\vec{F}_m = q(\vec{v} \wedge \vec{B})" />. 
                <br /><br />
                En régime permanent, la force électrique due au champ de Hall compense exactement la force magnétique :
              </p>
              <div className="flex justify-center mb-3">
                <LatexMath math="q\vec{E}_H + q(\vec{v} \wedge \vec{B}) = \vec{0} \implies \vec{E}_H = -\vec{v} \wedge \vec{B}" />
              </div>
            </div>

            <div className="bg-cyan-500/5 border border-cyan-500/20 p-4 sm:p-5 rounded-xl">
              <h3 className="font-bold text-cyan-400 mb-2">Utilité de l'Effet Hall</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground leading-relaxed space-y-1">
                <li>Déterminer le signe des porteurs de charge (Trous vs Électrons).</li>
                <li>Mesurer l'intensité d'un champ magnétique (Teslamètre à effet Hall).</li>
                <li>Mesurer la densité <LatexMath math="n" /> des porteurs de charge.</li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col">
            <LazyMount height="400px" fallbackText="Chargement Effet Hall 3D...">
              <HallEffect3DCanvas />
            </LazyMount>
            <p className="text-xs text-center text-muted-foreground mt-2 italic">
              Remarque : Indépendamment du signe de la charge, la déviation s'effectue du même côté. C'est donc le signe de la tension de Hall <LatexMath math="U_H" /> qui révèle la nature des porteurs.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
