import { useRef, useState, type KeyboardEvent } from "react";
import { hasModifier, revealFocused } from "./focus";

export interface RovingItemProps {
  ref: (el: HTMLElement | null) => void;
  tabIndex: 0 | -1;
  onFocus: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
}

/**
 * Roving tabindex for a horizontal row. Only the active item is tabbable, so
 * coming back to the row (Tab or up/down) lands on the item focused last.
 * ArrowLeft/ArrowRight move between items and stop at the ends.
 */
export function useRovingRow(count: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = useRef<(HTMLElement | null)[]>([]);
  // Clamp in case the list shrank since the index was stored.
  const current = Math.min(activeIndex, Math.max(count - 1, 0));

  function getItemProps(index: number): RovingItemProps {
    return {
      ref: (el) => {
        items.current[index] = el;
      },
      tabIndex: index === current ? 0 : -1,
      onFocus: () => {
        setActiveIndex(index);
        const el = items.current[index];
        if (el) revealFocused(el);
      },
      onKeyDown: (e) => {
        if (hasModifier(e)) return;
        const step =
          e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (step === 0) return;
        // Always swallow the key so the row doesn't scroll on its own,
        // even when we're at an end and focus stays put.
        e.preventDefault();
        items.current[index + step]?.focus();
      },
    };
  }

  return { activeIndex: current, getItemProps };
}
