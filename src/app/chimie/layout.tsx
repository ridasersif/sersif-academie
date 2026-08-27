import type { Metadata } from "next";

const SITE_URL = "https://sersif-academie.vercel.app";

export const metadata: Metadata = {
  title: "Chimie — Atomistique, Organique, Cinétique, Thermochimie, Électrochimie",
  description:
    "Sersif Académie — Tous les cours de Chimie pour la préparation au concours de l'enseignement au Maroc, par Rida Sersif. " +
    "Atomistique : structure atome, configuration électronique, liaisons covalentes ioniques, hybridation sp sp2 sp3, VSEPR, cristallographie. " +
    "Chimie Organique : nomenclature IUPAC, stéréochimie, chiralité, énantiomères, SN1 SN2, addition, élimination, spectroscopie IR RMN. " +
    "Cinétique Chimique : vitesse de réaction, ordre, Arrhenius, énergie d'activation, catalyse. " +
    "Thermodynamique Chimique : enthalpie réaction, Hess, Gibbs, Van't Hoff, Le Chatelier, équilibre Keq. " +
    "Solutions Aqueuses & Électrochimie : pH, pKa, Brönsted, dosage, tampon, Ks, Nernst, pile Daniell, électrolyse, Faraday. " +
    "دروس الكيمياء الكاملة — الذرة، العضوية، السينيتيك، الثرموديناميك، المحاليل — رضا سرسيف. " +
    "Complete chemistry courses Morocco — atomistics, organic, kinetics, thermochemistry, electrochemistry — Rida Sersif.",
  keywords: [
    // ── Site / Auteur ──────────────────────────────────────────────────────
    "Sersif Académie", "Sersif Academie", "Sersif Academy", "Rida Sersif", "sersif",
    "concours enseignement Maroc chimie", "CRMEF chimie",
    "cours chimie Maroc", "préparation concours chimie",
    "منصة سرسيف الكيمياء", "رضا سرسيف", "مسابقة التعليم الكيمياء",

    // ── Module 01 : Atomistique & Liaisons Chimiques & Cristallographie ───
    "atomistique", "structure de l'atome", "modèle atomique",
    "numéro atomique Z", "numéro de masse A", "isotopes",
    "électron proton neutron", "couches électroniques", "sous-couches s p d f",
    "configuration électronique", "règle de Klechkowski", "règle de Hund",
    "principe de Pauli", "tableau périodique des éléments",
    "période groupe tableau périodique", "électronégativité",
    "liaisons chimiques", "liaison covalente", "liaison ionique",
    "liaison métallique", "liaison hydrogène", "forces de Van der Waals",
    "liaison covalente polaire apolaire", "moment dipolaire",
    "hybridation sp", "hybridation sp2", "hybridation sp3",
    "théorie VSEPR", "géométrie moléculaire", "angle de valence",
    "molécule linéaire", "molécule coudée", "tétraédrique pyramidale",
    "orbitales moléculaires", "liaisons sigma pi",
    "cristallographie", "réseau cristallin", "maille cristalline",
    "maille cubique simple", "CFC cubique face centrée", "BCC cubique centrée",
    "compacité", "coordinence", "rayon atomique ionique",
    "cristal ionique", "cristal covalent", "cristal métallique",
    "cristal moléculaire", "liaison peptidique", "macromolécules",

    // ── Module 02 : Chimie Organique & Méthodes Physicochimiques ──────────
    "chimie organique", "carbone tétravalent", "chaîne carbonée",
    "nomenclature IUPAC", "groupes fonctionnels", "fonctions chimiques",
    "alcanes", "alcènes", "alcynes", "aromatiques benzène",
    "alcools", "éthers", "aldéhydes", "cétones",
    "acides carboxyliques", "esters", "amides", "amines",
    "halogénoalcanes", "nitriles",
    "stéréochimie", "isomérie", "isomérie plane", "isomérie optique",
    "chiralité", "carbone asymétrique", "centre stéréogène",
    "énantiomères", "diastéréoisomères", "méso",
    "représentation de Newman", "représentation en perspective",
    "conformation", "conformation chaise bateau",
    "mécanismes réactionnels", "intermédiaires réactionnels",
    "carbocation", "carbanion", "radical libre",
    "substitution nucléophile SN1", "substitution nucléophile SN2",
    "addition électrophile AE", "élimination E1 E2",
    "substitution électrophile aromatique SEAr",
    "réaction d'estérification", "saponification",
    "polyaddition", "polycondensation", "polymères",
    "spectroscopie IR infrarouge", "nombre d'onde",
    "RMN résonance magnétique nucléaire", "déplacement chimique",
    "spectrométrie de masse", "fragmentation",

    // ── Module 03 : Cinétique Chimique & Catalyse ─────────────────────────
    "cinétique chimique", "vitesse de réaction",
    "vitesse de formation", "vitesse de disparition",
    "ordre de réaction", "ordre global partiel",
    "loi cinétique", "loi de vitesse", "constante de vitesse k",
    "réaction d'ordre 0", "réaction d'ordre 1", "réaction d'ordre 2",
    "temps de demi-réaction t1/2",
    "loi d'Arrhenius", "énergie d'activation Ea",
    "facteur de fréquence", "diagramme d'énergie potentielle",
    "complexe activé", "état de transition",
    "catalyseur", "catalyse homogène", "catalyse hétérogène",
    "catalyse enzymatique", "inhibiteur", "activateur",
    "mécanisme réactionnel étape limitante",
    "approche des états quasi-stationnaires",

    // ── Module 04 : Thermodynamique Chimique & Équilibres ─────────────────
    "thermodynamique chimique", "thermochimie",
    "réaction exothermique endothermique",
    "enthalpie standard de réaction ΔH°",
    "enthalpie de formation", "enthalpie de combustion",
    "loi de Hess", "énergie de liaison",
    "chaleur de neutralisation", "chaleur de dissolution",
    "entropie de réaction ΔS°",
    "énergie libre de Gibbs ΔG°",
    "relation ΔG = ΔH - TΔS",
    "spontanéité réaction", "sens évolution",
    "équilibre chimique", "loi d'action de masse",
    "constante d'équilibre Keq Kc Kp Ka",
    "quotient réactionnel Q", "sens déplacement équilibre",
    "principe de Le Chatelier", "déplacement d'équilibre",
    "loi de Van't Hoff", "influence température sur Keq",
    "équilibre hétérogène homogène",
    "taux d'avancement à l'équilibre",

    // ── Module 05 : Solutions Aqueuses & Électrochimie ────────────────────
    // Généralités solutions
    "chimie des solutions aqueuses", "solutions électrolytes",
    "solvant eau", "constante diélectrique", "hydratation",
    "force ionique", "activité chimique",
    "modèle de Debye-Hückel", "coefficient d'activité",
    // Acide-Base
    "acide base", "théorie de Brönsted Lowry",
    "couple acide-base", "pKa", "Ka Kb Ke",
    "produit ionique de l'eau Ke pKe",
    "pH calcul", "pH acide fort", "pH base forte",
    "pH acide faible", "pH base faible",
    "méthode de la réaction prépondérante RP",
    "dosage acido-basique", "courbe de titrage pH-métrique",
    "point d'équivalence", "saut de pH",
    "indicateur coloré", "zone virage",
    "suivi conductimétrique dosage",
    "solution tampon", "effet tampon", "pouvoir tampon",
    "formule de Henderson-Hasselbalch",
    // Précipitation
    "réactions de précipitation", "produit de solubilité Ks",
    "solubilité s", "condition de précipitation",
    "effet de l'ion commun", "influence du pH sur solubilité",
    "complexation sur solubilité",
    // Oxydo-réduction
    "oxydo-réduction redox", "degré d'oxydation",
    "oxydant réducteur", "couple redox",
    "potentiel standard d'électrode E°",
    "électrode standard à hydrogène ESH",
    "formule de Nernst", "potentiel apparent",
    "règle du gamma", "prévision thermodynamique redox",
    "constante d'équilibre oxydoréduction",
    // Piles & Électrolyse
    "pile électrochimique", "pile Daniell",
    "force électromotrice FEM", "résistance interne pile",
    "thermodynamique des piles", "enthalpie Gibbs pile",
    "électrode de calomel", "électrode Ag/AgCl",
    "piles de concentration",
    "électrolyse", "loi de Faraday", "rendement faradique",
    "électrodéposition", "dépôt électrolytique",
    "accumulateur plomb", "accumulateur lithium-ion",
    "pile à combustible hydrogène",

    // ── Mots-clés arabes ──────────────────────────────────────────────────
    "الذرة والروابط الكيميائية", "الكيمياء العضوية", "السينيتيك الكيميائي",
    "الثرموديناميك الكيميائي", "المحاليل المائية والكيمياء الكهربائية",
    "الهجنة الكيميائية", "التجسيم الفراغي", "آليات التفاعل",
    "درجة الحموضة pH", "الأكسدة والاختزال", "معادلة نرنست",
    "الخلية الجلفانية", "التحليل الكهربائي", "قانون فاراداي",
    "التوازن الكيميائي", "مبدأ لوشاتيليه",
    "دروس الكيمياء المغرب", "مسابقة التعليم",

    // ── Anglais ───────────────────────────────────────────────────────────
    "atomistics bonding crystallography Morocco",
    "organic chemistry nomenclature stereochemistry mechanism",
    "chemical kinetics Arrhenius activation energy",
    "chemical thermodynamics Gibbs enthalpy equilibrium",
    "aqueous solutions pH acid base electrochemistry",
    "Nernst equation Daniell cell electrolysis Faraday",
    "Rida Sersif chemistry courses", "Sersif Academy chemistry Morocco",
  ],
  authors: [{ name: "Rida Sersif", url: SITE_URL }],
  creator: "Rida Sersif",
  openGraph: {
    title: "Chimie — Tous les Modules | Sersif Académie",
    description:
      "5 modules de Chimie : Atomistique (liaisons, cristallographie), Organique (SN1/SN2, IR/RMN), Cinétique (Arrhenius, catalyse), Thermochimie (Gibbs, Le Chatelier), Solutions Aqueuses & Électrochimie (pH, Nernst, Faraday) — Rida Sersif.",
    url: `${SITE_URL}/chimie`,
    siteName: "Sersif Académie",
    type: "website",
  },
  alternates: { canonical: `${SITE_URL}/chimie` },
  robots: { index: true, follow: true },
};

export default function ChimieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
