// Mock for @react-three/fiber — Canvas and hooks that require WebGL
import React from "react";

export const Canvas = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "r3f-canvas" }, children);

export const useFrame = jest.fn();
export const useThree = jest.fn(() => ({
  camera: { position: { set: jest.fn() } },
  gl: { domElement: document.createElement("canvas") },
  scene: {},
  size: { width: 800, height: 600 },
}));
export const extend = jest.fn();
