import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import importPlugin from "eslint-plugin-import";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      globals: globals.node,
      ecmaVersion: "latest",
      sourceType: "module",
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".mjs", ".cjs"],
        },
      },
    },
    rules: {
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-unresolved": "error",
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    ...json.configs.recommended,
  },
]);
