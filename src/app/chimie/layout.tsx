import type { Metadata } from "next";

const SITE_URL = "https://sersif-academie.vercel.app";

export const metadata: Metadata = {
  title: "Chimie — Atomistique, Organique, Cinétique, Thermochimie, Électrochimie",
  description:
    // FR
    "Tous les cours de Chimie pour la préparation au concours de l'enseignement au Maroc, par Rida Sersif (Sersif Académie). " +
    "Module 01 — Atomistique & Cristallographie : structure de l'atome, configurations électroniques, liaisons chimiques, cristallographie. " +
    "Module 02 — Chimie Organique & Analyse : nomenclature IUPAC, stéréochimie, mécanismes réactionnels, spectroscopie IR et RMN. " +
    "Module 03 — Cinétique Chimique & Catalyse : vitesse de réaction, ordre, loi d'Arrhenius, catalyseurs. " +
    "Module 04 — Thermodynamique Chimique : enthalpie de réaction, entropie, Gibbs, équilibres chimiques. " +
    "Module 05 — Solutions Aqueuses & Électrochimie : pH, acido-basique, Brönsted, dosage titrage, précipitation, Ks, oxydo-réduction, Nernst, pile Daniell, électrolyse, Faraday." +
    // AR
    " دروس الكيمياء الكاملة لمسابقة التعليم بالمغرب — الذرة والروابط الكيميائية، الكيمياء العضوية، السينيتيك الكيميائي، الديناميكا الحرارية الكيميائية، المحاليل المائية والكيمياء الكهربائية. من إعداد رضا سرسيف." +
    // EN
    " Complete chemistry courses for Morocco teacher recruitment exam — Atomistics, Organic Chemistry, Chemical Kinetics, Thermochemistry, Aqueous Solutions & Electrochemistry. By Rida Sersif (Sersif Academy).",
  keywords: [
    // 🔹 Site / Auteur
    "Sersif Académie", "Sersif Academie", "Sersif Academy", "Rida Sersif", "sersif",
    "concours enseignement Maroc chimie", "CRMEF chimie",
    "cours chimie Maroc", "préparation concours chimie",
    "منصة سرسيف الكيمياء", "رضا سرسيف", "مسابقة التعليم الكيمياء",
    "chemistry Morocco concours",

    // 🔹 Module 01 — Atomistique & Cristallographie
    "atomistique", "structure de l'atome", "modèle atomique",
    "configuration électronique", "tableau périodique", "règle de Klechkowski",
    "liaisons chimiques", "liaison covalente", "liaison ionique", "liaison hydrogène",
    "hybridation sp sp2 sp3", "théorie VSEPR", "géométrie moléculaire",
    "cristallographie", "réseau cristallin", "maille", "compacité",
    "cristal ionique covalent métallique",

    // 🔹 Module 02 — Chimie Organique
    "chimie organique", "nomenclature IUPAC", "stéréochimie",
    "chiralité", "énantiomères", "diastéréoisomères", "carbone asymétrique",
    "mécanismes réactionnels", "substitution nucléophile SN1 SN2",
    "addition électrophile", "élimination", "aromaticité",
    "spectroscopie IR", "RMN", "spectrométrie de masse",
    "alcanes alcènes alcynes", "alcools aldéhydes cétones acides carboxyliques",
    "amines esters", "polymères",

    // 🔹 Module 03 — Cinétique Chimique
    "cinétique chimique", "vitesse de réaction",
    "ordre de réaction", "loi cinétique", "constante de vitesse",
    "loi d'Arrhenius", "énergie d'activation",
    "catalyseur", "catalyse homogène hétérogène enzymatique",
    "temps de demi-réaction",

    // 🔹 Module 04 — Thermodynamique Chimique
    "thermodynamique chimique", "thermochimie",
    "enthalpie de réaction", "chaleur de formation",
    "entropie réaction", "énergie libre de Gibbs",
    "équilibre chimique", "constante d'équilibre Keq",
    "loi de Hess", "loi de Van't Hoff", "déplacement d'équilibre",
    "principe de Le Chatelier", "solubilité équilibre",

    // 🔹 Module 05 — Solutions Aqueuses & Électrochimie
    "chimie des solutions", "solutions aqueuses", "électrochimie",
    "pH calcul", "acide base", "Brönsted", "Ka Kb Ke pKa",
    "force ionique", "activité chimique",
    "dosage titrage pH-métrique", "conductimétrique",
    "solution tampon", "indicateur coloré", "effet tampon",
    "précipitation", "produit de solubilité Ks", "solubilité",
    "effet ion commun", "complexation",
    "oxydo-réduction", "potentiel redox", "Nernst",
    "ESH électrode standard hydrogène", "règle du gamma",
    "pile électrochimique", "pile Daniell", "FEM force électromotrice",
    "électrolyse", "loi de Faraday",
    "accumulateur plomb lithium", "pile à combustible",

    // 🔹 Anglais / Arabe
    "aqueous solutions electrochemistry", "pH calculation", "Nernst equation",
    "Daniell cell", "electrolysis Faraday", "organic chemistry",
    "الذرة والروابط الكيميائية", "الكيمياء العضوية", "السينيتيك",
    "الثرموديناميك الكيميائي", "المحاليل المائية", "الكيمياء الكهربائية",
    "درجة الحموضة pH", "الأكسدة والاختزال", "التحليل الكهربائي",
  ],
  authors: [{ name: "Rida Sersif", url: SITE_URL }],
  creator: "Rida Sersif",
  openGraph: {
    title: "Chimie — Tous les Modules | Sersif Académie",
    description:
      "5 modules complets de Chimie : Atomistique, Chimie Organique, Cinétique, Thermochimie, Solutions Aqueuses & Électrochimie (pH, Nernst, Piles) — Préparation concours enseignement Maroc. Par Rida Sersif.",
    url: `${SITE_URL}/chimie`,
    siteName: "Sersif Académie",
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/chimie`,
  },
  robots: { index: true, follow: true },
};

export default function ChimieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
