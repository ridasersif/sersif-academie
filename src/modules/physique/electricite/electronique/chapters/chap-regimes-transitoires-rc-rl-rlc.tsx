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
  Clock,
  BatteryCharging,
  ShieldAlert,
  RotateCcw,
  X,
  ExternalLink,
  Eye,
} from "lucide-react";
import LatexMath from "@/components/ui/LatexMath";

// Dynamic Transient Simulator Canvas
const RegimesTransitoiresSimulator = dynamic(
  () => import("../components/RegimesTransitoiresSimulator"),
  { ssr: false }
);

const RCCircuitVirtualLab = dynamic(
  () => import("../components/RCCircuitVirtualLab"),
  { ssr: false }
);

const RLCircuitVirtualLab = dynamic(
  () => import("../components/RLCircuitVirtualLab"),
  { ssr: false }
);

const RLCCircuitVirtualLab = dynamic(
  () => import("../components/RLCCircuitVirtualLab"),
  { ssr: false }
);

/* ── INTERACTIVE PROOF MODAL COMPONENT (POPUP DIALOG) ── */
interface ProofModalData {
  title: string;
  badge: string;
  color: "cyan" | "purple" | "indigo" | "rose";
  steps: {
    step: string;
    desc: string;
    math?: string;
    note?: string;
  }[];
  finalFormula: string;
  finalNote?: string;
}

/* ── EQUATION PROOFS DATA FOR INTERACTIVE POPUP MODALS ── */
const EQUATION_PROOFS_DATA: Record<string, ProofModalData> = {
  charge_uc: {
    title: "Démonstration : Équation Différentielle de la Tension uC(t) en Charge",
    badge: "Charge • Tension uC(t)",
    color: "cyan",
    steps: [
      {
        step: "1. Loi d'additivité des tensions (Loi des mailles)",
        desc: "Dans la maille fermée en position (1), la tension du générateur E est égale à la somme des tensions aux bornes des dipôles :",
        math: "u_C(t) + u_R(t) = E",
      },
      {
        step: "2. Application de la loi d'Ohm au conducteur ohmique",
        desc: "La tension aux bornes de la résistance R s'exprime en fonction de l'intensité i(t) :",
        math: "u_R(t) = R \\cdot i(t) \\implies u_C(t) + R \\cdot i(t) = E",
      },
      {
        step: "3. Relation fondamentale du condensateur en convention récepteur",
        desc: "L'intensité du courant électrique est proportionnelle à la dérivée de la tension uC(t) :",
        math: "i(t) = \\frac{dq(t)}{dt} = C \\frac{du_C(t)}{dt}",
      },
      {
        step: "4. Substitution et mise sous forme canonique",
        desc: "On remplace l'expression du courant i(t) dans la loi des mailles :",
        math: "u_C(t) + R \\cdot C \\frac{du_C(t)}{dt} = E \\iff \\tau \\frac{du_C}{dt} + u_C(t) = E",
        note: "avec τ = R·C la constante de temps du circuit en secondes (s).",
      },
    ],
    finalFormula: "u_C(t) + R C \\frac{du_C}{dt} = E \\iff \\tau \\frac{du_C}{dt} + u_C(t) = E",
    finalNote: "Équation différentielle linéaire du 1er ordre à coefficients constants avec second membre constant.",
  },
  charge_q: {
    title: "Démonstration : Équation Différentielle de la Charge q(t) en Charge",
    badge: "Charge • Charge q(t)",
    color: "cyan",
    steps: [
      {
        step: "1. Loi d'additivité des tensions",
        desc: "Dans la maille de charge :",
        math: "u_C(t) + u_R(t) = E",
      },
      {
        step: "2. Loi d'Ohm pour le résistor",
        desc: "On remplace uR par R·i :",
        math: "u_C(t) + R \\cdot i(t) = E",
      },
      {
        step: "3. Relation constitutive de la charge d'un condensateur",
        desc: "La charge q(t) portée par l'armature positive est liée à la tension par q = C·uC <=> uC = q / C :",
        math: "\\frac{q(t)}{C} + R \\cdot i(t) = E",
      },
      {
        step: "4. Multiplication de toute l'équation par la capacité C",
        desc: "Pour éliminer le dénominateur :",
        math: "C \\times \\left( \\frac{q(t)}{C} + R \\cdot i(t) \\right) = C \\times E \\implies q(t) + R \\cdot C \\cdot i(t) = C \\cdot E",
      },
      {
        step: "5. Utilisation de la définition du courant i(t) = dq/dt",
        desc: "En substituant i(t) par la dérivée temporelle de la charge dq/dt :",
        math: "q(t) + R \\cdot C \\frac{dq(t)}{dt} = C \\cdot E = Q_{\\max}",
      },
    ],
    finalFormula: "q(t) + R C \\frac{dq}{dt} = C \\cdot E \\iff \\tau \\frac{dq}{dt} + q(t) = Q_{\\max}",
    finalNote: "avec Qmax = C·E la charge maximale finale atteinte à régime permanent.",
  },
  charge_i: {
    title: "Démonstration : Équation Différentielle de l'Intensité i(t) en Charge",
    badge: "Charge • Courant i(t)",
    color: "cyan",
    steps: [
      {
        step: "1. Loi des mailles",
        desc: "On part de la relation liant tension du condensateur et résistance :",
        math: "u_C(t) + R \\cdot i(t) = E",
      },
      {
        step: "2. Dérivation de toute l'équation par rapport au temps t",
        desc: "Puisque la f.é.m E du générateur continu est constante (dE/dt = 0) :",
        math: "\\frac{d}{dt} \\left[ u_C(t) + R \\cdot i(t) \\right] = \\frac{dE}{dt} \\implies \\frac{du_C(t)}{dt} + R \\frac{di(t)}{dt} = 0",
      },
      {
        step: "3. Relation du condensateur duC/dt = i(t) / C",
        desc: "Sachant que i = C·(duC/dt) <=> duC/dt = i / C :",
        math: "\\frac{i(t)}{C} + R \\frac{di(t)}{dt} = 0",
      },
      {
        step: "4. Multiplication par C et mise sous forme canonique",
        desc: "En multipliant par la capacité C :",
        math: "i(t) + R \\cdot C \\frac{di(t)}{dt} = 0 \\iff \\tau \\frac{di}{dt} + i(t) = 0",
      },
    ],
    finalFormula: "i(t) + R C \\frac{di}{dt} = 0 \\iff \\tau \\frac{di}{dt} + i(t) = 0",
    finalNote: "L'équation est homogène (sans second membre) car la tension E est constante dans le temps.",
  },
  decharge_uc: {
    title: "Démonstration : Équation Différentielle de la Tension uC(t) en Décharge",
    badge: "Décharge • Tension uC(t)",
    color: "purple",
    steps: [
      {
        step: "1. Loi des mailles sans générateur (Position 2)",
        desc: "Le circuit de décharge est autonome (circuit libre, E = 0) :",
        math: "u_C(t) + u_R(t) = 0",
      },
      {
        step: "2. Application de la loi d'Ohm",
        desc: "La résistance dissipe l'énergie selon la loi d'Ohm :",
        math: "u_R(t) = R \\cdot i(t) \\implies u_C(t) + R \\cdot i(t) = 0",
      },
      {
        step: "3. Remplacement du courant i(t) = C·(duC/dt)",
        desc: "En insérant la relation tension-courant du condensateur :",
        math: "u_C(t) + R \\cdot C \\frac{du_C(t)}{dt} = 0 \\iff \\tau \\frac{du_C}{dt} + u_C(t) = 0",
      },
    ],
    finalFormula: "u_C(t) + R C \\frac{du_C}{dt} = 0 \\iff \\tau \\frac{du_C}{dt} + u_C(t) = 0",
    finalNote: "Solution : uC(t) = E·exp(-t/τ) avec uC(0) = E.",
  },
  decharge_q: {
    title: "Démonstration : Équation Différentielle de la Charge q(t) en Décharge",
    badge: "Décharge • Charge q(t)",
    color: "purple",
    steps: [
      {
        step: "1. Loi des mailles en décharge",
        desc: "Somme des tensions nulle :",
        math: "u_C(t) + R \\cdot i(t) = 0",
      },
      {
        step: "2. Expression en fonction de la charge q(t) = C·uC",
        desc: "Remplacement de uC par q/C :",
        math: "\\frac{q(t)}{C} + R \\cdot i(t) = 0",
      },
      {
        step: "3. Multiplication par C et substitution de i(t) = dq/dt",
        desc: "En multipliant par C :",
        math: "q(t) + R \\cdot C \\frac{dq(t)}{dt} = 0 \\iff \\tau \\frac{dq}{dt} + q(t) = 0",
      },
    ],
    finalFormula: "q(t) + R C \\frac{dq}{dt} = 0 \\iff \\tau \\frac{dq}{dt} + q(t) = 0",
    finalNote: "Solution : q(t) = Qmax·exp(-t/τ) avec Qmax = C·E.",
  },
  decharge_i: {
    title: "Démonstration : Équation Différentielle de l'Intensité i(t) en Décharge",
    badge: "Décharge • Courant i(t)",
    color: "purple",
    steps: [
      {
        step: "1. Loi des mailles",
        desc: "Dans la maille sans générateur :",
        math: "u_C(t) + R \\cdot i(t) = 0",
      },
      {
        step: "2. Dérivation par rapport au temps",
        desc: "Dérivée de la somme :",
        math: "\\frac{du_C(t)}{dt} + R \\frac{di(t)}{dt} = 0",
      },
      {
        step: "3. Substitution de duC/dt = i(t) / C et multiplication par C",
        desc: "On remplace duC/dt par i/C :",
        math: "\\frac{i(t)}{C} + R \\frac{di(t)}{dt} = 0 \\implies i(t) + R \\cdot C \\frac{di(t)}{dt} = 0",
      },
    ],
    finalFormula: "i(t) + R C \\frac{di}{dt} = 0 \\iff \\tau \\frac{di}{dt} + i(t) = 0",
    finalNote: "Courant de décharge : i(t) = - (E/R)·exp(-t/τ) (le signe - indique le sens de décharge inverse).",
  },
};

/* ── MODAL DIALOG COMPONENT FOR EQUATION PROOFS ── */
function ProofModalDialog({
  modalKey,
  onClose,
}: {
  modalKey: string | null;
  onClose: () => void;
}) {
  if (!modalKey || !EQUATION_PROOFS_DATA[modalKey]) return null;
  const data = EQUATION_PROOFS_DATA[modalKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/40 p-5 sm:p-7 shadow-2xl space-y-4 text-xs sm:text-sm text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {data.badge}
            </span>
            <h3 className="text-sm sm:text-base font-black text-white">{data.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 border border-slate-700 transition cursor-pointer shrink-0"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="space-y-3 pt-1">
          {data.steps.map((s, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="font-bold text-cyan-300 block text-xs">
                {s.step}
              </span>
              <p className="text-slate-300 text-xs leading-relaxed">{s.desc}</p>
              {s.math && (
                <div className="p-2 rounded-lg bg-slate-900 font-mono text-center text-cyan-200 font-bold text-xs sm:text-sm">
                  <LatexMath math={s.math} />
                </div>
              )}
              {s.note && (
                <p className="text-[11px] text-amber-300 italic">{s.note}</p>
              )}
            </div>
          ))}
        </div>

        {/* Final Formula Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500 text-center space-y-1.5">
          <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
            Forme Canonique Finale :
          </span>
          <div className="font-mono text-sm sm:text-base font-bold text-white">
            <LatexMath math={data.finalFormula} />
          </div>
          {data.finalNote && (
            <p className="text-[11px] text-slate-300">{data.finalNote}</p>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg cursor-pointer"
          >
            Compris & Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Collapsible Proof Component (Exact Match with Chapter 2 & 3) ── */
function CollapsibleProof({
  title,
  subtitle,
  children,
  badge,
  color = "cyan",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
  color?: "cyan" | "amber" | "emerald" | "indigo" | "rose" | "purple";
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
    purple: {
      border: "border-purple-500/30",
      bg: "bg-purple-950/20",
      badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    },
  }[color];

  return (
    <div className={`my-3 rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-md overflow-hidden transition-all duration-200`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-white/[0.03] transition-colors cursor-pointer group"
      >
        <div className="space-y-1 pr-3 flex-1">
          {badge && (
            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colors.badge} mb-1`}>
              {badge}
            </span>
          )}
          <h4 className="text-sm sm:text-base font-bold text-foreground group-hover:text-cyan-300 transition-colors flex items-center flex-wrap gap-1.5">
            {title}
          </h4>
          {subtitle && <div className="text-xs text-muted-foreground flex items-center flex-wrap gap-1">{subtitle}</div>}
        </div>
        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 shrink-0 group-hover:border-slate-500 transition-colors">
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

/* ── INLINE COLLAPSIBLE EQUATION CARD (MINIMALIST & SLEEK) ── */
function ProofCollapsibleCard({
  num,
  title,
  shortDesc,
  formula,
  proofSteps,
  finalFormula,
  theme = "cyan",
  defaultOpen = false,
  extraContent,
}: {
  num: string;
  title: string;
  shortDesc?: React.ReactNode;
  formula: string;
  proofSteps: { step: string; desc: string; math?: string; note?: string }[];
  finalFormula: string;
  theme?: "cyan" | "purple" | "indigo" | "emerald" | "amber" | "rose";
  defaultOpen?: boolean;
  extraContent?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const themeMap = {
    cyan: {
      activeBorder: "border-cyan-500/50 ring-cyan-500/30 shadow-cyan-500/10",
      badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
      titleHover: "group-hover:text-cyan-300",
      formula: "text-cyan-300",
      btnOpen: "bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-500/20",
      drawer: "border-cyan-500/20 bg-cyan-950/10",
      sparkle: "text-cyan-400",
      stepTitle: "text-cyan-300",
      finalBox: "bg-cyan-950/40 border-cyan-500/40 text-cyan-200",
    },
    purple: {
      activeBorder: "border-purple-500/50 ring-purple-500/30 shadow-purple-500/10",
      badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      titleHover: "group-hover:text-purple-300",
      formula: "text-purple-300",
      btnOpen: "bg-purple-950/60 border-purple-500/40 text-purple-300 shadow-md shadow-purple-500/20",
      drawer: "border-purple-500/20 bg-purple-950/10",
      sparkle: "text-purple-400",
      stepTitle: "text-purple-300",
      finalBox: "bg-purple-950/40 border-purple-500/40 text-purple-200",
    },
    indigo: {
      activeBorder: "border-indigo-500/50 ring-indigo-500/30 shadow-indigo-500/10",
      badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      titleHover: "group-hover:text-indigo-300",
      formula: "text-indigo-300",
      btnOpen: "bg-indigo-950/60 border-indigo-500/40 text-indigo-300 shadow-md shadow-indigo-500/20",
      drawer: "border-indigo-500/20 bg-indigo-950/10",
      sparkle: "text-indigo-400",
      stepTitle: "text-indigo-300",
      finalBox: "bg-indigo-950/40 border-indigo-500/40 text-indigo-200",
    },
    emerald: {
      activeBorder: "border-emerald-500/50 ring-emerald-500/30 shadow-emerald-500/10",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      titleHover: "group-hover:text-emerald-300",
      formula: "text-emerald-300",
      btnOpen: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/20",
      drawer: "border-emerald-500/20 bg-emerald-950/10",
      sparkle: "text-emerald-400",
      stepTitle: "text-emerald-300",
      finalBox: "bg-emerald-950/40 border-emerald-500/40 text-emerald-200",
    },
    amber: {
      activeBorder: "border-amber-500/50 ring-amber-500/30 shadow-amber-500/10",
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      titleHover: "group-hover:text-amber-300",
      formula: "text-amber-300",
      btnOpen: "bg-amber-950/60 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/20",
      drawer: "border-amber-500/20 bg-amber-950/10",
      sparkle: "text-amber-400",
      stepTitle: "text-amber-300",
      finalBox: "bg-amber-950/40 border-amber-500/40 text-amber-200",
    },
    rose: {
      activeBorder: "border-rose-500/50 ring-rose-500/30 shadow-rose-500/10",
      badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      titleHover: "group-hover:text-rose-300",
      formula: "text-rose-300",
      btnOpen: "bg-rose-950/60 border-rose-500/40 text-rose-300 shadow-md shadow-rose-500/20",
      drawer: "border-rose-500/20 bg-rose-950/10",
      sparkle: "text-rose-400",
      stepTitle: "text-rose-300",
      finalBox: "bg-rose-950/40 border-rose-500/40 text-rose-200",
    },
  };

  const st = themeMap[theme] || themeMap.cyan;

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isOpen
          ? `bg-slate-900/95 shadow-xl ring-1 ${st.activeBorder}`
          : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
      }`}
    >
      {/* Clickable Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer group transition-colors"
      >
        <div className="space-y-1.5 flex-1 pr-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${st.badge}`}
            >
              {num}
            </span>
            <span className={`font-bold text-xs sm:text-[13px] text-slate-200 ${st.titleHover}`}>
              {title}
            </span>
          </div>

          {shortDesc && <div className="text-slate-400 text-[11px] pl-7">{shortDesc}</div>}

          <div className={`font-mono font-bold text-center py-1 text-sm sm:text-base ${st.formula}`}>
            <LatexMath math={formula} />
          </div>
        </div>

        <div
          className={`p-2 rounded-xl border shrink-0 transition-all duration-200 ${
            isOpen
              ? st.btnOpen
              : "bg-slate-900 border-slate-800 text-slate-400 group-hover:text-white group-hover:border-slate-700"
          }`}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Step-by-Step Proof Drawer */}
      {isOpen && (
        <div
          className={`px-4 sm:px-5 pb-5 pt-3 border-t space-y-3 text-xs animate-in fade-in slide-in-from-top-2 duration-200 ${st.drawer}`}
        >
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            <Sparkles className={`w-3.5 h-3.5 ${st.sparkle}`} />
            <span>Démonstration Pas-à-Pas :</span>
          </div>

          <div className="space-y-2.5">
            {proofSteps.map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1">
                <span className={`font-bold block text-[11px] ${st.stepTitle}`}>
                  {s.step}
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">{s.desc}</p>
                {s.math && (
                  <div className="p-2 rounded-lg bg-slate-900 font-mono text-center text-slate-100 font-bold text-xs sm:text-sm">
                    <LatexMath math={s.math} />
                  </div>
                )}
                {s.note && <p className="text-[10px] text-amber-300 italic">{s.note}</p>}
              </div>
            ))}
          </div>

          <div className={`p-3 rounded-2xl border text-center font-mono font-bold text-xs sm:text-sm ${st.finalBox}`}>
            <LatexMath math={finalFormula} />
          </div>

          {extraContent && <div className="pt-2">{extraContent}</div>}
        </div>
      )}
    </div>
  );
}

const CollapsibleEquationCard = ProofCollapsibleCard;

/* ── Interactive QCM Component (12 Questions) ── */
function ChapTransitoiresQuickQuiz() {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      q: "Pourquoi la tension u_C(t) aux bornes d'un condensateur est-elle obligatoirement continue au cours du temps ?",
      qMath: "\\text{Continuité de } u_C(t)",
      optionsMath: [
        "\\text{Parce que l'énergie électrostatique } E_C = \\frac{1}{2} C u_C^2 \\text{ ne peut pas varier instantanément (puissance finie)}",
        "\\text{Parce que la résistance du circuit est nulle}",
        "\\text{Parce que le courant } i(t) \\text{ est toujours constant}",
        "\\text{Parce que la charge } q \\text{ est indépendante de } u_C",
      ],
      correct: 0,
      explanation: "Une discontinuité de tension u_C impliquerait une discontinuité d'énergie, ce qui exigerait une puissance infinie P = dE/dt = ∞, physiquement impossible.",
    },
    {
      q: "Quelle est l'expression de la constante de temps τ dans un circuit RC série ?",
      qMath: "\\tau \\text{ dans le circuit RC série}",
      optionsMath: [
        "\\tau = R C",
        "\\tau = \\frac{R}{C}",
        "\\tau = \\frac{C}{R}",
        "\\tau = \\frac{1}{R C}",
      ],
      correct: 0,
      explanation: "L'équation différentielle R C du_C/dt + u_C = E montre que la constante de temps caractéristique homogène à un temps est τ = R*C.",
      expMath: "\\tau = R C \\quad [\\Omega \\cdot \\text{F} = \\text{s}]",
    },
    {
      q: "Au bout de combien de temps considère-t-on que la charge d'un condensateur a atteint 99% de sa valeur finale E ?",
      qMath: "\\text{Temps d'établissement à 99\\% de } u_C(t)",
      optionsMath: [
        "t \\approx 5\\tau",
        "t = \\tau",
        "t \\approx 3\\tau",
        "t = 10\\tau",
      ],
      correct: 0,
      explanation: "u_C(5τ) = E(1 - e⁻⁵) = E(1 - 0.0067) ≈ 0.993 E = 99.3%. À 3τ on atteint 95%, et à 5τ on atteint plus de 99%.",
      expMath: "u_C(5\\tau) = E(1 - e^{-5}) \\approx 0.993 E",
    },
    {
      q: "Lors de la charge complète d'un condensateur initialement déchargé par un générateur de tension E, quelle part de l'énergie fournie est dissipée en chaleur par effet Joule ?",
      qMath: "\\text{Bilan énergétique de la charge RC}",
      optionsMath: [
        "\\text{Exactement 50\\% de l'énergie fournie par le générateur } (W_J = \\frac{1}{2} C E^2)",
        "\\text{0\\% si la résistance R est très petite}",
        "\\text{100\\% de l'énergie}",
        "\\text{25\\% de l'énergie}",
      ],
      correct: 0,
      explanation: "Le générateur fournit W_g = C*E², le condensateur stocke E_C = (1/2)*C*E², et exactement la moitié W_J = (1/2)*C*E² est dissipée par effet Joule, quelle que soit la valeur de R !",
      expMath: "W_g = C E^2, \\quad E_C = \\frac{1}{2} C E^2, \\quad W_J = W_g - E_C = \\frac{1}{2} C E^2",
    },
    {
      q: "Quelle est l'expression de la constante de temps τ dans un circuit RL série ?",
      qMath: "\\tau \\text{ dans le circuit RL série}",
      optionsMath: [
        "\\tau = \\frac{L}{R}",
        "\\tau = R L",
        "\\tau = \\frac{R}{L}",
        "\\tau = \\sqrt{L R}",
      ],
      correct: 0,
      explanation: "L'équation différentielle (L/R) di/dt + i = E/R s'écrit τ di/dt + i = I₀ avec τ = L/R.",
      expMath: "\\tau = \\frac{L}{R} \\quad [\\text{H}/\\Omega = \\text{s}]",
    },
    {
      q: "Pourquoi place-t-on une 'diode de roue libre' en parallèle inverse sur une bobine inductive pilotée par un interrupteur ?",
      qMath: "\\text{Rôle de la diode de roue libre}",
      optionsMath: [
        "\\text{Pour éviter la surtension destructive } u_L = -L \\frac{di}{dt} \\to \\infty \\text{ à l'ouverture de l'interrupteur}",
        "\\text{Pour augmenter le courant maximal dans la bobine}",
        "\\text{Pour annuler la résistance de la bobine}",
        "\\text{Pour charger la bobine plus rapidement}",
      ],
      correct: 0,
      explanation: "À l'ouverture brutale du circuit, le courant tente de s'annuler instantanément (di/dt -> -∞), créant une surtension gigantesque qui peut détruire l'interrupteur ou générer un arc électrique.",
    },
    {
      q: "Dans un circuit RLC série libre, quelle est l'expression de la résistance critique R_c séparant le régime oscillant du régime apériodique ?",
      qMath: "R_c \\text{ (Résistance critique)}",
      optionsMath: [
        "R_c = 2\\sqrt{\\frac{L}{C}}",
        "R_c = \\sqrt{\\frac{L}{C}}",
        "R_c = \\frac{1}{2}\\sqrt{\\frac{L}{C}}",
        "R_c = 2\\sqrt{LC}",
      ],
      correct: 0,
      explanation: "Le discriminant s'annule pour λ = ω₀ <=> R/(2L) = 1/√(LC) <=> R_c = 2√(L/C), correspondant à un facteur de qualité Q = 1/2.",
      expMath: "\\Delta' = 0 \\iff R_c = 2\\sqrt{\\frac{L}{C}} \\quad (Q = 0.5)",
    },
    {
      q: "Quel est le comportement d'un circuit RLC série lorsque la résistance est inférieure à la résistance critique (R < R_c, soit Q > 1/2) ?",
      qMath: "\\text{Régime pour } R < R_c",
      optionsMath: [
        "\\text{Régime Pseudo-Périodique (oscillations amorties de pseudo-période } T > T_0 \\text{)}",
        "\\text{Régime Apériodique sans oscillations}",
        "\\text{Régime Critique}",
        "\\text{Oscillations entretenues sinusoïdales pures sans amortissement}",
      ],
      correct: 0,
      explanation: "Pour R < R_c, les racines de l'équation caractéristique sont complexes conjuguées, donnant des oscillations sinusoïdales amorties par une enveloppe exponentielle.",
    },
    {
      q: "Comment s'exprime la pseudo-pulsation ω d'un circuit RLC en régime pseudo-périodique en fonction de ω₀ et λ ?",
      qMath: "\\omega \\text{ (Pseudo-pulsation des oscillations)}",
      optionsMath: [
        "\\omega = \\sqrt{\\omega_0^2 - \\lambda^2} = \\omega_0 \\sqrt{1 - \\frac{1}{4Q^2}}",
        "\\omega = \\omega_0 + \\lambda",
        "\\omega = \\sqrt{\\omega_0^2 + \\lambda^2}",
        "\\omega = \\frac{\\omega_0}{Q}",
      ],
      correct: 0,
      explanation: "Les racines caractéristiques r = -λ ± jω ont pour partie imaginaire la pseudo-pulsation ω = √(ω₀² - λ²).",
      expMath: "\\omega = \\sqrt{\\omega_0^2 - \\lambda^2} < \\omega_0 \\implies T = \\frac{2\\pi}{\\omega} > T_0",
    },
    {
      q: "Dans l'exercice de synthèse (circuit RL fermé à t=0 sous tension alternative e(t) = E·cos(ωt) avec i(0) = 0), quelle est l'expression complète du courant i(t) ?",
      qMath: "i(t) \\text{ sous échelon sinusoïdal}",
      optionsMath: [
        "i(t) = I_m \\left[ \\cos(\\omega t - \\phi) - \\cos\\phi \\cdot e^{-t/\\tau} \\right]",
        "i(t) = I_m \\cos(\\omega t - \\phi)",
        "i(t) = I_m (1 - e^{-t/\\tau}) \\cos(\\omega t)",
        "i(t) = I_m \\sin(\\omega t) \\cdot e^{-t/\\tau}",
      ],
      correct: 0,
      explanation: "La solution générale i(t) = A·exp(-t/τ) + I_m·cos(ωt - φ) avec la condition initiale i(0) = 0 donne A = -I_m·cos(φ).",
      expMath: "i(t) = \\underbrace{-I_m \\cos\\phi \\cdot e^{-t/\\tau}}_{\\text{Régime transitoire}} + \\underbrace{I_m \\cos(\\omega t - \\phi)}_{\\text{Régime permanent forcé}}",
    },
    {
      q: "Que devient le courant i(t) dans le circuit RL précédent lorsque le temps t devient grand devant la constante de temps (t >> τ) ?",
      qMath: "\\lim_{t \\to \\infty} i(t)",
      optionsMath: [
        "i(t) \\to I_m \\cos(\\omega t - \\phi) \\quad (\\text{Le régime transitoire s'éteint et il ne reste que le RSF})",
        "i(t) \\to 0",
        "i(t) \\to \\frac{E}{R}",
        "i(t) \\to \\infty",
      ],
      correct: 0,
      explanation: "Le terme transitoire exponentiel décroît vers zéro exp(-t/τ) -> 0, laissant uniquement le régime sinusoïdal forcé permanent.",
    },
    {
      q: "Quelle grandeur mesure le décrément logarithmique δ dans un oscillateur RLC amorti ?",
      qMath: "\\delta = \\ln\\left(\\frac{u(t)}{u(t+T)}\\right)",
      optionsMath: [
        "\\delta = \\lambda T = \\frac{2\\pi}{\\sqrt{4Q^2 - 1}} \\quad (\\text{Vitesse d'amortissement de l'amplitude par période})",
        "\\delta = \\frac{T}{\\tau}",
        "\\delta = \\omega_0 T",
        "\\delta = Q \\cdot T",
      ],
      correct: 0,
      explanation: "Le décrément logarithmique quantifie la décroissance relative des amplitudes successives séparées d'une pseudo-période T : δ = ln(u(t)/u(t+T)) = λ·T.",
      expMath: "\\delta = \\lambda T = \\frac{\\pi}{Q \\sqrt{1 - \\frac{1}{4Q^2}}}",
    },
  ];

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            QCM d&apos;Auto-Évaluation : Régimes Transitoires (12 Questions)
          </h3>
        </div>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
          Niveau CPGE / Université
        </span>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const userAns = selectedAnswers[idx];
          const isCorrect = userAns === q.correct;

          return (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-200">
                  <span className="text-indigo-400 font-mono mr-1.5">{idx + 1}.</span>
                  {q.q}
                </span>
              </div>

              {q.qMath && (
                <div className="text-xs text-indigo-300 font-mono bg-indigo-950/20 px-2.5 py-1 rounded-lg border border-indigo-500/20 inline-block">
                  <LatexMath math={q.qMath} />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.optionsMath.map((opt, optIdx) => {
                  const isSelected = userAns === optIdx;
                  let btnClass = "border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300";

                  if (showResults) {
                    if (optIdx === q.correct) {
                      btnClass = "border-emerald-500/60 bg-emerald-950/30 text-emerald-300 font-bold";
                    } else if (isSelected) {
                      btnClass = "border-rose-500/60 bg-rose-950/30 text-rose-300";
                    }
                  } else if (isSelected) {
                    btnClass = "border-indigo-500/60 bg-indigo-950/40 text-indigo-200 font-bold";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => setSelectedAnswers({ ...selectedAnswers, [idx]: optIdx })}
                      className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between gap-2 ${btnClass}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] shrink-0 font-mono">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span><LatexMath math={opt} /></span>
                      </div>
                      {showResults && optIdx === q.correct && (
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className={`p-2.5 rounded-xl text-xs space-y-1 ${isCorrect ? "bg-emerald-950/20 border border-emerald-500/20 text-emerald-300" : "bg-rose-950/20 border border-rose-500/20 text-rose-300"}`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                    <span>{isCorrect ? "Correct !" : "Explication :"}</span>
                  </div>
                  <p className="text-slate-300">{q.explanation}</p>
                  {q.expMath && (
                    <div className="font-mono text-indigo-300 mt-1">
                      <LatexMath math={q.expMath} />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <button
          onClick={() => setShowResults(!showResults)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg cursor-pointer"
        >
          {showResults ? "Masquer les Solutions" : "Vérifier mes Réponses"}
        </button>

        <button
          onClick={() => {
            setSelectedAnswers({});
            setShowResults(false);
          }}
          className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Réinitialiser</span>
        </button>
      </div>
    </div>
  );
}

/* ── MAIN COMPONENT : CHAPITRE RÉGIMES TRANSITOIRES (RC, RL, RLC) ── */
export default function ChapRegimesTransitoiresRCRlRlc() {
  return (
    <div className="space-y-8 font-sans pb-12">
      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Physique & Électrocinétique • Chapitre 03</span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Régimes Transitoires des Circuits Linéaires (RC, RL, RLC)
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Étude temporelle rigoureuse des équations différentielles du 1er et 2ème ordre, continuité des grandeurs énergétiques, bilans de puissance, et résolution complète de l&apos;établissement du régime sinusoïdal forcé.
          </p>

          <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-cyan-300 border border-slate-700">
              <LatexMath math="\tau_{RC} = RC" />
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-emerald-300 border border-slate-700">
              <LatexMath math="\tau_{RL} = L/R" />
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-purple-300 border border-slate-700">
              <LatexMath math="R_c = 2\sqrt{L/C}" />
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-800/80 text-amber-300 border border-slate-700">
              <LatexMath math="i(t) = i_h(t) + i_p(t)" />
            </span>
          </div>
        </div>
      </div>

      {/* ── 1. INTRODUCTION PÉDAGOGIQUE & CONTINUITÉ DE L'ÉNERGIE ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BatteryCharging className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
            1. Introduction Progressive : Notion de Régime Transitoire & Continuité
          </h2>
        </div>

        {/* Pedagogical Motivation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/20 space-y-3 text-xs leading-relaxed">
          <div className="flex items-center gap-2 text-indigo-300 font-bold uppercase tracking-wider text-xs">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Qu&apos;est-ce qu&apos;un Régime Transitoire en Électricité ?</span>
          </div>
          <p className="text-slate-300">
            Lorsqu&apos;on modifie l&apos;état d&apos;un circuit électrique (fermeture ou ouverture d&apos;un interrupteur, commutation de source), le circuit ne passe pas instantanément de son état initial à son nouvel état d&apos;équilibre.
          </p>
          <p className="text-slate-300">
            La phase intermédiaire d&apos;évolution temporelle qui relie deux états permanents s&apos;appelle le <strong>Régime Transitoire</strong>. Il est gouverné par des <strong>équations différentielles</strong> résultant du temps nécessaire aux dipôles réactifs (condensateurs et bobines) pour accumuler ou restituer leur énergie.
          </p>
        </div>

        {/* Continuity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/20 space-y-2">
            <h3 className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continuité de la Tension du Condensateur : uC(0⁺) = uC(0⁻)</span>
            </h3>
            <p className="text-slate-300">
              L&apos;énergie électrostatique stockée dans un condensateur vaut :
            </p>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-cyan-300 font-bold">
              <LatexMath math="E_C(t) = \frac{1}{2} C [u_C(t)]^2" />
            </div>
            <p className="text-slate-400">
              Une discontinuité de <LatexMath math="u_C" /> nécessiterait une puissance infinie (<LatexMath math="P = \frac{dE_C}{dt} \to \infty" />), ce qui est physiquement impossible. Donc <LatexMath math="u_C(t)" /> et la charge <LatexMath math="q(t) = C u_C(t)" /> sont <strong>rigoureusement continues</strong> :
            </p>
            <div className="text-center font-mono text-cyan-300 font-bold">
              <LatexMath math="u_C(0^+) = u_C(0^-) \quad \text{et} \quad q(0^+) = q(0^-)" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-emerald-500/20 space-y-2">
            <h3 className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continuité du Courant dans une Bobine : iL(0⁺) = iL(0⁻)</span>
            </h3>
            <p className="text-slate-300">
              L&apos;énergie magnétique emmagasinée dans une inductance vaut :
            </p>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-emerald-300 font-bold">
              <LatexMath math="E_L(t) = \frac{1}{2} L [i_L(t)]^2" />
            </div>
            <p className="text-slate-400">
              Par conservation de l&apos;énergie magnétique, le courant <LatexMath math="i_L(t)" /> traversant la bobine ne peut pas subir de saut instantané :
            </p>
            <div className="text-center font-mono text-emerald-300 font-bold">
              <LatexMath math="i_L(0^+) = i_L(0^-)" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. ÉTUDE COMPLÈTE DU CIRCUIT RC : 3 ÉTAPES MÉTHODIQUES ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
            2. Circuit RC Série : Étude Méthodique en 3 Étapes (Équations • Solutions • Courbes)
          </h2>
        </div>

        {/* ── ÉTAPE 1 : ÉTABLISSEMENT DES ÉQUATIONS DIFFÉRENTIELLES (CHARGE & DÉCHARGE) ── */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              <h3 className="text-sm sm:text-base font-bold text-cyan-300 uppercase tracking-wider">
                Étape 1 : Établissement des Équations Différentielles (Charge & Décharge)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              Loi des mailles • Relations caractéristiques
            </span>
          </div>

          {/* Circuit Schematics Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Position 1 : Charge */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3 shadow-lg shadow-cyan-950/20">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300 border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Position (1) : Charge du Condensateur</span>
                </span>
                <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Circulation du Courant Active
                </span>
              </div>

              <svg viewBox="0 0 340 230" className="w-full h-auto max-w-[320px] mx-auto select-none" style={{ fontFamily: "Cambria Math, 'Times New Roman', serif" }}>
                <defs>
                  <linearGradient id="r-box-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#083344" />
                    <stop offset="100%" stopColor="#0e7490" />
                  </linearGradient>
                </defs>

                {/* Cyber Grid Background */}
                <rect x="2" y="2" width="336" height="226" rx="10" fill="#020817" stroke="#0e3a4f" strokeWidth="1" />
                <path d="M 15 50 H 325 M 15 115 H 325 M 15 180 H 325" stroke="#0e2a3a" strokeWidth="0.5" strokeDasharray="3 3" />
                <path d="M 60 20 V 210 M 170 20 V 210 M 280 20 V 210" stroke="#0e2a3a" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* ── 1. INACTIVE DISCHARGE BRANCH (BAHAT / DIMMED) ── */}
                <path d="M 200 35 L 280 35 L 280 200 L 170 200" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="200" cy="35" r="3.5" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                <text x="200" y="24" fill="#64748b" fontSize="10" fontStyle="normal" fontWeight="bold" textAnchor="middle">(2)</text>

                {/* ── 2. ACTIVE CHARGE LOOP (NASAH / BRIGHT GLOWING CYAN) ── */}
                {/* Continuous Solid Wire Path */}
                <path d="M 170 200 L 60 200 L 60 135 M 60 115 L 60 35 L 140 35 L 170 52 L 170 70 M 170 110 L 170 140 M 170 152 L 170 200"
                  fill="none" stroke="#00f0ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

                {/* ── ANIMATED TRAVELING CURRENT CHARGES (HIGH-CONTRAST GLOWING ELECTRIC YELLOW) ── */}
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path="M 60 200 L 60 35 L 140 35 L 170 52 L 170 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="0.4s" repeatCount="indefinite" path="M 60 200 L 60 35 L 140 35 L 170 52 L 170 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path="M 60 200 L 60 35 L 140 35 L 170 52 L 170 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M 60 200 L 60 35 L 140 35 L 170 52 L 170 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="1.6s" repeatCount="indefinite" path="M 60 200 L 60 35 L 140 35 L 170 52 L 170 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="2.0s" repeatCount="indefinite" path="M 60 200 L 60 35 L 140 35 L 170 52 L 170 200 Z" />
                </circle>

                {/* ── DC GENERATOR (BATTERY SYMBOL) ── */}
                <line x1="42" y1="117" x2="78" y2="117" stroke="#00f0ff" strokeWidth="2.8" strokeLinecap="round" />
                <line x1="50" y1="127" x2="70" y2="127" stroke="#00f0ff" strokeWidth="4.5" strokeLinecap="round" />
                <text x="32" y="114" fill="#38bdf8" fontSize="14" fontWeight="bold" textAnchor="middle">+</text>
                <text x="34" y="136" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle">−</text>
                <text x="90" y="125" fill="#38bdf8" fontSize="12" fontStyle="italic" fontWeight="bold">E</text>

                {/* Current Arrow i on generator wire */}
                <line x1="60" y1="85" x2="60" y2="60" stroke="#ff007f" strokeWidth="2" />
                <polygon points="60,58 56,66 64,66" fill="#ff007f" />
                <text x="44" y="74" fill="#ff007f" fontSize="13" fontStyle="italic" fontWeight="bold">i</text>

                {/* ── SWITCH K (CLOSED TO POSITION 1) ── */}
                <circle cx="140" cy="35" r="3.5" fill="#00f0ff" stroke="#00f0ff" strokeWidth="1" />
                <text x="135" y="24" fill="#00f0ff" fontSize="10" fontStyle="normal" fontWeight="bold" textAnchor="middle">(1)</text>

                <circle cx="170" cy="52" r="3.5" fill="#00f0ff" stroke="#00f0ff" strokeWidth="1" />
                <line x1="140" y1="35" x2="170" y2="52" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />

                {/* ── RESISTOR R (CENTRAL BRANCH) ── */}
                <rect x="154" y="70" width="32" height="40" rx="3" fill="url(#r-box-cyan)" stroke="#38bdf8" strokeWidth="1.8" />
                <text x="170" y="95" fill="#e0f2fe" fontSize="14" fontStyle="italic" fontWeight="bold" textAnchor="middle">R</text>

                {/* ── CAPACITOR C (CENTRAL BRANCH) ── */}
                <rect x="146" y="140" width="48" height="3.5" rx="1.7" fill="#00f0ff" stroke="#38bdf8" strokeWidth="0.5" />
                <rect x="146" y="149" width="48" height="3.5" rx="1.7" fill="#00f0ff" stroke="#38bdf8" strokeWidth="0.5" />
                <text x="206" y="148" fill="#00f0ff" fontSize="14" fontStyle="italic" fontWeight="bold">C</text>
              </svg>
            </div>

            {/* Position 2 : Décharge */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-3 shadow-lg shadow-purple-950/20">
              <div className="flex items-center justify-between text-xs font-bold text-purple-300 border-b border-slate-800/80 pb-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span>Position (2) : Décharge du Condensateur</span>
                </span>
                <span className="font-mono text-[10px] text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded-full">
                  Circulation du Courant Active
                </span>
              </div>

              <svg viewBox="0 0 340 230" className="w-full h-auto max-w-[320px] mx-auto select-none" style={{ fontFamily: "Cambria Math, 'Times New Roman', serif" }}>
                <defs>
                  <linearGradient id="r-box-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b0764" />
                    <stop offset="100%" stopColor="#7e22ce" />
                  </linearGradient>
                </defs>

                {/* Cyber Grid Background */}
                <rect x="2" y="2" width="336" height="226" rx="10" fill="#020817" stroke="#4c1d95" strokeWidth="1" />
                <path d="M 15 50 H 325 M 15 115 H 325 M 15 180 H 325" stroke="#251240" strokeWidth="0.5" strokeDasharray="3 3" />
                <path d="M 60 20 V 210 M 170 20 V 210 M 280 20 V 210" stroke="#251240" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* ── 1. INACTIVE GENERATOR BRANCH (BAHAT / DIMMED) ── */}
                <path d="M 140 35 L 60 35 L 60 115 M 60 135 L 60 200 L 170 200" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="42" y1="117" x2="78" y2="117" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="50" y1="127" x2="70" y2="127" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
                <circle cx="140" cy="35" r="3.5" fill="#1e293b" stroke="#475569" strokeWidth="1.5" />
                <text x="135" y="24" fill="#64748b" fontSize="10" fontStyle="normal" fontWeight="bold" textAnchor="middle">(1)</text>

                {/* ── 2. ACTIVE DISCHARGE LOOP (NASAH / BRIGHT GLOWING PURPLE) ── */}
                {/* Continuous Solid Wire Path */}
                <path d="M 170 140 L 170 110 M 170 70 L 170 52 L 200 35 L 280 35 L 280 200 L 170 200 L 170 152"
                  fill="none" stroke="#c084fc" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

                {/* ── ANIMATED TRAVELING CURRENT CHARGES (HIGH-CONTRAST GLOWING ELECTRIC YELLOW) ── */}
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path="M 170 200 L 170 52 L 200 35 L 280 35 L 280 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="0.4s" repeatCount="indefinite" path="M 170 200 L 170 52 L 200 35 L 280 35 L 280 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path="M 170 200 L 170 52 L 200 35 L 280 35 L 280 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M 170 200 L 170 52 L 200 35 L 280 35 L 280 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="1.6s" repeatCount="indefinite" path="M 170 200 L 170 52 L 200 35 L 280 35 L 280 200 Z" />
                </circle>
                <circle r="2.8" fill="#fde047" stroke="#ffffff" strokeWidth="0.6">
                  <animateMotion dur="2.4s" begin="2.0s" repeatCount="indefinite" path="M 170 200 L 170 52 L 200 35 L 280 35 L 280 200 Z" />
                </circle>

                {/* ── SWITCH K (CLOSED TO POSITION 2) ── */}
                <circle cx="200" cy="35" r="3.5" fill="#c084fc" stroke="#c084fc" strokeWidth="1" />
                <text x="205" y="24" fill="#c084fc" fontSize="10" fontStyle="normal" fontWeight="bold" textAnchor="middle">(2)</text>

                <circle cx="170" cy="52" r="3.5" fill="#c084fc" stroke="#c084fc" strokeWidth="1" />
                <line x1="170" y1="52" x2="200" y2="35" stroke="#c084fc" strokeWidth="3" strokeLinecap="round" />

                {/* ── RESISTOR R ── */}
                <rect x="154" y="70" width="32" height="40" rx="3" fill="url(#r-box-purple)" stroke="#c084fc" strokeWidth="1.8" />
                <text x="170" y="95" fill="#f3e8ff" fontSize="14" fontStyle="italic" fontWeight="bold" textAnchor="middle">R</text>

                {/* ── CAPACITOR C ── */}
                <rect x="146" y="140" width="48" height="3.5" rx="1.7" fill="#c084fc" stroke="#e9d5ff" strokeWidth="0.5" />
                <rect x="146" y="149" width="48" height="3.5" rx="1.7" fill="#c084fc" stroke="#e9d5ff" strokeWidth="0.5" />
                <text x="206" y="148" fill="#c084fc" fontSize="14" fontStyle="italic" fontWeight="bold">C</text>

                {/* ── CURRENT ARROW i (FLOWING UPWARDS FROM C TO R) ── */}
                <line x1="170" y1="135" x2="170" y2="116" stroke="#ff007f" strokeWidth="2" />
                <polygon points="170,114 166,122 174,122" fill="#ff007f" />
                <text x="154" y="128" fill="#ff007f" fontSize="13" fontStyle="italic" fontWeight="bold">i</text>

                {/* ── VOLTAGE ARROWS uR AND uC (BOTH POINTING DOWNWARDS AS IN DIAGRAM) ── */}
                {/* Arrow uR pointing DOWN */}
                <line x1="130" y1="72" x2="130" y2="108" stroke="#c084fc" strokeWidth="1.6" />
                <polygon points="130,110 126,102 134,102" fill="#c084fc" />
                <text x="110" y="93" fill="#c084fc" fontSize="13" fontStyle="italic" fontWeight="bold" textAnchor="end">
                  u<tspan fontStyle="normal" fontSize="9" baselineShift="sub">R</tspan>
                </text>

                {/* Arrow uC pointing DOWN */}
                <line x1="130" y1="140" x2="130" y2="175" stroke="#c084fc" strokeWidth="1.6" />
                <polygon points="130,177 126,169 134,169" fill="#c084fc" />
                <text x="110" y="160" fill="#c084fc" fontSize="13" fontStyle="italic" fontWeight="bold" textAnchor="end">
                  u<tspan fontStyle="normal" fontSize="9" baselineShift="sub">C</tspan>
                </text>
              </svg>
            </div>
          </div>

          {/* Interactive Collapsible Cards for Equations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* A. Equations en Charge */}
            <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3.5">
              <div className="border-b border-cyan-500/20 pb-2">
                <span className="font-bold text-cyan-300 text-xs sm:text-sm block uppercase tracking-wider">
                  A. Équations Différentielles en Charge (Position 1)
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. uC(t) */}
                <CollapsibleEquationCard
                  num="1"
                  title="Pour la tension uC(t)"
                  formula="u_C(t) + R C \frac{du_C}{dt} = E"
                  proofSteps={EQUATION_PROOFS_DATA.charge_uc.steps}
                  finalFormula={EQUATION_PROOFS_DATA.charge_uc.finalFormula}
                  theme="cyan"
                />

                {/* 2. q(t) */}
                <CollapsibleEquationCard
                  num="2"
                  title="Pour la charge q(t)"
                  formula="q(t) + R C \frac{dq}{dt} = C \cdot E = Q_{\max}"
                  proofSteps={EQUATION_PROOFS_DATA.charge_q.steps}
                  finalFormula={EQUATION_PROOFS_DATA.charge_q.finalFormula}
                  theme="cyan"
                />

                {/* 3. i(t) */}
                <CollapsibleEquationCard
                  num="3"
                  title="Pour le courant i(t)"
                  formula="i(t) + R C \frac{di}{dt} = 0"
                  proofSteps={EQUATION_PROOFS_DATA.charge_i.steps}
                  finalFormula={EQUATION_PROOFS_DATA.charge_i.finalFormula}
                  theme="cyan"
                />
              </div>
            </div>

            {/* B. Equations en Decharge */}
            <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3.5">
              <div className="border-b border-purple-500/20 pb-2">
                <span className="font-bold text-purple-300 text-xs sm:text-sm block uppercase tracking-wider">
                  B. Équations Différentielles en Décharge (Position 2)
                </span>
              </div>

              <div className="space-y-3">
                {/* 1. uC(t) */}
                <CollapsibleEquationCard
                  num="1"
                  title="Pour la tension uC(t)"
                  formula="u_C(t) + R C \frac{du_C}{dt} = 0"
                  proofSteps={EQUATION_PROOFS_DATA.decharge_uc.steps}
                  finalFormula={EQUATION_PROOFS_DATA.decharge_uc.finalFormula}
                  theme="purple"
                />

                {/* 2. q(t) */}
                <CollapsibleEquationCard
                  num="2"
                  title="Pour la charge q(t)"
                  formula="q(t) + R C \frac{dq}{dt} = 0"
                  proofSteps={EQUATION_PROOFS_DATA.decharge_q.steps}
                  finalFormula={EQUATION_PROOFS_DATA.decharge_q.finalFormula}
                  theme="purple"
                />

                {/* 3. i(t) */}
                <CollapsibleEquationCard
                  num="3"
                  title="Pour le courant i(t)"
                  formula="i(t) + R C \frac{di}{dt} = 0"
                  proofSteps={EQUATION_PROOFS_DATA.decharge_i.steps}
                  finalFormula={EQUATION_PROOFS_DATA.decharge_i.finalFormula}
                  theme="purple"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── ÉTAPE 2 : RÉSOLUTIONS ANALYTIQUES & CONSTANTE TAU ── */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              <h3 className="text-sm sm:text-base font-bold text-indigo-300 tracking-wide flex items-center gap-1.5 flex-wrap">
                <span>Étape 2 : Résolutions Analytiques & Constante</span>
                <LatexMath math="\tau" />
              </h3>
            </div>
            <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <LatexMath math="f(t) = A e^{-m t} + B" />
            </span>
          </div>

          <div className="space-y-3">
            {/* Proof: Identification A, m, B for Charge */}
            <CollapsibleProof
              title={
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>A. Solution</span>
                  <LatexMath math="u_C(t)" />
                  <span>en Charge (Constantes</span>
                  <LatexMath math="A, m, B" />
                  <span>)</span>
                </span>
              }
              subtitle={
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>Dérivée première, factorisation</span>
                  <LatexMath math="A e^{-m t}(1 - RCm) = E - B" />
                  <span>et condition initiale</span>
                </span>
              }
              color="cyan"
            >
              <div className="space-y-3 text-slate-300 text-xs">
                <p>On cherche la solution de <LatexMath math="u_C + RC \frac{du_C}{dt} = E" /> sous la forme générale : <LatexMath math="u_C(t) = A e^{-m t} + B" />.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-sans">1. Dérivée première</span>
                    <span className="text-indigo-300 font-bold"><LatexMath math="\frac{du_C}{dt} = -m A e^{-m t}" /></span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-sans">2. Remplacement et Factorisation</span>
                    <span className="text-cyan-300 font-bold"><LatexMath math="A e^{-m t} [1 - RCm] = E - B" /></span>
                  </div>
                </div>

                <p>Pour que cette égalité soit vérifiée <strong>à tout instant t</strong> :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center font-mono">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <LatexMath math="1 - RCm = 0 \implies m = \frac{1}{RC} = \frac{1}{\tau}" />
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <LatexMath math="E - B = 0 \implies B = E" />
                  </div>
                </div>

                <p>Condition initiale (<LatexMath math="t=0" />, condensateur déchargé) : <LatexMath math="u_C(0) = A + B = 0 \implies A = -B = -E" />. D&apos;où la solution encadrée :</p>
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500 text-center font-mono text-cyan-200 font-bold text-sm">
                  <LatexMath math="u_C(t) = E \left( 1 - e^{-\frac{t}{RC}} \right) = E \left( 1 - e^{-\frac{t}{\tau}} \right)" />
                </div>
              </div>
            </CollapsibleProof>

            {/* Proof: Deduction q(t) and i(t) */}
            <CollapsibleProof
              title={
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>B. Expressions de</span>
                  <LatexMath math="q(t)" />
                  <span>et</span>
                  <LatexMath math="i(t)" />
                  <span>en Charge</span>
                </span>
              }
              subtitle={
                <span className="flex items-center gap-1.5 flex-wrap">
                  <LatexMath math="q(t) = C \cdot u_C(t)" />
                  <span>et</span>
                  <LatexMath math="i(t) = \frac{dq}{dt} = \frac{E}{R} e^{-t/\tau}" />
                </span>
              }
              color="indigo"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-cyan-300 block">Charge Électrique q(t) :</span>
                  <div className="font-mono text-cyan-200 text-center font-bold p-2 rounded-lg bg-slate-900">
                    <LatexMath math="q(t) = C \cdot u_C(t) = Q_{\max} \left( 1 - e^{-\frac{t}{\tau}} \right)" />
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center">avec <LatexMath math="Q_{\max} = C \cdot E" /></span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-rose-300 block">Intensité du Courant i(t) :</span>
                  <div className="font-mono text-rose-200 text-center font-bold p-2 rounded-lg bg-slate-900">
                    <LatexMath math="i(t) = \frac{dq}{dt} = \frac{E}{R} e^{-\frac{t}{\tau}} = I_0 e^{-\frac{t}{\tau}}" />
                  </div>
                  <span className="text-[10px] text-slate-400 block text-center">avec <LatexMath math="I_0 = \frac{E}{R}" /></span>
                </div>
              </div>
            </CollapsibleProof>

            {/* Proof: Solutions en Decharge */}
            <CollapsibleProof
              title={
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>C. Résolution Analytique en Décharge (</span>
                  <LatexMath math="u_C, q, i" />
                  <span>)</span>
                </span>
              }
              subtitle={
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>Solutions avec</span>
                  <LatexMath math="E = 0" />
                  <span>,</span>
                  <LatexMath math="u_C(0) = E" />
                  <span>et courant</span>
                  <LatexMath math="i(t) = -\frac{E}{R} e^{-t/\tau}" />
                </span>
              }
              color="purple"
            >
              <div className="space-y-2.5 text-xs text-slate-300">
                <p>En décharge (<LatexMath math="E=0" />), l&apos;identification donne <LatexMath math="B = 0" />, <LatexMath math="m = \frac{1}{RC}" /> et <LatexMath math="A = u_C(0) = E" /> :</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-center">
                  <div className="p-2 rounded-lg bg-slate-950 border border-purple-500/30">
                    <span className="text-[10px] text-slate-400 block font-sans">Tension uC(t)</span>
                    <span className="text-purple-300 font-bold"><LatexMath math="u_C(t) = E e^{-\frac{t}{\tau}}" /></span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-purple-500/30">
                    <span className="text-[10px] text-slate-400 block font-sans">Charge q(t)</span>
                    <span className="text-purple-300 font-bold"><LatexMath math="q(t) = Q_{\max} e^{-\frac{t}{\tau}}" /></span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-rose-500/30">
                    <span className="text-[10px] text-slate-400 block font-sans">Courant i(t)</span>
                    <span className="text-rose-300 font-bold"><LatexMath math="i(t) = -\frac{E}{R} e^{-\frac{t}{\tau}}" /></span>
                  </div>
                </div>
              </div>
            </CollapsibleProof>

            {/* Proof: Analyse Dimensionnelle SI */}
            <CollapsibleProof
              title={
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>D. Analyse Dimensionnelle SI de</span>
                  <LatexMath math="\tau = RC" />
                </span>
              }
              subtitle={
                <span className="flex items-center gap-1.5 flex-wrap">
                  <span>Démonstration que</span>
                  <LatexMath math="[\tau] = [R][C] = [T] \equiv \text{seconde (s)}" />
                </span>
              }
              color="amber"
            >
              <div className="space-y-2 text-slate-300 text-xs">
                <p>D&apos;après la loi d&apos;Ohm <LatexMath math="[R] = \frac{[U]}{[I]}" /> et la relation du condensateur <LatexMath math="[C] = \frac{[I][T]}{[U]}" /> :</p>
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500 font-mono text-center text-amber-300 font-bold text-sm">
                  <LatexMath math="[\tau] = [R] \times [C] = \frac{\cancel{[U]}}{\cancel{[I]}} \times \frac{\cancel{[I]} \cdot [T]}{\cancel{[U]}} = [T] \equiv \text{seconde (s)}" />
                </div>
              </div>
            </CollapsibleProof>
          </div>
        </div>

        {/* ── ÉTAPE 3 : COURBES TEMPORELLES & PROPRIÉTÉS GRAPHIQUES ── */}
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              <h3 className="text-sm sm:text-base font-bold text-emerald-300 tracking-wide flex items-center gap-1.5 flex-wrap">
                <span>Étape 3 : Courbes Temporelles & Propriétés</span>
                <LatexMath math="(u_C, q, i)" />
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <LatexMath math="\tau = RC \quad (\Delta t_{\text{transitoire}} \approx 5\tau)" />
            </span>
          </div>

          {/* 3 Graphical Plots in SVG */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Plot 1: uC(t) Charge et Decharge */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2.5 shadow-lg shadow-cyan-950/20">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-300 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1">
                  <span>Tension</span>
                  <LatexMath math="u_C(t)" />
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Charge & Décharge
                </span>
              </div>
              <svg viewBox="0 0 280 180" className="w-full h-auto select-none" style={{ fontFamily: "Cambria Math, 'Times New Roman', serif" }}>
                {/* Axes */}
                <line x1="32" y1="145" x2="270" y2="145" stroke="#334155" strokeWidth="1.2" />
                <polygon points="270,145 264,142 264,148" fill="#334155" />
                <line x1="32" y1="145" x2="32" y2="15" stroke="#334155" strokeWidth="1.2" />
                <polygon points="32,15 29,21 35,21" fill="#334155" />

                <text x="272" y="157" fill="#94a3b8" fontSize="11" fontStyle="italic">t</text>
                <text x="14" y="20" fill="#00f0ff" fontSize="12" fontStyle="italic" fontWeight="bold">u<tspan fontStyle="normal" fontSize="9" baselineShift="sub">C</tspan></text>

                {/* Asymptote E */}
                <line x1="32" y1="40" x2="265" y2="40" stroke="#00f0ff" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <text x="16" y="44" fill="#00f0ff" fontSize="12" fontStyle="italic" fontWeight="bold">E</text>

                {/* Tangent at Origin for Charge: cuts E at t = tau */}
                <line x1="32" y1="145" x2="105" y2="40" stroke="#fbbf24" strokeWidth="1.2" strokeDasharray="2 2" />
                <circle cx="105" cy="40" r="3" fill="#fbbf24" />
                
                {/* Vertical projection at t = tau */}
                <line x1="105" y1="40" x2="105" y2="145" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />
                <text x="105" y="160" fill="#fbbf24" fontSize="12" fontStyle="italic" fontWeight="bold" textAnchor="middle">τ</text>

                {/* 63.2% Mark Point & horizontal projection */}
                <circle cx="105" cy="78.6" r="3" fill="#00f0ff" />
                <line x1="32" y1="78.6" x2="105" y2="78.6" stroke="#00f0ff" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
                <text x="36" y="74" fill="#38bdf8" fontSize="9" fontStyle="italic" fontWeight="bold">0.63 E</text>

                {/* Mathematical Charge Exponential Curve */}
                <path d="M 32 145 C 50 90, 75 55, 105 47 C 145 40.5, 195 40, 265 40" fill="none" stroke="#00f0ff" strokeWidth="2.2" strokeLinecap="round" />
                <text x="180" y="32" fill="#00f0ff" fontSize="10" fontStyle="normal" fontWeight="bold">Charge</text>

                {/* Mathematical Décharge Exponential Curve */}
                <path d="M 32 40 C 50 95, 75 130, 105 138 C 145 144.5, 195 145, 265 145" fill="none" stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round" />
                <text x="180" y="132" fill="#c084fc" fontSize="10" fontStyle="normal" fontWeight="bold">Décharge</text>
              </svg>
              <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                La tangente à l&apos;origine coupe l&apos;asymptote <LatexMath math="u_C = E" /> à <LatexMath math="t = \tau = RC" />. À cet instant, la charge atteint <LatexMath math="u_C(\tau) = 0.632\, E" />.
              </p>
            </div>

            {/* Plot 2: q(t) Charge et Decharge */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2.5 shadow-lg shadow-indigo-950/20">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1">
                  <span>Charge</span>
                  <LatexMath math="q(t)" />
                </span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  <LatexMath math="q = C \cdot u_C" />
                </span>
              </div>
              <svg viewBox="0 0 280 180" className="w-full h-auto select-none" style={{ fontFamily: "Cambria Math, 'Times New Roman', serif" }}>
                {/* Axes */}
                <line x1="38" y1="145" x2="270" y2="145" stroke="#334155" strokeWidth="1.2" />
                <polygon points="270,145 264,142 264,148" fill="#334155" />
                <line x1="38" y1="145" x2="38" y2="15" stroke="#334155" strokeWidth="1.2" />
                <polygon points="38,15 35,21 41,21" fill="#334155" />

                <text x="272" y="157" fill="#94a3b8" fontSize="11" fontStyle="italic">t</text>
                <text x="14" y="20" fill="#818cf8" fontSize="12" fontStyle="italic" fontWeight="bold">q<tspan fontStyle="normal" fontSize="9">(t)</tspan></text>

                {/* Asymptote Qmax */}
                <line x1="38" y1="40" x2="265" y2="40" stroke="#818cf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                <text x="4" y="44" fill="#818cf8" fontSize="11" fontStyle="italic" fontWeight="bold">Q<tspan fontStyle="normal" fontSize="8" baselineShift="sub">max</tspan></text>

                {/* Charge Curve */}
                <path d="M 38 145 C 56 90, 81 55, 111 47 C 151 40.5, 201 40, 265 40" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" />
                <text x="180" y="32" fill="#818cf8" fontSize="10" fontStyle="normal" fontWeight="bold">Charge</text>

                {/* Decharge Curve */}
                <path d="M 38 40 C 56 95, 81 130, 111 138 C 151 144.5, 201 145, 265 145" fill="none" stroke="#a855f7" strokeWidth="2.2" strokeLinecap="round" />
                <text x="180" y="132" fill="#a855f7" fontSize="10" fontStyle="normal" fontWeight="bold">Décharge</text>

                {/* Markers 3tau and 5tau */}
                <line x1="175" y1="40" x2="175" y2="145" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2 2" />
                <text x="175" y="158" fill="#94a3b8" fontSize="10" fontStyle="italic" textAnchor="middle">3τ <tspan fontSize="8" fontStyle="normal">(95%)</tspan></text>

                <line x1="235" y1="40" x2="235" y2="145" stroke="#64748b" strokeWidth="0.8" strokeDasharray="2 2" />
                <text x="235" y="158" fill="#94a3b8" fontSize="10" fontStyle="italic" textAnchor="middle">5τ <tspan fontSize="8" fontStyle="normal">(99%)</tspan></text>
              </svg>
              <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                La courbe <LatexMath math="q(t)" /> est homothétique à <LatexMath math="u_C(t)" /> avec <LatexMath math="Q_{\max} = C \cdot E" />. À <LatexMath math="t = 5\tau" />, le condensateur est chargé à plus de <LatexMath math="99.3\%" />.
              </p>
            </div>

            {/* Plot 3: i(t) Charge et Decharge */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2.5 shadow-lg shadow-rose-950/20">
              <div className="flex items-center justify-between text-xs font-bold text-rose-300 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1">
                  <span>Courant</span>
                  <LatexMath math="i(t)" />
                </span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                  <LatexMath math="\Delta i(0) = \frac{E}{R}" />
                </span>
              </div>
              <svg viewBox="0 0 280 180" className="w-full h-auto select-none" style={{ fontFamily: "Cambria Math, 'Times New Roman', serif" }}>
                {/* Horizontal Axis in the Center (i = 0) */}
                <line x1="32" y1="90" x2="270" y2="90" stroke="#334155" strokeWidth="1.2" />
                <polygon points="270,90 264,87 264,93" fill="#334155" />
                <line x1="32" y1="165" x2="32" y2="15" stroke="#334155" strokeWidth="1.2" />
                <polygon points="32,15 29,21 35,21" fill="#334155" />

                <text x="272" y="102" fill="#94a3b8" fontSize="11" fontStyle="italic">t</text>
                <text x="14" y="20" fill="#fb7185" fontSize="12" fontStyle="italic" fontWeight="bold">i<tspan fontStyle="normal" fontSize="9">(t)</tspan></text>

                {/* +I0 and -I0 labels on axis */}
                <text x="4" y="38" fill="#fb7185" fontSize="11" fontStyle="italic" fontWeight="bold">+I<tspan fontStyle="normal" fontSize="8" baselineShift="sub">0</tspan></text>
                <text x="6" y="148" fill="#fb7185" fontSize="11" fontStyle="italic" fontWeight="bold">−I<tspan fontStyle="normal" fontSize="8" baselineShift="sub">0</tspan></text>

                {/* Discontinuity at t=0 : open point at 0 */}
                <circle cx="32" cy="90" r="3" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
                <line x1="32" y1="90" x2="32" y2="35" stroke="#fb7185" strokeWidth="1.2" strokeDasharray="2 2" />
                <line x1="32" y1="90" x2="32" y2="145" stroke="#fb7185" strokeWidth="1.2" strokeDasharray="2 2" />

                {/* Charge Current Decay from +I0 to 0 */}
                <circle cx="32" cy="35" r="2.5" fill="#fb7185" />
                <path d="M 32 35 C 50 65, 80 85, 110 88 C 150 90, 200 90, 265 90" fill="none" stroke="#fb7185" strokeWidth="2.2" strokeLinecap="round" />
                <text x="150" y="76" fill="#fb7185" fontSize="9" fontStyle="italic" fontWeight="bold">
                  Charge : +<tspan>E/R</tspan>
                </text>

                {/* Décharge Current (Negative) from -I0 to 0 */}
                <circle cx="32" cy="145" r="2.5" fill="#fb7185" />
                <path d="M 32 145 C 50 115, 80 95, 110 92 C 150 90, 200 90, 265 90" fill="none" stroke="#fb7185" strokeWidth="2.2" strokeLinecap="round" />
                <text x="150" y="114" fill="#fb7185" fontSize="9" fontStyle="italic" fontWeight="bold">
                  Décharge : −<tspan>E/R</tspan>
                </text>
              </svg>
              <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                L&apos;intensité <LatexMath math="i(t)" /> subit un saut de discontinuité à <LatexMath math="t = 0^+" /> : <LatexMath math="i(0^+) = +E/R" /> en charge et <LatexMath math="i(0^+) = -E/R" /> en décharge.
              </p>
            </div>
          </div>

          {/* Key Summary Table / Cards */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-2.5">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span>Propriétés Temporelles Clés & Bilan Énergétique :</span>
            </span>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 space-y-1">
                <span className="text-[11px] text-slate-400 font-sans block">À <LatexMath math="t = \tau" /> (Constante de temps)</span>
                <span className="text-cyan-300 font-bold text-xs sm:text-sm block">
                  <LatexMath math="u_C(\tau) = 0.632 \, E \approx 63\%" />
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
                <span className="text-[11px] text-slate-400 font-sans block">À <LatexMath math="t = 3\tau" /> (Régime quasi-établi)</span>
                <span className="text-indigo-300 font-bold text-xs sm:text-sm block">
                  <LatexMath math="u_C(3\tau) = 0.950 \, E = 95\%" />
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-emerald-500/20 space-y-1">
                <span className="text-[11px] text-slate-400 font-sans block">À <LatexMath math="t = 5\tau" /> (Régime permanent)</span>
                <span className="text-emerald-300 font-bold text-xs sm:text-sm block">
                  <LatexMath math="u_C(5\tau) = 0.993 \, E \approx 99\%" />
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-rose-500/20 space-y-1">
                <span className="text-[11px] text-slate-400 font-sans block">Bilan Énergie Joule</span>
                <span className="text-rose-300 font-bold text-xs sm:text-sm block">
                  <LatexMath math="\mathcal{E}_{\text{Joule}} = \frac{1}{2} C E^2 = 50\%" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── LABORATOIRE VIRTUEL INTERACTIF DU CIRCUIT RC ── */}
        <RCCircuitVirtualLab />
      </section>

      {/* ── 3. CIRCUIT RL SÉRIE (1ER ORDRE) : ÉTUDE MÉTHODIQUE EN 3 ÉTAPES ── */}
      <section className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-950/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                3. Circuit RL Série : Étude Méthodique en 3 Étapes
              </h2>
              <p className="text-xs text-slate-400">
                Équations Différentielles • Solutions Analytiques • Courbes Temporelles • Laboratoire Virtuel
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            1er Ordre • τ = L/R
          </span>
        </div>

        {/* ── ÉTAPE 1 : ÉTABLISSEMENT DES ÉQUATIONS DIFFÉRENTIELLES ── */}
        <div className="space-y-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
              1
            </span>
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
              Étape 1 : Établissement des Équations Différentielles (Établissement & Rupture)
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Considérons un circuit comportant un générateur continu <LatexMath math="E" />, un conducteur ohmique de résistance <LatexMath math="R" /> et une bobine d&apos;inductance pure <LatexMath math="L" /> (ou réelle <LatexMath math="r+L" />). Un commutateur <LatexMath math="K" /> permet de basculer entre l&apos;échelon d&apos;établissement (position 1) et l&apos;extinction libre avec diode de roue libre (position 2).
          </p>

          {/* 2 Comparative SVG Schematics: Établissement (1) vs Rupture (2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Schematic Position 1: Établissement */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span>Position (1) : Établissement du Courant</span>
                <span className="text-[10px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Maille Générateur</span>
              </div>
              <svg viewBox="0 0 320 180" className="w-full h-auto max-w-[300px] mx-auto select-none font-sans">
                <rect x="5" y="5" width="310" height="170" rx="10" fill="#020817" stroke="#064e3b" strokeWidth="1" />
                {/* Active Loop (Left & Center) */}
                <path d="M 50 110 L 50 35 L 130 35 L 160 50 L 160 70 M 160 100 L 160 120 M 160 155 L 160 165 L 50 165 L 50 130" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
                {/* Inactive Loop (Right) */}
                <path d="M 190 35 L 270 35 L 270 165 L 160 165" fill="none" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />
                {/* Generator E */}
                <line x1="38" y1="112" x2="62" y2="112" stroke="#10b981" strokeWidth="2.5" />
                <line x1="44" y1="122" x2="56" y2="122" stroke="#10b981" strokeWidth="4" />
                <text x="30" y="110" fill="#34d399" fontSize="11" fontWeight="bold">+</text>
                <text x="31" y="128" fill="#34d399" fontSize="13" fontWeight="bold">−</text>
                <text x="70" y="120" fill="#34d399" fontSize="11" fontStyle="italic" fontWeight="bold">E</text>
                {/* Switch K pos 1 */}
                <circle cx="130" cy="35" r="3" fill="#10b981" />
                <circle cx="190" cy="35" r="3" fill="#334155" />
                <circle cx="160" cy="50" r="3" fill="#f8fafc" />
                <line x1="160" y1="50" x2="130" y2="35" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" />
                <text x="125" y="24" fill="#10b981" fontSize="9" fontWeight="bold">(1)</text>
                <text x="195" y="24" fill="#64748b" fontSize="9" fontWeight="bold">(2)</text>
                {/* Resistor R */}
                <rect x="146" y="70" width="28" height="30" rx="3" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.6" />
                <text x="160" y="89" fill="#c7d2fe" fontSize="11" fontStyle="italic" fontWeight="bold" textAnchor="middle">R</text>
                {/* Inductor L */}
                <g transform="translate(160, 120)">
                  <path d="M 0 0 C 14 2, 14 11, 0 12 C 14 14, 14 23, 0 24 C 14 26, 14 34, 0 35" fill="none" stroke="#fbbf24" strokeWidth="2.6" strokeLinecap="round" />
                  <text x="-16" y="22" fill="#fbbf24" fontSize="11" fontStyle="italic" fontWeight="bold" textAnchor="end">L</text>
                </g>
                {/* Diode symbol on right */}
                <g transform="translate(270, 100)">
                  <polygon points="0,-6 -6,6 6,6" fill="#475569" />
                  <line x1="-6" y1="-6" x2="6" y2="-6" stroke="#475569" strokeWidth="1.5" />
                </g>
                {/* Moving Yellow Electrons */}
                <circle r="2.2" fill="#fde047">
                  <animateMotion dur="2s" repeatCount="indefinite" path="M 50 110 L 50 35 L 130 35 L 160 50 L 160 165 L 50 165 Z" />
                </circle>
              </svg>
            </div>

            {/* Schematic Position 2: Rupture */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-rose-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                <span>Position (2) : Rupture & Diode de Roue Libre</span>
                <span className="text-[10px] font-mono bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Maille Libre Protégée</span>
              </div>
              <svg viewBox="0 0 320 180" className="w-full h-auto max-w-[300px] mx-auto select-none font-sans">
                <defs>
                  <marker id="arr-rose-schem" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <polygon points="0,1 5,3 0,5" fill="#f43f5e" />
                  </marker>
                </defs>
                <rect x="5" y="5" width="310" height="170" rx="10" fill="#020817" stroke="#4c0519" strokeWidth="1" />
                {/* Inactive Loop (Left) */}
                <path d="M 50 110 L 50 35 L 130 35 M 50 130 L 50 165 L 160 165" fill="none" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />
                {/* Active Loop (Center & Right) */}
                <path d="M 160 50 L 190 35 L 270 35 L 270 165 L 160 165 L 160 155 M 160 120 L 160 100 M 160 70 L 160 50" fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" />
                
                {/* Correct Clockwise Directional Arrows */}
                {/* 1. Central branch: going DOWN through R & L */}
                <line x1="160" y1="104" x2="160" y2="114" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-rose-schem)" />
                {/* 2. Bottom wire: going RIGHT */}
                <line x1="205" y1="165" x2="225" y2="165" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-rose-schem)" />
                {/* 3. Right branch: going UP through Diode */}
                <line x1="270" y1="135" x2="270" y2="120" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-rose-schem)" />
                {/* 4. Top wire: going LEFT through switch K */}
                <line x1="240" y1="35" x2="220" y2="35" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-rose-schem)" />

                {/* Generator E isolated */}
                <line x1="38" y1="112" x2="62" y2="112" stroke="#475569" strokeWidth="2.5" />
                <line x1="44" y1="122" x2="56" y2="122" stroke="#475569" strokeWidth="4" />
                <text x="70" y="120" fill="#64748b" fontSize="11" fontStyle="italic">E</text>
                {/* Switch K pos 2 */}
                <circle cx="130" cy="35" r="3" fill="#334155" />
                <circle cx="190" cy="35" r="3" fill="#f43f5e" />
                <circle cx="160" cy="50" r="3" fill="#f8fafc" />
                <line x1="160" y1="50" x2="190" y2="35" stroke="#f43f5e" strokeWidth="2.8" strokeLinecap="round" />
                <text x="125" y="24" fill="#64748b" fontSize="9" fontWeight="bold">(1)</text>
                <text x="195" y="24" fill="#f43f5e" fontSize="9" fontWeight="bold">(2)</text>
                {/* Resistor R */}
                <rect x="146" y="70" width="28" height="30" rx="3" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="1.6" />
                <text x="160" y="89" fill="#c7d2fe" fontSize="11" fontStyle="italic" fontWeight="bold" textAnchor="middle">R</text>
                {/* Inductor L */}
                <g transform="translate(160, 120)">
                  <path d="M 0 0 C 14 2, 14 11, 0 12 C 14 14, 14 23, 0 24 C 14 26, 14 34, 0 35" fill="none" stroke="#fbbf24" strokeWidth="2.6" strokeLinecap="round" />
                  <text x="-16" y="22" fill="#fbbf24" fontSize="11" fontStyle="italic" fontWeight="bold" textAnchor="end">L</text>
                </g>
              </svg>
            </div>
          </div>

          {/* Detailed Demonstrations */}
          <div className="space-y-4 pt-1">
            {/* Demonstration A: Établissement */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="font-bold text-xs sm:text-sm text-emerald-300 flex items-center gap-1.5">
                  <span>A. Équation Différentielle en Courant</span>
                  <LatexMath math="i(t)" />
                  <span>(Établissement)</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <LatexMath math="\tau = L/R" /> • Maille Générateur
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>1. Application de la Loi des Mailles :</strong> En orientant la maille dans le sens horaire à l&apos;instant <LatexMath math="t \ge 0" />, la somme algébrique des tensions donne :
                </p>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-emerald-200 font-bold">
                  <LatexMath math="E - u_R(t) - u_L(t) = 0 \iff u_L(t) + u_R(t) = E" />
                </div>

                <p>
                  <strong>2. Relations caractéristiques des composants :</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400 text-[11.5px]">
                  <li>Conducteur ohmique (Loi d&apos;Ohm) : <LatexMath math="u_R(t) = R \cdot i(t)" /></li>
                  <li>Bobine inductive idéale (Loi de Faraday) : <LatexMath math="u_L(t) = L \frac{di}{dt}" /></li>
                </ul>

                <p>
                  <strong>3. Mise sous forme canonique standard :</strong> En remplaçant dans la loi des mailles et en divisant chaque terme par <LatexMath math="R" /> :
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30 text-center font-mono text-emerald-300 font-bold space-y-1">
                  <div>
                    <LatexMath math="L \frac{di}{dt} + R i(t) = E \iff \frac{L}{R} \frac{di}{dt} + i(t) = \frac{E}{R}" />
                  </div>
                  <div className="text-sm text-emerald-400 pt-1">
                    <LatexMath math="\boxed{\tau \frac{di}{dt} + i(t) = I_0} \quad \iff \quad \boxed{\frac{di}{dt} + \frac{1}{\tau} i(t) = \frac{I_0}{\tau}}" />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div>• <strong className="text-emerald-300">Constante de temps :</strong> <LatexMath math="\tau = \frac{L}{R}" /> (en secondes <LatexMath math="\text{s}" />), qui quantifie l&apos;inertie inductive du circuit.</div>
                  <div>• <strong className="text-emerald-300">Courant permanent asymptotique :</strong> <LatexMath math="I_0 = \frac{E}{R}" /> (en Ampères <LatexMath math="\text{A}" />), atteint lorsque la bobine devient équivalente à un court-circuit (<LatexMath math="u_L \to 0" />).</div>
                </div>
              </div>
            </div>

            {/* Demonstration B: Tension uL */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="font-bold text-xs sm:text-sm text-amber-300 flex items-center gap-1.5">
                  <span>B. Équation Différentielle en Tension de la Bobine</span>
                  <LatexMath math="u_L(t)" />
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Équation Homogène
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>1. Motivation expérimentale :</strong> À l&apos;oscilloscope, la voie 2 mesure directement la tension <LatexMath math="u_L(t)" />. Il est donc indispensable d&apos;obtenir son équation d&apos;évolution directe.
                </p>
                <p>
                  <strong>2. Dérivation temporelle de la loi des mailles :</strong> En dérivant l&apos;égalité <LatexMath math="u_L(t) + R i(t) = E" /> par rapport au temps <LatexMath math="t" /> :
                </p>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-amber-200 font-bold">
                  <LatexMath math="\frac{d}{dt}[u_L(t)] + R \frac{d}{dt}[i(t)] = \frac{dE}{dt} = 0 \implies \frac{du_L}{dt} + R \frac{di}{dt} = 0" />
                </div>

                <p>
                  <strong>3. Substitution de la dérivée du courant :</strong> Sachant que <LatexMath math="u_L(t) = L \frac{di}{dt} \iff \frac{di}{dt} = \frac{u_L(t)}{L}" /> :
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/30 text-center font-mono text-amber-300 font-bold">
                  <LatexMath math="\frac{du_L}{dt} + R \left(\frac{u_L(t)}{L}\right) = 0 \iff \boxed{\frac{du_L}{dt} + \frac{1}{\tau} u_L(t) = 0}" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Il s&apos;agit d&apos;une équation différentielle <strong>sans second membre</strong> : la tension aux bornes de la bobine décroît donc exponentiellement depuis <LatexMath math="E" /> jusqu&apos;à <LatexMath math="0\text{ V}" />.
                </p>
              </div>
            </div>

            {/* Demonstration C: Rupture & Surtension */}
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="font-bold text-xs sm:text-sm text-rose-300 flex items-center gap-1.5">
                  <span>C. Rupture du Courant & Phénomène de Surtension à l&apos;Ouverture</span>
                </span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
                  Diode de Roue Libre
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>1. Le danger de la rupture à vide (sans diode de protection) :</strong>
                </p>
                <p className="text-slate-400 text-[11.5px]">
                  Si l&apos;on ouvre brutalement un circuit inductif, le courant tente de s&apos;annuler en un temps infinitésimal (<LatexMath math="\Delta t \to 0" />). La dérivée temporelle tend vers l&apos;infini négatif (<LatexMath math="\frac{di}{dt} \to -\infty" />), ce qui génère aux bornes de la bobine une <strong>surtension gigantesque</strong> :
                </p>
                <div className="p-2 rounded-lg bg-slate-900 border border-rose-500/30 text-center font-mono text-rose-300 font-bold">
                  <LatexMath math="u_L(t) = L \frac{di}{dt} \ll -1000\text{ V} \quad (\text{Arc électrique destructeur \& claquage})" />
                </div>

                <p>
                  <strong>2. Le rôle protecteur de la Diode de Roue Libre (Freewheeling Diode) :</strong>
                </p>
                <p className="text-slate-400 text-[11.5px]">
                  Branchée en dérivation inverse sur la bobine, la diode est bloquée en position (1). À l&apos;ouverture (position 2), la surtension rend l&apos;anode plus positive que la cathode : la diode devient instantanément <strong>passante</strong>. Le courant peut continuer à circuler dans la maille fermée et s&apos;éteindre progressivement sans étincelle.
                </p>

                <p>
                  <strong>3. Équation différentielle de la maille libre :</strong>
                </p>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-rose-500/30 text-center font-mono text-rose-300 font-bold">
                  <LatexMath math="u_L(t) + u_R(t) + u_D \approx 0 \implies L \frac{di}{dt} + R i(t) = 0 \iff \boxed{\frac{di}{dt} + \frac{1}{\tau} i(t) = 0}" />
                </div>
              </div>
            </div>

            {/* Demonstration D: Analyse dimensionnelle */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="font-bold text-xs sm:text-sm text-indigo-300 flex items-center gap-1.5">
                  <span>D. Analyse Dimensionnelle Rigoureuse SI de</span>
                  <LatexMath math="\tau = L/R" />
                </span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                  Homogène à un Temps
                </span>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px]">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-300 block">Par la Loi d&apos;Ohm :</span>
                    <div className="font-mono text-center">
                      <LatexMath math="u = R \cdot i \implies [R] = \frac{[U]}{[I]}" />
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-300 block">Par la Loi de Faraday :</span>
                    <div className="font-mono text-center">
                      <LatexMath math="u = L \frac{di}{dt} \implies [L] = \frac{[U]}{[I]/[T]} = \frac{[U][T]}{[I]}" />
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 border border-indigo-500/30 text-center font-mono text-indigo-200 font-bold">
                  <LatexMath math="[\tau] = \left[\frac{L}{R}\right] = \frac{[L]}{[R]} = \frac{\frac{[U][T]}{[I]}}{\frac{[U]}{[I]}} = \frac{[U][T]}{[I]} \times \frac{[I]}{[U]} = [T] \equiv \text{seconde (s)}" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Le rapport <LatexMath math="L/R" /> est donc rigoureusement homogène à une durée temporelle et s&apos;exprime en <strong>secondes (s)</strong> dans le Système International.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── ÉTAPE 2 : RÉSOLUTIONS ANALYTIQUES ── */}
        <div className="space-y-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
              2
            </span>
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
              Étape 2 : Résolutions Analytiques & Conditions Initiales
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Resolution Établissement */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 uppercase tracking-wider">
                  A. Résolution en Établissement
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <LatexMath math="i(0)=0" />
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                La solution générale s&apos;écrit <LatexMath math="i(t) = i_h(t) + i_p" /> où <LatexMath math="i_h(t) = K e^{-t/\tau}" /> et <LatexMath math="i_p = \frac{E}{R} = I_0" />.
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-emerald-200 font-bold space-y-1">
                <div>
                  <LatexMath math="i(0^+) = i(0^-) = 0 \implies K + I_0 = 0 \implies K = -I_0" />
                </div>
                <div className="text-emerald-400 text-sm">
                  <LatexMath math="i(t) = I_0 \left(1 - e^{-t/\tau}\right) = \frac{E}{R} \left(1 - e^{-t/\tau}\right)" />
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
                <div>• <LatexMath math="u_L(t) = L \frac{di}{dt} = E e^{-t/\tau}" /></div>
                <div>• <LatexMath math="u_R(t) = R i(t) = E \left(1 - e^{-t/\tau}\right)" /></div>
              </div>
            </div>

            {/* Resolution Rupture */}
            <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 uppercase tracking-wider">
                  B. Résolution en Rupture (Régime Libre)
                </span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  <LatexMath math="i(0)=I_0" />
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Avec la condition initiale <LatexMath math="i(0^+) = i(0^-) = I_0" /> (continuité du courant) :
              </p>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-rose-200 font-bold space-y-1">
                <div className="text-rose-400 text-sm">
                  <LatexMath math="i(t) = I_0 e^{-t/\tau} = \frac{E}{R} e^{-t/\tau}" />
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 space-y-1 font-mono">
                <div>• <LatexMath math="u_L(t) = -R i(t) = -E e^{-t/\tau}" /> <span className="text-rose-400">(Discontinuité négative)</span></div>
                <div>• <LatexMath math="u_R(t) = R i(t) = E e^{-t/\tau}" /></div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ÉTAPE 3 : COURBES TEMPORELLES & PROPRIÉTÉS GRAPHIQUES ── */}
        <div className="space-y-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
              3
            </span>
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
              Étape 3 : Courbes Temporelles & Propriétés Remarquables
            </h3>
          </div>

          {/* 3 Authentic Mathematical SVG Plots */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Plot 1: i(t) */}
            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <span className="font-bold text-xs text-emerald-300 block text-center">
                1. Courant <LatexMath math="i(t)" /> (Établissement)
              </span>
              <svg viewBox="0 0 200 130" className="w-full h-auto select-none font-sans">
                <rect width="200" height="130" fill="#020817" rx="6" />
                <line x1="25" y1="110" x2="190" y2="110" stroke="#475569" strokeWidth="1" />
                <line x1="25" y1="110" x2="25" y2="15" stroke="#475569" strokeWidth="1" />
                <line x1="25" y1="30" x2="190" y2="30" stroke="#10b981" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
                <text x="18" y="34" fill="#10b981" fontSize="9" fontStyle="italic" fontWeight="bold">I₀</text>
                {/* Tangent at origin */}
                <line x1="25" y1="110" x2="58" y2="30" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="58" y1="30" x2="58" y2="110" stroke="#f59e0b" strokeWidth="0.6" strokeDasharray="1 1" />
                <text x="58" y="122" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">1τ</text>
                {/* Curve i(t) */}
                <path d="M 25 110 Q 55 45, 190 31" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="58" cy="59" r="2.5" fill="#10b981" />
                <text x="75" y="62" fill="#10b981" fontSize="7.5" fontWeight="bold">63.2% I₀</text>
              </svg>
            </div>

            {/* Plot 2: uL(t) */}
            <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/30 space-y-2">
              <span className="font-bold text-xs text-rose-300 block text-center">
                2. Tension Bobine <LatexMath math="u_L(t)" />
              </span>
              <svg viewBox="0 0 200 130" className="w-full h-auto select-none font-sans">
                <rect width="200" height="130" fill="#020817" rx="6" />
                <line x1="25" y1="110" x2="190" y2="110" stroke="#475569" strokeWidth="1" />
                <line x1="25" y1="110" x2="25" y2="15" stroke="#475569" strokeWidth="1" />
                <text x="18" y="34" fill="#f43f5e" fontSize="9" fontStyle="italic" fontWeight="bold">E</text>
                {/* Tangent at origin */}
                <line x1="25" y1="30" x2="58" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <text x="58" y="122" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">1τ</text>
                {/* Curve uL(t) */}
                <path d="M 25 30 Q 55 95, 190 109" fill="none" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="58" cy="80" r="2.5" fill="#f43f5e" />
                <text x="75" y="80" fill="#f43f5e" fontSize="7.5" fontWeight="bold">36.8% E</text>
              </svg>
            </div>

            {/* Plot 3: i(t) en Rupture */}
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
              <span className="font-bold text-xs text-amber-300 block text-center">
                3. Courant <LatexMath math="i(t)" /> (Rupture Libre)
              </span>
              <svg viewBox="0 0 200 130" className="w-full h-auto select-none font-sans">
                <rect width="200" height="130" fill="#020817" rx="6" />
                <line x1="25" y1="110" x2="190" y2="110" stroke="#475569" strokeWidth="1" />
                <line x1="25" y1="110" x2="25" y2="15" stroke="#475569" strokeWidth="1" />
                <text x="18" y="34" fill="#fbbf24" fontSize="9" fontStyle="italic" fontWeight="bold">I₀</text>
                <line x1="25" y1="30" x2="58" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                <text x="58" y="122" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">1τ</text>
                {/* Curve Rupture */}
                <path d="M 25 30 Q 55 95, 190 109" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="58" cy="80" r="2.5" fill="#fbbf24" />
                <text x="75" y="80" fill="#fbbf24" fontSize="7.5" fontWeight="bold">36.8% I₀</text>
              </svg>
            </div>
          </div>

          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-mono">À t = 1τ</span>
              <span className="text-emerald-300 font-bold font-mono">63.2% de I₀</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-mono">À t = 3τ</span>
              <span className="text-emerald-300 font-bold font-mono">95.0% de I₀</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-mono">À t = 5τ (Établi)</span>
              <span className="text-emerald-300 font-bold font-mono">99.3% ≈ 100%</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-amber-500/30 space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-mono">Énergie Magnétique</span>
              <span className="text-amber-300 font-bold font-mono">½ L I₀²</span>
            </div>
          </div>
        </div>

        {/* ── LABORATOIRE VIRTUEL INTERACTIF DU CIRCUIT RL ── */}
        <RLCircuitVirtualLab />
      </section>

      {/* ── 4. CIRCUIT RLC SÉRIE (2ND ORDRE) : ÉTUDE MÉTHODIQUE EN 3 ÉTAPES ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-indigo-500/40 pb-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
              4. Circuit RLC Série Libre (Oscillations & Régimes du 2nd Ordre)
            </h2>
            <p className="text-xs text-slate-400">
              Étude méthodique en 3 étapes : Équations Différentielles • 3 Régimes d&apos;Amortissement • Espace des Phases & Énergie
            </p>
          </div>
        </div>

        {/* ── ÉTAPE 1 : ÉQUATIONS DIFFÉRENTIELLES DU 2ND ORDRE ── */}
        <div className="space-y-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/40">
              1
            </span>
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
              Étape 1 : Équations Différentielles & Forme Canonique Normalisée
            </h3>
          </div>

          {/* 2 Comparative SVG Schematics (Charge vs Décharge RLC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Schematic Position 1: Charge Continue */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                <span>Position (1) : Charge du Condensateur</span>
                <span className="text-[10px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">u_C = E</span>
              </div>
              <svg viewBox="0 0 320 185" className="w-full h-auto max-w-[300px] mx-auto select-none font-sans">
                <defs>
                  <marker id="arr-emerald-schem" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <polygon points="0,1 5,3 0,5" fill="#10b981" />
                  </marker>
                </defs>
                <rect x="5" y="5" width="310" height="175" rx="10" fill="#020817" stroke="#064e3b" strokeWidth="1" />

                {/* Inactive Inductor Loop (Right) */}
                <path d="M 190 35 L 270 35 L 270 85 M 270 120 L 270 165 L 160 165" fill="none" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />
                
                {/* Active Charge Loop (Left & Center) */}
                <path d="M 50 110 L 50 35 L 130 35 M 160 50 L 160 60 M 160 90 L 160 120 M 160 135 L 160 165 L 50 165 L 50 130" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
                
                {/* Direction Arrows on active wires (Clockwise) */}
                <line x1="85" y1="35" x2="105" y2="35" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emerald-schem)" />
                <line x1="160" y1="100" x2="160" y2="112" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emerald-schem)" />
                <line x1="115" y1="165" x2="95" y2="165" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emerald-schem)" />
                <line x1="50" y1="85" x2="50" y2="70" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-emerald-schem)" />

                {/* Generator E */}
                <line x1="38" y1="112" x2="62" y2="112" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" />
                <line x1="44" y1="122" x2="56" y2="122" stroke="#10b981" strokeWidth="4.5" strokeLinecap="round" />
                <text x="28" y="110" fill="#34d399" fontSize="11" fontWeight="bold">+</text>
                <text x="30" y="130" fill="#34d399" fontSize="13" fontWeight="bold">−</text>
                <text x="70" y="120" fill="#34d399" fontSize="11" fontStyle="italic" fontWeight="bold">E</text>

                {/* Switch K pos 1 */}
                <circle cx="130" cy="35" r="3" fill="#10b981" />
                <circle cx="190" cy="35" r="3" fill="#334155" />
                <circle cx="160" cy="50" r="3" fill="#f8fafc" />
                <line x1="160" y1="50" x2="130" y2="35" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" />
                <text x="125" y="24" fill="#10b981" fontSize="9" fontWeight="bold">(1)</text>
                <text x="195" y="24" fill="#64748b" fontSize="9" fontWeight="bold">(2)</text>
                <text x="160" y="42" fill="#f8fafc" fontSize="10" fontStyle="italic" fontWeight="bold" textAnchor="middle">K</text>

                {/* Resistor R */}
                <rect x="146" y="60" width="28" height="30" rx="3" fill="#1e1b4b" stroke="#10b981" strokeWidth="1.6" />
                <text x="160" y="79" fill="#c7d2fe" fontSize="10" fontStyle="italic" fontWeight="bold" textAnchor="middle">R</text>

                {/* Capacitor C */}
                <g transform="translate(160, 120)">
                  <line x1="-16" y1="0" x2="16" y2="0" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-16" y1="15" x2="16" y2="15" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
                  <text x="24" y="11" fill="#00f0ff" fontSize="11" fontStyle="italic" fontWeight="bold">C</text>
                  <text x="-20" y="2" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="end">+q</text>
                  <text x="-20" y="17" fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="end">−q</text>
                </g>

                {/* Coil L isolated */}
                <g transform="translate(270, 85)">
                  <path d="M 0 0 C 14 2, 14 10, 0 11 C 14 13, 14 21, 0 22 C 14 24, 14 32, 0 33" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" />
                  <text x="18" y="20" fill="#475569" fontSize="10" fontStyle="italic">L, r</text>
                </g>

                {/* Moving Yellow Charge in Charging Loop */}
                <circle r="2.4" fill="#fde047" stroke="#ffffff" strokeWidth="0.5">
                  <animateMotion dur="2.2s" repeatCount="indefinite" path="M 50 110 L 50 35 L 130 35 L 160 50 L 160 120 M 160 135 L 160 165 L 50 165 L 50 130 Z" />
                </circle>
              </svg>
            </div>

            {/* Schematic Position 2: Décharge RLC Libre */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-300">
                <span>Position (2) : Circuit RLC Libre (Oscillations)</span>
                <span className="text-[10px] font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Maille Libre {`{R, L, C}`}</span>
              </div>
              <svg viewBox="0 0 320 185" className="w-full h-auto max-w-[300px] mx-auto select-none font-sans">
                <defs>
                  <marker id="arr-indig-schem" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <polygon points="0,1 5,3 0,5" fill="#818cf8" />
                  </marker>
                </defs>
                <rect x="5" y="5" width="310" height="175" rx="10" fill="#020817" stroke="#312e81" strokeWidth="1" />

                {/* Inactive Generator Loop */}
                <path d="M 50 110 L 50 35 L 130 35 M 50 130 L 50 165 L 160 165" fill="none" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />
                
                {/* Active Connected RLC Loop */}
                <path d="M 160 50 L 190 35 L 270 35 L 270 85 M 270 118 L 270 165 L 160 165 L 160 135 M 160 120 L 160 90 M 160 60 L 160 50" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" />
                
                {/* Oscillating Direction Arrows */}
                <line x1="225" y1="35" x2="245" y2="35" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig-schem)" />
                <line x1="270" y1="135" x2="270" y2="150" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig-schem)" />
                <line x1="220" y1="165" x2="200" y2="165" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig-schem)" />
                <line x1="160" y1="110" x2="160" y2="95" stroke="#818cf8" strokeWidth="2" markerEnd="url(#arr-indig-schem)" />

                {/* Generator isolated */}
                <line x1="38" y1="112" x2="62" y2="112" stroke="#475569" strokeWidth="2.5" />
                <line x1="44" y1="122" x2="56" y2="122" stroke="#475569" strokeWidth="4" />
                <text x="70" y="120" fill="#64748b" fontSize="11" fontStyle="italic">E</text>

                {/* Switch K pos 2 */}
                <circle cx="130" cy="35" r="3" fill="#334155" />
                <circle cx="190" cy="35" r="3" fill="#818cf8" />
                <circle cx="160" cy="50" r="3" fill="#f8fafc" />
                <line x1="160" y1="50" x2="190" y2="35" stroke="#818cf8" strokeWidth="2.8" strokeLinecap="round" />
                <text x="125" y="24" fill="#64748b" fontSize="9" fontWeight="bold">(1)</text>
                <text x="195" y="24" fill="#818cf8" fontSize="9" fontWeight="bold">(2)</text>
                <text x="160" y="42" fill="#f8fafc" fontSize="10" fontStyle="italic" fontWeight="bold" textAnchor="middle">K</text>

                {/* Resistor R */}
                <rect x="146" y="60" width="28" height="30" rx="3" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.6" />
                <text x="160" y="79" fill="#c7d2fe" fontSize="10" fontStyle="italic" fontWeight="bold" textAnchor="middle">R</text>

                {/* Capacitor C */}
                <g transform="translate(160, 120)">
                  <line x1="-16" y1="0" x2="16" y2="0" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-16" y1="15" x2="16" y2="15" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
                  <text x="24" y="11" fill="#00f0ff" fontSize="11" fontStyle="italic" fontWeight="bold">C</text>
                </g>

                {/* Coil L Active */}
                <g transform="translate(270, 85)">
                  <path d="M 0 0 C 14 2, 14 10, 0 11 C 14 13, 14 21, 0 22 C 14 24, 14 32, 0 33" fill="none" stroke="#fbbf24" strokeWidth="2.6" strokeLinecap="round" />
                  <text x="18" y="20" fill="#fbbf24" fontSize="11" fontStyle="italic" fontWeight="bold">L, r</text>
                </g>

                {/* Oscillating Yellow Electron cleanly looping through whole circuit */}
                <circle r="2.4" fill="#fde047" stroke="#ffffff" strokeWidth="0.5">
                  <animateMotion dur="2.4s" repeatCount="indefinite" path="M 160 50 L 190 35 L 270 35 L 270 85 M 270 118 L 270 165 L 160 165 L 160 135 M 160 120 L 160 90 M 160 60 L 160 50 Z" />
                </circle>
              </svg>
            </div>
          </div>

          {/* Detailed Demonstrations with ProofCollapsibleCard (Same Style as RC & RL) */}
          <div className="space-y-3 pt-1">
            <ProofCollapsibleCard
              num="A"
              title="Équation Différentielle en Tension u_C(t)"
              shortDesc="Loi des mailles en régime libre & passage à la forme canonique normalisée"
              formula="\frac{d^2 u_C}{dt^2} + 2\lambda \frac{du_C}{dt} + \omega_0^2 u_C(t) = 0"
              theme="indigo"
              defaultOpen={true}
              proofSteps={[
                {
                  step: "1. Application de la Loi des Mailles",
                  desc: "À t >= 0 (Position 2), la somme algébrique des tensions dans la maille fermée {R, L, C} s'écrit :",
                  math: "u_L(t) + u_R(t) + u_C(t) = 0",
                },
                {
                  step: "2. Relations caractéristiques des dipôles en convention récepteur",
                  desc: "On exprime chaque tension en fonction de u_C(t) et de ses dérivées temporelles :",
                  math: "u_R = R_T \\cdot i(t) \\; (R_T = R + r), \\quad u_L = L \\frac{di}{dt}, \\quad i = C \\frac{du_C}{dt} \\implies \\frac{di}{dt} = C \\frac{d^2 u_C}{dt^2}",
                },
                {
                  step: "3. Substitution et division par LC",
                  desc: "En injectant ces relations dans la loi des mailles :",
                  math: "L C \\frac{d^2 u_C}{dt^2} + R_T C \\frac{du_C}{dt} + u_C(t) = 0 \\iff \\frac{d^2 u_C}{dt^2} + \\frac{R_T}{L} \\frac{du_C}{dt} + \\frac{1}{LC} u_C(t) = 0",
                },
              ]}
              finalFormula="\boxed{\frac{d^2 u_C}{dt^2} + 2\lambda \frac{du_C}{dt} + \omega_0^2 u_C(t) = 0} \quad \iff \quad \boxed{\frac{d^2 u_C}{dt^2} + \frac{\omega_0}{Q} \frac{du_C}{dt} + \omega_0^2 u_C(t) = 0}"
              extraContent={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-300">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-cyan-300 block">Pulsation Propre <LatexMath math="\omega_0" /> :</span>
                    <div className="font-mono text-center"><LatexMath math="\omega_0 = \frac{1}{\sqrt{LC}} \quad (\text{rad/s})" /></div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 block">Coeff. d&apos;Amortissement <LatexMath math="\lambda" /> :</span>
                    <div className="font-mono text-center"><LatexMath math="\lambda = \frac{R_T}{2L} \quad (\text{s}^{-1})" /></div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-indigo-300 block">Facteur de Qualité <LatexMath math="Q" /> :</span>
                    <div className="font-mono text-center"><LatexMath math="Q = \frac{\omega_0}{2\lambda} = \frac{1}{R_T}\sqrt{\frac{L}{C}}" /></div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="font-bold text-rose-300 block">Résistance Critique <LatexMath math="R_c" /> :</span>
                    <div className="font-mono text-center"><LatexMath math="R_c = 2\sqrt{\frac{L}{C}} \quad (\Omega)" /></div>
                  </div>
                </div>
              }
            />

            <ProofCollapsibleCard
              num="B"
              title="Équations Différentielles en Charge q(t) et en Courant i(t)"
              shortDesc="Conservation intégrale de la forme canonique pour toutes les grandeurs"
              formula="\frac{d^2 q}{dt^2} + 2\lambda \frac{dq}{dt} + \omega_0^2 q(t) = 0"
              theme="purple"
              proofSteps={[
                {
                  step: "1. Équation différentielle de la charge q(t)",
                  desc: "Puisque q(t) = C · u_C(t), en multipliant l'équation en u_C(t) par C :",
                  math: "q(t) = C \\cdot u_C(t) \\implies \\frac{d^2 q}{dt^2} + 2\\lambda \\frac{dq}{dt} + \\omega_0^2 q(t) = 0",
                },
                {
                  step: "2. Équation différentielle de l'intensité i(t)",
                  desc: "En dérivant l'équation en q(t) par rapport au temps sachant que i(t) = dq/dt :",
                  math: "i(t) = \\frac{dq}{dt} \\implies \\frac{d^2 i}{dt^2} + 2\\lambda \\frac{di}{dt} + \\omega_0^2 i(t) = 0",
                },
              ]}
              finalFormula="\boxed{\frac{d^2 q}{dt^2} + 2\lambda \frac{dq}{dt} + \omega_0^2 q = 0} \quad \text{et} \quad \boxed{\frac{d^2 i}{dt^2} + 2\lambda \frac{di}{dt} + \omega_0^2 i = 0}"
            />
          </div>
        </div>

        {/* ── ÉTAPE 2 : RÉSOLUTIONS ANALYTIQUES & LES 3 RÉGIMES D'AMORTISSEMENT ── */}
        <div className="space-y-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/40">
              2
            </span>
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
              Étape 2 : Équation Caractéristique & Résolution des 3 Régimes
            </h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
            <p>
              On cherche des solutions sous la forme <LatexMath math="u_C(t) = A e^{r t}" />. L&apos;équation caractéristique associée s&apos;écrit :
            </p>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center font-mono text-indigo-300 font-bold">
              <LatexMath math="r^2 + 2\lambda r + \omega_0^2 = 0 \quad \implies \quad \Delta' = \lambda^2 - \omega_0^2 = \omega_0^2 \left(\xi^2 - 1\right) = \omega_0^2 \left(\frac{1}{4Q^2} - 1\right)" />
            </div>
            <p className="text-[11px] text-slate-400">
              Le comportement physique du circuit dépend exclusivement du signe du discriminant réduit <LatexMath math="\Delta'" /> (ou de la comparaison directe entre <LatexMath math="R_T" /> et <LatexMath math="R_c = 2\sqrt{L/C}" />).
            </p>
          </div>

          {/* 3 ProofCollapsibleCards for the 3 Damping Regimes */}
          <div className="space-y-3">
            {/* Regime 1: Pseudo-Périodique */}
            <ProofCollapsibleCard
              num="1"
              title="1. Régime Pseudo-Périodique (R_T < R_c ⟺ Q > 0.5)"
              shortDesc="Faible amortissement, oscillations amorties à la pseudo-pulsation Ω"
              formula="u_C(t) = E e^{-\lambda t} \left[ \cos(\Omega t) + \frac{\lambda}{\Omega} \sin(\Omega t) \right]"
              theme="cyan"
              defaultOpen={true}
              proofSteps={[
                {
                  step: "1. Racines complexes conjuguées",
                  desc: "Puisque Δ' < 0, le polynôme caractéristique admet deux racines complexes :",
                  math: "r_{1,2} = -\\lambda \\pm j \\Omega \\quad \\text{avec} \\quad \\Omega = \\sqrt{\\omega_0^2 - \\lambda^2} = \\omega_0 \\sqrt{1 - \\frac{1}{4Q^2}}",
                },
                {
                  step: "2. Forme générale de la solution temporelle",
                  desc: "Combinaison linéaire des solutions oscillantes amorties :",
                  math: "u_C(t) = e^{-\\lambda t} \\left[ A \\cos(\\Omega t) + B \\sin(\\Omega t) \\right] = U_m e^{-\\lambda t} \\cos(\\Omega t - \\phi)",
                },
                {
                  step: "3. Détermination des constantes A et B par les conditions initiales",
                  desc: "À t = 0+, u_C(0) = E et i(0) = C · du_C/dt(0) = 0 :",
                  math: "u_C(0) = A = E, \\quad \\left.\\frac{du_C}{dt}\\right|_0 = -\\lambda A + \\Omega B = 0 \\implies B = \\frac{\\lambda}{\\Omega} E",
                },
              ]}
              finalFormula="\boxed{u_C(t) = E \, e^{-\lambda t} \left[ \cos(\Omega t) + \frac{\lambda}{\Omega} \sin(\Omega t) \right]} \quad \text{avec} \quad T = \frac{2\pi}{\Omega}, \; \delta = \lambda T"
            />

            {/* Regime 2: Critique */}
            <ProofCollapsibleCard
              num="2"
              title="2. Régime Critique (R_T = R_c ⟺ Q = 0.5)"
              shortDesc="Amortissement critique optimal : retour à zéro le plus rapide sans oscillation"
              formula="u_C(t) = E (1 + \omega_0 t) e^{-\omega_0 t}"
              theme="emerald"
              proofSteps={[
                {
                  step: "1. Racine double réelle négative",
                  desc: "Puisque Δ' = 0, l'équation caractéristique admet une racine double :",
                  math: "r_0 = -\\lambda = -\\omega_0 = -\\frac{R_c}{2L}",
                },
                {
                  step: "2. Forme générale et identification des constantes",
                  desc: "u_C(t) = (A + B · t) · e^(-ω₀ · t) avec u_C(0) = E et i(0) = 0 :",
                  math: "u_C(0) = A = E, \\quad \\left.\\frac{du_C}{dt}\\right|_0 = B - \\omega_0 A = 0 \\implies B = \\omega_0 E",
                },
              ]}
              finalFormula="\boxed{u_C(t) = E \, (1 + \omega_0 t) \, e^{-\omega_0 t}} \quad \text{(Temps de réponse minimal sans dépassement)}"
            />

            {/* Regime 3: Apériodique */}
            <ProofCollapsibleCard
              num="3"
              title="3. Régime Apériodique (R_T > R_c ⟺ Q < 0.5)"
              shortDesc="Fort amortissement : retour monotone lent gouverné par le pôle dominant"
              formula="u_C(t) = \frac{E}{r_2 - r_1} \left( r_2 e^{r_1 t} - r_1 e^{r_2 t} \right)"
              theme="rose"
              proofSteps={[
                {
                  step: "1. Deux racines réelles négatives distinctes",
                  desc: "Puisque Δ' > 0, l'équation caractéristique admet deux racines réelles :",
                  math: "r_{1,2} = -\\lambda \\pm \\sqrt{\\lambda^2 - \\omega_0^2} \\quad \\text{avec} \\quad r_2 < r_1 < 0",
                },
                {
                  step: "2. Forme générale et conditions initiales",
                  desc: "u_C(t) = A · e^(r₁ · t) + B · e^(r₂ · t) avec u_C(0) = E et du_C/dt(0) = 0 :",
                  math: "A + B = E, \\quad r_1 A + r_2 B = 0 \\implies A = \\frac{r_2 E}{r_2 - r_1}, \\quad B = -\\frac{r_1 E}{r_2 - r_1}",
                },
              ]}
              finalFormula="\boxed{u_C(t) = \frac{E}{r_2 - r_1} \left( r_2 e^{r_1 t} - r_1 e^{r_2 t} \right)} \quad \text{(Décroissance lente par } e^{r_1 t}\text{)}"
            />
          </div>
        </div>

        {/* ── ÉTAPE 3 : COURBES TEMPORELLES, ESPACE DES PHASES & BILAN ÉNERGÉTIQUE ── */}
        <div className="space-y-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 p-4 sm:p-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/40">
              3
            </span>
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">
              Étape 3 : Courbes Temporelles, Espace des Phases & Bilan Énergétique
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            {/* Plot 1: Pseudo-périodique Curve */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
              <span className="font-bold text-xs text-cyan-300 block text-center">
                1. Allure Pseudo-Périodique (<LatexMath math="Q > 0.5" />)
              </span>
              <svg viewBox="0 0 200 130" className="w-full h-auto select-none font-sans">
                <rect width="200" height="130" fill="#020817" rx="6" />
                <line x1="20" y1="65" x2="190" y2="65" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="20" y1="120" x2="20" y2="10" stroke="#475569" strokeWidth="1" />
                <text x="14" y="25" fill="#00f0ff" fontSize="8.5" fontStyle="italic" fontWeight="bold">+E</text>
                <text x="14" y="110" fill="#00f0ff" fontSize="8.5" fontStyle="italic" fontWeight="bold">−E</text>
                {/* Envelope */}
                <path d="M 20 20 Q 80 55, 190 64" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
                <path d="M 20 110 Q 80 75, 190 66" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
                {/* Damped Oscillation Wave */}
                <path d="M 20 20 C 35 25, 45 105, 60 100 C 75 95, 85 40, 100 45 C 115 50, 125 78, 140 75 C 155 72, 165 60, 180 62 L 190 65" fill="none" stroke="#00f0ff" strokeWidth="2.2" strokeLinecap="round" />
                <text x="100" y="122" fill="#f59e0b" fontSize="8" fontWeight="bold" textAnchor="middle">T = 2π/Ω</text>
              </svg>
            </div>

            {/* Plot 2: Critique vs Apériodique */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
              <span className="font-bold text-emerald-300 block text-center">
                2. Critique vs Apériodique
              </span>
              <svg viewBox="0 0 200 130" className="w-full h-auto select-none font-sans">
                <rect width="200" height="130" fill="#020817" rx="6" />
                <line x1="20" y1="110" x2="190" y2="110" stroke="#475569" strokeWidth="1" />
                <line x1="20" y1="110" x2="20" y2="10" stroke="#475569" strokeWidth="1" />
                <text x="14" y="24" fill="#10b981" fontSize="8.5" fontStyle="italic" fontWeight="bold">+E</text>
                {/* Critique (fastest) */}
                <path d="M 20 20 Q 40 105, 120 110 L 190 110" fill="none" stroke="#10b981" strokeWidth="2.4" strokeLinecap="round" />
                <text x="75" y="65" fill="#10b981" fontSize="7.5" fontWeight="bold">Critique (Q=0.5)</text>
                {/* Apériodique (slow) */}
                <path d="M 20 20 Q 60 80, 190 106" fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="3 2" strokeLinecap="round" />
                <text x="135" y="85" fill="#f43f5e" fontSize="7.5" fontWeight="bold">Apériodique</text>
              </svg>
            </div>

            {/* Plot 3: Espace des Phases (uC, i) */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-2">
              <span className="font-bold text-xs text-indigo-300 block text-center">
                3. Espace des Phases (<LatexMath math="u_C, i" />)
              </span>
              <svg viewBox="0 0 200 130" className="w-full h-auto select-none font-sans">
                <rect width="200" height="130" fill="#020817" rx="6" />
                <line x1="20" y1="65" x2="185" y2="65" stroke="#334155" strokeWidth="1" />
                <line x1="100" y1="115" x2="100" y2="15" stroke="#334155" strokeWidth="1" />
                <text x="185" y="62" fill="#00f0ff" fontSize="8" fontStyle="italic">u_C</text>
                <text x="105" y="22" fill="#fb7185" fontSize="8" fontStyle="italic">i</text>
                {/* Converging Phase Spiral */}
                <path d="M 160 65 C 160 100, 50 100, 50 65 C 50 35, 140 35, 140 65 C 140 85, 70 85, 70 65 C 70 48, 120 48, 120 65 C 120 75, 85 75, 85 65 C 85 58, 105 58, 100 65" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="100" cy="65" r="2.5" fill="#fde047" />
                <text x="105" y="80" fill="#a855f7" fontSize="7" fontWeight="bold">Attracteur (0,0)</text>
              </svg>
            </div>
          </div>

          {/* Bilan Énergétique avec ProofCollapsibleCard */}
          <ProofCollapsibleCard
            num="⚡"
            title="Bilan Énergétique & Transferts Conservatifs / Dissipatifs"
            shortDesc="Transfert oscillant continu entre C et L et dissipation irréversible par effet Joule"
            formula="\frac{d\mathcal{E}_T}{dt} = -R_T \, i(t)^2 \le 0"
            theme="amber"
            defaultOpen={true}
            proofSteps={[
              {
                step: "1. Énergie électromagnétique totale stockée",
                desc: "Somme de l'énergie électrique dans le condensateur et de l'énergie magnétique dans la bobine :",
                math: "\\mathcal{E}_T(t) = \\mathcal{E}_E(t) + \\mathcal{E}_M(t) = \\frac{1}{2} C u_C(t)^2 + \\frac{1}{2} L i(t)^2",
              },
              {
                step: "2. Dérivation temporelle de l'énergie totale",
                desc: "En appliquant la règle de dérivation d'une fonction composée :",
                math: "\\frac{d\\mathcal{E}_T}{dt} = C u_C \\frac{du_C}{dt} + L i \\frac{di}{dt} = i \\left( u_C + L \\frac{di}{dt} \\right)",
              },
              {
                step: "3. Utilisation de la loi des mailles (u_C + L di/dt = -R_T i)",
                desc: "D'après la loi des mailles u_L + u_R + u_C = 0 => u_C + L di/dt = -R_T · i :",
                math: "\\frac{d\\mathcal{E}_T}{dt} = i \\cdot \\left( -R_T \\cdot i \\right) = -R_T \\cdot i(t)^2 \\le 0",
              },
            ]}
            finalFormula="\boxed{\frac{d\mathcal{E}_T}{dt} = -R_T \, i(t)^2 \le 0} \quad \implies \quad \mathcal{E}_T(t) \text{ décroît de façon strictement monotone par effet Joule.}"
          />
        </div>

        {/* ── LABORATOIRE VIRTUEL INTERACTIF DÉDIÉ AU CIRCUIT RLC ── */}
        <RLCCircuitVirtualLab />
      </section>

      {/* ── 5. AUTO-ÉVALUATION & QCM INTERACTIF (12 QUESTIONS) ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
            5. Auto-Évaluation : QCM Interactif (12 Questions)
          </h2>
        </div>

        <ChapTransitoiresQuickQuiz />
      </section>
    </div>
  );
}
