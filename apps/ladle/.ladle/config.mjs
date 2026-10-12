/** @type {import('@ladle/react').UserConfig} */
export default {
  // Match the monorepo's build output convention (turbo caches dist/**).
  outDir: "dist",
  addons: {
    theme: { defaultState: "dark" },
  },
  // Ladle's default single-key hotkeys ("/", "c", "d", "f", "s", …) would
  // fire alongside the stories' own keyboard handling, including the voice
  // hotkey. Move them behind Alt so bare keys belong to the stories.
  hotkeys: {
    search: ["meta+p"],
    control: ["alt+c"],
    darkMode: ["alt+d"],
    fullscreen: ["alt+f"],
    width: ["alt+w"],
    rtl: ["alt+r"],
    source: ["alt+s"],
    a11y: ["alt+a"],
  },
};
