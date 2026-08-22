import Chap1DensiteConductivite from "./chap1-densite-conductivite";
import Chap2LoiOhmDipoles from "./chap2-loi-ohm-dipoles";

export const COURANTS_DIPOLES_CHAPTERS = [
  {
    id: "densite-conductivite",
    num: "01",
    title: "Densité de courant & Conductivité",
    subtitle: "Mobilité, résistivité et résistance électrique",
    component: Chap1DensiteConductivite,
  },
  {
    id: "loi-ohm-dipoles",
    num: "02",
    title: "Loi d'Ohm & Dipôles Électriques",
    subtitle: "Loi d'Ohm microscopique, macroscopique et dipôles",
    component: Chap2LoiOhmDipoles,
  },
  {
    id: "puissance-electrocinetique",
    num: "03",
    title: "Puissance Électrocinétique & Bilan",
    subtitle: "Caractère générateur et récepteur",
    component: null,
  },
  {
    id: "generateurs-dipoles-rlc",
    num: "04",
    title: "Générateurs & Modèles R, L, C",
    subtitle: "Association des dipôles et modèles linéaires",
    component: null,
  }
];

export const RESEAUX_ARQS_CHAPTERS = [
  {
    id: "lois-kirchhoff-theoremes",
    num: "01",
    title: "Lois de Kirchhoff & Théorèmes",
    subtitle: "Superposition, Thévenin, Norton et transformation",
    component: null,
  },
  {
    id: "regime-sinusoidal-impedance",
    num: "02",
    title: "Régime Sinusoïdal Forcé & Impédance",
    subtitle: "Admittance et impédance complexes des dipôles R, L, C",
    component: null,
  },
  {
    id: "circuit-rlc-resonances",
    num: "03",
    title: "Circuit RLC Série & Résonances",
    subtitle: "Étude complète et puissance moyenne",
    component: null,
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
  ...COURANTS_DIPOLES_CHAPTERS,
  ...RESEAUX_ARQS_CHAPTERS,
  ...ELECTRONIQUE_ANALOGIQUE_CHAPTERS
];

export { Chap1DensiteConductivite, Chap2LoiOhmDipoles };
