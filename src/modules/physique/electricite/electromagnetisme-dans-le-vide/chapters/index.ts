import Chap1CourantsChamp from "./chap1-courants-champ";
import Chap2LoisFondamentales from "./chap2-lois-fondamentales";
import Chap3PotentielDipole from "./chap3-potentiel-dipole";
import Chap4InductionElectromagnetique from "./chap4-induction-electromagnetique";
import Chap5EnergieElectromagnetique from "./chap5-energie-electromagnetique";
import Chap6ARQS from "./chap6-arqs";

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
    subtitle: "Lois de Faraday, Lenz et Rail de Laplace",
    component: Chap4InductionElectromagnetique,
  },
  {
    id: "energie-electromagnetique",
    num: "05",
    title: "Énergie Électromagnétique",
    subtitle: "Vecteur et identité de Poynting",
    component: Chap5EnergieElectromagnetique,
  },
  {
    id: "arqs",
    num: "06",
    title: "ARQS",
    subtitle: "Approximation des Régimes Quasi-Stationnaires",
    component: Chap6ARQS,
  },
  {
    id: "equations-maxwell",
    num: "07",
    title: "Équations de Maxwell et Potentiels",
    subtitle: "Formulations locales et intégrales",
    component: null,
  }
];

export { 
  Chap1CourantsChamp, 
  Chap2LoisFondamentales, 
  Chap3PotentielDipole, 
  Chap4InductionElectromagnetique,
  Chap5EnergieElectromagnetique,
  Chap6ARQS
};
