/**
 * TEST SUITE 4: 3D Components — Smoke Tests
 * Verifies that all 3D canvas components render without throwing errors.
 * We use mocks for three.js and @react-three/fiber to avoid WebGL.
 */
import React from "react";
import { render, screen } from "@testing-library/react";

// We import the components that we want to smoke-test.
// They should render (even as empty divs from mocks) without throwing.
import DriftVelocity3DCanvas from "@/modules/physique/electricite/electromagnetisme-dans-le-vide/components/DriftVelocity3DCanvas";
import MagneticSources3DCanvas from "@/modules/physique/electricite/electromagnetisme-dans-le-vide/components/MagneticSources3DCanvas";
import BiotSavart3DCanvas from "@/modules/physique/electricite/electromagnetisme-dans-le-vide/components/BiotSavart3DCanvas";

// Helper to suppress console.error from the mock renders
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = args[0]?.toString() ?? "";
    if (
      msg.includes("Warning: ReactDOM.render") ||
      msg.includes("act(") ||
      msg.includes("Warning: An update")
    )
      return;
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

describe("3D Canvas Components — Smoke Tests (avec mocks WebGL)", () => {
  it("DriftVelocity3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      render(React.createElement(DriftVelocity3DCanvas));
    }).not.toThrow();
  });

  it("MagneticSources3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      render(React.createElement(MagneticSources3DCanvas));
    }).not.toThrow();
  });

  it("BiotSavart3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      render(React.createElement(BiotSavart3DCanvas));
    }).not.toThrow();
  });
});

describe("Chapitre 1 — Smoke Test du composant entier", () => {
  it("Chap1CourantsChamp doit se rendre sans exception fatale", () => {
    // We need to lazy-import since it uses many 3D components
    jest.isolateModules(() => {
      const { default: Chap1 } = require("@/modules/physique/electricite/electromagnetisme-dans-le-vide/chapters/chap1-courants-champ");
      expect(() => {
        render(React.createElement(Chap1));
      }).not.toThrow();
    });
  });
});
