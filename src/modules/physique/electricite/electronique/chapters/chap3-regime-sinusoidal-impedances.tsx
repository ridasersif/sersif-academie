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

      {/* ── PARTIE 2: IMPÉDANCES & ADMITTANCES DES DIPÔLES FONDAMENTAUX (ILLUSTRÉE SVG) ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider block">Partie 2 • Caractéristiques Fondamentales</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              2. Impédance & Admittance d&apos;un Dipôle : Définition Générale et Dipôles R, L, C
            </h2>
          </div>
        </div>

        {/* 2.1 Définition Générale : Dipôle Générique Z en Convention Récepteur */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/30 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>2.1 Définition Générale de l&apos;Impédance et de l&apos;Admittance Complexe</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            
            {/* Schéma SVG du Dipôle Générique (5 Cols) */}
            <div className="lg:col-span-5 p-4 rounded-2xl bg-black/60 border border-slate-800 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[11px] font-mono text-slate-400 mb-2 font-bold">Convention Récepteur :</span>
              <svg viewBox="0 0 320 130" className="w-full h-auto max-w-[280px] font-sans">
                {/* Wires */}
                <line x1="20" y1="55" x2="110" y2="55" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="210" y1="55" x2="300" y2="55" stroke="#94a3b8" strokeWidth="2.5" />
                
                {/* Terminal dots */}
                <circle cx="20" cy="55" r="4" fill="#38bdf8" />
                <circle cx="300" cy="55" r="4" fill="#38bdf8" />
                <text x="12" y="42" fill="#38bdf8" fontSize="11" fontWeight="bold">A</text>
                <text x="302" y="42" fill="#38bdf8" fontSize="11" fontWeight="bold">B</text>

                {/* Dipole Box Z */}
                <rect x="110" y="30" width="100" height="50" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="2.5" />
                <text x="160" y="62" fill="#34d399" fontSize="18" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Z</text>

                {/* Current Arrow i(t) */}
                <line x1="45" y1="35" x2="85" y2="35" stroke="#06b6d4" strokeWidth="2" />
                <polygon points="85,35 77,31 77,39" fill="#06b6d4" />
                <text x="65" y="24" fill="#06b6d4" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">i(t)</text>

                {/* Voltage Arrow u(t) (Convention récepteur: sens opposé à i) */}
                <line x1="280" y1="105" x2="40" y2="105" stroke="#f43f5e" strokeWidth="2" />
                <polygon points="40,105 48,101 48,109" fill="#f43f5e" />
                <text x="160" y="123" fill="#f43f5e" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">u(t)</text>
              </svg>
            </div>

            {/* Formules et Définitions Clés (7 Cols) */}
            <div className="lg:col-span-7 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                {/* Impédance Z */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
                  <span className="text-emerald-400 font-sans font-bold block">1. Impédance Complexe :</span>
                  <div className="p-1.5 rounded bg-black/60 text-center text-emerald-300 font-bold text-sm">
                    <LatexMath math="\underline{Z} = \frac{\underline{u}}{\underline{i}} \iff \underline{u} = \underline{Z} \cdot \underline{i}" />
                  </div>
                  <p className="text-slate-400 font-sans text-[11px] pt-1">Homogène à une résistance [<LatexMath math="\Omega" />].</p>
                </div>

                {/* Admittance Y */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
                  <span className="text-cyan-400 font-sans font-bold block">2. Admittance Complexe :</span>
                  <div className="p-1.5 rounded bg-black/60 text-center text-cyan-300 font-bold text-sm">
                    <LatexMath math="\underline{Y} = \frac{1}{\underline{Z}} \iff \underline{i} = \underline{Y} \cdot \underline{u}" />
                  </div>
                  <p className="text-slate-400 font-sans text-[11px] pt-1">Homogène à une conductance [Siemens <LatexMath math="\text{S}" />].</p>
                </div>
              </div>

              {/* Module & Argument */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-amber-400 font-bold font-mono">• Module Réel : <LatexMath math="|\underline{Z}| = Z = \frac{U_m}{I_m} = \frac{U_{\text{eff}}}{I_{\text{eff}}} \quad [\Omega]" /></span>
                  <span className="text-indigo-400 font-bold font-mono">• Déphasage : <LatexMath math="\phi = \arg(\underline{Z}) = \phi_u - \phi_i" /></span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  L&apos;impédance s&apos;écrit sous forme trigonométrique : <LatexMath math="\underline{Z} = |\underline{Z}| e^{j\phi} = Z (\cos\phi + j \sin\phi) = R + jX" />.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 2.2 Les 3 Dipôles Fondamentaux : R, L, C avec Schémas SVG et Calculs */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <Workflow className="w-4 h-4 text-cyan-400" />
            <span>2.2 Caractéristiques des 3 Dipôles Élémentaires : Résistance, Bobine et Condensateur</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. RÉSISTANCE PURE R */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                    1. Résistance (R)
                  </span>
                  <span className="text-xs font-mono font-bold text-rose-300"><LatexMath math="\phi = 0" /></span>
                </div>

                {/* SVG Schema R */}
                <div className="p-2 rounded-xl bg-black/50 border border-slate-800 flex justify-center items-center py-3">
                  <svg viewBox="0 0 160 50" className="w-full max-w-[140px] h-auto">
                    <line x1="10" y1="25" x2="45" y2="25" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="115" y1="25" x2="150" y2="25" stroke="#94a3b8" strokeWidth="2" />
                    <rect x="45" y="12" width="70" height="26" rx="4" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="2" />
                    <text x="80" y="29" fill="#fda4af" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">R</text>
                  </svg>
                </div>

                {/* Formulas R */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-rose-300">
                    • <LatexMath math="\underline{Z}_R = R" />
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-rose-300">
                    • <LatexMath math="\underline{Y}_R = \frac{1}{R} = G" />
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-cyan-300">
                    • Module : <LatexMath math="|\underline{Z}_R| = R" />
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-amber-300">
                    • Phase : <LatexMath math="\phi = \arg(\underline{Z}_R) = 0" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug pt-1">
                Tension et courant sont <strong>strictement en phase</strong>. L&apos;impédance est indépendante de la pulsation <LatexMath math="\omega" />.
              </p>
            </div>

            {/* 2. BOBINE IDÉALE L */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                    2. Bobine Idéale (L)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300"><LatexMath math="\phi = +90^\circ" /></span>
                </div>

                {/* SVG Schema L (Inductor Loops) */}
                <div className="p-2 rounded-xl bg-black/50 border border-slate-800 flex justify-center items-center py-3">
                  <svg viewBox="0 0 160 50" className="w-full max-w-[140px] h-auto">
                    <line x1="10" y1="25" x2="35" y2="25" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="125" y1="25" x2="150" y2="25" stroke="#94a3b8" strokeWidth="2" />
                    {/* 4 Coil Arcs */}
                    <path d="M 35,25 A 11,11 0 0,1 57,25 A 11,11 0 0,1 79,25 A 11,11 0 0,1 101,25 A 11,11 0 0,1 123,25" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <text x="80" y="44" fill="#fcd34d" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">L</text>
                  </svg>
                </div>

                {/* Formulas L */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-amber-300">
                    • <LatexMath math="\underline{Z}_L = j L \omega = L\omega e^{j\frac{\pi}{2}}" />
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-amber-300">
                    • <LatexMath math="\underline{Y}_L = \frac{1}{j L \omega} = -j \frac{1}{L\omega}" />
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-cyan-300">
                    • Module : <LatexMath math="|\underline{Z}_L| = L\omega" />
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-amber-300">
                    • Phase : <LatexMath math="\phi = +\frac{\pi}{2} (+90^\circ)" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug pt-1">
                La tension est <strong>en avance de 90°</strong> sur le courant. Fil parfait en continu (<LatexMath math="\omega \to 0" />) et interrupteur ouvert en HF (<LatexMath math="\omega \to \infty" />).
              </p>
            </div>

            {/* 3. CONDENSATEUR IDÉAL C */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                    3. Condensateur (C)
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300"><LatexMath math="\phi = -90^\circ" /></span>
                </div>

                {/* SVG Schema C (Capacitor Plates) */}
                <div className="p-2 rounded-xl bg-black/50 border border-slate-800 flex justify-center items-center py-3">
                  <svg viewBox="0 0 160 50" className="w-full max-w-[140px] h-auto">
                    <line x1="10" y1="25" x2="68" y2="25" stroke="#94a3b8" strokeWidth="2" />
                    <line x1="92" y1="25" x2="150" y2="25" stroke="#94a3b8" strokeWidth="2" />
                    {/* Parallel Plates */}
                    <line x1="68" y1="10" x2="68" y2="40" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                    <line x1="92" y1="10" x2="92" y2="40" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                    <text x="80" y="47" fill="#67e8f9" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">C</text>
                  </svg>
                </div>

                {/* Formulas C */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-cyan-300">
                    • <LatexMath math="\underline{Z}_C = \frac{1}{j C \omega} = -j \frac{1}{C\omega}" />
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-cyan-300">
                    • <LatexMath math="\underline{Y}_C = j C \omega = C\omega e^{j\frac{\pi}{2}}" />
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-cyan-300">
                    • Module : <LatexMath math="|\underline{Z}_C| = \frac{1}{C\omega}" />
                  </div>
                  <div className="p-1.5 rounded bg-black/40 border border-slate-800 text-amber-300">
                    • Phase : <LatexMath math="\phi = -\frac{\pi}{2} (-90^\circ)" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug pt-1">
                La tension est <strong>en retard de 90°</strong> sur le courant. Interrupteur ouvert en continu (<LatexMath math="\omega \to 0" />) et court-circuit en HF (<LatexMath math="\omega \to \infty" />).
              </p>
            </div>

          </div>
        </div>

        {/* 2.3 Modèles Réels : Bobine Réelle et Condensateur à Pertes avec Schémas SVG (Dans un volet déroulant interactif) */}
        <CollapsibleProof
          title="2.3 Modèles Réels : Bobine Réelle et Condensateur à Pertes Diélectriques"
          subtitle="Schémas SVG, impédance complexe, admittance, module, déphasage et comportements BF/HF"
          color="amber"
          badge="Électronique Pratique & Modélisation"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            
            {/* 1. BOBINE RÉELLE (Modèle Série r + L) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                    1. Bobine Réelle (Modèle Série r + L)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    <LatexMath math="0 < \phi < +90^\circ" />
                  </span>
                </div>

                {/* SVG Schematic Real Inductor */}
                <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 flex justify-center items-center shadow-inner">
                  <svg viewBox="0 0 320 90" className="w-full max-w-[280px] h-auto font-sans">
                    {/* Wires */}
                    <line x1="20" y1="40" x2="60" y2="40" stroke="#94a3b8" strokeWidth="2.2" />
                    <line x1="120" y1="40" x2="160" y2="40" stroke="#94a3b8" strokeWidth="2.2" />
                    <line x1="240" y1="40" x2="300" y2="40" stroke="#94a3b8" strokeWidth="2.2" />

                    {/* Terminals */}
                    <circle cx="20" cy="40" r="3.5" fill="#38bdf8" />
                    <circle cx="300" cy="40" r="3.5" fill="#38bdf8" />
                    <text x="14" y="30" fill="#38bdf8" fontSize="11" fontWeight="bold">A</text>
                    <text x="302" y="30" fill="#38bdf8" fontSize="11" fontWeight="bold">B</text>

                    {/* Resistor r box */}
                    <rect x="60" y="27" width="60" height="26" rx="4" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="2" />
                    <text x="90" y="44" fill="#fda4af" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">r</text>

                    {/* Coil L (3 loops) */}
                    <path d="M 160,40 A 13,13 0 0,1 186,40 A 13,13 0 0,1 212,40 A 13,13 0 0,1 238,40" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                    <text x="200" y="62" fill="#fcd34d" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">L</text>

                    {/* Current Arrow i */}
                    <line x1="30" y1="20" x2="55" y2="20" stroke="#06b6d4" strokeWidth="1.8" />
                    <polygon points="55,20 49,17 49,23" fill="#06b6d4" />
                    <text x="42" y="14" fill="#06b6d4" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">i(t)</text>

                    {/* Voltage Arrow u */}
                    <line x1="285" y1="78" x2="35" y2="78" stroke="#ec4899" strokeWidth="1.8" />
                    <polygon points="35,78 41,75 41,81" fill="#ec4899" />
                    <text x="160" y="88" fill="#ec4899" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">u(t)</text>
                  </svg>
                </div>

                {/* Mathematical Derivations */}
                <div className="space-y-2 font-mono text-xs text-slate-200">
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-amber-400 font-sans font-bold block">• Impédance Complexe :</span>
                    <LatexMath math="\underline{Z} = r + j L \omega" />
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-cyan-400 font-sans font-bold block">• Admittance Complexe :</span>
                    <LatexMath math="\underline{Y} = \frac{1}{r + j L \omega} = \frac{r - j L \omega}{r^2 + L^2 \omega^2}" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-emerald-400 font-sans font-bold block">• Module :</span>
                      <LatexMath math="|\underline{Z}| = \sqrt{r^2 + L^2\omega^2}" />
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-amber-400 font-sans font-bold block">• Phase :</span>
                      <LatexMath math="\tan\phi = \frac{L\omega}{r}" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Behavior limits */}
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11.5px] text-slate-300 space-y-1">
                <p>• <strong>En Continu (<LatexMath math="\omega \to 0" />) :</strong> <LatexMath math="\underline{Z} = r" /> (résistance pure du fil de cuivre).</p>
                <p>• <strong>En Haute Fréquence (<LatexMath math="\omega \to \infty" />) :</strong> <LatexMath math="|\underline{Z}| \to \infty" /> et <LatexMath math="\phi \to +90^\circ" /> (circuit ouvert inductif).</p>
              </div>
            </div>

            {/* 2. CONDENSATEUR AVEC PERTES (Modèle Parallèle Rp || C) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                    2. Condensateur avec Fuites (<LatexMath math="R_p \parallel C" />)
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    <LatexMath math="-90^\circ < \phi < 0" />
                  </span>
                </div>

                {/* SVG Schematic Lossy Capacitor */}
                <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 flex justify-center items-center shadow-inner">
                  <svg viewBox="0 0 320 110" className="w-full max-w-[280px] h-auto font-sans">
                    {/* Input wire */}
                    <line x1="20" y1="55" x2="70" y2="55" stroke="#94a3b8" strokeWidth="2.2" />
                    <circle cx="20" cy="55" r="3.5" fill="#38bdf8" />
                    <text x="14" y="45" fill="#38bdf8" fontSize="11" fontWeight="bold">A</text>

                    {/* Output wire */}
                    <line x1="250" y1="55" x2="300" y2="55" stroke="#94a3b8" strokeWidth="2.2" />
                    <circle cx="300" cy="55" r="3.5" fill="#38bdf8" />
                    <text x="302" y="45" fill="#38bdf8" fontSize="11" fontWeight="bold">B</text>

                    {/* Branching vertical wires */}
                    <line x1="70" y1="25" x2="70" y2="85" stroke="#94a3b8" strokeWidth="2.2" />
                    <line x1="250" y1="25" x2="250" y2="85" stroke="#94a3b8" strokeWidth="2.2" />

                    {/* Top branch: Resistor Rp */}
                    <line x1="70" y1="25" x2="110" y2="25" stroke="#94a3b8" strokeWidth="2.2" />
                    <line x1="210" y1="25" x2="250" y2="25" stroke="#94a3b8" strokeWidth="2.2" />
                    <rect x="110" y="14" width="100" height="22" rx="4" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="2" />
                    <text x="160" y="30" fill="#fda4af" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Rp (Fuites)</text>

                    {/* Bottom branch: Capacitor C */}
                    <line x1="70" y1="85" x2="145" y2="85" stroke="#94a3b8" strokeWidth="2.2" />
                    <line x1="175" y1="85" x2="250" y2="85" stroke="#94a3b8" strokeWidth="2.2" />
                    <line x1="145" y1="72" x2="145" y2="98" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                    <line x1="175" y1="72" x2="175" y2="98" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" />
                    <text x="160" y="106" fill="#67e8f9" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">C</text>

                    {/* Current Arrow i */}
                    <line x1="30" y1="35" x2="55" y2="35" stroke="#06b6d4" strokeWidth="1.8" />
                    <polygon points="55,35 49,32 49,38" fill="#06b6d4" />
                    <text x="42" y="27" fill="#06b6d4" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">i(t)</text>
                  </svg>
                </div>

                {/* Mathematical Derivations */}
                <div className="space-y-2 font-mono text-xs text-slate-200">
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-cyan-400 font-sans font-bold block">• Admittance Parallèle :</span>
                    <LatexMath math="\underline{Y} = \frac{1}{R_p} + j C \omega" />
                  </div>
                  <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                    <span className="text-emerald-400 font-sans font-bold block">• Impédance Complexe :</span>
                    <LatexMath math="\underline{Z} = \frac{R_p}{1 + j R_p C \omega} = \frac{R_p(1 - j R_p C \omega)}{1 + R_p^2 C^2 \omega^2}" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-cyan-400 font-sans font-bold block">• Module :</span>
                      <LatexMath math="|\underline{Z}| = \frac{R_p}{\sqrt{1 + R_p^2 C^2 \omega^2}}" />
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-slate-800">
                      <span className="text-amber-400 font-sans font-bold block">• Phase :</span>
                      <LatexMath math="\tan\phi = -R_p C \omega" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Behavior limits */}
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11.5px] text-slate-300 space-y-1">
                <p>• <strong>En Continu (<LatexMath math="\omega \to 0" />) :</strong> <LatexMath math="\underline{Z} = R_p" /> (résistance de fuite d&apos;isolement du diélectrique).</p>
                <p>• <strong>En Haute Fréquence (<LatexMath math="\omega \to \infty" />) :</strong> <LatexMath math="\underline{Z} \to 0" /> et <LatexMath math="\phi \to -90^\circ" /> (court-circuit capacitif).</p>
              </div>
            </div>

          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 3: LOIS DE KIRCHHOFF, DIVISEURS & THÉORÈMES COMPLEXES (ILLUSTRÉE SVG) ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider block">Partie 3 • Résolution Algébrique des Réseaux</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              3. Lois de Kirchhoff, Ponts Diviseurs & Théorème de Millman Complexe
            </h2>
          </div>
        </div>

        {/* 3.1 Pourquoi les Lois de Kirchhoff restent-elles valables en RSF ? */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>3.1 Pourquoi les Lois de Kirchhoff s&apos;appliquent-elles en Notation Complexe ?</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dans le cadre de l&apos;<strong>ARQS</strong> (Approximation des Régimes Quasi-Stationnaires), la loi des nœuds temporelle s&apos;écrit <LatexMath math="\sum i_k(t) = 0" /> et la loi des mailles s&apos;écrit <LatexMath math="\sum u_k(t) = 0" />.
            <br />
            En passant en notation complexe avec <LatexMath math="\underline{s}_k(t) = \underline{S}_k e^{j\omega t}" />, le facteur commun <LatexMath math="e^{j\omega t}" /> se simplifie de part et d&apos;autre :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold font-mono block">1. Loi des Nœuds Complexe :</span>
              <div className="p-2 rounded bg-slate-900 text-center font-mono text-cyan-300 font-bold">
                <LatexMath math="\sum_{k} \underline{I}_k = 0 \iff \sum \underline{I}_{\text{entrants}} = \sum \underline{I}_{\text{sortants}}" />
              </div>
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold font-mono block">2. Loi des Mailles Complexe :</span>
              <div className="p-2 rounded bg-slate-900 text-center font-mono text-amber-300 font-bold">
                <LatexMath math="\sum_{k} \underline{U}_k = 0" />
              </div>
            </div>
          </div>
        </div>

        {/* 3.2 Ponts Diviseurs de Tension et de Courant (avec Schémas SVG) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>3.2 Ponts Diviseurs de Tension & de Courant en Notation Complexe</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            
            {/* Pont Diviseur de Tension (Série) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                    Pont Diviseur de Tension (Série)
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    <LatexMath math="\underline{Z}_1 + \underline{Z}_2" />
                  </span>
                </div>

                {/* SVG Schema Voltage Divider (Fully connected closed loop) */}
                <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 flex justify-center items-center shadow-inner">
                  <svg viewBox="0 0 320 165" className="w-full max-w-[290px] h-auto font-sans">
                    {/* Closed Circuit Wires */}
                    <line x1="50" y1="25" x2="165" y2="25" stroke="#94a3b8" strokeWidth="2.2" />
                    <line x1="50" y1="140" x2="165" y2="140" stroke="#94a3b8" strokeWidth="2.2" />
                    <line x1="50" y1="25" x2="50" y2="67" stroke="#94a3b8" strokeWidth="2.2" />
                    <line x1="50" y1="97" x2="50" y2="140" stroke="#94a3b8" strokeWidth="2.2" />

                    {/* AC Generator Circle (E) */}
                    <circle cx="50" cy="82" r="16" fill="#0f172a" stroke="#f43f5e" strokeWidth="2.2" />
                    {/* AC Sine wave symbol inside generator */}
                    <path d="M 42,82 Q 46,74 50,82 T 58,82" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                    <text x="24" y="86" fill="#f43f5e" fontSize="13" fontWeight="bold" textAnchor="end" fontFamily="monospace">E</text>

                    {/* Input current arrow I on top wire */}
                    <line x1="90" y1="18" x2="115" y2="18" stroke="#38bdf8" strokeWidth="1.8" />
                    <polygon points="115,18 109,15 109,21" fill="#38bdf8" />
                    <text x="102" y="12" fill="#38bdf8" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">i(t)</text>

                    {/* Vertical Series Branch with Z1 and Z2 */}
                    <line x1="165" y1="25" x2="165" y2="40" stroke="#94a3b8" strokeWidth="2.2" />
                    <rect x="135" y="40" width="60" height="28" rx="5" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                    <text x="165" y="58" fill="#67e8f9" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Z1</text>

                    <line x1="165" y1="68" x2="165" y2="85" stroke="#94a3b8" strokeWidth="2.2" />
                    <rect x="135" y="85" width="60" height="28" rx="5" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="165" y="103" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Z2</text>

                    <line x1="165" y1="113" x2="165" y2="140" stroke="#94a3b8" strokeWidth="2.2" />

                    {/* Node dots */}
                    <circle cx="165" cy="76" r="3.5" fill="#10b981" />
                    <circle cx="165" cy="140" r="3.5" fill="#10b981" />

                    {/* Output Taps (Us across Z2) */}
                    <line x1="165" y1="76" x2="235" y2="76" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="3 2" />
                    <line x1="165" y1="140" x2="235" y2="140" stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="3 2" />

                    <circle cx="235" cy="76" r="3.5" fill="#38bdf8" />
                    <circle cx="235" cy="140" r="3.5" fill="#38bdf8" />
                    <text x="244" y="80" fill="#38bdf8" fontSize="11" fontWeight="bold">M</text>
                    <text x="244" y="144" fill="#38bdf8" fontSize="11" fontWeight="bold">N</text>

                    {/* Output Voltage Us Arrow */}
                    <line x1="268" y1="135" x2="268" y2="82" stroke="#10b981" strokeWidth="2" />
                    <polygon points="268,82 264,90 272,90" fill="#10b981" />
                    <text x="282" y="112" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="start" fontFamily="monospace">Us</text>
                  </svg>
                </div>

                {/* Formula */}
                <div className="p-3 rounded-xl bg-black/60 border border-cyan-500/30 text-center font-mono text-cyan-300 font-bold text-xs sm:text-sm shadow-inner">
                  <LatexMath math="\underline{U}_s = \frac{\underline{Z}_2}{\underline{Z}_1 + \underline{Z}_2} \cdot \underline{E}" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11.5px] text-slate-300 space-y-1">
                <span className="text-cyan-400 font-bold block font-mono">Exemple Filtre RC Passe-Bas :</span>
                <p>Si <LatexMath math="\underline{Z}_1 = R" /> et <LatexMath math="\underline{Z}_2 = \frac{1}{jC\omega}" /> :</p>
                <div className="p-1 rounded bg-black/40 text-center text-cyan-300 font-mono text-xs">
                  <LatexMath math="\underline{H}(j\omega) = \frac{\underline{U}_s}{\underline{E}} = \frac{1}{1 + j R C \omega}" />
                </div>
              </div>
            </div>

            {/* Pont Diviseur de Courant (Parallèle) */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/30">
                    Pont Diviseur de Courant (Parallèle)
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    <LatexMath math="\underline{Y}_1 + \underline{Y}_2" />
                  </span>
                </div>

                {/* SVG Schema Current Divider (Symmetrical parallel branches) */}
                <div className="p-3 rounded-2xl bg-black/60 border border-slate-800 flex justify-center items-center shadow-inner">
                  <svg viewBox="0 0 320 165" className="w-full max-w-[290px] h-auto font-sans">
                    {/* Input wire */}
                    <line x1="15" y1="82" x2="70" y2="82" stroke="#94a3b8" strokeWidth="2.2" />
                    <circle cx="15" cy="82" r="3.5" fill="#38bdf8" />

                    {/* Total Current Arrow */}
                    <line x1="28" y1="72" x2="55" y2="72" stroke="#38bdf8" strokeWidth="1.8" />
                    <polygon points="55,72 49,69 49,75" fill="#38bdf8" />
                    <text x="41" y="64" fill="#38bdf8" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Itot</text>

                    {/* Node A */}
                    <circle cx="70" cy="82" r="4" fill="#6366f1" />
                    <text x="62" y="97" fill="#a5b4fc" fontSize="11" fontWeight="bold" fontFamily="monospace">A</text>

                    {/* Branching vertical lines */}
                    <line x1="70" y1="42" x2="70" y2="122" stroke="#94a3b8" strokeWidth="2.2" />

                    {/* Top Branch Z1 */}
                    <line x1="70" y1="42" x2="110" y2="42" stroke="#94a3b8" strokeWidth="2.2" />
                    <rect x="110" y="27" width="70" height="30" rx="5" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
                    <text x="145" y="46" fill="#a5b4fc" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Z1 (Y1)</text>
                    <line x1="180" y1="42" x2="220" y2="42" stroke="#94a3b8" strokeWidth="2.2" />

                    {/* Current I1 arrow */}
                    <line x1="80" y1="33" x2="102" y2="33" stroke="#6366f1" strokeWidth="1.8" />
                    <polygon points="102,33 96,30 96,36" fill="#6366f1" />
                    <text x="91" y="25" fill="#6366f1" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">I1</text>

                    {/* Bottom Branch Z2 */}
                    <line x1="70" y1="122" x2="110" y2="122" stroke="#94a3b8" strokeWidth="2.2" />
                    <rect x="110" y="107" width="70" height="30" rx="5" fill="#0f172a" stroke="#ec4899" strokeWidth="2" />
                    <text x="145" y="126" fill="#f472b6" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Z2 (Y2)</text>
                    <line x1="180" y1="122" x2="220" y2="122" stroke="#94a3b8" strokeWidth="2.2" />

                    {/* Current I2 arrow */}
                    <line x1="80" y1="113" x2="102" y2="113" stroke="#ec4899" strokeWidth="1.8" />
                    <polygon points="102,113 96,110 96,116" fill="#ec4899" />
                    <text x="91" y="105" fill="#ec4899" fontSize="10.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">I2</text>

                    {/* Recombining vertical line & Node B */}
                    <line x1="220" y1="42" x2="220" y2="122" stroke="#94a3b8" strokeWidth="2.2" />
                    <circle cx="220" cy="82" r="4" fill="#6366f1" />
                    <text x="228" y="97" fill="#a5b4fc" fontSize="11" fontWeight="bold" fontFamily="monospace">B</text>

                    {/* Output wire */}
                    <line x1="220" y1="82" x2="285" y2="82" stroke="#94a3b8" strokeWidth="2.2" />
                    <circle cx="285" cy="82" r="3.5" fill="#38bdf8" />

                    {/* Voltage U Arrow between B and A at bottom */}
                    <line x1="210" y1="152" x2="80" y2="152" stroke="#e2e8f0" strokeWidth="1.8" />
                    <polygon points="80,152 87,148 87,156" fill="#e2e8f0" />
                    <text x="145" y="163" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">u(t)</text>
                  </svg>
                </div>

                {/* Formula */}
                <div className="p-3 rounded-xl bg-black/60 border border-indigo-500/30 text-center font-mono text-indigo-300 font-bold text-xs sm:text-sm shadow-inner">
                  <LatexMath math="\underline{I}_1 = \frac{\underline{Y}_1}{\underline{Y}_1 + \underline{Y}_2} \cdot \underline{I}_{\text{tot}} = \frac{\underline{Z}_2}{\underline{Z}_1 + \underline{Z}_2} \cdot \underline{I}_{\text{tot}}" />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11.5px] text-slate-300 space-y-1">
                <span className="text-indigo-400 font-bold block font-mono">Règle des Admittances :</span>
                <p>Le courant dans une branche est proportionnel à son <strong>admittance propre</strong> <LatexMath math="\underline{Y}_1" /> (facilité de passage du courant).</p>
              </div>
            </div>

          </div>
        </div>

        {/* 3.3 Théorème de Millman Complexe (Schéma SVG + Démonstration Pas-à-Pas) */}
        <CollapsibleProof
          title="3.3 Théorème de Millman en Notation Complexe (Démonstration & Schéma SVG)"
          subtitle="Détermination instantanée du potentiel complexe d'un nœud sans poser de système d'équations"
          color="emerald"
          badge="Outil Fondamental Concours CPGE"
        >
          <div className="space-y-4 text-slate-300 font-sans text-xs sm:text-sm leading-relaxed">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              {/* SVG Millman Node Diagram */}
              <div className="lg:col-span-5 p-3 rounded-2xl bg-black/60 border border-slate-800 flex justify-center items-center shadow-inner">
                <svg viewBox="0 0 300 180" className="w-full max-w-[270px] h-auto font-sans">
                  {/* Central Node A */}
                  <circle cx="150" cy="90" r="6" fill="#10b981" stroke="#34d399" strokeWidth="2" />
                  <text x="150" y="112" fill="#34d399" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">VA</text>

                  {/* Branch 1: to V1 */}
                  <line x1="40" y1="35" x2="150" y2="90" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="40" cy="35" r="4" fill="#38bdf8" />
                  <text x="28" y="28" fill="#38bdf8" fontSize="11" fontWeight="bold" fontFamily="monospace">V1</text>
                  <rect x="75" y="46" width="38" height="20" rx="3" fill="#0f172a" stroke="#06b6d4" strokeWidth="1.8" />
                  <text x="94" y="60" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Z1</text>

                  {/* Branch 2: to V2 */}
                  <line x1="40" y1="145" x2="150" y2="90" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="40" cy="145" r="4" fill="#f59e0b" />
                  <text x="28" y="158" fill="#f59e0b" fontSize="11" fontWeight="bold" fontFamily="monospace">V2</text>
                  <rect x="75" y="114" width="38" height="20" rx="3" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.8" />
                  <text x="94" y="128" fill="#fcd34d" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Z2</text>

                  {/* Branch 3: to V3 */}
                  <line x1="260" y1="35" x2="150" y2="90" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="260" cy="35" r="4" fill="#a855f7" />
                  <text x="270" y="32" fill="#a855f7" fontSize="11" fontWeight="bold" fontFamily="monospace">V3</text>
                  <rect x="187" y="46" width="38" height="20" rx="3" fill="#0f172a" stroke="#a855f7" strokeWidth="1.8" />
                  <text x="206" y="60" fill="#d8b4fe" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Z3</text>

                  {/* Current Source eta entering */}
                  <line x1="260" y1="145" x2="150" y2="90" stroke="#ec4899" strokeWidth="2" strokeDasharray="4 3" />
                  <polygon points="186,108 196,114 191,121" fill="#ec4899" />
                  <text x="240" y="155" fill="#ec4899" fontSize="11" fontWeight="bold" fontFamily="monospace">η</text>
                </svg>
              </div>

              {/* Master Formula */}
              <div className="lg:col-span-7 space-y-2">
                <span className="text-emerald-400 font-bold uppercase block text-xs tracking-wider">Formule Canonique de Millman en RSF :</span>
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-center font-mono font-bold text-sm sm:text-base shadow-inner">
                  <LatexMath math="\underline{V}_A = \frac{\sum_{k=1}^n \underline{Y}_k \underline{V}_k + \sum_{j=1}^p \underline{\eta}_j}{\sum_{k=1}^n \underline{Y}_k} = \frac{\sum_{k=1}^n \frac{\underline{V}_k}{\underline{Z}_k} + \sum_{j=1}^p \underline{\eta}_j}{\sum_{k=1}^n \frac{1}{\underline{Z}_k}}" />
                </div>
              </div>
            </div>

            {/* Step-by-Step Proof */}
            <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-2 text-xs">
              <span className="text-amber-400 font-bold font-sans block uppercase">Démonstration Pas-à-Pas :</span>
              <p>
                1. On applique la loi des nœuds complexe au nœud A en sommant les courants issus des différentes branches et les générateurs de courant :
              </p>
              <div className="p-2 rounded bg-slate-900 text-center font-mono text-cyan-300">
                <LatexMath math="\sum_{k=1}^n \underline{I}_k + \sum_{j=1}^p \underline{\eta}_j = 0" />
              </div>
              <p>
                2. D&apos;après la loi d&apos;Ohm complexe, le courant entrant dans le nœud A depuis le potentiel <LatexMath math="\underline{V}_k" /> à travers l&apos;impédance <LatexMath math="\underline{Z}_k" /> s&apos;écrit :
              </p>
              <div className="p-2 rounded bg-slate-900 text-center font-mono text-cyan-300">
                <LatexMath math="\underline{I}_k = \frac{\underline{V}_k - \underline{V}_A}{\underline{Z}_k} = \underline{Y}_k (\underline{V}_k - \underline{V}_A)" />
              </div>
              <p>
                3. En réinjectant dans la loi des nœuds :
              </p>
              <div className="p-2 rounded bg-slate-900 text-center font-mono text-amber-300">
                <LatexMath math="\sum_{k=1}^n \underline{Y}_k \underline{V}_k - \underline{V}_A \sum_{k=1}^n \underline{Y}_k + \sum_{j=1}^p \underline{\eta}_j = 0" />
              </div>
              <p>
                4. En isolant <LatexMath math="\underline{V}_A" />, on retrouve instantanément la formule générale de Millman !
              </p>
            </div>
          </div>
        </CollapsibleProof>

        {/* 3.4 Modèles de Thévenin et Norton Complexes */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>3.4 Théorèmes de Thévenin & Norton en Régime Sinusoïdal Forcé</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tout réseau linéaire actif vu entre deux bornes A et B est équivalent à :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold block">1. Générateur de Thévenin Complexe :</span>
              <p className="text-slate-300">• F.é.m. complexe <LatexMath math="\underline{E}_{\text{th}} = \underline{U}_{AB0}" /> (tension à vide).</p>
              <p className="text-slate-300">• Impédance <LatexMath math="\underline{Z}_{\text{th}}" /> (impédance d&apos;entrée, sources éteintes).</p>
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-slate-800 space-y-1">
              <span className="text-indigo-400 font-bold block">2. Générateur de Norton Complexe :</span>
              <p className="text-slate-300">• Courant de court-circuit <LatexMath math="\underline{I}_N = \underline{I}_{cc}" />.</p>
              <p className="text-slate-300">• Relation de passage : <LatexMath math="\underline{E}_{\text{th}} = \underline{Z}_{\text{th}} \cdot \underline{I}_N" />.</p>
            </div>
          </div>
        </div>

      </section>

      {/* ── PARTIE 4: PUISSANCES EN RSF & THÉORÈME DE BOUCHEROT (ILLUSTRÉE SVG) ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-7">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-rose-400 uppercase font-bold tracking-wider block">Partie 4 • Bilan Énergétique & Puissances</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              4. Puissances en Régime Sinusoïdal Forcé & Théorème de Boucherot
            </h2>
          </div>
        </div>

        {/* 4.1 De la Puissance Instantanée aux 4 Puissances */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-rose-500/30 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 text-rose-300 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>4.1 Décomposition Fondamentale de la Puissance Instantanée <LatexMath math="p(t)" /></span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Soit un dipôle soumis à une tension <LatexMath math="u(t) = U_{\text{eff}} \sqrt{2} \cos(\omega t + \phi_u)" /> traversé par un courant <LatexMath math="i(t) = I_{\text{eff}} \sqrt{2} \cos(\omega t + \phi_i)" /> avec un déphasage <LatexMath math="\phi = \phi_u - \phi_i" /> :
          </p>

          <div className="p-4 rounded-xl bg-black/70 border border-slate-800 text-center font-mono text-xs sm:text-sm text-slate-200 shadow-inner overflow-x-auto">
            <LatexMath math="p(t) = u(t) \cdot i(t) = \underbrace{U_{\text{eff}} I_{\text{eff}} \cos\phi}_{\text{Puissance Active (Moyenne) } P} \cdot \left[1 + \cos(2\omega t + \dots)\right] - \underbrace{U_{\text{eff}} I_{\text{eff}} \sin\phi}_{\text{Puissance Réactive } Q} \cdot \sin(2\omega t + \dots)" />
          </div>

          {/* Grille des 4 Puissances (2x2 Spacieuse pour Éviter Tout Retour à la Ligne) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* 1. Active */}
            <div className="p-5 rounded-2xl bg-slate-900/95 border border-emerald-500/35 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                    1. Puissance Active (P)
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-300">Unité : Watts [W]</span>
                </div>
                <div className="p-3 rounded-xl bg-black/70 text-center font-mono text-emerald-300 font-bold text-sm sm:text-base border border-emerald-500/25 shadow-inner">
                  <LatexMath math="P = U_{\text{eff}} I_{\text{eff}} \cos\phi" />
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                C&apos;est la <strong>seule puissance physiquement transformée</strong> en travail utile (force mécanique d&apos;un moteur, chaleur par effet Joule, lumière). Pour tout dipôle passif récepteur, <LatexMath math="P \ge 0" />.
              </p>
            </div>

            {/* 2. Réactive */}
            <div className="p-5 rounded-2xl bg-slate-900/95 border border-amber-500/35 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold border border-amber-500/30">
                    2. Puissance Réactive (Q)
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">Unité : [VAR]</span>
                </div>
                <div className="p-3 rounded-xl bg-black/70 text-center font-mono text-amber-300 font-bold text-sm sm:text-base border border-amber-500/25 shadow-inner">
                  <LatexMath math="Q = U_{\text{eff}} I_{\text{eff}} \sin\phi" />
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Énergie <strong>oscillante périodique</strong> échangée sans travail utile : <LatexMath math="Q > 0" /> pour les bobines (magnétisation) et <LatexMath math="Q < 0" /> pour les condensateurs (fourniture de réactif).
              </p>
            </div>

            {/* 3. Apparente */}
            <div className="p-5 rounded-2xl bg-slate-900/95 border border-cyan-500/35 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30">
                    3. Puissance Apparente (S)
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-300">Unité : [VA]</span>
                </div>
                <div className="p-3 rounded-xl bg-black/70 text-center font-mono text-cyan-300 font-bold text-sm sm:text-base border border-cyan-500/25 shadow-inner">
                  <LatexMath math="S = U_{\text{eff}} I_{\text{eff}} = \sqrt{P^2 + Q^2}" />
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Représente le <strong>calibre électrique total</strong>. Elle sert à dimensionner les transformateurs, les générateurs et la section minimale des câbles de transport.
              </p>
            </div>

            {/* 4. Complexe */}
            <div className="p-5 rounded-2xl bg-slate-900/95 border border-purple-500/35 space-y-3 shadow-md flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-bold border border-purple-500/30">
                    4. Puissance Complexe (<LatexMath math="\underline{S}" />)
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-300">Unité : [VA]</span>
                </div>
                <div className="p-3 rounded-xl bg-black/70 text-center font-mono text-purple-300 font-bold text-sm sm:text-base border border-purple-500/25 shadow-inner">
                  <LatexMath math="\underline{S} = \underline{U}_{\text{eff}} \cdot \underline{I}_{\text{eff}}^* = P + j Q" />
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Outil algébrique puissant qui regroupe <LatexMath math="P" /> et <LatexMath math="Q" /> : <LatexMath math="\underline{S} = \underline{Z} I_{\text{eff}}^2 = \underline{Y}^* U_{\text{eff}}^2" />.
              </p>
            </div>
          </div>
        </div>

        {/* 4.2 Le Triangle des Puissances (Schéma Large SVG et Bilan des Dipôles) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>4.2 Le Triangle des Puissances & Bilan Énergétique des Dipôles R, L, C</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* SVG Triangle des Puissances (5 Cols - Large & Aéré avec Vraies Formules LaTeX) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-black/60 border border-slate-800 flex flex-col items-center justify-center shadow-inner space-y-3">
              <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider text-center">
                Triangle Géométrique des Puissances
              </span>
              
              <svg viewBox="0 0 380 230" className="w-full max-w-[350px] h-auto font-sans overflow-visible">
                {/* Horizontal side P (Active) */}
                <line x1="45" y1="165" x2="255" y2="165" stroke="#10b981" strokeWidth="3.5" />
                <polygon points="255,165 244,160 244,170" fill="#10b981" />

                {/* Vertical side Q (Reactive) */}
                <line x1="255" y1="165" x2="255" y2="35" stroke="#f59e0b" strokeWidth="3.5" />
                <polygon points="255,35 250,46 260,46" fill="#f59e0b" />

                {/* Hypotenuse S (Apparent) */}
                <line x1="45" y1="165" x2="255" y2="35" stroke="#06b6d4" strokeWidth="3.5" />
                <polygon points="255,35 243,40 250,48" fill="#06b6d4" />

                {/* Right angle marker */}
                <polyline points="238,165 238,148 255,148" fill="none" stroke="#94a3b8" strokeWidth="1.8" />

                {/* Angle arc phi */}
                <path d="M 100,165 A 55,55 0 0,0 90,135" fill="none" stroke="#e2e8f0" strokeWidth="2" />

                {/* Formules Mathématiques KaTeX via foreignObject */}
                {/* Angle phi */}
                <foreignObject x="100" y="138" width="30" height="30">
                  <div className="text-slate-100 font-bold text-sm">
                    <LatexMath math="\phi" />
                  </div>
                </foreignObject>

                {/* P (Bottom) */}
                <foreignObject x="45" y="172" width="210" height="35">
                  <div className="flex items-center justify-center text-emerald-300 text-xs sm:text-sm font-bold">
                    <LatexMath math="P = S \cos\phi \quad [\text{W}]" />
                  </div>
                </foreignObject>

                {/* Q (Right) */}
                <foreignObject x="265" y="75" width="115" height="55">
                  <div className="flex flex-col justify-center text-amber-300 text-xs sm:text-sm font-bold leading-tight">
                    <LatexMath math="Q = S \sin\phi" />
                    <span className="text-[10.5px] text-amber-400 font-mono mt-0.5">[VAR]</span>
                  </div>
                </foreignObject>

                {/* S (Hypotenuse) */}
                <foreignObject x="30" y="60" width="185" height="40">
                  <div className="flex items-center justify-center text-cyan-300 text-xs sm:text-sm font-bold">
                    <LatexMath math="S = \sqrt{P^2 + Q^2} \quad [\text{VA}]" />
                  </div>
                </foreignObject>
              </svg>

              <div className="w-full p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center font-mono text-xs text-slate-300">
                <span className="text-cyan-400 font-bold">Facteur de Puissance :</span> <LatexMath math="k = \cos\phi = \frac{P}{S} = \frac{P}{\sqrt{P^2 + Q^2}}" />
              </div>
            </div>

            {/* Cartes Spacieuses des 3 Dipôles R, L, C (7 Cols) */}
            <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
              
              {/* 1. Résistance R */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-rose-400 block uppercase">1. Résistance Pure (R)</span>
                  <p className="text-xs text-slate-300">Toute l&apos;énergie électrique est dissipée irréversiblement en chaleur Joule (<LatexMath math="\phi = 0 \implies \cos\phi = 1" />).</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                    <LatexMath math="P = R I_{\text{eff}}^2" />
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                    <LatexMath math="Q = 0" />
                  </span>
                </div>
              </div>

              {/* 2. Bobine L */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-400 block uppercase">2. Bobine Idéale (L)</span>
                  <p className="text-xs text-slate-300"><strong>Consomme</strong> du réactif pour créer son champ magnétique (<LatexMath math="\phi = +90^\circ" />).</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                    <LatexMath math="P = 0" />
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                    <LatexMath math="Q = +L\omega I_{\text{eff}}^2" />
                  </span>
                </div>
              </div>

              {/* 3. Condensateur C */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-cyan-400 block uppercase">3. Condensateur Idéal (C)</span>
                  <p className="text-xs text-slate-300"><strong>Fournit</strong> du réactif au réseau électrique (<LatexMath math="\phi = -90^\circ" />).</p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                    <LatexMath math="P = 0" />
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                    <LatexMath math="Q = -C\omega U_{\text{eff}}^2" />
                  </span>
                </div>
              </div>

              {/* Règle d'or */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                <p>
                  <strong>Règle Fondamentale :</strong> Une bobine <em>consomme</em> du réactif (<LatexMath math="Q > 0" />) alors qu&apos;un condensateur <em>génère</em> du réactif (<LatexMath math="Q < 0" />).
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* 4.3 Théorème de Boucherot & Relèvement du Facteur de Puissance (Schéma SVG Spacieux + Démonstration) */}
        <CollapsibleProof
          title="4.3 Théorème de Boucherot & Relèvement du Facteur de Puissance (Application Industrielle)"
          subtitle="Démonstration complète du calcul de la capacité C pour optimiser une usine et supprimer les pénalités"
          color="amber"
          badge="Application Industrielle Majeure"
        >
          <div className="space-y-5 text-slate-300 font-sans text-xs sm:text-sm leading-relaxed pt-2">
            
            {/* Théorème de Boucherot Enoncé */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-2.5 shadow-md">
              <span className="text-amber-400 font-bold uppercase text-xs tracking-wider block">
                Énoncé du Théorème de Boucherot (Conservation de l&apos;Énergie) :
              </span>
              <p className="text-xs sm:text-sm text-slate-300">
                Dans tout réseau électrique linéaire alimenté par des sources sinusoïdales à la même pulsation <LatexMath math="\omega" />, la puissance active totale et la puissance réactive totale sont <strong>les sommes algébriques directes</strong> :
              </p>
              <div className="p-3.5 rounded-xl bg-black/70 text-center font-mono font-bold text-amber-300 text-sm sm:text-base border border-slate-800">
                <LatexMath math="P_{\text{total}} = \sum_{k=1}^n P_k \quad \text{et} \quad Q_{\text{total}} = \sum_{k=1}^n Q_k \implies \underline{S}_{\text{total}} = \sum_{k=1}^n \underline{S}_k = P_{\text{total}} + j Q_{\text{total}}" />
              </div>
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                ⚠️ <strong>Piège Classique :</strong> La puissance apparente ne se conserve <strong>JAMAIS</strong> directement : <LatexMath math="S_{\text{total}} = \sqrt{P_{\text{total}}^2 + Q_{\text{total}}^2} \le \sum S_k" />.
              </div>
            </div>

            {/* Relèvement du Cos phi : Schéma SVG Aéré + Démonstration */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              
              {/* SVG Industrial Power Factor Correction (Spacieux - 420x190 avec Vraies Formules LaTeX) */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-black/60 border border-slate-800 flex flex-col items-center justify-center shadow-inner space-y-2">
                <span className="text-[11px] font-mono text-slate-400 font-bold text-center">
                  Raccordement Usine + Batterie de Condensateurs C :
                </span>
                
                <svg viewBox="0 0 420 190" className="w-full max-w-[380px] h-auto font-sans overflow-visible">
                  {/* Grid AC Supply Terminals */}
                  <circle cx="45" cy="50" r="4" fill="#38bdf8" />
                  <circle cx="45" cy="140" r="4" fill="#38bdf8" />
                  <text x="45" y="32" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Ligne</text>
                  <text x="45" y="162" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">Neutre</text>

                  {/* Supply Voltage Arrow Ueff */}
                  <line x1="45" y1="62" x2="45" y2="128" stroke="#f43f5e" strokeWidth="2" />
                  <polygon points="45,62 41,70 49,70" fill="#f43f5e" />
                  
                  <foreignObject x="5" y="78" width="38" height="35">
                    <div className="flex items-center justify-center text-rose-400 text-xs font-bold">
                      <LatexMath math="U_{\text{eff}}" />
                    </div>
                  </foreignObject>

                  {/* Horizontal Wires */}
                  <line x1="45" y1="50" x2="160" y2="50" stroke="#94a3b8" strokeWidth="2.2" />
                  <line x1="45" y1="140" x2="160" y2="140" stroke="#94a3b8" strokeWidth="2.2" />

                  {/* Nodes for Capacitor */}
                  <circle cx="160" cy="50" r="4" fill="#6366f1" />
                  <circle cx="160" cy="140" r="4" fill="#6366f1" />

                  {/* Branch 1: Capacitor C */}
                  <line x1="160" y1="50" x2="160" y2="80" stroke="#94a3b8" strokeWidth="2.2" />
                  <line x1="160" y1="110" x2="160" y2="140" stroke="#94a3b8" strokeWidth="2.2" />
                  {/* Capacitor Plates */}
                  <line x1="135" y1="80" x2="185" y2="80" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="135" y1="110" x2="185" y2="110" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
                  
                  <foreignObject x="190" y="80" width="30" height="30">
                    <div className="text-cyan-300 text-xs font-bold">
                      <LatexMath math="C" />
                    </div>
                  </foreignObject>
                  
                  <foreignObject x="95" y="148" width="130" height="35">
                    <div className="text-center text-cyan-300 text-[11px] font-bold">
                      <LatexMath math="Q_C = -C\omega U_{\text{eff}}^2" />
                    </div>
                  </foreignObject>

                  {/* Connecting Wires to Factory */}
                  <line x1="160" y1="50" x2="295" y2="50" stroke="#94a3b8" strokeWidth="2.2" />
                  <line x1="160" y1="140" x2="295" y2="140" stroke="#94a3b8" strokeWidth="2.2" />

                  {/* Factory Branch Box */}
                  <line x1="295" y1="50" x2="295" y2="65" stroke="#94a3b8" strokeWidth="2.2" />
                  <line x1="295" y1="125" x2="295" y2="140" stroke="#94a3b8" strokeWidth="2.2" />
                  <rect x="240" y="65" width="115" height="60" rx="8" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="2.2" />
                  
                  <foreignObject x="240" y="67" width="115" height="56">
                    <div className="flex flex-col items-center justify-center h-full text-center text-amber-300 space-y-0.5">
                      <span className="text-[11px] font-bold text-amber-200 font-sans">Usine</span>
                      <div className="text-[10px] font-bold">
                        <LatexMath math="P, \ Q_1 = P\tan\phi_1" />
                      </div>
                    </div>
                  </foreignObject>
                </svg>
              </div>

              {/* Mathematical Step-by-Step Derivation (7 Cols) */}
              <div className="lg:col-span-7 space-y-3 text-xs">
                <span className="text-amber-400 font-bold uppercase block text-xs tracking-wider">
                  Démonstration Rigoureuse du Calcul de la Capacité C :
                </span>
                
                <p className="text-slate-300 leading-relaxed">
                  1. <strong>Avant compensation :</strong> L&apos;usine absorbe la puissance active <LatexMath math="P" /> et une forte puissance réactive <LatexMath math="Q_1 = P \tan\phi_1" /> (moteurs asynchrones, transformateurs).
                </p>
                
                <p className="text-slate-300 leading-relaxed">
                  2. <strong>Raccordement du condensateur en parallèle :</strong> Le condensateur parfait ne consomme <em>aucune puissance active</em> (<LatexMath math="P_C = 0" />) et fournit la puissance réactive <LatexMath math="Q_C = -C\omega U_{\text{eff}}^2" />.
                </p>
                
                <p className="text-slate-300 leading-relaxed">
                  3. <strong>Application du Théorème de Boucherot :</strong>
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950 text-center font-mono text-cyan-300 border border-slate-800">
                  <LatexMath math="P_{\text{nouv}} = P \quad \text{et} \quad Q_{\text{nouv}} = Q_1 + Q_C = P \tan\phi_1 - C\omega U_{\text{eff}}^2" />
                </div>
                
                <p className="text-slate-300 leading-relaxed">
                  4. On impose le nouveau facteur de puissance désiré <LatexMath math="\cos\phi_2" /> (<LatexMath math="Q_{\text{nouv}} = P \tan\phi_2" />) :
                </p>
                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-center font-mono font-bold text-sm sm:text-base shadow-inner">
                  <LatexMath math="C = \frac{P(\tan\phi_1 - \tan\phi_2)}{\omega U_{\text{eff}}^2}" />
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11.5px] space-y-1">
                  <span className="font-bold block">✨ Intérêt Économique & Industriel :</span>
                  <p>
                    En augmentant <LatexMath math="\cos\phi" /> vers <LatexMath math="1" />, le courant de ligne diminue (<LatexMath math="I_{\text{eff}} = \frac{P}{U_{\text{eff}} \cos\phi}" />), ce qui divise par 2 à 4 les pertes par effet Joule <LatexMath math="P_{\text{Joule}} = r_{\text{ligne}} I_{\text{eff}}^2" /> et supprime les pénalités tarifaires des distributeurs d&apos;énergie.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </CollapsibleProof>

        {/* 4.4 Adaptation d'Impédance en Puissance (Théorème du Transfert Maximal) */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
            <Workflow className="w-4 h-4 text-purple-400" />
            <span>4.4 Adaptation d&apos;Impédance en Puissance (Transfert Maximal)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Pour qu&apos;un générateur d&apos;impédance interne <LatexMath math="\underline{Z}_g = R_g + j X_g" /> transfère la <strong>puissance active maximale</strong> à une charge réceptrice <LatexMath math="\underline{Z}_u = R_u + j X_u" />, il faut réaliser l&apos;adaptation conjuguée :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-1.5">
              <span className="text-purple-400 font-sans font-bold block">Condition d&apos;Adaptation Conjuguée :</span>
              <div className="p-2 rounded-lg bg-slate-900 text-center text-purple-300 font-bold">
                <LatexMath math="\underline{Z}_u = \underline{Z}_g^* \iff R_u = R_g \quad \text{et} \quad X_u = -X_g" />
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-1.5">
              <span className="text-emerald-400 font-sans font-bold block">Puissance Maximale Transférée :</span>
              <div className="p-2 rounded-lg bg-slate-900 text-center text-emerald-300 font-bold">
                <LatexMath math="P_{\max} = \frac{E_{\text{eff}}^2}{4 R_g} \quad (\text{Rendement } \eta = 50\%)" />
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── PARTIE 5: LABORATOIRE 3D INTERACTIF ── */}
      <section className="bg-card/90 border border-border/80 rounded-3xl p-5 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">Partie 5 • Laboratoire Interactif</span>
            <h2 className="text-lg sm:text-2xl font-black text-foreground">
              5. Laboratoire Interactif : Plan de Fresnel Tournant & Oscilloscope Synchronisé
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Explorez le comportement des dipôles <LatexMath math="R, L, C" /> et du circuit <LatexMath math="RLC" /> série. Observez en direct la rotation des vecteurs de Fresnel <LatexMath math="\vec{U}_m" /> et <LatexMath math="\vec{I}_m" />, les projections instantanées et les formes d&apos;onde synchronisées avec déphasage exact.
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
