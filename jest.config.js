/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^three$": "<rootDir>/__mocks__/three.ts",
    "^@react-three/fiber$": "<rootDir>/__mocks__/react-three-fiber.tsx",
    "^@react-three/drei$": "<rootDir>/__mocks__/react-three-drei.tsx",
    "^@react-three/postprocessing$": "<rootDir>/__mocks__/@react-three/postprocessing.tsx",
    "^fuse\\.js$": "<rootDir>/__mocks__/fuse.ts",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { tsconfig: { jsx: "react-jsx" } },
    ],
    "^.+\\.js$": ["ts-jest", { tsconfig: { jsx: "react-jsx", allowJs: true } }],
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(@react-three/postprocessing|postprocessing|maath|n8ao)/)",
  ],
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};
