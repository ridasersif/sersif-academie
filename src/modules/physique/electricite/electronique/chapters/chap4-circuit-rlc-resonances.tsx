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
  Award,
  Sliders,
  Scale,
  Waves,
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

/* ── Interactive QCM Component with Pure LaTeX Formatting (12 Questions) ── */
function Chap4QuickQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      q: "Dans un circuit RLC série, à quelle pulsation exacte ω a lieu la résonance en intensité (courant I maximal) ?",
      qMath: "\\omega_0 \\text{ (Pulsation propre de résonance en intensité)}",
      optionsMath: [
        "\\omega_0 = \\frac{1}{\\sqrt{LC}}",
        "\\omega_0 = \\sqrt{\\frac{L}{C}}",
        "\\omega_0 = \\frac{R}{2L}",
        "\\omega_0 = \\frac{1}{R C}",
      ],
      correct: 0,
      explanation: "L'impédance complexe Z = R + j(Lω - 1/(Cω)) a un module minimal lorsque sa partie imaginaire s'annule : Lω - 1/(Cω) = 0 <=> ω₀ = 1/√(LC).",
      expMath: "\\Im(\\underline{Z}) = 0 \\iff L\\omega_0 = \\frac{1}{C\\omega_0} \\iff \\omega_0 = \\frac{1}{\\sqrt{LC}}",
    },
    {
      q: "Que vaut la valeur maximale du courant efficace I_max à la résonance d'intensité sous tension d'alimentation efficace E ?",
      qMath: "I_{\\max}(\\omega_0) \\text{ dans le circuit RLC série}",
      optionsMath: [
        "I_{\\max} = \\frac{E}{R}",
        "I_{\\max} = \\frac{E}{L\\omega_0}",
        "I_{\\max} = \\frac{E}{R + L\\omega_0}",
        "I_{\\max} = \\frac{Q E}{R}",
      ],
      correct: 0,
      explanation: "À la résonance d'intensité, l'impédance est purement résistive Z(ω₀) = R, d'où le courant maximal I_max = E / R.",
      expMath: "Z_{\\min} = R \\implies I_{\\max} = \\frac{E}{R}",
    },
    {
      q: "Quel est le déphasage φ = φ_u - φ_i entre la tension d'alimentation et le courant à la résonance d'intensité ?",
      qMath: "\\phi(\\omega_0) \\text{ à la résonance d'intensité}",
      optionsMath: [
        "\\phi = 0 \\quad (\\text{Tension et courant en phase})",
        "\\phi = +\\frac{\\pi}{2}",
        "\\phi = -\\frac{\\pi}{2}",
        "\\phi = \\pi",
      ],
      correct: 0,
      explanation: "Puisque Z(ω₀) = R est un réel pur, l'argument de l'impédance est nul (φ = 0). Le circuit se comporte comme une résistance pure.",
    },
    {
      q: "Comment s'exprime le facteur de qualité Q d'un circuit RLC série en fonction de R, L et C ?",
      qMath: "Q \\text{ (Facteur de qualité du circuit RLC série)}",
      optionsMath: [
        "Q = \\frac{L\\omega_0}{R} = \\frac{1}{R C \\omega_0} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}",
        "Q = \\frac{R}{L\\omega_0} = R \\sqrt{\\frac{C}{L}}",
        "Q = R C \\omega_0",
        "Q = \\frac{\\sqrt{LC}}{R}",
      ],
      correct: 0,
      explanation: "Le facteur de qualité mesure le rapport entre l'énergie emmagasinée et l'énergie dissipée par période : Q = Lω₀/R = (1/R)√(L/C).",
      expMath: "Q = \\frac{L\\omega_0}{R} = \\frac{1}{R C \\omega_0} = \\frac{1}{R}\\sqrt{\\frac{L}{C}}",
    },
    {
      q: "Quelle est la largeur de la bande passante à -3 dB (en pulsation Δω) de la résonance en intensité ?",
      qMath: "\\Delta\\omega = \\omega_2 - \\omega_1 \\text{ à } I = \\frac{I_{\\max}}{\\sqrt{2}}",
      optionsMath: [
        "\\Delta\\omega = \\frac{\\omega_0}{Q} = \\frac{R}{L}",
        "\\Delta\\omega = Q \\cdot \\omega_0",
        "\\Delta\\omega = \\frac{R}{2L}",
        "\\Delta\\omega = \\frac{1}{R C}",
      ],
      correct: 0,
      explanation: "La bande passante à -3 dB est définie par I(ω) ≥ I_max / √2. L'écart entre les pulsations de coupure est exactement Δω = ω₀/Q = R/L.",
      expMath: "\\Delta\\omega = \\frac{\\omega_0}{Q} = \\frac{R}{L} \\quad \\text{et} \\quad \\Delta f = \\frac{\\Delta\\omega}{2\\pi} = \\frac{f_0}{Q}",
    },
    {
      q: "Quelle est la condition nécessaire et suffisante pour qu'il existe une résonance en tension aux bornes du condensateur u_C(t) ?",
      qMath: "\\text{Condition de résonance en charge / tension } U_C",
      optionsMath: [
        "Q > \\frac{1}{\\sqrt{2}} \\approx 0.707",
        "Q > 1",
        "Q > \\frac{1}{2}",
        "La résonance existe toujours pour tout Q > 0",
      ],
      correct: 0,
      explanation: "La dérivée de U_C(ω) ne s'annule pour une pulsation réelle positive que si 1 - 1/(2Q²) > 0, soit Q > 1/√2 ≈ 0.707. Si Q ≤ 1/√2, U_C décroît de façon monotone.",
      expMath: "\\frac{\\mathrm{d}U_C}{\\mathrm{d}\\omega} = 0 \\iff \\omega_r = \\omega_0 \\sqrt{1 - \\frac{1}{2Q^2}} \\quad (\\text{Possible si } Q > \\frac{1}{\\sqrt{2}})",
    },
    {
      q: "Lorsque la résonance en tension a lieu sur le condensateur (Q > 1/√2), comment se situe la pulsation de résonance ω_r par rapport à la pulsation propre ω_0 ?",
      qMath: "\\omega_r \\text{ comparée à } \\omega_0",
      optionsMath: [
        "\\omega_r < \\omega_0 \\quad (\\text{Légèrement inférieure à } \\omega_0)",
        "\\omega_r = \\omega_0",
        "\\omega_r > \\omega_0",
        "\\omega_r = 2 \\omega_0",
      ],
      correct: 0,
      explanation: "Puisque ω_r = ω₀ √(1 - 1/(2Q²)), le terme sous la racine est strictement inférieur à 1, donc la résonance en tension sur le condensateur se produit toujours à une pulsation inférieure à ω₀.",
      expMath: "\\omega_r = \\omega_0 \\sqrt{1 - \\frac{1}{2Q^2}} < \\omega_0",
    },
    {
      q: "Pour un facteur de qualité élevé (Q ≫ 1), quelle est la valeur maximale atteinte par la tension aux bornes du condensateur U_C,max ?",
      qMath: "\\text{Phénomène de surtension à la résonance}",
      optionsMath: [
        "U_{C,\\max} \\approx Q \\cdot E",
        "U_{C,\\max} = E",
        "U_{C,\\max} = \\frac{E}{Q}",
        "U_{C,\\max} = Q^2 \\cdot E",
      ],
      correct: 0,
      explanation: "Pour Q ≫ 1, U_C,max = (Q·E) / √(1 - 1/(4Q²)) ≈ Q·E. Si E = 10 V et Q = 100, la tension aux bornes du condensateur peut atteindre 1000 V (phénomène de surtension dangereux).",
      expMath: "U_{C,\\max} = \\frac{Q E}{\\sqrt{1 - \\frac{1}{4Q^2}}} \\approx Q E \\quad (\\text{pour } Q \\gg 1)",
    },
    {
      q: "À quelle pulsation a lieu la résonance en tension aux bornes de la bobine idéale u_L(t) ?",
      qMath: "\\omega_{r,L} \\text{ (Résonance en tension de l'inductance)}",
      optionsMath: [
        "\\omega_{r,L} = \\frac{\\omega_0}{\\sqrt{1 - \\frac{1}{2Q^2}}} > \\omega_0",
        "\\omega_{r,L} = \\omega_0 \\sqrt{1 - \\frac{1}{2Q^2}} < \\omega_0",
        "\\omega_{r,L} = \\omega_0",
        "\\omega_{r,L} = Q \\omega_0",
      ],
      correct: 0,
      explanation: "Par dualité, la tension aux bornes de la bobine U_L(ω) résonne à une pulsation légèrement supérieure à ω₀ : ω_r,L = ω₀ / √(1 - 1/(2Q²)) pour Q > 1/√2.",
    },
    {
      q: "Quelle est l'expression de la puissance active moyenne P(ω) absorbée par le circuit RLC série en fonction de P_max, Q et x = ω/ω_0 ?",
      qMath: "P(x) \\text{ (Courbe de résonance énergétique de Lorentz)}",
      optionsMath: [
        "P(x) = \\frac{P_{\\max}}{1 + Q^2 \\left(x - \\frac{1}{x}\\right)^2}",
        "P(x) = P_{\\max} \\left[1 + Q^2 \\left(x - \\frac{1}{x}\\right)^2\\right]",
        "P(x) = \\frac{P_{\\max}}{\\sqrt{1 + Q^2 \\left(x - \\frac{1}{x}\\right)^2}}",
        "P(x) = P_{\\max} \\cdot Q \\left(x - \\frac{1}{x}\\right)",
      ],
      correct: 0,
      explanation: "La puissance moyenne active absorbée est P = R I² = R (I_max / √(1 + Q²(x - 1/x)²))² = P_max / [1 + Q²(x - 1/x)²]. C'est une courbe lorentzienne.",
      expMath: "P(\\omega) = \\frac{P_{\\max}}{1 + Q^2 \\left(\\frac{\\omega}{\\omega_0} - \\frac{\\omega_0}{\\omega}\\right)^2} \\quad \\text{avec } P_{\\max} = \\frac{E^2}{R}",
    },
    {
      q: "Que vaut l'énergie électromagnétique totale E_tot emmagasinée dans le circuit RLC série à la résonance ω = ω_0 ?",
      qMath: "\\mathcal{E}_{\\text{tot}}(t) = \\frac{1}{2} L i^2(t) + \\frac{1}{2} C u_C^2(t)",
      optionsMath: [
        "\\mathcal{E}_{\\text{tot}} = \\frac{1}{2} L I_m^2 = \\text{Constante dans le temps}",
        "\\mathcal{E}_{\\text{tot}}(t) \\text{ oscille à la pulsation } 2\\omega_0",
        "\\mathcal{E}_{\\text{tot}} = 0 \\text{ car L et C s'annulent}",
        "\\mathcal{E}_{\\text{tot}} = \\frac{1}{2} R I_m^2",
      ],
      correct: 0,
      explanation: "À la résonance, le courant et la tension aux bornes du condensateur sont en quadrature de phase exacte (sinus et cosinus). La somme des énergies 1/2 Li² + 1/2 Cu_C² est rigoureusement constante à chaque instant :",
      expMath: "\\mathcal{E}_{\\text{tot}}(t) = \\frac{1}{2} L I_m^2 \\cos^2(\\omega_0 t) + \\frac{1}{2} C (Q E_m)^2 \\sin^2(\\omega_0 t) = \\frac{1}{2} L I_m^2 = \\text{Cste}",
    },
    {
      q: "Dans un récepteur radio à circuit RLC accordé sur f_0 = 1 MHz avec une bande passante audio Δf = 10 kHz, quel doit être le facteur de qualité Q du circuit ?",
      qMath: "\\text{Application numérique : Sélectivité radio}",
      optionsMath: [
        "Q = \\frac{f_0}{\\Delta f} = \\frac{10^6}{10^4} = 100",
        "Q = \\frac{\\Delta f}{f_0} = 0.01",
        "Q = \\sqrt{f_0 \\cdot \\Delta f} = 1000",
        "Q = 10",
      ],
      correct: 0,
      explanation: "Le facteur de qualité nécessaire pour filtrer la station radio avec la sélectivité demandée est Q = f₀ / Δf = 1 000 000 / 10 000 = 100.",
      expMath: "Q = \\frac{f_0}{\\Delta f} = \\frac{10^6\\text{ Hz}}{10^4\\text{ Hz}} = 100",
    },
  ];

  const score = Object.entries(selectedAnswers).filter(
    ([qIdx, ans]) => questions[Number(qIdx)].correct === ans
  ).length;

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-card/80 border border-border/80 space-y-5 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs sm:text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>QCM d&apos;Auto-Évaluation • Circuit RLC Série, Résonances & Réponses Fréquentielles (12 Questions)</span>
        </div>
        {showResults && (
          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${
              score >= 10
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : score >= 6
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
              {(item.optionsMath || (item as { optionsText?: string[] }).optionsText || []).map((opt, optIdx) => {
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
                        {item.optionsMath ? <LatexMath math={opt} /> : <span>{opt}</span>}
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
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12 font-sans">
      {/* ── HEADER ── */}
      <header className="space-y-2 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
          <Waves size={14} />
          <span>Chapitre 4 • Circuits Résonants & Réponses Fréquentielles</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Circuit RLC Série, Résonances & Facteur de Qualité
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
          Étude analytique approfondie du circuit <LatexMath math="RLC" /> série en régime sinusoïdal forcé : impédance canonique, résonance en intensité, bande passante à <LatexMath math="-3\text{ dB}" />, phénomène de surtension aux bornes du condensateur, bilan énergétique et applications industrielles (filtrage et récepteurs radio).
        </p>
      </header>

      {/* ── PARTIE 1: MISE EN ÉQUATION & IMPÉDANCE DU RLC SÉRIE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-1">
          <Workflow className="w-3.5 h-3.5" />
          <span>Partie 1 • Modélisation Canonique</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          1. Mise en Équation & Impédance Canonique du Circuit RLC Série
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Considérons un circuit <LatexMath math="RLC" /> série excité par une source de tension sinusoïdale idéale <LatexMath math="e(t) = E_m \cos(\omega t) = \sqrt{2} E \cos(\omega t)" />.
        </p>

        {/* Canonical Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 shadow-md">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
              1. Impédance Complexe Canonique
            </span>
            <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-cyan-300 font-bold text-sm border border-cyan-500/20">
              <LatexMath math="\underline{Z} = R + j\left(L\omega - \frac{1}{C\omega}\right) = R\left[1 + j Q \left(x - \frac{1}{x}\right)\right]" />
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-1 leading-relaxed">
              <li>• <LatexMath math="x = \frac{\omega}{\omega_0}" /> : Pulsation réduite sans dimension.</li>
              <li>• <LatexMath math="\omega_0 = \frac{1}{\sqrt{LC}}" /> : Pulsation propre du circuit.</li>
              <li>• <LatexMath math="Q = \frac{L\omega_0}{R} = \frac{1}{R C \omega_0} = \frac{1}{R}\sqrt{\frac{L}{C}}" /> : Facteur de qualité.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 shadow-md">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
              2. Module et Déphasage
            </span>
            <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-indigo-300 font-bold text-sm border border-indigo-500/20">
              <LatexMath math="|\underline{Z}| = R \sqrt{1 + Q^2 \left(x - \frac{1}{x}\right)^2}, \quad \tan\phi = Q \left(x - \frac{1}{x}\right)" />
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-1 leading-relaxed">
              <li>• <LatexMath math="x < 1" /> (<LatexMath math="\omega < \omega_0" />) : <LatexMath math="\phi < 0" /> (Comportement capacitif).</li>
              <li>• <LatexMath math="x = 1" /> (<LatexMath math="\omega = \omega_0" />) : <LatexMath math="\phi = 0" /> (Comportement purement résistif).</li>
              <li>• <LatexMath math="x > 1" /> (<LatexMath math="\omega > \omega_0" />) : <LatexMath math="\phi > 0" /> (Comportement inductif).</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── PARTIE 2: RÉSONANCE EN INTENSITÉ (COURANT) ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-1">
          <Activity className="w-3.5 h-3.5" />
          <span>Partie 2 • Résonance en Courant</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          2. Résonance en Intensité & Bande Passante à -3 dB
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Le courant efficace traversant le circuit <LatexMath math="RLC" /> série s&apos;exprime par la loi d&apos;Ohm :
        </p>
        <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 text-center font-mono text-emerald-300 font-bold text-sm">
          <LatexMath math="I(x) = \frac{E}{|\underline{Z}(x)|} = \frac{E/R}{\sqrt{1 + Q^2 \left(x - \frac{1}{x}\right)^2}} = \frac{I_{\max}}{\sqrt{1 + Q^2 \left(x - \frac{1}{x}\right)^2}}" />
        </div>

        {/* Intensity resonance features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-1.5">
            <span className="text-xs font-bold text-emerald-400 uppercase">1. Maximum Strict</span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-emerald-300 font-bold text-xs">
              <LatexMath math="I_{\max} = \frac{E}{R} \quad \text{pour } \omega = \omega_0" />
            </div>
            <p className="text-[11px] text-slate-300">L&apos;effet inductif compense exactement l&apos;effet capacitif : <LatexMath math="L\omega_0 = \frac{1}{C\omega_0}" />.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-1.5">
            <span className="text-xs font-bold text-cyan-400 uppercase">2. Déphasage Nul</span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-cyan-300 font-bold text-xs">
              <LatexMath math="\phi(\omega_0) = 0 \quad (\text{En Phase})" />
            </div>
            <p className="text-[11px] text-slate-300">Tension et intensité oscillent en phase parfaite, facteur de puissance <LatexMath math="\cos\phi = 1" />.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase">3. Bande Passante</span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-amber-300 font-bold text-xs">
              <LatexMath math="\Delta\omega = \frac{\omega_0}{Q} = \frac{R}{L}" />
            </div>
            <p className="text-[11px] text-slate-300">Plus <LatexMath math="Q" /> est grand, plus le pic est aigu et sélectif (filtrage haute sélectivité).</p>
          </div>
        </div>

        {/* Proof of Bandwidth */}
        <CollapsibleProof
          title="Démonstration Complète de la Bande Passante & des Fréquences de Coupure"
          subtitle="Calcul des pulsations de coupure à -3 dB telles que I = I_max / √2"
          color="emerald"
          badge="Démonstration Concours"
        >
          <div className="space-y-2.5 text-slate-300 font-sans text-xs leading-relaxed">
            <p>
              Les pulsations de coupure <LatexMath math="\omega_1" /> et <LatexMath math="\omega_2" /> vérifient la condition de puissance moitié :
            </p>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-emerald-300 font-bold">
              <LatexMath math="I(x) = \frac{I_{\max}}{\sqrt{2}} \iff Q\left|x - \frac{1}{x}\right| = 1 \iff x - \frac{1}{x} = \pm \frac{1}{Q}" />
            </div>
            <p>
              En résolvant les deux équations du second degré <LatexMath math="x^2 \mp \frac{1}{Q} x - 1 = 0" />, on obtient les deux racines physiques positives :
            </p>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center font-mono text-emerald-300 font-bold">
              <LatexMath math="x_1, x_2 = \sqrt{1 + \frac{1}{4Q^2}} \mp \frac{1}{2Q} \implies \Delta x = x_2 - x_1 = \frac{1}{Q} \implies \Delta\omega = \frac{\omega_0}{Q} = \frac{R}{L}" />
            </div>
            <p>
              On note également la relation remarquable de moyenne géométrique : <LatexMath math="\omega_1 \cdot \omega_2 = \omega_0^2" />.
            </p>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 3: RÉSONANCE EN TENSION SUR LE CONDENSATEUR (SURTENSION) ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-1">
          <Zap className="w-3.5 h-3.5" />
          <span>Partie 3 • Phénomène de Surtension</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          3. Résonance en Tension aux Bornes de C & Phénomène de Surtension
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          La tension complexe aux bornes du condensateur s&apos;obtient par le pont diviseur de tension :
        </p>
        <div className="p-3.5 rounded-xl bg-black/60 border border-rose-500/30 text-center font-mono text-rose-300 font-bold text-sm">
          <LatexMath math="\underline{U}_C(x) = \frac{\frac{1}{j C \omega}}{\underline{Z}} \underline{E} = \frac{\underline{E}}{1 - x^2 + j \frac{x}{Q}} \implies U_C(x) = \frac{E}{\sqrt{(1 - x^2)^2 + \frac{x^2}{Q^2}}}" />
        </div>

        {/* Condition of Resonance Alert */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Condition d&apos;Existence de la Résonance en Tension :</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/60 border border-rose-500/30 text-center font-mono text-rose-300 font-bold">
              <LatexMath math="Q > \frac{1}{\sqrt{2}} \approx 0.707 \quad (\text{Condition Obligatoire})" />
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-rose-500/30 text-center font-mono text-rose-300 font-bold">
              <LatexMath math="\omega_r = \omega_0 \sqrt{1 - \frac{1}{2Q^2}} < \omega_0" />
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            • Si <LatexMath math="Q \le \frac{1}{\sqrt{2}}" /> : Il n&apos;y a <strong>aucune résonance</strong>. La tension <LatexMath math="U_C(\omega)" /> décroît de façon monotone depuis <LatexMath math="E" /> jusqu&apos;à 0.
            <br />
            • Si <LatexMath math="Q > \frac{1}{\sqrt{2}}" /> : Il existe un pic de résonance qui se produit à une pulsation <LatexMath math="\omega_r < \omega_0" />.
          </p>
        </div>

        {/* Overvoltage proof */}
        <CollapsibleProof
          title="Démonstration de la Surtension Maximale"
          subtitle="Calcul de la valeur crête Uc,max et risque de claquage diélectrique"
          color="rose"
          badge="Phénomène Critique"
        >
          <div className="space-y-2.5 text-slate-300 font-sans text-xs leading-relaxed">
            <p>
              En remplaçant <LatexMath math="x_r^2 = 1 - \frac{1}{2Q^2}" /> dans l&apos;expression de <LatexMath math="U_C" />, on obtient la valeur maximale :
            </p>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center font-mono text-rose-300 font-bold text-sm">
              <LatexMath math="U_{C,\max} = \frac{Q E}{\sqrt{1 - \frac{1}{4Q^2}}} \approx Q \cdot E \quad (\text{pour } Q \gg 1)" />
            </div>
            <div className="p-2.5 rounded bg-black/50 border border-slate-800 text-[11px] text-amber-300">
              ⚠️ <strong>Application Sécurité :</strong> Si un générateur injecte <LatexMath math="E = 12\text{ V}" /> dans un circuit à <LatexMath math="Q = 50" />, la tension sur le condensateur grimpe à <LatexMath math="U_{C,\max} \approx 600\text{ V}" /> ! Ce phénomène peut provoquer le claquage destructif du diélectrique ou une électrocution.
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 4: BILAN ÉNERGÉTIQUE & PUISSANCE ABSORBÉE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Partie 4 • Bilan Énergétique</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          4. Puissance Moyenne Absorbée & Échange Énergétique L-C
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Seule la résistance <LatexMath math="R" /> dissipe de la puissance active en moyenne temporelle. La puissance active absorbée par le circuit s&apos;écrit :
        </p>

        <div className="p-3.5 rounded-xl bg-black/60 border border-amber-500/30 text-center font-mono text-amber-300 font-bold text-sm">
          <LatexMath math="P(x) = R I^2(x) = \frac{P_{\max}}{1 + Q^2 \left(x - \frac{1}{x}\right)^2} \quad \text{avec } P_{\max} = \frac{E^2}{R}" />
        </div>

        {/* Energy oscillation proof */}
        <CollapsibleProof
          title="Conservation de l'Énergie Totale à la Résonance"
          subtitle="Échange perpétuel entre énergie magnétique et énergie électrostatique"
          color="amber"
          badge="Bilan Thermodynamique"
        >
          <div className="space-y-2.5 text-slate-300 font-sans text-xs leading-relaxed">
            <p>
              À la résonance <LatexMath math="\omega = \omega_0" />, le courant et la tension <LatexMath math="u_C(t)" /> sont en quadrature de phase parfaite :
            </p>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-amber-300">
              <LatexMath math="i(t) = I_m \cos(\omega_0 t) \quad \text{et} \quad u_C(t) = Q E_m \sin(\omega_0 t)" />
            </div>
            <p>
              L&apos;énergie totale emmagasinée dans la bobine et le condensateur est rigoureusement constante :
            </p>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center font-mono text-amber-300 font-bold">
              <LatexMath math="\mathcal{E}_{\text{tot}}(t) = \frac{1}{2} L i^2(t) + \frac{1}{2} C u_C^2(t) = \frac{1}{2} L I_m^2 = \text{Constante}" />
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 5: GRAND EXERCICE CONCOURS GUIDÉ ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-extrabold mb-1 border border-cyan-500/20">
          <Award className="w-3.5 h-3.5" />
          <span>Partie 5 • Grand Exercice Concours Guidé</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          5. Exercice Concours : Dimensionnement d&apos;un Récepteur Radio RLC
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          On souhaite concevoir l&apos;étage d&apos;entrée d&apos;un récepteur radio pour capter une station émettant à <LatexMath math="f_0 = 1.0\text{ MHz}" /> avec une bande passante audio <LatexMath math="\Delta f = 10\text{ kHz}" />. La bobine d&apos;accord a une inductance <LatexMath math="L = 100\text{ }\mu\text{H}" />.
        </p>

        <CollapsibleProof
          title="Résolution Guidée & Calculs Numériques Pas-à-Pas"
          subtitle="Détermination de la capacité C, de la résistance R et du gain en tension"
          color="cyan"
          badge="Solution Complète"
        >
          <div className="space-y-3 text-slate-300 font-sans text-xs leading-relaxed">
            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <span className="text-cyan-300 font-bold block">1. Calcul du facteur de qualité Q :</span>
              <div className="p-1.5 rounded bg-slate-900 text-center font-mono text-cyan-300 font-bold">
                <LatexMath math="Q = \frac{f_0}{\Delta f} = \frac{10^6\text{ Hz}}{10^4\text{ Hz}} = 100" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <span className="text-amber-300 font-bold block">2. Calcul de la capacité d&apos;accord C :</span>
              <div className="p-1.5 rounded bg-slate-900 text-center font-mono text-amber-300 font-bold">
                <LatexMath math="C = \frac{1}{L (2\pi f_0)^2} = \frac{1}{100 \times 10^{-6} \times (2\pi \times 10^6)^2} \approx 253.3\text{ pF}" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1">
              <span className="text-emerald-300 font-bold block">3. Calcul de la résistance totale maximale R :</span>
              <div className="p-1.5 rounded bg-slate-900 text-center font-mono text-emerald-300 font-bold">
                <LatexMath math="R = \frac{L \omega_0}{Q} = \frac{100 \times 10^{-6} \times 2\pi \times 10^6}{100} \approx 6.28\text{ }\Omega" />
              </div>
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 6: LABORATOIRE 3D INTERACTIF ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 6 • Laboratoire Virtuel 3D & Simulateur de Résonance</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          6. Laboratoire Interactif 3D : Réponses Fréquentielles du Circuit RLC Série
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Explorez en direct la résonance en intensité <LatexMath math="I(\omega)" />, la surtension aux bornes du condensateur <LatexMath math="U_C(\omega)" /> et la puissance absorbée <LatexMath math="P(\omega)" />. Modifiez <LatexMath math="R, L, C" /> et observez l&apos;impact instantané sur le facteur de qualité <LatexMath math="Q" /> et la bande passante.
        </p>

        {/* 3D Simulation Canvas */}
        <RLCResonance3DCanvas />
      </section>

      {/* ── PARTIE 7: AUTO-ÉVALUATION & QCM ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-extrabold mb-1 border border-indigo-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Partie 7 • Validation & Auto-Évaluation</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          7. QCM d&apos;Auto-Évaluation du Chapitre 4 (12 Questions)
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Validez votre compréhension des résonances, de la bande passante, du phénomène de surtension et des bilans d&apos;énergie dans les circuits <LatexMath math="RLC" /> série.
        </p>

        {/* Pure LaTeX QCM */}
        <Chap4QuickQuiz />
      </section>
    </div>
  );
}
