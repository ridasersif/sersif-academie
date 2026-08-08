"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";
import BiotSavart3DCanvas from "../components/BiotSavart3DCanvas";
import BiotSavartSegment3DCanvas from "../components/BiotSavartSegment3DCanvas";
import BiotSavartSpire3DCanvas from "../components/BiotSavartSpire3DCanvas";
import AmpereTheorem3DCanvas from "../components/AmpereTheorem3DCanvas";
import { Calculator, RotateCw, Layers, ChevronDown, ChevronUp, Sparkles, BookOpen, Lightbulb, ArrowRight } from "lucide-react";

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
  const borderColor = color === "cyan" ? "border-cyan-500/40" : color === "emerald" ? "border-emerald-500/40" : color === "amber" ? "border-amber-500/40" : "border-blue-500/40";
  const shadowColor = color === "cyan" ? "rgba(6,182,212,0.1)" : color === "emerald" ? "rgba(16,185,129,0.1)" : color === "amber" ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)";
  const barColor = color === "cyan" ? "bg-cyan-500" : color === "emerald" ? "bg-emerald-500" : color === "amber" ? "bg-amber-500" : "bg-blue-500";
  const labelColor = color === "cyan" ? "text-cyan-500/80" : color === "emerald" ? "text-emerald-500/80" : color === "amber" ? "text-amber-500/80" : "text-blue-500/80";

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

export default function Chap2LoisFondamentales() {
  const [showSegmentDemo, setShowSegmentDemo] = useState(true);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 1: LOI DE BIOT-SAVART              */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Partie 1 • Loi de Biot-Savart (Méthode Locale)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Calcul de proche en proche du Champ Magnétique
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 font-medium">
          La loi de Biot et Savart permet de calculer le champ magnétique total créé par un circuit en sommant (intégrant) les contributions élémentaires <LatexMath math="d\vec{B}" /> de chaque petit bout de fil <LatexMath math="d\vec{l}" />. C&apos;est la méthode de base pour calculer <LatexMath math="\vec{B}" /> dans n&apos;importe quelle configuration.
        </p>

        {/* Formule principale */}
        <div className="mb-6">
          <FormulaCard label="Formule Élémentaire de Biot-Savart" color="cyan">
            <span className="text-cyan-400">
              <LatexMath math="d\vec{B}(M) = \frac{\mu_0 I}{4\pi} \frac{d\vec{l} \wedge \vec{u}}{r^2}" />
            </span>
          </FormulaCard>
        </div>

        {/* Explication des termes */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { symbol: "\\mu_0", desc: "Perméabilité magnétique du vide", value: "4\\pi \\times 10^{-7} \\text{ T·m/A}", color: "text-cyan-400" },
            { symbol: "d\\vec{l}", desc: "Élément de longueur du fil", value: "\\text{Orienté dans le sens de I}", color: "text-blue-400" },
            { symbol: "\\vec{u} = \\frac{\\vec{PM}}{r}", desc: "Vecteur unitaire vers M", value: "\\text{Du fil (P) vers le point (M)}", color: "text-emerald-400" },
            { symbol: "K = \\frac{\\mu_0}{4\\pi}", desc: "Constante de Biot-Savart", value: "\\simeq 10^{-7} \\text{ (SI)}", color: "text-amber-400" },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-muted/60 dark:bg-slate-900/40 border border-border">
              <div className={`font-mono text-sm ${item.color} mb-1`}>
                <LatexMath math={item.symbol} />
              </div>
              <p className="text-[10px] text-muted-foreground mb-1">{item.desc}</p>
              <div className="text-[10px] font-mono text-muted-foreground/70 bg-muted dark:bg-slate-950/60 px-2 py-1 rounded-md">
                <LatexMath math={item.value} />
              </div>
            </div>
          ))}
        </div>

        {/* Laboratoire 3D — Élément de courant */}
        <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Laboratoire 3D : L&apos;élément de courant
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Observez comment le champ élémentaire <LatexMath math="d\vec{B}" /> dépend de la distance <LatexMath math="r" /> et de l&apos;angle d&apos;observation <LatexMath math="\theta" />. Remarquez que <LatexMath math="d\vec{B}" /> est nul dans l&apos;alignement du fil (<LatexMath math="\theta = 0" /> ou <LatexMath math="180^\circ" />) à cause du produit vectoriel.
        </p>

        <div className="mb-6 w-full flex justify-center">
          <BiotSavart3DCanvas />
        </div>

        {/* Champ Total */}
        <div className="mt-6 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-extrabold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Champ Total — Principe de superposition</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Le champ total en M est obtenu en sommant (intégrant) les contributions de <strong>tous</strong> les éléments <LatexMath math="d\vec{l}" /> du circuit :
          </p>
          <FormulaCard label="Champ Magnétique Total" color="emerald">
            <span className="text-emerald-400">
              <LatexMath math="\vec{B}(M) = \frac{\mu_0 I}{4\pi} \int_{\text{circuit}} \frac{d\vec{l} \wedge \vec{u}}{r^2}" />
            </span>
          </FormulaCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* APPLICATION 1: SEGMENT [AB]                */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-cyan-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/5 to-transparent rounded-bl-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-3">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Application 1 • Champ créé par un segment rectiligne [AB]</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          Calcul du champ magnétique d&apos;un segment fini
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
          On considère un segment rectiligne <LatexMath math="[AB]" /> de longueur <LatexMath math="2L" /> parcouru par un courant <LatexMath math="I" />. On cherche le champ magnétique <LatexMath math="\vec{B}(M)" /> en un point <LatexMath math="M" /> situé à une distance perpendiculaire <LatexMath math="d" /> du fil.
        </p>

        {/* 3D Visualisation */}
        <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Visualisation 3D Interactive
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Déplacez les curseurs pour modifier la longueur du segment et la distance du point M. Observez comment les angles <LatexMath math="\alpha_1" /> et <LatexMath math="\alpha_2" /> changent. Quand <LatexMath math="L \to \infty" />, on retrouve le résultat du fil infini !
        </p>

        <div className="mb-8 w-full flex justify-center">
          <BiotSavartSegment3DCanvas />
        </div>

        {/* Démonstration Step-by-Step */}
        <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Démonstration complète
        </h3>

        <div className="space-y-3">
          {/* Étape 1: Mise en place */}
          <CollapsibleStep step={1} title="Mise en place et géométrie" color="cyan" defaultOpen={true}>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              On place le segment <LatexMath math="[AB]" /> le long de l&apos;axe vertical. Le point <LatexMath math="M" /> est à une distance perpendiculaire <LatexMath math="d" />. Un élément <LatexMath math="d\vec{l}" /> est situé en un point <LatexMath math="P" /> du fil. On note :
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 rounded-lg bg-muted dark:bg-slate-950/60 border border-border/60 text-center">
                <div className="text-cyan-400 text-xs"><LatexMath math="\vec{PM} = \vec{r}" /></div>
                <div className="text-[9px] text-muted-foreground/70 mt-1">Vecteur position</div>
              </div>
              <div className="p-2 rounded-lg bg-muted dark:bg-slate-950/60 border border-border/60 text-center">
                <div className="text-cyan-400 text-xs"><LatexMath math="\alpha = \text{angle}(\vec{PM}, \vec{d})" /></div>
                <div className="text-[9px] text-muted-foreground/70 mt-1">Angle repérant P</div>
              </div>
            </div>
          </CollapsibleStep>

          {/* Étape 2: Symétrie */}
          <CollapsibleStep step={2} title="Étude de symétrie → direction de dB⃗" color="teal">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Le plan <LatexMath math="(\vec{e_\rho}, \vec{e_z})" /> contenant le fil et M est un <strong className="text-teal-400">plan de symétrie</strong> du courant. D&apos;après le principe de Curie :
            </p>
            <div className="mt-2 p-3 rounded-lg bg-teal-500/5 border border-teal-500/20 text-center">
              <span className="text-teal-400 text-xs">
                <LatexMath math="d\vec{B} \perp (\vec{e_\rho}, \vec{e_z}) \implies d\vec{B} = dB(M) \, \vec{e_\theta}" />
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground/70 mt-2 leading-relaxed">
              Le champ élémentaire est donc purement <strong className="text-teal-300">azimuthal</strong> (perpendiculaire au plan contenant le fil et M).
            </p>
          </CollapsibleStep>

          {/* Étape 3: Expression de dB */}
          <CollapsibleStep step={3} title="Expression de dB en fonction de α" color="blue">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              En appliquant Biot-Savart et en projetant le produit vectoriel <LatexMath math="d\vec{l} \wedge \vec{u}" /> :
            </p>
            <div className="mt-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center">
              <span className="text-blue-400 text-xs">
                <LatexMath math="dB(M) = \frac{\mu_0 I}{4\pi} \frac{dl \cos\alpha}{r^2}" />
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground/70 mt-2 leading-relaxed">
              Le facteur <LatexMath math="\cos\alpha" /> vient du produit vectoriel : <LatexMath math="|d\vec{l} \wedge \vec{u}| = dl \sin(\pi/2 - \alpha) = dl\cos\alpha" />.
            </p>
          </CollapsibleStep>

          {/* Étape 4: Changement de variable */}
          <CollapsibleStep step={4} title="Changement de variable : l → α" color="pink">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
              Pour intégrer, on exprime tout en fonction de l&apos;angle <LatexMath math="\alpha" /> :
            </p>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-muted dark:bg-slate-950/60 border border-border/60 flex items-center gap-2 text-xs overflow-x-auto">
                <span className="text-pink-400 shrink-0"><LatexMath math="\tan\alpha = \frac{l}{d}" /></span>
                <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                <span className="text-pink-300"><LatexMath math="dl = \frac{d}{\cos^2\alpha}\,d\alpha" /></span>
              </div>
              <div className="p-2 rounded-lg bg-muted dark:bg-slate-950/60 border border-border/60 flex items-center gap-2 text-xs overflow-x-auto">
                <span className="text-pink-400 shrink-0"><LatexMath math="\cos\alpha = \frac{d}{r}" /></span>
                <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                <span className="text-pink-300"><LatexMath math="r = \frac{d}{\cos\alpha}" /></span>
              </div>
            </div>
          </CollapsibleStep>

          {/* Étape 5: Simplification */}
          <CollapsibleStep step={5} title="Simplification miraculeuse !" color="amber">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
              En remplaçant <LatexMath math="dl" /> et <LatexMath math="r" /> dans l&apos;expression de <LatexMath math="dB" /> :
            </p>
            <div className="p-3 rounded-lg bg-muted dark:bg-slate-950/60 border border-border/60 text-center text-xs overflow-x-auto">
              <span className="text-amber-400">
                <LatexMath math="dB = \frac{\mu_0 I}{4\pi} \cdot \frac{\cos\alpha}{r^2} \cdot \frac{d}{\cos^2\alpha}\,d\alpha = \frac{\mu_0 I}{4\pi} \cdot \frac{\cos\alpha \cdot \cos^2\alpha}{d^2} \cdot \frac{d}{\cos^2\alpha}\,d\alpha" />
              </span>
            </div>
            <div className="mt-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-center">
              <span className="text-amber-300 text-sm font-bold">
                <LatexMath math="dB(M) = \frac{\mu_0 I}{4\pi d} \cos\alpha \, d\alpha" />
              </span>
            </div>
            <p className="text-[10px] text-amber-400/60 text-center mt-2 font-medium">
              ✨ Tout se simplifie magnifiquement !
            </p>
          </CollapsibleStep>

          {/* Étape 6: Intégration */}
          <CollapsibleStep step={6} title="Intégration de α₁ à α₂ → Résultat final" color="emerald" defaultOpen={true}>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
              On intègre de l&apos;angle <LatexMath math="\alpha_1" /> (correspondant au point A) à <LatexMath math="\alpha_2" /> (correspondant au point B) :
            </p>
            <div className="p-3 rounded-lg bg-muted dark:bg-slate-950/60 border border-border/60 text-center text-xs overflow-x-auto mb-3">
              <span className="text-emerald-400">
                <LatexMath math="B(M) = \frac{\mu_0 I}{4\pi d} \int_{\alpha_1}^{\alpha_2} \cos\alpha \, d\alpha = \frac{\mu_0 I}{4\pi d} \left[\sin\alpha\right]_{\alpha_1}^{\alpha_2}" />
              </span>
            </div>

            {/* Résultat encadré premium */}
            <div className="relative p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-teal-500/10 border-2 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="absolute -top-3 left-4 px-3 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                Résultat
              </div>
              <div className="text-center py-2 overflow-visible">
                <span className="text-emerald-300 text-lg sm:text-xl font-bold">
                  <LatexMath math="\vec{B}(M) = \frac{\mu_0 I}{4\pi d} \left[\sin\alpha_2 - \sin\alpha_1\right] \vec{e_\theta}" />
                </span>
              </div>
            </div>
          </CollapsibleStep>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* CAS LIMITE: FIL INFINI                     */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-amber-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-bl-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cas limite • Fil Infini</span>
        </div>

        <h2 className="text-lg sm:text-xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          Retrouver le résultat du fil infini
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 font-medium">
          Quand le segment <LatexMath math="[AB]" /> devient infiniment long, les angles limites deviennent :
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-muted/60 dark:bg-slate-900/40 border border-border text-center">
            <div className="text-amber-400 font-mono"><LatexMath math="\alpha_1 \to -\frac{\pi}{2}" /></div>
            <div className="text-[9px] text-muted-foreground/70 mt-1">Point A → -∞</div>
          </div>
          <div className="p-3 rounded-xl bg-muted/60 dark:bg-slate-900/40 border border-border text-center">
            <div className="text-amber-400 font-mono"><LatexMath math="\alpha_2 \to +\frac{\pi}{2}" /></div>
            <div className="text-[9px] text-muted-foreground/70 mt-1">Point B → +∞</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted dark:bg-slate-950/60 border border-border/60 text-center text-xs mb-4 overflow-x-auto">
          <span className="text-amber-400">
            <LatexMath math="\sin\left(\frac{\pi}{2}\right) - \sin\left(-\frac{\pi}{2}\right) = 1 - (-1) = 2" />
          </span>
        </div>

        {/* Résultat fil infini */}
        <div className="relative p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
          <div className="absolute -top-3 left-4 px-3 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full uppercase tracking-wider">
            Fil Infini
          </div>
          <div className="text-center py-2 overflow-visible">
            <span className="text-amber-300 text-lg sm:text-xl font-bold">
              <LatexMath math="\vec{B}(M) = \frac{\mu_0 I}{2\pi d} \vec{e_\theta}" />
            </span>
          </div>
          <p className="text-[10px] text-center text-amber-400/60 mt-1 font-medium">
            On retrouve le résultat classique du fil infini ! 🎉
          </p>
        </div>

        {/* Note physique */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/15 flex items-start gap-3">
          <Lightbulb className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-[10px] sm:text-[11px] text-cyan-200/70 leading-relaxed">
            <strong className="text-cyan-300">Remarque :</strong> Le champ décroît en <LatexMath math="1/d" /> et s&apos;enroule autour du fil (direction <LatexMath math="\vec{e_\theta}" />). Les lignes de champ sont des cercles concentriques centrés sur le fil — exactement ce que nous avons vu au Chapitre 1 !
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* APPLICATION 2: SPIRE CIRCULAIRE             */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-emerald-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-bl-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Application 2 • Champ créé par une Spire Circulaire</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          Champ sur l'axe : Spire, Bobine et Solénoïde
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-medium">
          On considère un circuit circulaire de rayon <LatexMath math="R" /> parcouru par un courant <LatexMath math="I" />. On cherche le champ magnétique <LatexMath math="\vec{B}(M)" /> en un point <LatexMath math="M" /> situé sur l'axe à une distance <LatexMath math="x" /> du centre.
        </p>

            {/* 3D Visualisation */}
            <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Visualisation 3D Interactive
            </h3>
            <p className="text-[11px] text-muted-foreground mb-4">
              Déplacez les curseurs pour modifier le rayon R de la spire et la distance x du point M. Observez le vecteur champ élémentaire <LatexMath math="d\vec{B}" /> et la résultante <LatexMath math="\vec{B}(M)" /> sur l'axe.
            </p>

            <div className="mb-8 w-full flex justify-center">
              <BiotSavartSpire3DCanvas />
            </div>

        {/* Démonstration Step-by-Step */}
        <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          Démonstration complète
        </h3>

        <div className="space-y-3">
          {/* Étape 1: Symétries */}
          <CollapsibleStep step={1} title="Étude de symétrie et Invariance" color="cyan" defaultOpen={true}>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Avant de calculer le champ magnétique, on détermine sa direction à l'aide des règles de symétrie et d'invariance.
            </p>
            <div className="flex flex-col gap-3 mt-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <div className="text-cyan-400 text-xs">
                <span className="font-bold text-cyan-300">1. Symétries : </span>
                Tout plan contenant l'axe <LatexMath math="(Ox)" block={false} /> coupe la spire en deux parties identiques parcourues par des courants dans des sens opposés. Ce sont donc des plans d'antisymétrie pour la distribution de courant.
                <br /><br />
                <span className="bg-cyan-500/10 p-1.5 rounded font-bold">
                  On sait que : <LatexMath math="M \in \text{Plan d'antisymétrie} \implies \vec{B}(M) \in \text{Plan d'antisymétrie}" block={false} />
                </span>
                <br /><br />
                Puisque <LatexMath math="\vec{B}(M)" block={false} /> doit appartenir à tous les plans contenant l'axe, il est obligatoirement porté par cet axe : 
                <div className="text-center mt-2">
                  <LatexMath math="\implies \vec{B}(M) = B \, \vec{i}" block={false} />
                </div>
              </div>
              <div className="text-cyan-400 text-xs mt-2 border-t border-cyan-500/20 pt-3">
                <span className="font-bold text-cyan-300">2. Invariances : </span>
                Le système est invariant par rotation autour de l'axe <LatexMath math="(Ox)" block={false} />. Les variables <LatexMath math="r" block={false} /> et <LatexMath math="\alpha" block={false} /> dépendent uniquement de la distance <LatexMath math="x" block={false} /> du point <LatexMath math="M" block={false} /> au centre de la spire.
                <br /><br />
                <span className="bg-cyan-500/10 p-1.5 rounded font-bold">
                  <LatexMath math="\implies \vec{B}(M) = B(x) \, \vec{i}" block={false} />
                </span>
              </div>
            </div>
          </CollapsibleStep>

          {/* Étape 2: Biot-Savart */}
          <CollapsibleStep step={2} title="Loi de Biot-Savart et projection" color="pink">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              On considère un élément de longueur infinitésimal <LatexMath math="d\vec{l}" block={false} /> sur la spire. Le point <LatexMath math="M" block={false} /> est repéré par le vecteur unitaire <LatexMath math="\vec{u}" block={false} /> dirigé de la source vers <LatexMath math="M" block={false} />.
            </p>
            <div className="mt-2 p-3 rounded-lg bg-pink-500/5 border border-pink-500/20 text-xs flex flex-col gap-4 text-pink-300">
              <div>
                <span className="font-bold text-pink-400 block mb-2">On applique la loi de Biot-Savart :</span>
                <div className="text-center">
                  <LatexMath math="d\vec{B}(M) = \frac{\mu_0 I}{4\pi} \frac{d\vec{l} \wedge \vec{u}}{r^2}" block={false} />
                </div>
              </div>
              
              <div className="border-l-2 border-pink-500/30 pl-3">
                <span className="block mb-1">Puisque <LatexMath math="d\vec{l}" block={false} /> est tangent à la spire et <LatexMath math="\vec{u}" block={false} /> est dans le plan contenant l'axe, ils sont perpendiculaires. On a donc :</span>
                <div className="text-center my-2">
                  <LatexMath math="\|d\vec{l} \wedge \vec{u}\| = dl \sin\left(\frac{\pi}{2}\right) = dl \times 1 = dl" block={false} />
                </div>
                <span className="block mt-2">D'où la norme du champ élémentaire :</span>
                <div className="text-center mt-1">
                  <LatexMath math="dB = \frac{\mu_0 I \, dl}{4\pi r^2}" block={false} />
                </div>
              </div>

              <div>
                <span className="font-bold text-pink-400 block mb-2">Projection sur l'axe (Ox) :</span>
                D'après l'étude de symétrie, seule la composante <LatexMath math="dB_x" block={false} /> portée par <LatexMath math="\vec{i}" block={false} /> ne s'annule pas lors de l'intégration globale.
                <br /><br />
                Le vecteur <LatexMath math="d\vec{B}" block={false} /> étant perpendiculaire à <LatexMath math="\vec{u}" block={false} /> (propriété du produit vectoriel), il fait un angle <LatexMath math="\theta = \frac{\pi}{2} - \alpha" block={false} /> avec l'axe <LatexMath math="(Ox)" block={false} />.
                <br /><br />
                <span className="bg-pink-500/10 p-2 rounded block text-center font-bold">
                   <LatexMath math="dB_x = dB \cos(\theta) = dB \cos\left(\frac{\pi}{2} - \alpha\right) = dB \sin(\alpha)" block={false} />
                   <br className="my-2" />
                   <LatexMath math="\implies dB_x = \frac{\mu_0 I \sin(\alpha)}{4\pi r^2} dl" block={false} />
                </span>
              </div>
            </div>
          </CollapsibleStep>

          {/* Étape 3: Intégration */}
          <CollapsibleStep step={3} title="Intégration sur la spire" color="emerald" defaultOpen={true}>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Le champ total est la somme (intégrale) de toutes les contributions infinitésimales <LatexMath math="dB_x" block={false} /> le long de la spire fermée.
            </p>
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs flex flex-col gap-4 text-emerald-300">
              <div>
                <span className="block mb-2">On intègre l'expression précédente sur toute la boucle :</span>
                <div className="text-center">
                  <LatexMath math="B(x) = \int_{\text{spire}} dB_x = \int_{\text{spire}} \frac{\mu_0 I \sin(\alpha)}{4\pi r^2} dl" block={false} />
                </div>
              </div>

              <div className="border-l-2 border-emerald-500/30 pl-3">
                <span className="font-bold text-emerald-400 block mb-1">Constantes d'intégration :</span>
                Pour un point <LatexMath math="M" block={false} /> fixé sur l'axe, la distance <LatexMath math="r" block={false} /> et l'angle <LatexMath math="\alpha" block={false} /> sont les mêmes pour tous les points de la spire. Ils peuvent donc sortir de l'intégrale :
                <div className="text-center mt-2">
                  <LatexMath math="\implies B(x) = \frac{\mu_0 I \sin(\alpha)}{4\pi r^2} \int_{\text{spire}} dl" block={false} />
                </div>
              </div>

              <div>
                <span className="font-bold text-emerald-400 block mb-1">Calcul du périmètre :</span>
                On exprime un élément de longueur d'arc <LatexMath math="dl = R \, d\xi" block={false} /> où <LatexMath math="\xi" block={false} /> varie de <LatexMath math="0" block={false} /> à <LatexMath math="2\pi" block={false} /> :
                <div className="text-center my-2">
                  <LatexMath math="\int_{\text{spire}} dl = \int_0^{2\pi} R \, d\xi = R \left[\xi\right]_0^{2\pi} = 2\pi R" block={false} />
                </div>
              </div>

              <div className="bg-emerald-500/10 p-3 rounded block text-center font-bold">
                 <span className="block mb-2 text-emerald-400 text-[10px] uppercase">Ce qui nous donne le premier résultat :</span>
                 <LatexMath math="\implies B(x) = \frac{\mu_0 I \sin(\alpha)}{4\pi r^2} \times 2\pi R = \frac{\mu_0 I R \sin(\alpha)}{2 r^2}" block={false} />
              </div>
            </div>
            
            <p className="text-[11px] text-muted-foreground leading-relaxed my-3 text-center">
              Pour des raisons pratiques, on préfère exprimer le champ uniquement en fonction de l'angle <LatexMath math="\alpha" block={false} />, ou uniquement en fonction de la distance <LatexMath math="x" block={false} />. Pour cela, on utilise les relations trigonométriques du triangle rectangle sur l'axe :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 text-center flex flex-col gap-2 shadow-inner justify-between">
                <div>
                  <span className="text-emerald-400 font-bold mb-2 block border-b border-emerald-500/20 pb-2">En fonction de l'angle <LatexMath math="\alpha" block={false} /></span>
                  <span className="text-emerald-300 text-[11px] block mb-2">On a <LatexMath math="\sin(\alpha) = \frac{R}{r} \iff r^2 = \frac{R^2}{\sin^2(\alpha)}" block={false} /></span>
                  <span className="text-emerald-300 text-[11px] mb-2 block">On remplace <LatexMath math="r^2" block={false} /> dans l'expression précédente :</span>
                </div>
                <span className="text-emerald-300 text-[15px] font-bold block bg-emerald-950/50 py-3 rounded">
                  <LatexMath math="\vec{B}(M) = \frac{\mu_0 I}{2R} \sin^3(\alpha) \, \vec{i}" block={false} />
                </span>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 text-center flex flex-col gap-2 shadow-inner justify-between">
                <div>
                  <span className="text-cyan-400 font-bold mb-2 block border-b border-cyan-500/20 pb-2">En fonction de la distance <LatexMath math="x" block={false} /></span>
                  <span className="text-cyan-300 text-[11px] block mb-2">On a <LatexMath math="r = \sqrt{R^2 + x^2}" block={false} /> et <LatexMath math="\sin(\alpha) = \frac{R}{\sqrt{R^2 + x^2}}" block={false} /></span>
                  <span className="text-cyan-300 text-[11px] mb-2 block">On remplace <LatexMath math="r" block={false} /> et <LatexMath math="\sin(\alpha)" block={false} /> :</span>
                </div>
                <span className="text-cyan-300 text-[15px] sm:text-[17px] font-bold block bg-cyan-950/50 py-3 rounded">
                  <LatexMath math="\vec{B}(M) = \frac{\mu_0 I R^2}{2(R^2 + x^2)^{3/2}} \, \vec{i}" block={false} />
                </span>
              </div>
            </div>
          </CollapsibleStep>

          {/* Étape 4: Limites */}
          <CollapsibleStep step={4} title="Cas Particuliers et Limites" color="amber">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              On peut vérifier la cohérence de notre formule en étudiant les valeurs du champ aux points particuliers (au centre et à l'infini).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 flex flex-col gap-3">
                <h4 className="text-amber-500 font-bold text-xs uppercase border-b border-amber-500/20 pb-2">1. Champ au centre de la spire</h4>
                <div className="text-amber-400 text-xs flex flex-col gap-2">
                   <span>Au centre <LatexMath math="O" block={false} />, la distance <LatexMath math="x = 0" block={false} /> (ce qui correspond à un angle <LatexMath math="\alpha = \frac{\pi}{2}" block={false} />).</span>
                   <span>On remplace <LatexMath math="x=0" block={false} /> dans la formule générale :</span>
                   <span className="bg-amber-500/10 p-2 rounded text-center font-bold mt-1 text-sm">
                     <LatexMath math="\vec{B}(0) = \frac{\mu_0 I R^2}{2(R^2 + 0^2)^{3/2}} \vec{i} = \frac{\mu_0 I}{2R} \vec{i}" block={false} />
                   </span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 flex flex-col gap-3">
                <h4 className="text-amber-500 font-bold text-xs uppercase border-b border-amber-500/20 pb-2">2. À très grande distance</h4>
                <div className="text-amber-400 text-xs flex flex-col gap-2">
                   <span>Lorsque le point <LatexMath math="M" block={false} /> s'éloigne à l'infini sur l'axe :</span>
                   <span className="bg-amber-500/10 p-2 rounded text-center font-bold my-1 text-sm">
                     <LatexMath math="\lim_{x \to \pm\infty} \vec{B}(x) = \vec{0}" block={false} />
                   </span>
                   <span className="text-[11px] text-amber-500/80 leading-relaxed italic border-l-2 border-amber-500/30 pl-2 mt-1">
                     L'allure de la fonction <LatexMath math="B(x)" block={false} /> forme donc une courbe en cloche symétrique (allure de Lorentz), avec un maximum au centre <LatexMath math="x=0" block={false} />.
                   </span>
                </div>
              </div>
            </div>
          </CollapsibleStep>

          {/* Étape 5: Bobine Plate */}
          <CollapsibleStep step={5} title="Cas d'une Bobine Plate (N Spires)" color="cyan">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Une bobine plate est constituée d'un enroulement de <LatexMath math="N" block={false} /> spires circulaires. Puisqu'elle est "plate", on considère que l'épaisseur de l'enroulement est négligeable, ce qui signifie que toutes les spires sont pratiquement confondues au même endroit dans l'espace.
            </p>
            <div className="flex flex-col gap-3 mt-2 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
              <div className="text-cyan-400 text-xs">
                <span className="font-bold text-cyan-300">Application du principe de superposition : </span>
                Chaque spire crée individuellement un champ magnétique <LatexMath math="\vec{B}_{\text{spire}}" block={false} /> au point <LatexMath math="M" block={false} />. Le champ total créé par la bobine est simplement la somme vectorielle des champs créés par chacune des <LatexMath math="N" block={false} /> spires.
                <br /><br />
                <span className="bg-cyan-500/10 p-2 rounded block text-center font-bold">
                  <LatexMath math="\vec{B}_T(M) = \sum_{k=1}^N \vec{B}_k = N \cdot \vec{B}_{\text{spire}}" block={false} />
                </span>
                <br />
                Il suffit donc de prendre le résultat trouvé à l'étape 3 pour une seule spire et de le multiplier par <LatexMath math="N" block={false} />. On obtient ainsi les deux formes générales :
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 text-center flex flex-col gap-2 shadow-inner justify-between">
                <span className="text-cyan-400 font-bold mb-2 block border-b border-cyan-500/20 pb-2">En fonction de <LatexMath math="x" block={false} /></span>
                <span className="text-cyan-300 text-[15px] sm:text-[17px] font-bold block bg-cyan-950/50 py-4 rounded">
                  <LatexMath math="\vec{B}_T(M) = \frac{\mu_0 N I R^2}{2(R^2 + x^2)^{3/2}} \, \vec{i}" block={false} />
                </span>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-2 border-blue-500/30 text-center flex flex-col gap-2 shadow-inner justify-between">
                <span className="text-blue-400 font-bold mb-2 block border-b border-blue-500/20 pb-2">En fonction de <LatexMath math="\alpha" block={false} /></span>
                <span className="text-blue-300 text-[15px] font-bold block bg-blue-950/50 py-4 rounded">
                  <LatexMath math="\vec{B}_T(M) = \frac{\mu_0 N I}{2R} \sin^3(\alpha) \, \vec{i}" block={false} />
                </span>
              </div>
            </div>
          </CollapsibleStep>

          {/* Étape 6: Solénoïde */}
          <CollapsibleStep step={6} title="Cas d'un Solénoïde" color="amber">
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              Contrairement à la bobine plate, un solénoïde est une bobine <strong>longue</strong> de longueur <LatexMath math="L" block={false} /> contenant <LatexMath math="N" block={false} /> spires réparties uniformément. On définit la densité de spires <LatexMath math="n = \frac{N}{L}" block={false} /> (nombre de spires par unité de longueur).
            </p>
            <div className="flex flex-col gap-3 mt-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-400 text-xs">
              <div>
                <span className="font-bold text-amber-300">1. Découpage en tranches élémentaires : </span>
                On considère une tranche infinitésimale du solénoïde de longueur <LatexMath math="dx" block={false} />. Cette tranche contient <LatexMath math="dN = n \, dx" block={false} /> spires. Elle se comporte donc comme une mini bobine plate élémentaire qui crée un champ <LatexMath math="d\vec{B}" block={false} /> :
                <div className="text-center mt-2 mb-2 bg-amber-500/10 p-2 rounded">
                  <LatexMath math="d\vec{B} = \frac{\mu_0 (n \, dx) I}{2 R} \sin^3(\alpha) \, \vec{i}" block={false} />
                </div>
              </div>
              
              <div className="border-t border-amber-500/20 pt-3">
                <span className="font-bold text-amber-300">2. Changement de variable (<LatexMath math="x \to \alpha" block={false} />) : </span>
                Pour intégrer sur toute la longueur du solénoïde, on exprime <LatexMath math="dx" block={false} /> en fonction de l'angle <LatexMath math="\alpha" block={false} />. On sait que <LatexMath math="x = \frac{R}{\tan(\alpha)}" block={false} />. En dérivant, on obtient :
                <div className="text-center mt-2 mb-2">
                  <LatexMath math="dx = -\frac{R}{\sin^2(\alpha)} d\alpha" block={false} />
                </div>
                On remplace <LatexMath math="dx" block={false} /> dans l'expression de <LatexMath math="d\vec{B}" block={false} /> pour simplifier :
                <div className="text-center mt-2 mb-2 bg-amber-500/10 p-2 rounded">
                  <LatexMath math="d\vec{B} = \frac{\mu_0 n I}{2 R} \sin^3(\alpha) \left(-\frac{R}{\sin^2(\alpha)} d\alpha\right) \vec{i} \implies d\vec{B} = -\frac{\mu_0 n I}{2} \sin(\alpha) d\alpha \, \vec{i}" block={false} />
                </div>
              </div>

              <div className="border-t border-amber-500/20 pt-3">
                <span className="font-bold text-amber-300">3. Intégration sur le solénoïde fini : </span>
                Il suffit d'intégrer <LatexMath math="d\vec{B}" block={false} /> entre les angles <LatexMath math="\alpha_1" block={false} /> (extrémité gauche) et <LatexMath math="\alpha_2" block={false} /> (extrémité droite) :
                <div className="text-center mt-2 mb-2">
                  <LatexMath math="\vec{B}(M) = \int_{\alpha_1}^{\alpha_2} -\frac{\mu_0 n I}{2} \sin(\alpha) d\alpha \, \vec{i} = \frac{\mu_0 n I}{2} \left[ \cos(\alpha) \right]_{\alpha_1}^{\alpha_2} \vec{i}" block={false} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 text-center shadow-inner flex flex-col justify-center">
                  <span className="text-amber-400 font-bold text-[14px] block mb-3 border-b border-amber-500/20 pb-2">Champ d'un Solénoïde fini (général)</span>
                  <LatexMath math="\vec{B}(M) = \frac{\mu_0 n I}{2} (\cos(\alpha_2) - \cos(\alpha_1)) \vec{i}" block={false} className="text-amber-300 font-bold text-[15px] bg-amber-950/50 p-3 rounded block" />
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border-2 border-orange-500/30 text-center shadow-inner flex flex-col justify-center">
                  <span className="text-orange-400 font-bold text-[14px] block mb-3 border-b border-orange-500/20 pb-2">Champ au centre d'un Solénoïde Infini</span>
                  <p className="text-[10px] text-orange-300/80 mb-2 italic">Si le solénoïde est infiniment long, les angles tendent vers les limites <LatexMath math="\alpha_1 \to \pi" block={false} /> et <LatexMath math="\alpha_2 \to 0" block={false} />. Puisque <LatexMath math="\cos(0)=1" block={false} /> et <LatexMath math="\cos(\pi)=-1" block={false} />, le terme <LatexMath math="(1 - (-1)) = 2" block={false} /> annule le diviseur.</p>
                  <LatexMath math="\vec{B}_{\text{infini}} = \mu_0 n I \, \vec{i}" block={false} className="text-orange-400 font-black text-[17px] bg-orange-950/50 p-3 rounded block" />
              </div>
            </div>
          </CollapsibleStep>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 2: THEOREME D'AMPERE               */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <RotateCw className="w-3.5 h-3.5" />
          <span>Partie 2 • Le Théorème d&apos;Ampère (Méthode Globale)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          2. La Circulation du Champ Magnétique
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
          Tout comme le théorème de Gauss facilite le calcul du champ électrique, le <strong>théorème d&apos;Ampère</strong> simplifie le calcul du champ magnétique lorsque la distribution de courants présente un haut degré de symétrie (cylindre, tore, solénoïde).
        </p>

        <div className="mb-6">
          <FormulaCard label="Théorème d'Ampère (Forme Intégrale)" color="amber">
            <span className="text-amber-400">
              <LatexMath math="\oint_{(C)} \vec{B} \cdot d\vec{l} = \mu_0 \sum I_{enlac\acute{e}s}" />
            </span>
          </FormulaCard>
        </div>

        {/* Règle des signes */}
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-100/80 leading-relaxed">
          <strong>Comment compter les courants ?</strong> Pour déterminer le signe des courants enlacés <LatexMath math="\Sigma I_{enl}" />, on oriente le contour fermé <LatexMath math="(C)" />. D&apos;après la règle de la main droite, on définit le vecteur normal <LatexMath math="\vec{n}" /> à la surface délimitée par ce contour. Tout courant circulant dans le même sens que <LatexMath math="\vec{n}" /> est compté <strong>positivement</strong>, sinon négativement.
        </div>

        {/* Simulateur 3D Ampère */}
        <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-3 flex items-center gap-2">
          Laboratoire 3D : Courants Enlacés
        </h3>
        <p className="text-[11px] text-muted-foreground mb-4">
          Allumez ou éteignez les différents câbles pour voir comment le bilan des courants enlacés est calculé. Notez que le câble mauve (I3), qui passe <strong>à l&apos;extérieur</strong> du contour, ne participe jamais à la circulation de <LatexMath math="\vec{B}" /> !
        </p>

        <div className="mb-6 w-full flex justify-center">
          <AmpereTheorem3DCanvas />
        </div>

        {/* Méthodologie */}
        <h3 className="text-sm font-bold text-foreground/80 dark:text-slate-300 mb-3 flex items-center gap-2 mt-8">
          <Layers className="w-4 h-4 text-muted-foreground" />
          Méthodologie d&apos;application
        </h3>
        <div className="space-y-3">
          {[
            { step: "1", text: "Étudier les symétries et invariances pour déterminer la direction et la dépendance spatiale de B." },
            { step: "2", text: "Choisir un contour d'Ampère (C) pertinent (cercle, rectangle) tangent à B ou perpendiculaire." },
            { step: "3", text: "Calculer la circulation de B sur ce contour (elle se simplifie souvent en B × L)." },
            { step: "4", text: "Calculer algébriquement la somme des courants I qui traversent la surface s'appuyant sur (C)." },
            { step: "5", text: "Appliquer l'égalité et isoler l'expression de B." },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 items-center bg-muted/60 dark:bg-slate-900/40 p-3 rounded-lg border border-border">
              <div className="w-6 h-6 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-muted-foreground">
                {item.step}
              </div>
              <p className="text-[11px] text-foreground/80 dark:text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
