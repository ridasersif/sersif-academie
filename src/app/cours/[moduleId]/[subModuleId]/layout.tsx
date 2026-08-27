import type { Metadata } from "next";
import { COURSES_DATA } from "@/data/courses";

const SITE_URL = "https://sersif-academie.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string; subModuleId: string }>;
}): Promise<Metadata> {
  const { moduleId, subModuleId } = await params;
  const mod = COURSES_DATA[moduleId];
  const sub = mod?.subModules?.find((s) => s.id === subModuleId);

  if (!mod || !sub) {
    return {
      title: "Cours | Sersif Académie",
      description: "Cours de Physique et Chimie — Sersif Académie par Rida Sersif.",
    };
  }

  const keywords = [
    sub.title,
    mod.title,
    "Sersif Académie",
    "Rida Sersif",
    "concours enseignement Maroc",
    ...sub.elements.map((e) => e.title),
    mod.subject === "physique"
      ? "physique prépa concours"
      : "chimie prépa concours",
    "RC", "RL", "RLC", "Kirchhoff", "Thévenin", "pH", "Nernst",
  ];

  return {
    title: `${sub.title} — ${mod.title}`,
    description:
      `${sub.description} — Cours complet par Rida Sersif sur Sersif Académie, plateforme de préparation au concours de l'enseignement en Physique et Chimie au Maroc.`,
    keywords,
    authors: [{ name: "Rida Sersif", url: SITE_URL }],
    openGraph: {
      title: `${sub.title} | Sersif Académie`,
      description: sub.description,
      url: `${SITE_URL}/cours/${moduleId}/${subModuleId}`,
      siteName: "Sersif Académie",
      type: "article",
    },
    alternates: {
      canonical: `${SITE_URL}/cours/${moduleId}/${subModuleId}`,
    },
  };
}

export default function SubModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
