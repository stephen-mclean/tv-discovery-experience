import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A shared ESLint configuration for React apps built with Vite.
 */
export const config = defineConfig(
  baseConfig,
  reactHooks.configs.flat.recommended,
  reactRefresh.configs.vite,
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
);
