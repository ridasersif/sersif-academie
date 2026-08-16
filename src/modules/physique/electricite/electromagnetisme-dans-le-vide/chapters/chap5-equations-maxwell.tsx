"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";
import dynamic from 'next/dynamic';
import LazyMount from "@/components/ui/LazyMount";

const DisplacementCurrent3DCanvas = dynamic(() => import("../components/DisplacementCurrent3DCanvas"), { ssr: false });

import { 
  Atom, 
  Compass, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Waves, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Scale, 
  Radio, 
  ArrowRight,
  Flame,
  CheckCircle,
  GraduationCap
} from "lucide-react";

/* ── Maxwell Equation Data Structure ── */
interface MaxwellEquationData {
  id: string;
  tag: string;
  name: string;
  category: string;
  formula: string;
  meaning: string;
  color: "blue" | "emerald" | "amber" | "purple";
  badge: string;
  demoTitle: string;
  steps: {
    title: string;
    description: string;
    math?: string;
    note?: string;
  }[];
  consequence: string;
}

const MAXWELL_EQUATIONS_DATA: MaxwellEquationData[] = [
  {
    id: "mg",
    tag: "M-G",
    name: "Maxwell-Gauss",
    category: "Équation Source Scalaire",
    formula: "\\mathrm{div}\\,\\vec{E} = \\frac{\\rho}{\\varepsilon_0}",
    meaning: "Les charges électriques sont les sources divergentes du champ électrique. Un champ E diverge ou converge vers les charges.",
    color: "blue",
    badge: "Théorème de Gauss Local",
    demoTitle: "Démonstration Complète de Maxwell-Gauss",
    steps: [
      {
        title: "1. Point de départ : Théorème de Gauss Intégral",
        description: "Dans le vide, le flux du champ électrique sortant d'une surface fermée quelconque Σ contenant une charge totale intérieure Q_int est donné par :",
        math: "\\Phi_E = \\iint_{\\Sigma} \\vec{E} \\cdot d\\vec{S} = \\frac{Q_{\\text{int}}}{\\varepsilon_0}"
      },
      {
        title: "2. Expression volumique de la charge intérieure",
        description: "Si la charge est répartie avec une densité volumique ρ(r, t) dans le volume V délimité par la surface fermée Σ :",
        math: "Q_{\\text{int}} = \\iiint_{V} \\rho(\\vec{r}, t) \\, dV \\implies \\iint_{\\Sigma} \\vec{E} \\cdot d\\vec{S} = \\frac{1}{\\varepsilon_0} \\iiint_{V} \\rho \\, dV"
      },
      {
        title: "3. Application du Théorème d'Ostrogradski (Divergence)",
        description: "D'après l'analyse vectorielle, le flux à travers la surface fermée est égal à l'intégrale de la divergence du champ sur le volume intérieur :",
        math: "\\iint_{\\Sigma} \\vec{E} \\cdot d\\vec{S} = \\iiint_{V} (\\mathrm{div}\\,\\vec{E}) \\, dV"
      },
      {
        title: "4. Identification locale en tout point de l'espace",
        description: "En égalisant les deux intégrales volumiques pour un volume V arbitrairement petit entourant chaque point M :",
        math: "\\iiint_{V} \\left( \\mathrm{div}\\,\\vec{E} - \\frac{\\rho}{\\varepsilon_0} \\right) dV = 0 \\quad \\forall V \\implies \\mathrm{div}\\,\\vec{E} = \\frac{\\rho}{\\varepsilon_0}",
        note: "Cette équation est purement locale : elle relie la divergence en un point M à la densité de charge présente en ce même point M."
      }
    ],
    consequence: "Les lignes de champ électrique sont ouvertes : elles naissent sur les charges positives (sources) et meurent sur les charges négatives (puits)."
  },
  {
    id: "mflux",
    tag: "M-Flux",
    name: "Maxwell-Thomson (Flux)",
    category: "Équation de Structure",
    formula: "\\mathrm{div}\\,\\vec{B} = 0",
    meaning: "Le champ magnétique est à flux conservatif. Il n'existe pas de monopôles magnétiques isolés (pas de charges magnétiques ponctuelles).",
    color: "emerald",
    badge: "Conservation du Flux",
    demoTitle: "Démonstration & Existence du Potentiel Vecteur A",
    steps: [
      {
        title: "1. Constat Expérimental : Absence de monopôles magnétiques",
        description: "Si on coupe un aimant en deux, on obtient toujours deux aimants complets dipolaires (Nord-Sud). Le flux sortant de toute surface fermée Σ est rigoureusement nul :",
        math: "\\iint_{\\Sigma} \\vec{B} \\cdot d\\vec{S} = 0 \\quad \\text{(Flux conservatif)}"
      },
      {
        title: "2. Application du Théorème d'Ostrogradski",
        description: "En transformant l'intégrale de surface fermée en intégrale volumique sur le volume intérieur V :",
        math: "\\iint_{\\Sigma} \\vec{B} \\cdot d\\vec{S} = \\iiint_{V} (\\mathrm{div}\\,\\vec{B}) \\, dV = 0 \\quad \\forall V"
      },
      {
        title: "3. Déduction de la forme locale",
        description: "Comme cette propriété est vérifiée pour n'importe quel volume d'espace V :",
        math: "\\mathrm{div}\\,\\vec{B} = 0"
      },
      {
        title: "4. Conséquence vectorielle : Le Potentiel Vecteur A",
        description: "En mathématiques vectorielles, un champ à divergence identiquement nulle dérive toujours d'un potentiel vecteur (car div(rot A) ≡ 0) :",
        math: "\\mathrm{div}\\,\\vec{B} = 0 \\iff \\exists \\vec{A}(\\vec{r}, t) \\quad \\text{tel que} \\quad \\vec{B} = \\vec{\\mathrm{rot}}\\,\\vec{A}",
        note: "Cette équation impose que les lignes de champ magnétique soient obligatoirement des boucles fermées sans début ni fin."
      }
    ],
    consequence: "Les lignes de champ B n'ont ni début ni fin : elles se referment toujours sur elles-mêmes."
  },
  {
    id: "mf",
    tag: "M-F",
    name: "Maxwell-Faraday",
    category: "Équation d'Induction",
    formula: "\\vec{\\mathrm{rot}}\\,\\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}",
    meaning: "Tout champ magnétique variable dans le temps induit un champ électrique tourbillonnaire (non conservatif).",
    color: "amber",
    badge: "Loi d'Induction de Faraday",
    demoTitle: "Démonstration de Maxwell-Faraday",
    steps: [
      {
        title: "1. Loi Intégrale de Faraday (Induction)",
        description: "Pour un circuit fixe épousant un contour fermé Γ orienté bordant une surface ouverte S, la force électromotrice induite e vaut :",
        math: "e = \\oint_{\\Gamma} \\vec{E} \\cdot d\\vec{\\ell} = -\\frac{d\\Phi_B}{dt} = -\\frac{d}{dt} \\iint_{S} \\vec{B} \\cdot d\\vec{S}"
      },
      {
        title: "2. Dérivation sous le signe intégral (Circuit fixe)",
        description: "Le contour Γ étant immobile dans le référentiel d'étude, la dérivée temporelle totale d/dt commute avec l'intégrale spatiale sous forme de dérivée partielle :",
        math: "\\oint_{\\Gamma} \\vec{E} \\cdot d\\vec{\\ell} = -\\iint_{S} \\frac{\\partial \\vec{B}}{\\partial t} \\cdot d\\vec{S}"
      },
      {
        title: "3. Application du Théorème de Stokes-Ampère",
        description: "La circulation du champ électrique le long du contour fermé Γ s'exprime comme le flux de son rotationnel :",
        math: "\\oint_{\\Gamma} \\vec{E} \\cdot d\\vec{\\ell} = \\iint_{S} (\\vec{\\mathrm{rot}}\\,\\vec{E}) \\cdot d\\vec{S}"
      },
      {
        title: "4. Égalité locale sur toute surface S",
        description: "On regroupe les deux intégrales sur la même surface ouverte S :",
        math: "\\iint_{S} \\left( \\vec{\\mathrm{rot}}\\,\\vec{E} + \\frac{\\partial \\vec{B}}{\\partial t} \\right) \\cdot d\\vec{S} = 0 \\quad \\forall S \\implies \\vec{\\mathrm{rot}}\\,\\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}",
        note: "En régime variable, rot(E) ≠ 0 : le champ électrique n'est plus conservatif et ne dérive plus d'un simple potentiel scalaire -∇V."
      }
    ],
    consequence: "Un champ magnétique variable dans le temps engendre des tourbillons de champ électrique, principe de base des générateurs et transformateurs."
  },
  {
    id: "ma",
    tag: "M-A",
    name: "Maxwell-Ampère",
    category: "Équation Source Vectorielle",
    formula: "\\vec{\\mathrm{rot}}\\,\\vec{B} = \\mu_0 \\left( \\vec{j} + \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t} \\right)",
    meaning: "Le champ B est généré par les courants réels de conduction j ET par la variation temporelle du champ électrique (courant de déplacement).",
    color: "purple",
    badge: "Courant de Déplacement",
    demoTitle: "Démonstration du Terme Manquant de Maxwell",
    steps: [
      {
        title: "1. Le Paradoxe de la loi d'Ampère stationnaire",
        description: "En magnétostatique : rot(B) = μ₀ j. Prenons la divergence des deux côtés :",
        math: "\\mathrm{div}(\\vec{\\mathrm{rot}}\\,\\vec{B}) = \\mu_0 \\, \\mathrm{div}(\\vec{j})"
      },
      {
        title: "2. Contradiction avec l'Équation de Continuité",
        description: "Comme div(rot) ≡ 0 pour tout vecteur, cela imposerait div(j) = 0. Or, la conservation de la charge électrique exige :",
        math: "\\mathrm{div}(\\vec{j}) + \\frac{\\partial \\rho}{\\partial t} = 0 \\implies \\mathrm{div}(\\vec{j}) = -\\frac{\\partial \\rho}{\\partial t} \\neq 0 \\quad \\text{(en régime variable)}"
      },
      {
        title: "3. Le Coup de Génie de Maxwell (Injection de Gauss)",
        description: "En utilisant Maxwell-Gauss (ρ = ε₀ div(E)), on transforme l'équation de continuité :",
        math: "\\mathrm{div}(\\vec{j}) + \\frac{\\partial}{\\partial t}\\left(\\varepsilon_0 \\mathrm{div}\\,\\vec{E}\\right) = 0 \\implies \\mathrm{div}\\left( \\vec{j} + \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t} \\right) = 0"
      },
      {
        title: "4. Établissement de l'équation complète de Maxwell-Ampère",
        description: "La quantité dont la divergence est strictement nulle est le courant total j_total = j + ε₀ ∂E/∂t. L'équation exacte s'écrit alors :",
        math: "\\vec{\\mathrm{rot}}\\,\\vec{B} = \\mu_0 \\left( \\vec{j} + \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t} \\right)",
        note: "j_D = ε₀ ∂E/∂t est le courant de déplacement, responsable de la propagation des ondes électromagnétiques dans le vide."
      }
    ],
    consequence: "Permet d'expliquer le passage du courant dans un condensateur sans contact et prédit l'existence des ondes lumineuses se propageant à c = 1/√(ε₀μ₀)."
  }
];

export default function Chap5EquationsMaxwell() {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  const toggleOpen = (id: string) => {
    setOpenMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* HEADER HERO                                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="bg-card/90 border border-purple-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <Atom className="w-3.5 h-3.5" />
          <span>Chapitre 05 • Unification Électromagnétique</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-4 text-foreground leading-tight">
          5. Les Équations de Maxwell dans le Vide
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Les équations de Maxwell constituent le socle unifié de l'électromagnétisme classique. Cliquez sur la flèche <strong>« Démonstration »</strong> de chaque carte pour dérouler directement la démonstration mathématique complète sous l'équation.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* LES 4 CARTES DÉROULANTES AVEC FLÈCHE                    */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Formulations Locales & Démonstrations Déroulantes</span>
          </div>
          <span className="text-xs text-muted-foreground italic">
            👉 Cliquez sur la flèche pour ouvrir la démonstration ci-dessous
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
          {MAXWELL_EQUATIONS_DATA.map((eq) => {
            const isOpen = !!openMap[eq.id];
            const isBlue = eq.color === "blue";
            const isEmerald = eq.color === "emerald";
            const isAmber = eq.color === "amber";
            const isPurple = eq.color === "purple";

            const borderCol = isBlue ? "border-blue-500/30" : isEmerald ? "border-emerald-500/30" : isAmber ? "border-amber-500/30" : "border-purple-500/30";
            const bgCol = isBlue ? "bg-blue-500/5" : isEmerald ? "bg-emerald-500/5" : isAmber ? "bg-amber-500/5" : "bg-purple-500/5";
            const tagCol = isBlue ? "text-blue-500 bg-blue-500/10" : isEmerald ? "text-emerald-500 bg-emerald-500/10" : isAmber ? "text-amber-500 bg-amber-500/10" : "text-purple-500 bg-purple-500/10";
            const badgeCol = isBlue ? "text-blue-500" : isEmerald ? "text-emerald-500" : isAmber ? "text-amber-500" : "text-purple-500";
            const btnBg = isBlue ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 hover:bg-blue-500/25 border-blue-500/30" : isEmerald ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/30" : isAmber ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border-amber-500/30" : "bg-purple-500/15 text-purple-600 dark:text-purple-400 hover:bg-purple-500/25 border-purple-500/30";

            return (
              <div 
                key={eq.id}
                className={`p-4 sm:p-5 rounded-2xl ${bgCol} border ${borderCol} shadow-sm transition-all duration-300 flex flex-col justify-between relative overflow-hidden`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${badgeCol}`}>
                      {eq.category}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] rounded-md font-mono font-bold ${tagCol}`}>
                      {eq.tag}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-foreground mb-3">
                    {eq.name}
                  </h4>

                  <div className="py-3 flex justify-center text-base sm:text-lg bg-background/90 rounded-xl border border-border/50 mb-3 shadow-inner">
                    <LatexMath math={eq.formula} />
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    <strong>Signification physique :</strong> {eq.meaning}
                  </p>
                </div>

                {/* Arrow Toggle Button */}
                <button
                  onClick={() => toggleOpen(eq.id)}
                  className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between font-bold text-xs transition-all duration-200 ${btnBg}`}
                >
                  <span className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    {isOpen ? "Masquer la démonstration" : "Voir la démonstration complète"}
                  </span>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180 bg-black/10 dark:bg-white/10" : ""}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Expandable Demonstration Window (Directly Underneath) */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[3500px] opacity-100 mt-4 pt-4 border-t border-border/60" : "max-h-0 opacity-0 mt-0 pt-0"
                  }`}
                >
                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <h5 className="font-extrabold text-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      {eq.demoTitle}
                    </h5>

                    {eq.steps.map((step, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-background/90 border border-border/80 space-y-1.5 shadow-sm">
                        <h6 className="font-bold text-foreground text-xs flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">
                            {idx + 1}
                          </span>
                          {step.title}
                        </h6>
                        
                        <p className="text-muted-foreground leading-relaxed pl-6 text-[11px] sm:text-xs">
                          {step.description}
                        </p>

                        {step.math && (
                          <div className="ml-6 p-2 bg-muted/60 rounded-lg border border-border/50 flex justify-center text-xs font-mono overflow-x-auto">
                            <LatexMath math={step.math} />
                          </div>
                        )}

                        {step.note && (
                          <p className="ml-6 text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-400 italic bg-amber-500/5 p-1.5 rounded-md border border-amber-500/20">
                            💡 {step.note}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20">
                      <span className="font-bold text-primary text-[10px] sm:text-xs uppercase tracking-wider block mb-0.5">
                        Conséquence Physique
                      </span>
                      <p className="text-muted-foreground leading-relaxed text-[11px] sm:text-xs">
                        {eq.consequence}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PARTIE 2: SIMULATEUR 3D DU COURANT DE DÉPLACEMENT DE MAXWELL          */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Simulateur 3D Interactif • Courant de Déplacement</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold mb-3 text-foreground">
          Visualisation : Condensateur en Charge & Champ Magnétique Induit
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
          Entre les armatures d'un condensateur plan en cours de charge, aucun électron ne passe à travers le vide (<LatexMath math="\vec{j} = \vec{0}" />). Cependant, la variation rapide du champ électrique (<LatexMath math="\partial\vec{E}/\partial t" />) crée un véritable <strong>courant de déplacement</strong> <LatexMath math="\vec{j}_D = \varepsilon_0 \frac{\partial \vec{E}}{\partial t}" /> qui engendre des lignes de champ magnétique circulaires <LatexMath math="\vec{B}" />.
        </p>

        <LazyMount height="400px" fallbackText="Chargement Simulateur Déplacement...">
          <DisplacementCurrent3DCanvas />
        </LazyMount>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PARTIE 3: FORMES INTÉGRALES ET THÉORÈMES FONDAMENTAUX                 */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Section 3 • Formes Intégrales</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold mb-4 text-foreground">
          Tableau Synthétique : Formes Locales vs Formes Intégrales
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-foreground font-bold">
                <th className="p-3">Équation</th>
                <th className="p-3">Forme Locale</th>
                <th className="p-3">Théorème Analytique</th>
                <th className="p-3">Forme Intégrale Globale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr className="hover:bg-muted/20">
                <td className="p-3 font-semibold text-blue-500">M-Gauss</td>
                <td className="p-3"><LatexMath math="\mathrm{div}\,\vec{E} = \frac{\rho}{\varepsilon_0}" /></td>
                <td className="p-3 text-muted-foreground">Ostrogradski : <LatexMath math="\iiint \mathrm{div}\vec{E}\,dV = \iint \vec{E}\cdot d\vec{S}" /></td>
                <td className="p-3 font-mono text-foreground font-bold">
                  <LatexMath math="\iint_{S_f} \vec{E} \cdot d\vec{S} = \frac{Q_{\text{int}}}{\varepsilon_0}" />
                </td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="p-3 font-semibold text-emerald-500">M-Flux</td>
                <td className="p-3"><LatexMath math="\mathrm{div}\,\vec{B} = 0" /></td>
                <td className="p-3 text-muted-foreground">Ostrogradski sur surface fermée <LatexMath math="S_f" /></td>
                <td className="p-3 font-mono text-foreground font-bold">
                  <LatexMath math="\iint_{S_f} \vec{B} \cdot d\vec{S} = 0" />
                </td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="p-3 font-semibold text-amber-500">M-Faraday</td>
                <td className="p-3"><LatexMath math="\vec{\mathrm{rot}}\,\vec{E} = -\frac{\partial \vec{B}}{\partial t}" /></td>
                <td className="p-3 text-muted-foreground">Stokes : <LatexMath math="\iint \vec{\mathrm{rot}}\vec{E}\cdot d\vec{S} = \oint \vec{E}\cdot d\vec{\ell}" /></td>
                <td className="p-3 font-mono text-foreground font-bold">
                  <LatexMath math="e = \oint_{\Gamma} \vec{E} \cdot d\vec{\ell} = -\frac{d\Phi}{dt}" />
                </td>
              </tr>
              <tr className="hover:bg-muted/20">
                <td className="p-3 font-semibold text-purple-500">M-Ampère</td>
                <td className="p-3"><LatexMath math="\vec{\mathrm{rot}}\,\vec{B} = \mu_0(\vec{j} + \varepsilon_0 \frac{\partial\vec{E}}{\partial t})" /></td>
                <td className="p-3 text-muted-foreground">Stokes sur un contour <LatexMath math="\Gamma" /> s'appuyant sur <LatexMath math="S" /></td>
                <td className="p-3 font-mono text-foreground font-bold">
                  <LatexMath math="\oint_{\Gamma} \vec{B} \cdot d\vec{\ell} = \mu_0 \left( I_{\text{enlacé}} + \varepsilon_0 \frac{d\Phi_E}{dt} \right)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
