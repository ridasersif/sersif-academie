import Chap1CourantsChamp from "./chap1-courants-champ";
import Chap2LoisFondamentales from "./chap2-lois-fondamentales";
import Chap3PotentielDipole from "./chap3-potentiel-dipole";
import Chap4InductionElectromagnetique from "./chap4-induction-electromagnetique";
import Chap5EquationsMaxwell from "./chap5-equations-maxwell";
import Chap6ARQS from "./chap6-arqs";
import Chap7EnergieElectromagnetique from "./chap7-energie-electromagnetique";

export const ELECTROMAGNETISME_VIDE_CHAPTERS = [
  {
    id: "courants-champ",
    num: "01",
    title: "Courants et Champ Magnétique",
    subtitle: "Charges, Courants et Symétries",
    component: Chap1CourantsChamp,
  },
  {
    id: "lois-fondamentales",
    num: "02",
    title: "Lois Fondamentales de la Magnétostatique",
    subtitle: "Biot-Savart et Théorème d'Ampère",
    component: Chap2LoisFondamentales,
  },
  {
    id: "potentiel-dipole",
    num: "03",
    title: "Potentiel Vecteur et Dipôle Magnétique",
    subtitle: "Dipôle magnétique et Effet Hall",
    component: Chap3PotentielDipole,
  },
  {
    id: "induction-electromagnetique",
    num: "04",
    title: "Induction Électromagnétique",
    subtitle: "Lois de Faraday, Lenz et Travail de Laplace",
    component: Chap4InductionElectromagnetique,
  },
  {
    id: "equations-maxwell",
    num: "05",
    title: "Équations de Maxwell",
    subtitle: "Formulations locales, intégrales et courants de déplacement",
    component: Chap5EquationsMaxwell,
  },
  {
    id: "arqs",
    num: "06",
    title: "ARQS — Approximation des Régimes Quasi-Stationnaires",
    subtitle: "Conditions de validité et régimes quasi-stationnaires",
    component: Chap6ARQS,
  },
  {
    id: "energie-electromagnetique",
    num: "07",
    title: "Énergie Électromagnétique",
    subtitle: "Vecteur de Poynting et Bilan d'Énergie",
    component: Chap7EnergieElectromagnetique,
  }
];

export { 
  Chap1CourantsChamp, 
  Chap2LoisFondamentales, 
  Chap3PotentielDipole, 
  Chap4InductionElectromagnetique,
  Chap5EquationsMaxwell,
  Chap6ARQS,
  Chap7EnergieElectromagnetique
};
