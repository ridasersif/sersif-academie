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
  },
  "electricite": {
    id: "electricite",
    code: "Module 04",
    title: "Électricité",
    subject: "physique",
    image: "/modules/electromagnetisme_v2.png",
    description: "Électrostatique, électromagnétisme dans le vide, électromagnétisme dans la matière et électronique.",
    subModules: [
      {
        id: "electrostatique",
        code: "Partie 1",
        title: "Électrostatique",
        subtitle: "Charges, champ et potentiel",
        image: "/modules/electrostatique.png",
        badge: "Partie 1",
        description: "Loi de Coulomb, théorème de Gauss, et étude de l'énergie électrostatique.",
        elements: [
          {
            id: "electrostatique-intro",
            title: "Électrostatique",
            details: "Loi de Coulomb. Champ et potentiel électrostatiques. Théorème de Gauss. Dipôle. Énergie électrostatique."
          }
        ]
      },
      {
        id: "electromagnetisme-dans-le-vide",
        code: "Partie 2",
        title: "Électromagnétisme dans le vide",
        subtitle: "Lois générales et induction",
        image: "/modules/electromagnetisme_vide.png",
        badge: "Partie 2",
        description: "Équations de Maxwell dans le vide, énergie électromagnétique, et induction électromagnétique.",
        elements: [
          {
            id: "courants-et-champ",
            title: "Courants et Champ Magnétique",
            details: "Notion de courant électrique, charges et courants macroscopiques. Loi de conservation de la charge. Notion de champ magnétostatique et propriétés de symétrie."
          },
          {
            id: "lois-fondamentales",
            title: "Lois Fondamentales",
            details: "Loi de Laplace, Loi de Biot et Savart, et Théorème d'Ampère avec ses applications de calcul de champ."
          },
          {
            id: "dipole-et-hall",
            title: "Potentiel Vecteur et Dipôle",
            details: "Potentiel vecteur, dipôle magnétostatique, champ créé et actions mécaniques subies. Effet Hall classique."
          },
          {
            id: "maxwell",
            title: "Équations de Maxwell",
            details: "Les équations de Maxwell dans le vide, formulations locales et intégrales, et implications physiques."
          },
          {
            id: "energie-em",
            title: "Énergie Électromagnétique",
            details: "Densité d'énergie électromagnétique, vecteur de Poynting et identité de Poynting (bilan énergétique)."
          },
          {
            id: "potentiels-arqs",
            title: "Potentiels et ARQS",
            details: "Potentiel scalaire et vecteur, condition de Jauge de Lorentz, potentiels retardés et Approximation des Régimes Quasi-Statiques (ARQS)."
          }
        ]
      },
      {
        id: "electromagnetisme-dans-la-matiere",
        code: "Partie 3",
        title: "Électromagnétisme dans la matière",
        subtitle: "Milieux conducteurs et diélectriques",
        image: "/modules/electromagnetisme_matiere.png",
        badge: "Partie 3",
        description: "Étude des milieux conducteurs en équilibre et des milieux diélectriques (polarisation).",
        elements: [
          {
            id: "matiere",
            title: "Milieux conducteurs et diélectriques",
            details: "Polarisation, équations de Maxwell dans la matière."
          }
        ]
      },
      {
        id: "electronique",
        code: "Partie 4",
        title: "Électronique",
        subtitle: "Circuits et composants analogiques",
        image: "/modules/electronique.png",
        badge: "Partie 4",
        description: "Analyse de réseaux, régimes variables, et composants de l'électronique analogique.",
        elements: [
          {
            id: "circuits",
            title: "Réseaux électriques et Analogique",
            details: "Lois de Kirchhoff, quadripôles, diodes et amplificateurs opérationnels."
          }
        ]
      }
    ]
  }
};
