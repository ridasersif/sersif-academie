import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AudioProvider } from "@/context/AudioContext";
import "./globals.css";
import "katex/dist/katex.min.css";
import MobileWarningToast from "@/components/MobileWarningToast";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://sersif-academie.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sersif Académie | Physique & Chimie — Concours Enseignement Maroc",
    template: "%s | Sersif Académie",
  },
  description:
    // FR
    "Sersif Académie — Plateforme éducative de Rida Sersif dédiée à la préparation au concours de recrutement des enseignants en Physique et Chimie au Maroc. " +
    "Cours complets : mécanique, électrostatique, électromagnétisme, électronique (RC, RL, RLC, Kirchhoff, Thévenin, Norton, résonance, régimes transitoires), thermodynamique, optique, chimie des solutions, pH, acido-basique, oxydo-réduction, piles, électrolyse, Nernst. " +
    // AR
    "منصة سرسيف الأكاديمية — إعداد مسابقة التعليم في الفيزياء والكيمياء بالمغرب. دروس كاملة في الميكانيك والكهرباء والإلكترونيك والكيمياء. من إعداد رضا سرسيف. " +
    // EN
    "Sersif Academy — Educational platform by Rida Sersif for physics and chemistry teacher recruitment exam preparation in Morocco. Full courses in mechanics, electrostatics, electromagnetism, electronics, thermodynamics, chemistry.",
  keywords: [
    // 🔹 Site / Auteur
    "Sersif Académie", "Sersif Academie", "Sersif Academy", "Rida Sersif", "sersif",
    "concours enseignement Maroc", "CRMEF", "préparation concours physique chimie",
    "cours physique chimie Maroc", "PC Maroc concours recrutement",
    "منصة سرسيف", "رضا سرسيف", "مسابقة التعليم", "الفيزياء والكيمياء المغرب",
    "Sersif physics chemistry Morocco",

    // 🔹 Physique — Mécanique (Module 01)
    "mécanique du point", "mécanique du solide", "cinématique", "dynamique newtonienne",
    "PFD", "travail énergie", "oscillateurs harmoniques", "résonance mécanique",
    "forces centrales", "Kepler", "satellites", "chocs élastiques",
    "moments d'inertie", "Huygens", "référentiels non-galiléens",

    // 🔹 Physique — Thermodynamique (Module 02)
    "thermodynamique", "premier principe", "second principe", "entropie",
    "enthalpie", "cycle de Carnot", "machines thermiques", "rendement",
    "gaz parfait", "échanges thermiques", "adiabatique", "isotherme",

    // 🔹 Physique — Optique & Ondes (Module 03)
    "optique géométrique", "réfraction", "réflexion", "Snell-Descartes",
    "lentilles", "miroirs", "vergence", "interférences lumineuses",
    "diffraction", "fentes d'Young", "polarisation",
    "propagation d'ondes", "ondes progressives", "Doppler",

    // 🔹 Physique — Électricité & Électronique (Module 04)
    "électrostatique", "champ électrique", "potentiel électrique", "théorème de Gauss",
    "électromagnétisme", "Maxwell", "induction", "loi de Faraday",
    "Biot-Savart", "Ampère", "ARQS", "potentiel vecteur",
    "électrocinétique", "lois de Kirchhoff", "nœuds mailles",
    "Thévenin", "Norton", "superposition", "pont diviseur",
    "impédance complexe", "régime sinusoïdal forcé", "RSF",
    "circuit RC", "circuit RL", "circuit RLC", "RC", "RL", "RLC",
    "régimes transitoires", "constante de temps tau", "résonance", "facteur de qualité Q",
    "diode", "transistor", "amplificateur opérationnel", "AO", "quadripôle", "Bode",

    // 🔹 Physique — Quantique, Atomique & Nucléaire (Module 05)
    "physique quantique", "physique atomique", "physique nucléaire",
    "atomistique physique", "atome de Bohr", "dualité onde-corpuscule",
    "équation de Schrödinger", "niveaux d'énergie", "spectre hydrogène",
    "radioactivité", "désintégration", "demi-vie", "fission fusion nucléaire",
    "effet photoélectrique", "De Broglie", "quantification",

    // 🔹 Chimie — Atomistique & Cristallographie (Module 01)
    "atomistique", "structure de l'atome", "configuration électronique",
    "liaisons chimiques", "hybridation", "VSEPR", "cristallographie", "maille cristalline",

    // 🔹 Chimie — Organique & Analyse (Module 02)
    "chimie organique", "nomenclature IUPAC", "stéréochimie", "chiralité",
    "mécanismes réactionnels", "SN1 SN2", "spectroscopie IR RMN",
    "alcanes alcènes alcynes", "alcools cétones acides carboxyliques",

    // 🔹 Chimie — Cinétique & Catalyse (Module 03)
    "cinétique chimique", "vitesse de réaction", "ordre réaction",
    "loi d'Arrhenius", "énergie d'activation", "catalyseur", "catalyse",

    // 🔹 Chimie — Thermodynamique Chimique (Module 04)
    "thermochimie", "enthalpie de réaction", "énergie libre de Gibbs",
    "équilibre chimique", "constante d'équilibre", "loi de Van't Hoff",
    "principe de Le Chatelier", "loi de Hess",

    // 🔹 Chimie — Solutions Aqueuses & Électrochimie (Module 05)
    "chimie des solutions", "solutions aqueuses", "électrochimie",
    "pH calcul", "acide base", "Brönsted", "Ka Kb Ke pKa",
    "dosage titrage", "solution tampon", "indicateur coloré",
    "solubilité", "produit de solubilité Ks", "précipitation",
    "oxydo-réduction", "potentiel redox", "Nernst", "ESH",
    "pile électrochimique", "pile Daniell", "FEM", "électrolyse", "Faraday",
    "accumulateur", "pile à combustible",

    // 🔹 Arabe
    "الميكانيك", "الحرارة الثرموديناميك", "الضوء والأمواج", "الكهرباء والإلكترونيك",
    "الفيزياء الكمية والذرية", "الذرة والروابط الكيميائية", "الكيمياء العضوية",
    "السينيتيك الكيميائي", "الثرموديناميك الكيميائي", "المحاليل المائية والكيمياء الكهربائية",
    "دروس الفيزياء", "دروس الكيمياء", "درجة الحموضة pH", "الأكسدة والاختزال",

    // 🔹 Anglais
    "physics courses Morocco", "chemistry courses Morocco",
    "RC circuit", "RL circuit", "RLC circuit", "thermodynamics",
    "quantum physics", "optics waves", "electrochemistry",
    "Nernst equation", "Daniell cell", "electrolysis",
  ],
  authors: [{ name: "Rida Sersif", url: SITE_URL }],
  creator: "Rida Sersif",
  publisher: "Sersif Académie",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "fr": SITE_URL,
      "ar": SITE_URL,
      "en": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Sersif Académie",
    title: "Sersif Académie | Physique & Chimie — Concours Enseignement Maroc",
    description:
      "Plateforme éducative de Rida Sersif — Cours complets en Physique (RC, RL, RLC, mécanique, électromagnétisme...) et Chimie (pH, Nernst, piles, électrolyse...) pour la préparation au concours de l'enseignement au Maroc.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Sersif Académie — Physique & Chimie",
      },
    ],
    locale: "fr_MA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sersif Académie | Physique & Chimie — Concours Enseignement Maroc",
    description:
      "Plateforme éducative de Rida Sersif — Cours RC, RL, RLC, mécanique, électromagnétisme, chimie des solutions, pH, Nernst, piles pour le concours enseignement Maroc.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@RidaSersif",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "education",
};

// ── JSON-LD Structured Data (Schema.org) — Helps Google understand the site ──
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sersif Académie",
      alternateName: ["Sersif Academy", "سرسيف الأكاديمية"],
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description:
        "Plateforme éducative spécialisée en Physique et Chimie pour la préparation au concours de recrutement des enseignants au Maroc, créée par Rida Sersif.",
      founder: {
        "@type": "Person",
        name: "Rida Sersif",
        jobTitle: "Enseignant & Créateur de contenu éducatif",
        url: SITE_URL,
      },
      knowsAbout: [
        "Physique", "Chimie", "Mécanique", "Électrostatique", "Électromagnétisme",
        "Circuit RC", "Circuit RL", "Circuit RLC", "Régimes transitoires",
        "Lois de Kirchhoff", "Théorème de Thévenin", "Théorème de Norton",
        "Impédances complexes", "Résonance", "Électrocinétique",
        "pH", "Acide-Base", "Oxydo-réduction", "Nernst", "Pile Daniell",
        "Électrolyse", "Solutions aqueuses",
      ],
      inLanguage: ["fr", "ar", "en"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Sersif Académie",
      description: "Cours de Physique et Chimie pour le concours de l'enseignement au Maroc — par Rida Sersif",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "fr",
    },
    {
      "@type": "Course",
      name: "Circuit RC — Régimes Transitoires",
      description: "Étude complète du circuit RC : charge, décharge, constante de temps τ, continuité de u_C.",
      provider: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/cours/electricite/electronique-de-base/etude?chap=1`,
      inLanguage: "fr",
    },
    {
      "@type": "Course",
      name: "Circuit RL — Régimes Transitoires",
      description: "Étude complète du circuit RL : établissement et rupture du courant, diode de roue libre.",
      provider: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/cours/electricite/electronique-de-base/etude?chap=2`,
      inLanguage: "fr",
    },
    {
      "@type": "Course",
      name: "Circuit RLC Série — Régimes Transitoires & Oscillations",
      description: "Résolution complète du circuit RLC série : 3 régimes d'amortissement, pseudo-période, bilan énergétique.",
      provider: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/cours/electricite/electronique-de-base/etude?chap=3`,
      inLanguage: "fr",
    },
    {
      "@type": "Course",
      name: "Lois de Kirchhoff, Thévenin & Norton",
      description: "Lois des nœuds et des mailles, ponts diviseurs, théorèmes de Thévenin, Norton et superposition.",
      provider: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/cours/electricite/electronique-de-base/etude`,
      inLanguage: "fr",
    },
    {
      "@type": "Course",
      name: "Chimie des Solutions Aqueuses & Électrochimie",
      description: "pH, acide-base, oxydo-réduction, formule de Nernst, pile Daniell, électrolyse, loi de Faraday.",
      provider: { "@id": `${SITE_URL}/#organization` },
      url: `${SITE_URL}/cours/chimie-des-solutions-aqueuses-et-electrochimie/solutions-aqueuses-et-electrochimie`,
      inLanguage: "fr",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AudioProvider>
            {children}
            <MobileWarningToast />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
