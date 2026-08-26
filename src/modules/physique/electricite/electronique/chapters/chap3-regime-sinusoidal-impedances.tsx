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
function Chap3QuickQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      q: "Dans la notation complexe en RSF, à quelle opération algébrique équivaut la dérivation par rapport au temps ?",
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
      q: "D'après le théorème de Boucherot, que peut-on affirmer sur les puissances dans un réseau en RSF ?",
      qMath: "\\text{Théorème de Boucherot (Conservation des puissances)}",
      optionsText: [
        "Seule la puissance apparente S se conserve",
        "Les puissances active P et réactive Q se conservent séparément",
        "Le facteur de puissance cos(φ) est identique dans toutes les branches",
        "La puissance réactive est toujours nulle",
      ],
      correct: 1,
      explanation: "Le théorème de Boucherot stipule la conservation indépendante de la puissance active P_tot = Σ P_k et réactive Q_tot = Σ Q_k.",
      expMath: "P_{\\text{tot}} = \\sum_{k} P_k \\quad \\text{et} \\quad Q_{\\text{tot}} = \\sum_{k} Q_k",
    },
    {
      q: "Pour relever le facteur de puissance d'une installation inductive sans modifier la puissance active, quel dipôle branche-t-on en parallèle ?",
      qMath: "\\text{Compensation d'énergie réactive}",
      optionsText: [
        "Une résistance pure R",
        "Une bobine d'inductance L",
        "Un condensateur de capacité C",
        "Une diode de redressement",
      ],
      correct: 2,
      explanation: "Une charge inductive consomme de la puissance réactive (Q_L > 0). Un condensateur monté en parallèle fournit de la puissance réactive (Q_C < 0), annulant le déphasage sans consommer de puissance active.",
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
          <span>QCM d&apos;Auto-Évaluation • RSF, Impédances & Puissances (6 Questions)</span>
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
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      {/* ── HEADER ── */}
      <header className="space-y-2 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
          <Radio size={14} />
          <span>Chapitre 3 • Régime Sinusoïdal Forcé</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Régime Sinusoïdal Forcé, Impédances Complexes & Puissances
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
          Découvrez la puissance de la représentation complexe et des vecteurs de Fresnel, les impédances fondamentales (<LatexMath math="R, L, C" />), les lois d&apos;Ohm et de Millman complexes, ainsi que le bilan complet des puissances en alternatif (active, réactive, Boucherot et relèvement du facteur de puissance).
        </p>
      </header>

      {/* ── PARTIE 1: REPRÉSENTATION COMPLEXE & FRESNEL ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Partie 1 • Outils Mathématiques & Représentation</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          1. Signaux Sinusoïdaux, Représentation Complexe & Vecteurs de Fresnel
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          En <strong>Régime Sinusoïdal Forcé (RSF)</strong>, un circuit linéaire excité par une source de pulsation <LatexMath math="\omega = 2\pi f" /> voit toutes ses tensions et intensités osciller de façon permanente à la <strong>même pulsation</strong> <LatexMath math="\omega" />. Seules les amplitudes et les phases diffèrent.
        </p>

        {/* Signal Definitions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {/* Signal Temporel */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 shadow-md">
            <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
              1. Grandeur Temporelle Réelle
            </span>
            <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-cyan-300 font-bold text-sm border border-cyan-500/20">
              <LatexMath math="s(t) = S_m \cos(\omega t + \phi) = \sqrt{2} S_{\text{eff}} \cos(\omega t + \phi)" />
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-1 leading-relaxed">
              <li>• <LatexMath math="S_m" /> : Amplitude crête (valeur maximale).</li>
              <li>• <LatexMath math="S_{\text{eff}} = \frac{S_m}{\sqrt{2}}" /> : Valeur efficace (effet thermique équivalent).</li>
              <li>• <LatexMath math="\omega = 2\pi f = \frac{2\pi}{T}" /> : Pulsation propre en <LatexMath math="\text{rad}\cdot\text{s}^{-1}" />.</li>
              <li>• <LatexMath math="\phi" /> : Phase à l&apos;origine en radians.</li>
            </ul>
          </div>

          {/* Grandeur Complexe */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-3 shadow-md">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider">
              2. Grandeur Complexe Associée
            </span>
            <div className="p-3 rounded-xl bg-black/60 text-center font-mono text-indigo-300 font-bold text-sm border border-indigo-500/20">
              <LatexMath math="\underline{s}(t) = \underline{S}_m e^{j\omega t} = S_m e^{j\phi} e^{j\omega t} = \sqrt{2} \underline{S}_{\text{eff}} e^{j\omega t}" />
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 pl-1 leading-relaxed">
              <li>• <LatexMath math="s(t) = \Re(\underline{s}(t))" /> (Partie réelle).</li>
              <li>• <LatexMath math="\underline{S}_m = S_m e^{j\phi}" /> : Amplitude complexe.</li>
              <li>• <LatexMath math="\underline{S}_{\text{eff}} = S_{\text{eff}} e^{j\phi}" /> : Valeur efficace complexe.</li>
              <li>• Algèbre complexe : transforme les dérivées en simples multiplications !</li>
            </ul>
          </div>
        </div>

        {/* The Magic Operation Rule */}
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2 text-xs">
          <h4 className="font-extrabold uppercase text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Les Propriétés Magiques de la Dérivation et de l&apos;Intégration
          </h4>
          <p className="text-slate-300 leading-relaxed">
            La dérivation et l&apos;intégration des équations différentielles linéaires deviennent de simples opérations algébriques :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs text-center font-bold pt-1">
            <div className="p-2.5 rounded-lg bg-black/60 border border-cyan-500/30 text-cyan-300">
              <LatexMath math="\frac{\mathrm{d}}{\mathrm{d}t} \iff \times (j\omega)" />
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-indigo-500/30 text-indigo-300">
              <LatexMath math="\int \dots \mathrm{d}t \iff \times \left(\frac{1}{j\omega}\right) = \times \left(-\frac{j}{\omega}\right)" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTIE 2: IMPÉDANCES & ADMITTANCES DES DIPÔLES FONDAMENTAUX ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-1">
          <Zap className="w-3.5 h-3.5" />
          <span>Partie 2 • Caractéristiques des Dipôles R, L, C</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          2. Impédances et Admittances Complexes de R, L, C
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          L&apos;<strong>impédance complexe</strong> <LatexMath math="\underline{Z}" /> généralise la résistance en régime sinusoïdal en intégrant simultanément l&apos;amplitude et le déphasage :
        </p>
        <div className="p-3 rounded-xl bg-black/60 border border-emerald-500/30 text-center font-mono text-emerald-300 font-bold text-sm">
          <LatexMath math="\underline{Z} = \frac{\underline{u}(t)}{\underline{i}(t)} = \frac{\underline{U}_m}{\underline{I}_m} = R + j X = |\underline{Z}| e^{j\phi} \quad \text{et} \quad \underline{Y} = \frac{1}{\underline{Z}} = G + j B" />
        </div>

        {/* 3 Dipoles Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {/* Resistor R */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
              Résistance (R)
            </span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-rose-300 font-bold text-xs">
              <LatexMath math="\underline{Z}_R = R \quad (\phi = 0)" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Tension et courant <strong>strictement en phase</strong>. Pas d&apos;effet réactif. Indépendant de la pulsation <LatexMath math="\omega" />.
            </p>
          </div>

          {/* Inductor L */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              Bobine Idéale (L)
            </span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-amber-300 font-bold text-xs">
              <LatexMath math="\underline{Z}_L = j L \omega = L\omega e^{j\frac{\pi}{2}}" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Déphasage <LatexMath math="\phi = +\frac{\pi}{2}" /> : la tension est <strong>en avance de 90°</strong> sur le courant.
              <br />
              • <LatexMath math="\omega \to 0" /> : Fil (court-circuit).
              <br />
              • <LatexMath math="\omega \to \infty" /> : Circuit ouvert.
            </p>
          </div>

          {/* Capacitor C */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              Condensateur Idéal (C)
            </span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-cyan-300 font-bold text-xs">
              <LatexMath math="\underline{Z}_C = \frac{1}{j C \omega} = \frac{1}{C\omega} e^{-j\frac{\pi}{2}}" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Déphasage <LatexMath math="\phi = -\frac{\pi}{2}" /> : la tension est <strong>en retard de 90°</strong> sur le courant.
              <br />
              • <LatexMath math="\omega \to 0" /> : Interrupteur ouvert.
              <br />
              • <LatexMath math="\omega \to \infty" /> : Fil (court-circuit).
            </p>
          </div>
        </div>
      </section>

      {/* ── PARTIE 3: LOIS DE KIRCHHOFF & THÉORÈMES COMPLEXES ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-1">
          <Workflow className="w-3.5 h-3.5" />
          <span>Partie 3 • Résolution Algébrique des Circuits</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          3. Lois de Kirchhoff & Théorèmes en Notation Complexe
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Toutes les lois fondamentales du régime continu s&apos;étendent directement en régime sinusoïdal forcé en remplaçant les résistances par des impédances complexes <LatexMath math="\underline{Z}" />.
        </p>

        {/* Association rules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-cyan-400 uppercase">Association Série</span>
            <div className="p-2 rounded bg-black/60 text-center font-mono text-cyan-300 font-bold text-xs">
              <LatexMath math="\underline{Z}_{\text{éq}} = \sum_{k=1}^n \underline{Z}_k \quad (\text{Pont Diviseur : } \underline{U}_k = \frac{\underline{Z}_k}{\underline{Z}_{\text{tot}}} \underline{E})" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-indigo-400 uppercase">Association Parallèle</span>
            <div className="p-2 rounded bg-black/60 text-center font-mono text-indigo-300 font-bold text-xs">
              <LatexMath math="\underline{Y}_{\text{éq}} = \sum_{k=1}^n \underline{Y}_k = \sum_{k=1}^n \frac{1}{\underline{Z}_k} \quad (\text{Pont Diviseur de Courant})" />
            </div>
          </div>
        </div>

        {/* Complex Millman Theorem */}
        <CollapsibleProof
          title="Théorème de Millman en Notation Complexe"
          subtitle="Détermination directe du potentiel complexe d'un nœud sans système d'équations"
          color="emerald"
          badge="Méthode Fondamentale CPGE"
        >
          <div className="space-y-2 text-slate-300 font-sans text-xs">
            <p className="leading-relaxed">
              Pour un nœud A relié à des potentiels complexes <LatexMath math="\underline{V}_k" /> à travers des impédances <LatexMath math="\underline{Z}_k" /> (admittances <LatexMath math="\underline{Y}_k = 1/\underline{Z}_k" />) et des sources de courant incidentes <LatexMath math="\underline{\eta}_j" /> :
            </p>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center font-mono font-bold text-sm">
              <LatexMath math="\underline{V}_A = \frac{\sum_{k=1}^n \underline{Y}_k \underline{V}_k + \sum_{j=1}^p \underline{\eta}_j}{\sum_{k=1}^n \underline{Y}_k} = \frac{\sum_{k=1}^n \frac{\underline{V}_k}{\underline{Z}_k} + \sum_{j=1}^p \underline{\eta}_j}{\sum_{k=1}^n \frac{1}{\underline{Z}_k}}" />
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 4: PUISSANCES EN RSF & THÉORÈME DE BOUCHEROT ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-1">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Partie 4 • Bilan Énergétique en Alternatif</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          4. Puissances en Régime Sinusoïdal Forcé & Théorème de Boucherot
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          En alternatif, la puissance instantanée <LatexMath math="p(t) = u(t) i(t)" /> fluctue à la pulsation double <LatexMath math="2\omega" />. On distingue la <strong>puissance active</strong> (travail utile dissipé) et la <strong>puissance réactive</strong> (échange d&apos;énergie réactive avec les champs).
        </p>

        {/* 3 Powers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {/* Active Power */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              1. Puissance Active (P)
            </span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-emerald-300 font-bold text-xs">
              <LatexMath math="P = U_{\text{eff}} I_{\text{eff}} \cos\phi \quad [\text{W}]" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Moyenne temporelle <LatexMath math="\langle p(t) \rangle" />. Énergie électrique irréversiblement transformée en chaleur ou travail mécanique.
            </p>
          </div>

          {/* Reactive Power */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
              2. Puissance Réactive (Q)
            </span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-amber-300 font-bold text-xs">
              <LatexMath math="Q = U_{\text{eff}} I_{\text{eff}} \sin\phi \quad [\text{VAR}]" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Énergie alternativement emmagasinée et restituée par les condensateurs (<LatexMath math="Q_C < 0" />) et bobines (<LatexMath math="Q_L > 0" />).
            </p>
          </div>

          {/* Apparent Power */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              3. Puissance Complexe (S)
            </span>
            <div className="p-2 rounded bg-black/50 text-center font-mono text-cyan-300 font-bold text-xs">
              <LatexMath math="\underline{S} = P + j Q \implies S = |\underline{S}| = U_{\text{eff}} I_{\text{eff}} \quad [\text{VA}]" />
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Dimensionne les transformateurs, lignes et générateurs. Facteur de puissance <LatexMath math="k = \cos\phi = \frac{P}{S}" />.
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
          <div className="space-y-2 text-slate-300 font-sans text-xs">
            <p className="leading-relaxed">
              <strong>Théorème de Boucherot :</strong> Dans tout circuit en régime sinusoïdal forcé, les puissances active et réactive se conservent indépendamment :
            </p>
            <div className="p-2 rounded bg-black/60 text-center text-amber-300 font-mono font-bold">
              <LatexMath math="P_{\text{total}} = \sum_{k} P_k \quad \text{et} \quad Q_{\text{total}} = \sum_{k} Q_k" />
            </div>
            <p className="leading-relaxed pt-1">
              <strong>Relèvement du facteur de puissance :</strong> Une usine inductive de puissance <LatexMath math="P" /> et de facteur <LatexMath math="\cos\phi" /> consomme <LatexMath math="Q = P \tan\phi" />. Pour amener le déphasage à une valeur cible <LatexMath math="\phi'" /> (<LatexMath math="\cos\phi' \approx 1" />), on installe une batterie de condensateurs en parallèle de capacité :
            </p>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center text-amber-300 font-mono font-bold">
              <LatexMath math="C = \frac{P(\tan\phi - \tan\phi')}{\omega U_{\text{eff}}^2}" />
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 5: LABORATOIRE 3D INTERACTIF ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-1">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 5 • Laboratoire & Visualisation de Fresnel 3D</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          5. Laboratoire 3D : Plan de Fresnel Tournant & Formes d&apos;Onde Synchronisées
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Manipulez les dipôles <LatexMath math="R, L, C" /> et le circuit <LatexMath math="RLC" /> série. Observez en temps réel la rotation des vecteurs de Fresnel <LatexMath math="\vec{U}_m" /> et <LatexMath math="\vec{I}_m" /> dans le plan complexe 3D ainsi que le déphasage temporel synchronisé.
        </p>

        {/* 3D Simulation Canvas */}
        <ImpedanceFresnel3DCanvas />
      </section>

      {/* ── PARTIE 6: AUTO-ÉVALUATION & QCM ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-extrabold mb-1 border border-indigo-500/20">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Partie 6 • Validation & Auto-Évaluation</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          6. QCM d&apos;Auto-Évaluation du Chapitre 3
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Testez votre maîtrise du régime sinusoïdal forcé, des impédances complexes, du théorème de Millman et du bilan des puissances (Boucherot & compensation réactive).
        </p>

        {/* Pure LaTeX QCM */}
        <Chap3QuickQuiz />
      </section>
    </div>
  );
}
