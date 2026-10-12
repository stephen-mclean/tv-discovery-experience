import { motion, useReducedMotionConfig } from "motion/react";
import { cx } from "../format";

export interface ProcessingIndicatorProps {
  label?: string;
  className?: string;
}

const DOTS = [0, 1, 2];

/** Staggered bouncing dots while a voice request is being worked out. */
export function ProcessingIndicator({
  label = "Thinking",
  className,
}: ProcessingIndicatorProps) {
  const reduceMotion = useReducedMotionConfig();

  return (
    <span
      role="status"
      className={cx("inline-flex items-center gap-3", className)}
    >
      <span aria-hidden className="flex h-6 items-center gap-1.5">
        {DOTS.map((i) =>
          reduceMotion ? (
            <span key={i} className="size-3 rounded-full bg-accent" />
          ) : (
            <motion.span
              key={i}
              className="size-3 rounded-full bg-accent"
              animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
            />
          ),
        )}
      </span>
      <span className="text-body text-fg-muted">{label}…</span>
    </span>
  );
}
