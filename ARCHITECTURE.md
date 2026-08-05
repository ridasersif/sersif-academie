# 🏗️ Architecture du Projet • Sersif Académie

Ce document détaille l'architecture modulaire en arbre (Tree Architecture) de la plateforme **Sersif Académie**, conçue pour accueillir de manière scalable l'ensemble des concours, modules, cours interactifs et visualisations 3D (Physique & Chimie).

---

## 📁 Structure Générale du Projet

```text
sersif-academie/
├── ARCHITECTURE.md                  # 📄 Ce document explicatif d'architecture
├── src/
│   ├── app/                         # 🚀 Routes Next.js App Router
│   │   ├── page.tsx                 # Home Page (Physique / Chimie)
│   │   ├── physique/page.tsx        # Modules de Physique
│   │   ├── chimie/page.tsx          # Modules de Chimie
│   │   └── cours/
│   │       ├── [moduleId]/          # Cartes des Sous-Modules
│   │       └── [subModuleId]/
│   │           ├── page.tsx         # Vue Programme Officiel & Checklists
│   │           └── etude/page.tsx   # Workspace Espace de Lecture 3D & Sidebar
│   │
│   ├── components/                  # 🧩 Composants Réutilisables Globaux
│   │   ├── ui/
│   │   │   └── LatexMath.tsx        # Render KaTeX pour équations LaTeX
│   │   ├── MusicPlayer.tsx          # Lecteur audio global ininterrompu
│   │   ├── ScientificBackground.tsx # Canvas animé thématique (Mécanique/Chimie)
│   │   └── theme-toggle.tsx         # Toggle Mode Sombre / Mode Clair
│   │
│   ├── data/
│   │   └── courses.ts               # Registre centralisé du programme officiel
│   │
│   └── modules/                     # 🌲 Architecture Modulaire des Cours & 3D
│       ├── physique/
│       │   └── mecanique-du-point-et-du-solide/
│       │       └── mecanique-du-point/
│       │           ├── components/
│       │           │   └── ThreeDCoordinateCanvas.tsx # Canvas 3D WebGL Three.js
│       │           └── chapters/
│       │               ├── chap1-rappels-mathematiques.tsx
│       │               ├── chap2-cinematique-du-point.tsx
│       │               ├── chap3-dynamique-du-point.tsx
│       │               ├── chap4-travail-et-energie.tsx
│       │               ├── chap5-oscillateurs-harmoniques.tsx
│       │               ├── chap6-forces-centrales.tsx
│       │               ├── chap7-chocs-et-collisions.tsx
│       │               └── index.ts # Registre exportant les chapitres du sous-module
│       │
│       └── chimie/
│           └── atomistique/
```

---

## 🛠️ Guide d'Ajout d'un Nouveau Module ou Chapitre

### 1. Ajouter un nouveau Chapitre à un Sous-Module Existant
1. Créer le fichier dans le dossier `chapters/` approprié :
   ```bash
   src/modules/physique/mecanique-du-point-et-du-solide/mecanique-du-point/chapters/chap3-dynamique-du-point.tsx
   ```
2. Développer le composant avec des formules KaTeX (`<LatexMath math="..." />`) et/ou des canvas 3D.
3. Déclarer le composant dans le fichier `index.ts` du même dossier.

### 2. Ajouter un nouveau Sous-Module ou Domaine
1. Créer le dossier correspondant dans `src/modules/[matiere]/[module]/[submodule]/`.
2. Inclure les dossiers `components/` (pour la 3D) et `chapters/` (pour les cours).

---

## ⚙️ Choix Techniques Majeurs

- **Formules Mathématiques**: Rendu vectoriel de haute précision via **KaTeX** (`katex`).
- **Simulations 3D**: Rendu dynamique interactif avec **Three.js** WebGL (caméra rotative, sliders de contrôle et fallback WebGL).
- **Navigation & Audio**: Context React global `<AudioProvider>` pour garantir la continuité de la musique d'ambiance lors de la navigation entre pages.
