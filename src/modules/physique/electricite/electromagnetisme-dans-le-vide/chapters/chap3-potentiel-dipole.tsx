"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";
import dynamic from 'next/dynamic';
import LazyMount from "@/components/ui/LazyMount";

const VectorPotential3DCanvas = dynamic(() => import("../components/VectorPotential3DCanvas"), { ssr: false });
const MagneticDipole3DCanvas = dynamic(() => import("../components/MagneticDipole3DCanvas"), { ssr: false });
const HallEffect3DCanvas = dynamic(() => import("../components/HallEffect3DCanvas"), { ssr: false });
const VectorPotentialExercise3DCanvas = dynamic(() => import("../components/VectorPotentialExercise3DCanvas"), { ssr: false });
const VectorPotentialCurves = dynamic(() => import("../components/VectorPotentialCurves"), { ssr: false });
const SolenoidPotentialExercise3DCanvas = dynamic(() => import("../components/SolenoidPotentialExercise3DCanvas"), { ssr: false });

import { Calculator, Compass, Layers, Sparkles, Activity, Magnet, ChevronDown, ChevronUp, BookOpen } from "lucide-react";

/* ── Collapsible Panel Component ── */
function CollapsibleStep({
  step,
  title,
  color,
  children,
  defaultOpen = false,
}: {
  step: number;
  title: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    cyan: { bg: "bg-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-300", dot: "bg-cyan-500" },
    teal: { bg: "bg-teal-500/5", border: "border-teal-500/20", text: "text-teal-300", dot: "bg-teal-500" },
    blue: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-300", dot: "bg-blue-500" },
    emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-500" },
    amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-300", dot: "bg-amber-500" },
    pink: { bg: "bg-pink-500/5", border: "border-pink-500/20", text: "text-pink-300", dot: "bg-pink-500" },
    orange: { bg: "bg-orange-500/5", border: "border-orange-500/20", text: "text-orange-300", dot: "bg-orange-500" },
    purple: { bg: "bg-purple-500/5", border: "border-purple-500/20", text: "text-purple-300", dot: "bg-purple-500" },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`rounded-xl ${c.bg} border ${c.border} overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className={`w-7 h-7 rounded-full ${c.dot} flex items-center justify-center text-white text-xs font-black shrink-0 shadow-lg`}>
          {step}
        </div>
        <span className={`text-xs sm:text-sm font-bold ${c.text} flex-1 text-left`}>{title}</span>
        {open ? (
          <ChevronUp className={`w-4 h-4 ${c.text} shrink-0`} />
        ) : (
          <ChevronDown className={`w-4 h-4 ${c.text} shrink-0`} />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-1 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

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

        <div className="space-y-4 sm:space-y-6 mb-8">
          <FormulaCard label="Moment Magnétique" color="amber">
            <span className="text-yellow-500">
              <LatexMath math="\vec{m} = I \iint d\vec{S} = I \cdot S \cdot \vec{n}" />
            </span>
          </FormulaCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-background border border-border p-4 sm:p-5 rounded-xl h-full flex flex-col">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" /> Expressions en lointain
              </h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed flex-1">
                Le potentiel vecteur créé par le dipôle en un point éloigné est :
              </p>
              <div className="flex justify-center mb-3">
                <LatexMath math="\vec{A}(M) = \frac{\mu_0}{4\pi} \frac{\vec{m} \wedge \vec{u}_r}{r^2}" />
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed flex-1">
                Le champ magnétique dipolaire (qui dérive de <LatexMath math="\vec{A}" />) est :
              </p>
              <div className="flex justify-center">
                <LatexMath math="\vec{B}(M) = \frac{\mu_0}{4\pi r^3} [3(\vec{m}\cdot\vec{u}_r)\vec{u}_r - \vec{m}]" />
              </div>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 p-4 sm:p-5 rounded-xl h-full flex flex-col">
              <h3 className="font-bold text-red-400 mb-2">Actions Mécaniques</h3>
              <p className="text-[13px] text-muted-foreground mb-2 flex-1">Placé dans un champ <LatexMath math="\vec{B}_{ext}" /> uniforme, le dipôle subit un couple tendant à l'aligner avec le champ :</p>
              <div className="flex justify-center mb-4"><LatexMath math="\vec{\Gamma} = \vec{m} \wedge \vec{B}_{ext}" /></div>
              <p className="text-[13px] text-muted-foreground mb-2 flex-1">Son énergie potentielle est minimale lorsqu'il est aligné :</p>
              <div className="flex justify-center"><LatexMath math="E_p = -\vec{m} \cdot \vec{B}_{ext}" /></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-[950px] mx-auto mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 flex items-center gap-2">
              <Magnet className="w-5 h-5 text-yellow-500" />
              Simulateur 3D : Vecteurs <LatexMath math="\vec{A}" /> et <LatexMath math="\vec{B}" />
            </h3>
            <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
              Déplacez M pour observer les champs
            </div>
          </div>
          
          <div className="w-full">
            <LazyMount height="450px" fallbackText="Chargement Dipôle Magnétique 3D...">
              <MagneticDipole3DCanvas />
            </LazyMount>
          </div>
        </div>

        {/* Démonstration Détaillée : Dipôle Magnétique */}
        <div className="space-y-4 mb-8 mt-6">
          <details className="group bg-yellow-500/5 border border-yellow-500/20 rounded-xl overflow-hidden cursor-pointer transition-colors hover:border-yellow-500/40">
            <summary className="p-5 font-bold text-yellow-500 text-sm uppercase tracking-wide flex items-center justify-between outline-none">
              Démonstration Détaillée : Calcul de A et B pour le Dipôle
              <span className="text-yellow-500 group-open:rotate-180 transition-transform duration-300">▼</span>
            </summary>
            
            <div className="p-5 pt-0 border-t border-yellow-500/10 mt-2 text-sm text-muted-foreground space-y-6">
              
              {/* Étape 1 */}
              <div>
                <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-500 w-5 h-5 flex items-center justify-center rounded-full text-xs">1</span> 
                  Expression Intégrale et Théorème de Kelvin
                </h4>
                <p className="mb-2">Le potentiel vecteur créé par une boucle de courant <LatexMath math="I" /> en un point <LatexMath math="M" /> est donné par l'intégrale sur le contour fermé :</p>
                <div className="flex justify-center bg-black/20 p-2 rounded mb-3">
                  <LatexMath math="\vec{A}(M) = \frac{\mu_0 I}{4\pi} \oint \frac{d\vec{l}}{r'}" />
                </div>
                <p className="mb-2">En appliquant le théorème de Stokes (ou théorème de Kelvin) pour une fonction scalaire <LatexMath math="f = \frac{1}{r'}" /> :</p>
                <div className="flex justify-center bg-black/20 p-2 rounded mb-3 overflow-x-auto">
                  <LatexMath math="\oint f d\vec{l} = \iint d\vec{S} \wedge \vec{\text{grad}}(f)" />
                </div>
                <p>Or le gradient de <LatexMath math="\frac{1}{r'}" /> par rapport au point source <LatexMath math="P" /> donne : <LatexMath math="\vec{\text{grad}}_P\left(\frac{1}{r'}\right) = \frac{\vec{r}'}{r'^3}" />. D'où :</p>
                <div className="flex justify-center bg-black/20 p-3 rounded border border-yellow-500/20 mt-3 overflow-x-auto">
                  <LatexMath math="\vec{A}(M) = \frac{\mu_0 I}{4\pi} \iint d\vec{S} \wedge \frac{\vec{r}'}{r'^3}" />
                </div>
              </div>

              {/* Étape 2 */}
              <div className="border-t border-yellow-500/10 pt-4">
                <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-500 w-5 h-5 flex items-center justify-center rounded-full text-xs">2</span> 
                  Approximation Dipolaire et Moment Magnétique
                </h4>
                <p className="mb-2">Pour un point <LatexMath math="M" /> très éloigné de la boucle (<LatexMath math="OM = r \gg R" />), on peut faire l'approximation <LatexMath math="\vec{r}' \approx \vec{r}" />. Puisque <LatexMath math="\vec{r}" /> ne dépend pas de la surface d'intégration, on peut le sortir :</p>
                <div className="flex justify-center bg-black/20 p-2 rounded mb-3 overflow-x-auto">
                  <LatexMath math="\vec{A}(M) = \frac{\mu_0}{4\pi} \left( I \iint d\vec{S} \right) \wedge \frac{\vec{r}}{r^3}" />
                </div>
                <p className="mb-2">On identifie le <strong>moment magnétique</strong> <LatexMath math="\vec{m} = I \vec{S}" /> :</p>
                <div className="flex justify-center bg-black/20 p-3 rounded shadow-inner border border-yellow-500/20 overflow-x-auto">
                  <LatexMath math="\vec{A}(M) = \frac{\mu_0}{4\pi} \frac{\vec{m} \wedge \vec{r}}{r^3} = \frac{\mu_0}{4\pi} \frac{\vec{m} \wedge \vec{u}_r}{r^2}" />
                </div>
              </div>

              {/* Étape 3 */}
              <div className="border-t border-yellow-500/10 pt-4">
                <h4 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                  <span className="bg-yellow-500/20 text-yellow-500 w-5 h-5 flex items-center justify-center rounded-full text-xs">3</span> 
                  Calcul en Coordonnées Sphériques
                </h4>
                <p className="mb-2">En choisissant l'axe z selon le moment magnétique (<LatexMath math="\vec{m} = m \vec{e}_z" />), le produit vectoriel s'écrit :</p>
                <div className="flex justify-center bg-black/20 p-2 rounded mb-3 overflow-x-auto">
                  <LatexMath math="\vec{m} \wedge \vec{u}_r = m (\vec{e}_z \wedge \vec{u}_r) = m \sin\theta \vec{e}_\phi" />
                </div>
                <p className="mb-2">Ce qui nous donne les composantes du potentiel vecteur :</p>
                <div className="flex justify-center bg-emerald-500/10 p-3 rounded mb-4 text-emerald-400 font-bold border border-emerald-500/30 overflow-x-auto">
                  <LatexMath math="A_r = 0 \quad , \quad A_\theta = 0 \quad , \quad A_\phi = \frac{\mu_0 m \sin\theta}{4\pi r^2}" />
                </div>
                <p className="mb-2">Pour obtenir le champ magnétique <LatexMath math="\vec{B} = \vec{\text{rot}} \vec{A}" />, on utilise l'opérateur rotationnel en sphériques :</p>
                <ul className="list-disc list-inside space-y-2 mb-3 ml-2 text-xs sm:text-sm">
                  <li><LatexMath math="B_r = \frac{1}{r\sin\theta} \frac{\partial (\sin\theta A_\phi)}{\partial \theta} = \frac{1}{r\sin\theta} \frac{\mu_0 m}{4\pi r^2} 2\sin\theta\cos\theta = \frac{\mu_0 m}{4\pi r^3} 2\cos\theta" /></li>
                  <li><LatexMath math="B_\theta = -\frac{1}{r} \frac{\partial (r A_\phi)}{\partial r} = -\frac{1}{r} \frac{\partial}{\partial r} \left( \frac{\mu_0 m \sin\theta}{4\pi r} \right) = \frac{\mu_0 m}{4\pi r^3} \sin\theta" /></li>
                  <li><LatexMath math="B_\phi = 0" /> (car <LatexMath math="A_r" /> et <LatexMath math="A_\theta" /> sont nuls)</li>
                </ul>
                <div className="flex justify-center bg-black/20 p-3 rounded shadow-inner border border-yellow-500/20 mt-4 overflow-x-auto">
                  <LatexMath math="\vec{B}(M) = \frac{\mu_0 m}{4\pi r^3} \left( 2\cos\theta \vec{u}_r + \sin\theta \vec{u}_\theta \right)" />
                </div>
              </div>

            </div>
          </details>
        </div>
      </section>
      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 3: EXERCICE - LE CYLINDRE INFINI     */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-extrabold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Partie 3 • Exercice d'Application</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          Application 1 : Le Cylindre Conducteur Infini
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Un cylindre conducteur infini de rayon <LatexMath math="R" /> et d'axe <LatexMath math="(Oz)" /> est parcouru par un courant stationnaire de densité uniforme <LatexMath math="\vec{j} = j_0 \vec{e}_z" />. On se propose de déterminer le champ magnétique <LatexMath math="\vec{B}" /> et le potentiel vecteur <LatexMath math="\vec{A}" /> en tout point de l'espace.
        </p>

        {/* 3D Visualisation */}
        <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-400" />
          Visualisation 3D Interactive
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Visualisez le vecteur courant <LatexMath math="\vec{j}" />, les lignes de champ <LatexMath math="\vec{B}" /> et le potentiel vecteur <LatexMath math="\vec{A}" />. Déplacez le curseur pour faire varier le rayon <LatexMath math="R" />.
        </p>

        <div className="mb-8 w-full flex justify-center">
          <div className="w-full relative">
            <LazyMount height="400px" fallbackText="Chargement du Cylindre Conducteur...">
              <VectorPotentialExercise3DCanvas />
            </LazyMount>
            <p className="text-xs text-center text-muted-foreground mt-2 italic absolute -bottom-6 left-0 right-0">
              On visualise bien que A est parallèle à j, maximum au centre, et décroît vers l'extérieur. Les lignes de champ B enroulent le cylindre.
            </p>
          </div>
        </div>

        {/* Démonstration Step-by-Step */}
        <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-4 mt-12 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-orange-400" />
          Questions et Correction détaillée
        </h3>

        <div className="space-y-3">
          
          <CollapsibleStep step={1} title="Symétries et invariances" color="orange" defaultOpen={true}>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              <strong>Question 1 :</strong> Déterminer, par des arguments de symétrie, la direction et les dépendances du champ <LatexMath math="\vec{B}" /> et du potentiel vecteur <LatexMath math="\vec{A}" />.
            </p>
            <div className="border-t border-orange-500/10 pt-4">
              <p className="text-[11px] mb-2">La distribution est invariante par translation selon <LatexMath math="z" /> et rotation autour de <LatexMath math="z" /> (indépendance de <LatexMath math="\theta" /> et <LatexMath math="z" />).</p>
              <p className="text-[11px] mb-2">Le plan <LatexMath math="(M, \vec{e}_r, \vec{e}_z)" /> contient le vecteur densité de courant <LatexMath math="\vec{j}" />, c'est donc un plan de symétrie de la distribution. <LatexMath math="\vec{B}" /> étant un pseudo-vecteur, il lui est perpendiculaire, donc dirigé selon <LatexMath math="\vec{e}_\theta" />. Le potentiel vecteur <LatexMath math="\vec{A}" /> est un vrai vecteur, il appartient au plan de symétrie et a la même direction que <LatexMath math="\vec{j}" />, soit <LatexMath math="\vec{e}_z" />.</p>
              <div className="flex justify-center bg-black/20 p-2 rounded mb-2">
                <LatexMath math="\vec{B}(M) = B(r)\vec{e}_\theta \quad \text{et} \quad \vec{A}(M) = A(r)\vec{e}_z" />
              </div>
            </div>
          </CollapsibleStep>

          <CollapsibleStep step={2} title="Champ Magnétique (Théorème d'Ampère)" color="cyan">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              <strong>Question 2 :</strong> Calculer <LatexMath math="\vec{B}" /> à l'intérieur (<LatexMath math="r < R" />) et à l'extérieur (<LatexMath math="r > R" />) du cylindre via le théorème d'Ampère.
            </p>
            <div className="border-t border-cyan-500/10 pt-4">
              <p className="text-[11px] mb-2">On choisit comme contour un cercle de rayon <LatexMath math="r" />. La circulation est <LatexMath math="C = B(r) \times 2\pi r" />.</p>
              <ul className="list-disc list-inside space-y-1 mb-2 text-[11px]">
                <li><strong>Pour <LatexMath math="r < R" /> :</strong> <LatexMath math="I_{encl} = j_0 \pi r^2 \implies B_{int}(r) = \frac{\mu_0 j_0 r}{2}" /></li>
                <li><strong>Pour <LatexMath math="r > R" /> :</strong> <LatexMath math="I_{encl} = j_0 \pi R^2 = I \implies B_{ext}(r) = \frac{\mu_0 I}{2\pi r}" /></li>
              </ul>
            </div>
          </CollapsibleStep>

          <CollapsibleStep step={3} title="Potentiel Vecteur A" color="emerald">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              <strong>Question 3 :</strong> En déduire le potentiel vecteur <LatexMath math="\vec{A}" /> en intégrant <LatexMath math="\vec{B} = \vec{\text{rot}} \vec{A}" />.
            </p>
            <div className="border-t border-emerald-500/10 pt-4 text-[11px]">
              <p className="mb-2">En utilisant le rotationnel en cylindriques avec <LatexMath math="\vec{A} = A(r)\vec{e}_z" /> :</p>
              <div className="flex justify-center bg-black/20 p-2 rounded mb-2">
                <LatexMath math="\vec{\text{rot}}\vec{A} = -\frac{\partial A}{\partial r}\vec{e}_\theta = \vec{B}" />
              </div>
              
              <p className="mt-3 mb-1"><strong>Intérieur (<LatexMath math="r < R" />) :</strong></p>
              <div className="flex justify-center bg-black/20 p-2 rounded mb-2">
                <LatexMath math="-\frac{\partial A_{int}}{\partial r} = \frac{\mu_0 j_0 r}{2} \implies A_{int}(r) = -\frac{\mu_0 j_0 r^2}{4} + C_1" />
              </div>
              <p className="italic mb-2">En posant <LatexMath math="A(0) = 0" /> arbitrairement, on a <LatexMath math="C_1 = 0" />.</p>

              <p className="mt-3 mb-1"><strong>Extérieur (<LatexMath math="r > R" />) :</strong></p>
              <div className="flex justify-center bg-black/20 p-2 rounded mb-2">
                <LatexMath math="-\frac{\partial A_{ext}}{\partial r} = \frac{\mu_0 j_0 R^2}{2r} \implies A_{ext}(r) = -\frac{\mu_0 j_0 R^2}{2} \ln(r) + C_2" />
              </div>
              
              <p className="mt-3 mb-2">La continuité de <LatexMath math="\vec{A}" /> en <LatexMath math="r = R" /> impose :</p>
              <div className="flex justify-center bg-emerald-500/10 border border-emerald-500/30 p-2 rounded">
                <LatexMath math="-\frac{\mu_0 j_0 R^2}{4} = -\frac{\mu_0 j_0 R^2}{2} \ln(R) + C_2 \implies C_2 = \frac{\mu_0 j_0 R^2}{2}\left(\ln(R) - \frac{1}{2}\right)" />
              </div>
            </div>
          </CollapsibleStep>

          <CollapsibleStep step={4} title="Méthode alternative : Équation de Poisson" color="purple">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Peut-on trouver <LatexMath math="\vec{A}" /> sans passer par le champ magnétique <LatexMath math="\vec{B}" /> ?
            </p>
            <div className="border-t border-purple-500/10 pt-4 text-[11px]">
              <p>
                À l'intérieur du conducteur : <LatexMath math="\Delta \vec{A} = -\mu_0 \vec{j}" />. Puisque <LatexMath math="\vec{A}" /> est selon <LatexMath math="z" /> et ne dépend que de <LatexMath math="r" /> :
              </p>
              <div className="flex justify-center bg-black/20 p-2 rounded my-2 overflow-x-auto">
                <LatexMath math="\frac{1}{r} \frac{\partial}{\partial r}\left(r \frac{\partial A}{\partial r}\right) = -\mu_0 j_0" />
              </div>
              <p>En intégrant deux fois par rapport à r (et avec la condition de champ non divergent en r=0), on retrouve directement le même résultat parabolique pour l'intérieur.</p>
            </div>
          </CollapsibleStep>

          <CollapsibleStep step={5} title="Allure des courbes de B(ρ) et A(ρ)" color="rose">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              <strong>Question 5 :</strong> Tracer l'allure de l'intensité du champ magnétique <LatexMath math="B" /> et du potentiel vecteur <LatexMath math="A" /> en fonction de la distance axiale <LatexMath math="\rho" />.
            </p>
            
            <div className="w-full relative mt-4">
              <LazyMount height="350px" fallbackText="Chargement du graphe...">
                <VectorPotentialCurves />
              </LazyMount>
            </div>
          </CollapsibleStep>

        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 4: APPLICATION 2 - LE SOLÉNOÏDE        */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden mt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-extrabold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Partie 4 • Exercice d'Application</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          Application 2 : Le Solénoïde Infini et le Potentiel Vecteur A
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Considérons un solénoïde infiniment long d'axe <LatexMath math="(Oz)" /> et de rayon <LatexMath math="R" />, comportant <LatexMath math="n" /> spires par unité de longueur parcourues par un courant d'intensité <LatexMath math="I" />. On rappelle l'expression du champ magnétique : <LatexMath math="\vec{B}_{int} = \mu_0 n I \vec{u}_z" /> à l'intérieur (<LatexMath math="r < R" />) et <LatexMath math="\vec{B}_{ext} = \vec{0}" /> à l'extérieur (<LatexMath math="r > R" />). L'objectif est de déterminer le potentiel vecteur <LatexMath math="\vec{A}" /> généré par ce solénoïde.
        </p>

        {/* 3D Visualisation */}
        <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400" />
          Visualisation 3D Interactive du Solénoïde
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Observez la structure du solénoïde (spires rouges), le champ magnétique <LatexMath math="\vec{B}" /> uniforme à l'intérieur, et le potentiel vecteur <LatexMath math="\vec{A}" /> qui tourne autour de l'axe.
        </p>

        <div className="mb-8 w-full flex justify-center">
          <div className="w-full relative">
            <LazyMount height="350px" fallbackText="Chargement du Solénoïde...">
              <SolenoidPotentialExercise3DCanvas />
            </LazyMount>
          </div>
        </div>

        <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded-r-lg mb-8">
          <h4 className="font-bold text-orange-600 dark:text-orange-400 text-sm mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Remarque Physique Importante
          </h4>
          <p className="text-xs text-orange-700 dark:text-orange-300">
            Cet exercice illustre un paradoxe apparent très célèbre en électromagnétisme quantique (Effet Aharonov-Bohm) : bien que le champ magnétique <LatexMath math="\vec{B}" /> soit <strong>strictement nul</strong> à l'extérieur du solénoïde, le potentiel vecteur <LatexMath math="\vec{A}" /> n'y est pas nul ! Le potentiel vecteur possède donc une réalité physique tangible, au-delà d'être un simple outil mathématique.
          </p>
        </div>

        <div className="space-y-4">
          <CollapsibleStep step={1} title="Analyse des symétries et invariances" color="blue">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              <strong>Question 1 :</strong> Par des arguments de symétrie et d'invariance, déterminer la direction de <LatexMath math="\vec{A}" /> et les variables d'espace dont il dépend.
            </p>
            <div className="border-t border-blue-500/10 pt-4 text-[11px]">
              <ul className="list-disc list-inside space-y-1 mb-2">
                <li><strong>Invariances :</strong> La distribution de courant est invariante par translation selon l'axe <LatexMath math="(Oz)" /> et par rotation autour de <LatexMath math="(Oz)" /> (invariance azimutale). Donc, <LatexMath math="\vec{A}" /> ne dépend que de la distance radiale <LatexMath math="r" />.</li>
                <li><strong>Symétries :</strong> Tout plan contenant l'axe <LatexMath math="(Oz)" /> est un plan d'antisymétrie pour la distribution de courant (les spires traversent perpendiculairement ce plan). Or <LatexMath math="\vec{A}" /> est un vecteur polaire, il est donc perpendiculaire aux plans d'antisymétrie, c'est-à-dire porté par <LatexMath math="\vec{u}_\theta" />.</li>
              </ul>
              <p className="font-bold text-blue-400">Conclusion : <LatexMath math="\vec{A}(M) = A(r) \vec{u}_\theta" /></p>
            </div>
          </CollapsibleStep>

          <CollapsibleStep step={2} title="Jauge de Coulomb" color="cyan">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              <strong>Question 2 :</strong> Vérifier que cette forme du potentiel vecteur satisfait la jauge de Coulomb <LatexMath math="\text{div}(\vec{A}) = 0" />.
            </p>
            <div className="border-t border-cyan-500/10 pt-4 text-[11px]">
              <p className="mb-2">L'expression de la divergence en coordonnées cylindriques pour un vecteur <LatexMath math="\vec{A} = A_r \vec{u}_r + A_\theta \vec{u}_\theta + A_z \vec{u}_z" /> est :</p>
              <div className="flex justify-center bg-black/20 p-2 rounded mb-2">
                <LatexMath math="\text{div}(\vec{A}) = \frac{1}{r}\frac{\partial (r A_r)}{\partial r} + \frac{1}{r}\frac{\partial A_\theta}{\partial \theta} + \frac{\partial A_z}{\partial z}" />
              </div>
              <p>Puisque <LatexMath math="A_r = 0" />, <LatexMath math="A_z = 0" /> et que <LatexMath math="A_\theta = A(r)" /> ne dépend pas de <LatexMath math="\theta" />, tous les termes s'annulent.</p>
              <p className="font-bold text-cyan-400 mt-2">Donc <LatexMath math="\text{div}(\vec{A}) = 0" />, la jauge de Coulomb est bien respectée.</p>
            </div>
          </CollapsibleStep>

          <CollapsibleStep step={3} title="Calcul de A par le théorème de Stokes" color="emerald">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              <strong>Question 3 :</strong> Calculer <LatexMath math="\vec{A}" /> à l'intérieur (<LatexMath math="r < R" />) et à l'extérieur (<LatexMath math="r > R" />) en utilisant la circulation de <LatexMath math="\vec{A}" /> et le flux de <LatexMath math="\vec{B}" />.
            </p>
            <div className="border-t border-emerald-500/10 pt-4 text-[11px]">
              <p className="mb-2">Par le théorème de Stokes (ou d'Ampère pour A) : <LatexMath math="\oint_C \vec{A} \cdot d\vec{\ell} = \iint_S \vec{\text{rot}}(\vec{A}) \cdot d\vec{S} = \iint_S \vec{B} \cdot d\vec{S} = \Phi_B" />.</p>
              <p className="mb-2">On choisit un cercle <LatexMath math="C" /> de rayon <LatexMath math="r" /> centré sur l'axe. La circulation vaut : <LatexMath math="A(r) \times 2\pi r" />.</p>
              
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>
                  <strong>Pour <LatexMath math="r < R" /> (Intérieur) :</strong> Le flux à travers le disque de rayon <LatexMath math="r" /> est <LatexMath math="\Phi_B = B_{int} \times \pi r^2 = \mu_0 n I \pi r^2" />.
                  <div className="flex justify-center bg-black/20 p-2 rounded my-1">
                    <LatexMath math="A(r) \times 2\pi r = \mu_0 n I \pi r^2 \implies A_{int}(r) = \frac{\mu_0 n I r}{2}" />
                  </div>
                </li>
                <li>
                  <strong>Pour <LatexMath math="r > R" /> (Extérieur) :</strong> Le champ <LatexMath math="B" /> n'existe que dans la région <LatexMath math="r \le R" />. Le flux total est constant : <LatexMath math="\Phi_B = B_{int} \times \pi R^2 = \mu_0 n I \pi R^2" />.
                  <div className="flex justify-center bg-black/20 p-2 rounded my-1">
                    <LatexMath math="A(r) \times 2\pi r = \mu_0 n I \pi R^2 \implies A_{ext}(r) = \frac{\mu_0 n I R^2}{2r}" />
                  </div>
                </li>
              </ul>
            </div>
          </CollapsibleStep>

          <CollapsibleStep step={4} title="Calcul de A par intégration de rot(A) = B" color="purple">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              <strong>Question 4 :</strong> Retrouver l'expression de <LatexMath math="\vec{A}" /> en intégrant directement l'équation différentielle issue de <LatexMath math="\vec{B} = \vec{\text{rot}}(\vec{A})" />.
            </p>
            <div className="border-t border-purple-500/10 pt-4 text-[11px]">
              <p className="mb-2">En coordonnées cylindriques, sachant que <LatexMath math="\vec{A} = A(r) \vec{u}_\theta" />, le rotationnel se simplifie en :</p>
              <div className="flex justify-center bg-black/20 p-2 rounded mb-3">
                <LatexMath math="\vec{\text{rot}}(\vec{A}) = \frac{1}{r}\frac{\partial (r A(r))}{\partial r} \vec{u}_z = \vec{B}" />
              </div>

              <ul className="list-disc list-inside space-y-4">
                <li>
                  <strong>À l'intérieur (<LatexMath math="r < R" />) :</strong> <LatexMath math="\vec{B} = \mu_0 n I \vec{u}_z" />
                  <div className="flex justify-center bg-black/20 p-2 rounded my-1">
                    <LatexMath math="\frac{\partial (r A_{int})}{\partial r} = \mu_0 n I r \implies r A_{int}(r) = \frac{\mu_0 n I r^2}{2} + C_1" />
                  </div>
                  <p>Soit <LatexMath math="A_{int}(r) = \frac{\mu_0 n I r}{2} + \frac{C_1}{r}" />. Pour que le potentiel ne diverge pas sur l'axe (<LatexMath math="r=0" />), on doit avoir <LatexMath math="C_1 = 0" />.</p>
                  <p className="font-bold text-purple-300 mt-1">Résultat : <LatexMath math="A_{int}(r) = \frac{\mu_0 n I r}{2}" /></p>
                </li>
                <li>
                  <strong>À l'extérieur (<LatexMath math="r > R" />) :</strong> <LatexMath math="\vec{B} = \vec{0}" />
                  <div className="flex justify-center bg-black/20 p-2 rounded my-1">
                    <LatexMath math="\frac{\partial (r A_{ext})}{\partial r} = 0 \implies r A_{ext}(r) = C_2" />
                  </div>
                  <p>Soit <LatexMath math="A_{ext}(r) = \frac{C_2}{r}" />. La constante se trouve par continuité.</p>
                </li>
              </ul>
            </div>
          </CollapsibleStep>

          <CollapsibleStep step={5} title="Continuité du Potentiel Vecteur en r = R" color="rose">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              <strong>Question 5 :</strong> Déterminer la constante <LatexMath math="C_2" /> en appliquant la condition de continuité de <LatexMath math="\vec{A}" /> à la surface du solénoïde (<LatexMath math="r = R" />).
            </p>
            <div className="border-t border-rose-500/10 pt-4 text-[11px]">
              <p className="mb-2">Le potentiel vecteur est une grandeur continue dans tout l'espace (contrairement au champ B qui est discontinu à la traversée d'une nappe de courant). En <LatexMath math="r = R" /> :</p>
              <div className="flex justify-center bg-black/20 p-2 rounded mb-2">
                <LatexMath math="A_{int}(R) = A_{ext}(R) \implies \frac{\mu_0 n I R}{2} = \frac{C_2}{R}" />
              </div>
              <p>On en déduit la constante d'intégration de la zone extérieure :</p>
              <div className="flex justify-center bg-rose-500/10 border border-rose-500/30 p-2 rounded my-2">
                <LatexMath math="C_2 = \frac{\mu_0 n I R^2}{2} \implies A_{ext}(r) = \frac{\mu_0 n I R^2}{2r}" />
              </div>
              <p>On retrouve exactement les mêmes expressions que par la méthode du flux de Stokes, ce qui confirme la cohérence physique globale du modèle !</p>
            </div>
          </CollapsibleStep>

        </div>
      </section>

    </div>
  );
}
