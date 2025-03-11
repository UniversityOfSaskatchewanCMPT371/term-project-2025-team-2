/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.app.json",
            },
        ],
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleNameMapper: {
        "^@utils/(.*)$": "<rootDir>/src/components/utils/$1",
        "^@components/(.*)$": "<rootDir>/src/components/$1",
    },
    //ignore playwright tests
    testPathIgnorePatterns: [
        "/node_modules/",
        "/tests/playwright/",
        "/tests/smokeTests/smokeTests.spec.ts",
        "/tests/regressionTests/autoEditing.spec.ts",
    ],
};
