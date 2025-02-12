/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  //ignore playwright tests
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/playwright/'
  ],
};