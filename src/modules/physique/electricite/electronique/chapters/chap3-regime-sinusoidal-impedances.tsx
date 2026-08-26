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
  Compass,
  Radio,
  Sparkles,
  TrendingUp,
  Workflow,
  RefreshCw,
  Flame,
  ShieldCheck,
  Award,
  Sliders,
  Scale,
  Waves,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Dynamic 3D Simulation Canvas for Fresnel & Impedances
const ImpedanceFresnel3DCanvas = dynamic(
  () => import("../components/ImpedanceFresnel3DCanvas"),
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
      border: "border-cyan-500/30",
      bg: "bg-cyan-950/20",
      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    },
    amber: {
      border: "border-amber-500/30",
      bg: "bg-amber-950/20",
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    emerald: {
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/20",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    },
    indigo: {
      border: "border-indigo-500/30",
      bg: "bg-indigo-950/20",
      badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    },
    rose: {
      border: "border-rose-500/30",
      bg: "bg-rose-950/20",
      badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    },
  }[color];

  return (
    <div className={`my-4 rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-md overflow-hidden transition-all duration-200`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors cursor-pointer"
      >
        <div className="space-y-1 pr-3">
          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colors.badge}`}>
            {badge}
          </span>
          <h4 className="text-sm sm:text-base font-bold text-foreground">{title}</h4>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 shrink-0">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-3 border-t border-border/40 text-xs sm:text-sm text-slate-200 space-y-3 leading-relaxed animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

/* ── Interactive QCM Component (12 Questions) ── */
function Chap3QuickQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      q: "Dans la notation complexe en Régime Sinusoïdal Forcé (RSF), à quelle opération algébrique simple équivaut la dérivation par rapport au temps d/dt ?",
      qMath: "\\frac{\\mathrm{d}}{\\mathrm{d}t} s(t) \\iff \\text{Opérateur Algébrique Complexe}",
      optionsMath: [
        "\\times \\frac{1}{j\\omega}",
        "\\times j\\omega",
        "\\times -\\omega^2",
        "\\times j\\omega^2",
      ],
      correct: 1,
      explanation: "Puisque s(t) = Re(S_m e^{j(ωt+φ)}), la dérivation temporelle fait descendre le facteur jω :",
      expMath: "\\frac{\\mathrm{d}}{\\mathrm{d}t}\\left(\\underline{S}_m e^{j\\omega t}\\right) = j\\omega \\cdot \\underline{S}_m e^{j\\omega t}",
    },
    {
      q: "Quelle est l'impédance complexe Z_C d'un condensateur idéal de capacité C à la pulsation ω ?",
      qMath: "\\underline{Z}_C \\text{ (Impédance du condensateur)}",
      optionsMath: [
        "\\underline{Z}_C = j C \\omega",
        "\\underline{Z}_C = \\frac{1}{j C \\omega} = -j \\frac{1}{C \\omega}",
        "\\underline{Z}_C = C \\omega",
        "\\underline{Z}_C = -j C \\omega",
      ],
      correct: 1,
      explanation: "Avec i_C = C du_C/dt => I_m = j C ω U_m, d'où Z_C = U_m / I_m = 1 / (j C ω) = -j / (C ω).",
      expMath: "\\underline{Z}_C = \\frac{1}{j C \\omega} = \\frac{1}{C \\omega} e^{-j \\frac{\\pi}{2}} \\implies \\phi = -\\frac{\\pi}{2}",
    },
    {
      q: "Pour une bobine idéale d'inductance L, quel est le déphasage de la tension u_L(t) par rapport au courant i_L(t) ?",
      qMath: "\\phi = \\phi_u - \\phi_i \\quad (\\text{Dipôle inductif pur})",
      optionsMath: [
        "\\phi = 0 \\quad (\\text{En phase})",
        "\\phi = +\\frac{\\pi}{2} \\quad (\\text{Tension en avance de } 90^\\circ)",
        "\\phi = -\\frac{\\pi}{2} \\quad (\\text{Tension en retard de } 90^\\circ)",
        "\\phi = \\pi \\quad (\\text{En opposition de phase})",
      ],
      correct: 1,
      explanation: "Pour une bobine, Z_L = j L ω = L ω e^{j π/2}. L'argument est +π/2, donc la tension est en avance de 90° sur le courant.",
    },
    {
      q: "Quel est le comportement asymptotique d'une bobine idéale L en très haute fréquence (ω → +∞) et en continu (ω → 0) ?",
      qMath: "\\text{Comportements limites BF et HF d'une inductance}",
      optionsText: [
        "Court-circuit en HF (ω → ∞) et circuit ouvert en continu (ω → 0)",
        "Circuit ouvert en HF (ω → ∞) et court-circuit / fil parfait en continu (ω → 0)",
        "Résistance pure R en continu et condensateur en HF",
        "Aucun changement, l'impédance est constante",
      ],
      correct: 1,
      explanation: "|Z_L| = Lω. Quand ω → 0, |Z_L| → 0 (fil parfait). Quand ω → ∞, |Z_L| → ∞ (interrupteur ouvert).",
    },
    {
      q: "Quelle est l'expression de la puissance active moyenne P reçue par un dipôle sous tension efficace U et courant efficace I ?",
      qMath: "P = \\langle p(t) \\rangle \\text{ (Puissance active en Watts)}",
      optionsMath: [
        "P = U_{\\text{eff}} \\cdot I_{\\text{eff}} \\cdot \\cos\\phi",
        "P = U_{\\text{eff}} \\cdot I_{\\text{eff}} \\cdot \\sin\\phi",
        "P = U_{\\text{eff}} \\cdot I_{\\text{eff}}",
        "P = \\frac{1}{2} U_{\\text{eff}} \\cdot I_{\\text{eff}}",
      ],
      correct: 0,
      explanation: "La puissance active est la moyenne temporelle de p(t) :",
      expMath: "P = \\langle u(t) i(t) \\rangle = U_{\\text{eff}} I_{\\text{eff}} \\cos\\phi = \\Re\\left(\\underline{U}_{\\text{eff}} \\underline{I}_{\\text{eff}}^*\\right)",
    },
    {
      q: "Quelle est l'unité légale de la puissance réactive Q ?",
      qMath: "Q = U_{\\text{eff}} I_{\\text{eff}} \\sin\\phi",
      optionsText: [
        "Le Watt [W]",
        "Le Volt-Ampère Réactif [VAR]",
        "Le Volt-Ampère [VA]",
        "Le Joule [J]",
      ],
      correct: 1,
      explanation: "La puissance réactive s'exprime en Volt-Ampère Réactif (VAR) pour la distinguer de la puissance active en Watts (W) et de la puissance apparente en Volt-Ampères (VA).",
    },
    {
      q: "D'après le théorème de Boucherot, que peut-on affirmer sur les puissances dans un réseau en régime sinusoïdal forcé ?",
      qMath: "\\text{Théorème de Boucherot (Conservation des puissances)}",
      optionsText: [
        "Seule la puissance apparente S se conserve",
        "Les puissances active P et réactive Q se conservent séparément",
        "Le facteur de puissance cos(φ) est identique dans toutes les branches",
        "La puissance réactive totale est toujours strictement nulle",
      ],
      correct: 1,
      explanation: "Le théorème de Boucherot stipule la conservation indépendante de la puissance active P_tot = Σ P_k et réactive Q_tot = Σ Q_k :",
      expMath: "P_{\\text{tot}} = \\sum_{k} P_k \\quad \\text{et} \\quad Q_{\\text{tot}} = \\sum_{k} Q_k",
    },
    {
      q: "Pour relever le facteur de puissance d'une installation industrielle inductive sans modifier sa puissance active, quel dipôle branche-t-on en parallèle ?",
      qMath: "\\text{Compensation d'énergie réactive}",
      optionsText: [
        "Une résistance pure R",
        "Une bobine d'inductance L",
        "Un condensateur de capacité C",
        "Une diode de redressement",
      ],
      correct: 2,
      explanation: "Une charge inductive consomme de la puissance réactive (Q_L > 0). Un condensateur monté en parallèle fournit de la puissance réactive (Q_C < 0), réduisant Q total sans consommer de puissance active.",
    },
    {
      q: "Quelle est la valeur de la capacité C nécessaire pour relever le déphasage d'une usine consommant une puissance P de cos(φ) à cos(φ') sous tension efficace U ?",
      qMath: "\\text{Formule du condensateur de relèvement de } \\cos\\phi",
      optionsMath: [
        "C = \\frac{P (\\tan\\phi - \\tan\\phi')}{\\omega U_{\\text{eff}}^2}",
        "C = \\frac{P (\\cos\\phi - \\cos\\phi')}{\\omega U_{\\text{eff}}}",
        "C = \\frac{\\omega P (\\tan\\phi - \\tan\\phi')}{U_{\\text{eff}}^2}",
        "C = \\frac{P}{\\omega U_{\\text{eff}}^2 \\sin\\phi}",
      ],
      correct: 0,
      explanation: "La variation de puissance réactive imposée par le condensateur est ΔQ = -C ω U_eff² = P(tan φ' - tan φ), d'où :",
      expMath: "C = \\frac{P(\\tan\\phi - \\tan\\phi')}{\\omega U_{\\text{eff}}^2}",
    },
    {
      q: "Quelle est l'impédance équivalente Z_éq d'une association parallèle d'une résistance R et d'un condensateur C ?",
      qMath: "\\underline{Z}_{\\text{éq}} = R \\parallel C",
      optionsMath: [
        "\\underline{Z}_{\\text{éq}} = \\frac{R}{1 + j R C \\omega}",
        "\\underline{Z}_{\\text{éq}} = R + \\frac{1}{j C \\omega}",
        "\\underline{Z}_{\\text{éq}} = \\frac{1 + j R C \\omega}{R}",
        "\\underline{Z}_{\\text{éq}} = \\frac{j R C \\omega}{1 + j R C \\omega}",
      ],
      correct: 0,
      explanation: "1 / Z_éq = 1/R + j C ω = (1 + j R C ω) / R, d'où Z_éq = R / (1 + j R C ω).",
      expMath: "\\underline{Z}_{\\text{éq}} = \\frac{R \\cdot \\frac{1}{j C \\omega}}{R + \\frac{1}{j C \\omega}} = \\frac{R}{1 + j R C \\omega}",
    },
    {
      q: "D'après le théorème de Millman complexe, quelle est l'expression du potentiel complexe V_A au nœud A ?",
      qMath: "\\text{Théorème de Millman en RSF}",
      optionsMath: [
        "\\underline{V}_A = \\frac{\\sum_{k} \\underline{Y}_k \\underline{V}_k + \\sum_{j} \\underline{\\eta}_j}{\\sum_{k} \\underline{Y}_k}",
        "\\underline{V}_A = \\frac{\\sum_{k} \\underline{Z}_k \\underline{V}_k}{\\sum_{k} \\underline{Z}_k}",
        "\\underline{V}_A = \\sum_{k} \\underline{Y}_k \\underline{V}_k \\times \\sum_{k} \\underline{Z}_k",
        "\\underline{V}_A = \\frac{\\sum_{k} \\underline{V}_k}{\\sum_{k} \\underline{Y}_k}",
      ],
      correct: 0,
      explanation: "La loi des nœuds en notation complexe donne la somme des courants entrants : Σ Y_k (V_k - V_A) + Σ η_j = 0, d'où la formule de Millman complexe.",
      expMath: "\\underline{V}_A = \\frac{\\sum_{k} \\frac{\\underline{V}_k}{\\underline{Z}_k} + \\sum_{j} \\underline{\\eta}_j}{\\sum_{k} \\frac{1}{\\underline{Z}_k}}",
    },
    {
      q: "Quelle relation relie la puissance active P, réactive Q et apparente S dans le triangle des puissances ?",
      qMath: "\\text{Triangle des puissances en RSF}",
      optionsMath: [
        "S^2 = P^2 + Q^2 \\iff S = \\sqrt{P^2 + Q^2}",
        "S = P + Q",
        "P^2 = S^2 + Q^2",
        "S = \\sqrt{P \\cdot Q}",
      ],
      correct: 0,
      explanation: "Puisque S = P + jQ, le module de la puissance complexe est S = |S| = √(P² + Q²), formant un triangle rectangle d'angle φ.",
      expMath: "S = |\\underline{S}| = \\sqrt{P^2 + Q^2} = U_{\\text{eff}} I_{\\text{eff}}",
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
          <span>QCM d&apos;Auto-Évaluation • RSF, Impédances & Puissances (12 Questions)</span>
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

/* ── MAIN CHAPTER 3 COMPONENT ── */
export default function Chap3RegimeSinusoidalImpedances() {
  return (
    <div className="space-y-8 w-full max-w-full overflow-x-hidden pb-16 font-sans">
      {/* ── HEADER ── */}
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold">
          <Radio size={14} className="animate-pulse" />
          <span>Chapitre 3 • Électrocinétique en Régime Sinusoïdal Forcé</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Régime Sinusoïdal Forcé, Impédances Complexes & Puissances
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
          Maîtrisez la représentation complexe et les vecteurs de Fresnel, les impédances fondamentales (<LatexMath math="R, L, C" />), les lois de Kirchhoff et de Millman complexes, ainsi que le bilan intégral des puissances en alternatif.
        </p>
      </header>

      {/* ── PARTIE 1: REPRÉSENTATION COMPLEXE & FRESNEL (NOUVEAU DESIGN PÉDAGOGIQUE CLAIR) ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        
        {/* Section Title Badge */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-wider block">Partie 1 • Outils Mathématiques</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              1. Signaux Sinusoïdaux, Notation Complexe & Vecteurs de Fresnel
            </h2>
          </div>
        </div>

        {/* ── ÉTAPE 1 : L'IDÉE CLÉ EN 30 SECONDES ── */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-500/30 space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-blue-300 font-extrabold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>L&apos;Idée Clé : Pourquoi le Régime Sinusoïdal Forcé (RSF) ?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Dans un circuit linéaire excité par une source alternative de fréquence <LatexMath math="f" /> (pulsation <LatexMath math="\omega = 2\pi f" />) :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block">1. Même Fréquence Partout :</span>
              <p className="text-slate-300">Toutes les tensions et tous les courants du circuit oscillent à la <strong>même pulsation <LatexMath math="\omega" /></strong>. Seules l&apos;amplitude et la phase changent.</p>
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">2. Le Théorème de Fourier :</span>
              <p className="text-slate-300">Tout signal périodique quelconque (carré, triangle) est une <strong>somme de sinusoïdes</strong>. Savoir résoudre pour une sinusoïde permet de tout résoudre !</p>
            </div>
          </div>
        </div>

        {/* ── ÉTAPE 2 : ANATOMIE D'UNE SINUSOÏDE TEMPPORELLE ── */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>1.1 Anatomie d&apos;un Signal Sinusoïdal Réel</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            
            {/* Formule & Paramètres (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 text-center font-mono text-cyan-300 font-bold text-sm sm:text-lg shadow-inner">
                <LatexMath math="s(t) = S_m \cos(\omega t + \phi) = \sqrt{2} S_{\text{eff}} \cos(\omega t + \phi)" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold block">• Amplitude Crête <LatexMath math="S_m" /> :</span>
                  <p className="text-slate-400 text-[11px]">La valeur maximale atteinte au sommet de la vague.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-bold block">• Valeur Efficace <LatexMath math="S_{\text{eff}}" /> :</span>
                  <p className="text-slate-400 text-[11px]"><LatexMath math="S_{\text{eff}} = \frac{S_m}{\sqrt{2}}" />. C&apos;est la valeur mesurée par votre multimètre (ex: 230V).</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold block">• Période T & Fréquence f :</span>
                  <p className="text-slate-400 text-[11px]"><LatexMath math="T = \frac{1}{f} = \frac{2\pi}{\omega}" />. Durée d&apos;une oscillation en secondes.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-rose-400 font-bold block">• Phase à l&apos;origine <LatexMath math="\phi" /> :</span>
                  <p className="text-slate-400 text-[11px]">L&apos;angle de départ à <LatexMath math="t=0" /> en radians (décalage horizontal).</p>
                </div>
              </div>
            </div>

            {/* Schéma Graphique SVG Épuré (5 Cols) */}
            <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 shadow-inner flex flex-col items-center justify-center">
              <svg viewBox="0 0 320 180" className="w-full h-auto max-w-[300px] overflow-visible font-sans">
                {/* Axes */}
                <line x1="20" y1="90" x2="295" y2="90" stroke="#475569" strokeWidth="1.2" />
                <line x1="40" y1="165" x2="40" y2="15" stroke="#475569" strokeWidth="1.2" />
                <text x="300" y="94" fill="#94a3b8" fontSize="11" fontWeight="bold">t</text>
                <text x="32" y="12" fill="#94a3b8" fontSize="11" fontWeight="bold" textAnchor="end">s(t)</text>

                {/* Horizontal Guidelines */}
                <line x1="40" y1="35" x2="280" y2="35" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="40" y1="145" x2="280" y2="145" stroke="#1e293b" strokeDasharray="3 3" strokeWidth="0.8" />

                {/* Sinusoid Wave */}
                <path
                  d="M 40,90 C 70,25 100,25 130,90 C 160,155 190,155 220,90 C 250,25 280,25 300,65"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.8"
                />

                {/* Peak Amplitude Sm */}
                <line x1="85" y1="90" x2="85" y2="35" stroke="#38bdf8" strokeWidth="1.5" />
                <polygon points="85,35 81,43 89,43" fill="#38bdf8" />
                <text x="94" y="66" fill="#38bdf8" fontSize="10.5" fontWeight="bold">+Sm</text>

                {/* Period T */}
                <line x1="85" y1="20" x2="265" y2="20" stroke="#f59e0b" strokeWidth="1.4" />
                <line x1="85" y1="16" x2="85" y2="35" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="265" y1="16" x2="265" y2="35" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="2 2" />
                <polygon points="85,20 92,17 92,23" fill="#f59e0b" />
                <polygon points="265,20 258,17 258,23" fill="#f59e0b" />
                <text x="175" y="14" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="middle">Période T = 1/f</text>

                {/* Negative Peak */}
                <text x="180" y="160" fill="#f43f5e" fontSize="10" fontWeight="bold">-Sm</text>
              </svg>
            </div>

          </div>
        </div>

        {/* ── ÉTAPE 3 : LES 4 CAS DE DÉPHASAGE Δφ = φ_u - φ_i ── */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400" />
            <span>1.2 Le Déphasage : Qui est en avance ? Qui est en retard ?</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Cas 1: En phase */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                  1. En Phase
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400"><LatexMath math="\Delta\phi = 0" /></span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                La tension <LatexMath math="u(t)" /> et le courant <LatexMath math="i(t)" /> passent par leurs sommets <strong>en même temps</strong>.
              </p>
              <div className="text-[11px] font-mono text-emerald-300 bg-black/50 p-2 rounded-xl border border-slate-800">
                👉 <strong>Résistance pure R</strong>
              </div>
            </div>

            {/* Cas 2: Quadrature Avance */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                  2. En Avance
                </span>
                <span className="text-xs font-mono font-bold text-amber-400"><LatexMath math="\Delta\phi = +90^\circ" /></span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                La tension <LatexMath math="u(t)" /> atteint son sommet <strong>avant</strong> le courant d&apos;un quart de période (<LatexMath math="T/4" />).
              </p>
              <div className="text-[11px] font-mono text-amber-300 bg-black/50 p-2 rounded-xl border border-slate-800">
                👉 <strong>Bobine idéale L</strong>
              </div>
            </div>

            {/* Cas 3: Quadrature Retard */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                  3. En Retard
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400"><LatexMath math="\Delta\phi = -90^\circ" /></span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                La tension <LatexMath math="u(t)" /> atteint son sommet <strong>après</strong> le courant d&apos;un quart de période (<LatexMath math="T/4" />).
              </p>
              <div className="text-[11px] font-mono text-cyan-300 bg-black/50 p-2 rounded-xl border border-slate-800">
                👉 <strong>Condensateur C</strong>
              </div>
            </div>

            {/* Cas 4: Opposition */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 font-bold border border-rose-500/30">
                  4. Opposition
                </span>
                <span className="text-xs font-mono font-bold text-rose-400"><LatexMath math="\Delta\phi = 180^\circ" /></span>
              </div>
              <p className="text-xs text-slate-300 leading-snug">
                Quand l&apos;un est au maximum positif, l&apos;autre est au maximum négatif (<LatexMath math="u(t) = -k \, i(t)" />).
              </p>
              <div className="text-[11px] font-mono text-rose-300 bg-black/50 p-2 rounded-xl border border-slate-800">
                👉 <strong>Signaux inversés</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ── ÉTAPE 4 : LA NOTATION COMPLEXE (LE POUVOIR MAGIQUE) ── */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4 shadow-md">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm uppercase">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>1.3 La Représentation Complexe : Pourquoi simplifie-t-elle tout ?</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Grâce à la formule d&apos;Euler <LatexMath math="e^{j\theta} = \cos\theta + j \sin\theta" />, on remplace chaque signal réel par une exponentielle complexe tournante :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center font-mono text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-black/60 border border-indigo-500/30 text-indigo-300 font-bold shadow-inner">
              <LatexMath math="\underline{s}(t) = \underline{S}_m e^{j\omega t} = S_m e^{j\phi} e^{j\omega t}" />
            </div>
            <div className="p-3.5 rounded-xl bg-black/60 border border-indigo-500/30 text-indigo-300 font-bold shadow-inner">
              <LatexMath math="s(t) = \Re\left( \underline{s}(t) \right) = S_m \cos(\omega t + \phi)" />
            </div>
          </div>

          {/* Comparatif Magique */}
          <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-2 text-xs">
            <span className="text-amber-300 font-bold block uppercase tracking-wider">
              ⚡ Le Tableau Comparatif Magique :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 font-mono text-xs">
              <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-rose-300 space-y-1">
                <span className="font-sans font-bold block text-rose-400">😫 En Temporel (Lourd) :</span>
                <p>Dériver = calculer <LatexMath math="-\omega S_m \sin(\omega t + \phi)" /> avec de la trigonométrie lourde.</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 space-y-1">
                <span className="font-sans font-bold block text-emerald-400">😎 En Complexe (Instantané) :</span>
                <p>Dériver = simple multiplication par <LatexMath math="j\omega" /> !</p>
                <div className="p-1 rounded bg-black/40 text-center text-emerald-400 font-bold">
                  <LatexMath math="\frac{\mathrm{d}}{\mathrm{d}t} \iff \times (j\omega) \quad \text{et} \quad \int \dots \mathrm{d}t \iff \times \left(\frac{1}{j\omega}\right)" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ÉTAPE 5 : LES VECTEURS DE FRESNEL (L'IMAGE VISUELLE) ── */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>1.4 Les Vecteurs de Fresnel : Une Aiguille qui Tourne</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Un <strong>vecteur de Fresnel</strong> <LatexMath math="\vec{S}" /> est une flèche dans le plan qui tourne à la vitesse angulaire <LatexMath math="\omega" /> :
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block">• Longueur de la flèche :</span>
              <p className="text-slate-300">Égale à l&apos;amplitude <LatexMath math="S_m" /> (ou la valeur efficace <LatexMath math="S_{\text{eff}}" />).</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold block">• Angle de départ :</span>
              <p className="text-slate-300">Égal à la phase initiale <LatexMath math="\phi" /> à <LatexMath math="t = 0" />.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold block">• L&apos;Ombre au sol :</span>
              <p className="text-slate-300">La projection sur l&apos;axe horizontal donne exactement la vraie tension <LatexMath math="s(t)" /> à chaque seconde !</p>
            </div>
          </div>
        </div>

        {/* Exemple Résolu Pas-à-Pas */}
        <CollapsibleProof
          title="Exemple Pratique : Addition de Deux Tensions sans Trigonométrie"
          subtitle="Calcul pas-à-pas de u(t) = 10 cos(ωt) + 10 cos(ωt + π/3)"
          color="cyan"
          badge="Exemple Concret"
        >
          <div className="space-y-3 text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
            <p>
              Soit à calculer la tension totale <LatexMath math="u(t) = u_1(t) + u_2(t)" /> avec :
              <br />
              <LatexMath math="u_1(t) = 10 \cos(\omega t)" /> et <LatexMath math="u_2(t) = 10 \cos\left(\omega t + \frac{\pi}{3}\right)" />.
            </p>
            
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2 font-mono text-xs">
              <span className="text-cyan-400 font-bold font-sans block">1. On passe aux amplitudes complexes :</span>
              <p><LatexMath math="\underline{U}_{m1} = 10" /></p>
              <p><LatexMath math="\underline{U}_{m2} = 10 e^{j\frac{\pi}{3}} = 10 \left( \cos\frac{\pi}{3} + j \sin\frac{\pi}{3} \right) = 10 \left( \frac{1}{2} + j \frac{\sqrt{3}}{2} \right) = 5 + j 5\sqrt{3}" /></p>
              
              <span className="text-amber-400 font-bold font-sans block pt-2">2. On additionne simplement :</span>
              <div className="p-2 rounded bg-slate-900 text-center text-amber-300 font-bold">
                <LatexMath math="\underline{U}_m = \underline{U}_{m1} + \underline{U}_{m2} = 10 + 5 + j 5\sqrt{3} = 15 + j 5\sqrt{3}" />
              </div>

              <span className="text-emerald-400 font-bold font-sans block pt-2">3. On calcule le module et la phase :</span>
              <p>• Module : <LatexMath math="U_m = \sqrt{15^2 + (5\sqrt{3})^2} = \sqrt{225 + 75} = \sqrt{300} = 10\sqrt{3} \approx 17.32\text{ V}" /></p>
              <p>• Phase : <LatexMath math="\tan\phi = \frac{5\sqrt{3}}{15} = \frac{\sqrt{3}}{3} \implies \phi = \frac{\pi}{6}\text{ rad } (30^\circ)" /></p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center font-mono text-emerald-300 font-bold text-xs sm:text-sm">
              <LatexMath math="u(t) = 10\sqrt{3} \cos\left(\omega t + \frac{\pi}{6}\right) \approx 17.32 \cos\left(\omega t + 30^\circ\right)\text{ V}" />
            </div>
          </div>
        </CollapsibleProof>

      </section>

      {/* ── PARTIE 2: IMPÉDANCES & ADMITTANCES DES DIPÔLES FONDAMENTAUX ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">Partie 2 • Caractéristiques des Dipôles</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              2. Impédances et Admittances Complexes des Dipôles R, L, C
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          L&apos;<strong>impédance complexe</strong> <LatexMath math="\underline{Z}" /> généralise la résistance en régime sinusoïdal en intégrant simultanément l&apos;amplitude et le déphasage :
        </p>
        <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-500/30 text-center font-mono text-emerald-300 font-bold text-xs sm:text-sm shadow-inner">
          <LatexMath math="\underline{Z} = \frac{\underline{u}(t)}{\underline{i}(t)} = \frac{\underline{U}_m}{\underline{I}_m} = R + j X = |\underline{Z}| e^{j\phi} \quad \text{et} \quad \underline{Y} = \frac{1}{\underline{Z}} = G + j B" />
        </div>

        {/* 3 Dipoles Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          {/* Resistor R */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-3 shadow-md">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
              Résistance (R)
            </span>
            <div className="p-2.5 rounded-xl bg-black/50 text-center font-mono text-rose-300 font-bold text-xs sm:text-sm border border-rose-500/20">
              <LatexMath math="\underline{Z}_R = R \quad (\phi = 0)" />
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Tension et courant <strong>strictement en phase</strong>. Pas d&apos;effet réactif (<LatexMath math="X = 0" />). Indépendant de la fréquence.
            </p>
          </div>

          {/* Inductor L */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 shadow-md">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              Bobine Idéale (L)
            </span>
            <div className="p-2.5 rounded-xl bg-black/50 text-center font-mono text-amber-300 font-bold text-xs sm:text-sm border border-amber-500/20">
              <LatexMath math="\underline{Z}_L = j L \omega = L\omega e^{j\frac{\pi}{2}}" />
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Déphasage <LatexMath math="\phi = +90^\circ" /> : tension en avance sur le courant.
              <br />
              • <LatexMath math="\omega \to 0" /> : Fil parfait (court-circuit).
              <br />
              • <LatexMath math="\omega \to \infty" /> : Circuit ouvert (bloque les hautes fréquences).
            </p>
          </div>

          {/* Capacitor C */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 shadow-md">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              Condensateur Idéal (C)
            </span>
            <div className="p-2.5 rounded-xl bg-black/50 text-center font-mono text-cyan-300 font-bold text-xs sm:text-sm border border-cyan-500/20">
              <LatexMath math="\underline{Z}_C = \frac{1}{j C \omega} = \frac{1}{C\omega} e^{-j\frac{\pi}{2}}" />
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Déphasage <LatexMath math="\phi = -90^\circ" /> : tension en retard sur le courant.
              <br />
              • <LatexMath math="\omega \to 0" /> : Interrupteur ouvert (bloque le continu).
              <br />
              • <LatexMath math="\omega \to \infty" /> : Fil parfait (court-circuit en HF).
            </p>
          </div>
        </div>

        {/* Real Dipoles Models Proof */}
        <CollapsibleProof
          title="Modèles Réels : Bobine Réelle et Condensateur à Pertes"
          subtitle="Prise en compte de la résistance d'enroulement et des fuites diélectriques"
          color="amber"
          badge="Électronique Pratique"
        >
          <div className="space-y-3 text-slate-300 font-sans text-xs leading-relaxed">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-bold block">1. Bobine Réelle (Série) :</span>
                <p>Modélisée par une résistance interne <LatexMath math="r" /> en série avec <LatexMath math="L" /> :</p>
                <div className="p-1.5 rounded bg-slate-900 text-center text-amber-300 font-mono">
                  <LatexMath math="\underline{Z} = r + j L \omega \implies |\underline{Z}| = \sqrt{r^2 + L^2 \omega^2}, \quad \tan\phi = \frac{L\omega}{r}" />
                </div>
              </div>
              <div className="p-3 rounded-xl bg-black/50 border border-slate-800 space-y-1.5">
                <span className="text-cyan-400 font-bold block">2. Condensateur avec Fuites (Parallèle) :</span>
                <p>Modélisé par une résistance de fuite <LatexMath math="R_p" /> en parallèle avec <LatexMath math="C" /> :</p>
                <div className="p-1.5 rounded bg-slate-900 text-center text-cyan-300 font-mono">
                  <LatexMath math="\underline{Y} = \frac{1}{R_p} + j C \omega \implies \underline{Z} = \frac{R_p}{1 + j R_p C \omega}" />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 3: LOIS DE KIRCHHOFF & THÉORÈMES COMPLEXES ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider block">Partie 3 • Résolution Algébrique</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              3. Lois de Kirchhoff, Diviseurs & Théorème de Millman Complexe
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Toutes les lois fondamentales du régime continu s&apos;étendent directement au régime sinusoïdal forcé en remplaçant les résistances par des impédances complexes <LatexMath math="\underline{Z}" />.
        </p>

        {/* Association rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Association Série & Pont Diviseur de Tension</span>
            <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-cyan-300 font-bold text-xs sm:text-sm">
              <LatexMath math="\underline{Z}_{\text{éq}} = \sum_{k=1}^n \underline{Z}_k \quad \implies \quad \underline{U}_k = \frac{\underline{Z}_k}{\sum \underline{Z}_i} \underline{E}" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Association Parallèle & Pont Diviseur de Courant</span>
            <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-indigo-300 font-bold text-xs sm:text-sm">
              <LatexMath math="\underline{Y}_{\text{éq}} = \sum_{k=1}^n \underline{Y}_k = \sum_{k=1}^n \frac{1}{\underline{Z}_k} \quad \implies \quad \underline{I}_k = \frac{\underline{Y}_k}{\sum \underline{Y}_i} \underline{I}_{\text{tot}}" />
            </div>
          </div>
        </div>

        {/* Complex Millman Theorem */}
        <CollapsibleProof
          title="Théorème de Millman en Notation Complexe"
          subtitle="Détermination directe du potentiel complexe d'un nœud sans poser de système d'équations"
          color="emerald"
          badge="Méthode Fondamentale CPGE"
        >
          <div className="space-y-2.5 text-slate-300 font-sans text-xs sm:text-sm">
            <p className="leading-relaxed">
              Pour un nœud A relié à des potentiels complexes <LatexMath math="\underline{V}_k" /> à travers des impédances <LatexMath math="\underline{Z}_k" /> (admittances <LatexMath math="\underline{Y}_k = 1/\underline{Z}_k" />) et des sources de courant incidentes <LatexMath math="\underline{\eta}_j" /> :
            </p>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-mono font-bold text-sm sm:text-base">
              <LatexMath math="\underline{V}_A = \frac{\sum_{k=1}^n \underline{Y}_k \underline{V}_k + \sum_{j=1}^p \underline{\eta}_j}{\sum_{k=1}^n \underline{Y}_k} = \frac{\sum_{k=1}^n \frac{\underline{V}_k}{\underline{Z}_k} + \sum_{j=1}^p \underline{\eta}_j}{\sum_{k=1}^n \frac{1}{\underline{Z}_k}}" />
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 4: PUISSANCES EN RSF & THÉORÈME DE BOUCHEROT ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider block">Partie 4 • Bilan Énergétique</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              4. Puissances en Régime Sinusoïdal Forcé & Théorème de Boucherot
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          En alternatif, on distingue la <strong>puissance active</strong> (travail utile dissipé) et la <strong>puissance réactive</strong> (échange d&apos;énergie réversible).
        </p>

        {/* 3 Powers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-2 shadow-md">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              1. Puissance Active (P)
            </span>
            <div className="p-2.5 rounded-xl bg-black/50 text-center font-mono text-emerald-300 font-bold text-xs sm:text-sm">
              <LatexMath math="P = U_{\text{eff}} I_{\text{eff}} \cos\phi \quad [\text{W}]" />
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Énergie électrique transformée irréversiblement en travail utile ou chaleur Joule.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2 shadow-md">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              2. Puissance Réactive (Q)
            </span>
            <div className="p-2.5 rounded-xl bg-black/50 text-center font-mono text-amber-300 font-bold text-xs sm:text-sm">
              <LatexMath math="Q = U_{\text{eff}} I_{\text{eff}} \sin\phi \quad [\text{VAR}]" />
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Énergie oscillant périodiquement (<LatexMath math="Q_L > 0" /> pour bobines, <LatexMath math="Q_C < 0" /> pour condensateurs).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-2 shadow-md">
            <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              3. Puissance Complexe (S)
            </span>
            <div className="p-2.5 rounded-xl bg-black/50 text-center font-mono text-cyan-300 font-bold text-xs sm:text-sm">
              <LatexMath math="\underline{S} = P + j Q \implies S = \sqrt{P^2 + Q^2} \quad [\text{VA}]" />
            </div>
            <p className="text-xs text-slate-300 leading-snug">
              Dimensionne les câbles et transformateurs. Facteur de puissance <LatexMath math="k = \cos\phi = \frac{P}{S}" />.
            </p>
          </div>
        </div>

        {/* Boucherot Theorem & Power Factor Improvement */}
        <CollapsibleProof
          title="Théorème de Boucherot & Relèvement du Facteur de Puissance"
          subtitle="Démonstration du calcul de la capacité C pour optimiser une installation industrielle"
          color="amber"
          badge="Application Industrielle Majeure"
        >
          <div className="space-y-3 text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
            <p>
              <strong>Théorème de Boucherot :</strong> Les puissances active et réactive se conservent indépendamment :
            </p>
            <div className="p-2.5 rounded-xl bg-black/60 text-center text-amber-300 font-mono font-bold">
              <LatexMath math="P_{\text{total}} = \sum_{k} P_k \quad \text{et} \quad Q_{\text{total}} = \sum_{k} Q_k" />
            </div>
            <p className="pt-1">
              Pour relever le facteur de puissance d&apos;une usine de <LatexMath math="\cos\phi" /> à <LatexMath math="\cos\phi'" /> sous tension <LatexMath math="U_{\text{eff}}" />, on installe un condensateur de capacité :
            </p>
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 text-center font-mono text-amber-300 font-bold text-sm sm:text-base">
              <LatexMath math="C = \frac{P(\tan\phi - \tan\phi')}{\omega U_{\text{eff}}^2}" />
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 5: LABORATOIRE 3D INTERACTIF ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">Partie 5 • Simulation 3D</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              5. Laboratoire 3D : Plan de Fresnel Tournant & Formes d&apos;Onde Synchronisées
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Manipulez les dipôles <LatexMath math="R, L, C" /> et le circuit <LatexMath math="RLC" /> série. Observez en temps réel la rotation des vecteurs de Fresnel <LatexMath math="\vec{U}_m" /> et <LatexMath math="\vec{I}_m" /> dans le plan complexe 3D ainsi que le déphasage temporel synchronisé.
        </p>

        {/* 3D Simulation Canvas */}
        <ImpedanceFresnel3DCanvas />
      </section>

      {/* ── PARTIE 6: AUTO-ÉVALUATION & QCM ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider block">Partie 6 • Auto-Évaluation</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              6. QCM d&apos;Auto-Évaluation du Chapitre 3 (12 Questions)
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Testez votre maîtrise du régime sinusoïdal forcé, des impédances complexes, du théorème de Millman et du bilan intégral des puissances (Boucherot & compensation réactive).
        </p>

        {/* Pure LaTeX QCM */}
        <Chap3QuickQuiz />
      </section>
    </div>
  );
}
