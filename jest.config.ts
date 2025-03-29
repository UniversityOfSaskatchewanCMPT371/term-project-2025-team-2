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
        "^@utils/(.*)$": "<rootDir>/src/Components/utils/$1",
        "^@dataFunctions/(.*)$": "<rootDir>/src/DataFunctions/$1",
        "^@features/(.*)$": "<rootDir>/src/Features/$1",
        "^@components/(.*)$": "<rootDir>/src/Components/$1",
        "^@logger/(.*)$": "<rootDir>/src/Logger/$1",
        "^@hooks/(.*)$": "<rootDir>/src/Hooks/$1",
        "^@dicom/(.*)$": "<rootDir>/src/Features/DicomTagTable/$1",
        "^@state/(.*)$": "<rootDir>/src/State/$1",
        "^@file/(.*)$": "<rootDir>/src/Features/FileHandling/$1",
        "^@auto/(.*)$": "<rootDir>/src/Features/AutoAnonymize/$1",
        "^@types/(.*)$": "<rootDir>/src/types/$1",
        "^@services/(.*)$": "<rootDir>/src/Services/$1",
    },
    //ignore playwright tests
    testPathIgnorePatterns: [
        "/node_modules/",
        "/tests/playwright/",
        "/tests/smokeTests/smokeTests.spec.ts",
        "/tests/playwright/regressionTests/autoEditing.spec.ts",
    ],

    //Jest coverage settings
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}", //Includes all source ts codes
        "!src/**/*.d.ts", //Exclude type declarations
        "!src/main.tsx", // Exclude Vite entry point
        "!src/App.tsx", // Exclude Vite root component
        "!src/Hooks/**",
        "!src/State/Store**", // Store component is just a collection
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["json", "text"],
};
