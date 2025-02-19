/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    testEnvironment: "jsdom",
    transform: {
        "^.+.tsx?$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.app.json",
            },
        ],
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    //ignore playwright tests
    testPathIgnorePatterns: ["/node_modules/", "/tests/playwright/"],
};
