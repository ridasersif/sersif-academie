"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import LazyMount from "@/components/ui/LazyMount";
import LatexMath from "@/components/ui/LatexMath";
import {
  Zap,
  Layers,
  Activity,
  BookOpen,
  CheckCircle2,
  Droplet,
  Battery,
  Shield,
  Lightbulb
} from "lucide-react";

// Dynamic import for the 3D Canvas
const DipoleCharacteristics3DCanvas = dynamic(() => import("../components/DipoleCharacteristics3DCanvas"), { ssr: false });

export default function Chap2LoiOhmDipoles() {
  const [showSynthesisSolution, setShowSynthesisSolution] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden pb-12">
      {/* ── HEADER ── */}
      <header className="space-y-2 sm:space-y-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
          <Zap size={14} />
          <span>Chapitre 2</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Loi d&apos;Ohm & Dipôles Électriques
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-3xl">
          Découvrez ce qu'est un dipôle électrique, comment le courant et la tension interagissent à travers la loi d'Ohm, et comment lire la "carte d'identité" (courbe caractéristique) de n'importe quel composant.
        </p>
      </header>

      {/* ── PARTIE 0: ANALOGIE HYDRAULIQUE (POUR COMPRENDRE FACILEMENT) ── */}
      <section className="bg-card/90 border border-blue-500/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-extrabold mb-3">
          <Droplet className="w-3.5 h-3.5" />
          <span>Pour bien commencer • L'Analogie de l'Eau</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          0. Comprendre la Tension (<LatexMath math="U" />) et le Courant (<LatexMath math="I" />)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/5 border border-blue-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
            <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">Le Courant (<LatexMath math="I" />) = Le Débit d'eau</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Le courant électrique, mesuré en <strong>Ampères (A)</strong>, correspond à la quantité d'électrons qui circulent dans le fil chaque seconde. C'est exactement comme le <strong>débit de l'eau</strong> dans un tuyau (le nombre de litres par seconde).
            </p>
          </div>
          <div className="bg-orange-500/5 border border-orange-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
            <h3 className="font-bold text-orange-600 dark:text-orange-400 mb-2">La Tension (<LatexMath math="U" />) = La Pression d'eau</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La tension, mesurée en <strong>Volts (V)</strong>, est la force qui pousse les électrons à avancer. C'est comme la <strong>pression de l'eau</strong> générée par une pompe. Sans pression (Tension = 0), l'eau ne coule pas (Courant = 0).
            </p>
          </div>
        </div>
      </section>

      {/* ── PARTIE 1: DÉFINITION ET CONVENTIONS ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Partie 1 • Le Langage des Circuits</span>
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-foreground leading-tight">
          1. Les Dipôles et Leurs Conventions
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Un <strong>dipôle</strong> (di = deux, pôle = borne) est simplement un composant électrique qui possède deux fils de connexion (ex: une lampe, une pile, un moteur). Pour étudier un dipôle, on doit définir le sens de la tension et du courant : c'est ce qu'on appelle les <strong>conventions</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-rose-500/5 border border-rose-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
            <h3 className="font-bold text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Convention Récepteur
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              On l'utilise pour les composants qui <strong>consomment</strong> de l'énergie (ex: Lampe, Résistance). Dans cette convention, on dessine la flèche de la tension <LatexMath math="U" /> <strong>dans le sens opposé</strong> de la flèche du courant <LatexMath math="I" />.
            </p>
            <div className="bg-background/80 p-3 rounded-lg flex justify-center border border-border/50 text-sm">
              <span className="italic text-muted-foreground">Puissance reçue :</span> &nbsp; <LatexMath math="P = U \cdot I > 0" />
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm">
            <h3 className="font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
              <Battery className="w-4 h-4" /> Convention Générateur
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              On l'utilise pour les composants qui <strong>fournissent</strong> de l'énergie (ex: Pile). Dans cette convention, on dessine la flèche de la tension <LatexMath math="U" /> <strong>dans le même sens</strong> que la flèche du courant <LatexMath math="I" />.
            </p>
            <div className="bg-background/80 p-3 rounded-lg flex justify-center border border-border/50 text-sm">
              <span className="italic text-muted-foreground">Puissance fournie :</span> &nbsp; <LatexMath math="P = U \cdot I > 0" />
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTIE 2: CLASSIFICATION DES DIPÔLES ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-extrabold mb-3">
          <Activity className="w-3.5 h-3.5" />
          <span>Partie 2 • La Carte d'Identité du Composant</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          2. Caractéristiques <LatexMath math="I-V" /> et Classification
        </h2>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
          Chaque composant réagit différemment quand on lui applique une pression (Tension <LatexMath math="U" />). La courbe qui dessine l'évolution du débit (Courant <LatexMath math="I" />) en fonction de la pression (<LatexMath math="U" />) s'appelle la <strong>caractéristique statique</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-muted/40 p-5 rounded-2xl border border-border/70 shadow-sm">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" /> Passif vs Actif
            </h4>
            <ul className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <li><strong>Dipôle Passif :</strong> Sans tension, il n'y a pas de courant (<LatexMath math="U=0 \implies I=0" />). La courbe <strong>passe par l'origine</strong> (le centre du graphe). <em>Exemple : Résistance.</em></li>
              <li><strong>Dipôle Actif :</strong> Il possède sa propre énergie. La courbe <strong>ne passe pas</strong> par l'origine. <em>Exemple : Batterie.</em></li>
            </ul>
          </div>
          <div className="bg-muted/40 p-5 rounded-2xl border border-border/70 shadow-sm">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Linéaire vs Non-Linéaire
            </h4>
            <ul className="text-sm text-muted-foreground space-y-3 leading-relaxed">
              <li><strong>Linéaire :</strong> Le courant augmente proportionnellement à la tension. La courbe est une <strong>ligne droite</strong> parfaite. <em>Exemple : Résistance (Loi d'Ohm).</em></li>
              <li><strong>Non-Linéaire :</strong> La relation est complexe. La courbe <strong>n'est pas droite</strong> (ex: exponentielle). <em>Exemple : Diode (elle s'ouvre comme une porte à une certaine pression).</em></li>
            </ul>
          </div>
        </div>

        {/* 3D VISUALIZATION: Dipole Characteristics */}
        <div className="bg-background/50 rounded-2xl border border-border overflow-hidden">
          <div className="p-4 bg-muted/30 border-b border-border/50">
            <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-violet-500" />
              Laboratoire Interactif : Testez Différents Dipôles
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Modifiez la tension et observez comment le courant (les particules bleues) réagit selon le composant choisi. Regardez comment le point rouge se déplace sur la courbe caractéristique !
            </p>
          </div>
          <div className="p-2 sm:p-4">
            <LazyMount>
              <DipoleCharacteristics3DCanvas />
            </LazyMount>
          </div>
        </div>

      </section>

      {/* ── PARTIE 3: PROBLÈME DE SYNTHÈSE ── */}
      <section className="bg-card/90 border border-border/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm w-full max-w-full overflow-x-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Partie 3 • Application Pratique</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black mb-4 text-foreground leading-tight">
          3. Exercice : Identification des Dipôles
        </h2>

        <div className="bg-muted/30 border border-border/60 rounded-2xl p-5 sm:p-6 space-y-5">
          <h3 className="font-bold text-foreground">
            Serez-vous capable de reconnaître ces composants ?
          </h3>

          <div className="text-muted-foreground leading-relaxed text-sm space-y-3">
            <p>
              En laboratoire, vous avez testé trois composants (D1, D2, D3) en relevant le courant <LatexMath math="I" /> pour différentes tensions <LatexMath math="U" />. Voici les équations mathématiques de leurs courbes :
            </p>
            <ul className="list-disc pl-5 space-y-2 bg-background/50 p-4 rounded-xl border border-border/50">
              <li><strong>Composant D1 :</strong> La courbe est une droite d'équation <LatexMath math="U = 100 \times I" /> (convention récepteur).</li>
              <li><strong>Composant D2 :</strong> La courbe est une droite d'équation <LatexMath math="U = 5 - 2 \times I" /> (convention générateur).</li>
              <li><strong>Composant D3 :</strong> Le courant est nul (<LatexMath math="I \approx 0" />) si <LatexMath math="U < 0.6\,\text{V}" />, puis il explose de façon exponentielle si <LatexMath math="U \ge 0.6\,\text{V}" />.</li>
            </ul>
            <p className="font-semibold text-foreground pt-2">
              Votre mission : Identifiez et classez chaque composant (Actif/Passif, Linéaire/Non-Linéaire).
            </p>
          </div>

          <button
            onClick={() => setShowSynthesisSolution(!showSynthesisSolution)}
            className="px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-sm font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={18} /> {showSynthesisSolution ? "Masquer la Solution" : "Voir la Solution Détaillée"}
          </button>

          {showSynthesisSolution && (
            <div className="p-5 bg-background/80 border border-border/80 rounded-xl text-muted-foreground space-y-5 text-sm animate-in fade-in duration-300 shadow-inner">
              
              <div className="space-y-2 border-l-4 border-indigo-500 pl-4">
                <h4 className="text-indigo-600 dark:text-indigo-400 font-bold text-base">Composant D1 : Une Résistance Linéaire</h4>
                <p>
                  <strong>Classification :</strong> Passif (<LatexMath math="U=0 \implies I=0" />) et Linéaire (c'est une droite).
                </p>
                <p>
                  C'est le composant le plus basique. Il suit la <strong>loi d'Ohm</strong> classique <LatexMath math="U = R \cdot I" />. Sa résistance est simplement <LatexMath math="R = 100\,\Omega" />.
                </p>
              </div>

              <div className="space-y-2 border-l-4 border-rose-500 pl-4">
                <h4 className="text-rose-600 dark:text-rose-400 font-bold text-base">Composant D2 : Une Pile (Générateur Réel)</h4>
                <p>
                  <strong>Classification :</strong> Actif (si on coupe le courant <LatexMath math="I=0" />, il reste une tension de <LatexMath math="5\,\text{V}" />) et Linéaire (c'est une droite).
                </p>
                <p>
                  C'est un générateur de tension (Modèle de Thévenin). Sa tension à vide (quand on ne l'utilise pas) est <LatexMath math="E = 5\,\text{V}" /> et sa résistance interne (qui fait chauffer la pile quand on l'utilise) est <LatexMath math="r = 2\,\Omega" />.
                </p>
              </div>

              <div className="space-y-2 border-l-4 border-emerald-500 pl-4">
                <h4 className="text-emerald-600 dark:text-emerald-400 font-bold text-base">Composant D3 : Une Diode</h4>
                <p>
                  <strong>Classification :</strong> Passif (<LatexMath math="U=0 \implies I=0" />) et Non-Linéaire (la courbe n'est pas droite).
                </p>
                <p>
                  C'est une <strong>diode classique</strong>. Elle agit comme une valve : l'eau (le courant) ne passe pas tant que la pression (la tension) n'est pas suffisante (tension de seuil <LatexMath math="V_s \approx 0.6\,\text{V}" />).
                </p>
              </div>

            </div>
          )}
        </div>
      </section>

    </div>
  );
}
