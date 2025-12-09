module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        "airbnb",
        "airbnb-typescript",
        "airbnb/hooks",
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier"
    ],
    overrides: [
        {
            env: {
                node: true
            },
            files: ["src/**/*.{js,jsx,mjs,cjs,ts,tsx}"],
            parserOptions: {
                sourceType: "script"
            }
        }
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json"
    },
    plugins: ["prettier", "@typescript-eslint", "react"],
    rules: {
        "react/react-in-jsx-scope": 0,
        "react/require-default-props": "off",
        "react/prop-types": "off",
        "react/function-component-definition": "off",
        "react/jsx-no-constructed-context-values": "off",
        "react/display-name": "off",
        "react/no-array-index-key": "off",
        "react/jsx-props-no-spreading": "off",
        "import/prefer-default-export": ["off", { target: "single" }],
        "import/no-extraneous-dependencies": "off",
        "no-console": "off",
        "no-restricted-syntax": 0,
        "no-nested-ternary": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_"
            }
        ],
        "no-unused-expressions": "off",
        "@typescript-eslint/no-unused-expressions": "off",
        "max-len": ["warn", { code: 200 }],
        "linebreak-style": 0
    }
};
