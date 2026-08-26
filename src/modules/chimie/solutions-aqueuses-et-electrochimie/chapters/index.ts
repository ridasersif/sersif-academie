import Chap1GeneralitesSolutions from "./chap1-generalites-solutions";
import { Chap2EquilibresAcidoBasiques } from "./chap2-equilibres-acido-basiques";
import { Chap3DosagesTampons } from "./chap3-dosages-tampons";
import { Chap4PrecipitationSolubilite } from "./chap4-precipitation-solubilite";
import { Chap5OxydoreductionNernst } from "./chap5-oxydoreduction-nernst";
import { Chap6PilesElectrolyse } from "./chap6-piles-electrolyse";
import { Chap7AccumulateursPilesCombustibles } from "./chap7-accumulateurs-piles-combustibles";

export const SOLUTIONS_ELECTROCHIMIE_CHAPTERS = [
  {
    id: "generalites-solutions",
    num: "01",
    title: "Généralités sur les Solutions Aqueuses",
    subtitle: "L'eau solvant, effets ionisants, solvatants, dispersants et activités",
    component: Chap1GeneralitesSolutions,
  },
  {
    id: "reactions-acido-basiques",
    num: "02",
    title: "Réactions Acido-Basiques & Calculs de pH",
    subtitle: "Théorie de Brönsted, Ka, Ke, méthode RP et calculs rigoureux",
    component: Chap2EquilibresAcidoBasiques,
  },
  {
    id: "dosages-tampons",
    num: "03",
    title: "Dosages Acido-Basiques & Solutions Tampons",
    subtitle: "Courbes de titrage, indicateurs, conductimétrie et pouvoir tampon",
    component: Chap3DosagesTampons,
  },
  {
    id: "reactions-precipitation",
    num: "04",
    title: "Réactions de Précipitation & Solubilité",
    subtitle: "Produit de solubilité Ks, ion commun, influence du pH et complexation",
    component: Chap4PrecipitationSolubilite,
  },
  {
    id: "oxydoreduction-nernst",
    num: "05",
    title: "Oxydo-Réduction & Formule de Nernst",
    subtitle: "Degrés d'oxydation, ESH, Nernst, règle du gamma et potentiel apparent",
    component: Chap5OxydoreductionNernst,
  },
  {
    id: "piles-faraday-electrolyse",
    num: "06",
    title: "Piles Électrochimiques & Électrolyse",
    subtitle: "Fonctionnement d'une pile, f.e.m, électrolyse et lois de Faraday",
    component: Chap6PilesElectrolyse,
  },
  {
    id: "accumulateurs-piles-combustibles",
    num: "07",
    title: "Accumulateurs & Piles à Combustible",
    subtitle: "Batteries rechargeables, accumulateur au plomb, Li-ion et hydrogène",
    component: Chap7AccumulateursPilesCombustibles,
  },
];

export {
  Chap1GeneralitesSolutions,
  Chap2EquilibresAcidoBasiques,
  Chap3DosagesTampons,
  Chap4PrecipitationSolubilite,
  Chap5OxydoreductionNernst,
  Chap6PilesElectrolyse,
  Chap7AccumulateursPilesCombustibles,
};
