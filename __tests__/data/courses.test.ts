/**
 * TEST SUITE 1: courses.ts — Data Integrity
 * Tests all COURSES_DATA entries for structural validity.
 */
import { COURSES_DATA } from "@/data/courses";

describe("COURSES_DATA — Structure et intégrité", () => {
  it("doit exporter un objet non vide", () => {
    expect(COURSES_DATA).toBeDefined();
    expect(typeof COURSES_DATA).toBe("object");
    expect(Object.keys(COURSES_DATA).length).toBeGreaterThan(0);
  });

  it("chaque module doit avoir les champs obligatoires", () => {
    Object.values(COURSES_DATA).forEach((module) => {
      expect(module).toHaveProperty("id");
      expect(module).toHaveProperty("code");
      expect(module).toHaveProperty("title");
      expect(module).toHaveProperty("subject");
      expect(module.subject).toMatch(/^(physique|chimie)$/);
    });
  });

  it("le module 'electricite' doit exister avec ses sous-modules", () => {
    const elec = COURSES_DATA["electricite"];
    expect(elec).toBeDefined();
    expect(elec.subModules).toBeDefined();
    expect(elec.subModules!.length).toBeGreaterThan(0);
  });

  it("chaque sous-module doit avoir un id, un titre et des éléments", () => {
    Object.values(COURSES_DATA).forEach((module) => {
      if (module.subModules) {
        module.subModules.forEach((sub) => {
          expect(sub).toHaveProperty("id");
          expect(sub.id).toBeTruthy();
          expect(sub).toHaveProperty("title");
          expect(sub.title).toBeTruthy();
          expect(sub).toHaveProperty("elements");
          expect(Array.isArray(sub.elements)).toBe(true);
        });
      }
    });
  });

  it("le sous-module 'electromagnetisme-dans-le-vide' doit exister", () => {
    const elec = COURSES_DATA["electricite"];
    const emVide = elec.subModules?.find(
      (s) => s.id === "electromagnetisme-dans-le-vide"
    );
    expect(emVide).toBeDefined();
    expect(emVide!.elements.length).toBeGreaterThan(0);
  });

  it("aucun id de sous-module ne doit être dupliqué", () => {
    Object.values(COURSES_DATA).forEach((module) => {
      if (module.subModules) {
        const ids = module.subModules.map((s) => s.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      }
    });
  });
});
