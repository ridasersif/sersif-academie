import type { Metadata } from "next";
import { COURSES_DATA } from "@/data/courses";

const SITE_URL = "https://sersif-academie.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = COURSES_DATA[moduleId];

  if (!mod) {
    return {
      title: "Module | Sersif Académie",
      description: "Cours de Physique et Chimie — Sersif Académie par Rida Sersif.",
    };
  }

  return {
    title: `${mod.title} — ${mod.subject === "physique" ? "Physique" : "Chimie"}`,
    description:
      `${mod.description} — Cours complet par Rida Sersif sur Sersif Académie, plateforme de préparation au concours de recrutement des enseignants en Physique et Chimie au Maroc.`,
    keywords: [
      mod.title,
      "Sersif Académie",
      "Rida Sersif",
      "concours enseignement Maroc",
      mod.subject === "physique"
        ? "physique concours Maroc"
        : "chimie concours Maroc",
      ...(mod.subModules?.map((s) => s.title) ?? []),
    ],
    authors: [{ name: "Rida Sersif", url: SITE_URL }],
    openGraph: {
      title: `${mod.title} | Sersif Académie`,
      description: mod.description,
      url: `${SITE_URL}/cours/${moduleId}`,
      siteName: "Sersif Académie",
      type: "website",
    },
    alternates: {
      canonical: `${SITE_URL}/cours/${moduleId}`,
    },
  };
}

export default function ModuleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
