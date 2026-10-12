import { AnimatePresence, motion, useReducedMotionConfig } from "motion/react";
import { useImperativeHandle, useRef, type Ref } from "react";
import { cx } from "../format";
import { ProcessingIndicator } from "./ProcessingIndicator";
import {
  DEFAULT_VOICE_KEYS,
  formatHotkeys,
  useVoiceHotkey,
  type VoiceHotkeyConfig,
} from "./useVoiceHotkey";

export type VoiceStatus =
  "idle" | "listening" | "processing" | "result" | "error";

export interface VoiceBarHandle {
  /** Same as pressing the mic: calls onActivate and focuses the mic. */
  activate: () => void;
  focus: () => void;
}

export interface VoiceBarProps {
  status: VoiceStatus;
  /** What the user said (live while listening). */
  transcript?: string;
  /** Result summary or error text. */
  message?: string;
  onActivate?: () => void;
  hotkey?: VoiceHotkeyConfig;
  /** Example query shown in the idle hint. */
  example?: string;
  ref?: Ref<VoiceBarHandle>;
  className?: string;
}

/**
 * The voice search bar. Presentational: the app owns speech recognition and
 * passes the status, transcript and message in.
 */
export function VoiceBar({
  status,
  transcript,
  message,
  onActivate,
  hotkey,
  example = "Find me a show like Breaking Bad",
  ref,
  className,
}: VoiceBarProps) {
  const micRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotionConfig() ?? false;
  const hotkeyEnabled = hotkey?.enabled ?? true;
  const keys = hotkey?.keys?.length ? hotkey.keys : DEFAULT_VOICE_KEYS;

  function activate() {
    micRef.current?.focus();
    onActivate?.();
  }

  useVoiceHotkey(activate, { enabled: hotkeyEnabled, keys });
  useImperativeHandle(ref, () => ({
    activate,
    focus: () => micRef.current?.focus(),
  }));

  const isError = status === "error";
  const busy = status === "listening" || status === "processing";

  return (
    <div
      className={cx(
        "flex items-center gap-5 rounded-full border-2 bg-surface/90 py-3 pr-8 pl-3 backdrop-blur",
        "transition-colors duration-(--duration-focus)",
        isError
          ? "border-danger/70"
          : busy
            ? "border-accent/60"
            : "border-surface-raised",
        className,
      )}
    >
      <div className="relative shrink-0">
        {status === "listening" && !reduceMotion && <ListeningPulse />}
        <button
          ref={micRef}
          type="button"
          onClick={activate}
          aria-label={micLabel(status)}
          className={cx(
            "focus-ring relative flex size-16 items-center justify-center rounded-full",
            "tv-focus:focus-ring-on tv-focus:focus-lift",
            status === "listening"
              ? "bg-accent text-canvas"
              : isError
                ? "bg-danger/20 text-danger"
                : "bg-surface-raised text-fg",
          )}
        >
          <MicIcon />
        </button>
      </div>

      <div aria-live="polite" className="min-w-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={status}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex min-w-0 flex-col gap-1"
          >
            <StatusContent
              status={status}
              transcript={transcript}
              message={message}
              hint={
                hotkeyEnabled
                  ? `Press ${formatHotkeys(keys)} to speak · try “${example}”`
                  : `Select the mic to speak · try “${example}”`
              }
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusContent({
  status,
  transcript,
  message,
  hint,
}: {
  status: VoiceStatus;
  transcript?: string;
  message?: string;
  hint: string;
}) {
  const quote = transcript ? (
    <p className="truncate text-body text-fg">“{transcript}”</p>
  ) : null;

  switch (status) {
    case "idle":
      return <p className="truncate text-body text-fg-muted">{hint}</p>;
    case "listening":
      return quote ?? <p className="text-body text-fg-muted">Listening…</p>;
    case "processing":
      return (
        <>
          {quote}
          <ProcessingIndicator />
        </>
      );
    case "result":
      return (
        <>
          {quote}
          {message && (
            <p className="truncate text-caption text-fg-muted">{message}</p>
          )}
        </>
      );
    case "error":
      return (
        <>
          {quote}
          <p className="truncate text-caption text-danger">
            {message ?? "Sorry, something went wrong. Try again."}
          </p>
        </>
      );
  }
}

function ListeningPulse() {
  return (
    <>
      {[0, 1].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-full bg-accent"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.7,
          }}
        />
      ))}
    </>
  );
}

function micLabel(status: VoiceStatus): string {
  switch (status) {
    case "listening":
      return "Listening. Select to stop";
    case "processing":
      return "Working on your request";
    default:
      return "Search by voice";
  }
}

function MicIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-8"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <path d="M12 17v4" />
      <path d="M8 21h8" />
    </svg>
  );
}
