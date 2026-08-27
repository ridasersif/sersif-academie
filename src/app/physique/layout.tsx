import type { Metadata } from "next";

const SITE_URL = "https://sersif-academie.vercel.app";

export const metadata: Metadata = {
  title: "Physique — Mécanique, Thermodynamique, Optique, Électricité, Physique Quantique",
  description:
    "Sersif Académie — Tous les cours de Physique pour la préparation au concours de l'enseignement au Maroc, par Rida Sersif. " +
    "Mécanique : vitesse, accélération, vecteur position, MRU, MRUA, tir parabolique, forces, Newton, énergie, travail, oscillateurs, pendule, ressort, Kepler, chocs. " +
    "Thermodynamique : gaz parfait, pression, température, Van der Waals, entropie, enthalpie, Carnot, machines thermiques. " +
    "Optique : lentilles, miroirs, vergence, réfraction, Snell-Descartes, interférences, diffraction, polarisation, ondes, Doppler. " +
    "Électricité : Coulomb, Gauss, Maxwell, Kirchhoff, Thévenin, RC RL RLC, résonance, AO, transistor, diode. " +
    "Physique Quantique : Bohr, Schrödinger, radioactivité, demi-vie, fission, fusion. " +
    "دروس الفيزياء الكاملة — الميكانيك، الحرارة، الضوء، الكهرباء، الفيزياء الكمية — رضا سرسيف. " +
    "Complete physics courses Morocco — mechanics, thermodynamics, optics, electricity, quantum physics — Rida Sersif.",
  keywords: [
    // ── Site / Auteur ──────────────────────────────────────────────────────
    "Sersif Académie", "Sersif Academie", "Sersif Academy", "Rida Sersif", "sersif",
    "concours enseignement Maroc", "CRMEF", "préparation concours physique",
    "cours physique Maroc", "physique PC Maroc", "منصة سرسيف", "رضا سرسيف",
    "مسابقة التعليم الفيزياء المغرب", "physics Morocco concours",

    // ── Module 01 : Mécanique du Point ─────────────────────────────────────
    "mécanique du point", "cinématique du point matériel",
    "vecteur position", "vecteur vitesse", "vecteur accélération",
    "vitesse instantanée", "accélération tangentielle", "accélération normale",
    "coordonnées cartésiennes", "coordonnées cylindriques", "coordonnées sphériques",
    "repère de Frenet", "base de Frenet", "courbure trajectoire",
    "mouvement rectiligne uniforme", "MRU", "mouvement rectiligne uniformément accéléré", "MRUA",
    "mouvement circulaire uniforme", "MCU", "accélération centripète",
    "tir parabolique", "mouvement projectile", "portée horizontale",
    "dynamique newtonienne", "première loi de Newton", "deuxième loi de Newton",
    "principe fondamental de la dynamique", "PFD", "troisième loi de Newton",
    "poids", "réaction normale", "force de frottement", "force de tension",
    "travail d'une force", "puissance mécanique", "théorème de l'énergie cinétique", "TEC",
    "énergie potentielle", "énergie mécanique", "forces conservatives",
    "champ de pesanteur", "énergie potentielle gravitationnelle",
    "oscillateurs harmoniques", "pendule simple", "pendule pesant",
    "oscillateur masse-ressort", "constante de raideur", "pulsation propre",
    "régime libre amorti", "frottement visqueux", "facteur d'amortissement",
    "régime sinusoïdal forcé", "résonance en amplitude", "résonance en énergie",
    "forces centrales", "mouvement des planètes", "lois de Kepler",
    "première loi Kepler ellipse", "deuxième loi aires", "troisième loi périodes",
    "vitesses cosmiques", "premier deuxième vitesse cosmique",
    "satellites géostationnaires", "gravitation universelle Newton",
    "chocs élastiques", "chocs inélastiques", "conservation quantité de mouvement",

    // ── Module 01 : Mécanique du Solide ────────────────────────────────────
    "mécanique du solide", "solide indeformable", "cinématique du solide",
    "champ des vitesses", "équiprojectivité", "champ des accélérations",
    "translation", "rotation fixe", "mouvement général",
    "angles d'Euler", "centre de masse", "centre de gravité",
    "moments d'inertie", "théorème de Huygens Steiner", "matrice d'inertie",
    "théorème de Koenig", "énergie cinétique solide",
    "PFD solide", "théorèmes généraux", "référentiels non-galiléens",
    "force de Coriolis", "force centrifuge", "puissance cinétique",
    "lois de Coulomb frottement solide", "liaisons mécaniques parfaites",

    // ── Module 02 : Thermodynamique ────────────────────────────────────────
    "thermodynamique", "système thermodynamique", "état thermodynamique",
    "gaz parfait", "loi des gaz parfaits", "équation d'état",
    "pression volume température", "gaz réels", "Van der Waals",
    "échanges thermiques", "transfert de chaleur", "conduction thermique",
    "chaleur latente", "capacité thermique massique", "calorimétrie",
    "premier principe thermodynamique", "énergie interne",
    "travail thermodynamique W", "chaleur Q", "enthalpie H",
    "transformation adiabatique", "transformation isotherme",
    "transformation isobare", "transformation isochore",
    "deuxième principe thermodynamique", "entropie S",
    "inégalité de Clausius", "irréversibilité",
    "machines thermiques", "cycle de Carnot", "rendement Carnot",
    "réfrigérateur", "pompe à chaleur", "coefficient de performance COP",
    "cycle de Rankine", "cycle de Brayton",

    // ── Module 03 : Optique & Ondes ────────────────────────────────────────
    "optique géométrique", "rayon lumineux", "loi de la réflexion",
    "loi de réfraction", "loi de Snell-Descartes", "indice de réfraction",
    "réflexion totale interne", "angle limite",
    "miroir plan", "miroir sphérique", "centre de courbure",
    "lentille convergente", "lentille divergente", "vergence dioptrie",
    "distance focale", "foyer objet", "foyer image",
    "formule de conjugaison", "grandissement transversal",
    "dioptre sphérique", "prisme optique", "dispersion lumineuse",
    "arc-en-ciel", "spectre visible",
    "instruments d'optique", "œil", "loupe", "microscope", "lunette astronomique",
    "optique ondulatoire", "lumière cohérente", "interférences lumineuses",
    "expérience de Young", "fentes d'Young", "franges d'interférence",
    "diffraction", "réseau de diffraction", "figure de diffraction",
    "polarisation de la lumière", "polariseur analyseur",
    "propagation d'ondes", "ondes progressives", "ondes stationnaires",
    "longueur d'onde", "fréquence", "célérité", "période",
    "ondes sonores", "intensité sonore", "décibels",
    "effet Doppler", "ondes électromagnétiques",
    "rayons X", "ultraviolets", "infrarouges",

    // ── Module 04 : Électricité & Électronique ─────────────────────────────
    // Électrostatique
    "électrostatique", "charge électrique", "loi de Coulomb",
    "champ électrique E", "potentiel électrique V",
    "théorème de Gauss", "flux du champ électrique",
    "dipôle électrique", "moment dipolaire",
    "énergie électrostatique", "conducteur en équilibre",
    "distribution surfacique volumique linéique de charges",
    // Électromagnétisme
    "électromagnétisme", "courant électrique", "densité de courant",
    "champ magnétique B", "champ magnétostatique",
    "loi de Biot-Savart", "théorème d'Ampère",
    "force de Laplace", "force de Lorentz",
    "potentiel vecteur A", "dipôle magnétique",
    "équations de Maxwell", "Maxwell-Faraday", "Maxwell-Ampère",
    "Maxwell-Gauss", "Maxwell-Thomson",
    "vecteur de Poynting", "densité d'énergie électromagnétique",
    "induction électromagnétique", "loi de Faraday",
    "auto-induction", "inductance L", "mutuelle inductance",
    "potentiels retardés", "ARQS approximation régimes quasi-statiques",
    // Électrocinétique
    "électrocinétique", "loi d'Ohm", "résistivité conductivité",
    "lois de Kirchhoff", "loi des nœuds", "loi des mailles",
    "pont diviseur de tension", "pont diviseur de courant",
    "théorème de Thévenin", "théorème de Norton", "théorème de superposition",
    "générateur de Thévenin", "résistance interne",
    "puissance électrique", "loi de Joule",
    // Régime sinusoïdal
    "régime sinusoïdal forcé", "impédance complexe Z",
    "admittance complexe", "résistance R", "inductance L", "capacité C",
    "déphasage", "facteur de puissance", "puissance active réactive",
    "circuit RC", "circuit RL", "circuit RLC", "RC", "RL", "RLC",
    "régimes transitoires", "constante de temps tau",
    "charge décharge condensateur", "établissement rupture courant bobine",
    "résonance en intensité", "résonance en tension", "surtension",
    "facteur de qualité Q", "bande passante",
    // Électronique
    "diode à jonction", "diode Zener", "redressement filtrage",
    "transistor bipolaire", "amplificateur émetteur commun",
    "amplificateur opérationnel", "AO", "montage inverseur non-inverseur",
    "comparateur", "quadripôle", "diagramme de Bode",
    "fonction de transfert", "fréquence de coupure",

    // ── Module 05 : Physique Quantique, Atomique & Nucléaire ──────────────
    "physique quantique", "physique atomique", "physique nucléaire",
    "dualité onde-corpuscule", "De Broglie", "longueur d'onde de De Broglie",
    "principe d'incertitude Heisenberg",
    "équation de Schrödinger", "fonction d'onde", "densité de probabilité",
    "puits de potentiel", "barrière de potentiel", "effet tunnel",
    "atome de Bohr", "modèle de Bohr", "quantification énergie",
    "niveaux d'énergie", "émission absorption photon",
    "spectre de l'hydrogène", "séries de Lyman Balmer Paschen",
    "nombre quantique principal azimuthal magnétique spin",
    "orbitales atomiques s p d f",
    "configuration électronique", "règle de Klechkowski",
    "effet photoélectrique", "photon", "fréquence seuil",
    "radioactivité", "désintégration radioactive",
    "désintégration alpha beta gamma", "loi de décroissance radioactive",
    "demi-vie T1/2", "activité radioactive Becquerel",
    "réactions nucléaires", "fission nucléaire", "fusion nucléaire",
    "énergie de liaison", "défaut de masse", "équivalence masse-énergie E=mc2",

    // ── Mots-clés arabes ──────────────────────────────────────────────────
    "الميكانيك", "السرعة والتسارع", "قوانين نيوتن", "الطاقة الحركية",
    "المذبذبات", "قوانين كيبلر", "الاصطدامات",
    "الثرموديناميك", "الغاز المثالي", "الأنتروبيا", "دورة كارنو",
    "الضوء والأمواج", "الانكسار والانعكاس", "التداخل والحيود",
    "الكهرباء والإلكترونيك", "قانون كولوم", "قانون غوص",
    "معادلات ماكسويل", "الدوائر الكهربائية", "الرنين",
    "الفيزياء الكمية والذرية والنووية", "معادلة شرودنغر",
    "النشاط الإشعاعي", "الانشطار والاندماج النووي",
    "دروس الفيزياء المغرب", "مسابقة التعليم",

    // ── Anglais ───────────────────────────────────────────────────────────
    "physics Morocco", "mechanics kinematics dynamics",
    "velocity acceleration", "Newton's laws", "work energy theorem",
    "thermodynamics Carnot cycle entropy",
    "geometrical optics wave optics interferometry diffraction",
    "electrostatics Coulomb Gauss", "electromagnetism Maxwell",
    "RC circuit RL circuit RLC circuit", "resonance quality factor",
    "quantum mechanics Schrödinger", "radioactivity nuclear physics",
    "Rida Sersif physics courses", "Sersif Academy Morocco",
  ],
  authors: [{ name: "Rida Sersif", url: SITE_URL }],
  creator: "Rida Sersif",
  openGraph: {
    title: "Physique — Tous les Modules | Sersif Académie",
    description:
      "5 modules complets de Physique : Mécanique (vitesse, accélération, Newton, Kepler), Thermodynamique (Carnot, entropie), Optique (lentilles, interférences), Électricité (RC RL RLC, Kirchhoff, Maxwell, AO), Physique Quantique (Bohr, Schrödinger, radioactivité) — Rida Sersif.",
    url: `${SITE_URL}/physique`,
    siteName: "Sersif Académie",
    type: "website",
  },
  alternates: { canonical: `${SITE_URL}/physique` },
  robots: { index: true, follow: true },
};

export default function PhysiqueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
