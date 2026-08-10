/**
 * TEST SUITE 3: etude/page.tsx — Chapter Navigation Logic
 * Tests the pure logic functions used in the study page.
 */

// We test the logic of getInitialChapterIndex by simulating localStorage
// and URLSearchParams since this is a pure JS function.

// Extracted logic for testing (mirrors the function in etude/page.tsx)
function getInitialChapterIndex(
  subModuleId: string,
  totalChapters: number,
  mockSearch?: string,
  mockStorage?: Record<string, string>
): number {
  if (totalChapters === 0) return 0;

  // 1. URL search parameter ?chap=X (1-indexed)
  if (mockSearch) {
    const params = new URLSearchParams(mockSearch);
    const chapParam = params.get("chap");
    if (chapParam !== null) {
      const parsed = parseInt(chapParam, 10) - 1;
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalChapters) {
        return parsed;
      }
    }
  }

  // 2. localStorage persistence
  if (mockStorage) {
    const saved = mockStorage[`sersif_active_chap_${subModuleId}`];
    if (saved !== undefined) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < totalChapters) {
        return parsed;
      }
    }
  }

  return 0;
}

describe("getInitialChapterIndex — Logique de navigation", () => {
  it("doit retourner 0 par défaut quand rien n'est sauvegardé", () => {
    const result = getInitialChapterIndex("test-module", 5);
    expect(result).toBe(0);
  });

  it("doit lire le paramètre URL ?chap= correctement", () => {
    const result = getInitialChapterIndex("test-module", 5, "chap=3");
    expect(result).toBe(2); // 1-indexed → 0-indexed
  });

  it("doit ignorer ?chap= si la valeur est hors-limites (négatif)", () => {
    const result = getInitialChapterIndex("test-module", 5, "chap=-1");
    expect(result).toBe(0);
  });

  it("doit ignorer ?chap= si la valeur dépasse le total", () => {
    const result = getInitialChapterIndex("test-module", 3, "chap=99");
    expect(result).toBe(0);
  });

  it("doit lire le localStorage correctement", () => {
    const result = getInitialChapterIndex(
      "electromagnetisme-dans-le-vide",
      6,
      undefined,
      { "sersif_active_chap_electromagnetisme-dans-le-vide": "4" }
    );
    expect(result).toBe(4);
  });

  it("URL doit avoir priorité sur localStorage", () => {
    const result = getInitialChapterIndex(
      "electromagnetisme-dans-le-vide",
      6,
      "chap=2",
      { "sersif_active_chap_electromagnetisme-dans-le-vide": "5" }
    );
    expect(result).toBe(1); // URL wins (chap=2 → index 1)
  });

  it("doit retourner 0 si totalChapters est 0", () => {
    const result = getInitialChapterIndex("test", 0, "chap=1");
    expect(result).toBe(0);
  });

  it("doit gérer les valeurs NaN dans localStorage", () => {
    const result = getInitialChapterIndex(
      "test-module",
      5,
      undefined,
      { "sersif_active_chap_test-module": "invalid_string" }
    );
    expect(result).toBe(0);
  });
});

describe("Logique de handleChapterChange", () => {
  // Simulate the boundary behavior
  it("ne doit pas dépasser l'index maximum", () => {
    const totalChapters = 6;
    const handleChapterChange = (newIndex: number, current: number) => {
      if (newIndex < 0 || newIndex >= totalChapters) return current;
      return newIndex;
    };

    expect(handleChapterChange(10, 5)).toBe(5); // Out of bounds → stays
    expect(handleChapterChange(-1, 3)).toBe(3); // Negative → stays
    expect(handleChapterChange(5, 3)).toBe(5); // Valid last index → accepted
    expect(handleChapterChange(0, 3)).toBe(0); // First index → accepted
  });

  it("les boutons Précédent/Suivant doivent rester dans [0, length-1]", () => {
    const chapters = Array(6).fill(null);
    const clamp = (v: number) => Math.max(0, Math.min(chapters.length - 1, v));

    expect(clamp(-1)).toBe(0);            // Previous from first → stays at 0
    expect(clamp(6)).toBe(5);             // Next from last → stays at 5
    expect(clamp(3)).toBe(3);             // Normal → unchanged
  });
});
