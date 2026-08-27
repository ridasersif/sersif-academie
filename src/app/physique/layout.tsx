import type { Metadata } from "next";

const SITE_URL = "https://sersif-academie.vercel.app";

export const metadata: Metadata = {
  title: "Physique — Mécanique, Thermodynamique, Optique, Électricité, Physique Quantique",
  description:
    // FR
    "Tous les cours de Physique pour la préparation au concours de l'enseignement au Maroc, par Rida Sersif (Sersif Académie). " +
    "Module 01 — Mécanique du point et du solide : cinématique, dynamique newtonienne, travail, énergie, oscillateurs, forces centrales, mécanique du solide. " +
    "Module 02 — Thermodynamique : premier et second principe, machines thermiques, cycle de Carnot, entropie, fluides. " +
    "Module 03 — Optique et ondes : optique géométrique, réfraction, interférences, diffraction, propagation d'ondes. " +
    "Module 04 — Électricité : électrostatique, Gauss, Kirchhoff, Thévenin, Norton, électromagnétisme, Maxwell, RC, RL, RLC, régimes transitoires, résonance, AO, diodes, transistors. " +
    "Module 05 — Physique quantique, atomique et nucléaire : Schrödinger, niveaux d'énergie, atome, désintégrations, radioactivité." +
    // AR
    " دروس الفيزياء الكاملة لمسابقة التعليم بالمغرب — الميكانيك، الحرارة، الضوء والأمواج، الكهرباء والإلكترونيك، الفيزياء الكمية والذرية. من إعداد رضا سرسيف." +
    // EN
    " Complete physics courses for Morocco teacher recruitment exam — Mechanics, Thermodynamics, Optics, Electricity (RC, RL, RLC), Quantum Physics. By Rida Sersif (Sersif Academy).",
  keywords: [
    // 🔹 Site / Auteur
    "Sersif Académie", "Sersif Academie", "Sersif Academy", "Rida Sersif", "sersif",
    "concours enseignement Maroc", "CRMEF", "préparation concours physique",
    "cours physique Maroc", "physique concours recrutement",
    "منصة سرسيف", "رضا سرسيف", "مسابقة التعليم الفيزياء المغرب",
    "physics Morocco concours", "Sersif physics",

    // 🔹 Module 01 — Mécanique
    "mécanique du point", "mécanique du solide", "cinématique du point",
    "dynamique newtonienne", "PFD", "principe fondamental de la dynamique",
    "travail énergie", "TEC théorème énergie cinétique",
    "oscillateurs harmoniques", "résonance mécanique", "frottement visqueux",
    "forces centrales", "loi de Gravitation", "satellites", "Kepler",
    "chocs élastiques inélastiques", "conservation quantité de mouvement",
    "cinématique du solide", "équiprojectivité", "moments d'inertie", "Huygens",
    "PFD solide", "référentiels non-galiléens", "liaisons mécaniques",

    // 🔹 Module 02 — Thermodynamique
    "thermodynamique", "premier principe thermodynamique", "second principe",
    "énergie interne", "enthalpie", "entropie", "travail thermodynamique",
    "machines thermiques", "cycle de Carnot", "rendement Carnot",
    "fluides thermodynamique", "gaz parfait", "loi des gaz parfaits",
    "échanges thermiques", "chaleur latente", "capacité thermique",
    "thermostat", "adiabatique", "isotherme", "isobare", "isochore",

    // 🔹 Module 03 — Optique & Ondes
    "optique géométrique", "réfraction", "réflexion", "loi de Snell-Descartes",
    "lentilles convergentes divergentes", "miroirs sphériques", "vergence",
    "optique ondulatoire", "interférences lumineuses", "diffraction",
    "fentes d'Young", "lumière cohérente", "polarisation",
    "propagation d'ondes", "ondes progressives", "vitesse de phase",
    "effet Doppler", "acoustique", "sons",
    "atomistique", "spectroscopie", "niveaux d'énergie",

    // 🔹 Module 04 — Électricité & Électronique
    "électrostatique", "champ électrique", "potentiel électrique",
    "loi de Coulomb", "théorème de Gauss", "dipôle électrique",
    "électromagnétisme", "Maxwell", "induction de Faraday",
    "Biot-Savart", "Ampère", "potentiel vecteur", "ARQS",
    "électrocinétique", "Kirchhoff", "loi des nœuds", "loi des mailles",
    "Thévenin", "Norton", "superposition", "pont diviseur",
    "impédance complexe", "régime sinusoïdal forcé",
    "circuit RC", "circuit RL", "circuit RLC",
    "RC", "RL", "RLC", "régimes transitoires", "constante de temps",
    "résonance", "facteur de qualité Q", "bande passante",
    "diode", "transistor bipolaire", "amplificateur opérationnel", "AO",
    "quadripôle", "Bode", "fonction de transfert",

    // 🔹 Module 05 — Physique Quantique, Atomique & Nucléaire
    "physique quantique", "physique atomique", "physique nucléaire",
    "atomistique", "atome de Bohr", "modèle atomique",
    "dualité onde-corpuscule", "équation de Schrödinger",
    "fonction d'onde", "niveaux d'énergie", "spectre hydrogène",
    "radioactivité", "désintégration radioactive", "demi-vie",
    "fission nucléaire", "fusion nucléaire", "réactions nucléaires",
    "effet photoélectrique", "photon", "De Broglie",
    "quantum", "quantification", "orbitales atomiques",

    // 🔹 Anglais / Arabe
    "physics courses Morocco", "RC circuit", "RL circuit", "RLC circuit",
    "thermodynamics", "quantum physics", "optics waves",
    "الميكانيك", "الحرارة", "الضوء", "الكهرباء", "الفيزياء الكمية",
    "الفيزياء الذرية والنووية", "دروس الفيزياء", "مسابقة التعليم",
  ],
  authors: [{ name: "Rida Sersif", url: SITE_URL }],
  creator: "Rida Sersif",
  openGraph: {
    title: "Physique — Tous les Modules | Sersif Académie",
    description:
      "5 modules complets de Physique : Mécanique, Thermodynamique, Optique, Électricité (RC/RL/RLC/Kirchhoff/Maxwell), Physique Quantique — Préparation concours enseignement Maroc. Par Rida Sersif.",
    url: `${SITE_URL}/physique`,
    siteName: "Sersif Académie",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/physique`,
  },
  robots: { index: true, follow: true },
};

export default function PhysiqueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
