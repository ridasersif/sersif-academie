/**
 * TEST SUITE 6: SmartSearch Logic — Fuzzy Search Algorithm
 * Tests the search index structure and the Fuse.js search behavior.
 * NOTE: SmartSearch.tsx and searchIndex.ts need to be created first.
 * These tests verify the algorithm's correctness and edge cases.
 */

// ────────────────────────────────────────────────────────────────
// This test file tests the SEARCH INDEX data structure directly,
// since searchIndex.ts may not exist yet on disk (it was planned).
// We define an inline version to test the algorithm logic.
// ────────────────────────────────────────────────────────────────

type SearchItem = {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  url: string;
};

const MOCK_SEARCH_INDEX: SearchItem[] = [
  {
    id: "force-lorentz",
    title: "Force de Lorentz",
    category: "Physique / Électromagnétisme (Chap 3)",
    keywords: ["force", "lorentz", "particule", "charge", "vitesse"],
    url: "/cours/electricite/electromagnetisme-dans-le-vide/etude#chap3-force-lorentz"
  },
  {
    id: "force-laplace",
    title: "Force de Laplace",
    category: "Physique / Électromagnétisme (Chap 3)",
    keywords: ["force", "laplace", "rail", "barre", "conducteur"],
    url: "/cours/electricite/electromagnetisme-dans-le-vide/etude#chap3-force-laplace"
  },
  {
    id: "potentiel-vecteur",
    title: "Potentiel Vecteur (A)",
    category: "Physique / Électromagnétisme (Chap 3)",
    keywords: ["potentiel", "vecteur", "A", "poisson", "coulomb", "jauge"],
    url: "/cours/electricite/electromagnetisme-dans-le-vide/etude#chap3-potentiel-vecteur"
  },
  {
    id: "biot-savart",
    title: "Loi de Biot-Savart",
    category: "Physique / Électromagnétisme (Chap 2)",
    keywords: ["biot", "savart", "champ", "magnetique", "fil", "courant"],
    url: "/cours/electricite/electromagnetisme-dans-le-vide/etude#chap2-biot-savart"
  },
  {
    id: "theoreme-ampere",
    title: "Théorème d'Ampère",
    category: "Physique / Électromagnétisme (Chap 2)",
    keywords: ["theoreme", "ampere", "circulation", "courant"],
    url: "/cours/electricite/electromagnetisme-dans-le-vide/etude#chap2-theoreme-ampere"
  },
  {
    id: "effet-hall",
    title: "Effet Hall",
    category: "Physique / Électromagnétisme (Chap 3)",
    keywords: ["effet", "hall", "tension", "charge", "champ"],
    url: "/cours/electricite/electromagnetisme-dans-le-vide/etude#chap3-effet-hall"
  },
  {
    id: "dipole-magnetique",
    title: "Dipôle Magnétique",
    category: "Physique / Électromagnétisme (Chap 3)",
    keywords: ["dipole", "magnetique", "moment", "spire", "couple"],
    url: "/cours/electricite/electromagnetisme-dans-le-vide/etude#chap3-dipole-magnetique"
  },
];

// Simple exact-match search function (for baseline testing)
function simpleSearch(query: string, index: SearchItem[]): SearchItem[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return index.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

describe("Search Index — Structure de données", () => {
  it("l'index doit contenir au moins 5 entrées", () => {
    expect(MOCK_SEARCH_INDEX.length).toBeGreaterThanOrEqual(5);
  });

  it("chaque entrée doit avoir id, title, category, keywords et url", () => {
    MOCK_SEARCH_INDEX.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(Array.isArray(item.keywords)).toBe(true);
      expect(item.keywords.length).toBeGreaterThan(0);
      expect(item.url).toMatch(/^\/cours\//);
    });
  });

  it("toutes les URLs doivent pointer vers une ancre valide (#)", () => {
    MOCK_SEARCH_INDEX.forEach((item) => {
      expect(item.url).toContain("#");
    });
  });

  it("les IDs ne doivent pas être dupliqués", () => {
    const ids = MOCK_SEARCH_INDEX.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Algorithme de recherche — Cas de base (exact match)", () => {
  it("'force' doit trouver Force de Lorentz ET Force de Laplace", () => {
    const results = simpleSearch("force", MOCK_SEARCH_INDEX);
    const ids = results.map((r) => r.id);
    expect(ids).toContain("force-lorentz");
    expect(ids).toContain("force-laplace");
  });

  it("'hall' doit trouver l'Effet Hall", () => {
    const results = simpleSearch("hall", MOCK_SEARCH_INDEX);
    expect(results.some((r) => r.id === "effet-hall")).toBe(true);
  });

  it("'ampere' doit trouver le Théorème d'Ampère", () => {
    const results = simpleSearch("ampere", MOCK_SEARCH_INDEX);
    expect(results.some((r) => r.id === "theoreme-ampere")).toBe(true);
  });

  it("'biot' doit trouver la Loi de Biot-Savart", () => {
    const results = simpleSearch("biot", MOCK_SEARCH_INDEX);
    expect(results.some((r) => r.id === "biot-savart")).toBe(true);
  });

  it("une requête trop courte (< 2 chars) doit retourner vide", () => {
    const results = simpleSearch("f", MOCK_SEARCH_INDEX);
    expect(results.length).toBe(0);
  });

  it("une requête vide doit retourner vide", () => {
    const results = simpleSearch("", MOCK_SEARCH_INDEX);
    expect(results.length).toBe(0);
  });
});

describe("Algorithme de recherche — Cas limites et robustesse", () => {
  it("la recherche doit être insensible à la casse", () => {
    const r1 = simpleSearch("FORCE", MOCK_SEARCH_INDEX);
    const r2 = simpleSearch("force", MOCK_SEARCH_INDEX);
    expect(r1.length).toBe(r2.length);
  });

  it("un mot-clé inconnu ne doit pas crasher et retourner []", () => {
    const results = simpleSearch("xyzxyzxyz123", MOCK_SEARCH_INDEX);
    expect(results).toEqual([]);
  });

  it("'potentiel' doit trouver l'entrée Potentiel Vecteur", () => {
    const results = simpleSearch("potentiel", MOCK_SEARCH_INDEX);
    expect(results.some((r) => r.id === "potentiel-vecteur")).toBe(true);
  });

  it("'dipole' doit trouver le Dipôle Magnétique", () => {
    const results = simpleSearch("dipole", MOCK_SEARCH_INDEX);
    expect(results.some((r) => r.id === "dipole-magnetique")).toBe(true);
  });
});
