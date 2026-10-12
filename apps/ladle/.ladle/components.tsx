import "./ladle.css";
import type { GlobalProvider } from "@ladle/react";
import { MotionConfig } from "motion/react";

/**
 * Every story renders on the dark TV canvas. Stories that own their page
 * layout (e.g. the detail page) set `meta: { fullBleed: true }` to opt out of
 * the overscan-safe padding.
 */
export const Provider: GlobalProvider = ({ children, storyMeta }) => (
  <MotionConfig reducedMotion="user">
    <div
      className={
        storyMeta?.fullBleed
          ? "min-h-screen bg-canvas font-sans text-fg"
          : "min-h-screen bg-canvas px-safe-x py-safe-y font-sans text-fg"
      }
    >
      {children}
    </div>
  </MotionConfig>
);
