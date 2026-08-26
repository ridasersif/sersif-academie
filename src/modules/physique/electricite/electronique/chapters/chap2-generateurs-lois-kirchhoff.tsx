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

      {/* ── PARTIE 3: OUTILS FONDAMENTAUX & THÉORÈMES DES RÉSEAUX ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-extrabold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 3 • Outils Fondamentaux & Théorèmes</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          3. Outils Fondamentaux & Théorèmes des Réseaux Linéaires
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Avant d&apos;aborder les grands théorèmes des réseaux, la maîtrise des lois de réduction (associations de résistances) et des règles de division (tension et courant) constitue le socle indispensable pour simplifier n&apos;importe quel circuit sans calcul matriciel lourd.
        </p>

        {/* ── SOUS-SECTION A: LES OUTILS FONDAMENTAUX ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
            <Sliders className="w-4 h-4" /> A. Les Outils Fondamentaux de Réduction
          </div>

          {/* 1. Association des Résistances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Association Série */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-3 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Association en Série</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Même courant <LatexMath math="i" /></span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Deux dipôles sont en série lorsqu&apos;ils sont traversés par le <strong>même courant</strong>. La tension totale est la somme des tensions élémentaires.
                </p>
              </div>

              {/* SVG Série */}
              <div className="w-full bg-slate-950/80 py-2.5 px-3 rounded-lg border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 240 50" className="w-full max-w-[220px] h-auto" overflow="visible">
                  <line x1="15" y1="25" x2="45" y2="25" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="45" y="16" width="35" height="18" rx="2" fill="#020617" stroke="#22d3ee" strokeWidth="1.8"/>
                  <text x="62.5" y="29" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold" fontFamily="monospace">R₁</text>
                  
                  <line x1="80" y1="25" x2="110" y2="25" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
                  
                  <rect x="110" y="16" width="35" height="18" rx="2" fill="#020617" stroke="#22d3ee" strokeWidth="1.8"/>
                  <text x="127.5" y="29" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="bold" fontFamily="monospace">R₂</text>
                  
                  <line x1="145" y1="25" x2="225" y2="25" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
                  
                  <circle cx="15" cy="25" r="3" fill="#22d3ee"/>
                  <text x="15" y="12" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontWeight="bold">A</text>
                  <circle cx="225" cy="25" r="3" fill="#22d3ee"/>
                  <text x="225" y="12" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontWeight="bold">B</text>
                </svg>
              </div>

              <div className="p-2 rounded bg-black/60 text-center font-mono text-cyan-300 font-bold text-xs border border-cyan-500/20">
                <LatexMath math="R_{eq} = \sum R_k = R_1 + R_2 + \dots + R_n" />
              </div>
            </div>

            {/* Association Parallèle */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-indigo-500/20 space-y-3 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Association en Parallèle</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">Même tension <LatexMath math="u" /></span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Deux dipôles sont en parallèle lorsqu&apos;ils sont soumis à la <strong>même tension</strong>. Les conductances s&apos;additionnent directement.
                </p>
              </div>

              {/* SVG Parallèle */}
              <div className="w-full bg-slate-950/80 py-2 px-3 rounded-lg border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 240 60" className="w-full max-w-[220px] h-auto" overflow="visible">
                  <line x1="20" y1="18" x2="220" y2="18" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="20" y1="42" x2="220" y2="42" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round"/>
                  
                  {/* Branch 1 */}
                  <line x1="80" y1="18" x2="80" y2="42" stroke="#818cf8" strokeWidth="1.8"/>
                  <rect x="72" y="22" width="16" height="16" rx="2" fill="#020617" stroke="#818cf8" strokeWidth="1.6"/>
                  <text x="80" y="33.5" textAnchor="middle" fill="#818cf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">R₁</text>
                  
                  {/* Branch 2 */}
                  <line x1="160" y1="18" x2="160" y2="42" stroke="#818cf8" strokeWidth="1.8"/>
                  <rect x="152" y="22" width="16" height="16" rx="2" fill="#020617" stroke="#818cf8" strokeWidth="1.6"/>
                  <text x="160" y="33.5" textAnchor="middle" fill="#818cf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">R₂</text>
                  
                  <circle cx="20" cy="18" r="3" fill="#818cf8"/>
                  <text x="20" y="10" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">A</text>
                  <circle cx="20" cy="42" r="3" fill="#818cf8"/>
                  <text x="20" y="54" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">B</text>
                </svg>
              </div>

              <div className="p-2 rounded bg-black/60 text-center font-mono text-indigo-300 font-bold text-xs border border-indigo-500/20">
                <LatexMath math="G_{eq} = \sum G_k \iff \frac{1}{R_{eq}} = \frac{1}{R_1} + \frac{1}{R_2} \implies R_{eq} = \frac{R_1 R_2}{R_1 + R_2}" />
              </div>
            </div>

          </div>

          {/* 2. Pont Diviseur de Tension (PDT) & Pont Diviseur de Courant (PDC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Pont Diviseur de Tension (PDT) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider">
                    Pont Diviseur de Tension (PDT)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Série non chargée
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Permet de calculer directement la tension aux bornes d&apos;une résistance <LatexMath math="R_2" /> dans une branche série alimentée par une tension totale <LatexMath math="E" />.
                </p>
              </div>

              {/* SVG PDT */}
              <div className="w-full bg-slate-950/80 py-3 px-3 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 250 65" className="w-full max-w-[230px] h-auto" overflow="visible">
                  <defs>
                    <marker id="pdt-u-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <polygon points="0 0, 6 3, 0 6" fill="#facc15"/>
                    </marker>
                    <marker id="pdt-u2-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#34d399"/>
                    </marker>
                  </defs>

                  {/* Total Voltage Arrow E */}
                  <line x1="25" y1="12" x2="225" y2="12" stroke="#facc15" strokeWidth="1.6" markerEnd="url(#pdt-u-arrow)" strokeLinecap="round"/>
                  <text x="125" y="8" textAnchor="middle" fill="#facc15" fontSize="10" fontWeight="bold" fontFamily="monospace">E (Tension totale)</text>

                  {/* Wires & Resistors */}
                  <line x1="25" y1="36" x2="55" y2="36" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="55" y="27" width="38" height="18" rx="2" fill="#020617" stroke="#10b981" strokeWidth="1.8"/>
                  <text x="74" y="40" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">R₁</text>

                  <line x1="93" y1="36" x2="125" y2="36" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="125" y="27" width="38" height="18" rx="2" fill="#020617" stroke="#10b981" strokeWidth="1.8"/>
                  <text x="144" y="40" textAnchor="middle" fill="#34d399" fontSize="10" fontWeight="bold" fontFamily="monospace">R₂</text>

                  <line x1="163" y1="36" x2="225" y2="36" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>

                  {/* Arrow U2 across R2 */}
                  <line x1="120" y1="56" x2="168" y2="56" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#pdt-u2-arrow)" strokeLinecap="round"/>
                  <text x="144" y="52" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="bold" fontFamily="monospace">U₂</text>

                  <circle cx="25" cy="36" r="3" fill="#10b981"/>
                  <circle cx="225" cy="36" r="3" fill="#10b981"/>
                </svg>
              </div>

              <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-emerald-300 font-bold text-xs border border-emerald-500/20">
                <LatexMath math="U_2 = E \cdot \frac{R_2}{R_1 + R_2}" />
              </div>

              {/* Démonstration PDT */}
              <CollapsibleProof
                title="Démonstration du Pont Diviseur de Tension"
                subtitle="Calcul direct par la loi d'Ohm en série"
                color="emerald"
                badge="Démonstration"
              >
                <div className="space-y-2 text-slate-300 font-sans text-[11px]">
                  <p>1. Le courant commun traversant l&apos;association série s&apos;écrit : <LatexMath math="i = \frac{E}{R_1 + R_2}" />.</p>
                  <p>2. La tension aux bornes de <LatexMath math="R_2" /> est donnée par la loi d&apos;Ohm : <LatexMath math="U_2 = R_2 \cdot i = R_2 \cdot \frac{E}{R_1 + R_2} = E \cdot \frac{R_2}{R_1 + R_2}" />.</p>
                  <p className="text-[10px] text-amber-300">⚠️ <strong>Condition :</strong> Ce résultat n&apos;est valable que si <strong>aucun courant n&apos;est prélevé</strong> au point milieu (circuit non chargé).</p>
                </div>
              </CollapsibleProof>
            </div>

            {/* Pont Diviseur de Courant (PDC) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider">
                    Pont Diviseur de Courant (PDC)
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Parallèle
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Permet de calculer la fraction de courant total <LatexMath math="I" /> dérivée dans une branche d&apos;un dipôle constitué de deux résistances en parallèle.
                </p>
              </div>

              {/* SVG PDC */}
              <div className="w-full bg-slate-950/80 py-3 px-3 rounded-xl border border-slate-800 flex justify-center items-center">
                <svg viewBox="0 0 250 65" className="w-full max-w-[230px] h-auto" overflow="visible">
                  <defs>
                    <marker id="pdc-i-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#818cf8"/>
                    </marker>
                    <marker id="pdc-i1-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                      <polygon points="0 0, 5 2.5, 0 5" fill="#38bdf8"/>
                    </marker>
                  </defs>

                  {/* Main current entry I */}
                  <line x1="15" y1="32" x2="50" y2="32" stroke="#818cf8" strokeWidth="2" markerEnd="url(#pdc-i-arrow)" strokeLinecap="round"/>
                  <text x="32" y="24" textAnchor="middle" fill="#818cf8" fontSize="9" fontWeight="bold" fontFamily="monospace">I</text>

                  {/* Upper rail & Lower rail */}
                  <line x1="55" y1="18" x2="195" y2="18" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="55" y1="46" x2="195" y2="46" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="55" y1="18" x2="55" y2="46" stroke="#818cf8" strokeWidth="1.8"/>
                  <line x1="195" y1="18" x2="195" y2="46" stroke="#818cf8" strokeWidth="1.8"/>

                  {/* Branch 1 (R1) */}
                  <line x1="100" y1="18" x2="100" y2="46" stroke="#818cf8" strokeWidth="1.6"/>
                  <rect x="92" y="24" width="16" height="16" rx="2" fill="#020617" stroke="#818cf8" strokeWidth="1.6"/>
                  <text x="100" y="35.5" textAnchor="middle" fill="#818cf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">R₁</text>
                  <line x1="100" y1="18" x2="100" y2="23" stroke="#38bdf8" strokeWidth="1.6" markerEnd="url(#pdc-i1-arrow)"/>
                  <text x="112" y="24" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">I₁</text>

                  {/* Branch 2 (R2) */}
                  <line x1="150" y1="18" x2="150" y2="46" stroke="#818cf8" strokeWidth="1.6"/>
                  <rect x="142" y="24" width="16" height="16" rx="2" fill="#020617" stroke="#818cf8" strokeWidth="1.6"/>
                  <text x="150" y="35.5" textAnchor="middle" fill="#818cf8" fontSize="8.5" fontWeight="bold" fontFamily="monospace">R₂</text>
                  <line x1="150" y1="18" x2="150" y2="23" stroke="#38bdf8" strokeWidth="1.6" markerEnd="url(#pdc-i1-arrow)"/>
                  <text x="162" y="24" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">I₂</text>

                  {/* Exit wire */}
                  <line x1="195" y1="32" x2="235" y2="32" stroke="#818cf8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-indigo-300 font-bold text-xs border border-indigo-500/20">
                <LatexMath math="I_1 = I \cdot \frac{R_2}{R_1 + R_2} \quad \text{et} \quad I_2 = I \cdot \frac{R_1}{R_1 + R_2}" />
              </div>

              {/* Démonstration PDC */}
              <CollapsibleProof
                title="Démonstration du Pont Diviseur de Courant"
                subtitle="Attention : la résistance opposée se trouve au numérateur !"
                color="indigo"
                badge="Démonstration"
              >
                <div className="space-y-2 text-slate-300 font-sans text-[11px]">
                  <p>1. La tension commune aux deux branches vaut : <LatexMath math="U = R_{eq} \cdot I = \left(\frac{R_1 R_2}{R_1 + R_2}\right) \cdot I" />.</p>
                  <p>2. Le courant dans la branche 1 s&apos;écrit alors : <LatexMath math="I_1 = \frac{U}{R_1} = \frac{1}{R_1} \cdot \left(\frac{R_1 R_2}{R_1 + R_2}\right) \cdot I = I \cdot \frac{R_2}{R_1 + R_2}" />.</p>
                  <p className="text-[10px] text-indigo-300">💡 <strong>Formule générale avec conductances :</strong> <LatexMath math="I_k = I \cdot \frac{G_k}{\sum G_j}" />.</p>
                </div>
              </CollapsibleProof>
            </div>

          </div>
        </div>

        {/* ── SOUS-SECTION B: LES THÉORÈMES DES RÉSEAUX LINÉAIRES ── */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
            <Cpu className="w-4 h-4" /> B. Les Grands Théorèmes des Réseaux Linéaires
          </div>

          {/* 1. Superposition */}
          <CollapsibleProof
            title="Théorème 1 : Théorème de Superposition"
            subtitle="Linéarité des équations & principe d'extinction des sources indépendantes"
            color="cyan"
            badge="Théorème Fondamental"
          >
            <div className="space-y-3 text-slate-300 font-sans text-[11px]">
              <p className="leading-relaxed">
                Dans un réseau linéaire constitué de dipôles passifs et de plusieurs sources indépendantes, la tension ou l&apos;intensité dans une branche est la <strong>somme algébrique</strong> des grandeurs produites par chaque source agissant seule, les autres étant éteintes (passivées).
              </p>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-center font-mono font-bold text-xs">
                <LatexMath math="u_{\text{total}} = \sum_{k=1}^{n} u_{(E_k \text{ seule})} \quad \text{et} \quad i_{\text{total}} = \sum_{k=1}^{n} i_{(E_k \text{ seule})}" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800">
                  <span className="text-cyan-400 font-bold">Éteindre source de tension :</span> <LatexMath math="E=0\text{ V} \implies \text{Court-circuit (Fil)}" />
                </div>
                <div className="p-2.5 rounded-lg bg-black/50 border border-slate-800">
                  <span className="text-indigo-400 font-bold">Éteindre source de courant :</span> <LatexMath math="\eta=0\text{ A} \implies \text{Circuit ouvert}" />
                </div>
              </div>
            </div>
          </CollapsibleProof>

          {/* 2. Thévenin */}
          <CollapsibleProof
            title="Théorème 2 : Théorème de Thévenin"
            subtitle="Modélisation globale d'un réseau dipolaire vu de deux bornes A et B"
            color="amber"
            badge="Modèle (Eth, Rth)"
          >
            <div className="space-y-3 text-slate-300 font-sans text-[11px]">
              <p className="leading-relaxed">
                Tout réseau linéaire vu entre deux bornes A et B est rigoureusement équivalent à un générateur de Thévenin unique constitué d&apos;une source idéale <LatexMath math="E_{th}" /> en série avec une résistance <LatexMath math="R_{th}" /> :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono pt-1">
                <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 space-y-1.5">
                  <span className="font-sans font-bold text-amber-400">1. Calcul de Eth :</span>
                  <p className="font-sans text-[11px] text-slate-300">Tension à vide mesurée entre A et B sans aucune charge connectée :</p>
                  <div className="text-center text-amber-300 font-bold"><LatexMath math="E_{th} = U_{AB,\text{vide}}" /></div>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-amber-500/20 space-y-1.5">
                  <span className="font-sans font-bold text-amber-400">2. Calcul de Rth :</span>
                  <p className="font-sans text-[11px] text-slate-300">Résistance équivalente vue entre A et B après extinction de toutes les sources indépendantes :</p>
                  <div className="text-center text-amber-300 font-bold"><LatexMath math="R_{th} = R_{AB,\text{éteint}}" /></div>
                </div>
              </div>
            </div>
          </CollapsibleProof>

          {/* 3. Norton */}
          <CollapsibleProof
            title="Théorème 3 : Théorème de Norton"
            subtitle="Modélisation duale par une source de courant en parallèle"
            color="indigo"
            badge="Modèle (IN, RN)"
          >
            <div className="space-y-3 text-slate-300 font-sans text-[11px]">
              <p className="leading-relaxed">
                Tout réseau linéaire vu entre deux bornes A et B est équivalent à un générateur de Norton constitué d&apos;une source idéale de courant <LatexMath math="I_N" /> en parallèle avec une résistance <LatexMath math="R_N = R_{th}" /> :
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono pt-1">
                <div className="p-3 rounded-xl bg-black/50 border border-indigo-500/20 space-y-1.5">
                  <span className="font-sans font-bold text-indigo-400">1. Calcul de IN (Courant de court-circuit) :</span>
                  <p className="font-sans text-[11px] text-slate-300">Courant traversant un fil reliant directement A et B :</p>
                  <div className="text-center text-indigo-300 font-bold"><LatexMath math="I_N = I_{cc} = \frac{E_{th}}{R_{th}}" /></div>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-indigo-500/20 space-y-1.5">
                  <span className="font-sans font-bold text-indigo-400">2. Calcul de RN :</span>
                  <p className="font-sans text-[11px] text-slate-300">Identique à la résistance de Thévenin :</p>
                  <div className="text-center text-indigo-300 font-bold"><LatexMath math="R_N = R_{th} = R_{AB,\text{éteint}}" /></div>
                </div>
              </div>
            </div>
          </CollapsibleProof>

          {/* 4. Millman */}
          <CollapsibleProof
            title="Théorème 4 : Théorème de Millman"
            subtitle="Loi des nœuds exprimée en termes de potentiels et de conductances"
            color="emerald"
            badge="Méthode Rapide"
          >
            <div className="space-y-3 text-slate-300 font-sans text-[11px]">
              <p className="leading-relaxed">
                Pour un nœud A relié à <LatexMath math="n" /> branches composées chacune d&apos;un potentiel <LatexMath math="V_k" /> à travers une résistance <LatexMath math="R_k" /> et de <LatexMath math="p" /> sources de courant incidentes <LatexMath math="\eta_j" /> :
              </p>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-mono font-bold text-xs">
                <LatexMath math="V_A = \frac{\sum_{k=1}^{n} \frac{V_k}{R_k} + \sum_{j=1}^{p} \eta_j}{\sum_{k=1}^{n} \frac{1}{R_k}} = \frac{\sum G_k V_k + \sum \eta_j}{\sum G_k}" />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                ⚠️ <strong>Convention de signe :</strong> Les courants de source <LatexMath math="\eta_j" /> sont comptés positivement s&apos;ils <strong>entrent</strong> dans le nœud A, négativement s&apos;ils en sortent.
              </p>
            </div>
          </CollapsibleProof>
        </div>
      </section>

      {/* ── PARTIE 4: TRANSFERT MAXIMAL DE PUISSANCE & ADAPTATION ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-extrabold mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Partie 4 • Optimisation Énergétique</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          4. Transfert Maximal de Puissance & Adaptation d&apos;Impédance
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Lorsqu&apos;un générateur réel de Thévenin <LatexMath math="(E_{th}, R_{th})" /> alimente une résistance de charge variable <LatexMath math="R_c" />, quelle valeur de <LatexMath math="R_c" /> permet de lui transférer le maximum d&apos;énergie utile ?
        </p>

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

      {/* ── PARTIE 5: LABORATOIRE 3D INTERACTIF ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[11px] font-extrabold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 5 • Simulation & Expérimentation</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          5. Laboratoire 3D : Réseau Linéaire, Thévenin, Norton & Transfert de Puissance
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Basculez entre le <strong>Réseau Complet (Pont Diviseur)</strong> et ses équivalents rigoureux de <strong>Thévenin</strong> et <strong>Norton</strong>. Observez en direct sur le graphique 2D le point de puissance maximale à l&apos;adaptation de charge <LatexMath math="R_c = R_{th}" />.
        </p>

        {/* 3D Simulation Canvas */}
        <NetworkThevenin3DCanvas />
      </section>

      {/* ── PARTIE 6: AUTO-ÉVALUATION & QCM ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[11px] font-extrabold mb-1 border border-indigo-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Partie 6 • Validation & Auto-Évaluation</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          6. QCM d&apos;Auto-Évaluation du Chapitre 2
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
