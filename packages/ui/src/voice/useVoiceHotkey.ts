import { useEffect, useEffectEvent } from "react";
import { hasModifier } from "../nav/focus";

export interface VoiceHotkeyConfig {
  /** Default true. */
  enabled?: boolean;
  /** `KeyboardEvent.key` values. Default ["/"]. */
  keys?: string[];
}

export const DEFAULT_VOICE_KEYS = ["/"];

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function matches(key: string, keys: string[]): boolean {
  const pressed = key.toLowerCase();
  return keys.some((k) => k.toLowerCase() === pressed);
}

/**
 * Calls `onTrigger` when one of the configured keys is pressed anywhere on the
 * page. Ignores typing in editable fields, key repeats and Ctrl/Alt/Meta
 * combinations so it never hijacks normal input or browser shortcuts.
 */
export function useVoiceHotkey(
  onTrigger: () => void,
  config: VoiceHotkeyConfig = {},
) {
  const { enabled = true, keys = DEFAULT_VOICE_KEYS } = config;

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (
      e.repeat ||
      e.defaultPrevented ||
      hasModifier(e) ||
      isEditable(e.target)
    )
      return;
    if (!matches(e.key, keys)) return;
    // Stop the key from also typing, scrolling or triggering find-in-page.
    e.preventDefault();
    onTrigger();
  });

  useEffect(() => {
    if (!enabled) return;
    const listener = (e: KeyboardEvent) => onKeyDown(e);
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [enabled]);
}

const KEY_NAMES: Record<string, string> = {
  " ": "Space",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
};

/** Human-readable key list for hints, e.g. ["/", "m"] → "/ or M". */
export function formatHotkeys(keys: string[]): string {
  const names = keys.map(
    (k) => KEY_NAMES[k] ?? (k.length === 1 ? k.toUpperCase() : k),
  );
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} or ${names[names.length - 1]}`;
}
