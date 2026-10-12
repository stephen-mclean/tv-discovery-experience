/**
 * The element to focus when entering a nav section: the roving tile with
 * tabIndex 0, or failing that the first natively focusable control.
 */
const FOCUS_TARGET =
  '[tabindex="0"], button:not([tabindex]):not([disabled]), a[href]:not([tabindex])';

export function getFocusTarget(root: ParentNode): HTMLElement | null {
  return root.querySelector<HTMLElement>(FOCUS_TARGET);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const NAV_SECTION_ATTR = "data-nav-section";
export const NAV_SCROLLER_ATTR = "data-nav-scroller";

/**
 * Keep a focused element fully in view. The page scrolls so the element's
 * whole section (heading included) is visible, and the row scrolls
 * horizontally so the element clears the row's scroll-padding. Doing the two
 * axes separately stops one smooth scroll from cancelling the other.
 */
export function revealFocused(el: HTMLElement): void {
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
  const section = el.closest<HTMLElement>(`[${NAV_SECTION_ATTR}]`) ?? el;
  section.scrollIntoView({ block: "nearest", inline: "nearest", behavior });

  const scroller = el.closest<HTMLElement>(`[${NAV_SCROLLER_ATTR}]`);
  if (!scroller) return;
  const style = getComputedStyle(scroller);
  const padStart = parseFloat(style.scrollPaddingInlineStart) || 0;
  const padEnd = parseFloat(style.scrollPaddingInlineEnd) || 0;
  const bounds = scroller.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  if (rect.left < bounds.left + padStart) {
    scroller.scrollBy({ left: rect.left - bounds.left - padStart, behavior });
  } else if (rect.right > bounds.right - padEnd) {
    scroller.scrollBy({ left: rect.right - bounds.right + padEnd, behavior });
  }
}

export function hasModifier(e: {
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
}) {
  return e.altKey || e.ctrlKey || e.metaKey;
}
