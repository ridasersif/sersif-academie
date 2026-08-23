"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import LazyMount from "@/components/ui/LazyMount";
import LatexMath from "@/components/ui/LatexMath";
import {
  Zap,
  Layers,
  Flame,
  ChevronDown,
  ChevronUp,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Lightbulb,
  Sparkles,
  Gauge,
  Activity,
  BatteryCharging,
  Cpu,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check
} from "lucide-react";

// Dynamic 3D and interactive components with SSR disabled
const JouleEnergy3DCanvas = dynamic(
  () => import("../components/JouleEnergy3DCanvas"),
  { ssr: false }
);
const RLCStorage3DCanvas = dynamic(
  () => import("../components/RLCStorage3DCanvas"),
  { ssr: false }
);
const MaxPowerTransferCanvas = dynamic(
  () => import("../components/MaxPowerTransferCanvas"),
  { ssr: false }
);

/* ── Collapsible Proof / Demonstration Box ── */
function CollapsibleProof({
  title,
  subtitle,
  children,
  badge = "Démonstration Pas-à-Pas",
  color = "blue",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  badge?: string;
  color?: "blue" | "purple" | "amber" | "emerald" | "rose" | "indigo" | "cyan";
}) {
  const [isOpen, setIsOpen] = useState(false);

  const colors = {
    blue: {
      border: "border-blue-500/20",
      bg: "bg-blue-950/15",
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    purple: {
      border: "border-purple-500/20",
      bg: "bg-purple-950/15",
      badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
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
    rose: {
      border: "border-rose-500/20",
      bg: "bg-rose-950/15",
      badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    },
    indigo: {
      border: "border-indigo-500/20",
      bg: "bg-indigo-950/15",
      badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
    cyan: {
      border: "border-cyan-500/20",
      bg: "bg-cyan-950/15",
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
  }[color];

  return (
    <div
      className={`my-3 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm overflow-hidden transition-all duration-200`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="space-y-0.5 pr-2">
          <span
            className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors.badge}`}
          >
            {badge}
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-foreground">
            {title}
          </h4>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          )}
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

/* ── Interactive Quiz Component ── */
function QuickQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      q: "Dans un générateur réel (Thévenin E₀, r), à quelle condition la puissance fournie à une charge R est-elle maximale ?",
      options: [
        "Quand R = 0 (court-circuit)",
        "Quand R = r (adaptation d'impédance)",
        "Quand R → ∞ (circuit ouvert)",
        "Quand R = 2r"
      ],
      correct: 1,
      explanation: "Par dérivation de P_u(R) = E₀²R/(r+R)², le maximum strict est atteint exactement lorsque R = r, fournissant P_max = E₀²/(4r)."
    },
    {
      q: "Quel est le rendement électrique η d'un générateur de Thévenin fonctionnant à sa puissance maximale fournie ?",
      options: [
        "100 %",
        "75 %",
        "50 %",
        "25 %"
      ],
      correct: 2,
      explanation: "À l'adaptation (R = r), le courant vaut I = E₀/(2r). La moitié de la puissance totale est délivrée à la charge, l'autre moitié est dissipée en pertes Joule dans la résistance interne r, soit η = 50%."
    },
    {
      q: "En régime permanent continu (t → ∞), comment se comporte une bobine idéale d'inductance L ?",
      options: [
        "Comme un interrupteur ouvert (I = 0)",
        "Comme un court-circuit / fil idéal (u_L = 0)",
        "Comme une résistance pure R = L",
        "Comme un générateur de tension constante"
      ],
      correct: 1,
      explanation: "En régime continu, le courant est constant donc di/dt = 0. La tension u_L = L(di/dt) s'annule : la bobine se comporte comme un fil parfait."
    }
  ];

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-card/80 border border-border/80 space-y-4">
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
        <HelpCircle className="w-4 h-4" />
        <span>Quiz Rapide de Validation des Concepts</span>
      </div>

      <div className="space-y-4">
        {questions.map((item, qIdx) => (
          <div key={qIdx} className="p-3.5 rounded-xl bg-slate-950/40 border border-border/50 space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {qIdx + 1}. {item.q}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {item.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[qIdx] === optIdx;
                const isCorrect = item.correct === optIdx;
                let btnStyle = "bg-card/50 border-border/60 text-slate-300 hover:bg-white/[0.03]";
                if (showResults) {
                  if (isCorrect) btnStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold";
                  else if (isSelected) btnStyle = "bg-rose-500/20 border-rose-500/50 text-rose-300";
                } else if (isSelected) {
                  btnStyle = "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold";
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showResults && isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {showResults && (
              <p className="text-[11px] text-muted-foreground pt-1 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                💡 <strong>Explication :</strong> {item.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => setShowResults(!showResults)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
        >
          {showResults ? "Réinitialiser les Réponses" : "Vérifier mes Réponses"}
        </button>
      </div>
    </div>
  );
}

/* ── Interactive Voltage & Current Divider Calculator ── */
function DividerInteractiveCalculator() {
  const [calcMode, setCalcMode] = useState<"voltage" | "current">("voltage");
  const [vTotal, setVTotal] = useState(12);
  const [iTotal, setITotal] = useState(2);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);

  const u2 = vTotal * (r2 / (r1 + r2));
  const u1 = vTotal * (r1 / (r1 + r2));
  const i2 = iTotal * (r1 / (r1 + r2)); // Current divider: I2 = I * R1 / (R1+R2)
  const i1 = iTotal * (r2 / (r1 + r2));

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-card/90 border border-purple-500/20 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-foreground">
              Calculateur Interactif : Ponts Diviseurs
            </h4>
            <p className="text-xs text-muted-foreground">Expérimentez les relations de division de tension et de courant</p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setCalcMode("voltage")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              calcMode === "voltage"
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Diviseur de Tension (Série)
          </button>
          <button
            onClick={() => setCalcMode("current")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              calcMode === "current"
                ? "bg-cyan-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Diviseur de Courant (Parallèle)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Inputs */}
        <div className="space-y-3 md:col-span-1">
          {calcMode === "voltage" ? (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Tension totale <LatexMath math="U" /></span>
                <span className="text-purple-400 font-mono">{vTotal} V</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={vTotal}
                onChange={e => setVTotal(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-purple-500 cursor-pointer"
              />
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span>Courant total <LatexMath math="I" /></span>
                <span className="text-cyan-400 font-mono">{iTotal} A</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="10"
                step="0.2"
                value={iTotal}
                onChange={e => setITotal(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg accent-cyan-500 cursor-pointer"
              />
            </div>
          )}

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Résistance <LatexMath math="R_1" /></span>
              <span className="text-indigo-400 font-mono">{r1} Ω</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={r1}
              onChange={e => setR1(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Résistance <LatexMath math="R_2" /></span>
              <span className="text-indigo-400 font-mono">{r2} Ω</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={r2}
              onChange={e => setR2(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Results & Display */}
        <div className="md:col-span-2 grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
          {calcMode === "voltage" ? (
            <>
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center">
                <div className="text-[10px] uppercase font-bold text-purple-400">Tension <LatexMath math="U_1" /> aux bornes de <LatexMath math="R_1" /></div>
                <div className="text-lg font-black text-purple-300 font-mono">{u1.toFixed(2)} V</div>
                <div className="text-[10px] text-muted-foreground mt-0.5"><LatexMath math={`U_1 = U \\cdot \\frac{R_1}{R_1+R_2}`} /></div>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="text-[10px] uppercase font-bold text-emerald-400">Tension <LatexMath math="U_2" /> aux bornes de <LatexMath math="R_2" /></div>
                <div className="text-lg font-black text-emerald-300 font-mono">{u2.toFixed(2)} V</div>
                <div className="text-[10px] text-muted-foreground mt-0.5"><LatexMath math={`U_2 = U \\cdot \\frac{R_2}{R_1+R_2}`} /></div>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-center">
                <div className="text-[10px] uppercase font-bold text-cyan-400">Courant <LatexMath math="I_1" /> traversant <LatexMath math="R_1" /></div>
                <div className="text-lg font-black text-cyan-300 font-mono">{i1.toFixed(2)} A</div>
                <div className="text-[10px] text-muted-foreground mt-0.5"><LatexMath math={`I_1 = I \\cdot \\frac{R_2}{R_1+R_2}`} /></div>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                <div className="text-[10px] uppercase font-bold text-amber-400">Courant <LatexMath math="I_2" /> traversant <LatexMath math="R_2" /></div>
                <div className="text-lg font-black text-amber-300 font-mono">{i2.toFixed(2)} A</div>
                <div className="text-[10px] text-muted-foreground mt-0.5"><LatexMath math={`I_2 = I \\cdot \\frac{R_1}{R_1+R_2}`} /></div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Chap3PuissanceElectrocinetique() {
  const [showSynthesisSolution, setShowSynthesisSolution] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      {/* ── HEADER ── */}
      <header className="space-y-2 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
          <Zap size={14} />
          <span>Chapitre 3</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Puissance & Dipôles R, L, C
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
          Bilan énergétique, loi de Joule microscopique, générateurs réels (Thévenin/Norton), adaptation de puissance maximale et comportement temporel des dipôles réactifs (<LatexMath math="C" /> et <LatexMath math="L" />).
        </p>
      </header>

      {/* ── PARTIE 1: PUISSANCE ÉLECTROCINÉTIQUE & CONVENTIONS ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Partie 1 • Définition Fondamentale & Conventions</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Puissance Électrocinétique Instantanée
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
          Considérons un dipôle quelconque orienté entre deux bornes <LatexMath math="A" /> et <LatexMath math="B" /> traversé par un courant <LatexMath math="i(t)" /> et soumis à une tension <LatexMath math="u(t)" />.
        </p>

        {/* Fundamental Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-rose-500/5 border border-rose-500/20 p-4 sm:p-5 rounded-2xl">
            <h3 className="font-bold text-rose-500 dark:text-rose-400 text-sm mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> En Convention Récepteur
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
              La flèche tension <LatexMath math="u" /> et la flèche courant <LatexMath math="i" /> sont en sens <strong>opposés</strong>. La puissance électrique <strong>reçue</strong> par le dipôle s&apos;écrit :
            </p>
            <div className="bg-background/80 p-3 rounded-xl border border-rose-500/30 text-center font-mono font-bold text-rose-400">
              <LatexMath math="p_{\text{reçue}}(t) = u(t) \cdot i(t)" />
            </div>
            <ul className="mt-3 text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Si <LatexMath math="p_{\text{reçue}} > 0" /> : Le dipôle <strong>consomme</strong> de la puissance (comportement récepteur effectif).</li>
              <li>Si <LatexMath math="p_{\text{reçue}} < 0" /> : Le dipôle <strong>fournit</strong> de la puissance au reste du circuit.</li>
            </ul>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 sm:p-5 rounded-2xl">
            <h3 className="font-bold text-emerald-500 dark:text-emerald-400 text-sm mb-2 flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4" /> En Convention Générateur
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
              La flèche tension <LatexMath math="u" /> et la flèche courant <LatexMath math="i" /> sont dans le <strong>même sens</strong>. La puissance électrique <strong>fournie</strong> au circuit s&apos;écrit :
            </p>
            <div className="bg-background/80 p-3 rounded-xl border border-emerald-500/30 text-center font-mono font-bold text-emerald-400">
              <LatexMath math="p_{\text{fournie}}(t) = u(t) \cdot i(t) = -p_{\text{reçue}}(t)" />
            </div>
            <ul className="mt-3 text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
              <li>Si <LatexMath math="p_{\text{fournie}} > 0" /> : La source transfère activement de l&apos;énergie au circuit.</li>
              <li>Si <LatexMath math="p_{\text{fournie}} < 0" /> : La source se fait recharger (ex: batterie en charge).</li>
            </ul>
          </div>
        </div>

        {/* Demonstration */}
        <CollapsibleProof
          title="Démonstration Énergétique Fondamentale : Travail des Forces Électrostatiques"
          subtitle="Origine microscopique de l'expression p(t) = u(t) · i(t)"
          color="rose"
        >
          <div className="space-y-2">
            <p>
              Pendant une durée élémentaire <LatexMath math="\mathrm{d}t" />, une quantité de charge <LatexMath math="\mathrm{d}q = i(t)\,\mathrm{d}t" /> traverse le dipôle du potentiel <LatexMath math="V_A" /> vers le potentiel <LatexMath math="V_B" />.
            </p>
            <p>
              Le travail reçu par cette charge élémentaire sous l&apos;action du champ électrique <LatexMath math="\vec{E} = -\vec{\nabla}V" /> est :
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 text-center font-mono">
              <LatexMath math="\delta W = \mathrm{d}q \cdot (V_A - V_B) = (i\,\mathrm{d}t) \cdot u_{AB} = u_{AB} \cdot i \cdot \mathrm{d}t" />
            </div>
            <p>
              La puissance instantanée correspondante est par définition le débit temporel de travail :
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 text-center font-mono">
              <LatexMath math="p(t) = \frac{\delta W}{\mathrm{d}t} = u(t) \cdot i(t)" />
            </div>
            <p>
              L&apos;énergie totale échangée entre deux instants <LatexMath math="t_1" /> et <LatexMath math="t_2" /> est l&apos;intégrale : <LatexMath math="\Delta \mathcal{E} = \int_{t_1}^{t_2} p(t)\,\mathrm{d}t" />.
            </p>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 2: EFFET JOULE & BILAN LOCAL / GLOBAL ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <Flame className="w-3.5 h-3.5" />
          <span>Partie 2 • Loi de Joule & Dissipation Thermique</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          2. Bilan Énergétique Local et Effet Joule Macroscopique
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
          Dans tout conducteur ohmique de conductivité <LatexMath math="\gamma" /> et de résistivité <LatexMath math="\rho = 1/\gamma" />, les porteurs de charge accélérés par le champ électrique <LatexMath math="\vec{E}" /> entrent en collision inélastique avec le réseau cristallin, transférant irréversiblement leur énergie cinétique ordonnée sous forme d&apos;agitation thermique.
        </p>

        {/* 3D Joule Canvas */}
        <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <LazyMount fallbackText="Chargement du laboratoire Effet Joule 3D...">
            <JouleEnergy3DCanvas />
          </LazyMount>
        </div>

        {/* Mathematical Proof Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider mb-2">Forme Locale (Volumique)</h4>
            <div className="bg-background/80 p-3 rounded-lg border border-amber-500/30 text-center font-mono font-bold text-amber-300">
              <LatexMath math="p_J = \vec{j} \cdot \vec{E} = \gamma E^2 = \frac{j^2}{\gamma} = \rho j^2 \quad (\text{W}\cdot\text{m}^{-3})" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Exprime la puissance thermique dissipée par unité de volume en chaque point de l&apos;espace conducteur.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
            <h4 className="font-bold text-orange-400 text-xs uppercase tracking-wider mb-2">Forme Macroscopique (Globale)</h4>
            <div className="bg-background/80 p-3 rounded-lg border border-orange-500/30 text-center font-mono font-bold text-orange-300">
              <LatexMath math="P_J = \iiint_{\mathcal{V}} p_J\,\mathrm{d}\tau = U \cdot I = R I^2 = \frac{U^2}{R} \quad (\text{W})" />
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Puissance thermique totale dissipée par le conducteur de résistance <LatexMath math="R" />.
            </p>
          </div>
        </div>

        <CollapsibleProof
          title="Démonstration Complète : De la Loi Locale à la Loi Macroscopique"
          subtitle="Intégration du flux et de la circulation dans un cylindre conducteur"
          color="amber"
        >
          <div className="space-y-2">
            <p>
              Pour un conducteur cylindrique homogène de section <LatexMath math="S" /> et de longueur <LatexMath math="\ell" />, le champ électrique <LatexMath math="\vec{E}" /> et la densité de courant <LatexMath math="\vec{j}" /> sont uniformes et colinéaires à l&apos;axe du fil :
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 text-center font-mono">
              <LatexMath math="P_J = \iiint_{\mathcal{V}} (\vec{j} \cdot \vec{E})\,\mathrm{d}\tau = \iint_{S} \vec{j} \cdot \vec{\mathrm{d}S} \times \int_{0}^{\ell} \vec{E} \cdot \vec{\mathrm{d}\ell}" />
            </div>
            <p>
              Or, par définition du flux de courant et de la différence de potentiel :
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 text-center font-mono">
              <LatexMath math="\iint_{S} \vec{j} \cdot \vec{\mathrm{d}S} = I \quad \text{et} \quad \int_{0}^{\ell} \vec{E} \cdot \vec{\mathrm{d}\ell} = U_{AB}" />
            </div>
            <p>
              En remplaçant par la loi d&apos;Ohm macroscopique <LatexMath math="U = R I" /> avec <LatexMath math="R = \rho \frac{\ell}{S}" />, on retrouve rigoureusement :
            </p>
            <div className="p-2.5 rounded-lg bg-black/40 text-center font-mono text-amber-300 font-bold">
              <LatexMath math="P_J = I \cdot U = R I^2 = \frac{U^2}{R}" />
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 3: MODÈLES DE GÉNÉRATEURS & TRANSFERT MAXIMAL ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold mb-3">
          <Gauge className="w-3.5 h-3.5" />
          <span>Partie 3 • Modèles de Générateurs & Adaptation de Puissance</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          3. Générateurs Réels (Thévenin, Norton) & Théorème du Transfert Maximal
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Tout générateur linéaire réel présente des pertes internes. Il peut être modélisé sous deux représentations strictement duales et équivalentes.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
            <h3 className="font-bold text-indigo-400 text-sm flex items-center gap-2">
              <BatteryCharging className="w-4 h-4" /> Modèle de Thévenin
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Association série d&apos;une source idéale de tension <LatexMath math="E_0" /> (f.é.m à vide) et d&apos;une résistance interne <LatexMath math="r_s" /> :
            </p>
            <div className="p-3 bg-background/80 rounded-xl border border-indigo-500/30 font-mono text-center text-indigo-300 font-bold">
              <LatexMath math="u(i) = E_0 - r_s i" />
            </div>
            <p className="text-xs text-muted-foreground">
              Courant de court-circuit : <LatexMath math="I_{cc} = \frac{E_0}{r_s}" />.
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-violet-500/5 border border-violet-500/20 space-y-2">
            <h3 className="font-bold text-violet-400 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" /> Modèle de Norton
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Association parallèle d&apos;une source idéale de courant <LatexMath math="I_N" /> et d&apos;une conductance interne <LatexMath math="g_s = 1/r_s" /> :
            </p>
            <div className="p-3 bg-background/80 rounded-xl border border-violet-500/30 font-mono text-center text-violet-300 font-bold">
              <LatexMath math="i(u) = I_N - g_s u \quad \text{avec} \quad I_N = \frac{E_0}{r_s}" />
            </div>
            <p className="text-xs text-muted-foreground">
              Tension à vide : <LatexMath math="E_0 = \frac{I_N}{g_s} = r_s I_N" />.
            </p>
          </div>
        </div>

        {/* Max Power Transfer Interactive Simulator */}
        <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <LazyMount fallbackText="Chargement du simulateur d'adaptation d'impédance...">
            <MaxPowerTransferCanvas />
          </LazyMount>
        </div>

        <CollapsibleProof
          title="Démonstration du Théorème de Transfert Maximal de Puissance (Adaptation d'Impédance)"
          subtitle="Calcul de la dérivée première dP_u/dR pour déterminer la charge optimale"
          color="indigo"
        >
          <div className="space-y-2.5">
            <p>
              Connectons une résistance de charge <LatexMath math="R" /> aux bornes d&apos;un générateur de Thévenin <LatexMath math="(E_0, r_s)" />. Le courant traversant la charge est :
            </p>
            <div className="p-2 rounded-lg bg-black/40 text-center font-mono">
              <LatexMath math="I = \frac{E_0}{r_s + R}" />
            </div>
            <p>
              La puissance utile consommée par la charge est donc une fonction de <LatexMath math="R" /> :
            </p>
            <div className="p-2 rounded-lg bg-black/40 text-center font-mono">
              <LatexMath math="P_u(R) = R I^2 = \frac{E_0^2 \cdot R}{(r_s + R)^2}" />
            </div>
            <p>
              Pour trouver l&apos;extremum, dérivons <LatexMath math="P_u(R)" /> par rapport à <LatexMath math="R" /> :
            </p>
            <div className="p-2 rounded-lg bg-black/40 text-center font-mono">
              <LatexMath math="\frac{\mathrm{d}P_u}{\mathrm{d}R} = E_0^2 \cdot \frac{(r_s + R)^2 - 2R(r_s + R)}{(r_s + R)^4} = E_0^2 \cdot \frac{r_s - R}{(r_s + R)^3}" />
            </div>
            <p>
              La dérivée s&apos;annule et change de signe uniquement pour :
            </p>
            <div className="p-2 rounded-lg bg-black/40 text-center font-mono text-emerald-400 font-bold">
              <LatexMath math="R = r_s \implies P_{u,\max} = \frac{E_0^2}{4 r_s}" />
            </div>
            <p>
              <strong>Calcul du Rendement à l&apos;optimum :</strong>
            </p>
            <div className="p-2 rounded-lg bg-black/40 text-center font-mono">
              <LatexMath math="\eta = \frac{P_u}{P_{\text{totale}}} = \frac{R I^2}{E_0 I} = \frac{R}{r_s + R} = \frac{r_s}{r_s + r_s} = 50\%" />
            </div>
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 4: DIPÔLES LINÉAIRES RÉACTIFS (R, L, C) ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 4 • Dipôles Linéaires Réactifs (R, L, C)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          4. Modèles Linéaires R, L, C & Énergies Stockées
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Contrairement à la résistance qui convertit l&apos;énergie électrique en chaleur de façon irréversible, le condensateur (<LatexMath math="C" />) et la bobine (<LatexMath math="L" />) sont des <strong>réservoirs conservatifs d&apos;énergie</strong> réactive.
        </p>

        {/* 3D RLC Storage Canvas */}
        <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <LazyMount fallbackText="Chargement du laboratoire 3D Stockage RLC...">
            <RLCStorage3DCanvas />
          </LazyMount>
        </div>

        {/* Summary Table of R, L, C */}
        <div className="overflow-x-auto rounded-2xl border border-border/70 my-6 shadow-inner">
          <table className="w-full text-xs sm:text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-border/60 text-foreground font-bold">
                <th className="p-3">Dipôle</th>
                <th className="p-3">Relation Caractéristique</th>
                <th className="p-3">Puissance Reçue <LatexMath math="p(t)" /></th>
                <th className="p-3">Énergie Emmagasinée</th>
                <th className="p-3">Comportement en Régime Continu (<LatexMath math="t\to\infty" />)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-muted-foreground font-mono">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-3 font-sans font-bold text-indigo-400">Résistance (<LatexMath math="R" />)</td>
                <td className="p-3"><LatexMath math="u_R(t) = R \cdot i(t)" /></td>
                <td className="p-3 text-rose-400"><LatexMath math="p_R(t) = R i^2 \ge 0" /> (Purement dissipatif)</td>
                <td className="p-3">0 (Aucun stockage)</td>
                <td className="p-3 font-sans">Résistance <LatexMath math="R" /></td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-3 font-sans font-bold text-cyan-400">Condensateur (<LatexMath math="C" />)</td>
                <td className="p-3"><LatexMath math="i_C(t) = C \frac{\mathrm{d}u_C}{\mathrm{d}t}" /></td>
                <td className="p-3 text-cyan-300"><LatexMath math="p_C(t) = \frac{\mathrm{d}}{\mathrm{d}t}\left(\frac{1}{2}Cu_C^2\right)" /></td>
                <td className="p-3 text-cyan-400 font-bold"><LatexMath math="\mathcal{E}_e = \frac{1}{2} C u_C^2" /> (Électrostatique)</td>
                <td className="p-3 font-sans text-amber-300 font-bold">Interrupteur Ouvert (<LatexMath math="i_C = 0" />)</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-3 font-sans font-bold text-amber-400">Bobine / Inductance (<LatexMath math="L" />)</td>
                <td className="p-3"><LatexMath math="u_L(t) = L \frac{\mathrm{d}i_L}{\mathrm{d}t}" /></td>
                <td className="p-3 text-amber-300"><LatexMath math="p_L(t) = \frac{\mathrm{d}}{\mathrm{d}t}\left(\frac{1}{2}Li_L^2\right)" /></td>
                <td className="p-3 text-amber-400 font-bold"><LatexMath math="\mathcal{E}_m = \frac{1}{2} L i_L^2" /> (Magnétique)</td>
                <td className="p-3 font-sans text-emerald-300 font-bold">Court-Circuit / Fil (<LatexMath math="u_L = 0" />)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Essential Continuity Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
            <h4 className="text-xs font-bold uppercase text-cyan-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Propriété de Continuité : Condensateur
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pour que l&apos;énergie <LatexMath math="\mathcal{E}_e = \frac{1}{2} C u_C^2" /> soit une fonction continue du temps (puissance finie), la tension <strong><LatexMath math="u_C(t)" /> ne peut pas subir de discontinuité</strong> :
            </p>
            <div className="p-2 rounded bg-background/60 text-center font-mono text-cyan-300 font-bold text-xs">
              <LatexMath math="u_C(t^+) = u_C(t^-)" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
            <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Propriété de Continuité : Bobine
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pour que l&apos;énergie <LatexMath math="\mathcal{E}_m = \frac{1}{2} L i_L^2" /> soit une fonction continue du temps (puissance finie), le courant <strong><LatexMath math="i_L(t)" /> ne peut pas subir de discontinuité</strong> :
            </p>
            <div className="p-2 rounded bg-background/60 text-center font-mono text-amber-300 font-bold text-xs">
              <LatexMath math="i_L(t^+) = i_L(t^-)" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTIE 5: ASSOCIATION DES DIPÔLES & PONTS DIVISEURS ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Partie 5 • Lois d&apos;Association & Ponts Diviseurs</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          5. Association des Dipôles & Formules Pratiques
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/70 space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Association Série
            </h3>
            <p className="text-xs text-muted-foreground">Même courant <LatexMath math="i(t)" /> traversant tous les dipôles :</p>
            <ul className="text-xs font-mono space-y-1.5 text-indigo-300">
              <li>• Résistances : <LatexMath math="R_{\text{eq}} = \sum_{k} R_k" /></li>
              <li>• Inductances : <LatexMath math="L_{\text{eq}} = \sum_{k} L_k" /></li>
              <li>• Condensateurs : <LatexMath math="\frac{1}{C_{\text{eq}}} = \sum_{k} \frac{1}{C_k}" /></li>
            </ul>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/70 space-y-2">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Association Parallèle
            </h3>
            <p className="text-xs text-muted-foreground">Même tension <LatexMath math="u(t)" /> aux bornes de chaque branche :</p>
            <ul className="text-xs font-mono space-y-1.5 text-cyan-300">
              <li>• Résistances : <LatexMath math="\frac{1}{R_{\text{eq}}} = \sum_{k} \frac{1}{R_k} \iff G_{\text{eq}} = \sum_{k} G_k" /></li>
              <li>• Inductances : <LatexMath math="\frac{1}{L_{\text{eq}}} = \sum_{k} \frac{1}{L_k}" /></li>
              <li>• Condensateurs : <LatexMath math="C_{\text{eq}} = \sum_{k} C_k" /></li>
            </ul>
          </div>
        </div>

        {/* Interactive Divider Calculator */}
        <DividerInteractiveCalculator />
      </section>

      {/* ── PARTIE 6: PROBLÈME RÉSOLU & QUIZ ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Partie 6 • Entraînement & Problème Résolu</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          6. Problème Guidé de Concours & Auto-Évaluation
        </h2>

        {/* Solved Problem Card */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/60 border border-border/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Exercice Type Concours
            </span>
            <span className="text-xs text-muted-foreground font-mono">Bilan de puissance en régime continu</span>
          </div>

          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            Un générateur réel de f.é.m <LatexMath math="E = 24\text{ V}" /> et de résistance interne <LatexMath math="r = 2\,\Omega" /> alimente un circuit composé d&apos;une bobine d&apos;inductance <LatexMath math="L = 100\text{ mH}" /> (de résistance interne <LatexMath math="r_L = 1\,\Omega" />) en série avec une résistance variable <LatexMath math="R_0" />.
          </p>

          <ol className="text-xs sm:text-sm text-muted-foreground space-y-1.5 list-decimal list-inside font-medium">
            <li>Déterminer la valeur de <LatexMath math="R_0" /> permettant de maximiser la puissance dissipée dans celle-ci.</li>
            <li>Calculer cette puissance maximale <LatexMath math="P_{\max}" /> ainsi que l&apos;énergie magnétique stockée dans la bobine en régime permanent.</li>
          </ol>

          <button
            onClick={() => setShowSynthesisSolution(!showSynthesisSolution)}
            className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-2"
          >
            {showSynthesisSolution ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{showSynthesisSolution ? "Masquer la Solution Détaillée" : "Afficher la Solution Pas-à-Pas"}</span>
          </button>

          {showSynthesisSolution && (
            <div className="p-4 rounded-xl bg-background/90 border border-emerald-500/20 text-xs space-y-3 animate-in fade-in duration-200">
              <div className="space-y-1">
                <p className="font-bold text-foreground">1. Condition d&apos;adaptation de puissance :</p>
                <p className="text-muted-foreground">
                  En régime continu permanent, la f.é.m d&apos;auto-induction est nulle (<LatexMath math="u_{L,\text{idéale}} = 0" />). La résistance vue par la charge <LatexMath math="R_0" /> est la somme des résistances en amont : <LatexMath math="r_{\text{total}} = r + r_L = 2 + 1 = 3\,\Omega" />.
                </p>
                <p className="text-emerald-400 font-mono font-bold">
                  La puissance dans <LatexMath math="R_0" /> est maximale pour <LatexMath math="R_0 = r + r_L = 3\,\Omega" />.
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-foreground">2. Calculs numériques :</p>
                <p className="text-muted-foreground">
                  Le courant dans le circuit vaut : <LatexMath math="I = \frac{E}{r + r_L + R_0} = \frac{24}{2 + 1 + 3} = \frac{24}{6} = 4\text{ A}" />.
                </p>
                <p className="text-muted-foreground">
                  • Puissance maximale dissipée dans <LatexMath math="R_0" /> : <LatexMath math="P_{\max} = R_0 I^2 = 3 \times (4)^2 = 48\text{ W}" />.
                </p>
                <p className="text-muted-foreground">
                  • Énergie magnétique emmagasinée dans la bobine : <LatexMath math="\mathcal{E}_m = \frac{1}{2} L I^2 = \frac{1}{2} \times 0.1 \times (4)^2 = 0.8\text{ J} = 800\text{ mJ}" />.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Quiz */}
        <QuickQuiz />
      </section>
    </div>
  );
}
