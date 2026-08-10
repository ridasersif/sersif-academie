/**
 * TEST SUITE 2: chapters/index.ts — Chapters Registry
 * Tests that the chapter registry is correctly structured and all
 * active chapters have a real component.
 * 
 * NOTE: We mock the chapter component imports to avoid @react-three/postprocessing ESM issues.
 * The important thing is to check the STRUCTURE of the registry.
 */
import { MECANIQUE_DU_POINT_CHAPTERS } from "@/modules/physique/mecanique-du-point-et-du-solide/mecanique-du-point/chapters";

// We test ELECTROMAGNETISME_VIDE_CHAPTERS inline (imported from module)
// but mock the heavy components to avoid ESM errors from postprocessing
jest.mock("@/modules/physique/electricite/electromagnetisme-dans-le-vide/chapters/chap1-courants-champ", () => ({
  __esModule: true,
  default: function MockChap1() { return null; }
}));
jest.mock("@/modules/physique/electricite/electromagnetisme-dans-le-vide/chapters/chap2-lois-fondamentales", () => ({
  __esModule: true,
  default: function MockChap2() { return null; }
}));

import { ELECTROMAGNETISME_VIDE_CHAPTERS } from "@/modules/physique/electricite/electromagnetisme-dans-le-vide/chapters";

describe("ELECTROMAGNETISME_VIDE_CHAPTERS — Registre des chapitres", () => {
  it("doit être un tableau non vide", () => {
    expect(Array.isArray(ELECTROMAGNETISME_VIDE_CHAPTERS)).toBe(true);
    expect(ELECTROMAGNETISME_VIDE_CHAPTERS.length).toBeGreaterThan(0);
  });

  it("chaque chapitre doit avoir id, num, title, subtitle", () => {
    ELECTROMAGNETISME_VIDE_CHAPTERS.forEach((chap) => {
      expect(chap).toHaveProperty("id");
      expect(chap).toHaveProperty("num");
      expect(chap).toHaveProperty("title");
      expect(chap).toHaveProperty("subtitle");
    });
  });

  it("les num doit être des chaînes à 2 chiffres ('01', '02', ...)", () => {
    ELECTROMAGNETISME_VIDE_CHAPTERS.forEach((chap) => {
      expect(chap.num).toMatch(/^\d{2}$/);
    });
  });

  it("Chapitre 01 (Courants et Champ) doit avoir un composant actif", () => {
    const chap1 = ELECTROMAGNETISME_VIDE_CHAPTERS.find((c) => c.num === "01");
    expect(chap1).toBeDefined();
    expect(chap1!.component).not.toBeNull();
    expect(typeof chap1!.component).toBe("function");
  });

  it("Chapitre 02 (Lois Fondamentales) doit avoir un composant actif", () => {
    const chap2 = ELECTROMAGNETISME_VIDE_CHAPTERS.find((c) => c.num === "02");
    expect(chap2).toBeDefined();
    expect(chap2!.component).not.toBeNull();
    expect(typeof chap2!.component).toBe("function");
  });

  it("aucun id de chapitre ne doit être dupliqué", () => {
    const ids = ELECTROMAGNETISME_VIDE_CHAPTERS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("MECANIQUE_DU_POINT_CHAPTERS — Registre des chapitres", () => {
  it("doit contenir au moins 2 chapitres actifs", () => {
    const active = MECANIQUE_DU_POINT_CHAPTERS.filter(
      (c) => c.component !== null
    );
    expect(active.length).toBeGreaterThanOrEqual(2);
  });

  it("Chapitre 01 (Rappels Math) doit avoir un composant actif", () => {
    const chap1 = MECANIQUE_DU_POINT_CHAPTERS.find((c) => c.num === "01");
    expect(chap1!.component).not.toBeNull();
    expect(typeof chap1!.component).toBe("function");
  });

  it("Chapitre 02 (Cinématique) doit avoir un composant actif", () => {
    const chap2 = MECANIQUE_DU_POINT_CHAPTERS.find((c) => c.num === "02");
    expect(chap2!.component).not.toBeNull();
    expect(typeof chap2!.component).toBe("function");
  });
});
