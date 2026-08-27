import type { Metadata } from "next";
import { COURSES_DATA } from "@/data/courses";

const SITE_URL = "https://sersif-academie.vercel.app";

// Specific chapter SEO descriptors for high-value search terms
const CHAPTER_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  "electronique-de-base": {
    title: "Électronique de Base — RC, RL, RLC, Kirchhoff, Thévenin",
    description:
      "Cours complet d'électronique de base : circuit RC, circuit RL, circuit RLC série, régimes transitoires, lois de Kirchhoff, théorèmes de Thévenin et Norton, impédances complexes, résonance. Préparation concours enseignement Maroc — Rida Sersif.",
    keywords: [
      "circuit RC", "circuit RL", "circuit RLC", "RC", "RL", "RLC",
      "régimes transitoires", "Kirchhoff", "Thévenin", "Norton",
      "impédance complexe", "résonance", "facteur de qualité",
      "électrocinétique", "pont diviseur", "superposition",
      "Sersif Académie", "Rida Sersif", "concours enseignement Maroc",
    ],
  },
  "solutions-aqueuses-et-electrochimie": {
    title: "Chimie des Solutions Aqueuses & Électrochimie — pH, Nernst, Piles",
    description:
      "Cours complet de chimie des solutions aqueuses : calcul de pH, acide-base, Brönsted, dosages, solution tampon, précipitation, oxydo-réduction, formule de Nernst, pile Daniell, électrolyse, loi de Faraday. Préparation concours enseignement Maroc — Rida Sersif.",
    keywords: [
      "pH calcul", "acide base", "Brönsted", "solution tampon",
      "oxydo-réduction", "Nernst", "ESH", "pile Daniell", "électrolyse",
      "Faraday", "solubilité Ks", "précipitation",
      "Sersif Académie", "Rida Sersif", "concours enseignement Maroc",
    ],
  },
  "mecanique-du-point": {
    title: "Mécanique du Point — Cinématique, Dynamique, Oscillateurs",
    description:
      "Cours complet de mécanique du point matériel : cinématique (vecteurs position, vitesse, accélération), dynamique newtonienne (PFD), oscillateurs harmoniques, forces centrales. Préparation concours enseignement Maroc — Rida Sersif.",
    keywords: [
      "mécanique du point", "cinématique", "dynamique", "PFD",
      "oscillateurs harmoniques", "forces centrales",
      "Sersif Académie", "Rida Sersif",
    ],
  },
  "mecanique-du-solide": {
    title: "Mécanique du Solide — Moments d'Inertie, Huygens, PFD",
    description:
      "Cours complet de mécanique du solide : cinématique (équiprojectivité), moments d'inertie, théorème de Huygens, théorèmes généraux du mouvement. Préparation concours — Rida Sersif.",
    keywords: [
      "mécanique du solide", "moments d'inertie", "Huygens",
      "cinématique solide", "Sersif Académie",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string; subModuleId: string }>;
}): Promise<Metadata> {
  const { moduleId, subModuleId } = await params;
  const mod = COURSES_DATA[moduleId];
  const sub = mod?.subModules?.find((s) => s.id === subModuleId);

  // Use specific SEO descriptor if available
  const specific = CHAPTER_SEO[subModuleId];

  const title = specific?.title ?? `Étude — ${sub?.title ?? "Cours"} | Sersif Académie`;
  const description =
    specific?.description ??
    `${sub?.description ?? ""} — Cours complet par Rida Sersif sur Sersif Académie.`;
  const keywords = specific?.keywords ?? [
    sub?.title ?? "",
    mod?.title ?? "",
    "Sersif Académie",
    "Rida Sersif",
    "concours enseignement Maroc",
  ];

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Rida Sersif", url: SITE_URL }],
    openGraph: {
      title: `${title} | Sersif Académie`,
      description,
      url: `${SITE_URL}/cours/${moduleId}/${subModuleId}/etude`,
      siteName: "Sersif Académie",
      type: "article",
    },
    alternates: {
      canonical: `${SITE_URL}/cours/${moduleId}/${subModuleId}/etude`,
    },
  };
}

export default function EtudeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
