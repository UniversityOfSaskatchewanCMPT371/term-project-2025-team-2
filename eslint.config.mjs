import globals from "globals"
import pluginJs from "@eslint/js"
import eslintConfigPrettier from "eslint-config-prettier"

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                QUnit: "readonly", // Define QUnit as a global variable
                require: "readonly",
            },
        },
    },
    { 
        ignores: ["dicomParser/*", "tagEditor/*"] 
    },

    pluginJs.configs.recommended,
    eslintConfigPrettier,
]
