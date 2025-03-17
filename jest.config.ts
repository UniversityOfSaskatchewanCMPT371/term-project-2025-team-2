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
    },
    //ignore playwright tests
    testPathIgnorePatterns: [
        "/node_modules/",
        "/tests/playwright/",
        "/tests/smokeTests/smokeTests.spec.ts",
        "/tests/playwright/regressionTests/autoEditing.spec.ts",
    ],
};
