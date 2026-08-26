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
  Flame,
  Magnet,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Workflow,
  Sparkles,
  RefreshCw,
  Sliders,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Dynamic Simulation Canvases
const KirchhoffLaws3DCanvas = dynamic(() => import('../components/KirchhoffLaws3DCanvas'), { ssr: false });
const NetworkThevenin3DCanvas = dynamic(
  () => import("../components/NetworkThevenin3DCanvas"),
  { ssr: false }
);
const SourcesLabSimulator = dynamic(
  () => import("../components/SourcesLabSimulator"),
  { ssr: false }
);
const FiveMethodsCircuitLab = dynamic(
  () => import("../components/FiveMethodsCircuitLab").then(mod => mod.FiveMethodsCircuitLab),
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
          <h4 className="text-[11px] sm:text-[11px] font-bold text-foreground">{title}</h4>
          {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/80 text-slate-300 shrink-0">
          {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-border/30 text-[11px] text-foreground/90 space-y-2.5 leading-relaxed animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Interactive QCM Component with Pure LaTeX Formatting ── */
function Chap2QuickQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      q: "Dans un réseau comportant N nœuds et B branches, quel est le nombre de mailles indépendantes M ?",
      qMath: "\\text{Théorème d'Euler pour les graphes de réseaux}",
      optionsMath: [
        "M = B - N",
        "M = B - N + 1",
        "M = B + N - 1",
        "M = N - 1",
      ],
      correct: 1,
      explanation: "Le nombre d'équations de mailles indépendantes est donné par la relation topologique :",
      expMath: "M = B - (N - 1) = B - N + 1",
    },
    {
      q: "Quelle est la relation d'équivalence entre le modèle de Thévenin (Eth, Rth) et le modèle de Norton (ηN, RN) ?",
      qMath: "\\text{Transformation Thévenin } \\iff \\text{ Norton}",
      optionsMath: [
        "\\eta_N = \\frac{E_{th}}{R_{th}} \\quad \\text{et} \\quad R_N = R_{th}",
        "\\eta_N = E_{th} \\cdot R_{th} \\quad \\text{et} \\quad R_N = \\frac{1}{R_{th}}",
        "\\eta_N = \\frac{R_{th}}{E_{th}} \\quad \\text{et} \\quad R_N = R_{th}",
        "\\eta_N = \\frac{E_{th}}{R_{th}^2} \\quad \\text{et} \\quad R_N = 2 R_{th}",
      ],
      correct: 0,
      explanation: "L'égalité des caractéristiques courant-tension impose :",
      expMath: "\\eta_N = \\frac{E_{th}}{R_{th}} \\quad \\text{et} \\quad R_N = R_{th}",
    },
    {
      q: "Lors de l'application du théorème de superposition, comment éteint-on une source idéale de tension indépendante ?",
      qMath: "\\text{Passivation d'une source de f.é.m } E",
      optionsText: [
        "On la remplace par un interrupteur ouvert (i = 0)",
        "On la remplace par un court-circuit / fil parfait (u = 0)",
        "On la remplace par une résistance infinie",
        "On conserve sa tension en inversant sa polarité",
      ],
      correct: 1,
      explanation: "Éteindre une source de tension signifie imposer E = 0 V, ce qui équivaut physiquement à un court-circuit (fil parfait).",
    },
    {
      q: "D'après le théorème de Millman, quel est le potentiel VA d'un nœud A relié à des branches (Ek, Rk) et (ηj) ?",
      qMath: "\\text{Formule du Théorème de Millman}",
      optionsMath: [
        "V_A = \\frac{\\sum \\frac{V_k}{R_k} + \\sum \\eta_j}{\\sum \\frac{1}{R_k}}",
        "V_A = \\frac{\\sum V_k R_k}{\\sum R_k}",
        "V_A = \\sum \\frac{V_k}{R_k} \\times \\sum R_k",
        "V_A = \\frac{\\sum V_k}{\\sum \\frac{1}{R_k}}",
      ],
      correct: 0,
      explanation: "Le théorème de Millman est la réécriture de la loi des nœuds en termes de potentiels et conductances :",
      expMath: "V_A = \\frac{\\sum_{k} G_k V_k + \\sum_{j} \\eta_j}{\\sum_{k} G_k} = \\frac{\\sum \\frac{V_k}{R_k} + \\sum \\eta_j}{\\sum \\frac{1}{R_k}}",
    },
    {
      q: "À quelle condition sur la résistance de charge Rc la puissance dissipée dans celle-ci est-elle maximale ?",
      qMath: "\\text{Théorème du Transfert Maximal de Puissance}",
      optionsMath: [
        "R_c = 0 \\quad (\\text{Court-circuit})",
        "R_c = R_{th} \\quad (\\text{Adaptation d'Impédance})",
        "R_c = 2 R_{th}",
        "R_c \\to \\infty \\quad (\\text{Circuit ouvert})",
      ],
      correct: 1,
      explanation: "L'annulation de la dérivée de la puissance P(Rc) = Eth²·Rc / (Rth + Rc)² donne :",
      expMath: "\\frac{\\mathrm{d}P}{\\mathrm{d}R_c} = 0 \\iff R_c = R_{th} \\quad \\text{avec } P_{\\max} = \\frac{E_{th}^2}{4 R_{th}}",
    },
    {
      q: "Quel est le rendement énergétique global η du circuit à l'adaptation de puissance (lorsque Rc = Rth) ?",
      qMath: "\\eta = \\frac{P_{\\text{utile}}}{P_{\\text{totale}}} \\text{ pour } R_c = R_{th}",
      optionsMath: [
        "\\eta = 100\\%",
        "\\eta = 75\\%",
        "\\eta = 50\\%",
        "\\eta = 25\\%",
      ],
      correct: 2,
      explanation: "À l'adaptation, la moitié de la puissance totale est dissipée en pertes internes dans Rth, d'où un rendement de 50% :",
      expMath: "\\eta = \\frac{R_c I^2}{(R_{th} + R_c) I^2} = \\frac{R_{th}}{2 R_{th}} = 50\\%",
    },
  ];

  const score = Object.entries(selectedAnswers).filter(
    ([qIdx, ans]) => questions[Number(qIdx)].correct === ans
  ).length;

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-card/80 border border-border/80 space-y-5 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-[11px]">
          <HelpCircle className="w-4 h-4" />
          <span>QCM d&apos;Auto-Évaluation • Lois de Kirchhoff & Théorèmes (6 Questions)</span>
        </div>
        {showResults && (
          <span
            className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${
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
              <p className="text-[11px] sm:text-[11px] font-semibold text-foreground leading-snug flex items-start gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[11px] shrink-0">
                  Q{qIdx + 1}
                </span>
                <span>{item.q}</span>
              </p>
              {item.qMath && (
                <div className="pl-8 text-[11px] text-cyan-400 font-mono">
                  <LatexMath math={item.qMath} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {(item.optionsMath || item.optionsText || []).map((opt, optIdx) => {
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
                    className={`p-3 rounded-xl border text-left text-[11px] transition-all flex items-center justify-between cursor-pointer gap-2 ${btnStyle}`}
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
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold transition-all shadow-md shadow-indigo-600/25 cursor-pointer flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          {showResults ? "Réinitialiser les Réponses" : "Valider & Corriger mes Réponses"}
        </button>
      </div>
    </div>
  );
}

/* ── MAIN CHAPTER 2 COMPONENT ── */
export default function Chap2GenerateursLoisKirchhoff() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      {/* ── HEADER ── */}
      <header className="space-y-2 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-bold mb-2">
          <Zap size={14} />
          <span>Chapitre 2 • Électrocinétique dans l&apos;ARQS</span>
        </div>
        <h1 className="text-lg sm:text-lg md:text-lg font-extrabold text-foreground tracking-tight">
          Générateurs Réels, Lois de Kirchhoff & Théorèmes des Réseaux
        </h1>
        <p className="text-muted-foreground text-[11px] sm:text-[11px] leading-relaxed max-w-3xl">
          Maîtrisez la topologie des circuits électriques dans l&apos;ARQS, les lois de Kirchhoff (KCL, KVL), les modèles linéaires de Thévenin et Norton, le théorème de superposition, la loi de Millman et le transfert maximal de puissance (adaptation de charge).
        </p>
      </header>

      {/* ── PARTIE 1: TOPOLOGIE DES RÉSEAUX & LOIS DE KIRCHHOFF ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-extrabold mb-1">
          <Workflow className="w-3.5 h-3.5" />
          <span>Partie 1 • Topologie & Lois Fondamentales</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          1. Topologie des Réseaux et Lois de Kirchhoff dans l&apos;ARQS
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Dans le cadre de l&apos;<strong>Approximation des Régimes Quasi-Stationnaires (ARQS)</strong>, les temps de propagation des signaux électromagnétiques sont négligeables devant les échelles de temps caractéristiques du circuit. En conséquence, il n&apos;y a aucune accumulation de charge dans les conducteurs et le potentiel électrique est défini de manière univoque en tout point.
        </p>

        {/* Definitions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-sm">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">1. Branche (B)</span>
              <h4 className="text-[11px] font-bold text-slate-200">Portion à Courant Unique</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Ensemble de dipôles montés en série entre deux nœuds consécutifs, parcourus par la même intensité <LatexMath math="i(t)" />.
              </p>
            </div>
            <div className="mt-4 w-full h-24 flex justify-center items-center bg-black/40 rounded-xl border border-slate-800/50 overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Wire & Resistor */}
                <path d="M 30 40 L 70 40 L 75 25 L 85 55 L 95 25 L 105 55 L 110 40 L 170 40" stroke="#22d3ee" strokeWidth="3" strokeLinejoin="round"/>
                {/* Nodes A & B */}
                <circle cx="30" cy="40" r="5" fill="#22d3ee"/>
                <circle cx="170" cy="40" r="5" fill="#22d3ee"/>
                {/* Current Arrow on the line */}
                <path d="M 45 34 L 53 40 L 45 46" stroke="#22d3ee" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Labels */}
                <text x="40" y="25" fill="#22d3ee" fontSize="14" fontFamily="monospace" fontWeight="bold">i(t)</text>
                <text x="25" y="60" fill="#94a3b8" fontSize="14" fontFamily="sans-serif">A</text>
                <text x="165" y="60" fill="#94a3b8" fontSize="14" fontFamily="sans-serif">B</text>
              </svg>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-sm">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">2. Nœud (N)</span>
              <h4 className="text-[11px] font-bold text-slate-200">Jonction de Conducteurs</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Point de connexion où se rejoignent au moins <strong>trois branches</strong> (ou deux branches non triviales).
              </p>
            </div>
            <div className="mt-4 w-full h-24 flex justify-center items-center bg-black/40 rounded-xl border border-slate-800/50 overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Left Branch (in) */}
                <path d="M 40 40 L 100 40" stroke="#fbbf24" strokeWidth="3"/>
                <path d="M 65 34 L 73 40 L 65 46" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="60" y="25" fill="#fbbf24" fontSize="14" fontFamily="monospace" fontWeight="bold">i1</text>
                
                {/* Top Branch (out) */}
                <path d="M 100 40 L 100 10" stroke="#fbbf24" strokeWidth="3"/>
                <path d="M 94 25 L 100 17 L 106 25" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="115" y="25" fill="#fbbf24" fontSize="14" fontFamily="monospace" fontWeight="bold">i2</text>

                {/* Bottom Branch (out) */}
                <path d="M 100 40 L 100 70" stroke="#fbbf24" strokeWidth="3"/>
                <path d="M 94 55 L 100 63 L 106 55" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <text x="115" y="65" fill="#fbbf24" fontSize="14" fontFamily="monospace" fontWeight="bold">i3</text>
                
                {/* Node Center */}
                <circle cx="100" cy="40" r="6" fill="#fbbf24"/>
                <text x="80" y="55" fill="#94a3b8" fontSize="14" fontFamily="sans-serif">N</text>
              </svg>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between shadow-sm">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">3. Maille (M)</span>
              <h4 className="text-[11px] font-bold text-slate-200">Boucle Fermée</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Succession de branches formant un contour fermé orienté ne passant qu&apos;une seule fois par un même nœud.
              </p>
            </div>
            <div className="mt-4 w-full h-24 flex justify-center items-center bg-black/40 rounded-xl border border-slate-800/50 overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Loop Rectangle */}
                <rect x="50" y="20" width="100" height="40" stroke="#34d399" strokeWidth="3" fill="none" rx="4"/>
                {/* Nodes at corners */}
                <circle cx="50" cy="20" r="4" fill="#34d399"/>
                <circle cx="150" cy="20" r="4" fill="#34d399"/>
                <circle cx="50" cy="60" r="4" fill="#34d399"/>
                <circle cx="150" cy="60" r="4" fill="#34d399"/>
                
                {/* Circular Orientation Arrow inside */}
                <path d="M 100 28 A 12 12 0 1 1 88 40" stroke="#34d399" strokeWidth="2" fill="none" strokeDasharray="4 4"/>
                <path d="M 95 24 L 102 28 L 95 32" stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                
                {/* Label */}
                <text x="94" y="45" fill="#34d399" fontSize="16" fontFamily="monospace" fontWeight="bold">M</text>
              </svg>
            </div>
          </div>
        </div>

        {/* The Two Kirchhoff Laws */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* KCL */}
          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Loi des Nœuds (KCL)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Conservation de la Charge
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-cyan-300 font-bold text-[11px] border border-cyan-500/20">
              <LatexMath math="\sum_{k=1}^{n} \epsilon_k i_k(t) = 0 \iff \sum i_{\text{entrants}} = \sum i_{\text{sortants}}" />
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              En vertu de l&apos;ARQS, aucune charge nette ne peut s&apos;accumuler en un nœud sans créer un champ répulsif gigantesque. Le flux total de courant incident est strictement nul à chaque instant.
            </p>
          </div>

          {/* KVL */}
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Loi des Mailles (KVL)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Unicité du Potentiel
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-amber-300 font-bold text-[11px] border border-amber-500/20">
              <LatexMath math="\sum_{k=1}^{m} \epsilon_k u_k(t) = 0 \iff \oint_{\mathcal{M}} \vec{E} \cdot \mathrm{d}\vec{\ell} = 0" />
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              La circulation du champ électrostatique <LatexMath math="\vec{E} = -\vec{\nabla}V" /> le long de tout contour fermé est nulle. La somme algébrique des différences de potentiel le long d&apos;une maille orientée s&apos;annule.
            </p>
          </div>
        </div>

        {/* Topological Rule for Equations Count */}
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
          <h4 className="text-[11px] font-bold uppercase text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Méthode Systématique : Nombre d&apos;Équations Indépendantes
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Pour un réseau à <LatexMath math="B" /> branches et <LatexMath math="N" /> nœuds comportant <LatexMath math="B" /> intensités inconnues :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-center text-indigo-300 font-bold pt-1">
            <div className="p-2 rounded bg-black/50 border border-indigo-500/20">
              <LatexMath math="N - 1 \quad \text{Lois des Nœuds indépendantes}" />
            </div>
            <div className="p-2 rounded bg-black/50 border border-indigo-500/20">
              <LatexMath math="M = B - (N - 1) = B - N + 1 \quad \text{Lois des Mailles}" />
            </div>
          </div>
        </div>

        {/* Laboratoire 3D KCL/KVL */}
        <div className="mt-6 space-y-3">
          <h4 className="text-[11px] font-bold uppercase text-foreground flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Simulateur 3D : Expérimentation des Lois
          </h4>
          <KirchhoffLaws3DCanvas />
        </div>
      </section>

      {/* ── PARTIE 2: MODÉLISATION DES SOURCES ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold mb-1">
          <Zap className="w-3.5 h-3.5" />
          <span>Partie 2 • Modélisation des Sources</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          Générateurs Idéaux, Extinction des Sources & Modèles Réels
        </h2>

        {/* 1. Les Générateurs Idéaux */}
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-emerald-400 flex items-center gap-2">
            1. Les Générateurs Idéaux
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Tension Card */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-3 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Générateur Idéal de Tension</div>
                  <div className="px-2 py-0.5 rounded-full bg-cyan-950/60 font-mono text-cyan-300 text-[10px] border border-cyan-500/30"><LatexMath math="u = E" /></div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  La tension est constante <LatexMath math="u(t) = e(t)" /> <strong>quelle que soit l&apos;intensité</strong> du courant <LatexMath math="i(t)" /> délivrée. Sa résistance interne est nulle.
                </p>
              </div>
              <div className="w-full bg-slate-950/80 py-3 px-4 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 240 65" className="w-full max-w-[220px] h-auto" overflow="visible">
                  <defs>
                    <marker id="arrow-tension" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill="#facc15"/>
                    </marker>
                  </defs>
                  {/* Voltage Arrow above with label */}
                  <line x1="75" y1="12" x2="165" y2="12" stroke="#facc15" strokeWidth="1.8" markerEnd="url(#arrow-tension)" strokeLinecap="round"/>
                  <text x="120" y="8" textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold" fontFamily="monospace">u = e(t)</text>
                  
                  {/* Wires */}
                  <line x1="25" y1="40" x2="102" y2="40" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round"/>
                  <line x1="138" y1="40" x2="215" y2="40" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round"/>
                  
                  {/* Generator Circle */}
                  <circle cx="120" cy="40" r="18" fill="#020617" stroke="#22d3ee" strokeWidth="2.2"/>
                  <text x="120" y="45" textAnchor="middle" fill="#22d3ee" fontSize="14" fontWeight="bold" fontFamily="monospace">E</text>
                  
                  {/* Terminals A and B */}
                  <circle cx="25" cy="40" r="3.5" fill="#22d3ee"/>
                  <text x="25" y="27" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">A</text>
                  <circle cx="215" cy="40" r="3.5" fill="#22d3ee"/>
                  <text x="215" y="27" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">B</text>
                </svg>
              </div>
            </div>

            {/* Courant Card */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-indigo-500/20 space-y-3 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Générateur Idéal de Courant</div>
                  <div className="px-2 py-0.5 rounded-full bg-indigo-950/60 font-mono text-indigo-300 text-[10px] border border-indigo-500/30"><LatexMath math="i = \eta" /></div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Le courant est constant <LatexMath math="i(t) = \eta(t)" /> <strong>quelle que soit la tension</strong> <LatexMath math="u(t)" /> à ses bornes. Sa résistance interne est infinie.
                </p>
              </div>
              <div className="w-full bg-slate-950/80 py-3 px-4 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 240 65" className="w-full max-w-[220px] h-auto" overflow="visible">
                  <defs>
                    <marker id="arrow-courant" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill="#818cf8"/>
                    </marker>
                  </defs>
                  
                  {/* Label above */}
                  <text x="120" y="10" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="bold" fontFamily="monospace">i = η(t)</text>
                  
                  {/* Wires */}
                  <line x1="25" y1="40" x2="102" y2="40" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round"/>
                  <line x1="138" y1="40" x2="215" y2="40" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round"/>
                  
                  {/* Generator Circle with internal arrow */}
                  <circle cx="120" cy="40" r="18" fill="#020617" stroke="#818cf8" strokeWidth="2.2"/>
                  <line x1="108" y1="40" x2="132" y2="40" stroke="#818cf8" strokeWidth="2.2" markerEnd="url(#arrow-courant)" strokeLinecap="round"/>
                  
                  {/* Terminals A and B */}
                  <circle cx="25" cy="40" r="3.5" fill="#818cf8"/>
                  <text x="25" y="27" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">A</text>
                  <circle cx="215" cy="40" r="3.5" fill="#818cf8"/>
                  <text x="215" y="27" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold">B</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Éteindre une Source */}
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-emerald-400 flex items-center gap-2 mt-6">
            2. Éteindre une Source
          </h3>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Cette opération est fondamentale pour appliquer le théorème de Superposition et pour calculer la résistance équivalente de Thévenin / Norton. Éteindre (ou passiver) une source revient à annuler sa grandeur caractéristique.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Éteindre Tension */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-rose-500/30 space-y-3 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-2">Éteindre un Générateur de Tension</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  On pose <LatexMath math="e = 0" />. Un composant dont la tension est toujours nulle est un <strong>fil conducteur parfait</strong> (court-circuit).
                </p>
              </div>
              <div className="w-full bg-slate-950/80 py-3.5 px-3 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 310 70" className="w-full max-w-[290px] h-auto" overflow="visible">
                  <defs>
                    <marker id="trans-arrow-rose" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill="#f43f5e"/>
                    </marker>
                  </defs>

                  {/* LEFT: Source E */}
                  <g>
                    <line x1="15" y1="35" x2="44" y2="35" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="76" y1="35" x2="105" y2="35" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="60" cy="35" r="16" fill="#020617" stroke="#22d3ee" strokeWidth="2"/>
                    <text x="60" y="40" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold" fontFamily="monospace">E</text>
                    <circle cx="15" cy="35" r="3" fill="#22d3ee"/>
                    <text x="15" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">A</text>
                    <circle cx="105" cy="35" r="3" fill="#22d3ee"/>
                    <text x="105" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">B</text>
                  </g>

                  {/* MIDDLE: Arrow with e=0 */}
                  <g>
                    <text x="155" y="22" textAnchor="middle" fill="#f43f5e" fontSize="10" fontWeight="bold" fontFamily="monospace">e = 0</text>
                    <line x1="135" y1="35" x2="175" y2="35" stroke="#f43f5e" strokeWidth="2.2" markerEnd="url(#trans-arrow-rose)" strokeLinecap="round"/>
                  </g>

                  {/* RIGHT: Short-circuit Wire */}
                  <g>
                    <line x1="205" y1="35" x2="295" y2="35" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="205" cy="35" r="3.5" fill="#f43f5e"/>
                    <text x="205" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">A</text>
                    <circle cx="295" cy="35" r="3.5" fill="#f43f5e"/>
                    <text x="295" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">B</text>
                    <text x="250" y="55" textAnchor="middle" fill="#f43f5e" fontSize="9" fontWeight="600">Court-circuit</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Éteindre Courant */}
            <div className="p-5 rounded-xl bg-slate-900/60 border border-amber-500/30 space-y-3 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">Éteindre un Générateur de Courant</div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  On pose <LatexMath math="\eta = 0" />. Un composant traversé par un courant toujours nul est un <strong>circuit ouvert</strong> (interrupteur ouvert).
                </p>
              </div>
              <div className="w-full bg-slate-950/80 py-3.5 px-3 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 310 70" className="w-full max-w-[290px] h-auto" overflow="visible">
                  <defs>
                    <marker id="trans-arrow-amber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill="#f59e0b"/>
                    </marker>
                    <marker id="courant-mini" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#818cf8"/>
                    </marker>
                  </defs>

                  {/* LEFT: Source η */}
                  <g>
                    <line x1="15" y1="35" x2="44" y2="35" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="76" y1="35" x2="105" y2="35" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="60" cy="35" r="16" fill="#020617" stroke="#818cf8" strokeWidth="2"/>
                    <line x1="50" y1="35" x2="70" y2="35" stroke="#818cf8" strokeWidth="1.8" markerEnd="url(#courant-mini)" strokeLinecap="round"/>
                    <circle cx="15" cy="35" r="3" fill="#818cf8"/>
                    <text x="15" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">A</text>
                    <circle cx="105" cy="35" r="3" fill="#818cf8"/>
                    <text x="105" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">B</text>
                  </g>

                  {/* MIDDLE: Arrow with η=0 */}
                  <g>
                    <text x="155" y="22" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold" fontFamily="monospace">η = 0</text>
                    <line x1="135" y1="35" x2="175" y2="35" stroke="#f59e0b" strokeWidth="2.2" markerEnd="url(#trans-arrow-amber)" strokeLinecap="round"/>
                  </g>

                  {/* RIGHT: Open Circuit */}
                  <g>
                    <line x1="205" y1="35" x2="236" y2="35" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
                    <line x1="264" y1="35" x2="295" y2="35" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round"/>
                    <circle cx="236" cy="35" r="3.5" fill="#020617" stroke="#f59e0b" strokeWidth="2.2"/>
                    <circle cx="264" cy="35" r="3.5" fill="#020617" stroke="#f59e0b" strokeWidth="2.2"/>
                    <circle cx="205" cy="35" r="3.5" fill="#f59e0b"/>
                    <text x="205" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">A</text>
                    <circle cx="295" cy="35" r="3.5" fill="#f59e0b"/>
                    <text x="295" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">B</text>
                    <text x="250" y="55" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">Circuit ouvert</text>
                  </g>
                </svg>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Les Générateurs Réels */}
        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-emerald-400 flex items-center gap-2 mt-8">
            3. Les Générateurs Réels
          </h3>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Une source réelle d&apos;énergie électrique n&apos;est jamais parfaite : le passage du courant interne dissipe une partie de l&apos;énergie sous forme de chaleur. On la modélise par l&apos;association d&apos;une source idéale et d&apos;une résistance interne <LatexMath math="r" />.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {/* Thévenin Generator */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider">
                    Modèle de Thévenin
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Série (E, r)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Source de tension idéale <LatexMath math="E" /> + résistance interne <LatexMath math="r" /> en <strong>série</strong>.</p>
              </div>

              {/* Thévenin Schematic SVG */}
              <div className="w-full bg-slate-950/80 py-3 px-3 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 280 80" className="w-full max-w-[260px] h-auto" overflow="visible">
                  <defs>
                    <marker id="th-u-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill="#facc15"/>
                    </marker>
                    <marker id="th-i-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#38bdf8"/>
                    </marker>
                  </defs>

                  {/* Dashed boundary of Real Dipole */}
                  <rect x="52" y="24" width="144" height="46" rx="6" fill="none" stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.35"/>
                  <text x="124" y="65" textAnchor="middle" fill="#06b6d4" fontSize="8" fontWeight="600" opacity="0.7">Générateur Réel</text>

                  {/* Tension Arrow u_AB above */}
                  <line x1="30" y1="12" x2="245" y2="12" stroke="#facc15" strokeWidth="1.6" markerEnd="url(#th-u-arrow)" strokeLinecap="round"/>
                  <text x="137" y="8" textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold" fontFamily="monospace">u = E - r·i</text>

                  {/* Main Wires */}
                  <line x1="20" y1="44" x2="68" y2="44" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round"/>
                  <line x1="98" y1="44" x2="130" y2="44" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round"/>
                  <line x1="172" y1="44" x2="255" y2="44" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round"/>

                  {/* Current i arrow on exit wire */}
                  <line x1="210" y1="36" x2="232" y2="36" stroke="#38bdf8" strokeWidth="1.6" markerEnd="url(#th-i-arrow)" strokeLinecap="round"/>
                  <text x="221" y="31" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">i</text>

                  {/* Ideal Voltage Source E */}
                  <circle cx="83" cy="44" r="15" fill="#020617" stroke="#22d3ee" strokeWidth="2"/>
                  <text x="83" y="48.5" textAnchor="middle" fill="#22d3ee" fontSize="12" fontWeight="bold" fontFamily="monospace">E</text>

                  {/* Internal Resistor r (Series) */}
                  <rect x="130" y="36" width="42" height="16" rx="2" fill="#020617" stroke="#22d3ee" strokeWidth="1.8"/>
                  <text x="151" y="47.5" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold" fontFamily="monospace">r</text>

                  {/* Terminals A and B */}
                  <circle cx="20" cy="44" r="3.5" fill="#22d3ee"/>
                  <text x="20" y="33" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">A (+)</text>
                  <circle cx="255" cy="44" r="3.5" fill="#22d3ee"/>
                  <text x="255" y="33" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">B (-)</text>
                </svg>
              </div>

              <div className="p-2.5 rounded-xl bg-black/60 text-center font-mono text-cyan-300 font-bold text-[11px] border border-cyan-500/20">
                <LatexMath math="u(i) = E - r \cdot i" />
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 pl-1 leading-relaxed">
                <li>• <strong>Tension à vide (<LatexMath math="i = 0" />) :</strong> <LatexMath math="u_0 = E" />.</li>
                <li>• <strong>Courant de court-circuit (<LatexMath math="u = 0" />) :</strong> <LatexMath math="I_{cc} = \frac{E}{r}" />.</li>
              </ul>
            </div>

            {/* Norton Generator */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider">
                    Modèle de Norton
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Parallèle (η, r)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Source de courant idéale <LatexMath math="\eta" /> + résistance interne <LatexMath math="r" /> en <strong>parallèle</strong>.</p>
              </div>

              {/* Norton Schematic SVG */}
              <div className="w-full bg-slate-950/80 py-3 px-3 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 280 80" className="w-full max-w-[260px] h-auto" overflow="visible">
                  <defs>
                    <marker id="no-i-gen-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#818cf8"/>
                    </marker>
                    <marker id="no-out-i-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#a5b4fc"/>
                    </marker>
                    <marker id="no-u-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#facc15"/>
                    </marker>
                  </defs>

                  {/* Dashed boundary of Real Dipole */}
                  <rect x="52" y="14" width="138" height="58" rx="6" fill="none" stroke="#818cf8" strokeWidth="1.2" strokeDasharray="3,3" opacity="0.35"/>
                  <text x="121" y="67" textAnchor="middle" fill="#818cf8" fontSize="8" fontWeight="600" opacity="0.7">Générateur Réel</text>

                  {/* Top Rail (A) & Bottom Rail (B) */}
                  <line x1="88" y1="24" x2="245" y2="24" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="88" y1="58" x2="245" y2="58" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/>

                  {/* Current Source Branch (Left) */}
                  <line x1="88" y1="24" x2="88" y2="58" stroke="#818cf8" strokeWidth="2"/>
                  <circle cx="88" cy="41" r="13" fill="#020617" stroke="#818cf8" strokeWidth="1.8"/>
                  {/* Arrow pointing UP */}
                  <line x1="88" y1="48" x2="88" y2="33" stroke="#818cf8" strokeWidth="1.8" markerEnd="url(#no-i-gen-arrow)" strokeLinecap="round"/>
                  <text x="68" y="44" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="bold" fontFamily="monospace">η</text>

                  {/* Parallel Resistor r Branch (Right) */}
                  <line x1="152" y1="24" x2="152" y2="58" stroke="#818cf8" strokeWidth="2"/>
                  <rect x="144" y="32" width="16" height="20" rx="2" fill="#020617" stroke="#818cf8" strokeWidth="1.8"/>
                  <text x="152" y="45.5" textAnchor="middle" fill="#818cf8" fontSize="9" fontWeight="bold" fontFamily="monospace">r</text>

                  {/* Output Current i arrow */}
                  <line x1="200" y1="18" x2="225" y2="18" stroke="#a5b4fc" strokeWidth="1.5" markerEnd="url(#no-out-i-arrow)" strokeLinecap="round"/>
                  <text x="212.5" y="14" textAnchor="middle" fill="#a5b4fc" fontSize="9" fontWeight="bold" fontFamily="monospace">i</text>

                  {/* Voltage Arrow between Bornes A and B */}
                  <line x1="262" y1="58" x2="262" y2="28" stroke="#facc15" strokeWidth="1.5" markerEnd="url(#no-u-arrow)" strokeLinecap="round"/>
                  <text x="272" y="45" textAnchor="middle" fill="#facc15" fontSize="9" fontWeight="bold" fontFamily="monospace">u</text>

                  {/* Terminals A and B */}
                  <circle cx="245" cy="24" r="3.5" fill="#818cf8"/>
                  <text x="245" y="14" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">A</text>
                  <circle cx="245" cy="58" r="3.5" fill="#818cf8"/>
                  <text x="245" y="72" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">B</text>
                </svg>
              </div>

              <div className="p-2.5 rounded-xl bg-black/60 text-center font-mono text-indigo-300 font-bold text-[11px] border border-indigo-500/20">
                <LatexMath math="i(u) = \eta - \frac{u}{r}" />
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 pl-1 leading-relaxed">
                <li>• <strong>Courant de court-circuit (<LatexMath math="u = 0" />) :</strong> <LatexMath math="i = \eta" />.</li>
                <li>• <strong>Tension à vide (<LatexMath math="i = 0" />) :</strong> <LatexMath math="u_0 = r \cdot \eta" />.</li>
              </ul>
            </div>
          </div>

          {/* Thévenin <-> Norton Equivalence Box */}
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 text-[11px] mt-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold uppercase text-emerald-400 flex items-center gap-2 text-xs">
                <RefreshCw className="w-4 h-4" /> Formules d&apos;Équivalence Thévenin ⟺ Norton
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Dualité Tension / Courant
              </span>
            </div>
            
            <p className="text-slate-300 leading-relaxed">
              Les deux modèles sont rigoureusement interchangeables du point de vue des bornes extérieures :
            </p>

            <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 text-center text-emerald-300 font-mono font-bold text-xs">
              <LatexMath math="E_{th} = r \cdot \eta \quad \iff \quad \eta = \frac{E_{th}}{r} \quad \text{avec} \quad r_{th} = r_N = r" />
            </div>

            {/* Démonstration Pas-à-Pas */}
            <CollapsibleProof
              title="Démonstration : Preuve de l'équivalence Thévenin ⟺ Norton"
              subtitle="Par identification des caractéristiques linéaires courant-tension"
              color="emerald"
              badge="Démonstration Mathématique"
            >
              <div className="space-y-3 text-slate-300 font-sans text-[11px]">
                <p className="leading-relaxed">
                  Pour que les deux dipôles soient rigoureusement équivalents, ils doivent posséder exactement la même caractéristique linéaire <LatexMath math="u(i)" /> entre leurs bornes :
                </p>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-cyan-400 font-bold">1. Équation de Thévenin (Loi des mailles) :</span>
                    <div className="text-center font-mono text-cyan-300 text-[11px]">
                      <LatexMath math="u = E_{th} - r_{th} \cdot i" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold">2. Expression de l&apos;intensité <LatexMath math="i" /> en fonction de <LatexMath math="u" /> :</span>
                    <div className="text-center font-mono text-emerald-300 text-[11px]">
                      <LatexMath math="r_{th} \cdot i = E_{th} - u \implies i = \frac{E_{th}}{r_{th}} - \frac{u}{r_{th}}" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800 space-y-1">
                    <span className="text-indigo-400 font-bold">3. Comparaison avec la loi de Norton (Loi des nœuds) :</span>
                    <div className="text-center font-mono text-indigo-300 text-[11px]">
                      <LatexMath math="i = \eta_N - \frac{u}{r_N}" />
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-slate-200">
                  <p className="font-bold text-emerald-400 mb-1">Conclusion par identification terme à terme :</p>
                  <ul className="space-y-1 pl-2 text-[10px] font-mono">
                    <li>• Terme constant (courant de court-circuit) : <LatexMath math="\eta_N = \frac{E_{th}}{r_{th}} \iff E_{th} = r \cdot \eta_N" /></li>
                    <li>• Pente (conductance interne) : <LatexMath math="\frac{1}{r_N} = \frac{1}{r_{th}} \iff r_N = r_{th} = r" /></li>
                  </ul>
                </div>
              </div>
            </CollapsibleProof>
          </div>

          {/* Interactive Simulator: Sources & Extinction Lab */}
          <SourcesLabSimulator />
        </div>
      </section>

      {/* ── PARTIE 3: OUTILS FONDAMENTAUX DE RÉDUCTION ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-extrabold mb-1">
          <Sliders className="w-3.5 h-3.5" />
          <span>Partie 3 • Outils Fondamentaux</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          3. Outils Fondamentaux de Réduction des Circuits
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          La maîtrise des lois de réduction (associations série et parallèle de résistances) et des règles de division (pont diviseur de tension et de courant) constitue le socle indispensable pour simplifier et résoudre rapidement n&apos;importe quelle branche d&apos;un réseau sans calcul matriciel lourd.
        </p>

        <div className="space-y-5">
          {/* 1. Association des Résistances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Association Série */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">Association en Série</span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">Même courant <LatexMath math="i" /></span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Deux dipôles sont en série lorsqu&apos;ils sont traversés successivement par le <strong>même courant électrique</strong>. La tension globale est la somme des tensions individuelles.
                </p>
              </div>

              {/* SVG Série Agrandie et Détaillée */}
              <div className="w-full bg-slate-950/90 py-3.5 px-4 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 280 80" className="w-full max-w-[270px] h-auto" overflow="visible">
                  <defs>
                    <marker id="ser-i-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#f43f5e"/>
                    </marker>
                    <marker id="ser-u-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#22d3ee"/>
                    </marker>
                    <marker id="ser-utot-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill="#facc15"/>
                    </marker>
                  </defs>

                  {/* Wire & Resistors */}
                  <line x1="20" y1="36" x2="65" y2="36" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round"/>
                  
                  {/* Current Arrow i (Red) */}
                  <line x1="25" y1="36" x2="48" y2="36" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#ser-i-arr)"/>
                  <text x="36" y="27" textAnchor="middle" fill="#f43f5e" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">i</text>

                  {/* R1 Slender Box */}
                  <rect x="65" y="26" width="44" height="20" rx="2.5" fill="#020617" stroke="#22d3ee" strokeWidth="1.8"/>
                  <text x="87" y="40" textAnchor="middle" fill="#22d3ee" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    R<tspan fontSize="8" dy="2">1</tspan>
                  </text>

                  <line x1="109" y1="36" x2="148" y2="36" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round"/>

                  {/* R2 Slender Box */}
                  <rect x="148" y="26" width="44" height="20" rx="2.5" fill="#020617" stroke="#22d3ee" strokeWidth="1.8"/>
                  <text x="170" y="40" textAnchor="middle" fill="#22d3ee" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    R<tspan fontSize="8" dy="2">2</tspan>
                  </text>

                  <line x1="192" y1="36" x2="260" y2="36" stroke="#22d3ee" strokeWidth="2.2" strokeLinecap="round"/>

                  {/* Nodes A and B */}
                  <circle cx="20" cy="36" r="3.5" fill="#22d3ee"/>
                  <text x="20" y="20" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="serif">A</text>
                  <circle cx="260" cy="36" r="3.5" fill="#22d3ee"/>
                  <text x="260" y="20" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="serif">B</text>

                  {/* Partial Voltage Arrows */}
                  <line x1="65" y1="13" x2="109" y2="13" stroke="#22d3ee" strokeWidth="1.4" markerEnd="url(#ser-u-arr)"/>
                  <text x="87" y="8" textAnchor="middle" fill="#22d3ee" fontSize="10" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    u<tspan fontSize="7.5" dy="1.5">1</tspan>
                  </text>

                  <line x1="148" y1="13" x2="192" y2="13" stroke="#22d3ee" strokeWidth="1.4" markerEnd="url(#ser-u-arr)"/>
                  <text x="170" y="8" textAnchor="middle" fill="#22d3ee" fontSize="10" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    u<tspan fontSize="7.5" dy="1.5">2</tspan>
                  </text>

                  {/* Total Voltage u_AB Arrow */}
                  <line x1="20" y1="65" x2="260" y2="65" stroke="#facc15" strokeWidth="1.6" markerEnd="url(#ser-utot-arr)"/>
                  <text x="140" y="59" textAnchor="middle" fill="#facc15" fontSize="10.5" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    u<tspan fontSize="8" dy="1.5">AB</tspan>
                    <tspan fontStyle="normal" fontSize="10"> = </tspan>
                    u<tspan fontSize="8" dy="1.5">1</tspan>
                    <tspan fontStyle="normal" fontSize="10"> + </tspan>
                    u<tspan fontSize="8" dy="1.5">2</tspan>
                  </text>
                </svg>
              </div>

              {/* Main Formula */}
              <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-cyan-300 font-bold text-xs border border-cyan-500/30">
                <LatexMath math="R_{eq} = \sum_{k=1}^{n} R_k = R_1 + R_2 + \dots + R_n" />
              </div>

              {/* Step-by-Step Proof */}
              <CollapsibleProof
                title="Démonstration : Preuve de la formule en série"
                subtitle="Par additivité des tensions et factorisation de l'intensité commune"
                color="cyan"
                badge="Démonstration"
              >
                <div className="space-y-2.5 text-slate-300 font-sans text-[11px]">
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-cyan-400 font-bold">1. Loi des mailles (Additivité des tensions) :</span>
                    <div className="text-center font-mono text-cyan-300 pt-1">
                      <LatexMath math="u_{AB} = u_1 + u_2" />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-cyan-400 font-bold">2. Application de la loi d&apos;Ohm à chaque conducteur :</span>
                    <div className="text-center font-mono text-cyan-300 pt-1">
                      <LatexMath math="u_1 = R_1 \cdot i \quad \text{et} \quad u_2 = R_2 \cdot i" />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-cyan-400 font-bold">3. Factorisation par le courant commun <LatexMath math="i" /> :</span>
                    <div className="text-center font-mono text-cyan-300 pt-1">
                      <LatexMath math="u_{AB} = R_1 \cdot i + R_2 \cdot i = (R_1 + R_2) \cdot i" />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-200">
                    <span className="font-bold text-cyan-400">4. Identification avec le dipôle équivalent <LatexMath math="u_{AB} = R_{eq} \cdot i" /> :</span>
                    <div className="text-center font-mono font-bold text-cyan-300 pt-1">
                      <LatexMath math="R_{eq} = R_1 + R_2 \quad \implies \quad R_{eq} = \sum_{k=1}^n R_k" />
                    </div>
                  </div>
                </div>
              </CollapsibleProof>
            </div>

            {/* Association Parallèle */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-4 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">Association en Parallèle</span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold">Même tension <LatexMath math="u" /></span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Deux dipôles sont en parallèle lorsqu&apos;ils sont connectés aux deux <strong>mêmes nœuds</strong> (même tension à leurs bornes). Les intensités s&apos;additionnent.
                </p>
              </div>

              {/* SVG Parallèle Refait Proprement & Symétrique */}
              <div className="w-full bg-slate-950/90 py-3.5 px-4 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 280 90" className="w-full max-w-[270px] h-auto" overflow="visible">
                  <defs>
                    <marker id="par-i-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#f43f5e"/>
                    </marker>
                    <marker id="par-ibr-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#fb7185"/>
                    </marker>
                    <marker id="par-u-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#facc15"/>
                    </marker>
                  </defs>

                  {/* Left Voltage Arrow u_AB (Spanning exactly between A and B level) */}
                  <line x1="18" y1="67" x2="18" y2="23" stroke="#facc15" strokeWidth="1.6" markerEnd="url(#par-u-arr)"/>
                  <text x="8" y="49" textAnchor="middle" fill="#facc15" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    u<tspan fontSize="8" dy="1.5">AB</tspan>
                  </text>

                  {/* Upper Rail (A) - Exactly x=35 to x=245 */}
                  <line x1="35" y1="20" x2="245" y2="20" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round"/>
                  {/* Lower Rail (B) - Exactly x=35 to x=245 */}
                  <line x1="35" y1="70" x2="245" y2="70" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round"/>

                  {/* Node A */}
                  <circle cx="35" cy="20" r="3.5" fill="#818cf8"/>
                  <text x="35" y="9" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="serif">A</text>

                  {/* Node B */}
                  <circle cx="35" cy="70" r="3.5" fill="#818cf8"/>
                  <text x="35" y="84" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="serif">B</text>

                  {/* Current Arrow i on Upper Rail */}
                  <line x1="45" y1="20" x2="75" y2="20" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#par-i-arr)"/>
                  <text x="60" y="11" textAnchor="middle" fill="#f43f5e" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">i</text>

                  {/* Branch 1 (R1) */}
                  <line x1="115" y1="20" x2="115" y2="70" stroke="#818cf8" strokeWidth="1.8"/>
                  <circle cx="115" cy="20" r="2.5" fill="#818cf8"/>
                  <circle cx="115" cy="70" r="2.5" fill="#818cf8"/>
                  {/* Arrow i1 */}
                  <line x1="115" y1="20" x2="115" y2="29" stroke="#fb7185" strokeWidth="1.8" markerEnd="url(#par-ibr-arr)"/>
                  <text x="127" y="28" textAnchor="middle" fill="#fb7185" fontSize="10" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    i<tspan fontSize="7.5" dy="1.5">1</tspan>
                  </text>
                  {/* Slender R1 box */}
                  <rect x="106" y="34" width="18" height="22" rx="2" fill="#020617" stroke="#818cf8" strokeWidth="1.8"/>
                  <text x="115" y="48.5" textAnchor="middle" fill="#818cf8" fontSize="10.5" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    R<tspan fontSize="7.5" dy="1.5">1</tspan>
                  </text>

                  {/* Branch 2 (R2) */}
                  <line x1="185" y1="20" x2="185" y2="70" stroke="#818cf8" strokeWidth="1.8"/>
                  <circle cx="185" cy="20" r="2.5" fill="#818cf8"/>
                  <circle cx="185" cy="70" r="2.5" fill="#818cf8"/>
                  {/* Arrow i2 */}
                  <line x1="185" y1="20" x2="185" y2="29" stroke="#fb7185" strokeWidth="1.8" markerEnd="url(#par-ibr-arr)"/>
                  <text x="197" y="28" textAnchor="middle" fill="#fb7185" fontSize="10" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    i<tspan fontSize="7.5" dy="1.5">2</tspan>
                  </text>
                  {/* Slender R2 box */}
                  <rect x="176" y="34" width="18" height="22" rx="2" fill="#020617" stroke="#818cf8" strokeWidth="1.8"/>
                  <text x="185" y="48.5" textAnchor="middle" fill="#818cf8" fontSize="10.5" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    R<tspan fontSize="7.5" dy="1.5">2</tspan>
                  </text>
                </svg>
              </div>

              {/* Main Formula */}
              <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-indigo-300 font-bold text-xs border border-indigo-500/30">
                <LatexMath math="G_{eq} = \sum G_k \iff \frac{1}{R_{eq}} = \frac{1}{R_1} + \frac{1}{R_2} \implies R_{eq} = \frac{R_1 R_2}{R_1 + R_2}" />
              </div>

              {/* Step-by-Step Proof */}
              <CollapsibleProof
                title="Démonstration : Preuve de la formule en parallèle"
                subtitle="Par additivité des intensités (loi des nœuds) et passage aux conductances"
                color="indigo"
                badge="Démonstration"
              >
                <div className="space-y-2.5 text-slate-300 font-sans text-[11px]">
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-indigo-400 font-bold">1. Loi des nœuds au point A (Somme des courants) :</span>
                    <div className="text-center font-mono text-indigo-300 pt-1">
                      <LatexMath math="i = i_1 + i_2" />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-indigo-400 font-bold">2. Expression de <LatexMath math="i_1" /> et <LatexMath math="i_2" /> (Même tension <LatexMath math="u_{AB}" />) :</span>
                    <div className="text-center font-mono text-indigo-300 pt-1">
                      <LatexMath math="i_1 = \frac{u_{AB}}{R_1} = G_1 \cdot u_{AB} \quad \text{et} \quad i_2 = \frac{u_{AB}}{R_2} = G_2 \cdot u_{AB}" />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-indigo-400 font-bold">3. Factorisation par la tension commune <LatexMath math="u_{AB}" /> :</span>
                    <div className="text-center font-mono text-indigo-300 pt-1">
                      <LatexMath math="i = u_{AB} \left(\frac{1}{R_1} + \frac{1}{R_2}\right) = (G_1 + G_2) \cdot u_{AB}" />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
                    <span className="font-bold text-indigo-400">4. Formule explicite pour 2 résistances (Mise au même dénominateur) :</span>
                    <div className="text-center font-mono font-bold text-indigo-300 pt-1">
                      <LatexMath math="\frac{1}{R_{eq}} = \frac{R_1 + R_2}{R_1 \cdot R_2} \iff R_{eq} = \frac{R_1 \cdot R_2}{R_1 + R_2} = \frac{\text{Produit}}{\text{Somme}}" />
                    </div>
                  </div>
                </div>
              </CollapsibleProof>
            </div>
          </div>

          {/* 2. Pont Diviseur de Tension (PDT) & Pont Diviseur de Courant (PDC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Pont Diviseur de Tension (PDT) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                    1°) Pont Diviseur de Tension (PDT)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    Branche Série
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                  <p>
                    📌 <strong>Énoncé :</strong> On applique une différence de potentiel <LatexMath math="U" /> aux bornes d&apos;un circuit constitué de deux résistances <LatexMath math="R_1" /> et <LatexMath math="R_2" /> associées en série.
                  </p>
                  <p className="text-emerald-300 font-medium">
                    🎯 <strong>Objectif :</strong> Exprimer en fonction de <LatexMath math="U" />, de <LatexMath math="R_1" /> et de <LatexMath math="R_2" /> la tension <LatexMath math="U_2" /> existant aux bornes de <LatexMath math="R_2" />.
                  </p>
                </div>
              </div>

              {/* SVG PDT Style Tableau (Vertical avec point C) */}
              <div className="w-full bg-slate-950/90 py-3.5 px-4 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 240 145" className="w-full max-w-[220px] h-auto" overflow="visible">
                  <defs>
                    <marker id="pdt-u-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#facc15"/>
                    </marker>
                    <marker id="pdt-u2-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#34d399"/>
                    </marker>
                    <marker id="pdt-i-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#f43f5e"/>
                    </marker>
                  </defs>

                  {/* Left Voltage Arrow U (From B level up to A level) */}
                  <line x1="30" y1="125" x2="30" y2="20" stroke="#facc15" strokeWidth="1.6" markerEnd="url(#pdt-u-arrow)"/>
                  <text x="18" y="75" textAnchor="middle" fill="#facc15" fontSize="12" fontStyle="italic" fontWeight="bold" fontFamily="serif">U</text>

                  {/* Top terminal A and entry wire */}
                  <circle cx="55" cy="18" r="3" fill="#10b981"/>
                  <text x="45" y="21" textAnchor="end" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="serif">A</text>
                  <line x1="55" y1="18" x2="105" y2="18" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                  
                  {/* Current Arrow I (Red) */}
                  <line x1="62" y1="18" x2="88" y2="18" stroke="#f43f5e" strokeWidth="1.8" markerEnd="url(#pdt-i-arrow)"/>
                  <text x="75" y="10" textAnchor="middle" fill="#f43f5e" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">I</text>

                  {/* Vertical Wire down to R1 */}
                  <line x1="105" y1="18" x2="105" y2="28" stroke="#10b981" strokeWidth="2"/>

                  {/* Resistor R1 */}
                  <rect x="96" y="28" width="18" height="26" rx="2" fill="#020617" stroke="#10b981" strokeWidth="1.8"/>
                  <text x="124" y="44" fill="#34d399" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    R<tspan fontSize="8" dy="2">1</tspan>
                  </text>

                  {/* Wire between R1 and R2 + Midpoint C */}
                  <line x1="105" y1="54" x2="105" y2="76" stroke="#10b981" strokeWidth="2"/>
                  <circle cx="105" cy="65" r="2.5" fill="#10b981"/>
                  <text x="94" y="68" textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="bold" fontFamily="serif">C</text>

                  {/* Resistor R2 */}
                  <rect x="96" y="76" width="18" height="26" rx="2" fill="#020617" stroke="#10b981" strokeWidth="1.8"/>
                  <text x="124" y="92" fill="#34d399" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    R<tspan fontSize="8" dy="2">2</tspan>
                  </text>

                  {/* Bottom Wire and Terminal B */}
                  <line x1="105" y1="102" x2="105" y2="125" stroke="#10b981" strokeWidth="2"/>
                  <line x1="105" y1="125" x2="55" y2="125" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="55" cy="125" r="3" fill="#10b981"/>
                  <text x="45" y="128" textAnchor="end" fill="#94a3b8" fontSize="11" fontWeight="bold" fontFamily="serif">B</text>

                  {/* Right Voltage Arrow U2 (across R2, between C and B) */}
                  <line x1="110" y1="65" x2="160" y2="65" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3"/>
                  <line x1="110" y1="125" x2="160" y2="125" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3"/>
                  <line x1="155" y1="123" x2="155" y2="69" stroke="#34d399" strokeWidth="1.6" markerEnd="url(#pdt-u2-arrow)"/>
                  <text x="170" y="98" fill="#34d399" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    U<tspan fontSize="8" dy="2">2</tspan>
                  </text>
                </svg>
              </div>

              {/* Main Formula */}
              <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-emerald-300 font-bold text-xs border border-emerald-500/20">
                <LatexMath math="U_2 = \frac{R_2}{R_1 + R_2} \cdot U = \frac{R_2}{R_{eq}} \cdot U" />
              </div>

              {/* Démonstration PDT Détaillée */}
              <CollapsibleProof
                title="Démonstration : Preuve du Diviseur de Tension"
                subtitle="Par égalité de l'intensité commune traversant la branche"
                color="emerald"
                badge="Démonstration"
              >
                <div className="space-y-2.5 text-slate-300 font-sans text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-emerald-400 font-bold">1. Tension globale aux bornes du dipôle équivalent :</span>
                    <div className="text-center font-mono text-emerald-300 pt-1">
                      <LatexMath math="U = R_{eq} \cdot I \quad \text{avec} \quad R_{eq} = R_1 + R_2 \implies I = \frac{U}{R_{eq}}" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-emerald-400 font-bold">2. Loi d&apos;Ohm aux bornes de la résistance <LatexMath math="R_2" /> :</span>
                    <div className="text-center font-mono text-emerald-300 pt-1">
                      <LatexMath math="U_2 = R_2 \cdot I \implies I = \frac{U_2}{R_2}" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-200">
                    <span className="font-bold text-emerald-400">3. Égalité des deux expressions de l&apos;intensité <LatexMath math="I" /> :</span>
                    <div className="text-center font-mono font-bold text-emerald-300 pt-1">
                      <LatexMath math="\frac{U}{R_{eq}} = \frac{U_2}{R_2} \implies U_2 = \frac{R_2}{R_{eq}} \cdot U = \frac{R_2}{R_1 + R_2} \cdot U" />
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[10.5px]">
                    <span className="text-amber-300 font-bold">💡 Conclusion physique :</span>
                    <div className="text-center font-mono text-slate-300 pt-1">
                      <LatexMath math="\frac{U_2}{U} = \frac{R_2}{R_{eq}}" /> <span className="ml-2 text-slate-400 font-sans">(D&apos;où le nom de <em>diviseur de tension</em>)</span>
                    </div>
                  </div>
                </div>
              </CollapsibleProof>
            </div>

            {/* Pont Diviseur de Courant (PDC) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
                    2°) Pont Diviseur de Courant (PDC)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
                    Branche Parallèle
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                  <p>
                    📌 <strong>Énoncé :</strong> On applique une d.d.p <LatexMath math="U" /> aux bornes d&apos;un circuit constitué de deux résistances <LatexMath math="R_1" /> et <LatexMath math="R_2" /> associées en parallèle.
                  </p>
                  <p className="text-indigo-300 font-medium">
                    🎯 <strong>Objectif :</strong> Exprimer en fonction de <LatexMath math="I" />, de <LatexMath math="G_1, G_2" /> (ou <LatexMath math="R_1, R_2" />) l&apos;intensité du courant <LatexMath math="I_2" /> (ou <LatexMath math="I_1" />).
                  </p>
                </div>
              </div>

              {/* SVG PDC Style Tableau */}
              <div className="w-full bg-slate-950/90 py-3.5 px-4 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 250 115" className="w-full max-w-[240px] h-auto" overflow="visible">
                  <defs>
                    <marker id="pdc-u-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#facc15"/>
                    </marker>
                    <marker id="pdc-i-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#f43f5e"/>
                    </marker>
                    <marker id="pdc-i1-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#fb7185"/>
                    </marker>
                  </defs>

                  {/* Left Voltage Arrow U between B and A */}
                  <line x1="22" y1="88" x2="22" y2="28" stroke="#facc15" strokeWidth="1.6" markerEnd="url(#pdc-u-arrow)"/>
                  <text x="12" y="60" textAnchor="middle" fill="#facc15" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">U</text>

                  {/* Terminal A on top wire */}
                  <circle cx="38" cy="25" r="3" fill="#818cf8"/>
                  <text x="30" y="28" textAnchor="end" fill="#94a3b8" fontSize="10.5" fontWeight="bold" fontFamily="serif">A</text>

                  {/* Top Wire into Node A */}
                  <line x1="38" y1="25" x2="105" y2="25" stroke="#818cf8" strokeWidth="2"/>
                  <line x1="45" y1="25" x2="75" y2="25" stroke="#f43f5e" strokeWidth="1.8" markerEnd="url(#pdc-i-arrow)"/>
                  <text x="60" y="15" textAnchor="middle" fill="#f43f5e" fontSize="11" fontStyle="italic" fontWeight="bold" fontFamily="serif">I</text>

                  {/* Node A */}
                  <circle cx="105" cy="25" r="2.5" fill="#818cf8"/>
                  <text x="105" y="14" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontWeight="bold" fontFamily="serif">A</text>

                  {/* Branch 1 (R1) */}
                  <line x1="105" y1="25" x2="105" y2="90" stroke="#818cf8" strokeWidth="1.8"/>
                  <line x1="105" y1="25" x2="105" y2="35" stroke="#fb7185" strokeWidth="1.8" markerEnd="url(#pdc-i1-arrow)"/>
                  <text x="96" y="38" textAnchor="end" fill="#fb7185" fontSize="10" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    I<tspan fontSize="7.5" dy="1.5">1</tspan>
                  </text>
                  <rect x="96" y="42" width="18" height="24" rx="2" fill="#020617" stroke="#818cf8" strokeWidth="1.8"/>
                  <text x="122" y="56" fill="#818cf8" fontSize="10.5" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    R<tspan fontSize="7.5" dy="1.5">1</tspan>
                  </text>

                  {/* Branch 2 (R2) */}
                  <line x1="105" y1="25" x2="185" y2="25" stroke="#818cf8" strokeWidth="2"/>
                  <line x1="118" y1="25" x2="155" y2="25" stroke="#fb7185" strokeWidth="1.8" markerEnd="url(#pdc-i-arrow)"/>
                  <text x="140" y="15" textAnchor="middle" fill="#fb7185" fontSize="10" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    I<tspan fontSize="7.5" dy="1.5">2</tspan>
                  </text>

                  <line x1="185" y1="25" x2="185" y2="90" stroke="#818cf8" strokeWidth="1.8"/>
                  <rect x="176" y="42" width="18" height="24" rx="2" fill="#020617" stroke="#818cf8" strokeWidth="1.8"/>
                  <text x="202" y="56" fill="#818cf8" fontSize="10.5" fontStyle="italic" fontWeight="bold" fontFamily="serif">
                    R<tspan fontSize="7.5" dy="1.5">2</tspan>
                  </text>

                  {/* Bottom Wire and Node B */}
                  <line x1="38" y1="90" x2="185" y2="90" stroke="#818cf8" strokeWidth="2"/>
                  <circle cx="38" cy="90" r="3" fill="#818cf8"/>
                  <text x="30" y="93" textAnchor="end" fill="#94a3b8" fontSize="10.5" fontWeight="bold" fontFamily="serif">B</text>
                  <circle cx="105" cy="90" r="2.5" fill="#818cf8"/>
                  <text x="105" y="103" textAnchor="middle" fill="#94a3b8" fontSize="10.5" fontWeight="bold" fontFamily="serif">B</text>
                </svg>
              </div>

              {/* Main Formula */}
              <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-indigo-300 font-bold text-xs border border-indigo-500/30">
                <LatexMath math="I_2 = \frac{G_2}{G_1 + G_2} \cdot I = \frac{R_1}{R_1 + R_2} \cdot I" />
              </div>

              {/* Démonstration PDC Détaillée */}
              <CollapsibleProof
                title="Démonstration : Preuve du Diviseur de Courant"
                subtitle="Par égalité de la tension commune aux bornes des branches"
                color="indigo"
                badge="Démonstration"
              >
                <div className="space-y-2.5 text-slate-300 font-sans text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-indigo-400 font-bold">1. Conductances et résistance équivalente :</span>
                    <div className="text-center font-mono text-indigo-300 pt-1">
                      <LatexMath math="\frac{1}{R_{eq}} = \frac{1}{R_1} + \frac{1}{R_2} \iff G_{eq} = G_1 + G_2" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-indigo-400 font-bold">2. Tension commune aux bornes du circuit :</span>
                    <div className="text-center font-mono text-indigo-300 pt-1">
                      <LatexMath math="U = R_{eq} \cdot I \quad \text{et} \quad U = R_2 \cdot I_2" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-indigo-400 font-bold">3. Égalité des tensions :</span>
                    <div className="text-center font-mono text-indigo-300 pt-1">
                      <LatexMath math="R_{eq} \cdot I = R_2 \cdot I_2 \implies I_2 = \frac{R_{eq}}{R_2} \cdot I" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
                    <span className="font-bold text-indigo-400">4. Forme avec les Conductances <LatexMath math="G = \frac{1}{R}" /> :</span>
                    <div className="text-center font-mono font-bold text-indigo-300 pt-1">
                      <LatexMath math="I_2 = \frac{\frac{1}{R_2}}{\frac{1}{R_{eq}}} \cdot I = \frac{G_2}{G_{eq}} \cdot I = \frac{G_2}{G_1 + G_2} \cdot I" />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
                    <span className="font-bold text-indigo-400">5. Forme avec les Résistances (Attention à la résistance opposée !) :</span>
                    <div className="text-center font-mono font-bold text-indigo-300 pt-1">
                      <LatexMath math="I_2 = \frac{R_1}{R_1 + R_2} \cdot I \quad \text{et} \quad I_1 = \frac{R_2}{R_1 + R_2} \cdot I" />
                    </div>
                  </div>
                </div>
              </CollapsibleProof>
            </div>

          </div>
        </div>
      </section>

      {/* ── PARTIE 4: LES GRANDS THÉORÈMES DES RÉSEAUX LINÉAIRES ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-extrabold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 4 • Théorèmes des Réseaux</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          4. Les Grands Théorèmes des Réseaux Linéaires
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Les théorèmes de Superposition, Thévenin, Norton et Millman constituent les méthodes les plus puissantes pour modéliser, simplifier et calculer analytiquement les grandeurs électriques dans n&apos;importe quel réseau linéaire complexe.
        </p>

        {/* Five Methods Interactive Simulator & Step-by-Step Solver */}
        <FiveMethodsCircuitLab />
      </section>

      {/* ── PARTIE 5: TRANSFERT MAXIMAL DE PUISSANCE & ADAPTATION ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-extrabold mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Partie 5 • Optimisation Énergétique</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          5. Transfert Maximal de Puissance & Adaptation d&apos;Impédance
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Lorsqu&apos;un générateur réel de Thévenin <LatexMath math="(E_{th}, R_{th})" /> alimente une résistance de charge variable <LatexMath math="R_c" />, quelle valeur de <LatexMath math="R_c" /> permet de lui transférer le maximum d&apos;énergie utile ?
        </p>

        {/* Visual Schematics: Circuit + Power Curve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Circuit SVG: Source Thévenin + Charge Rc */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 flex flex-col items-center justify-center space-y-2 shadow-inner">
            <span className="text-[10.5px] font-mono text-rose-300 font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              Circuit d&apos;Étude : Générateur de Thévenin et Charge Variable <LatexMath math="R_c" />
            </span>
            <svg viewBox="0 0 280 150" className="w-full max-w-[270px] h-auto text-xs">
              {/* Loop wires */}
              <path d="M 40 120 L 40 35 L 230 35 L 230 120 L 40 120" fill="none" stroke="#38bdf8" strokeWidth="2" />
              
              {/* Source Eth (Left) */}
              <rect x="30" y="76" width="20" height="8" fill="#020617" />
              <line x1="30" y1="75" x2="50" y2="75" stroke="#facc15" strokeWidth="2.5" />
              <line x1="34" y1="85" x2="46" y2="85" stroke="#facc15" strokeWidth="3.5" />
              <text x="22" y="83" fill="#facc15" fontSize="10" fontStyle="italic" fontWeight="bold" textAnchor="end">E<tspan fontSize="7" dy="2.5">th</tspan></text>

              {/* Internal Resistor Rth */}
              <rect x="75" y="29" width="36" height="12" fill="#020617" stroke="#38bdf8" strokeWidth="1.5" rx="2" />
              <text x="93" y="24" fill="#38bdf8" fontSize="9.5" fontStyle="italic" fontWeight="bold" textAnchor="middle">R<tspan fontSize="7" dy="2.5">th</tspan></text>

              {/* Current I Arrow */}
              <path d="M 140 35 L 155 35 M 150 32 L 156 35 L 150 38" fill="#f43f5e" stroke="#f43f5e" strokeWidth="1.4" />
              <text x="148" y="24" fill="#f43f5e" fontSize="9.5" fontStyle="italic" fontWeight="bold">i(R<tspan fontSize="6.5" dy="2">c</tspan>)</text>

              {/* Terminals A and B */}
              <circle cx="190" cy="35" r="3" fill="#f43f5e" />
              <text x="190" y="22" fill="#f8fafc" fontSize="10" fontStyle="italic" fontWeight="bold" textAnchor="middle">A</text>
              <circle cx="190" cy="120" r="3" fill="#64748b" />
              <text x="190" y="135" fill="#f8fafc" fontSize="10" fontStyle="italic" fontWeight="bold" textAnchor="middle">B</text>

              {/* Variable Load Resistor Rc (Right) */}
              <rect x="224" y="60" width="12" height="34" fill="#020617" stroke="#fb7185" strokeWidth="1.8" rx="2" />
              {/* Variable resistor diagonal arrow */}
              <line x1="216" y1="98" x2="244" y2="56" stroke="#fb7185" strokeWidth="1.5" />
              <polygon points="244,56 245,63 238,58" fill="#fb7185" />
              <text x="256" y="80" fill="#fb7185" fontSize="10.5" fontStyle="italic" fontWeight="bold">R<tspan fontSize="7.5" dy="2.5">c</tspan></text>

              {/* Voltage arrow Uc across Rc */}
              <line x1="205" y1="110" x2="205" y2="45" stroke="#22c55e" strokeWidth="1.3" strokeDasharray="3,2" />
              <polygon points="202,50 208,50 205,42" fill="#22c55e" />
              <text x="195" y="80" fill="#22c55e" fontSize="9.5" fontStyle="italic" fontWeight="bold" textAnchor="end">U<tspan fontSize="7" dy="2.5">c</tspan></text>

              {/* Thévenin dipôle box boundary */}
              <rect x="15" y="18" width="155" height="114" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeDasharray="4,3" rx="8" />
              <text x="25" y="126" fill="rgba(56, 189, 248, 0.6)" fontSize="8.5" fontStyle="italic">Générateur Réel</text>
            </svg>
            <p className="text-[10px] text-slate-400 text-center font-mono">
              <LatexMath math="i = \frac{E_{th}}{R_{th} + R_c} \quad \implies \quad P = R_c \cdot i^2" />
            </p>
          </div>

          {/* Power Curve Graph P(Rc) */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-rose-500/30 flex flex-col items-center justify-center space-y-2 shadow-inner">
            <span className="text-[10.5px] font-mono text-rose-300 font-bold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              Courbe de Puissance Transférée <LatexMath math="P(R_c)" />
            </span>
            <svg viewBox="0 0 280 150" className="w-full max-w-[270px] h-auto text-xs">
              {/* Axes */}
              <line x1="35" y1="125" x2="260" y2="125" stroke="#64748b" strokeWidth="1.5" />
              <polygon points="260,125 254,122 254,128" fill="#64748b" />
              <text x="260" y="138" fill="#94a3b8" fontSize="9.5" fontStyle="italic" textAnchor="end">R<tspan fontSize="7" dy="2">c</tspan></text>

              <line x1="35" y1="125" x2="35" y2="15" stroke="#64748b" strokeWidth="1.5" />
              <polygon points="35,15 32,21 38,21" fill="#64748b" />
              <text x="28" y="20" fill="#94a3b8" fontSize="9.5" fontStyle="italic" textAnchor="end">P(R<tspan fontSize="7" dy="2">c</tspan>)</text>

              {/* Grid dashed lines */}
              <line x1="130" y1="125" x2="130" y2="40" stroke="rgba(244, 63, 94, 0.4)" strokeDasharray="3,3" strokeWidth="1.2" />
              <line x1="35" y1="40" x2="130" y2="40" stroke="rgba(244, 63, 94, 0.4)" strokeDasharray="3,3" strokeWidth="1.2" />

              {/* Power Bell Curve */}
              <path d="M 35 125 C 60 120, 90 40, 130 40 C 170 40, 210 95, 255 110" fill="none" stroke="#f43f5e" strokeWidth="2.5" />

              {/* Peak Point: Maximum Power */}
              <circle cx="130" cy="40" r="5" fill="#f43f5e" className="animate-pulse" />
              <circle cx="130" cy="40" r="2.5" fill="#ffffff" />
              
              {/* Max labels */}
              <text x="130" y="138" fill="#fb7185" fontSize="9.5" fontStyle="italic" fontWeight="bold" textAnchor="middle">R<tspan fontSize="7" dy="2">c</tspan> = R<tspan fontSize="7" dy="2">th</tspan></text>
              <text x="28" y="44" fill="#fb7185" fontSize="9.5" fontStyle="italic" fontWeight="bold" textAnchor="end">P<tspan fontSize="7" dy="2">max</tspan></text>

              {/* Annotation */}
              <rect x="145" y="25" width="95" height="24" fill="#020617" stroke="#f43f5e" strokeWidth="1" rx="4" />
              <text x="192" y="36" fill="#fb7185" fontSize="8" fontStyle="italic" fontWeight="bold" textAnchor="middle">P<tspan fontSize="6" dy="1.5">max</tspan> = E<tspan fontSize="6" dy="1.5">th</tspan>² / (4R<tspan fontSize="6" dy="1.5">th</tspan>)</text>
              <text x="192" y="45" fill="#94a3b8" fontSize="7" textAnchor="middle">(Adaptation d&apos;impédance)</text>
            </svg>
            <p className="text-[10px] text-rose-300 text-center font-mono">
              <LatexMath math="R_c = R_{th} \implies P_{\max} = \frac{E_{th}^2}{4 R_{th}} \quad (\eta = 50\%)" />
            </p>
          </div>
        </div>

        {/* Proof Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-3 shadow-lg">
          <h4 className="text-[11px] font-extrabold uppercase text-rose-400 tracking-wider flex items-center gap-2">
            <Flame className="w-4 h-4" /> Démonstration Mathématique de l&apos;Adaptation
          </h4>

          <div className="space-y-2 text-[11px] text-slate-300 font-mono">
            <p className="font-sans text-slate-200">
              <strong>1. Courant circulant dans la charge :</strong> <LatexMath math="i(R_c) = \frac{E_{th}}{R_{th} + R_c}" />
            </p>
            <p className="font-sans text-slate-200">
              <strong>2. Puissance dissipée dans la charge :</strong>
            </p>
            <div className="p-2 rounded bg-black/60 text-center text-rose-300 font-bold">
              <LatexMath math="P(R_c) = R_c \cdot i^2 = \frac{E_{th}^2 R_c}{(R_{th} + R_c)^2}" />
            </div>
            <p className="font-sans text-slate-200">
              <strong>3. Recherche du maximum (<LatexMath math="\frac{\mathrm{d}P}{\mathrm{d}R_c} = 0" />) :</strong>
            </p>
            <div className="p-2 rounded bg-black/60 text-center text-slate-300">
              <LatexMath math="\frac{\mathrm{d}P}{\mathrm{d}R_c} = E_{th}^2 \cdot \frac{(R_{th} + R_c)^2 - 2 R_c(R_{th} + R_c)}{(R_{th} + R_c)^4} = E_{th}^2 \cdot \frac{R_{th} - R_c}{(R_{th} + R_c)^3}" />
            </div>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-center font-bold">
              <LatexMath math="\frac{\mathrm{d}P}{\mathrm{d}R_c} = 0 \iff R_c = R_{th} \quad \implies \quad P_{\max} = \frac{E_{th}^2}{4 R_{th}}" />
            </div>
          </div>
        </div>

        {/* Efficiency Alert */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
          <h4 className="text-[11px] font-bold uppercase text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Rendement Énergétique à l&apos;Adaptation (50%)
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            À l&apos;adaptation de puissance (<LatexMath math="R_c = R_{th}" />), la moitié de la puissance totale fournie par la source est perdue par effet Joule dans sa propre résistance interne <LatexMath math="R_{th}" /> :
          </p>
          <div className="p-2 rounded bg-black/50 text-center font-mono text-amber-300 font-bold text-[11px]">
            <LatexMath math="\eta = \frac{P_{\text{utile}}}{P_{\text{fournie}}} = \frac{R_c I^2}{(R_{th} + R_c) I^2} = \frac{R_{th}}{2 R_{th}} = 50\%" />
          </div>
          <p className="text-[11px] text-slate-400">
            • En <strong>électronique du signal</strong> (télécoms, audio, capteurs) : on privilégie l&apos;adaptation (<LatexMath math="R_c = R_{th}" />) pour extraire le signal maximal.
            <br />
            • En <strong>génie électrique de puissance</strong> (réseau EDF, moteurs) : on recherche un rendement proche de 100% (<LatexMath math="R_{th} \ll R_c" />).
          </p>
        </div>
      </section>

      {/* ── PARTIE 6: LABORATOIRE 3D INTERACTIF ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-extrabold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 6 • Simulation & Expérimentation</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          6. Laboratoire 3D : Réseau Linéaire, Thévenin, Norton & Transfert de Puissance
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Basculez entre le <strong>Réseau Complet (Pont Diviseur)</strong> et ses équivalents rigoureux de <strong>Thévenin</strong> et <strong>Norton</strong>. Observez en direct sur le graphique 2D le point de puissance maximale à l&apos;adaptation de charge <LatexMath math="R_c = R_{th}" />.
        </p>

        {/* 3D Simulation Canvas */}
        <NetworkThevenin3DCanvas />
      </section>

      {/* ── PARTIE 7: AUTO-ÉVALUATION & QCM ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-extrabold mb-1 border border-indigo-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Partie 7 • Validation & Auto-Évaluation</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          7. QCM d&apos;Auto-Évaluation du Chapitre 2
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Testez votre maîtrise des lois de Kirchhoff, des équivalences Thévenin/Norton, du théorème de Millman et du transfert maximal de puissance.
        </p>

        {/* Pure LaTeX QCM */}
        <Chap2QuickQuiz />
      </section>
    </div>
  );
}
