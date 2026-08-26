"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import LazyMount from "@/components/ui/LazyMount";
import LatexMath from "@/components/ui/LatexMath";
import { 
  Droplets, 
  Sparkles, 
  FlaskConical, 
  Layers, 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Atom, 
  Zap, 
  ShieldCheck,
  Calculator,
  ArrowRight,
  BookOpen
} from "lucide-react";

// Dynamic import for 3D Canvas
const WaterDipoleSolvation3DCanvas = dynamic(
  () => import("../components/WaterDipoleSolvation3DCanvas"),
  { ssr: false }
);

/* ── Collapsible Step Component ── */
function CollapsibleStep({
  step,
  title,
  color = "emerald",
  children,
  defaultOpen = false,
}: {
  step: number;
  title: string;
  color?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", dot: "bg-emerald-500" },
    teal: { bg: "bg-teal-500/5", border: "border-teal-500/20", text: "text-teal-400", dot: "bg-teal-500" },
    cyan: { bg: "bg-cyan-500/5", border: "border-cyan-500/20", text: "text-cyan-400", dot: "bg-cyan-500" },
    indigo: { bg: "bg-indigo-500/5", border: "border-indigo-500/20", text: "text-indigo-400", dot: "bg-indigo-500" },
    amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-500" },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className={`rounded-2xl ${c.bg} border ${c.border} overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className={`w-7 h-7 rounded-full ${c.dot} flex items-center justify-center text-slate-950 text-xs font-black shrink-0 shadow-lg`}>
          {step}
        </div>
        <span className={`text-xs sm:text-sm font-bold ${c.text} flex-1`}>{title}</span>
        {open ? (
          <ChevronUp className={`w-4 h-4 ${c.text} shrink-0`} />
        ) : (
          <ChevronDown className={`w-4 h-4 ${c.text} shrink-0`} />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-5 pt-1 space-y-4 border-t border-border/20 text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Chap1GeneralitesSolutions() {
  // QCM Interactive State
  const [selectedQcm, setSelectedQcm] = useState<Record<number, number>>({});
  const [showQcmExplanation, setShowQcmExplanation] = useState<Record<number, boolean>>({});

  const handleQcmSelect = (qIndex: number, optIndex: number) => {
    setSelectedQcm(prev => ({ ...prev, [qIndex]: optIndex }));
    setShowQcmExplanation(prev => ({ ...prev, [qIndex]: true }));
  };

  const qcmList = [
    {
      question: "Pourquoi l'eau possède-t-elle un pouvoir ionisant et un pouvoir dispersant remarquablement élevés ?",
      options: [
        "En raison de sa masse molaire très faible (M = 18 g/mol).",
        "En raison de sa permittivité diélectrique relative élevée (εᵣ ≈ 78.5) et de son moment dipolaire permanent.",
        "Parce que le produit ionique de l'eau Ke est très grand à 25°C.",
        "Car l'eau est un composé apolaire qui dissout les corps gras."
      ],
      correct: 1,
      explanation: "D'après la loi de Coulomb F = |q₁q₂| / (4πε₀εᵣ r²), la constante diélectrique élevée de l'eau (εᵣ ≈ 80) divise par 80 la force d'attraction entre les ions, permettant leur séparation facile (effet ionisant) et évitant leur recombinaison (effet dispersant)."
    },
    {
      question: "Une solution commerciale d'acide sulfurique H₂SO₄ à 96% en masse a une densité d = 1.84 et M = 98.1 g/mol. Quelle est sa concentration molaire C ?",
      options: [
        "1.80 mol/L",
        "9.80 mol/L",
        "18.0 mol/L",
        "36.0 mol/L"
      ],
      correct: 2,
      explanation: "On applique la relation C = (10 × d × w%) / M = (10 × 1.84 × 96) / 98.08 = 1766.4 / 98.08 ≈ 18.0 mol/L."
    },
    {
      question: "Quelle est la force ionique I d'une solution contenant 0.02 mol/L de NaCl et 0.01 mol/L de CaCl₂ ?",
      options: [
        "0.03 mol/L",
        "0.05 mol/L",
        "0.06 mol/L",
        "0.08 mol/L"
      ],
      correct: 1,
      explanation: "I = 0.5 × ∑ cᵢ zᵢ² = 0.5 × [ (c_Na × 1²) + (c_Cl,total × 1²) + (c_Ca × 2²) ]. Ici c(Na⁺)=0.02, c(Ca²⁺)=0.01, c(Cl⁻)=0.02 + 2×0.01 = 0.04 mol/L. Donc I = 0.5 × [0.02×1 + 0.04×1 + 0.01×4] = 0.5 × [0.02 + 0.04 + 0.04] = 0.5 × 0.10 = 0.05 mol/L."
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-10 w-full max-w-full overflow-x-hidden pb-16">

      {/* HEADER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-card/90 border border-border/80 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black mb-4">
          <Droplets className="w-4 h-4" />
          <span>Module 05 • Chapitre 01 • Fondements Physico-Chimiques</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mb-4 leading-snug">
          Généralités sur les Solutions Aqueuses
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-3xl font-medium">
          L&apos;eau liquide est le solvant par excellence de la chimie et de la biologie. Ses propriétés diélectriques exceptionnelles, son moment dipolaire permanent et sa capacité à former des liaisons hydrogène conditionnent l&apos;ensemble des équilibres en solution aqueuse.
        </p>
      </section>

      {/* 3D SIMULATOR SECTION */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-extrabold text-foreground tracking-wide uppercase">
            Laboratoire Virtuel 3D • L&apos;Eau & Les Cages d&apos;Hydratation
          </h2>
        </div>
        <LazyMount fallbackText="Chargement du simulateur moléculaire 3D...">
          <WaterDipoleSolvation3DCanvas />
        </LazyMount>
      </section>

      {/* PARTIE 1: L'EAU SOLVANT D'EXCEPTION */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black">
          <Atom className="w-3.5 h-3.5" />
          <span>Partie 1 • Propriétés Physico-Chimiques de l&apos;Eau Solvant</span>
        </div>

        <h2 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
          1. Structure Moléculaire & Triple Pouvoir de l&apos;Eau
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/20 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-xs">
              01
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">Effet Ionisant</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Grâce à sa constante diélectrique très élevée (<LatexMath math="\varepsilon_r \approx 78.5" /> à 25°C), l&apos;eau affaiblit les forces électrostatiques de Coulomb qui maintiennent les ions dans un cristal (<LatexMath math="F = \frac{F_0}{\varepsilon_r}" />).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-indigo-500/20 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xs">
              02
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">Effet Solvatant (Hydratation)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Le fort moment dipolaire (<LatexMath math="p = 1.85\text{ D}" />) et les liaisons hydrogène permettent aux molécules d&apos;eau d&apos;entourer les ions d&apos;une cage d&apos;hydratation, libérant l&apos;enthalpie d&apos;hydratation (<LatexMath math="\Delta_{\text{hyd}}H^\circ < 0" />).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-sky-500/20 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 font-black text-xs">
              03
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-foreground">Effet Dispersant</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              L&apos;agitation thermique disperse les ions hydratés dans tout le volume du solvant. L&apos;écran diélectrique empêche leur recombinaison en solide.
            </p>
          </div>
        </div>

        {/* Deep Dive Collapsibles */}
        <div className="space-y-3 pt-2">
          <CollapsibleStep
            step={1}
            title="Démonstration : Pourquoi l'eau dissout facilement NaCl et non l'éther ?"
            color="emerald"
          >
            <p>
              Considérons deux ions ponctuels <LatexMath math="\text{Na}^+" /> et <LatexMath math="\text{Cl}^-" /> séparés par une distance <LatexMath math="r \approx 2.8 \times 10^{-10}\text{ m}" /> dans un cristal.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-border/40 font-mono text-xs overflow-x-auto">
              <LatexMath math="F_{\text{vide}} = \frac{e^2}{4\pi \varepsilon_0 r^2} \approx \frac{(1.6 \times 10^{-19})^2}{4\pi \times 8.85 \times 10^{-12} \times (2.8 \times 10^{-10})^2} \approx 2.9 \times 10^{-9}\text{ N}" />
            </div>
            <p>
              Dans l&apos;eau liquide (<LatexMath math="\varepsilon_r = 78.5" />), cette force devient :
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-border/40 font-mono text-xs overflow-x-auto">
              <LatexMath math="F_{\text{eau}} = \frac{F_{\text{vide}}}{\varepsilon_r} = \frac{2.9 \times 10^{-9}}{78.5} \approx 3.7 \times 10^{-11}\text{ N}" />
            </div>
            <p>
              Dans un solvant organique apolaire (ex: éther où <LatexMath math="\varepsilon_r \approx 4.3" />), la force reste très élevée (<LatexMath math="F \approx 6.7 \times 10^{-10}\text{ N}" />), ce qui rend la séparation des ions thermodynamiquement impossible sous la seule agitation thermique.
            </p>
          </CollapsibleStep>
        </div>
      </section>

      {/* PARTIE 2: GRANDEURS & CONCENTRATIONS */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-black">
          <Calculator className="w-3.5 h-3.5" />
          <span>Partie 2 • Expressions des Concentrations & Formules Clés</span>
        </div>

        <h2 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
          2. Définitions & Formule Fondamentale des Solutions Commerciales
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-border/60 text-foreground">
                <th className="p-3.5 font-bold">Grandeur</th>
                <th className="p-3.5 font-bold">Symbole & Unité</th>
                <th className="p-3.5 font-bold">Formule Définition</th>
                <th className="p-3.5 font-bold">Commentaire Concours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-muted-foreground">
              <tr className="hover:bg-white/[0.02]">
                <td className="p-3.5 font-semibold text-foreground">Concentration Molaire</td>
                <td className="p-3.5 font-mono text-cyan-400"><LatexMath math="C\text{ ou }[X]\text{ (mol}\cdot\text{L}^{-1}\text{)}" /></td>
                <td className="p-3.5 font-mono"><LatexMath math="C = \frac{n_{\text{soluté}}}{V_{\text{solution}}}" /></td>
                <td className="p-3.5">Dépend de la température par dilatation thermique de <LatexMath math="V" />.</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-3.5 font-semibold text-foreground">Concentration Massique</td>
                <td className="p-3.5 font-mono text-cyan-400"><LatexMath math="C_m\text{ (g}\cdot\text{L}^{-1}\text{)}" /></td>
                <td className="p-3.5 font-mono"><LatexMath math="C_m = \frac{m_{\text{soluté}}}{V_{\text{solution}}} = C \times M" /></td>
                <td className="p-3.5"><LatexMath math="M" /> est la masse molaire du soluté (g/mol).</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-3.5 font-semibold text-foreground">Fraction Molaire</td>
                <td className="p-3.5 font-mono text-cyan-400"><LatexMath math="x_i\text{ (sans unité)}" /></td>
                <td className="p-3.5 font-mono"><LatexMath math="x_i = \frac{n_i}{\sum n_j}" /></td>
                <td className="p-3.5">Grandeur thermodynamique rigoureuse, indépendante de <LatexMath math="T" />.</td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-3.5 font-semibold text-foreground">Molalité</td>
                <td className="p-3.5 font-mono text-cyan-400"><LatexMath math="m_i\text{ (mol}\cdot\text{kg}^{-1}\text{)}" /></td>
                <td className="p-3.5 font-mono"><LatexMath math="m_i = \frac{n_i}{m_{\text{solvant}}}" /></td>
                <td className="p-3.5">Utilisée pour les propriétés colligatives (cryométrie, ébulliométrie).</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Master Formula Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-cyan-400 uppercase tracking-wide">
            <Sparkles className="w-4 h-4" />
            <span>Formule Reine du Concours : Concentration d&apos;une Solution Commerciale</span>
          </div>
          <div className="text-center py-2">
            <LatexMath math="C = \frac{10 \times d \times w\%}{M}" />
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-border/40">
            <div><strong className="text-foreground">d :</strong> Densité par rapport à l&apos;eau (<LatexMath math="d = \rho / \rho_{\text{eau}}" />)</div>
            <div><strong className="text-foreground">w% :</strong> Titre ou pourcentage massique pur (%)</div>
            <div><strong className="text-foreground">M :</strong> Masse molaire du soluté (g/mol)</div>
          </div>
        </div>
      </section>

      {/* PARTIE 3: ACTIVITÉ CHIMIQUE & FORCE IONIQUE */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black">
          <Scale className="w-3.5 h-3.5" />
          <span>Partie 3 • Thermodynamique des Solutions Réelles</span>
        </div>

        <h2 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
          3. Activité Chimique <LatexMath math="a_i" /> & Loi Limite de Debye-Hückel
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Dans une solution réelle, les interactions électrostatiques à longue portée entre ions modifient leur comportement chimique. Le potentiel chimique d&apos;une espèce <LatexMath math="i" /> s&apos;écrit rigoureusement :
        </p>

        <div className="p-3 rounded-2xl bg-black/40 border border-border/50 text-center">
          <LatexMath math="\mu_i(T, P) = \mu_i^\circ(T) + RT \ln a_i" />
        </div>

        {/* Conventions d'activité */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-border/60 space-y-2">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Solvant (Eau liquide)
            </h3>
            <p className="text-xs text-muted-foreground">
              Dans les solutions diluées, l&apos;eau est considérée comme corps pur dans son état standard :
            </p>
            <div className="font-mono text-emerald-400 text-xs">
              <LatexMath math="a_{\text{H}_2\text{O}} \approx 1" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-border/60 space-y-2">
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Soluté en solution
            </h3>
            <p className="text-xs text-muted-foreground">
              <LatexMath math="a_i = \gamma_i \cdot \frac{C_i}{C^\circ}" /> avec <LatexMath math="C^\circ = 1\text{ mol}\cdot\text{L}^{-1}" /> et <LatexMath math="\gamma_i" /> le coefficient d&apos;activité. À dilution infinie : <LatexMath math="\gamma_i \to 1 \implies a_i = [X]/C^\circ" />.
            </p>
          </div>
        </div>

        {/* Force Ionique & Debye Hückel */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">
            Force Ionique <LatexMath math="I" /> (Lewis & Randall) & Modèle de Debye-Hückel
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            La force ionique mesure l&apos;intensité globale du champ électrostatique créé par l&apos;ensemble des ions présents en solution :
          </p>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 text-center">
            <LatexMath math="I = \frac{1}{2} \sum_{i} C_i \cdot z_i^2" />
          </div>

          <CollapsibleStep
            step={2}
            title="Loi Limite de Debye-Hückel (Valable pour I < 0.05 mol/L)"
            color="indigo"
            defaultOpen={true}
          >
            <p>
              Pour les solutions très diluées (<LatexMath math="I < 0.05\text{ mol/L}" />), la théorie de Debye-Hückel établit que le coefficient d&apos;activité individuel d&apos;un ion de charge <LatexMath math="z_i" /> s&apos;exprime par :
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-border/40 text-center font-mono">
              <LatexMath math="\log \gamma_i = -A \cdot z_i^2 \sqrt{I}" />
            </div>
            <p>
              À <LatexMath math="25^\circ\text{C}" /> dans l&apos;eau, la constante vaut <LatexMath math="A = 0.509\text{ mol}^{-1/2}\cdot\text{L}^{1/2}" />.
            </p>
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <strong>Conséquence physique :</strong> Plus la force ionique est grande et plus la charge de l&apos;ion <LatexMath math="|z_i|" /> est élevée, plus <LatexMath math="\gamma_i < 1" />, ce qui diminue l&apos;activité effective de l&apos;ion (l&apos;ion est stabilisé par son atmosphère ionique).
            </div>
          </CollapsibleStep>
        </div>
      </section>

      {/* PARTIE 4: GRANDES FAMILLES DE RÉACTIONS */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-black">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Partie 4 • Panorama des 4 Grandes Familles de Réactions</span>
        </div>

        <h2 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
          4. Classification des Réactions en Solution Aqueuse
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-border/60 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <span>01. Réactions Acido-Basiques</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transfert de particules <strong>protons <LatexMath math="\text{H}^+" /></strong> entre un donneur (acide) et un accepteur (base) selon Brönsted.
            </p>
            <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] text-emerald-300">
              <LatexMath math="\text{HA} + \text{H}_2\text{O} \rightleftharpoons \text{A}^- + \text{H}_3\text{O}^+" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-border/60 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <span>02. Réactions de Précipitation</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Formation d&apos;une <strong>phase solide</strong> à partir d&apos;ions solvatés lorsque le produit ionique dépasse le produit de solubilité <LatexMath math="K_s" />.
            </p>
            <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] text-cyan-300">
              <LatexMath math="\text{Ag}^+ + \text{Cl}^- \rightleftharpoons \text{AgCl}_{(s)}" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-border/60 space-y-2.5">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
              <span>03. Réactions d&apos;Oxydo-Réduction</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transfert de particules <strong>électrons <LatexMath math="e^-" /></strong> entre un réducteur et un oxydant. Base de l&apos;électrochimie et des piles.
            </p>
            <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] text-sky-300">
              <LatexMath math="\text{Ox}_1 + \text{Red}_2 \rightleftharpoons \text{Red}_1 + \text{Ox}_2" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-border/60 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <span>04. Réactions de Complexation</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Association d&apos;un cation métallique central avec des molécules ou anions donneurs de doublets (ligands).
            </p>
            <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] text-indigo-300">
              <LatexMath math="\text{Cu}^{2+} + 4\,\text{NH}_3 \rightleftharpoons [\text{Cu}(\text{NH}_3)_4]^{2+}" />
            </div>
          </div>
        </div>
      </section>

      {/* PARTIE 5: QCM INTERACTIF SPECIAL CONCOURS */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-black">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Auto-Évaluation • QCM Type Concours</span>
        </div>

        <h2 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">
          5. Validez vos Connaissances (Questions Officielles)
        </h2>

        <div className="space-y-6">
          {qcmList.map((q, qIdx) => {
            const userChoice = selectedQcm[qIdx];
            const isAnswered = userChoice !== undefined;
            const isCorrect = userChoice === q.correct;

            return (
              <div 
                key={qIdx} 
                className="p-5 rounded-2xl bg-slate-900/50 border border-border/60 space-y-3.5 transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                    {q.question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    let optStyle = "border-border/40 bg-slate-950/40 text-muted-foreground hover:bg-white/[0.02]";
                    if (isAnswered) {
                      if (optIdx === q.correct) {
                        optStyle = "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold";
                      } else if (userChoice === optIdx) {
                        optStyle = "border-rose-500/60 bg-rose-500/10 text-rose-300 font-semibold";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleQcmSelect(qIdx, optIdx)}
                        disabled={isAnswered}
                        className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between gap-2 ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === q.correct && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                    isCorrect 
                      ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200" 
                      : "bg-rose-950/40 border-rose-500/30 text-rose-200"
                  }`}>
                    <div className="font-bold mb-1 flex items-center gap-1.5">
                      {isCorrect ? "✅ Bravo ! Bonne réponse." : "❌ Réponse incorrecte."}
                    </div>
                    <p className="text-muted-foreground text-[11px]">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
