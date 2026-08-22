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
  Calculator,
  Lightbulb,
  Sparkles
} from "lucide-react";

// Dynamic imports with SSR disabled for 3D canvases
const DrudeConduction3DCanvas = dynamic(() => import("../components/DrudeConduction3DCanvas"), { ssr: false });
const CurrentDensityConductor3DCanvas = dynamic(() => import("../components/CurrentDensityConductor3DCanvas"), { ssr: false });
const OhmLawMacroscopic3DCanvas = dynamic(() => import("../components/OhmLawMacroscopic3DCanvas"), { ssr: false });

/* ── Compact Collapsible Proof Component ── */
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
  color?: "blue" | "purple" | "amber" | "emerald";
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
  }[color];

  return (
    <div className={`my-3 rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm overflow-hidden transition-all duration-200`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
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

export default function Chap1DensiteConductivite() {
  const [showEx1Solution, setShowEx1Solution] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* ── PARTIE 1: LE MODÈLE MICROSCOPIQUE DE DRUDE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3">
          <Zap size={14} />
          <span>Partie 1 • Modèle Microscopique de Conduction</span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold mb-2 text-foreground tracking-tight">
          1. Comment naît le courant électrique ? (Modèle de Drude)
        </h2>

        {/* Analogie intuitive */}
        <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-muted-foreground flex items-start gap-3 mb-4">
          <Lightbulb size={18} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-blue-300 font-bold block mb-0.5">L&apos;analogie du flipper :</strong>
            Imaginez des billes dans un jeu de flipper horizontal qui rebondissent partout à <strong className="text-slate-200">100 km/s</strong> (agitation thermique). Si on incline le flipper (application d&apos;un champ <LatexMath math="\vec{E}" />), les billes continuent de rebondir dans tous les sens, mais glissent lentement vers le bas à seulement <strong className="text-slate-200">0.1 mm/s</strong> : c&apos;est la <strong>vitesse de dérive</strong> <LatexMath math="\vec{v}_d" />.
          </div>
        </div>

        {/* 3D Canvas Drude */}
        <div className="mb-4">
          <LazyMount fallbackText="Préparation du modèle de Drude...">
            <DrudeConduction3DCanvas />
          </LazyMount>
        </div>

        {/* Formule clé & Résumé */}
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

        {/* Démonstration Drude Dépliable */}
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
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-3">
          <Layers size={14} />
          <span>Partie 2 • Densité Volumique & Flux</span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold mb-2 text-foreground tracking-tight">
          2. Vecteur Densité de Courant <LatexMath math="\vec{j}" /> & Intensité <LatexMath math="I" />
        </h2>

        {/* Analogie du tuyau d'eau */}
        <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-muted-foreground flex items-start gap-3 mb-4">
          <Lightbulb size={18} className="text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300 font-bold block mb-0.5">L&apos;analogie du débit d&apos;eau :</strong>
            Le vecteur <LatexMath math="\vec{j}" /> représente la quantité et la vitesse d&apos;eau en chaque point du tuyau. L&apos;intensité <LatexMath math="I" /> est le <strong>débit global</strong> (le flux) en Litres/seconde (Ampères) qui traverse la section du tuyau.
          </div>
        </div>

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
        <div className="mb-4">
          <LazyMount fallbackText="Préparation du flux de j...">
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
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-3">
          <Calculator size={14} />
          <span>Partie 3 • Conductivité & Loi d&apos;Ohm</span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold mb-2 text-foreground tracking-tight">
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
            <div>• Conductivité : <LatexMath math="\gamma = n e \mu = \frac{n e^2 \tau}{m}" /> (<LatexMath math="\text{S/m}" />)</div>
            <div>• Résistivité : <LatexMath math="\rho = \frac{1}{\gamma}" /> (<LatexMath math="\Omega\cdot\text{m}" />)</div>
          </div>
        </div>

        {/* 3D Canvas Resistor */}
        <div className="mb-4">
          <LazyMount fallbackText="Préparation de la résistance 3D...">
            <OhmLawMacroscopic3DCanvas />
          </LazyMount>
        </div>

        {/* Démonstration R = rho * L / S */}
        <CollapsibleProof
          title="Démonstration : Passage de la loi locale j = γE à U = R·I (Fil cylindrique)"
          subtitle="Intégration du potentiel le long du conducteur et dérivation de R = ρ L / S"
          color="amber"
        >
          <p>Pour un fil cylindrique de longueur <LatexMath math="L" /> et de section <LatexMath math="S" /> :</p>
          <p>1. Tension <LatexMath math="U = V_A - V_B" /> :</p>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono my-1 text-slate-200">
            <LatexMath math="U = \int_A^B \vec{E} \cdot d\vec{\ell} = E \cdot L \implies E = \frac{U}{L}" />
          </div>
          <p>2. Intensité <LatexMath math="I" /> :</p>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono my-1 text-slate-200">
            <LatexMath math="I = j \cdot S = (\gamma E) \cdot S = \gamma \left(\frac{U}{L}\right) S = \frac{U}{\rho \frac{L}{S}}" />
          </div>
          <p>3. Loi d&apos;Ohm Macroscopique :</p>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-amber-500/40 text-center font-mono my-1 text-amber-300 font-bold">
            <LatexMath math="U = R \cdot I \quad \text{avec} \quad R = \rho \frac{L}{S} = \frac{L}{\gamma S}" />
          </div>
        </CollapsibleProof>

        {/* Démonstration Câble Coaxial */}
        <CollapsibleProof
          title="Démonstration Avancée : Résistance d'un câble coaxial cylindrique"
          subtitle="Intégration radiale en coordonnées cylindriques (Classique de concours)"
          color="purple"
        >
          <p>
            Pour un câble coaxial de rayons <LatexMath math="R_1 < R_2" /> et de longueur <LatexMath math="L" /> :
          </p>
          <p>1. Courant radial traversant un cylindre de rayon <LatexMath math="r" /> :</p>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono my-1 text-slate-200">
            <LatexMath math="I = j(r) \cdot (2\pi r L) \implies j(r) = \frac{I}{2\pi r L} \implies E(r) = \frac{I}{2\pi \gamma L r}" />
          </div>
          <p>2. Différence de potentiel <LatexMath math="U" /> :</p>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono my-1 text-slate-200">
            <LatexMath math="U = \int_{R_1}^{R_2} E(r)\,dr = \frac{I}{2\pi \gamma L} \int_{R_1}^{R_2} \frac{dr}{r} = \frac{I}{2\pi \gamma L} \ln\left(\frac{R_2}{R_1}\right)" />
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-purple-500/40 text-center font-mono my-1 text-purple-300 font-bold">
            <LatexMath math="R = \frac{U}{I} = \frac{\ln(R_2 / R_1)}{2\pi \gamma L} = \frac{\rho}{2\pi L} \ln\left(\frac{R_2}{R_1}\right)" />
          </div>
        </CollapsibleProof>
      </section>

      {/* ── PARTIE 4: EFFET JOULE & BILAN D'ÉNERGIE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold mb-3">
          <Flame size={14} />
          <span>Partie 4 • Effet Joule</span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold mb-2 text-foreground tracking-tight">
          4. Bilan Énergétique & Effet Joule
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-rose-300 font-bold block text-xs">Puissance Volumique Locale <LatexMath math="p_J" /></span>
            <p className="text-slate-400 text-[11px]">
              Énergie thermique cédée par unité de volume (<LatexMath math="\text{W/m}^3" />) :
            </p>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono text-rose-400 font-bold">
              <LatexMath math="p_J = \vec{j} \cdot \vec{E} = \gamma E^2 = \rho j^2" />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <span className="text-rose-300 font-bold block text-xs">Puissance Macroscopique Totale <LatexMath math="P_J" /></span>
            <p className="text-slate-400 text-[11px]">
              Intégration sur l&apos;ensemble du conducteur (<LatexMath math="\text{W}" />) :
            </p>
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center font-mono text-rose-400 font-bold">
              <LatexMath math="P_J = \iiint_{\mathcal{V}} (\vec{j} \cdot \vec{E})\,d\tau = R I^2 = U I" />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-rose-500 to-amber-500 rounded-l-2xl"></div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
             <Lightbulb className="w-4 h-4 text-rose-400" />
             Explication Physique : L&apos;Effet Joule
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-2">
            L&apos;effet Joule est la manifestation thermique de la résistance électrique. D&apos;un point de vue microscopique, le champ électrique <LatexMath math="\vec{E}" /> accélère les électrons libres. 
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400 text-xs">
            <li><strong>Chocs inélastiques :</strong> Les électrons percutent les ions fixes du réseau cristallin du métal.</li>
            <li><strong>Transfert d&apos;énergie :</strong> Lors de ces collisions, l&apos;énergie cinétique acquise par les électrons est cédée au réseau cristallin sous forme d&apos;agitation thermique.</li>
            <li><strong>Dégagement de chaleur :</strong> Le métal s&apos;échauffe. La puissance <LatexMath math="p_J" /> représente cette chaleur dissipée par chaque petit volume <LatexMath math="d\tau" /> du conducteur.</li>
          </ul>
        </div>
      </section>

      {/* ── PARTIE 5: EXERCICES D'APPLICATION CORRIGÉS ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm w-full max-w-full overflow-x-hidden space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <BookOpen size={14} />
          <span>Partie 5 • Exercices Pratiques</span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
          5. Exercices d&apos;Entraînement Corrigés
        </h2>

        {/* Exercice de Synthèse */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              Problème de Synthèse • Chapitre Complet
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Expert</span>
          </div>

          <h3 className="font-bold text-slate-100 text-sm sm:text-base">
            Modélisation Complète d&apos;un Faisceau Conducteur
          </h3>

          <div className="text-slate-400 leading-relaxed text-xs sm:text-sm space-y-2">
            <p>
              On considère un fil cylindrique de cuivre de rayon <LatexMath math="a = 1\,\text{mm}" />, de longueur <LatexMath math="L = 50\,\text{m}" />, et de conductivité <LatexMath math="\gamma = 6.0 \times 10^7\,\text{S}\cdot\text{m}^{-1}" />. Ce fil est soumis à une différence de potentiel constante <LatexMath math="U = 12\,\text{V}" />. La densité des porteurs de charge est <LatexMath math="n = 8.5 \times 10^{28}\,\text{m}^{-3}" />.
            </p>
            <p>Déterminer :</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Le champ électrique <LatexMath math="\vec{E}" /> supposé uniforme à l&apos;intérieur du fil.</li>
              <li>La densité de courant <LatexMath math="\vec{j}" /> puis l&apos;intensité totale <LatexMath math="I" />.</li>
              <li>La vitesse de dérive <LatexMath math="v_d" /> des électrons.</li>
              <li>La résistance <LatexMath math="R" /> du fil et la puissance totale dissipée par effet Joule <LatexMath math="P_J" />, par deux méthodes différentes (locale puis globale).</li>
            </ol>
          </div>

          <button
            onClick={() => setShowEx1Solution(!showEx1Solution)}
            className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold rounded-lg hover:bg-indigo-600/30 transition-all flex items-center gap-2 mt-2"
          >
            <CheckCircle2 size={16} /> {showEx1Solution ? "Masquer la Correction Détaillée" : "Voir la Correction Détaillée"}
          </button>

          {showEx1Solution && (
            <div className="p-4 bg-[#030008] border border-indigo-900/50 rounded-xl text-slate-300 space-y-4 text-xs sm:text-sm animate-in fade-in duration-300 shadow-inner">
              
              <div className="space-y-1.5 border-l-2 border-indigo-500/50 pl-3">
                <h4 className="text-indigo-400 font-bold">1. Champ Électrique <LatexMath math="\vec{E}" /></h4>
                <p>
                  Puisque <LatexMath math="U" /> est uniforme, <LatexMath math="E = \frac{U}{L} = \frac{12}{50} = 0.24\,\text{V/m}" />.
                </p>
              </div>

              <div className="space-y-1.5 border-l-2 border-emerald-500/50 pl-3">
                <h4 className="text-emerald-400 font-bold">2. Densité de courant <LatexMath math="\vec{j}" /> et Intensité <LatexMath math="I" /></h4>
                <p>
                  Par la loi d&apos;Ohm locale : <LatexMath math="j = \gamma E = (6.0 \times 10^7) \times 0.24 = 1.44 \times 10^7\,\text{A/m}^2" />.
                </p>
                <p>
                  L&apos;intensité <LatexMath math="I" /> est le flux de <LatexMath math="\vec{j}" /> à travers la section <LatexMath math="S = \pi a^2" /> :
                </p>
                <p className="font-mono text-emerald-300">
                  <LatexMath math="I = j \cdot (\pi a^2) = 1.44 \times 10^7 \times \pi \times (10^{-3})^2 \approx 45.2\,\text{A}" />.
                </p>
              </div>

              <div className="space-y-1.5 border-l-2 border-amber-500/50 pl-3">
                <h4 className="text-amber-400 font-bold">3. Vitesse de dérive <LatexMath math="v_d" /></h4>
                <p>
                  Sachant que <LatexMath math="\vec{j} = n e \vec{v_d}" /> :
                </p>
                <p className="font-mono text-amber-300">
                  <LatexMath math="v_d = \frac{j}{n e} = \frac{1.44 \times 10^7}{8.5 \times 10^{28} \times 1.6 \times 10^{-19}} \approx 1.06 \times 10^{-3}\,\text{m/s} = 1.06\,\text{mm/s}" />.
                </p>
              </div>

              <div className="space-y-1.5 border-l-2 border-rose-500/50 pl-3">
                <h4 className="text-rose-400 font-bold">4. Résistance <LatexMath math="R" /> et Puissance <LatexMath math="P_J" /></h4>
                <p>
                  Méthode Globale : <LatexMath math="R = \frac{U}{I} = \frac{12}{45.2} \approx 0.265\,\Omega" />.
                  <br/>Puissance : <LatexMath math="P_J = U \cdot I = 12 \times 45.2 = 542.4\,\text{W}" />.
                </p>
                <p className="mt-2 text-slate-400">
                  Méthode Locale (Vérification) : 
                  <br/>Puissance volumique : <LatexMath math="p_J = \gamma E^2 = (6.0 \times 10^7) \times (0.24)^2 = 3.456 \times 10^6\,\text{W/m}^3" />.
                  <br/>Volume <LatexMath math="\mathcal{V} = S \cdot L = \pi \times 10^{-6} \times 50 \approx 1.57 \times 10^{-4}\,\text{m}^3" />.
                  <br/><LatexMath math="P_J = \iiint p_J d\tau = p_J \cdot \mathcal{V} \approx 542.4\,\text{W}" />. (Les deux approches coïncident !)
                </p>
              </div>

            </div>
          )}
        </div>
      </section>

    </div>
  );
}
