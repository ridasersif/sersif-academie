// Mock for Three.js — prevents WebGL from crashing in JSDOM
const THREE = {
  Vector3: jest.fn().mockImplementation(() => ({ x: 0, y: 0, z: 0 })),
  Color: jest.fn().mockImplementation(() => ({})),
  Group: jest.fn().mockImplementation(() => ({})),
  Mesh: jest.fn().mockImplementation(() => ({})),
  BufferGeometry: jest.fn().mockImplementation(() => ({})),
  MeshStandardMaterial: jest.fn().mockImplementation(() => ({})),
  ArrowHelper: jest.fn().mockImplementation(() => ({})),
  CylinderGeometry: jest.fn().mockImplementation(() => ({})),
  SphereGeometry: jest.fn().mockImplementation(() => ({})),
  BoxGeometry: jest.fn().mockImplementation(() => ({})),
  LineBasicMaterial: jest.fn().mockImplementation(() => ({})),
  Line: jest.fn().mockImplementation(() => ({})),
  LineSegments: jest.fn().mockImplementation(() => ({})),
  EdgesGeometry: jest.fn().mockImplementation(() => ({})),
  MathUtils: {
    degToRad: (deg: number) => (deg * Math.PI) / 180,
    clamp: (v: number, min: number, max: number) => Math.max(min, Math.min(max, v)),
  },
};

export default THREE;
export const Vector3 = THREE.Vector3;
export const Color = THREE.Color;
export const Group = THREE.Group;
export const Mesh = THREE.Mesh;
export const MathUtils = THREE.MathUtils;
