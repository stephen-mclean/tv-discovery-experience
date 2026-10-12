import { useEffect, type RefObject } from "react";
import { getFocusTarget, hasModifier, NAV_SECTION_ATTR } from "./focus";

export { NAV_SECTION_ATTR };

/**
 * ArrowUp/ArrowDown move focus between `[data-nav-section]` containers inside
 * `containerRef`. Each section is one horizontal line of focusables; entering a
 * section focuses its roving item (tabIndex 0), so rows remember their position.
 * Sections with nothing focusable (loading, empty) are skipped.
 */
export function useSectionNav(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.defaultPrevented || hasModifier(e)) return;
      const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0;
      if (step === 0 || !container || !(e.target instanceof HTMLElement))
        return;

      const current = e.target.closest(`[${NAV_SECTION_ATTR}]`);
      if (!current) return;
      const sections = Array.from(
        container.querySelectorAll<HTMLElement>(`[${NAV_SECTION_ATTR}]`),
      );
      for (
        let i = sections.indexOf(current as HTMLElement) + step;
        i >= 0 && i < sections.length;
        i += step
      ) {
        const target = getFocusTarget(sections[i]!);
        if (target) {
          // Only claim the key when focus moved, so an outer section nav (or
          // the page scroll) can still handle it at the first/last section.
          e.preventDefault();
          target.focus();
          return;
        }
      }
    }

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [containerRef]);
}
