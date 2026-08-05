import Chap1RappelsMathematiques from "./chap1-rappels-mathematiques";
import Chap2CinematiqueDuPoint from "./chap2-cinematique-du-point";

export const MECANIQUE_DU_POINT_CHAPTERS = [
  {
    id: "chap-1",
    num: "01",
    title: "Rappels Mathématiques",
    subtitle: "Vecteurs, dérivation & systèmes de coordonnées",
    component: Chap1RappelsMathematiques,
  },
  {
    id: "chap-2",
    num: "02",
    title: "Cinématique du Point",
    subtitle: "Position, vitesse, accélération & Frenet",
    component: Chap2CinematiqueDuPoint,
  },
  {
    id: "chap-3",
    num: "03",
    title: "Dynamique du Point",
    subtitle: "Principes fondamentaux (PFD)",
    component: null,
  },
  {
    id: "chap-4",
    num: "04",
    title: "Travail et Énergie",
    subtitle: "Théorème de l'énergie cinétique",
    component: null,
  },
  {
    id: "chap-5",
    num: "05",
    title: "Oscillateurs Harmoniques",
    subtitle: "Oscillations libres, amorties & résonance",
    component: null,
  },
  {
    id: "chap-6",
    num: "06",
    title: "Forces Centrales",
    subtitle: "Planètes, Kepler & vitesses cosmiques",
    component: null,
  },
  {
    id: "chap-7",
    num: "07",
    title: "Chocs et Collisions",
    subtitle: "Chocs élastiques & inélastiques",
    component: null,
  },
];

export { Chap1RappelsMathematiques, Chap2CinematiqueDuPoint };
