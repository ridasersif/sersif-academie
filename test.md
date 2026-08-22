# 🧪 Plan de Tests de Performance et de Charge (Load Testing)

L'objectif de ce document est de définir les tests nécessaires pour s'assurer que **Sersif Académie** peut supporter la connexion de **milliers d'étudiants simultanément** ("allaaaf tolab khtra wahd") sans aucun crash ou ralentissement, et que le navigateur du client ne plante pas avec la 3D.

> [!WARNING]
> Ces tests sont à exécuter par vos soins (ou avec des outils spécialisés), ils ne sont pas automatisés ici afin de ne pas saturer votre ordinateur de développement.

---

## 1. Tests de Charge et de Tolérance (Server & Network)
Ces tests vérifient si le serveur (Next.js / Node.js) peut encaisser un trafic massif.

- [ ] **Test de Charge (Load Testing) :**
  - **Outils recommandés :** Apache JMeter, k6, ou Locust.
  - **Scénario :** Simuler 5 000 utilisateurs se connectant en même temps et naviguant sur les pages de cours (requêtes HTTP GET).
  - **Objectif :** Vérifier que le temps de réponse reste inférieur à 2 secondes et que le serveur ne renvoie pas d'erreurs `502 Bad Gateway` ou `503 Service Unavailable`.

- [ ] **Test de Pointe (Spike Testing) :**
  - **Scénario :** Simuler une augmentation brutale du trafic (ex: 10 000 utilisateurs se connectant dans la même seconde lors de l'annonce d'un examen).
  - **Objectif :** Vérifier que l'application ne s'effondre pas (Crash) et qu'elle récupère rapidement son fonctionnement normal après le pic.

- [ ] **Test de Bande Passante (CDN & Static Assets) :**
  - **Scénario :** Vérifier que les gros fichiers (modèles 3D, textures, audios) sont servis par un CDN (Content Delivery Network) comme Cloudflare ou Vercel Edge Network.
  - **Objectif :** Éviter de saturer la bande passante de votre propre serveur (qui causerait un ralentissement global pour tous les étudiants).

---

## 2. Tests de Performance Client (WebGL & 3D Rendering)
Même si le serveur résiste, l'ordinateur ou le téléphone de l'étudiant peut planter si les composants 3D demandent trop de ressources.

- [ ] **Test de FPS (Frames Per Second) sur Mobile :**
  - **Scénario :** Ouvrir l'application sur un smartphone milieu/bas de gamme et naviguer dans le cours "ARQS" ou "Moteur 3D".
  - **Objectif :** Maintenir un minimum de 30 FPS. Si le téléphone chauffe excessivement ou si l'animation saccade, il faudra désactiver certaines ombres ou le post-processing (Bloom) sur mobile.

- [ ] **Test de Concurrence Canvas (Context Limit) :**
  - **Scénario :** Faire défiler très rapidement une page contenant 5 ou 10 `<Canvas>` 3D différents.
  - **Objectif :** S'assurer que le navigateur ne génère pas l'erreur `WARNING: Too many active WebGL contexts`. (Nous avons déjà activé `Lazy Loading` pour mitiger cela, ce test permet de vérifier son efficacité).

---

## 3. Tests de Fuite de Mémoire (Memory Leaks)
Si un étudiant reste sur le site pendant des heures, le navigateur peut accumuler des données jusqu'à planter.

- [ ] **Test de Navigation Intensive (Router Stress) :**
  - **Scénario :** Entrer et sortir d'un chapitre contenant des scènes 3D lourdes 50 fois de suite sans rafraîchir la page (F5).
  - **Objectif :** Ouvrir l'onglet "Performance" ou "Memory" de Google Chrome DevTools. Vérifier que la consommation de la mémoire vive (RAM) ne monte pas en flèche de manière infinie. La RAM doit redescendre (Garbage Collection) après avoir quitté une page 3D.

---

## 4. Tests Fonctionnels (Edge Cases)

- [ ] **Test de Coupure Internet (Offline Resilience) :**
  - **Scénario :** Que se passe-t-il si un étudiant perd sa connexion Internet pendant qu'il lit un cours ?
  - **Objectif :** S'assurer que la page ne plante pas de façon inattendue.

- [ ] **Test de Redimensionnement (Resize Stress) :**
  - **Scénario :** Modifier la taille de la fenêtre du navigateur frénétiquement.
  - **Objectif :** S'assurer que les Canvas 3D se redimensionnent proprement (Responsive) sans consommer 100% du CPU.
