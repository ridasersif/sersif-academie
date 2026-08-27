import { COURSES_DATA } from "@/data/courses";

const SITE_URL = "https://sersif-academie.vercel.app";

// All physics modules (including ones not yet in COURSES_DATA)
const ALL_PHYSIQUE_MODULES = [
  "mecanique-du-point-et-du-solide",
  "thermodynamique",
  "optique-et-ondes",
  "electricite",
  "physique-quantique-atomique-et-nucleaire",
];

// All chemistry modules
const ALL_CHIMIE_MODULES = [
  "atomistique-liaisons-chimiques-et-cristallographie",
  "chimie-organique-et-methodes-physicochimiques",
  "cinetique-chimique-et-catalyse",
  "thermodynamique-chimique-et-equilibres-chimiques",
  "chimie-des-solutions-aqueuses-et-electrochimie",
];

export default function sitemap() {
  const staticPages = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${SITE_URL}/physique`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.95 },
    { url: `${SITE_URL}/chimie`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.95 },
  ];

  // Module-level pages for physique
  const physModulePages = ALL_PHYSIQUE_MODULES.map((id) => ({
    url: `${SITE_URL}/cours/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Module-level pages for chimie
  const chimModulePages = ALL_CHIMIE_MODULES.map((id) => ({
    url: `${SITE_URL}/cours/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Detailed submodule & study pages from COURSES_DATA
  const coursePages = Object.values(COURSES_DATA).flatMap((mod) =>
    (mod.subModules ?? []).flatMap((sub) => [
      {
        url: `${SITE_URL}/cours/${mod.id}/${sub.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/cours/${mod.id}/${sub.id}/etude`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.95,
      },
    ])
  );

  return [...staticPages, ...physModulePages, ...chimModulePages, ...coursePages];
}
