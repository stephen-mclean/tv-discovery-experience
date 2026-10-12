import { defineConfig } from "eslint/config";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * A shared ESLint configuration for Node.js apps.
 */
export const config = defineConfig(baseConfig, {
  languageOptions: {
    globals: globals.node,
  },
});
