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
  Droplet,
  Battery,
  Shield,
  Activity,
  Cpu,
  ShieldAlert,
  Check
} from "lucide-react";

// Dynamic imports with SSR disabled for all 3D canvases
const DrudeConduction3DCanvas = dynamic(
  () => import("../components/DrudeConduction3DCanvas"),
  { ssr: false }
);
const CurrentDensityConductor3DCanvas = dynamic(
  () => import("../components/CurrentDensityConductor3DCanvas"),
  { ssr: false }
);
const OhmLawMacroscopic3DCanvas = dynamic(
  () => import("../components/OhmLawMacroscopic3DCanvas"),
  { ssr: false }
);
const DipoleCharacteristics3DCanvas = dynamic(
  () => import("../components/DipoleCharacteristics3DCanvas"),
  { ssr: false }
);
const JouleEnergy3DCanvas = dynamic(
  () => import("../components/JouleEnergy3DCanvas"),
  { ssr: false }
);
const RLCStorage3DCanvas = dynamic(
  () => import("../components/RLCStorage3DCanvas"),
  { ssr: false }
);

/* ── Collapsible Proof Component ── */
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
      q: "Quelle est la relation entre le vecteur densité de courant j et la vitesse de dérive vd des électrons ?",
      options: [
        "j = n · e · vd",
        "j = -n · e · vd",
        "j = vd / (n · e)",
        "j = e · vd"
      ],
      correct: 1,
      explanation: "Puisque les électrons portent une charge négative q = -e, la densité volumique de charge mobile est ρ_mob = -n·e, d'où j = ρ_mob · vd = -n·e·vd."
    },
    {
      q: "Dans la convention récepteur, que signifie une puissance instantanée p(t) = u(t)·i(t) > 0 ?",
      options: [
        "Le dipôle fournit de l'énergie au circuit",
        "Le dipôle consomme / absorbe de la puissance électrique",
        "Le dipôle est en court-circuit",
        "Le dipôle est une source idéale de tension"
      ],
      correct: 1,
      explanation: "En convention récepteur, p(t) = u(t)·i(t) > 0 correspond à une puissance effectivement reçue et consommée (dissipée ou emmagasinée) par le dipôle."
    },
    {
      q: "Quelle grandeur physique ne peut subir aucune discontinuité temporelle aux bornes d'un condensateur ?",
      options: [
        "Le courant i(t)",
        "La tension u_C(t)",
        "La charge q(t) uniquement",
        "La puissance instantanée p(t)"
      ],
      correct: 1,
      explanation: "L'énergie électrostatique stockée E = (1/2)·C·u_C² étant continue, la tension u_C(t) aux bornes d'un condensateur ne peut jamais subir de discontinuité temporelle (u_C(t⁺) = u_C(t⁻))."
    }
  ];

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-card/80 border border-border/80 space-y-4">
      <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
        <HelpCircle className="w-4 h-4" />
        <span>Quiz Rapide de Validation des Fondements</span>
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

export default function Chap1FondementsElectrocinetique() {
  const [showEx1Solution, setShowEx1Solution] = useState(false);
  const [showSynthesisSolution, setShowSynthesisSolution] = useState(false);
  const [activeJouleProof, setActiveJouleProof] = useState<"micro" | "macro" | null>(null);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      {/* ── HEADER ── */}
      <header className="space-y-2 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
          <Zap size={14} />
          <span>Chapitre 1</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Fondements de l&apos;Électrocinétique, Dipôles & Puissance
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
          Du modèle microscopique de conduction de Drude aux dipôles linéaires fondamentaux (<LatexMath math="R, L, C" />), maîtrisez la loi d&apos;Ohm locale et macroscopique, les caractéristiques courant-tension, la puissance instantanée et le bilan énergétique de Joule.
        </p>
      </header>

      {/* ── PARTIE 0: ANALOGIE HYDRAULIQUE INTUITIVE ── */}
      <section className="bg-card/90 border border-blue-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <Droplet className="w-3.5 h-3.5" />
          <span>Pour bien commencer • L&apos;Analogie de l&apos;Eau</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          0. Comprendre la Tension (<LatexMath math="U" />) et le Courant (<LatexMath math="I" />)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/5 border border-blue-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Le Courant (<LatexMath math="I" />) = Le Débit d&apos;eau</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le courant électrique, mesuré en <strong>Ampères (A)</strong>, correspond à la quantité d&apos;électrons qui circulent dans le fil chaque seconde. C&apos;est exactement comme le <strong>débit de l&apos;eau</strong> dans un tuyau (le nombre de litres par seconde).
            </p>
          </div>
          <div className="bg-orange-500/5 border border-orange-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
            <h3 className="font-bold text-orange-600 dark:text-orange-400 mb-2">La Tension (<LatexMath math="U" />) = La Pression d&apos;eau</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La tension, mesurée en <strong>Volts (V)</strong>, est la force qui pousse les électrons à avancer. C&apos;est comme la <strong>pression de l&apos;eau</strong> générée par une pompe. Sans pression (Tension = 0), l&apos;eau ne coule pas (Courant = 0).
            </p>
          </div>
        </div>
      </section>

      {/* ── PARTIE 1: MODÈLE MICROSCOPIQUE DE DRUDE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Partie 1 • Modèle Microscopique de Conduction</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Comment naît le courant électrique ? (Modèle de Drude)
        </h2>

        {/* Analogie flipper */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-muted-foreground flex items-start gap-3 mb-4">
          <Lightbulb size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-300 font-bold block mb-0.5">L&apos;analogie du flipper :</strong>
            Imaginez des billes dans un jeu de flipper horizontal qui rebondissent partout à <strong className="text-slate-200">100 km/s</strong> (agitation thermique). Si on incline le flipper (application d&apos;un champ <LatexMath math="\vec{E}" />), les billes continuent de rebondir dans tous les sens, mais glissent lentement vers le bas à seulement <strong className="text-slate-200">0.1 mm/s</strong> : c&apos;est la <strong>vitesse de dérive</strong> <LatexMath math="\vec{v}_d" />.
          </div>
        </div>

        {/* 3D Canvas Drude */}
        <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <LazyMount fallbackText="Préparation du modèle microscopique de Drude...">
            <DrudeConduction3DCanvas />
          </LazyMount>
        </div>

        {/* Résumé & Formules */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">1. Agitation Thermique (Chaos)</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Sans champ électrique, la vitesse moyenne est nulle : <LatexMath math="\langle \vec{v} \rangle = \vec{0}" />. Aucun transport net de charge.
            </p>
            <div className="font-mono text-center text-slate-200 pt-1">
              <LatexMath math="v_{\text{th}} = \sqrt{\frac{3 k_B T}{m}} \approx 10^5\,\text{m/s}" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-bold block">2. Vitesse de Dérive Collective</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Sous l&apos;action de <LatexMath math="\vec{E}" />, les électrons acquièrent une lente vitesse d&apos;ensemble opposée au champ :
            </p>
            <div className="font-mono text-center text-cyan-300 font-bold pt-1">
              <LatexMath math="\vec{v}_d = -\frac{e \tau}{m} \vec{E} = -\mu \vec{E}" />
            </div>
          </div>
        </div>

        {/* Démonstration Drude */}
        <CollapsibleProof
          title="Démonstration : Dérivation de la vitesse de dérive vd = -μE"
          subtitle="2ème loi de Newton avec force de frottement fluide moyen f = -(m/τ)v"
          color="blue"
        >
          <p>
            On applique le principe fondamental de la dynamique (PFD) à un électron moyen dans le réseau cristallin métallique :
          </p>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono my-2 text-cyan-300">
            <LatexMath math="m \frac{d\vec{v}}{dt} = -e\vec{E} - \frac{m}{\tau}\vec{v}" />
          </div>
          <p>
            où <LatexMath math="\tau \approx 10^{-14}\,\text{s}" /> est le <strong>temps de relaxation</strong> (durée moyenne entre deux chocs successifs avec le réseau).
          </p>
          <p>
            En régime stationnaire établi (<LatexMath math="\frac{d\vec{v}}{dt} = \vec{0}" />) :
          </p>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono my-2 text-emerald-400 font-bold">
            <LatexMath math="\vec{v}_d = -\frac{e\tau}{m} \vec{E} = -\mu \vec{E} \quad \text{avec} \quad \mu = \frac{e\tau}{m} \text{ (Mobilité)}" />
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 2: VECTEUR DENSITÉ DE COURANT & INTENSITÉ ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Partie 2 • Densité Volumique & Flux</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          2. Vecteur Densité de Courant <LatexMath math="\vec{j}" /> & Intensité <LatexMath math="I" />
        </h2>

        {/* Formule de J */}
        <div className="max-w-md mx-auto p-3 rounded-xl bg-slate-900/60 border border-cyan-500/30 shadow-sm text-center space-y-1 mb-4">
          <div className="font-mono text-cyan-300 font-bold text-sm sm:text-base">
            <LatexMath math="\vec{j} = \rho_{\text{mob}} \vec{v}_d = -n e \vec{v}_d = n e \mu \vec{E}" />
          </div>
          <p className="text-[10px] text-slate-400">
            <LatexMath math="n" /> = densité d&apos;électrons (<LatexMath math="\text{m}^{-3}" />) | <LatexMath math="e = 1.6 \times 10^{-19}\,\text{C}" />
          </p>
        </div>

        {/* 3D Canvas Current Density */}
        <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <LazyMount fallbackText="Préparation du flux du vecteur densité de courant...">
            <CurrentDensityConductor3DCanvas />
          </LazyMount>
        </div>

        {/* Démonstration Flux */}
        <CollapsibleProof
          title="Démonstration : Calcul de l'intensité comme Flux du vecteur j"
          subtitle="Passage de la densité locale j à l'intensité macroscopique I"
          color="emerald"
        >
          <p>
            Pendant une durée <LatexMath math="dt" />, les charges qui traversent un élément de surface <LatexMath math="d\vec{S} = \vec{n}\,dS" /> sont contenues dans le cylindre de volume <LatexMath math="d\tau = \vec{v}_d \cdot d\vec{S}\,dt" />.
          </p>
          <p>1. Charge élémentaire traversante :</p>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono my-1 text-slate-200">
            <LatexMath math="dq = \rho_{\text{mob}} d\tau = (\rho_{\text{mob}} \vec{v}_d) \cdot d\vec{S}\,dt = \vec{j} \cdot d\vec{S}\,dt" />
          </div>
          <p>2. Intensité totale du courant <LatexMath math="I" /> (en Ampères) :</p>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono my-1 text-emerald-400 font-bold">
            <LatexMath math="I = \frac{dq}{dt} = \iint_S \vec{j} \cdot d\vec{S} = \iint_S j \cos(\theta) \, dS \xrightarrow[\text{section droite}]{} I = j \cdot S" />
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 3: LOI D'OHM LOCALE ET RÉSISTANCE MACROSCOPIQUE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Partie 3 • Conductivité & Loi d&apos;Ohm</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          3. Loi d&apos;Ohm Locale & Résistance d&apos;un Conducteur
        </h2>

        {/* Loi d'Ohm Locale Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-xs space-y-2 mb-4">
          <div className="flex items-center gap-2 font-bold text-amber-400 text-xs sm:text-sm">
            <Sparkles size={16} /> Loi d&apos;Ohm Microscopique (Locale)
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] sm:text-xs">
            Dans tout conducteur ohmique, la densité de courant est proportionnelle au champ électrique :
          </p>
          <div className="p-2 rounded-lg bg-slate-950/80 border border-amber-500/40 text-center font-mono text-amber-300 font-bold text-sm sm:text-base">
            <LatexMath math="\vec{j} = \gamma \vec{E} = \sigma \vec{E} = \frac{1}{\rho} \vec{E}" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
            <div>• <strong className="text-slate-200">Conductivité :</strong> <LatexMath math="\gamma = \frac{n e^2 \tau}{m} = n e \mu" /> (<LatexMath math="\text{S}\cdot\text{m}^{-1}" />)</div>
            <div>• <strong className="text-slate-200">Résistivité :</strong> <LatexMath math="\rho = \frac{1}{\gamma}" /> (<LatexMath math="\Omega\cdot\text{m}" />)</div>
          </div>
        </div>

        {/* 3D Canvas Ohm Macroscopic */}
        <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <LazyMount fallbackText="Préparation de la résistance macroscopique...">
            <OhmLawMacroscopic3DCanvas />
          </LazyMount>
        </div>

        {/* Démonstration R = rho * L / S */}
        <CollapsibleProof
          title="Démonstration : Passage de la loi locale (j = γE) à la loi macroscopique (U = RI)"
          subtitle="Formule de Pouillet R = ρ·ℓ / S"
          color="amber"
        >
          <p>
            Pour un conducteur cylindrique homogène de longueur <LatexMath math="\ell" /> et section <LatexMath math="S" /> :
          </p>
          <p>
            1. Différence de potentiel (Tension) : <LatexMath math="U = \int_0^\ell E \, dx = E \cdot \ell \implies E = \frac{U}{\ell}" />
          </p>
          <p>
            2. Intensité du courant : <LatexMath math="I = j \cdot S = (\gamma E) \cdot S = \gamma \left(\frac{U}{\ell}\right) S" />
          </p>
          <p>
            3. On en déduit :
          </p>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono my-2 text-amber-300 font-bold">
            <LatexMath math="U = \left(\frac{1}{\gamma} \frac{\ell}{S}\right) I = \left(\rho \frac{\ell}{S}\right) I = R \cdot I" />
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 4: DIPÔLES ÉLECTRIQUES, CONVENTIONS & CARACTÉRISTIQUES ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Partie 4 • Conventions & Caractéristiques I-V</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          4. Conventions & Classification des Dipôles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-rose-500/5 border border-rose-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
            <h3 className="font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Convention Récepteur
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
              La flèche tension <LatexMath math="U" /> est <strong>opposée</strong> à la flèche courant <LatexMath math="I" />. Utilisée pour les composants qui consomment de l&apos;énergie. Puissance reçue : <LatexMath math="P = U \cdot I > 0" />.
            </p>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
              <Battery className="w-4 h-4" /> Convention Générateur
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
              La flèche tension <LatexMath math="U" /> est <strong>dans le même sens</strong> que la flèche courant <LatexMath math="I" />. Utilisée pour les sources. Puissance fournie : <LatexMath math="P = U \cdot I > 0" />.
            </p>
          </div>
        </div>

        {/* 3D Canvas Dipole Characteristics */}
        <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <LazyMount fallbackText="Préparation de la courbe caractéristique I-V...">
            <DipoleCharacteristics3DCanvas />
          </LazyMount>
        </div>

        {/* Classification Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-xs text-indigo-400 uppercase">Passif vs Actif</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              • <strong>Dipôle Passif :</strong> La caractéristique passe par l&apos;origine <LatexMath math="(0,0)" />. Sans tension extérieure, aucun courant ne circule (ex: Résistance, Diode).<br />
              • <strong>Dipôle Actif :</strong> La caractéristique ne passe pas par l&apos;origine. Il peut débiter de l&apos;énergie (ex: Pile, Batterie, Générateur).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-xs text-cyan-400 uppercase">Linéaire vs Non-Linéaire</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              • <strong>Dipôle Linéaire :</strong> La caractéristique <LatexMath math="I=f(U)" /> est une droite (ex: Résistance, Source de Thévenin).<br />
              • <strong>Dipôle Non-Linéaire :</strong> La caractéristique est une courbe non droite (ex: Diode à jonction, Diode Zener).
            </p>
          </div>
        </div>
      </section>

      {/* ── PARTIE 5: PUISSANCE ÉLECTROCINÉTIQUE & EFFET JOULE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <Flame className="w-3.5 h-3.5" />
          <span>Partie 5 • Puissance Électrocinétique & Effet Joule</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          5. Bilan Énergétique Local et Effet Joule Macroscopique
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
          Dans tout conducteur ohmique, les porteurs de charge transfèrent leur énergie cinétique par collision inélastique avec le réseau cristallin, dissipant une puissance thermique irréversible.
        </p>

        {/* 3D Joule Canvas */}
        <div className="mb-6 sm:mb-8 rounded-2xl overflow-hidden border border-slate-800 relative ring-1 ring-slate-800 shadow-xl">
          <LazyMount fallbackText="Chargement du laboratoire Effet Joule 3D...">
            <JouleEnergy3DCanvas />
          </LazyMount>
        </div>

        {/* ── 2 Sleek Compact Cards: Formula + Inline Arrow Toggle Proof (Exclusive Accordion) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-4">
          {/* Card 1: Forme Locale */}
          <div className="rounded-xl sm:rounded-2xl border border-amber-500/25 bg-amber-950/10 backdrop-blur-sm overflow-hidden p-3.5 sm:p-4 space-y-2.5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Forme Locale (Volumique)
              </span>
              <button
                onClick={() => setActiveJouleProof(activeJouleProof === "micro" ? null : "micro")}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-all cursor-pointer"
              >
                <span>Démonstration</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeJouleProof === "micro" ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg sm:rounded-xl border border-amber-500/30 text-center font-mono font-bold text-amber-300 text-xs sm:text-sm shadow-inner">
              <LatexMath math="p_J = \vec{j} \cdot \vec{E} = \gamma E^2 = \frac{j^2}{\gamma} = \rho j^2 \quad (\text{W}\cdot\text{m}^{-3})" />
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Puissance thermique dissipée par unité de volume en chaque point de l&apos;espace conducteur.
            </p>

            {/* Inline Mathematical Proof formatted like exam paper */}
            {activeJouleProof === "micro" && (
              <div className="pt-2.5 border-t border-amber-500/20 space-y-2 text-xs text-slate-300 animate-in fade-in duration-200">
                <div className="p-3 rounded-xl bg-slate-950/95 border border-slate-800 space-y-2 font-mono text-[11px] sm:text-xs">
                  <div className="text-slate-300">
                    <LatexMath math="\text{Soit un volume } \mathrm{d}\tau \text{ contenant la charge mobile } \mathrm{d}q = \rho_{\text{mob}}\,\mathrm{d}\tau :" />
                  </div>
                  <div className="text-cyan-300 pl-2 border-l-2 border-cyan-500/40">
                    <LatexMath math="\implies \mathrm{d}\vec{F} = \mathrm{d}q \cdot \vec{E} = (\rho_{\text{mob}}\,\mathrm{d}\tau)\,\vec{E}" />
                  </div>
                  <div className="text-cyan-300 pl-2 border-l-2 border-cyan-500/40">
                    <LatexMath math="\implies \delta W = \mathrm{d}\vec{F} \cdot \vec{v}_d\,\mathrm{d}t = (\rho_{\text{mob}}\,\vec{v}_d \cdot \vec{E})\,\mathrm{d}\tau\,\mathrm{d}t" />
                  </div>
                  <div className="text-slate-300">
                    <LatexMath math="\text{Or par définition, le vecteur densité vaut } \vec{j} = \rho_{\text{mob}}\,\vec{v}_d :" />
                  </div>
                  <div className="text-amber-300 pl-2 border-l-2 border-amber-500/40">
                    <LatexMath math="\implies \mathrm{d}P = \frac{\delta W}{\mathrm{d}t} = (\vec{j} \cdot \vec{E})\,\mathrm{d}\tau \iff p_J = \frac{\mathrm{d}P}{\mathrm{d}\tau} = \vec{j} \cdot \vec{E}" />
                  </div>
                  <div className="text-slate-300">
                    <LatexMath math="\text{Or d'après la loi d'Ohm locale : } \vec{j} = \gamma \vec{E} \iff \vec{E} = \frac{\vec{j}}{\gamma} = \rho \vec{j}" />
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/40 text-center text-amber-300 font-bold text-xs sm:text-sm shadow-inner">
                    <LatexMath math="\text{Donc :} \quad p_J = \vec{j} \cdot \vec{E} = \gamma E^2 = \frac{j^2}{\gamma} = \rho j^2" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Forme Macroscopique */}
          <div className="rounded-xl sm:rounded-2xl border border-rose-500/25 bg-rose-950/10 backdrop-blur-sm overflow-hidden p-3.5 sm:p-4 space-y-2.5 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Forme Macroscopique (Globale)
              </span>
              <button
                onClick={() => setActiveJouleProof(activeJouleProof === "macro" ? null : "macro")}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all cursor-pointer"
              >
                <span>Démonstration</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeJouleProof === "macro" ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-lg sm:rounded-xl border border-rose-500/30 text-center font-mono font-bold text-rose-300 text-xs sm:text-sm shadow-inner">
              <LatexMath math="P_J = \iiint_{\mathcal{V}} p_J\,\mathrm{d}\tau = U \cdot I = R I^2 = \frac{U^2}{R} \quad (\text{W})" />
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Puissance thermique totale dissipée par le conducteur cylindrique de résistance <LatexMath math="R" />.
            </p>

            {/* Inline Mathematical Proof formatted like exam paper */}
            {activeJouleProof === "macro" && (
              <div className="pt-2.5 border-t border-rose-500/20 space-y-2 text-xs text-slate-300 animate-in fade-in duration-200">
                <div className="p-3 rounded-xl bg-slate-950/95 border border-slate-800 space-y-2 font-mono text-[11px] sm:text-xs">
                  <div className="text-slate-300">
                    <LatexMath math="\text{Soit un cylindre de longueur } \ell \text{ et section } S \text{ avec } \vec{j} \parallel \vec{E} :" />
                  </div>
                  <div className="text-rose-300 pl-2 border-l-2 border-rose-500/40">
                    <LatexMath math="P_J = \iiint_{\mathcal{V}} (\vec{j} \cdot \vec{E})\,\mathrm{d}\tau = \left(\iint_S \vec{j} \cdot \vec{\mathrm{d}S}\right) \times \left(\int_0^\ell \vec{E} \cdot \vec{\mathrm{d}\ell}\right)" />
                  </div>
                  <div className="text-slate-300">
                    <LatexMath math="\text{Or par définition : } \iint_S \vec{j} \cdot \vec{\mathrm{d}S} = I \quad \text{et} \quad \int_0^\ell \vec{E} \cdot \vec{\mathrm{d}\ell} = U" />
                  </div>
                  <div className="text-rose-300 pl-2 border-l-2 border-rose-500/40">
                    <LatexMath math="\implies P_J = U \cdot I" />
                  </div>
                  <div className="text-slate-300">
                    <LatexMath math="\text{Or d'après la loi d'Ohm macroscopique : } U = R \cdot I \iff I = \frac{U}{R}" />
                  </div>
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/40 text-center text-rose-400 font-bold text-xs sm:text-sm shadow-inner">
                    <LatexMath math="\text{Donc :} \quad P_J = U \cdot I = R I^2 = \frac{U^2}{R}" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PARTIE 6: DIPÔLES LINÉAIRES RÉACTIFS (R, L, C) ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-extrabold mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>Partie 6 • Dipôles Linéaires Réactifs (R, L, C)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          6. Modèles Linéaires R, L, C & Énergies Stockées
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
          Contrairement à la résistance qui dissipe irréversiblement l&apos;énergie sous forme thermique (<LatexMath math="p_R(t) \ge 0" />), le condensateur (<LatexMath math="C" />) et la bobine (<LatexMath math="L" />) sont des <strong>réservoirs d&apos;énergie réactive conservatifs</strong> : ils emmagasinent l&apos;énergie pendant une phase et la restituent intégralement au circuit sans aucune perte.
        </p>

        {/* ── Analogie Mécanique Intuitive ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
              <span>🚗 Résistance</span>
              <span className="text-[10px] text-slate-500 font-normal">Frottement / Frein</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Transforme l&apos;énergie électrique en chaleur irréversible (<LatexMath math="P_J = R i^2" />). Ne stocke rien.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
              <span>🌀 Condensateur</span>
              <span className="text-[10px] text-slate-500 font-normal">Ressort Élastique</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Comprime les charges et stocke une énergie potentielle <LatexMath math="\mathcal{E}_e = \frac{1}{2} C u_C^2" /> dans son champ <LatexMath math="\vec{E}" />.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span>⚙️ Bobine</span>
              <span className="text-[10px] text-slate-500 font-normal">Volant d&apos;Inertie</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              S&apos;oppose à toute variation de courant et stocke une énergie cinétique <LatexMath math="\mathcal{E}_m = \frac{1}{2} L i_L^2" /> dans son champ <LatexMath math="\vec{B}" />.
            </p>
          </div>
        </div>

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

        {/* Démonstrations Dépliables Pas-à-Pas des Énergies */}
        <div className="space-y-3 my-4">
          <CollapsibleProof
            title="Démonstration : Énergie Électrostatique d'un Condensateur (Ee = 1/2 C u²)"
            subtitle="Calcul de la puissance électrique reçue en convention récepteur"
            color="cyan"
          >
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <p className="font-sans text-slate-300">
                1. En convention récepteur, la puissance instantanée absorbée par le condensateur est :
              </p>
              <div className="p-2 rounded bg-black/40 text-center text-slate-200">
                <LatexMath math="p_C(t) = u_C(t) \cdot i_C(t)" />
              </div>
              <p className="font-sans text-slate-300">
                2. Or la relation constitutive du condensateur donne <LatexMath math="i_C(t) = C \frac{\mathrm{d}u_C}{\mathrm{d}t}" /> :
              </p>
              <div className="p-2 rounded bg-black/40 text-center text-cyan-300">
                <LatexMath math="\implies p_C(t) = u_C(t) \cdot \left(C \frac{\mathrm{d}u_C}{\mathrm{d}t}\right) = \frac{\mathrm{d}}{\mathrm{d}t}\left(\frac{1}{2} C u_C(t)^2\right)" />
              </div>
              <p className="font-sans text-slate-300">
                3. La puissance étant la dérivée temporelle de l&apos;énergie emmagasinée (<LatexMath math="p_C(t) = \frac{\mathrm{d}\mathcal{E}_e}{\mathrm{d}t}" />) :
              </p>
              <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30 text-center text-cyan-300 font-bold">
                <LatexMath math="\text{D'où :} \quad \mathcal{E}_e = \frac{1}{2} C u_C^2 = \frac{Q^2}{2C}" />
              </div>
            </div>
          </CollapsibleProof>

          <CollapsibleProof
            title="Démonstration : Énergie Magnétique d'une Bobine (Em = 1/2 L i²)"
            subtitle="Calcul de la puissance absorbée lors de l'établissement du courant"
            color="amber"
          >
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <p className="font-sans text-slate-300">
                1. En convention récepteur, la tension aux bornes de la bobine d&apos;inductance <LatexMath math="L" /> est <LatexMath math="u_L(t) = L \frac{\mathrm{d}i_L}{\mathrm{d}t}" /> :
              </p>
              <div className="p-2 rounded bg-black/40 text-center text-slate-200">
                <LatexMath math="p_L(t) = u_L(t) \cdot i_L(t) = \left(L \frac{\mathrm{d}i_L}{\mathrm{d}t}\right) \cdot i_L(t)" />
              </div>
              <p className="font-sans text-slate-300">
                2. On reconnaît la dérivée d&apos;une forme quadratique :
              </p>
              <div className="p-2 rounded bg-black/40 text-center text-amber-300">
                <LatexMath math="\implies p_L(t) = \frac{\mathrm{d}}{\mathrm{d}t}\left(\frac{1}{2} L i_L(t)^2\right) = \frac{\mathrm{d}\mathcal{E}_m}{\mathrm{d}t}" />
              </div>
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-center text-amber-300 font-bold">
                <LatexMath math="\text{D'où :} \quad \mathcal{E}_m = \frac{1}{2} L i_L^2" />
              </div>
            </div>
          </CollapsibleProof>
        </div>

        {/* Continuity Rules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-1.5">
            <h4 className="text-xs font-bold uppercase text-cyan-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Propriété de Continuité : Condensateur
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Une discontinuité de <LatexMath math="u_C(t)" /> exigerait une dérivée <LatexMath math="\frac{\mathrm{d}u_C}{\mathrm{d}t} \to \infty" />, donc un courant <LatexMath math="i_C \to \infty" /> (puissance infinie physiquement impossible).
            </p>
            <div className="p-2 rounded bg-background/60 text-center font-mono text-cyan-300 font-bold text-xs">
              <LatexMath math="u_C(t^+) = u_C(t^-) \quad \text{(Tension continue)}" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
            <h4 className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Propriété de Continuité : Bobine
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Une discontinuité de <LatexMath math="i_L(t)" /> exigerait une dérivée <LatexMath math="\frac{\mathrm{d}i_L}{\mathrm{d}t} \to \infty" />, donc une surtension <LatexMath math="u_L \to \infty" /> (étincelle de rupture).
            </p>
            <div className="p-2 rounded bg-background/60 text-center font-mono text-amber-300 font-bold text-xs">
              <LatexMath math="i_L(t^+) = i_L(t^-) \quad \text{(Courant continu)}" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTIE 7: AUTO-ÉVALUATION & QUIZ ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Partie 7 • Validation & Auto-Évaluation</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
          7. Auto-Évaluation des Fondements
        </h2>

        {/* Quick Quiz */}
        <QuickQuiz />
      </section>
    </div>
  );
}
