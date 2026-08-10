/**
 * TEST SUITE 5: Routing and Data Integrity
 * Verifies that all course IDs referenced in chapters/index match
 * COURSES_DATA sub-modules (no broken links).
 */
import { COURSES_DATA } from "@/data/courses";

describe("Cohérence des IDs — Routing et Navigation", () => {
  it("le sous-module 'electromagnetisme-dans-le-vide' doit être dans COURSES_DATA", () => {
    const elec = COURSES_DATA["electricite"];
    const found = elec.subModules?.find(
      (s) => s.id === "electromagnetisme-dans-le-vide"
    );
    expect(found).toBeDefined();
  });

  it("le sous-module 'mecanique-du-point' doit être dans COURSES_DATA", () => {
    const mec = COURSES_DATA["mecanique-du-point-et-du-solide"];
    const found = mec.subModules?.find((s) => s.id === "mecanique-du-point");
    expect(found).toBeDefined();
  });

  it("chaque sous-module dans COURSES_DATA doit avoir une image définie", () => {
    Object.values(COURSES_DATA).forEach((module) => {
      if (module.subModules) {
        module.subModules.forEach((sub) => {
          expect(sub.image).toBeTruthy();
          expect(sub.image.startsWith("/")).toBe(true);
        });
      }
    });
  });

  it("les IDs dans les sous-modules doivent être en kebab-case (sans espaces)", () => {
    Object.values(COURSES_DATA).forEach((module) => {
      if (module.subModules) {
        module.subModules.forEach((sub) => {
          expect(sub.id).not.toContain(" ");
          expect(sub.id).toMatch(/^[a-z0-9-]+$/);
        });
      }
    });
  });

  it("les éléments du syllabus doivent avoir un id et un titre non vides", () => {
    Object.values(COURSES_DATA).forEach((module) => {
      if (module.subModules) {
        module.subModules.forEach((sub) => {
          sub.elements.forEach((el) => {
            expect(el.id).toBeTruthy();
            expect(el.title).toBeTruthy();
            expect(el.details).toBeTruthy();
          });
        });
      }
    });
  });
});

describe("Pages Critiques — IDs de routes valides", () => {
  const criticalRoutes = [
    { moduleId: "electricite", subModuleId: "electromagnetisme-dans-le-vide" },
    { moduleId: "electricite", subModuleId: "electrostatique" },
    { moduleId: "mecanique-du-point-et-du-solide", subModuleId: "mecanique-du-point" },
  ];

  criticalRoutes.forEach(({ moduleId, subModuleId }) => {
    it(`la route /cours/${moduleId}/${subModuleId} doit être résoluble`, () => {
      const module = COURSES_DATA[moduleId];
      expect(module).toBeDefined();
      const sub = module?.subModules?.find((s) => s.id === subModuleId);
      expect(sub).toBeDefined();
    });
  });
});
