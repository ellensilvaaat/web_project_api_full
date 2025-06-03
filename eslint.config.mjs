import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
    },
    plugins: { js },
    extends: ["eslint:recommended"],
  },
  {
    files: ["**/*.{js,jsx}"],
    plugins: { react: pluginReact },
    rules: {
      "react/react-in-jsx-scope": "off", // Se estiver usando React 17+
    },
  },
]);
