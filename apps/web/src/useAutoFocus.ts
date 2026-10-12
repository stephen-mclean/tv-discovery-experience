import { getFocusTarget } from "@repo/ui";
import { useEffect, type RefObject } from "react";

/**
 * Moves focus to the first tile inside `ref` once the page's data is `ready`,
 * and again whenever `key` changes, so the D-pad works without a first click.
 */
export function useAutoFocus(
  ref: RefObject<HTMLElement | null>,
  ready: boolean,
  key: string,
) {
  useEffect(() => {
    if (ready && ref.current)
      getFocusTarget(ref.current)?.focus({ preventScroll: true });
  }, [ref, ready, key]);
}
