"use client";

import React, { useState, useMemo } from "react";
import LatexMath from "@/components/ui/LatexMath";
import { 
  Zap, 
  Magnet, 
  Compass, 
  RefreshCw, 
  Activity, 
  Gauge, 
  Flame, 
  BookOpen, 
  Search,
  CheckCircle2,
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  Layers,
  ChevronRight,
  Info,
  Copy,
  Check,
  Eye,
  EyeOff,
  Star,
  Maximize2,
  Minimize2,
  HelpCircle,
  Hash,
  Lightbulb,
  GraduationCap,
  LayoutGrid,
  List
} from "lucide-react";

interface FormulaItem {
  id: string;
  chapter: number;
  chapterName: string;
  title: string;
  badge: string;
  badgeType: "loi" | "theoreme" | "resultat" | "definition" | "methode";
  math: string;
  explanation: string;
  conditions?: string;
  units?: string;
  color: "cyan" | "blue" | "purple" | "amber" | "rose" | "teal" | "emerald" | "indigo";
}

const ALL_FORMULAS: FormulaItem[] = [
  // ── CHAPITRE 1 : COURANTS & SYMÉTRIES ──
  {
    id: "j-volumique",
    chapter: 1,
    chapterName: "Courants & Symétries",
    title: "Densité Volumique de Courant",
    badge: "Définition",
    badgeType: "definition",
    math: "\\vec{j} = \\rho_m \\, \\vec{v} = n \\, q \\, \\vec{v}",
    explanation: "Flux local de charges. n: densité (m⁻³), q: charge (C), v: vitesse moyenne de dérive.",
    units: "[j] = A·m⁻²",
    color: "cyan"
  },
  {
    id: "intensite-flux",
    chapter: 1,
    chapterName: "Courants & Symétries",
    title: "Intensité Électrique (Flux de j)",
    badge: "Intégrale",
    badgeType: "definition",
    math: "I = \\iint_S \\vec{j} \\cdot d\\vec{S} = \\iint_S \\vec{j} \\cdot \\vec{n} \\, dS",
    explanation: "Débit de charge traversant une section orientée S par unité de temps.",
    units: "[I] = Ampère (A)",
    color: "cyan"
  },
  {
    id: "js-surfacique",
    chapter: 1,
    chapterName: "Courants & Symétries",
    title: "Densité Surfacique de Courant (Nappe)",
    badge: "Nappe",
    badgeType: "definition",
    math: "\\vec{j}_s = \\sigma_m \\, \\vec{v} \\quad ; \\quad I = \\int_C \\vec{j}_s \\cdot (\\vec{n} \\wedge d\\vec{l})",
    explanation: "Modélisation des nappes de courant minces ou effets de surface.",
    units: "[js] = A·m⁻¹",
    color: "cyan"
  },
  {
    id: "conservation-charge",
    chapter: 1,
    chapterName: "Courants & Symétries",
    title: "Conservation Locale de la Charge",
    badge: "Équation Fondamentale",
    badgeType: "loi",
    math: "\\text{div}\\,\\vec{j} + \\frac{\\partial \\rho}{\\partial t} = 0",
    explanation: "Équation de continuité traduisant l'indestructibilité de la charge électrique.",
    conditions: "En régime stationnaire ou ARQS : div(j) = 0 => ∮ j·dS = 0 (Loi des nœuds : Σ I = 0)",
    color: "cyan"
  },
  {
    id: "symetrie-plan-ps",
    chapter: 1,
    chapterName: "Courants & Symétries",
    title: "Plan de Symétrie des Courants (Πs)",
    badge: "Règle de Symétrie",
    badgeType: "methode",
    math: "\\forall M \\in \\Pi_s : \\quad \\vec{B}(M) \\perp \\Pi_s",
    explanation: "B étant un vecteur axial (pseudo-vecteur), il est orthogonal à tout plan de symétrie.",
    color: "cyan"
  },
  {
    id: "antisymetrie-plan-pa",
    chapter: 1,
    chapterName: "Courants & Symétries",
    title: "Plan d'Antisymétrie des Courants (Πa)",
    badge: "Règle d'Antisymétrie",
    badgeType: "methode",
    math: "\\forall M \\in \\Pi_a : \\quad \\vec{B}(M) \\parallel \\Pi_a \\quad (\\vec{B}(M) \\in \\Pi_a)",
    explanation: "Le champ B est nécessairement contenu dans tout plan d'antisymétrie des courants.",
    color: "cyan"
  },

  // ── CHAPITRE 2 : LOIS FONDAMENTALES & BIOT-SAVART ──
  {
    id: "biot-savart-fil",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Loi de Biot et Savart (Courant Filiforme)",
    badge: "Loi Fondamentale",
    badgeType: "loi",
    math: "d\\vec{B}(M) = \\frac{\\mu_0 I}{4\\pi} \\frac{d\\vec{l} \\wedge \\vec{u}_{PM}}{PM^2} = \\frac{\\mu_0 I}{4\\pi} \\frac{d\\vec{l} \\wedge \\vec{PM}}{PM^3}",
    explanation: "Champ élémentaire créé en M par l'élément Idl en P. μ₀ = 4π·10⁻⁷ H/m.",
    units: "[B] = Tesla (T)",
    color: "blue"
  },
  {
    id: "biot-savart-vol",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Biot-Savart (Volumique & Surfacique)",
    badge: "Forme Globale",
    badgeType: "loi",
    math: "\\vec{B}(M) = \\frac{\\mu_0}{4\\pi} \\iiint_V \\frac{\\vec{j}(P) \\wedge \\vec{u}_{PM}}{PM^2} \\, d\\tau_P",
    explanation: "Intégration sur tout le volume de distribution des courants volumiques.",
    color: "blue"
  },
  {
    id: "champ-fil-infini",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Fil Rectiligne Infini d'Axe (Oz)",
    badge: "Résultat Classique",
    badgeType: "resultat",
    math: "\\vec{B}(M) = \\frac{\\mu_0 I}{2\\pi r} \\, \\vec{e}_\\theta",
    explanation: "Lignes de champ circulaires concentriques. Décroissance en 1/r.",
    color: "blue"
  },
  {
    id: "champ-segment",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Segment de Fil Fini [A, B]",
    badge: "Résultat Classique",
    badgeType: "resultat",
    math: "B(M) = \\frac{\\mu_0 I}{4\\pi d} \\left( \\sin\\alpha_2 - \\sin\\alpha_1 \\right)",
    explanation: "d: distance orthogonale. α₁ et α₂ sont les angles orientés vers A et B.",
    color: "blue"
  },
  {
    id: "champ-spire-axe",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Spire Circulaire de Rayon R sur son Axe",
    badge: "Résultat Classique",
    badgeType: "resultat",
    math: "\\vec{B}(z) = \\frac{\\mu_0 I R^2}{2(R^2 + z^2)^{3/2}} \\, \\vec{e}_z = \\frac{\\mu_0 I}{2R} \\sin^3\\alpha \\, \\vec{e}_z",
    explanation: "Au centre (z = 0) : B(O) = (μ₀ I) / (2 R) · ez.",
    color: "blue"
  },
  {
    id: "helmholtz",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Bobines de Helmholtz (d = R)",
    badge: "Montage Classique",
    badgeType: "resultat",
    math: "B(O) = \\left(\\frac{4}{5}\\right)^{3/2} \\frac{\\mu_0 N I}{R} \\approx 0{,}7155 \\, \\frac{\\mu_0 N I}{R}",
    explanation: "Génère un champ magnétique hautement homogène au voisinage du centre.",
    color: "blue"
  },
  {
    id: "theoreme-ampere-int",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Théorème d'Ampère (Forme Intégrale)",
    badge: "Théorème Majeur",
    badgeType: "theoreme",
    math: "\\oint_{C} \\vec{B} \\cdot d\\vec{l} = \\mu_0 I_{\\text{enlacé}}",
    explanation: "I_enlacé: somme algébrique des courants traversant la surface délimitée par C.",
    color: "blue"
  },
  {
    id: "theoreme-ampere-loc",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Théorème d'Ampère (Forme Locale)",
    badge: "Équation Locale",
    badgeType: "theoreme",
    math: "\\vec{\\text{rot}}\\,\\vec{B} = \\mu_0 \\vec{j}",
    explanation: "Lien local entre le tourbillon de B et la densité de courant j.",
    color: "blue"
  },
  {
    id: "flux-conservatif",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Conservation du Flux Magnétique",
    badge: "Caractère Solénoïdal",
    badgeType: "theoreme",
    math: "\\text{div}\\,\\vec{B} = 0 \\iff \\oiint_S \\vec{B} \\cdot d\\vec{S} = 0",
    explanation: "Pas de charges magnétiques libres. Les lignes de champ sont fermées.",
    color: "blue"
  },
  {
    id: "solenoide-infini",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Solénoïde Infini (n = N/L spires/m)",
    badge: "Résultat Classique",
    badgeType: "resultat",
    math: "\\vec{B}_{\\text{int}} = \\mu_0 n I \\, \\vec{e}_z \\quad ; \\quad \\vec{B}_{\\text{ext}} = \\vec{0}",
    explanation: "Champ strictement axial et uniforme à l'intérieur, nul à l'extérieur.",
    color: "blue"
  },
  {
    id: "cylindre-courant",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Cylindre Conducteur Plein (Rayon R)",
    badge: "Résultat Classique",
    badgeType: "resultat",
    math: "B(r \\le R) = \\frac{\\mu_0 I r}{2\\pi R^2} \\quad ; \\quad B(r \\ge R) = \\frac{\\mu_0 I}{2\\pi r}",
    explanation: "Croissance linéaire à l'intérieur, décroissance en 1/r à l'extérieur.",
    color: "blue"
  },
  {
    id: "nappe-plane",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Nappe Plane Infinie (js = js ex en z=0)",
    badge: "Résultat Classique",
    badgeType: "resultat",
    math: "\\vec{B}(z > 0) = -\\frac{\\mu_0 j_s}{2} \\vec{e}_y \\quad ; \\quad \\vec{B}(z < 0) = +\\frac{\\mu_0 j_s}{2} \\vec{e}_y",
    explanation: "Champ uniforme de chaque côté avec discontinuité tangentielle de μ₀ js.",
    color: "blue"
  },
  {
    id: "relations-passage-b",
    chapter: 2,
    chapterName: "Lois Fondamentales",
    title: "Relations de Passage du Champ B (Interface 1 → 2)",
    badge: "Conditions Limites",
    badgeType: "theoreme",
    math: "B_{2n} - B_{1n} = 0 \\quad ; \\quad \\vec{B}_2 - \\vec{B}_1 = \\mu_0 \\vec{j}_s \\wedge \\vec{n}_{1\\to 2}",
    explanation: "Composante normale continue ; composante tangentielle discontinue si js ≠ 0.",
    color: "blue"
  },

  // ── CHAPITRE 3 : POTENTIEL VECTEUR & DIPÔLE & HALL ──
  {
    id: "potentiel-vecteur-def",
    chapter: 3,
    chapterName: "Potentiel Vecteur & Dipôle",
    title: "Potentiel Vecteur A & Jauge de Coulomb",
    badge: "Définition",
    badgeType: "definition",
    math: "\\vec{B} = \\vec{\\text{rot}}\\,\\vec{A} \\quad \\text{avec} \\quad \\text{div}\\,\\vec{A} = 0",
    explanation: "Garantit div(B) = 0. En magnétostatique, A est toujours continu dans l'espace.",
    units: "[A] = T·m (ou Wb/m)",
    color: "purple"
  },
  {
    id: "poisson-potentiel-a",
    chapter: 3,
    chapterName: "Potentiel Vecteur & Dipôle",
    title: "Équation de Poisson pour A",
    badge: "Équation Locale",
    badgeType: "theoreme",
    math: "\\Delta \\vec{A} + \\mu_0 \\vec{j} = \\vec{0} \\implies \\vec{A}(M) = \\frac{\\mu_0}{4\\pi} \\iiint \\frac{\\vec{j}(P)}{PM} d\\tau_P",
    explanation: "Analogue vectoriel de l'équation de Poisson de l'électrostatique (ΔV + ρ/ε₀ = 0).",
    color: "purple"
  },
  {
    id: "flux-potentiel-a",
    chapter: 3,
    chapterName: "Potentiel Vecteur & Dipôle",
    title: "Calcul du Flux via Circulation de A",
    badge: "Méthode Efficace",
    badgeType: "methode",
    math: "\\Phi = \\iint_S \\vec{B} \\cdot d\\vec{S} = \\oint_{\\partial S} \\vec{A} \\cdot d\\vec{l}",
    explanation: "Permet de calculer le flux par simple circulation sur le contour frontière.",
    color: "purple"
  },
  {
    id: "moment-magnetique",
    chapter: 3,
    chapterName: "Potentiel Vecteur & Dipôle",
    title: "Moment Dipolaire Magnétique",
    badge: "Grandeur Dipolaire",
    badgeType: "definition",
    math: "\\vec{m} = I \\, S \\, \\vec{n} = \\frac{1}{2} \\iiint_V (\\vec{r} \\wedge \\vec{j}) \\, d\\tau",
    explanation: "S: surface plane, n: normale orientée par la règle de la main droite.",
    units: "[m] = A·m² (ou J/T)",
    color: "purple"
  },
  {
    id: "potentiel-dipole",
    chapter: 3,
    chapterName: "Potentiel Vecteur & Dipôle",
    title: "Potentiel Vecteur du Dipôle (r >> d)",
    badge: "Dipôle",
    badgeType: "resultat",
    math: "\\vec{A}(M) = \\frac{\\mu_0}{4\\pi} \\frac{\\vec{m} \\wedge \\vec{u}_r}{r^2} = \\frac{\\mu_0}{4\\pi} \\frac{\\vec{m} \\wedge \\vec{r}}{r^3}",
    explanation: "Potentiel vecteur à grande distance d'un dipôle magnétique ponctuel.",
    color: "purple"
  },
  {
    id: "champ-b-dipole",
    chapter: 3,
    chapterName: "Potentiel Vecteur & Dipôle",
    title: "Champ B d'un Dipôle (Coordonnées Sphériques)",
    badge: "Résultat Classique",
    badgeType: "resultat",
    math: "\\vec{B}(M) = \\frac{\\mu_0 m}{4\\pi r^3} \\left( 2\\cos\\theta \\, \\vec{e}_r + \\sin\\theta \\, \\vec{e}_\\theta \\right)",
    explanation: "Forme intrinsèque : B = (μ₀ / 4πr³) [ 3(m·ur)ur - m ]. Décroissance en 1/r³.",
    color: "purple"
  },
  {
    id: "actions-dipole",
    chapter: 3,
    chapterName: "Potentiel Vecteur & Dipôle",
    title: "Actions Mécaniques & Énergie sur un Dipôle",
    badge: "Couple & Force",
    badgeType: "theoreme",
    math: "E_p = -\\vec{m} \\cdot \\vec{B} \\quad ; \\quad \\vec{\\Gamma} = \\vec{m} \\wedge \\vec{B} \\quad ; \\quad \\vec{F} = \\vec{\\text{grad}}(\\vec{m} \\cdot \\vec{B})",
    explanation: "Couple Gamma tend à aligner m avec B. Force F nulle si le champ extérieur est uniforme.",
    color: "purple"
  },
  {
    id: "effet-hall",
    chapter: 3,
    chapterName: "Potentiel Vecteur & Dipôle",
    title: "Effet Hall Classique (EH et Tension UH)",
    badge: "Transport",
    badgeType: "loi",
    math: "\\vec{E}_H = -\\frac{\\vec{j} \\wedge \\vec{B}}{n q} \\quad ; \\quad U_H = R_H \\frac{I B}{h} = \\frac{I B}{n q h}",
    explanation: "RH = 1/(nq) est la constante de Hall. h est l'épaisseur du barreau selon B.",
    color: "purple"
  },

  // ── CHAPITRE 4 : INDUCTION ÉLECTROMAGNÉTIQUE ──
  {
    id: "flux-mag-def",
    chapter: 4,
    chapterName: "Induction",
    title: "Flux Magnétique Φ",
    badge: "Grandeur Clé",
    badgeType: "definition",
    math: "\\Phi = \\iint_S \\vec{B} \\cdot d\\vec{S}",
    explanation: "Mesure le nombre total de lignes de champ traversant la surface orientée S.",
    units: "[Φ] = Weber (Wb = T·m²)",
    color: "amber"
  },
  {
    id: "loi-faraday",
    chapter: 4,
    chapterName: "Induction",
    title: "Loi de Faraday & Modération de Lenz",
    badge: "Loi Maîtresse",
    badgeType: "loi",
    math: "e = -\\frac{d\\Phi}{dt}",
    explanation: "Le signe (-) traduit la loi de Lenz : les effets induits s'opposent à leur cause.",
    units: "[e] = Volt (V)",
    color: "amber"
  },
  {
    id: "induction-lorentz",
    chapter: 4,
    chapterName: "Induction",
    title: "Induction de Lorentz (Circuit Mobile)",
    badge: "Champ Électromoteur",
    badgeType: "theoreme",
    math: "\\vec{E}_m = \\vec{v} \\wedge \\vec{B} \\quad \\implies \\quad e = \\oint_C (\\vec{v} \\wedge \\vec{B}) \\cdot d\\vec{l}",
    explanation: "Induction provoquée par le déplacement des conducteurs dans un champ B stationnaire.",
    color: "amber"
  },
  {
    id: "induction-neumann",
    chapter: 4,
    chapterName: "Induction",
    title: "Induction de Neumann (Champ B Variable)",
    badge: "Maxwell-Faraday",
    badgeType: "theoreme",
    math: "\\vec{\\text{rot}}\\,\\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t} \\quad \\implies \\quad e = -\\iint_S \\frac{\\partial \\vec{B}}{\\partial t} \\cdot d\\vec{S}",
    explanation: "La variation temporelle de B engendre un champ électrique tourbillonnaire induit.",
    color: "amber"
  },
  {
    id: "force-laplace",
    chapter: 4,
    chapterName: "Induction",
    title: "Force de Laplace & Puissance Électromécanique",
    badge: "Action Mécanique",
    badgeType: "theoreme",
    math: "d\\vec{F}_L = I \\, d\\vec{l} \\wedge \\vec{B} \\quad ; \\quad \\mathcal{P}_L = \\vec{F}_L \\cdot \\vec{v} = e_{\\text{Lorentz}} \\cdot I",
    explanation: "Conversion électromécanique : la puissance mécanique compense la puissance électrique.",
    color: "amber"
  },
  {
    id: "travail-maxwell",
    chapter: 4,
    chapterName: "Induction",
    title: "Théorème de Maxwell (Travail de Laplace)",
    badge: "Bilan Énergétique",
    badgeType: "theoreme",
    math: "\\delta W_L = I \\, d\\Phi_{\\text{coupé}}",
    explanation: "dΦ_coupé : flux magnétique coupé par les conducteurs lors du déplacement.",
    color: "amber"
  },
  {
    id: "inductance-propre",
    chapter: 4,
    chapterName: "Induction",
    title: "Inductance Propre (L) et Mutuelle (M)",
    badge: "Circuits",
    badgeType: "resultat",
    math: "\\Phi_p = L \\, I \\implies e = -L \\frac{dI}{dt} \\quad ; \\quad \\Phi_{1\\to 2} = M I_1 \\implies e_2 = -M \\frac{dI_1}{dt}",
    explanation: "Solénoïde : L = μ₀ N² S / ℓ = μ₀ n² V. Couplage magnétique : k = M / √(L₁ L₂) ≤ 1.",
    units: "[L], [M] = Henry (H)",
    color: "amber"
  },

  // ── CHAPITRE 5 : ÉQUATIONS DE MAXWELL ──
  {
    id: "maxwell-gauss",
    chapter: 5,
    chapterName: "Équations de Maxwell",
    title: "1. Maxwell-Gauss (MG)",
    badge: "Structure de E",
    badgeType: "loi",
    math: "\\text{div}\\,\\vec{E} = \\frac{\\rho}{\\varepsilon_0} \\quad \\Longleftrightarrow \\quad \\oiint_S \\vec{E} \\cdot d\\vec{S} = \\frac{Q_{\\text{int}}}{\\varepsilon_0}",
    explanation: "Le champ électrique diverge à partir des charges électriques scalaires.",
    color: "rose"
  },
  {
    id: "maxwell-thomson",
    chapter: 5,
    chapterName: "Équations de Maxwell",
    title: "2. Maxwell-Thomson (MT)",
    badge: "Flux conservatif",
    badgeType: "loi",
    math: "\\text{div}\\,\\vec{B} = 0 \\quad \\Longleftrightarrow \\quad \\oiint_S \\vec{B} \\cdot d\\vec{S} = 0",
    explanation: "Conservation du flux magnétique. Absence de monopôles magnétiques isolés.",
    color: "rose"
  },
  {
    id: "maxwell-faraday",
    chapter: 5,
    chapterName: "Équations de Maxwell",
    title: "3. Maxwell-Faraday (MF)",
    badge: "Induction locale",
    badgeType: "loi",
    math: "\\vec{\\text{rot}}\\,\\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t} \\quad \\Longleftrightarrow \\quad \\oint_C \\vec{E} \\cdot d\\vec{l} = -\\frac{d\\Phi(B)}{dt}",
    explanation: "Un champ magnétique variable dans le temps engendre un champ électrique induit.",
    color: "rose"
  },
  {
    id: "maxwell-ampere",
    chapter: 5,
    chapterName: "Équations de Maxwell",
    title: "4. Maxwell-Ampère (MA)",
    badge: "Courant Déplacement",
    badgeType: "loi",
    math: "\\vec{\\text{rot}}\\,\\vec{B} = \\mu_0 \\vec{j} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t} = \\mu_0 (\\vec{j} + \\vec{j}_D)",
    explanation: "jd = ε₀ ∂E/∂t est le courant de déplacement introduit par Maxwell.",
    color: "rose"
  },
  {
    id: "potentiels-em",
    chapter: 5,
    chapterName: "Équations de Maxwell",
    title: "Potentiels Électromagnétiques & Jauge de Lorentz",
    badge: "Potentiels (V, A)",
    badgeType: "definition",
    math: "\\vec{B} = \\vec{\\text{rot}}\\,\\vec{A} \\quad ; \\quad \\vec{E} = -\\vec{\\text{grad}}\\,V - \\frac{\\partial \\vec{A}}{\\partial t} \\quad ; \\quad \\text{div}\\,\\vec{A} + \\frac{1}{c^2}\\frac{\\partial V}{\\partial t} = 0",
    explanation: "c = 1 / √(ε₀ μ₀) est la célérité de la lumière dans le vide (~ 3·10⁸ m/s).",
    color: "rose"
  },
  {
    id: "onde-dalembert",
    chapter: 5,
    chapterName: "Équations de Maxwell",
    title: "Équations de Propagation d'Onde de d'Alembert",
    badge: "Ondes dans le vide",
    badgeType: "theoreme",
    math: "\\Delta \\vec{E} - \\frac{1}{c^2}\\frac{\\partial^2 \\vec{E}}{\\partial t^2} = \\vec{0} \\quad ; \\quad \\Delta \\vec{B} - \\frac{1}{c^2}\\frac{\\partial^2 \\vec{B}}{\\partial t^2} = \\vec{0}",
    explanation: "Propagation des ondes électromagnétiques dans le vide (sans charges ρ=0 ni courants j=0).",
    color: "rose"
  },
  {
    id: "relations-passage-gen",
    chapter: 5,
    chapterName: "Équations de Maxwell",
    title: "Relations de Passage Générales (Régime Variable)",
    badge: "Toutes Fréquences",
    badgeType: "theoreme",
    math: "\\vec{E}_2 - \\vec{E}_1 = \\frac{\\sigma}{\\varepsilon_0} \\vec{n}_{1\\to 2} \\quad ; \\quad \\vec{B}_2 - \\vec{B}_1 = \\mu_0 \\vec{j}_s \\wedge \\vec{n}_{1\\to 2}",
    explanation: "La composante tangentielle de E et la composante normale de B restent toujours continues.",
    color: "rose"
  },

  // ── CHAPITRE 6 : ARQS ──
  {
    id: "critere-arqs",
    chapter: 6,
    chapterName: "ARQS",
    title: "Condition Fondamentale de l'ARQS",
    badge: "Critère Clé",
    badgeType: "loi",
    math: "\\tau = \\frac{D}{c} \\ll T \\quad \\Longleftrightarrow \\quad D \\ll \\lambda = \\frac{c}{f}",
    explanation: "D: dimension du circuit, c: vitesse lumière, T: période, λ: longueur d'onde.",
    conditions: "À f = 50 Hz, λ = 6000 km (ARQS vérifié). À f = 1 GHz, λ = 30 cm (propagation à considérer).",
    color: "teal"
  },
  {
    id: "arqs-magnetique",
    chapter: 6,
    chapterName: "ARQS",
    title: "ARQS Magnétique (Basse Impédance)",
    badge: "Cas Usuel",
    badgeType: "resultat",
    math: "\\vec{j}_D \\ll \\vec{j} \\implies \\vec{\\text{rot}}\\,\\vec{B} \\approx \\mu_0 \\vec{j} \\quad ; \\quad \\text{div}\\,\\vec{j} \\approx 0",
    explanation: "Courant de déplacement négligé. La loi des nœuds est respectée instantanément.",
    color: "teal"
  },
  {
    id: "arqs-electrique",
    chapter: 6,
    chapterName: "ARQS",
    title: "ARQS Électrique (Haute Impédance)",
    badge: "Systèmes Capacitifs",
    badgeType: "resultat",
    math: "\\vec{\\text{rot}}\\,\\vec{E} \\approx \\vec{0} \\implies \\vec{E} \\approx -\\vec{\\text{grad}}\\,V",
    explanation: "Effet d'induction négligé. La loi des mailles (potentiel) est vérifiée.",
    color: "teal"
  },
  {
    id: "epaisseur-peau",
    chapter: 6,
    chapterName: "ARQS",
    title: "Effet de Peau dans un Conducteur (Épaisseur δ)",
    badge: "Conducteur",
    badgeType: "resultat",
    math: "\\delta = \\sqrt{\\frac{2}{\\mu_0 \\gamma \\omega}}",
    explanation: "γ: conductivité électrique (S/m), ω: pulsation. Les courants se confinent en surface.",
    units: "[δ] = mètre (m)",
    color: "teal"
  },

  // ── CHAPITRE 7 : ÉNERGIE ÉLECTROMAGNÉTIQUE ──
  {
    id: "densite-energie-em",
    chapter: 7,
    chapterName: "Énergie Électromagnétique",
    title: "Densité Volumique d'Énergie u_em",
    badge: "Énergie Stockée",
    badgeType: "definition",
    math: "u_{em} = u_e + u_m = \\frac{1}{2}\\varepsilon_0 E^2 + \\frac{1}{2\\mu_0} B^2",
    explanation: "Énergie stockée par mètre cube dans l'espace contenant les champs E et B.",
    units: "[u_em] = J·m⁻³",
    color: "emerald"
  },
  {
    id: "vecteur-poynting",
    chapter: 7,
    chapterName: "Énergie Électromagnétique",
    title: "Vecteur de Poynting Π",
    badge: "Flux d'Énergie",
    badgeType: "definition",
    math: "\\vec{\\Pi} = \\frac{\\vec{E} \\wedge \\vec{B}}{\\mu_0}",
    explanation: "Densité surfacique de flux de puissance transportée par le champ électromagnétique.",
    units: "[Π] = W·m⁻²",
    color: "emerald"
  },
  {
    id: "theoreme-poynting-local",
    chapter: 7,
    chapterName: "Énergie Électromagnétique",
    title: "Théorème de Poynting (Forme Locale)",
    badge: "Conservation",
    badgeType: "theoreme",
    math: "\\frac{\\partial u_{em}}{\\partial t} + \\text{div}\\,\\vec{\\Pi} = -\\vec{j} \\cdot \\vec{E}",
    explanation: "Bilan local d'énergie. -j·E représente la puissance cédée aux porteurs de charge.",
    color: "emerald"
  },
  {
    id: "theoreme-poynting-integral",
    chapter: 7,
    chapterName: "Énergie Électromagnétique",
    title: "Théorème de Poynting (Forme Intégrale)",
    badge: "Bilan Global",
    badgeType: "theoreme",
    math: "\\frac{d W_{em}}{dt} + \\oiint_S \\vec{\\Pi} \\cdot d\\vec{S} = -\\mathcal{P}_{\\text{Joule}} = -\\iiint_V (\\vec{j} \\cdot \\vec{E}) \\, d\\tau",
    explanation: "Variation de l'énergie interne + puissance rayonnée sortante = - puissance Joule dissipée.",
    color: "emerald"
  },
  {
    id: "puissance-joule",
    chapter: 7,
    chapterName: "Énergie Électromagnétique",
    title: "Puissance Joule Volumique & Globale",
    badge: "Dissipation",
    badgeType: "loi",
    math: "p_J = \\vec{j} \\cdot \\vec{E} = \\gamma E^2 = \\frac{j^2}{\\gamma} \\quad \\implies \\quad \\mathcal{P}_J = R I^2",
    explanation: "Dissipation thermique irréversible par effet Joule dans un conducteur ohmique.",
    units: "[pJ] = W/m³, [P_J] = Watt (W)",
    color: "emerald"
  },
  {
    id: "energie-bobine-condo",
    chapter: 7,
    chapterName: "Énergie Électromagnétique",
    title: "Énergies Magnétique & Électrostatique",
    badge: "Circuits",
    badgeType: "resultat",
    math: "W_m = \\frac{1}{2} L I^2 = \\iiint \\frac{B^2}{2\\mu_0} d\\tau \\quad ; \\quad W_e = \\frac{1}{2} C U^2 = \\iiint \\frac{\\varepsilon_0 E^2}{2} d\\tau",
    explanation: "Pour deux circuits couplés : Wm = 1/2 L₁ I₁² + 1/2 L₂ I₂² + M I₁ I₂.",
    units: "[W] = Joule (J)",
    color: "emerald"
  },

  // ── ANALYSE VECTORIELLE (OUTILS MATHÉMATIQUES INDISPENSABLES) ──
  {
    id: "analyse-vectorielle-1",
    chapter: 8,
    chapterName: "Outils Mathématiques",
    title: "Identités d'Analyse Vectorielle Clés",
    badge: "Formules Magiques",
    badgeType: "methode",
    math: "\\vec{\\text{rot}}(\\vec{\\text{grad}}\\,f) = \\vec{0} \\quad ; \\quad \\text{div}(\\vec{\\text{rot}}\\,\\vec{A}) = 0 \\quad ; \\quad \\vec{\\text{rot}}(\\vec{\\text{rot}}\\,\\vec{A}) = \\vec{\\text{grad}}(\\text{div}\\,\\vec{A}) - \\Delta \\vec{A}",
    explanation: "Indispensables pour établir les équations de propagation d'ondes et l'équation de Poisson.",
    color: "indigo"
  },
  {
    id: "theoremes-integraux",
    chapter: 8,
    chapterName: "Outils Mathématiques",
    title: "Théorèmes Fondamentaux d'Intégration",
    badge: "Green & Stokes",
    badgeType: "theoreme",
    math: "\\iiint_V \\text{div}\\,\\vec{A} \\, d\\tau = \\oiint_{\\partial V} \\vec{A} \\cdot d\\vec{S} \\quad ; \\quad \\iint_S \\vec{\\text{rot}}\\,\\vec{A} \\cdot d\\vec{S} = \\oint_{\\partial S} \\vec{A} \\cdot d\\vec{l}",
    explanation: "Permettent le passage instantané entre formes locales et formes intégrales.",
    color: "indigo"
  }
];

const CHAPTER_TABS = [
  { id: 0, label: "Toutes les Formules", icon: Sparkles },
  { id: 1, label: "01. Courants & Symétries", icon: Zap },
  { id: 2, label: "02. Lois & Biot-Savart", icon: Compass },
  { id: 3, label: "03. Dipôle & Hall", icon: Magnet },
  { id: 4, label: "04. Induction", icon: RefreshCw },
  { id: 5, label: "05. Maxwell", icon: Activity },
  { id: 6, label: "06. ARQS", icon: Gauge },
  { id: 7, label: "07. Énergie & Poynting", icon: Flame },
  { id: 8, label: "08. Analyse Vectorielle", icon: Layers },
];

export default function Chap8Formulaire() {
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [maskMode, setMaskMode] = useState<boolean>(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [starredIds, setStarredIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const toggleReveal = (id: string) => {
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleStar = (id: string) => {
    setStarredIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = (id: string, math: string) => {
    navigator.clipboard.writeText(math);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFormulas = useMemo(() => {
    return ALL_FORMULAS.filter((f) => {
      const matchChapter = selectedChapter === 0 || f.chapter === selectedChapter;
      const matchSearch = searchQuery.trim() === "" || 
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.explanation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.chapterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.badge?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.math.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchType = filterType === "all" || 
        (filterType === "starred" && starredIds.has(f.id)) ||
        (filterType === f.badgeType);

      return matchChapter && matchSearch && matchType;
    });
  }, [selectedChapter, searchQuery, filterType, starredIds]);

  // Soft, balanced, eye-pleasing theme styles
  const colorMap: Record<string, {
    border: string;
    badgeBg: string;
    badgeText: string;
    dot: string;
  }> = {
    cyan: {
      border: "border-cyan-500/20 hover:border-cyan-500/50",
      badgeBg: "bg-cyan-500/10 border-cyan-500/20",
      badgeText: "text-cyan-400",
      dot: "bg-cyan-400"
    },
    blue: {
      border: "border-blue-500/20 hover:border-blue-500/50",
      badgeBg: "bg-blue-500/10 border-blue-500/20",
      badgeText: "text-blue-400",
      dot: "bg-blue-400"
    },
    purple: {
      border: "border-purple-500/20 hover:border-purple-500/50",
      badgeBg: "bg-purple-500/10 border-purple-500/20",
      badgeText: "text-purple-400",
      dot: "bg-purple-400"
    },
    amber: {
      border: "border-amber-500/20 hover:border-amber-500/50",
      badgeBg: "bg-amber-500/10 border-amber-500/20",
      badgeText: "text-amber-400",
      dot: "bg-amber-400"
    },
    rose: {
      border: "border-rose-500/20 hover:border-rose-500/50",
      badgeBg: "bg-rose-500/10 border-rose-500/20",
      badgeText: "text-rose-400",
      dot: "bg-rose-400"
    },
    teal: {
      border: "border-teal-500/20 hover:border-teal-500/50",
      badgeBg: "bg-teal-500/10 border-teal-500/20",
      badgeText: "text-teal-400",
      dot: "bg-teal-400"
    },
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/50",
      badgeBg: "bg-emerald-500/10 border-emerald-500/20",
      badgeText: "text-emerald-400",
      dot: "bg-emerald-400"
    },
    indigo: {
      border: "border-indigo-500/20 hover:border-indigo-500/50",
      badgeBg: "bg-indigo-500/10 border-indigo-500/20",
      badgeText: "text-indigo-400",
      dot: "bg-indigo-400"
    },
  };

  return (
    <div className="space-y-4 w-full max-w-full overflow-x-hidden pb-12">
      
      {/* ── EN-TÊTE ÉPURÉ & MODERNE ── */}
      <div className="rounded-2xl p-4 sm:p-5 border border-border/80 bg-card/60 backdrop-blur-md relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Aide-Mémoire Officiel • Prépa & Université</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Formulaire & Lois de l&apos;Électromagnétisme
            </h1>
            
            <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
              Toutes les équations et théorèmes indispensables, formatés sur une seule ligne avec leurs unités et conditions.
            </p>
          </div>

          {/* Outils & Commandes en Header */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 w-full md:w-auto">
            {/* Mode Révision */}
            <button
              onClick={() => {
                setMaskMode(!maskMode);
                if (!maskMode) setRevealedIds(new Set());
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shadow-xs ${
                maskMode
                  ? "bg-amber-500/15 border-amber-500/40 text-amber-500 dark:text-amber-300"
                  : "bg-muted hover:bg-muted/80 border-border text-foreground"
              }`}
              title="Masquer les formules pour tester sa mémoire"
            >
              {maskMode ? <Eye className="w-3.5 h-3.5 text-amber-500" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
              <span>{maskMode ? "Mode Révision (Actif)" : "Tester ma Mémoire"}</span>
            </button>

            {/* Barre de recherche */}
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Chercher (Biot, Poynting, Maxwell...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border focus:border-primary rounded-xl pl-8 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── ONGLETS HORIZONTAUX PAR CHAPITRE (SCROLL DOUX SANS SCROLLBAR BRUTE) ── */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {CHAPTER_TABS.map((tab) => {
          const isActive = selectedChapter === tab.id;
          const Icon = tab.icon;
          const count = tab.id === 0 ? ALL_FORMULAS.length : ALL_FORMULAS.filter(f => f.chapter === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedChapter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-card/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── FILTRES RAPIDES PAR TYPE DE FORMULE ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-[11px] font-medium mr-1">Type :</span>
          {[
            { key: "all", label: "Tous" },
            { key: "loi", label: "Lois" },
            { key: "theoreme", label: "Théorèmes" },
            { key: "resultat", label: "Résultats d'Exercices" },
            { key: "starred", label: "Favoris ★" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilterType(f.key)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                filterType === f.key
                  ? "bg-muted text-foreground font-bold border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          <strong className="text-foreground">{filteredFormulas.length}</strong> formule(s)
        </div>
      </div>

      {/* ── GRILLE DES FORMULES À 2 COLONNES LARGES (ÉVITE TOUTE COUPURE HORIZONTALE) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredFormulas.map((item) => {
          const st = colorMap[item.color] || colorMap.blue;
          const isMasked = maskMode && !revealedIds.has(item.id);
          const isStarred = starredIds.has(item.id);
          const isCopied = copiedId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border ${st.border} bg-card/80 p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-sm relative overflow-hidden`}
            >
              {/* Header Carte : Chapitre + Titre + Badges + Actions */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    <span>Chap. 0{item.chapter} • {item.chapterName}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${st.badgeBg} ${st.badgeText}`}>
                      {item.badge}
                    </span>

                    {/* Favori */}
                    <button
                      onClick={() => toggleStar(item.id)}
                      className={`p-1 rounded transition-colors ${
                        isStarred ? "text-yellow-400 bg-yellow-400/10" : "text-muted-foreground hover:text-yellow-400"
                      }`}
                      title={isStarred ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-yellow-400" : ""}`} />
                    </button>

                    {/* Copier */}
                    <button
                      onClick={() => handleCopy(item.id, item.math)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                      title="Copier le code LaTeX"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <h3 className="text-xs sm:text-[13px] font-bold text-foreground mb-2">
                  {item.title}
                </h3>
              </div>

              {/* ── ZONE FORMULE : 1 SEULE LIGNE CLAIRE, COMPACTE & SANS BARRE DE DÉFILEMENT VERTICALE ── */}
              <div 
                onClick={() => maskMode && toggleReveal(item.id)}
                className={`my-1.5 px-3 py-2.5 rounded-lg bg-background/90 border border-border/80 flex items-center justify-center relative overflow-x-auto overflow-y-hidden scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                  maskMode ? "cursor-pointer hover:border-amber-500/50" : ""
                }`}
              >
                {isMasked ? (
                  <div className="flex items-center justify-center gap-1.5 text-amber-500 dark:text-amber-400 py-1 font-bold text-xs">
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Cliquer pour révéler la formule</span>
                  </div>
                ) : (
                  <div className="text-xs sm:text-[13px] font-medium text-foreground whitespace-nowrap py-0.5 text-center w-full">
                    <LatexMath math={item.math} />
                  </div>
                )}

                {/* Copied notification */}
                {isCopied && (
                  <div className="absolute top-1 right-2 px-1.5 py-0.5 bg-emerald-500 text-slate-950 font-bold text-[9px] rounded shadow-xs">
                    Copié !
                  </div>
                )}
              </div>

              {/* ── EXPLICATION + UNITÉS + CONDITIONS (PETITE POLICE CONFORTABLE) ── */}
              <div className="mt-1 space-y-1">
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {item.explanation}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {item.units && (
                    <span className="text-[10px] font-mono font-medium text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/60">
                      {item.units}
                    </span>
                  )}
                  {item.conditions && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      {item.conditions}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SI AUCUN RÉSULTAT ── */}
      {filteredFormulas.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border rounded-2xl bg-card/40">
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-bold text-foreground">Aucune formule trouvée</p>
          <p className="text-xs text-muted-foreground mt-0.5">Essayez un autre mot-clé ou réinitialisez les filtres.</p>
        </div>
      )}

      {/* ── MÉTHODOLOGIE PRÉCIEUSE POUR LES EXERCICES ── */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs mt-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 rounded-md bg-primary/10 text-primary">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-foreground">
            Rappel Méthodologique pour les Examens
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs text-muted-foreground">
          <div className="p-2.5 rounded-xl bg-background/50 border border-border/60">
            <strong className="text-foreground text-[11px] block mb-0.5">1. Symétries & Invariances</strong>
            <span className="text-[10.5px] leading-tight block">
              B ⊥ Πs (symétrie) et B ∥ Πa (antisymétrie). Déterminez les variables d&apos;espace inutiles avant tout calcul.
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-background/50 border border-border/60">
            <strong className="text-foreground text-[11px] block mb-0.5">2. Ampère vs Biot-Savart</strong>
            <span className="text-[10.5px] leading-tight block">
              Théorème d&apos;Ampère pour les géométries infinies (cylindre, câble, solénoïde). Biot-Savart pour spires et segments finis.
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-background/50 border border-border/60">
            <strong className="text-foreground text-[11px] block mb-0.5">3. Induction & Signe e</strong>
            <span className="text-[10.5px] leading-tight block">
              Orientez la normale dS avec la règle de la main droite, calculez Φ(t), puis e = -dΦ/dt.
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-background/50 border border-border/60">
            <strong className="text-foreground text-[11px] block mb-0.5">4. Bilan d&apos;Énergie</strong>
            <span className="text-[10.5px] leading-tight block">
              Utilisez le vecteur de Poynting Π = (E ∧ B)/μ₀ pour calculer le flux d&apos;énergie entrant ou sortant.
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
