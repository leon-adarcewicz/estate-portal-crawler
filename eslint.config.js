import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig(
  {
    ignores: ["dist/", "node_modules/"],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-dupe-else-if": "error",
      "no-unassigned-vars": "error",
      "no-unreachable": "error",
      "no-unsafe-finally": "error",
      "no-unused-vars": "error",
      camelcase: "warn",
      eqeqeq: "error",
      "no-console": "warn",
      "no-magic-numbers": "warn",
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
  {
    files: ["**/__tests__/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
