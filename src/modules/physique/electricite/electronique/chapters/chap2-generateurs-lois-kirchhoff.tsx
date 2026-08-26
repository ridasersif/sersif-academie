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
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Dynamic 3D Simulation Canvas for Thévenin / Norton
const KirchhoffLaws3DCanvas = dynamic(() => import('../components/KirchhoffLaws3DCanvas'), { ssr: false });
const NetworkThevenin3DCanvas = dynamic(
  () => import("../components/NetworkThevenin3DCanvas"),
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
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-cyan-400 uppercase tracking-wider">
                  Modèle de Thévenin
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  Série (E, r)
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Modélisation : Source de tension idéale + résistance <LatexMath math="r" /> en série.</p>
              <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-cyan-300 font-bold text-[11px] border border-cyan-500/20">
                <LatexMath math="u(i) = E - r \cdot i" />
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pl-1 leading-relaxed mt-2">
                <li>• <strong>Tension à vide (<LatexMath math="i = 0" />) :</strong> <LatexMath math="u_0 = E" />.</li>
                <li>• <strong>Courant de court-circuit (<LatexMath math="u = 0" />) :</strong> <LatexMath math="I_{cc} = \frac{E}{r}" />.</li>
              </ul>
            </div>

            {/* Norton Generator */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider">
                  Modèle de Norton
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Parallèle (η, r)
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Modélisation : Source de courant idéale + résistance <LatexMath math="r" /> en parallèle.</p>
              <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-indigo-300 font-bold text-[11px] border border-indigo-500/20">
                <LatexMath math="i(u) = \eta - \frac{u}{r}" />
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1.5 pl-1 leading-relaxed mt-2">
                <li>• <strong>Courant de court-circuit (<LatexMath math="u = 0" />) :</strong> <LatexMath math="i = \eta" />.</li>
                <li>• <strong>Tension à vide (<LatexMath math="i = 0" />) :</strong> <LatexMath math="u_0 = r \cdot \eta" />.</li>
              </ul>
            </div>
          </div>

          {/* Thévenin <-> Norton Equivalence Box */}
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-[11px] mt-2">
            <h4 className="font-extrabold uppercase text-emerald-400 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" /> Équivalence Thévenin ⟺ Norton
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Les deux modèles sont rigoureusement interchangeables. On passe de l&apos;un à l&apos;autre via la loi d&apos;Ohm interne :
            </p>
            <div className="p-2.5 rounded-lg bg-black/60 border border-emerald-500/30 text-center text-emerald-300 font-mono font-bold text-[11px]">
              <LatexMath math="E_{th} = r \cdot \eta \quad \text{et} \quad r_{th} = r_N = r" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTIE 3: THÉORÈMES DES RÉSEAUX LINÉAIRES ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] font-extrabold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 3 • Boîte à Outils Fondamentale</span>
        </div>

        <h2 className="text-lg sm:text-lg font-black text-foreground leading-tight">
          3. Théorèmes des Réseaux : Superposition, Thévenin, Norton & Millman
        </h2>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Pour résoudre des circuits complexes à plusieurs mailles sans poser des systèmes d&apos;équations matriciels lourds, les quatre théorèmes fondamentaux permettent de simplifier n&apos;importe quel réseau linéaire.
        </p>

        {/* 1. Superposition */}
        <CollapsibleProof
          title="Théorème 1 : Théorème de Superposition"
          subtitle="Linéarité des équations & principe d'extinction des sources indépendantes"
          color="cyan"
          badge="Théorème Fondamental"
        >
          <div className="space-y-2 text-slate-300 font-sans text-[11px]">
            <p className="leading-relaxed">
              Dans un réseau linéaire constitué de dipôles passifs et de plusieurs sources indépendantes, la tension ou l&apos;intensité dans une branche est la <strong>somme algébrique</strong> des grandeurs produites par chaque source agissant seule, les autres étant éteintes (passivées).
            </p>
            <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-center font-mono font-bold">
              <LatexMath math="u_{\text{total}} = \sum_{k=1}^{n} u_{(E_k \text{ seule})} \quad \text{et} \quad i_{\text{total}} = \sum_{k=1}^{n} i_{(E_k \text{ seule})}" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] pt-1">
              <div className="p-2 rounded bg-black/50 border border-slate-800">
                <span className="text-cyan-400 font-bold">Éteindre source de tension :</span> <LatexMath math="E=0\text{ V} \implies \text{Fil (Court-circuit)}" />
              </div>
              <div className="p-2 rounded bg-black/50 border border-slate-800">
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
          <div className="space-y-2 text-slate-300 font-sans text-[11px]">
            <p className="leading-relaxed">
              Tout réseau linéaire vu entre deux bornes A et B est rigoureusement équivalent à un générateur de Thévenin unique constitué d&apos;une source idéale <LatexMath math="E_{th}" /> en série avec une résistance <LatexMath math="R_{th}" /> :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <div className="p-2.5 rounded bg-black/50 border border-amber-500/20 space-y-1">
                <span className="font-sans font-bold text-amber-400">1. Calcul de Eth :</span>
                <p className="font-sans text-[11px] text-slate-300">Tension à vide mesurée entre A et B sans aucune charge connectée :</p>
                <div className="text-center text-amber-300 font-bold"><LatexMath math="E_{th} = U_{AB,\text{vide}}" /></div>
              </div>
              <div className="p-2.5 rounded bg-black/50 border border-amber-500/20 space-y-1">
                <span className="font-sans font-bold text-amber-400">2. Calcul de Rth :</span>
                <p className="font-sans text-[11px] text-slate-300">Résistance équivalente vue entre A et B après extinction de toutes les sources :</p>
                <div className="text-center text-amber-300 font-bold"><LatexMath math="R_{th} = R_{AB,\text{éteint}}" /></div>
              </div>
            </div>
          </div>
        </CollapsibleProof>

        {/* 3. Millman */}
        <CollapsibleProof
          title="Théorème 3 : Théorème de Millman"
          subtitle="Loi des nœuds exprimée en termes de potentiels et de conductances"
          color="emerald"
          badge="Méthode Rapide"
        >
          <div className="space-y-2 text-slate-300 font-sans text-[11px]">
            <p className="leading-relaxed">
              Pour un nœud A relié à <LatexMath math="n" /> branches composées chacune d&apos;un potentiel <LatexMath math="V_k" /> à travers une résistance <LatexMath math="R_k" /> et de <LatexMath math="p" /> sources de courant incidentes <LatexMath math="\eta_j" /> :
            </p>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-mono font-bold text-[11px]">
              <LatexMath math="V_A = \frac{\sum_{k=1}^{n} \frac{V_k}{R_k} + \sum_{j=1}^{p} \eta_j}{\sum_{k=1}^{n} \frac{1}{R_k}} = \frac{\sum G_k V_k + \sum \eta_j}{\sum G_k}" />
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              ⚠️ <strong>Convention de signe :</strong> Les courants de source <LatexMath math="\eta_j" /> sont comptés positivement s&apos;ils <strong>entrent</strong> dans le nœud A, négativement s&apos;ils en sortent.
            </p>
          </div>
        </CollapsibleProof>
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
