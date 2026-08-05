export interface SyllabusElement {
  id: string;
  title: string;
  details: string;
}

export interface SubModule {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  description: string;
  elements: SyllabusElement[];
}

export interface CourseModule {
  id: string;
  code: string;
  title: string;
  subject: "physique" | "chimie";
  image: string;
  description: string;
  subModules?: SubModule[];
}

export const COURSES_DATA: Record<string, CourseModule> = {
  "mecanique-du-point-et-du-solide": {
    id: "mecanique-du-point-et-du-solide",
    code: "Module 01",
    title: "Mécanique du point et du solide",
    subject: "physique",
    image: "/modules/mecanique_v2.png",
    description: "Cinématique du point, dynamique newtonienne, oscillations, mécanique du solide parfait et théorèmes généraux.",
    subModules: [
      {
        id: "mecanique-du-point",
        code: "Partie 01",
        title: "Mécanique du Point",
        subtitle: "Point matériel & systèmes oscillants",
        image: "/modules/mecanique_point.png",
        badge: "1er Volet",
        description: "Étude complète du mouvement du point matériel, systèmes de coordonnées, oscillateurs et forces centrales.",
        elements: [
          {
            id: "coord",
            title: "Systèmes de Coordonnées",
            details: "Coordonnées cartésiennes, cylindriques et sphériques. Cinématique et dynamique du point matériel."
          },
          {
            id: "energie",
            title: "Travail et Énergie",
            details: "Théorème de l'énergie cinétique (T.E.C.), forces conservatives et champ de pesanteur."
          },
          {
            id: "oscillateurs",
            title: "Oscillateurs Harmoniques",
            details: "Frottement visqueux, régime libre, régime sinusoïdal forcé et phénomènes de résonance."
          },
          {
            id: "centrales",
            title: "Forces Centrales & Chocs",
            details: "Mouvement des planètes et satellites, vitesses cosmiques, chocs élastiques et inélastiques."
          }
        ]
      },
      {
        id: "mecanique-du-solide",
        code: "Partie 02",
        title: "Mécanique du Solide",
        subtitle: "Solide parfait & cinématique 3D",
        image: "/modules/mecanique_solide.png",
        badge: "2ème Volet",
        description: "Cinématique et dynamique du solide indeformable, moments d'inertie, PFD et liaisons mécaniques.",
        elements: [
          {
            id: "cinematique-solide",
            title: "Cinématique du Solide",
            details: "Champ des vitesses (équiprojectivité), champ des accélérations, translation, rotation fixe et angles d'Euler."
          },
          {
            id: "cinetique-solide",
            title: "Cinétique et Dynamique",
            details: "Centre de masse, moments d'inertie, Théorème de Huygens, matrice d'inertie et Théorème de Koenig."
          },
          {
            id: "pfd-solide",
            title: "Théorèmes Généraux (PFD)",
            details: "Référentiels non-galiléens, puissance cinétique, lois de Coulomb et liaisons mécaniques parfaites."
          }
        ]
      }
    ]
  }
};
