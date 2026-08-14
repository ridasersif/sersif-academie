// Mock for Three.js — prevents WebGL from crashing in JSDOM
class Vector3Mock {
  x = 0; y = 0; z = 0;
  constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
  clone() { return new Vector3Mock(this.x, this.y, this.z); }
  normalize() { return this; }
  crossVectors() { return this; }
  multiplyScalar() { return this; }
  copy() { return this; }
  add() { return this; }
  sub() { return this; }
  length() { return 1; }
  lengthSq() { return 1; }
  distanceTo() { return 1; }
  toArray() { return [this.x, this.y, this.z]; }
  addVectors(a: any, b: any) { return this; }
  set(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z; return this; }
}

class QuaternionMock {
  setFromAxisAngle() { return this; }
  setFromUnitVectors() { return this; }
}

class Object3DMock {
  position = new Vector3Mock();
  scale = new Vector3Mock();
  updateMatrix() {}
  matrix = [];
  setMatrixAt() {}
}

class CubicBezierCurve3Mock {
  constructor() {}
  getPoints() { return []; }
  getPoint() { return new Vector3Mock(); }
  getTangent() { return new Vector3Mock(); }
}

const THREE = {
  Vector3: Vector3Mock,
  Quaternion: QuaternionMock,
  Object3D: Object3DMock,
  CubicBezierCurve3: CubicBezierCurve3Mock,
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
export const Quaternion = THREE.Quaternion;
export const Object3D = THREE.Object3D;
export const CubicBezierCurve3 = THREE.CubicBezierCurve3;
export const Color = THREE.Color;
export const Group = THREE.Group;
export const Mesh = THREE.Mesh;
export const BufferGeometry = THREE.BufferGeometry;
export const MathUtils = THREE.MathUtils;
