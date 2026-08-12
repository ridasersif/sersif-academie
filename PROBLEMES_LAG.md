# 🚨 Rapport : Les Causes Principales du Lag et de la Lenteur de l'Application

Ce fichier liste **tous les problèmes identifiés** qui rendent ton projet `sersif-academie` très lourd, qui font que les formes 3D mettent du temps à apparaître, et qui provoquent des bugs/crashs. 

> *Note : Aucune ligne de code n'a été modifiée. Ce rapport est là pour qu'on puisse corriger ces problèmes un par un plus tard.*

---

## 1. 🛑 Trop de contextes WebGL simultanés (La cause n°1)
**Où ça se trouve :** Dans `chap2-lois-fondamentales.tsx` (et autres fichiers de chapitres).
- **L'explication :** Tu as placé plus de 10 composants `<Canvas>` de React Three Fiber sur la même page. Chaque fois que tu mets un `<Canvas>`, le navigateur crée un "WebGL Context". 
- **Le problème :** Les navigateurs (Chrome, Safari, etc.) bloquent le nombre de contextes entre **8 et 16 maximum**. Si tu dépasses cette limite, le navigateur panique, supprime les plus anciens, ou crashe complètement. C'est pour ça que les formes "disparaissent" ou s'affichent très mal.

## 2. ⏳ Chargement Statique Bloquant (Pas de Lazy Loading)
**Où ça se trouve :** Les `import` en haut des fichiers de chapitres.
- **L'explication :** Les composants 3D sont importés normalement (`import BiotSavart3DCanvas from ...`).
- **Le problème :** Au moment où l'utilisateur ouvre la page, le navigateur télécharge TOUT le code JavaScript des 17 simulateurs 3D d'un coup. Ça gèle complètement la page (blocage du *Main Thread*). L'application reste bloquée pendant plusieurs secondes avant que l'utilisateur puisse faire quoi que ce soit.

## 3. 💥 Effets Spéciaux Gourmands (Bloom Effect)
**Où ça se trouve :** Dans 14 de tes 17 simulateurs 3D (ex: `AmpereTheorem3DCanvas.tsx`).
- **L'explication :** Tu utilises `EffectComposer` et `Bloom` pour rendre les objets lumineux. 
- **Le problème :** L'effet Bloom oblige la carte graphique (GPU) à calculer et dessiner toute la scène **deux fois par image**. Sur un téléphone ou un petit PC, ça fait exploser le processeur à 100% et fait ramer toute l'application.

## 4. 🔲 Formes 3D trop complexes (High-poly)
**Où ça se trouve :** Dans `DriftVelocity3DCanvas.tsx`, `CurrentDensity3DCanvas.tsx`, etc.
- **L'explication :** Tu as créé des sphères et des cylindres avec beaucoup de détails (`sphereGeometry` avec 16x16 segments).
- **Le problème :** Une sphère 16x16 contient 256 triangles. Quand tu mets 100 électrons, la carte graphique doit calculer **25 000 triangles** pour des points minuscules qui font 2 pixels à l'écran. C'est une surcharge inutile.

## 5. 📱 Résolution non limitée (DPR)
**Où ça se trouve :** Presque tous les composants 3D.
- **L'explication :** Les écrans modernes (MacBook Retina, iPhone) ont une densité de pixels très élevée (x2, x3).
- **Le problème :** Ton `<Canvas>` essaie de dessiner le 3D avec la même résolution gigantesque. Ça quadruple la quantité de pixels à calculer. La carte graphique chauffe très vite, causant des lenteurs énormes sur mobile.

## 6. 🧠 Fuites de Mémoire (Memory Leaks)
**Où ça se trouve :** Surtout dans les simulateurs natifs comme `ThreeDCoordinateCanvas.tsx`.
- **L'explication :** Quand l'utilisateur quitte la page ou ferme le composant 3D, tu fais `renderer.dispose()`.
- **Le problème :** C'est insuffisant ! Les géométries et les matériaux restent bloqués dans la RAM de la carte graphique (VRAM). À force de naviguer dans l'appli, la mémoire se remplit jusqu'à ce que le navigateur crashe (Out of Memory). Il manque des `geometry.dispose()` et `material.dispose()`.

---

## 🎯 Plan d'action (Pour plus tard)
Quand tu seras prêt à commencer la réparation, voici les étapes qu'on fera ensemble :
1. **Implémenter le Lazy Loading** pour que les Canvas 3D ne se chargent QUE quand on scroll dessus.
2. **Utiliser des "Dynamic Imports"** de Next.js pour accélérer le premier chargement de la page.
3. **Optimiser ou désactiver le Bloom** sur mobile.
4. **Réduire le nombre de triangles** des sphères et limiter le `dpr` du Canvas.
5. **Vider correctement la mémoire** quand un composant disparaît.

*Fin du rapport.*
