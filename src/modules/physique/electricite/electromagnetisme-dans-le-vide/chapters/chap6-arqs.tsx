"use client";

import React, { useState } from "react";
import LatexMath from "@/components/ui/LatexMath";
import dynamic from 'next/dynamic';
import LazyMount from "@/components/ui/LazyMount";

const ARQSCondition3DCanvas = dynamic(() => import("../components/ARQSCondition3DCanvas"), { ssr: false });
const ARQSTypesDual3DCanvas = dynamic(() => import("../components/ARQSTypesDual3DCanvas"), { ssr: false });
const DisplacementCurrent3DCanvas = dynamic(() => import("../components/DisplacementCurrent3DCanvas"), { ssr: false });
const SkinEffect3DCanvas = dynamic(() => import("../components/SkinEffect3DCanvas"), { ssr: false });
const ARQSExercise3DCanvas = dynamic(() => import("../components/ARQSExercise3DCanvas"), { ssr: false });

import { 
  Scale, 
  Zap, 
  Waves, 
  AlertTriangle, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Flame,
  Sparkles
} from "lucide-react";

/* ── Formula Card Propre & Épurée ── */
function FormulaCard({ 
  children, 
  label, 
  color = "cyan" 
}: { 
  children: React.ReactNode; 
  label: string; 
  color?: "cyan" | "emerald" | "amber" | "purple" | "sky" 
}) {
  const colorMap = {
    cyan: { border: "border-cyan-500/30", text: "text-cyan-400", bar: "bg-cyan-500" },
    emerald: { border: "border-emerald-500/30", text: "text-emerald-400", bar: "bg-emerald-500" },
    amber: { border: "border-amber-500/30", text: "text-amber-400", bar: "bg-amber-500" },
    purple: { border: "border-purple-500/30", text: "text-purple-400", bar: "bg-purple-500" },
    sky: { border: "border-sky-500/30", text: "text-sky-400", bar: "bg-sky-500" },
  };
  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`p-3 sm:p-4 rounded-xl bg-card border ${c.border} flex flex-col items-center justify-center relative overflow-hidden shadow-xs`}>
      <div className={`absolute top-0 left-0 w-1 h-full ${c.bar}`} />
      <div className="text-center text-xs sm:text-sm font-medium text-foreground py-1 overflow-x-auto w-full">
        {children}
      </div>
      <p className={`text-[10px] text-center ${c.text} font-bold uppercase tracking-wider mt-1`}>
        {label}
      </p>
    </div>
  );
}

/* ── Accordion pour l'Exercice d'Application ── */
function ExerciseQuestion({
  number,
  title,
  question,
  solution,
  tip
}: {
  number: number;
  title: string;
  question: React.ReactNode;
  solution: React.ReactNode;
  tip?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden transition-all duration-200">
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-muted/20">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            Q{number}
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-foreground">{title}</h4>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{question}</div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
            isOpen 
              ? "bg-primary text-primary-foreground border-primary" 
              : "bg-background hover:bg-muted text-foreground border-border"
          }`}
        >
          <span>{isOpen ? "Masquer la Solution" : "Voir la Solution"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-4 bg-background/50 border-t border-border/60 space-y-3 animate-in fade-in duration-200">
          <div className="text-xs text-foreground leading-relaxed">
            {solution}
          </div>

          {tip && (
            <div className="flex items-start gap-2 text-[11px] text-amber-500 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span><strong>Conseil du correcteur :</strong> {tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Chap6ARQS() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* ═══════════════════════════════════════════ */}
      {/* HEADER DU CHAPITRE                         */}
      {/* ═══════════════════════════════════════════ */}
      <div className="rounded-2xl p-5 sm:p-6 border border-teal-500/30 bg-gradient-to-br from-teal-950/30 via-slate-900 to-slate-950 shadow-sm relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[11px] font-bold mb-2">
          <Scale className="w-3.5 h-3.5" />
          <span>Chapitre 06 • Approximation Fondamentale</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          ARQS — Approximation des Régimes Quasi-Stationnaires
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl leading-relaxed">
          Comprendre quand et pourquoi les lois de l&apos;électricité usuelle (Kirchhoff, loi des mailles, loi des nœuds) sont valables, et ce qui change lorsque la fréquence augmente.
        </p>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 0 : L'INTUITION (POURQUOI L'ARQS ?)   */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-teal-500">
          <Lightbulb className="w-4 h-4" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            0. L&apos;Intuition : Pourquoi l&apos;électricité n&apos;est pas instantanée ?
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Quand vous appuyez sur un interrupteur, la lumière s&apos;allume en apparence instantanément. Mais en réalité, l&apos;information électromagnétique voyage à une vitesse finie : la vitesse de la lumière dans le vide <LatexMath math="c \approx 300\,000\text{ km/s}" />.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
            <strong className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Si le circuit est PETIT (Basse Fréquence) :
            </strong>
            <p className="text-[11.5px] text-muted-foreground leading-relaxed">
              Le temps de voyage de l&apos;onde est tellement minuscule devant les variations du signal qu&apos;on peut considérer que le courant est <strong>identique partout au même instant</strong>. C&apos;est l&apos;<strong>ARQS</strong> !
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1.5">
            <strong className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Si le circuit est GRAND ou la Fréquence ÉLEVÉE :
            </strong>
            <p className="text-[11.5px] text-muted-foreground leading-relaxed">
              Le signal a le temps de changer de valeur avant même d&apos;arriver au bout du fil ! Le courant n&apos;est plus le même le long du fil : on entre dans le domaine de la <strong>propagation d&apos;ondes</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 1: LA CONDITION FONDAMENTALE DE L'ARQS */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-cyan-500">
          <Scale className="w-4 h-4" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            1. La Condition Fondamentale de l&apos;ARQS
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Soit un circuit électrique de taille maximale <LatexMath math="L" />, parcouru par un signal sinusoïdal de fréquence <LatexMath math="f" />, de période <LatexMath math="T = 1/f" /> et de longueur d&apos;onde <LatexMath math="\lambda = c/f" />.
        </p>

        {/* Formule Clé */}
        <div className="space-y-2">
          <FormulaCard label="Critère Mathématique de l'ARQS" color="cyan">
            <LatexMath math="\tau = \frac{L}{c} \ll T \quad \Longleftrightarrow \quad L \ll \lambda = \frac{c}{f}" />
          </FormulaCard>
          
          <p className="text-xs text-center text-muted-foreground">
            Où <LatexMath math="\tau = L/c" /> représente le temps de propagation du signal à travers le circuit, et <LatexMath math="T" /> la période de variation du signal.
          </p>
        </div>

        {/* Critère Pratique & Remarque Vitesse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-muted-foreground space-y-1">
            <strong className="text-cyan-400 font-bold block flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Ordre de Grandeur Pratique pour les Exercices
            </strong>
            <p className="text-[11.5px] leading-relaxed">
              En pratique, l&apos;ARQS est considérée comme valable dès que <LatexMath math="L \le \lambda/100" /> (ou au moins <LatexMath math="L < \lambda/10" />).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-muted-foreground space-y-1">
            <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" />
              Remarque sur la Vitesse de Propagation
            </strong>
            <p className="text-[11.5px] leading-relaxed">
              Dans le vide <LatexMath math="c = 3\cdot 10^8\text{ m/s}" />, mais sur un circuit imprimé (PCB) avec substrat FR4, <LatexMath math="v \approx 2\cdot 10^8\text{ m/s}" />, ce qui rend <LatexMath math="\lambda" /> encore plus court !
            </p>
          </div>
        </div>

        {/* 3D Visualizer interactif */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold text-foreground">
            Visualisation 3D Interactive : Taille du circuit vs Longueur d&apos;onde
          </h3>
          <LazyMount height="380px" fallbackText="Chargement du simulateur ARQS...">
            <ARQSCondition3DCanvas />
          </LazyMount>
          <p className="text-[11px] text-muted-foreground text-center italic">
            Faites glisser le curseur pour observer comment la fréquence modifie la longueur d&apos;onde <LatexMath math="\lambda" /> et l&apos;état de la piste PCB.
          </p>
        </div>

        {/* 3 Exemples concrets du monde réel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
            <h4 className="text-xs font-bold text-emerald-400">Exemple 1 : Réseau Domestique (50 Hz)</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <LatexMath math="\lambda = \frac{3\cdot 10^8}{50} = 6\,000\text{ km}" />. Pour un laboratoire ou une maison (<LatexMath math="L \approx 10\text{ m}" />), <LatexMath math="L \ll \lambda" /> est vérifié à 100 %. L&apos;ARQS est parfaite.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-sky-500/5 border border-sky-500/20 space-y-1.5">
            <h4 className="text-xs font-bold text-sky-400">Exemple 2 : Radio FM (100 MHz)</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <LatexMath math="\lambda = \frac{3\cdot 10^8}{100\cdot 10^6} = 3\text{ m}" />. Pour un circuit imprimé de <LatexMath math="L \approx 10\text{ cm}" />, <LatexMath math="L < \lambda/10" />, l&apos;ARQS reste une approximation acceptable.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
            <h4 className="text-xs font-bold text-rose-400">Exemple 3 : Processeur PC (3 GHz)</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <LatexMath math="\lambda = \frac{3\cdot 10^8}{3\cdot 10^9} = 10\text{ cm}" />. La carte mère fait <LatexMath math="L \approx 30\text{ cm} > \lambda" /> ! L&apos;ARQS est totalement invalide : les pistes sont des lignes de transmission.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 2: ARQS MAGNÉTIQUE vs ARQS ÉLECTRIQUE */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-purple-500">
          <Zap className="w-4 h-4" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            2. ARQS Magnétique vs ARQS Électrique
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          En physique, on distingue deux variantes de l&apos;ARQS selon le type de circuit dominant :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* ARQS Magnétique */}
          <div className="p-4 rounded-xl bg-muted/30 border border-purple-500/30 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-purple-400">A. ARQS Magnétique (Le plus usuel)</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">Circuits R, L</span>
              </div>

              <p className="text-[11.5px] text-muted-foreground leading-relaxed mb-2">
                On néglige le <strong>courant de déplacement</strong> <LatexMath math="\vec{j}_D = \varepsilon_0 \frac{\partial \vec{E}}{\partial t}" /> devant le courant de conduction : <LatexMath math="\vec{j}_D \ll \vec{j}" />.
              </p>

              <div className="p-2.5 rounded-lg bg-background border border-border/80 font-mono text-xs text-center text-foreground mb-2">
                <LatexMath math="\vec{\text{rot}}\,\vec{B} \approx \mu_0 \vec{j} \quad ; \quad \text{div}\,\vec{j} \approx 0" />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground bg-purple-500/5 p-2 rounded-lg border border-purple-500/20">
              ✅ <strong>Conséquence majeure :</strong> Le courant se conserve le long d&apos;une branche. La <strong>loi des nœuds</strong> (<LatexMath math="\sum I_k = 0" />) est rigoureusement valable.
            </p>
          </div>

          {/* ARQS Électrique */}
          <div className="p-4 rounded-xl bg-muted/30 border border-sky-500/30 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-sky-400">B. ARQS Électrique (Circuits C)</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">Haute Impédance</span>
              </div>

              <p className="text-[11.5px] text-muted-foreground leading-relaxed mb-2">
                On néglige le terme d&apos;<strong>induction temporelle</strong> dans Maxwell-Faraday : <LatexMath math="\frac{\partial \vec{B}}{\partial t} \approx \vec{0}" />.
              </p>

              <div className="p-2.5 rounded-lg bg-background border border-border/80 font-mono text-xs text-center text-foreground mb-2">
                <LatexMath math="\vec{\text{rot}}\,\vec{E} \approx \vec{0} \quad \implies \quad \vec{E} \approx -\vec{\text{grad}}\,V" />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground bg-sky-500/5 p-2 rounded-lg border border-sky-500/20">
              ✅ <strong>Conséquence majeure :</strong> Le champ électrique dérive d&apos;un potentiel scalaire <LatexMath math="V" />. La <strong>loi des mailles</strong> (<LatexMath math="\sum U_k = 0" />) est rigoureusement vérifiée.
            </p>
          </div>
        </div>

        {/* ── VISUALISATEUR 3D INTERACTIF DUAL (MAGNÉTIQUE vs ÉLECTRIQUE) ── */}
        <div className="pt-2 space-y-2">
          <h3 className="text-xs font-bold text-foreground">
            Comparateur 3D Interactif : Visualisation des Deux Régimes ARQS
          </h3>
          <LazyMount height="340px" fallbackText="Chargement du comparateur ARQS 3D...">
            <ARQSTypesDual3DCanvas />
          </LazyMount>
        </div>

        {/* ── REMARQUE DE SYNTHÈSE GLOBALE ── */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 via-background to-sky-500/10 border border-border text-xs text-foreground flex items-start gap-2.5 shadow-xs">
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Remarque :</strong> Dans la majorité des circuits usuels (RLC), l&apos;ARQS globale applique simultanément ces deux conditions, autorisant à la fois la <strong>loi des nœuds</strong> et la <strong>loi des mailles</strong>.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 3: LE COURANT DE DÉPLACEMENT          */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-amber-500">
          <Zap className="w-4 h-4" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            3. Le Paradoxe du Condensateur & Le Courant de Déplacement
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Pourquoi Maxwell a-t-il dû modifier la loi d&apos;Ampère ? Imaginons un condensateur en train de se charger dans un circuit :
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-background border border-border/80 space-y-2">
              <h3 className="text-xs font-bold text-foreground">Le Problème :</h3>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Les électrons circulent dans le fil, mais s&apos;arrêtent sur l&apos;armature du condensateur. Entre les deux armatures, il n&apos;y a que du vide : la densité de courant de matière est nulle (<LatexMath math="\vec{j} = \vec{0}" />).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <h3 className="text-xs font-bold text-amber-400">La Solution Géniale de Maxwell :</h3>
              <p className="text-[11.5px] text-muted-foreground leading-relaxed">
                Entre les armatures, le champ électrique augmente à mesure que les charges s&apos;accumulent. Cette variation <LatexMath math="\partial \vec{E}/\partial t" /> crée un <strong>courant de déplacement</strong> virtuel qui assure la continuité parfaite du courant !
              </p>
            </div>

            <FormulaCard label="Densité de Courant de Déplacement" color="amber">
              <LatexMath math="\vec{j}_D = \varepsilon_0 \frac{\partial \vec{E}}{\partial t} \quad \implies \quad I_D = \iint_S \vec{j}_D \cdot d\vec{S} = I_{\text{conduction}}" />
            </FormulaCard>
          </div>

          <div className="flex flex-col">
            <LazyMount height="320px" fallbackText="Chargement du condensateur 3D...">
              <DisplacementCurrent3DCanvas />
            </LazyMount>
            <p className="text-[11px] text-muted-foreground text-center italic mt-1">
              Continuité entre courant de conduction dans les fils et courant de déplacement entre les plaques.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 4: EFFET DE PEAU (SKIN EFFECT)       */}
      {/* ═══════════════════════════════════════════ */}
      <section className="bg-card border border-border/80 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-amber-500">
          <Waves className="w-4 h-4" />
          <h2 className="text-sm sm:text-base font-bold text-foreground">
            4. L&apos;Effet de Peau (Skin Effect) à Haute Fréquence
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          En courant continu (<LatexMath math="f = 0" />), les charges se répartissent <strong>uniformément sur toute la section</strong> du conducteur. Mais dès que la fréquence augmente (<LatexMath math="f > 0" />), le courant est <strong>repoussé vers la surface extérieure</strong> (la « peau » du conducteur), laissant le cœur presque totalement inactif !
        </p>

        {/* ── EXPLICATION PHYSIQUE INTUITIVE ── */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-2 text-xs">
          <h3 className="font-bold text-foreground flex items-center gap-1.5 text-xs sm:text-sm text-amber-400">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Pourquoi le courant fuit-il le centre du conducteur ?
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Le courant alternatif crée un <strong>champ magnétique variable <LatexMath math="\vec{B}(t)" /></strong> à l&apos;intérieur même du fil. D&apos;après la loi de <em>Faraday-Lenz</em>, cette variation engendre des <strong>courants de Foucault internes</strong> qui s&apos;opposent au courant principal au centre et s&apos;y ajoutent en périphérie. Résultat : le courant est expulsé vers les bords !
          </p>
        </div>

        {/* ── FORMULE DE L'ÉPAISSEUR DE PEAU δ ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
          <div className="space-y-3">
            <FormulaCard label="Épaisseur de Peau δ" color="amber">
              <LatexMath math="\delta = \sqrt{\frac{2}{\mu_0 \gamma \omega}} = \sqrt{\frac{1}{\pi \mu_0 \gamma f}}" />
            </FormulaCard>

            <div className="p-3 rounded-xl bg-background border border-border/80 text-[11.5px] text-muted-foreground space-y-1.5">
              <p>• <strong className="text-foreground"><LatexMath math="\gamma" /> :</strong> Conductivité électrique du métal (<LatexMath math="\gamma \approx 5{,}8\cdot 10^7\text{ S/m}" /> pour le cuivre).</p>
              <p>• <strong className="text-foreground"><LatexMath math="\omega = 2\pi f" /> :</strong> Pulsation du signal en <LatexMath math="\text{rad/s}" />.</p>
              <p>• <strong className="text-foreground"><LatexMath math="\mu_0 = 4\pi \cdot 10^{-7}\text{ H/m}" /> :</strong> Perméabilité magnétique du vide.</p>
            </div>
          </div>

          {/* Ordres de grandeur concrets */}
          <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs">
            <h4 className="font-bold text-amber-400">Ordres de Grandeur dans le Cuivre :</h4>
            <div className="space-y-1.5 text-[11.5px] text-muted-foreground">
              <div className="flex justify-between border-b border-amber-500/10 pb-1">
                <span>Réseau <LatexMath math="50\text{ Hz}" /> :</span>
                <strong className="text-emerald-400 font-mono"><LatexMath math="\delta \approx 9{,}3\text{ mm}" /> (Total)</strong>
              </div>
              <div className="flex justify-between border-b border-amber-500/10 pb-1">
                <span>Audio <LatexMath math="10\text{ kHz}" /> :</span>
                <strong className="text-sky-400 font-mono"><LatexMath math="\delta \approx 660\,\mu\text{m}" /></strong>
              </div>
              <div className="flex justify-between border-b border-amber-500/10 pb-1">
                <span>Radio <LatexMath math="1\text{ MHz}" /> :</span>
                <strong className="text-amber-400 font-mono"><LatexMath math="\delta \approx 66\,\mu\text{m}" /></strong>
              </div>
              <div className="flex justify-between">
                <span>Wi-Fi <LatexMath math="2{,}4\text{ GHz}" /> :</span>
                <strong className="text-rose-400 font-mono"><LatexMath math="\delta \approx 1{,}3\,\mu\text{m}" /> (Pelliculaire)</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ── VISUALISATEUR 3D COUPE CONDUCTEUR & PROFIL j(r) ── */}
        <div className="pt-2 space-y-2">
          <h3 className="text-xs font-bold text-foreground">
            Simulateur 3D Interactif : Coupe du Conducteur et Profil de Densité <LatexMath math="j(r)" />
          </h3>
          <LazyMount height="340px" fallbackText="Chargement Effet de Peau 3D...">
            <SkinEffect3DCanvas />
          </LazyMount>
        </div>

        {/* ── CALCUL QUANTITATIF : SECTION EFFICACE ET RÉSISTANCE RAC vs RDC ── */}
        <div className="p-4 rounded-xl bg-muted/30 border border-amber-500/30 space-y-3">
          <h4 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            Calcul de la Résistance Effectif en Haute Fréquence (<LatexMath math="\delta \ll R" />)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Section Efficace */}
            <div className="p-3 rounded-lg bg-background border border-border/80 space-y-1 text-center">
              <span className="text-[10.5px] font-bold text-muted-foreground block">Section Efficace Utile</span>
              <div className="text-xs font-mono font-bold text-foreground py-1">
                <LatexMath math="S_{\text{eff}} \approx 2\pi R \cdot \delta" />
              </div>
              <p className="text-[10px] text-muted-foreground">Au lieu de <LatexMath math="S_{\text{tot}} = \pi R^2" /> en continu.</p>
            </div>

            {/* Résistance AC vs DC */}
            <div className="p-3 rounded-lg bg-background border border-border/80 space-y-1 text-center">
              <span className="text-[10.5px] font-bold text-muted-foreground block">Résistance Continue & Alternative</span>
              <div className="text-[11px] font-mono font-bold text-foreground py-0.5">
                <LatexMath math="R_{\text{DC}} = \frac{L}{\gamma \pi R^2} \quad ; \quad R_{\text{AC}} \approx \frac{L}{\gamma (2\pi R \delta)}" />
              </div>
              <p className="text-[10px] text-muted-foreground">Avec <LatexMath math="L" /> la longueur et <LatexMath math="\gamma" /> la conductivité.</p>
            </div>

            {/* Ratio Rac / Rdc */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-1 text-center">
              <span className="text-[10.5px] font-bold text-amber-400 block">Rapport des Résistances</span>
              <div className="text-xs font-mono font-bold text-amber-300 py-1">
                <LatexMath math="\frac{R_{\text{AC}}}{R_{\text{DC}}} \approx \frac{R}{2\delta} \propto \sqrt{f}" />
              </div>
              <p className="text-[10px] text-amber-200/80">La résistance augmente comme <LatexMath math="\sqrt{f}" /> !</p>
            </div>
          </div>
        </div>

        {/* ── 3 CONSÉQUENCES PRATIQUES ESSENTIELLES ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
            <h4 className="text-xs font-bold text-rose-400">1. Pertes Joule Multipliées</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Puisque <LatexMath math="R_{\text{AC}} \propto \sqrt{f}" />, les pertes thermiques par effet Joule <LatexMath math="P_J = R_{\text{AC}} I^2" /> s&apos;envolent à haute fréquence.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
            <h4 className="text-xs font-bold text-sky-400">2. Câbles Creux & Placage</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              À très haute fréquence, mettre du cuivre au cœur ne sert à rien. On utilise des <strong>tubes creux</strong> ou des fils en aluminium plaqués d&apos;une fine couche d&apos;argent.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-card border border-border/80 space-y-1">
            <h4 className="text-xs font-bold text-emerald-400">3. Fil de Litz (Induction)</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Pour contourner l&apos;effet de peau (ex: plaques à induction), on remplace le gros fil par un <strong>faisceau de multiples micro-brins isolés</strong> de rayon <LatexMath math="r < \delta" />.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTIE 5: GRAND EXERCICE INTERACTIF D'APPLICATION */}
      {/* ═══════════════════════════════════════════ */}
      <section className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 text-primary">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-foreground">
              Exercice d&apos;Application Guidé : Validité de l&apos;ARQS & Effet de Peau
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Problème type Concours (Mines / Centrale / CNC) avec simulateur 3D interactif et solutions détaillées étape par étape.
            </p>
          </div>
        </div>

        {/* ── ÉNONCÉ GLOBAL DU PROBLÈME ── */}
        <div className="p-4 rounded-xl bg-background border border-border/80 text-xs leading-relaxed text-muted-foreground space-y-2">
          <strong className="text-foreground text-xs block font-bold text-primary">📋 Énoncé du Problème :</strong>
          <p>
            On se propose d&apos;évaluer la validité de l&apos;Approximation des Régimes Quasi-Stationnaires (ARQS) et les pertes énergétiques associées dans trois domaines techniques majeurs : le transport d&apos;énergie ferroviaire, les architectures informatiques à très haute fréquence et le dimensionnement de câbles électriques en cuivre.
          </p>
          <div className="p-2.5 rounded-lg bg-muted/50 border border-border/60 font-mono text-[11px] text-foreground flex flex-wrap justify-between gap-2">
            <span>• <LatexMath math="c = 3\cdot 10^8\text{ m/s}" /></span>
            <span>• <LatexMath math="\mu_0 = 4\pi\cdot 10^{-7}\text{ H/m}" /></span>
            <span>• <LatexMath math="\gamma_{\text{cuivre}} = 5{,}8\cdot 10^7\text{ S/m}" /></span>
          </div>
        </div>

        {/* ── SIMULATEUR 3D DÉDIÉ À L'EXERCICE ── */}
        <div className="space-y-2 pt-1">
          <h3 className="text-xs font-bold text-foreground">
            Visualisation 3D Interactive des 3 Situations Physiques
          </h3>
          <LazyMount height="340px" fallbackText="Chargement du simulateur d'exercice 3D...">
            <ARQSExercise3DCanvas />
          </LazyMount>
        </div>

        {/* ── QUESTIONS ET CORRECTIONS DÉTAILLÉES ── */}
        <div className="space-y-3 pt-2">
          <ExerciseQuestion
            number={1}
            title="Question 1 : Ligne d'Alimentation TGV (f = 50 Hz, L = 40 km)"
            question={
              <p>
                Une rame de TGV circule sur une voie ferrée et est alimentée par une caténaire sous tension sinusoïdale de fréquence <LatexMath math="f = 50\text{ Hz}" />. La sous-station électrique d&apos;alimentation est située à une distance <LatexMath math="L = 40\text{ km}" /> du train.
                <br />
                <strong>Peut-on appliquer l&apos;ARQS à cette portion de ligne électrique ferroviaire ? Justifier rigoureusement par un calcul numérique.</strong>
              </p>
            }
            solution={
              <div className="space-y-2.5 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">1. Calcul de la longueur d&apos;onde électromagnétique associée :</strong>
                  <br />
                  La longueur d&apos;onde dans l&apos;air/vide vaut :
                  <br />
                  <LatexMath math="\lambda = \frac{c}{f} = \frac{3\cdot 10^8\text{ m/s}}{50\text{ s}^{-1}} = 6\cdot 10^6\text{ m} = 6\,000\text{ km}" />.
                </p>
                <p>
                  <strong className="text-foreground">2. Comparaison avec la dimension caractéristique L du circuit :</strong>
                  <br />
                  La dimension maximale du système est la longueur de la caténaire <LatexMath math="L = 40\text{ km}" />.
                  <br />
                  Calculons le ratio caractéristique :
                  <br />
                  <LatexMath math="\frac{L}{\lambda} = \frac{40\text{ km}}{6\,000\text{ km}} = \frac{1}{150} \approx 6{,}67\cdot 10^{-3} \ll 1" />.
                </p>
                <p>
                  <strong className="text-emerald-400 font-bold">3. Conclusion & Interprétation physique :</strong>
                  <br />
                  Puisque <LatexMath math="L \le \lambda / 100" />, la condition fondamentale de l&apos;ARQS est <strong>parfaitement satisfaite</strong>.
                  Le temps de propagation du signal électrique (<LatexMath math="\tau = L/c \approx 0{,}13\text{ ms}" />) est négligeable devant la période du signal (<LatexMath math="T = 1/f = 20\text{ ms}" />). Les lois usuelles de Kirchhoff (loi des mailles et loi des nœuds) sont rigoureusement valables sur toute la ligne !
                </p>
              </div>
            }
            tip="Règle d'or : Commencez toujours par exprimer la relation littérale lambda = c/f avant de réaliser l'application numérique et de comparer le ratio L/lambda à 1."
          />

          <ExerciseQuestion
            number={2}
            title="Question 2 : Bus d'Horloge sur Carte Mère de PC (f = 4 GHz, L = 20 cm)"
            question={
              <p>
                Sur la carte mère d&apos;un ordinateur haute performance de dimension <LatexMath math="L = 20\text{ cm}" />, un bus de données transmet un signal d&apos;horloge à la fréquence <LatexMath math="f = 4\text{ GHz} = 4\cdot 10^9\text{ Hz}" />.
                <br />
                <strong>L&apos;ARQS est-elle encore applicable aux pistes de cuivre de cette carte ? Quelles en sont les conséquences pour les ingénieurs électroniciens ?</strong>
              </p>
            }
            solution={
              <div className="space-y-2.5 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">1. Calcul de la longueur d&apos;onde du signal d&apos;horloge :</strong>
                  <br />
                  <LatexMath math="\lambda = \frac{c}{f} = \frac{3\cdot 10^8\text{ m/s}}{4\cdot 10^9\text{ Hz}} = 0{,}075\text{ m} = 7{,}5\text{ cm}" />.
                </p>
                <p>
                  <strong className="text-foreground">2. Comparaison entre la taille L de la carte et la longueur d&apos;onde λ :</strong>
                  <br />
                  Ici, <LatexMath math="L = 20\text{ cm}" /> et <LatexMath math="\lambda = 7{,}5\text{ cm}" />. On constate que :
                  <br />
                  <LatexMath math="L = 20\text{ cm} > \lambda = 7{,}5\text{ cm}" /> (plus précisément <LatexMath math="L \approx 2{,}67 \lambda" />).
                </p>
                <p>
                  <strong className="text-rose-400 font-bold">3. Conclusion & Conséquences pratiques :</strong>
                  <br />
                  L&apos;ARQS est <strong>totalement invalide</strong> ! Il y a plus de 2 ondes complètes qui oscillent le long d&apos;une même piste au même instant.
                  <br />
                  Le potentiel électrique n&apos;est pas uniforme : deux points d&apos;une même piste en cuivre ont des tensions complètement différentes à un instant <LatexMath math="t" /> donné.
                  <br />
                  <strong>Conséquence :</strong> Les pistes doivent impérativement être conçues comme des <em>lignes de transmission hyperfréquences</em> avec adaptation d&apos;impédance (50 Ω) pour éviter les réflexions d&apos;ondes et les parasites.
                </p>
              </div>
            }
            tip="Retenez bien : à l'échelle du GHz (processeurs, Wi-Fi 5 GHz, 5G), un simple fil de quelques centimètres se comporte comme une ligne de propagation d'onde, pas comme un fil équipotentiel !"
          />

          <ExerciseQuestion
            number={3}
            title="Question 3 : Dimensionnement & Effet de Peau dans un Câble en Cuivre (R = 2 mm)"
            question={
              <p>
                Un câble cylindrique en cuivre de rayon <LatexMath math="R = 2\text{ mm}" /> est utilisé successivement pour :
                <br />
                a) Le transport d&apos;électricité domestique à <LatexMath math="f_1 = 50\text{ Hz}" />.
                <br />
                b) Un émetteur radio haute fréquence à <LatexMath math="f_2 = 10\text{ MHz}" />.
                <br />
                <strong>1. Calculer l&apos;épaisseur de peau <LatexMath math="\delta" /> dans chaque cas.</strong>
                <br />
                <strong>2. Calculer la section efficace <LatexMath math="S_{\text{eff}}" /> et le rapport des résistances <LatexMath math="R_{\text{AC}} / R_{\text{DC}}" /> à 10 MHz. Conclure sur le choix du câble.</strong>
              </p>
            }
            solution={
              <div className="space-y-2.5 text-xs text-muted-foreground">
                <p>
                  <strong className="text-foreground">1. Formule de l&apos;épaisseur de peau :</strong>
                  <br />
                  <LatexMath math="\delta = \frac{1}{\sqrt{\pi \mu_0 \gamma f}}" />
                </p>
                <p>
                  <strong className="text-emerald-400">a) À basse fréquence (50 Hz) :</strong>
                  <br />
                  <LatexMath math="\delta_1 = \frac{1}{\sqrt{\pi \times (4\pi\cdot 10^{-7}) \times (5{,}8\cdot 10^7) \times 50}} \approx 9{,}34\cdot 10^{-3}\text{ m} = 9{,}34\text{ mm}" />.
                  <br />
                  Puisque <LatexMath math="\delta_1 = 9{,}34\text{ mm} > R = 2\text{ mm}" />, l&apos;effet de peau est négligeable : le courant occupe <strong>100% de la section du câble</strong> (<LatexMath math="S_{\text{eff}} = \pi R^2" />).
                </p>
                <p>
                  <strong className="text-rose-400">b) À haute fréquence (10 MHz) :</strong>
                  <br />
                  <LatexMath math="\delta_2 = \frac{1}{\sqrt{\pi \times (4\pi\cdot 10^{-7}) \times (5{,}8\cdot 10^7) \times 10^7}} \approx 2{,}09\cdot 10^{-5}\text{ m} = 20{,}9\,\mu\text{m}" />.
                  <br />
                  Puisque <LatexMath math="\delta_2 \approx 21\,\mu\text{m} \ll R = 2\text{ mm}" />, le courant est expulsé sur une infime couche périphérique !
                </p>
                <p>
                  <strong className="text-foreground">2. Section efficace et augmentation de résistance à 10 MHz :</strong>
                  <br />
                  <LatexMath math="S_{\text{eff}} \approx 2\pi R \cdot \delta_2 = 2\pi \times (2\cdot 10^{-3}) \times (20{,}9\cdot 10^{-6}) \approx 2{,}63\cdot 10^{-7}\text{ m}^2" />.
                  <br />
                  Rapport des résistances :
                  <br />
                  <LatexMath math="\frac{R_{\text{AC}}}{R_{\text{DC}}} \approx \frac{R}{2\delta_2} = \frac{2\text{ mm}}{2 \times 0{,}0209\text{ mm}} \approx 47{,}8" />.
                  <br />
                  <strong>Conclusion industrielle :</strong> À 10 MHz, la résistance du câble est multipliée par ~48 ! Le cœur en cuivre (98% de la matière) ne sert à rien. Il faut remplacer ce câble plein par un <strong>tube creux</strong> ou du <strong>fil de Litz</strong>.
                </p>
              </div>
            }
            tip="Dans vos copies de concours, mentionnez toujours que lorsque delta << R, la résistance AC est donnée par Rac = L / (gamma * 2*pi*R*delta), et que le rapport Rac/Rdc vaut R / (2*delta)."
          />
        </div>
      </section>

    </div>
  );
}
