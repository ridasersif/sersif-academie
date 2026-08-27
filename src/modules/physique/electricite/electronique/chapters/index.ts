import Chap1FondementsElectrocinetique from "./chap1-fondements-electrocinetique";
import Chap2GenerateursLoisKirchhoff from "./chap2-generateurs-lois-kirchhoff";
import ChapRegimesTransitoiresRCRlRlc from "./chap-regimes-transitoires-rc-rl-rlc";
import Chap3RegimeSinusoidalImpedances from "./chap3-regime-sinusoidal-impedances";
import Chap4CircuitRLCResonances from "./chap4-circuit-rlc-resonances";
import Chap1DensiteConductivite from "./chap1-densite-conductivite";
import Chap2LoiOhmDipoles from "./chap2-loi-ohm-dipoles";
import Chap3PuissanceElectrocinetique from "./chap3-puissance-electrocinetique";

export const ELECTRONIQUE_DE_BASE_CHAPTERS = [
  {
    id: "fondements-electrocinetique-dipoles",
    num: "01",
    title: "Fondements de l'Électrocinétique, Dipôles & Puissance",
    subtitle: "Densité de courant, loi d'Ohm, effet Joule et modèles réactifs R, L, C",
    component: Chap1FondementsElectrocinetique,
  },
  {
    id: "generateurs-kirchhoff-theoremes",
    num: "02",
    title: "Générateurs Réels, Lois de Kirchhoff & Théorèmes des Réseaux",
    subtitle: "Thévenin, Norton, transfert maximal de puissance, ARQS et Kirchhoff",
    component: Chap2GenerateursLoisKirchhoff,
  },
  {
    id: "regimes-transitoires-rc-rl-rlc",
    num: "03",
    title: "Régimes Transitoires des Circuits Linéaires (RC, RL, RLC)",
    subtitle: "Équations différentielles, constante de temps, régime apériodique/critique/pseudo-périodique",
    component: ChapRegimesTransitoiresRCRlRlc,
  },
  {
    id: "regime-sinusoidal-impedances",
    num: "04",
    title: "Régime Sinusoïdal Forcé & Impédances Complexes",
    subtitle: "Grandeurs complexes, impédances de R, L, C et puissances",
    component: Chap3RegimeSinusoidalImpedances,
  },
  {
    id: "circuit-rlc-resonances",
    num: "05",
    title: "Circuit RLC Série, Résonances & Réponses Fréquentielles",
    subtitle: "Étude différentielle, résonances en I et U, et facteur de qualité Q",
    component: Chap4CircuitRLCResonances,
  }
];

export const COURANTS_DIPOLES_CHAPTERS = ELECTRONIQUE_DE_BASE_CHAPTERS;

export const RESEAUX_ARQS_CHAPTERS = [
  {
    id: "lois-kirchhoff-theoremes",
    num: "01",
    title: "Lois de Kirchhoff & Théorèmes",
    subtitle: "Superposition, Thévenin, Norton et transformation",
    component: Chap2GenerateursLoisKirchhoff,
  },
  {
    id: "regimes-transitoires-rc-rl-rlc",
    num: "02",
    title: "Régimes Transitoires des Circuits Linéaires (RC, RL, RLC)",
    subtitle: "Équations différentielles, charge/décharge et oscillations amorties",
    component: ChapRegimesTransitoiresRCRlRlc,
  },
  {
    id: "regime-sinusoidal-impedance",
    num: "03",
    title: "Régime Sinusoïdal Forcé & Impédance",
    subtitle: "Admittance et impédance complexes des dipôles R, L, C",
    component: Chap3RegimeSinusoidalImpedances,
  },
  {
    id: "circuit-rlc-resonances",
    num: "04",
    title: "Circuit RLC Série & Résonances",
    subtitle: "Étude complète et puissance moyenne",
    component: Chap4CircuitRLCResonances,
  }
];

export const ELECTRONIQUE_ANALOGIQUE_CHAPTERS = [
  {
    id: "systemes-lineaires-quadripoles",
    num: "01",
    title: "Systèmes Linéaires & Quadripôles",
    subtitle: "Fourier, fonction de transfert et diagramme de Bode",
    component: null,
  },
  {
    id: "diodes-transistors-bipolaires",
    num: "02",
    title: "Diodes & Transistors Bipolaires",
    subtitle: "Zener, redressement, émetteur commun et contre-réaction",
    component: null,
  },
  {
    id: "amplificateurs-operationnels",
    num: "03",
    title: "Amplificateurs Opérationnels (AO)",
    subtitle: "Modèle idéal, montages linéaires et comparateur",
    component: null,
  }
];

export const ELECTRONIQUE_CHAPTERS = [
  ...ELECTRONIQUE_DE_BASE_CHAPTERS,
  ...ELECTRONIQUE_ANALOGIQUE_CHAPTERS
];

export { 
  Chap1FondementsElectrocinetique, 
  Chap2GenerateursLoisKirchhoff,
  ChapRegimesTransitoiresRCRlRlc,
  Chap3RegimeSinusoidalImpedances,
  Chap4CircuitRLCResonances,
  Chap1DensiteConductivite, 
  Chap2LoiOhmDipoles, 
  Chap3PuissanceElectrocinetique 
};
