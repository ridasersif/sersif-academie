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

  it("LaplaceRail3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      const LaplaceRail = require("@/modules/physique/electricite/electromagnetisme-dans-le-vide/components/LaplaceRail3DCanvas").default;
      render(React.createElement(LaplaceRail));
    }).not.toThrow();
  });

  it("LaplaceRails3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      const LaplaceRails = require("@/modules/physique/electricite/electromagnetisme-dans-le-vide/components/LaplaceRails3DCanvas").default;
      render(React.createElement(LaplaceRails));
    }).not.toThrow();
  });

  it("MagneticFlux3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      const MagneticFlux = require("@/modules/physique/electricite/electromagnetisme-dans-le-vide/components/MagneticFlux3DCanvas").default;
      render(React.createElement(MagneticFlux));
    }).not.toThrow();
  });

  it("BiotSavart3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      render(React.createElement(BiotSavart3DCanvas));
    }).not.toThrow();
  });

  it("HallEffect3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      // Must use require to avoid hoisting issues with mocks if not top-level
      const HallEffect = require("@/modules/physique/electricite/electromagnetisme-dans-le-vide/components/HallEffect3DCanvas").default;
      render(React.createElement(HallEffect));
    }).not.toThrow();
  });

  it("RightHandRule3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      const RightHandRule = require("@/modules/physique/electricite/electromagnetisme-dans-le-vide/components/RightHandRule3DCanvas").default;
      render(React.createElement(RightHandRule));
    }).not.toThrow();
  });

  it("SolenoidPotentialExercise3DCanvas doit se rendre sans erreur", () => {
    expect(() => {
      const Solenoid = require("@/modules/physique/electricite/electromagnetisme-dans-le-vide/components/SolenoidPotentialExercise3DCanvas").default;
      render(React.createElement(Solenoid));
    }).not.toThrow();
  });
});

describe("Chapitre 1 — Smoke Test du composant entier", () => {
  it("Chap1CourantsChamp doit se rendre sans exception fatale", () => {
    // We import dynamically if needed, or directly
    const Chap1 = require("@/modules/physique/electricite/electromagnetisme-dans-le-vide/chapters/chap1-courants-champ").default;
    expect(() => {
      render(React.createElement(Chap1));
    }).not.toThrow();
  });
});
