/* eslint-disable react-hooks/purity */
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Zap,
  BookOpen,
  Cpu,
  Layers,
  HelpCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Activity,
  Gauge,
  Sparkles,
  TrendingUp,
  Workflow,
  Flame,
  ShieldAlert,
  Radio,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Dynamic 3D Simulation Canvas for RLC Resonance
const RLCResonance3DCanvas = dynamic(
  () => import("../components/RLCResonance3DCanvas"),
  { ssr: false }
);

/* ── Collapsible Proof Component ── */
function CollapsibleProof({
  title,
  subtitle,
  children,
  badge = "Démonstration Pas-à-Pas",
  color = "cyan",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: string;
  color?: "cyan" | "amber" | "emerald" | "indigo" | "rose";
}) {
  const [isOpen, setIsOpen] = useState(false);

  const colors = {
    cyan: {
      border: "border-cyan-500/20",
      bg: "bg-cyan-950/15",
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    amber: {
      border: "border-amber-500/20",
      bg: "bg-amber-950/15",
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    emerald: {
      border: "border-emerald-500/20",
      bg: "bg-emerald-950/15",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    indigo: {
      border: "border-indigo-500/20",
      bg: "bg-indigo-950/15",
      badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    rose: {
      border: "border-rose-500/20",
      bg: "bg-rose-950/15",
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
  }[color];

  return (
    <div className={`my-3 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm overflow-hidden transition-all duration-200`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="space-y-0.5 pr-2">
          <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors.badge}`}>
            {badge}
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-foreground">{title}</h4>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 text-slate-300 shrink-0">
          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-border/30 text-xs text-foreground/90 space-y-2.5 leading-relaxed animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Interactive QCM Component with Pure LaTeX Formatting ── */
function Chap4QuickQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      q: "Dans un circuit RLC série, à quelle pulsation a lieu la résonance en intensité (courant I) ?",
      qMath: "\\text{Pulsation de résonance en courant } \\omega_r",
      optionsMath: [
        "\\omega_r = \\omega_0 = \\frac{1}{\\sqrt{LC}} \\quad (\\text{Toujours})",
        "\\omega_r = \\omega_0 \\sqrt{1 - \\frac{1}{2Q^2}}",
        "\\omega_r = \\omega_0 \\sqrt{1 - \\frac{1}{4Q^2}}",
        "\\omega_r = Q \\cdot \\omega_0",
      ],
      correct: 0,
      explanation: "L'impédance Z(ω) = R + j(Lω - 1/Cω) est minimale quand la partie imaginaire s'annule (Lω = 1/Cω), soit toujours exactement à ω = ω0, quelle que soit la valeur de Q.",
      expMath: "\\omega_r = \\omega_0 = \\frac{1}{\\sqrt{LC}} \\implies I_{m,\\max} = \\frac{E_m}{R}",
    },
    {
      q: "Quelle est la condition impérative pour observer un pic de résonance en tension aux bornes du condensateur Uc ?",
      qMath: "\\text{Condition d'existence de la résonance en tension}",
      optionsMath: [
        "Q > 1",
        "Q > \\frac{1}{\\sqrt{2}} \\approx 0.707",
        "Q < \\frac{1}{2}",
        "Q > 2",
      ],
      correct: 1,
      explanation: "L'annulation de la dérivée du dénominateur d'amplitude de Uc impose 1 - 1/(2Q²) > 0, soit Q > 1/√2 ≈ 0.707.",
      expMath: "Q > \\frac{1}{\\sqrt{2}} \\iff \\omega_r = \\omega_0 \\sqrt{1 - \\frac{1}{2Q^2}} < \\omega_0",
    },
    {
      q: "Quelle est la largeur de la bande passante à -3 dB (Δω) en intensité dans le circuit RLC série ?",
      qMath: "\\Delta\\omega = \\omega_2 - \\omega_1 \\text{ (Bande passante)}",
      optionsMath: [
        "\\Delta\\omega = \\frac{\\omega_0}{Q} = \\frac{R}{L}",
        "\\Delta\\omega = Q \\cdot \\omega_0",
        "\\Delta\\omega = \\frac{\\omega_0}{2Q}",
        "\\Delta\\omega = \\frac{R}{C}",
      ],
      correct: 0,
      explanation: "La bande passante à mi-puissance / à -3 dB vaut Δω = ω0 / Q = R / L. Plus Q est grand, plus le pic est étroit et sélectif.",
      expMath: "\\Delta\\omega = \\frac{\\omega_0}{Q} = \\frac{R}{L} \\iff Q = \\frac{\\omega_0}{\\Delta\\omega}",
    },
    {
      q: "À la résonance en courant (ω = ω0), que vaut le déphasage φ entre la tension d'entrée e(t) et le courant i(t) ?",
      qMath: "\\phi = \\phi_u - \\phi_i \\quad (\\text{à } \\omega = \\omega_0)",
      optionsMath: [
        "\\phi = +\\frac{\\pi}{2}",
        "\\phi = 0 \\quad (\\text{En phase, circuit purement résistif})",
        "\\phi = -\\frac{\\pi}{2}",
        "\\phi = \\pi",
      ],
      correct: 1,
      explanation: "À ω = ω0, les impédances de L et C se compensent exactement (jLω0 + 1/(jCω0) = 0). L'impédance totale est purement réelle Z = R, donc la tension et le courant sont en phase.",
    },
    {
      q: "Lorsque le facteur de qualité est très élevé (Q ≫ 1), quelle est l'amplitude de la tension Uc à la résonance ?",
      qMath: "\\text{Phénomène de Surtension}",
      optionsMath: [
        "U_{C,m} \\approx E_m",
        "U_{C,m} \\approx Q \\cdot E_m \\gg E_m",
        "U_{C,m} \\approx \\frac{E_m}{Q}",
        "U_{C,m} \\to 0",
      ],
      correct: 1,
      explanation: "À fort facteur de qualité Q, l'amplitude aux bornes du condensateur vaut U_C ≈ Q·Em, ce qui peut provoquer un claquage du composant (surtension dangereuse).",
      expMath: "U_{C,m}(\\omega_r) \\approx Q \\cdot E_m",
    },
    {
      q: "À la résonance en intensité, que vaut la puissance active moyenne P absorbée par le circuit RLC série ?",
      qMath: "P(\\omega_0) \\text{ (Puissance moyenne maximale)}",
      optionsMath: [
        "P(\\omega_0) = 0",
        "P(\\omega_0) = \\frac{E_m^2}{2R} = \\frac{E_{\\text{eff}}^2}{R}",
        "P(\\omega_0) = \\frac{E_m^2}{2 L \\omega_0}",
        "P(\\omega_0) = Q \\cdot \\frac{E_m^2}{R}",
      ],
      correct: 1,
      explanation: "À la résonance, I_eff = E_eff / R et cos(φ) = 1, d'où P_max = E_eff · I_eff = E_eff² / R = Em² / (2R).",
      expMath: "P_{\\max} = \\frac{1}{2} R I_{m,\\max}^2 = \\frac{E_m^2}{2 R}",
    },
  ];

  const score = Object.entries(selectedAnswers).filter(
    ([qIdx, ans]) => questions[Number(qIdx)].correct === ans
  ).length;

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-card/80 border border-border/80 space-y-5 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>QCM d&apos;Auto-Évaluation • Circuit RLC Série & Résonances (6 Questions)</span>
        </div>
        {showResults && (
          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${
              score >= 5
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : score >= 3
                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                : "bg-rose-500/10 text-rose-400 border-rose-500/30"
            }`}
          >
            Score final : {score} / {questions.length}
          </span>
        )}
      </div>

      <div className="space-y-4">
        {questions.map((item, qIdx) => (
          <div
            key={qIdx}
            className="p-4 rounded-xl bg-slate-950/50 border border-border/60 space-y-3 shadow-inner"
          >
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-semibold text-foreground leading-snug flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-xs shrink-0">
                  Q{qIdx + 1}
                </span>
                <span>{item.q}</span>
              </p>
              {item.qMath && (
                <div className="pl-8 text-xs text-cyan-400 font-mono">
                  <LatexMath math={item.qMath} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {(item.optionsMath || []).map((opt, optIdx) => {
                const isSelected = selectedAnswers[qIdx] === optIdx;
                const isCorrect = item.correct === optIdx;

                let btnStyle = "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700";
                let badgeStyle = "bg-slate-800 text-slate-400 border-slate-700";

                if (showResults) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold shadow-sm";
                    badgeStyle = "bg-emerald-500/30 text-emerald-300 border-emerald-500/40";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-500/15 border-rose-500/50 text-rose-300";
                    badgeStyle = "bg-rose-500/30 text-rose-300 border-rose-500/40";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold shadow-sm";
                  badgeStyle = "bg-indigo-500/40 text-indigo-200 border-indigo-500/50";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                    className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer gap-2 ${btnStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-5 h-5 rounded-md border text-[10px] font-bold flex items-center justify-center shrink-0 ${badgeStyle}`}>
                        {optionLabels[optIdx]}
                      </span>
                      <span className="leading-snug font-sans">
                        <LatexMath math={opt} />
                      </span>
                    </div>
                    {showResults && isCorrect && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {showResults && (
              <div className="text-[11.5px] text-muted-foreground pt-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5 leading-relaxed animate-in fade-in duration-200">
                <p>
                  💡 <strong>Explication :</strong> {item.explanation}
                </p>
                {item.expMath && (
                  <div className="p-2 rounded-lg bg-black/50 text-center text-cyan-300 font-mono border border-slate-800">
                    <LatexMath math={item.expMath} />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => setShowResults(!showResults)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/25 cursor-pointer flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          {showResults ? "Réinitialiser les Réponses" : "Valider & Corriger mes Réponses"}
        </button>
      </div>
    </div>
  );
}

/* ── MAIN CHAPTER 4 COMPONENT ── */
export default function Chap4CircuitRLCResonances() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      {/* ── HEADER ── */}
      <header className="space-y-2 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
          <Activity size={14} />
          <span>Chapitre 4 • Circuits du 2nd Ordre & Résonances</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Circuit RLC Série, Résonances & Réponses Fréquentielles
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
          Maîtrisez la forme canonique différentielle du circuit <LatexMath math="RLC" /> série, la résonance en intensité <LatexMath math="I(\omega)" />, la résonance en tension <LatexMath math="U_C(\omega)" />, la bande passante à <LatexMath math="-3\text{ dB}" />, le facteur de qualité <LatexMath math="Q" /> et le phénomène de surtension.
        </p>
      </header>

      {/* ── PARTIE 1: ÉQUATION DIFFÉRENTIELLE & FORME CANONIQUE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-1">
          <Workflow className="w-3.5 h-3.5" />
          <span>Partie 1 • Mise en Équation Canonique</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          1. Équation Différentielle Canonique du Circuit RLC Série
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Considérons un circuit série constitué d&apos;une résistance <LatexMath math="R" />, d&apos;une bobine <LatexMath math="L" /> et d&apos;un condensateur <LatexMath math="C" />, alimenté par une tension sinusoïdale <LatexMath math="e(t) = E_m \cos(\omega t)" />.
        </p>

        {/* Differential Equation Box */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
              Loi des Mailles Temporelle
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              uR + uL + uC = e(t)
            </span>
          </div>
          <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-cyan-300 font-bold text-sm border border-cyan-500/20">
            <LatexMath math="L \frac{\mathrm{d}^2 u_C}{\mathrm{d}t^2} + R \frac{\mathrm{d}u_C}{\mathrm{d}t} + \frac{1}{C} u_C(t) = \frac{1}{C} e(t)" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            En divisant par <LatexMath math="L" />, on obtient la <strong>forme canonique universelle du second ordre</strong> :
          </p>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-center font-mono text-indigo-300 font-bold text-sm">
            <LatexMath math="\frac{\mathrm{d}^2 u_C}{\mathrm{d}t^2} + \frac{\omega_0}{Q} \frac{\mathrm{d}u_C}{\mathrm{d}t} + \omega_0^2 u_C(t) = \omega_0^2 e(t)" />
          </div>
        </div>

        {/* Canonical Parameters 3-Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">1. Pulsation Propre</span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-cyan-300 font-bold text-xs">
              <LatexMath math="\omega_0 = \frac{1}{\sqrt{LC}}" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">Pulsation d&apos;oscillation libre non amortie en <LatexMath math="\text{rad}\cdot\text{s}^{-1}" />.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">2. Facteur de Qualité</span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-amber-300 font-bold text-xs">
              <LatexMath math="Q = \frac{L\omega_0}{R} = \frac{1}{RC\omega_0} = \frac{1}{R}\sqrt{\frac{L}{C}}" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">Sans dimension. Mesure la sélectivité et le faible amortissement.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-1.5">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">3. Facteur d&apos;Amortissement</span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-emerald-300 font-bold text-xs">
              <LatexMath math="\xi = \frac{1}{2Q} = \frac{R}{2}\sqrt{\frac{C}{L}}" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">Régime pseudopériodique si <LatexMath math="\xi < 1 \iff Q > 1/2" />.</p>
          </div>
        </div>
      </section>

      {/* ── PARTIE 2: RÉSONANCE EN INTENSITÉ & BANDE PASSANTE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Partie 2 • Résonance en Courant I(ω)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          2. Résonance en Intensité & Bande Passante à -3 dB
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          En notation complexe avec la pulsation réduite <LatexMath math="x = \frac{\omega}{\omega_0}" />, l&apos;impédance complexe du circuit <LatexMath math="RLC" /> série s&apos;écrit :
        </p>
        <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 text-center font-mono text-emerald-300 font-bold text-sm">
          <LatexMath math="\underline{Z}(x) = R + j\left(L\omega - \frac{1}{C\omega}\right) = R\left[1 + j Q\left(x - \frac{1}{x}\right)\right]" />
        </div>

        {/* Current Amplitude Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-3 shadow-lg">
          <h4 className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Propriétés Fondamentales de la Résonance en Courant
          </h4>

          <div className="space-y-2 text-xs text-slate-300 font-mono">
            <p className="font-sans text-slate-200">
              <strong>1. Amplitude du courant :</strong>
            </p>
            <div className="p-2 rounded bg-black/60 text-center text-cyan-300 font-bold">
              <LatexMath math="I_m(x) = \frac{E_m}{|\underline{Z}(x)|} = \frac{E_m/R}{\sqrt{1 + Q^2\left(x - \frac{1}{x}\right)^2}}" />
            </div>
            <ul className="font-sans text-slate-300 space-y-1 pl-1 text-[11px] leading-relaxed">
              <li>• <strong>Pulsation de résonance :</strong> <LatexMath math="\omega_r = \omega_0" /> (indépendamment de <LatexMath math="Q" /> !).</li>
              <li>• <strong>Courant maximal :</strong> <LatexMath math="I_{m,\max} = \frac{E_m}{R}" /> (le circuit est purement résistif, <LatexMath math="\phi = 0" />).</li>
              <li>• <strong>Bande passante à -3 dB :</strong> <LatexMath math="\Delta\omega = \omega_2 - \omega_1 = \frac{\omega_0}{Q} = \frac{R}{L}" />.</li>
              <li>• <strong>Définition de la sélectivité :</strong> <LatexMath math="Q = \frac{\omega_0}{\Delta\omega}" /> (plus <LatexMath math="Q" /> est élevé, plus le pic est aigu).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── PARTIE 3: RÉSONANCE EN TENSION UC & SURTENSION ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-1">
          <Gauge className="w-3.5 h-3.5" />
          <span>Partie 3 • Résonance en Tension & Surtension</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          3. Résonance en Tension aux Bornes du Condensateur (<LatexMath math="U_C" />) & Phénomène de Surtension
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Contrairement au courant dont le pic a toujours lieu à <LatexMath math="\omega_0" />, la tension aux bornes du condensateur <LatexMath math="u_C(t)" /> présente des propriétés très spécifiques.
        </p>

        {/* Transfer Function Proof */}
        <CollapsibleProof
          title="Démonstration : Condition d'Existence de la Résonance en Tension"
          subtitle="Étude de la fonction de transfert et décalage de la pulsation de résonance"
          color="amber"
          badge="Démonstration Concours CPGE"
        >
          <div className="space-y-2 text-slate-300 font-sans text-xs">
            <p className="leading-relaxed">
              <strong>1. Fonction de transfert :</strong> Par le pont diviseur de tension :
            </p>
            <div className="p-2 rounded bg-black/60 text-center font-mono text-amber-300 font-bold">
              <LatexMath math="\underline{H}_C(jx) = \frac{\underline{U}_C}{\underline{E}} = \frac{\frac{1}{jC\omega}}{R + jL\omega + \frac{1}{jC\omega}} = \frac{1}{1 - x^2 + j\frac{x}{Q}}" />
            </div>
            <p className="leading-relaxed">
              <strong>2. Recherche du maximum du module :</strong> L&apos;amplitude <LatexMath math="U_{C,m}(x) = \frac{E_m}{\sqrt{(1-x^2)^2 + \frac{x^2}{Q^2}}}" /> est maximale lorsque le polynôme <LatexMath math="f(u) = (1-u)^2 + \frac{u}{Q^2}" /> (avec <LatexMath math="u = x^2" />) est minimal :
            </p>
            <div className="p-2 rounded bg-black/60 text-center font-mono text-amber-300">
              <LatexMath math="f'(u) = 2(u-1) + \frac{1}{Q^2} = 0 \iff u_r = x_r^2 = 1 - \frac{1}{2Q^2}" />
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center font-bold text-amber-300">
              <LatexMath math="\text{Condition de résonance : } Q > \frac{1}{\sqrt{2}} \approx 0.707 \implies \omega_r = \omega_0 \sqrt{1 - \frac{1}{2Q^2}} < \omega_0" />
            </div>
          </div>
        </CollapsibleProof>

        {/* Overvoltage Alert */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-2">
          <h4 className="text-xs font-bold uppercase text-rose-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Phénomène de Surtension (<LatexMath math="U_{C,m} \approx Q \cdot E_m" />)
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            À fort facteur de qualité (<LatexMath math="Q \gg 1" />), l&apos;amplitude de la tension aux bornes du condensateur atteint :
          </p>
          <div className="p-2 rounded bg-black/50 text-center font-mono text-rose-300 font-bold text-xs">
            <LatexMath math="U_{C,m}(\omega_r) = \frac{E_m}{\frac{1}{Q}\sqrt{1 - \frac{1}{4Q^2}}} \approx Q \cdot E_m \gg E_m" />
          </div>
          <p className="text-[11px] text-slate-400">
            ⚠️ <strong>Danger pratique :</strong> Avec <LatexMath math="E_m = 10\text{ V}" /> et <LatexMath math="Q = 50" />, la tension sur le condensateur peut atteindre <LatexMath math="500\text{ V}" />, entraînant le claquage diélectrique instantané du composant !
          </p>
        </div>
      </section>

      {/* ── PARTIE 4: BILAN DE PUISSANCE EN RSF ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-extrabold mb-1 border border-indigo-500/20">
          <Flame className="w-3.5 h-3.5" />
          <span>Partie 4 • Bilan Énergétique à la Résonance</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          4. Puissance Active & Bilan Énergétique à la Résonance
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Seule la résistance <LatexMath math="R" /> dissipe de la puissance active moyenne en continu. Les éléments réactifs <LatexMath math="L" /> et <LatexMath math="C" /> échangent de l&apos;énergie entre eux sans consommation active moyenne.
        </p>

        {/* Power curve and formulas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 space-y-2">
            <span className="text-xs font-bold text-indigo-300 uppercase">Puissance Active Absorbée</span>
            <div className="p-2.5 rounded bg-black/60 text-center font-mono text-indigo-300 font-bold text-xs">
              <LatexMath math="P(x) = \frac{1}{2} R I_m^2(x) = \frac{P_{\max}}{1 + Q^2\left(x - \frac{1}{x}\right)^2}" />
            </div>
            <p className="text-[11px] text-slate-300">
              Pic maximal : <LatexMath math="P_{\max} = \frac{E_m^2}{2R} = \frac{E_{\text{eff}}^2}{R}" /> atteint à <LatexMath math="\omega = \omega_0" />.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
            <span className="text-xs font-bold text-cyan-300 uppercase">Bande Passante à Mi-Puissance</span>
            <div className="p-2.5 rounded bg-black/60 text-center font-mono text-cyan-300 font-bold text-xs">
              <LatexMath math="P(\omega_1) = P(\omega_2) = \frac{P_{\max}}{2} \iff I_m = \frac{I_{m,\max}}{\sqrt{2}}" />
            </div>
            <p className="text-[11px] text-slate-300">
              Les fréquences de coupure à <LatexMath math="-3\text{ dB}" /> correspondent exactement à la réduction de moitié de la puissance active absorbée.
            </p>
          </div>
        </div>
      </section>

      {/* ── PARTIE 5: LABORATOIRE 3D INTERACTIF ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 5 • Simulation 3D & Réponses Fréquentielles</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          5. Laboratoire 3D : Banc d&apos;Essai RLC Série & Courbes de Résonance
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Variez la pulsation d&apos;excitation <LatexMath math="\omega" /> et les paramètres <LatexMath math="R, L, C" />. Observez en temps réel le pic de résonance en intensité <LatexMath math="I(\omega)" />, la bande passante <LatexMath math="\Delta\omega" /> et la surtension sur le condensateur.
        </p>

        {/* 3D Simulation Canvas */}
        <RLCResonance3DCanvas />
      </section>

      {/* ── PARTIE 6: AUTO-ÉVALUATION & QCM ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-extrabold mb-1 border border-indigo-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Partie 6 • Validation & Auto-Évaluation</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          6. QCM d&apos;Auto-Évaluation du Chapitre 4
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Testez votre compréhension du circuit RLC série, des résonances en courant et en tension, de la bande passante et du phénomène de surtension.
        </p>

        {/* Pure LaTeX QCM */}
        <Chap4QuickQuiz />
      </section>
    </div>
  );
}
