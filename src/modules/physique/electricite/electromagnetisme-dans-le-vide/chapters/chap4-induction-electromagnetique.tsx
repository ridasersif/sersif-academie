"use client";

import React, { useState } from "react";
import dynamic from 'next/dynamic';
import LazyMount from "@/components/ui/LazyMount";

const FaradayLaw3DCanvas = dynamic(() => import("../components/FaradayLaw3DCanvas"), { ssr: false });
const Alternator3DCanvas = dynamic(() => import("../components/Alternator3DCanvas"), { ssr: false });
const LaplaceRails3DCanvas = dynamic(() => import("../components/LaplaceRails3DCanvas"), { ssr: false });
const MagneticFlux3DCanvas = dynamic(() => import("../components/MagneticFlux3DCanvas"), { ssr: false });

import LatexMath from "@/components/ui/LatexMath";
import { ChevronDown, ChevronUp, Zap, Activity, Magnet, RefreshCw, Compass, ShieldAlert, GraduationCap, CheckCircle, Waves } from "lucide-react";

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
    cyan: { bg: "bg-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-500 dark:text-cyan-300", dot: "bg-cyan-500" },
    teal: { bg: "bg-teal-500/5", border: "border-teal-500/20", text: "text-teal-500 dark:text-teal-300", dot: "bg-teal-500" },
    blue: { bg: "bg-blue-500/5", border: "border-blue-500/20", text: "text-blue-500 dark:text-blue-300", dot: "bg-blue-500" },
    emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-500 dark:text-emerald-300", dot: "bg-emerald-500" },
    amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-500 dark:text-amber-300", dot: "bg-amber-500" },
    pink: { bg: "bg-pink-500/5", border: "border-pink-500/20", text: "text-pink-500 dark:text-pink-300", dot: "bg-pink-500" },
    rose: { bg: "bg-rose-500/5", border: "border-rose-500/20", text: "text-rose-500 dark:text-rose-300", dot: "bg-rose-500" },
    indigo: { bg: "bg-indigo-500/5", border: "border-indigo-500/20", text: "text-indigo-500 dark:text-indigo-300", dot: "bg-indigo-500" },
    yellow: { bg: "bg-yellow-500/5", border: "border-yellow-500/20", text: "text-yellow-500 dark:text-yellow-300", dot: "bg-yellow-500" },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`rounded-xl ${c.bg} border ${c.border} overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors"
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

export default function Chap4InductionElectromagnetique() {
  const [showLenzProof, setShowLenzProof] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* PARTIE 0: RAPPEL FLUX MAGNETIQUE */}
      <section className="bg-card/90 border border-blue-500/20 rounded-2xl p-4 sm:p-5 shadow-sm w-full max-w-full overflow-x-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[10px] sm:text-xs font-bold mb-2">
          <Waves className="w-3.5 h-3.5" />
          <span>Rappel Préliminaire</span>
        </div>
        
        <h2 className="text-lg sm:text-xl font-bold mb-3 text-foreground leading-tight">
          0. Le Flux Magnétique <LatexMath math="\Phi" />
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-2">
          <div className="flex flex-col justify-center">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
              Avant d'étudier l'induction, il est primordial de comprendre ce qu'est le flux magnétique. Imaginez une surface plongée dans un champ magnétique : le flux mesure "combien" de lignes de champ traversent cette surface.
            </p>
            <div className="bg-muted/50 p-3 rounded-xl border border-border mb-3">
              <h3 className="font-semibold text-foreground mb-1.5 text-xs sm:text-sm">Définition Mathématique</h3>
              <p className="text-xs sm:text-[13px] text-muted-foreground mb-2 leading-relaxed">
                Le flux élémentaire <LatexMath math="d\Phi" /> traversant une petite surface <LatexMath math="d\vec{S}" /> est le produit scalaire du champ <LatexMath math="\vec{B}" /> par le vecteur surface <LatexMath math="d\vec{S}" /> (normal à la surface : <LatexMath math="d\vec{S} = dS \cdot \vec{n}" />).
              </p>
              <div className="flex justify-center bg-background border border-border p-2 rounded-lg shadow-inner text-xs sm:text-sm">
                <LatexMath math="\Phi = \iint_{S} \vec{B} \cdot d\vec{S} = \iint_{S} B \cdot dS \cdot \cos(\alpha)" />
              </div>
            </div>
            <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
              Pour un champ uniforme et une surface plane, cela se simplifie en <LatexMath math="\Phi = B \cdot S \cdot \cos(\alpha)" />, avec <LatexMath math="\alpha" /> l'angle entre le vecteur normal <LatexMath math="\vec{n}" /> et <LatexMath math="\vec{B}" />. L'unité du flux est le Weber (Wb).
            </p>
          </div>
          
          <div className="flex flex-col">
            <LazyMount height="280px" fallbackText="Chargement Simulateur Flux...">
              <MagneticFlux3DCanvas />
            </LazyMount>
          </div>
        </div>
      </section>

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

      {/* PARTIE 2: APPLICATION DE LA LOI DE FARADAY */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Application • Générateur Électrique</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          2. Application de la loi de Faraday
        </h2>
        
        <div className="space-y-4 mb-4">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            La principale application de la loi de Faraday est le <strong>générateur électrique</strong> (alternateur / dynamo) convertissant l'énergie mécanique de rotation en énergie électrique induite.
          </p>
          
          {/* 3 Compact Formula Cards in Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3">
            <div className="bg-muted/40 p-2.5 rounded-xl border border-border/70 flex flex-col justify-between shadow-sm">
              <span className="text-[11px] font-semibold text-muted-foreground mb-1">
                1. Flux (<LatexMath math="N" /> spires) :
              </span>
              <div className="bg-background/90 p-1.5 rounded-lg flex justify-center border border-border/50 shadow-inner overflow-x-auto text-xs">
                <LatexMath math="\Phi = N \cdot B \cdot S \cos(\omega t)" />
              </div>
            </div>

            <div className="bg-muted/40 p-2.5 rounded-xl border border-border/70 flex flex-col justify-between shadow-sm">
              <span className="text-[11px] font-semibold text-muted-foreground mb-1">
                2. Loi de Faraday :
              </span>
              <div className="bg-background/90 p-1.5 rounded-lg flex justify-center border border-border/50 shadow-inner overflow-x-auto text-xs">
                <LatexMath math="e = -\frac{d\Phi}{dt} = N B S \omega \sin(\omega t)" />
              </div>
            </div>

            <div className="bg-blue-500/5 p-2.5 rounded-xl border border-blue-500/30 flex flex-col justify-between shadow-sm">
              <span className="text-[11px] font-semibold text-blue-500 dark:text-blue-400 mb-1">
                3. Tension induite :
              </span>
              <div className="bg-blue-500/10 border border-blue-500/40 p-1.5 rounded-lg text-blue-500 dark:text-blue-400 font-bold flex justify-center overflow-x-auto text-xs">
                <LatexMath math="e(t) = e_0 \sin(\omega t)" />
                <span className="ml-2 font-mono text-[10px] self-center opacity-80">(e₀ = N·B·S·ω)</span>
              </div>
            </div>
          </div>

          {/* Compact Full-Width 3D Generator Simulator */}
          <div className="w-full flex flex-col">
            <LazyMount height="350px" fallbackText="Chargement Simulateur Générateur...">
              <Alternator3DCanvas />
            </LazyMount>
            <p className="text-[11px] text-center text-muted-foreground mt-1.5 italic">
              Alternateur : Rotation d'un bobinage de <LatexMath math="N" /> spires à vitesse <LatexMath math="\omega" /> dans un champ <LatexMath math="\vec{B}_0" />.
            </p>
          </div>
        </div>
      </section>

      {/* EXERCICE DE SYNTHÈSE (CONCOURS 2024) */}
      <section className="bg-card/90 border-2 border-indigo-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl w-full max-w-full overflow-x-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 text-xs font-extrabold mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>Exercice de Synthèse • Concours 2024</span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black mb-4 text-foreground leading-tight">
          Chute d'une tige sur des rails verticaux
        </h2>

        {/* Énoncé */}
        <div className="bg-muted/30 border border-border p-5 rounded-2xl mb-8">
          <h3 className="font-bold text-foreground mb-3 border-b border-border pb-2">Énoncé du problème</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Deux conducteurs parallèles <LatexMath math="(AA_1" /> et <LatexMath math="A'A'_1)" />, verticaux et de résistances négligeables sont placés dans un champ magnétique <LatexMath math="\vec{B}" /> uniforme et perpendiculaire aux conducteurs (sortant). La distance qui les sépare est notée <LatexMath math="l = AA'" />.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Ces conducteurs sont reliés par un conducteur ohmique de résistance <LatexMath math="R" /> en bas. Une tige métallique <LatexMath math="MN" /> de masse <LatexMath math="m" /> et de résistance électrique négligeable glisse sans vitesse initiale le long de ces conducteurs sous l'effet de son poids <LatexMath math="\vec{P}" />.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            On repère sa position par la distance <LatexMath math="x = MA_1" /> et on note <LatexMath math="v = -\frac{dx}{dt}" /> sa vitesse de chute. L'auto-induction est négligée.
          </p>
        </div>

        {/* Simulateur 3D */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Laboratoire Virtuel : Simulation de la chute
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Utilisez ce simulateur pour visualiser l'évolution des forces au cours du temps. Remarquez que la force de Laplace <LatexMath math="\vec{F}_m" /> s'oppose à la pesanteur <LatexMath math="\vec{P}" /> et augmente jusqu'à équilibrer le poids.
          </p>
          <LazyMount fallbackText="Chargement du simulateur de rails verticaux..."><LaplaceRails3DCanvas /></LazyMount>
        </div>

        {/* Démonstrations Mathématiques */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-indigo-500" />
            Résolution Détaillée et Démonstrations
          </h3>

            <div className="space-y-4">
            {/* Q1: Force electromotrice */}
            <CollapsibleStep step={1} title="Expression de la force électromotrice (f.é.m) e" color="indigo" defaultOpen={true}>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                D'après la loi de Faraday, la f.é.m est donnée par <LatexMath math="e = -\frac{d\Phi}{dt}" />. Exprimons le flux magnétique <LatexMath math="\Phi" /> à travers le circuit rectangulaire <LatexMath math="M N A'_1 A_1" />.
              </p>
              <div className="bg-muted/50 p-3 rounded-lg mb-3">
                <LatexMath math="\Phi = \iint \vec{B} \cdot d\vec{S} = B \cdot S" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                La surface <LatexMath math="S" /> vaut <LatexMath math="l \times x" />. Le flux est donc <LatexMath math="\Phi = B \cdot l \cdot x" />.
                En dérivant par rapport au temps, sachant que la tige descend et donc <LatexMath math="v = -\frac{dx}{dt}" /> :
              </p>
              <div className="flex justify-center bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-lg text-indigo-500 dark:text-indigo-400 font-bold">
                <LatexMath math="e = -\frac{d(B \cdot l \cdot x)}{dt} = -B \cdot l \cdot \frac{dx}{dt} = B \cdot l \cdot v" />
              </div>
            </CollapsibleStep>

            {/* Q2: Force de Laplace */}
            <CollapsibleStep step={2} title="Expression de la force électromagnétique (Laplace) sur la tige" color="emerald" defaultOpen={false}>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                D'après la loi de Lenz, le courant induit <LatexMath math="I" /> s'oppose au mouvement (vers le bas). La force de Laplace <LatexMath math="\vec{F}_m" /> sera donc dirigée vers le haut.
                <br />Le courant électrique est donné par la loi d'Ohm : <LatexMath math="I = \frac{e}{R} = \frac{B \cdot l \cdot v}{R}" />.
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                L'intensité de la force de Laplace s'écrit <LatexMath math="F_m = I \cdot l \cdot B" /> (car <LatexMath math="\vec{l} \perp \vec{B}" />). En remplaçant <LatexMath math="I" /> :
              </p>
              <div className="flex justify-center bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg text-emerald-500 dark:text-emerald-400 font-bold">
                <LatexMath math="F_m = \left(\frac{B \cdot l \cdot v}{R}\right) \cdot l \cdot B = \frac{B^2 \cdot l^2 \cdot v}{R}" />
              </div>
            </CollapsibleStep>

            {/* Q3: Equation diff */}
            <CollapsibleStep step={3} title="Équation différentielle vérifiée par la vitesse v" color="amber" defaultOpen={false}>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                On applique le Principe Fondamental de la Dynamique (2ème loi de Newton) à la tige en chute libre sur un axe vertical orienté vers le bas :
              </p>
              <div className="bg-muted/50 p-3 rounded-lg mb-3">
                <LatexMath math="\sum \vec{F} = m \vec{a} \implies \vec{P} + \vec{F}_m = m \frac{d\vec{v}}{dt}" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                En projetant sur l'axe descendant : <LatexMath math="m g - F_m = m \frac{dv}{dt}" />. En remplaçant <LatexMath math="F_m" /> :
              </p>
              <div className="bg-muted/50 p-3 rounded-lg mb-3">
                <LatexMath math="m \frac{dv}{dt} = m g - \frac{B^2 l^2 v}{R} \implies \frac{dv}{dt} + \frac{B^2 l^2}{m R} v = g" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Ceci s'écrit sous la forme demandée <LatexMath math="\frac{dv}{dt} + \frac{1}{k} v = g" /> avec la constante de temps <LatexMath math="k" /> (souvent notée <LatexMath math="\tau" />) :
              </p>
              <div className="flex justify-center bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-amber-500 dark:text-amber-400 font-bold">
                <LatexMath math="k = \frac{m \cdot R}{B^2 \cdot l^2}" />
              </div>
            </CollapsibleStep>

            {/* Q4: Vitesse */}
            <CollapsibleStep step={4} title="Expression de la vitesse de la tige v(t)" color="rose" defaultOpen={false}>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                La résolution de l'équation différentielle linéaire du premier ordre donne la somme de la solution du régime transitoire et permanent.
                <br /> La solution de l'équation sans second membre est <LatexMath math="v_h(t) = A \cdot e^{-t/k}" />.
                <br /> La solution particulière (régime permanent <LatexMath math="dv/dt = 0" />) est la vitesse limite <LatexMath math="v_{lim} = k \cdot g" />.
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                La solution générale est donc <LatexMath math="v(t) = A \cdot e^{-t/k} + k g" />.
                À <LatexMath math="t=0" />, la tige est lâchée sans vitesse initiale (<LatexMath math="v(0) = 0" />), donc <LatexMath math="A + k g = 0 \implies A = -k g" />.
              </p>
              <div className="flex justify-center bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg text-rose-500 dark:text-rose-400 font-bold">
                <LatexMath math="v(t) = k \cdot g \cdot (1 - e^{-t/k})" />
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                On retrouve bien que lorsque <LatexMath math="t \to \infty" />, la vitesse tend vers la vitesse limite constante <LatexMath math="v_{lim} = k g" />. À ce stade, la force de Laplace compense exactement le poids de la tige.
              </p>
            </CollapsibleStep>

          </div>
        </div>
      </section>

      {/* PARTIE 3: HAUT-PARLEUR & FOUCAULT */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-500" />
          3. Autres Phénomènes : Haut-Parleur et Courants de Foucault
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-purple-500/5 border border-purple-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
            <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Haut-parleur</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le haut-parleur électrodynamique exploite la force de Laplace. Une bobine mobile, parcourue par un courant variable issu d'un amplificateur, plonge dans l'entrefer d'un aimant permanent. La bobine vibre et entraîne la membrane.
            </p>
          </div>

          <div className="bg-orange-500/5 border border-orange-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl">
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
