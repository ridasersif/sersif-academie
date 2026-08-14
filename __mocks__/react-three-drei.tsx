// Mock for @react-three/drei — helpers that need WebGL context
import React from "react";

export const OrbitControls = () => null;
export const Text = ({ children }: { children: React.ReactNode }) =>
  React.createElement("span", { "data-testid": "drei-text" }, children);
export const Html = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", { "data-testid": "drei-html" }, children);
export const Line = () => null;
export const Billboard = ({ children }: { children: React.ReactNode }) =>
  React.createElement("div", null, children);
export const Sphere = () => null;
export const Box = () => null;
export const Cylinder = () => null;
export const Cone = () => null;
export const Torus = () => null;
export const Stars = () => null;
export const Float = ({ children }: { children: React.ReactNode }) =>
  React.createElement(React.Fragment, null, children);
export const Environment = () => null;
export const ContactShadows = () => null;
export const QuadraticBezierLine = () => null;
export const useGLTF = jest.fn(() => ({ nodes: {}, materials: {} }));
