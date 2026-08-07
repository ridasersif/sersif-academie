import Chap1CourantsChamp from "./chap1-courants-champ";
import Chap2LoisFondamentales from "./chap2-lois-fondamentales";

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
    title: "Lois Fondamentales",
    subtitle: "Biot-Savart et Théorème d'Ampère",
    component: Chap2LoisFondamentales,
  },
  {
    id: "potentiel-dipole",
    num: "03",
    title: "Potentiel Vecteur et Dipôle",
    subtitle: "Dipôle magnétique et Effet Hall",
    component: null,
  },
  {
    id: "equations-maxwell",
    num: "04",
    title: "Équations de Maxwell",
    subtitle: "Formulations locales et intégrales",
    component: null,
  },
  {
    id: "energie-electromagnetique",
    num: "05",
    title: "Énergie Électromagnétique",
    subtitle: "Vecteur et identité de Poynting",
    component: null,
  },
  {
    id: "potentiels-arqs",
    num: "06",
    title: "Potentiels et ARQS",
    subtitle: "Jauge de Lorentz et potentiels retardés",
    component: null,
  }
];

export { Chap1CourantsChamp };

