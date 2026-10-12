import { useId, type ReactNode } from "react";
import { cx } from "./format";
import { NAV_SCROLLER_ATTR, NAV_SECTION_ATTR } from "./nav/focus";
import { useRovingRow, type RovingItemProps } from "./nav/useRovingRow";

export interface RowProps<T> {
  title: string;
  items: T[];
  getKey: (item: T) => string;
  renderItem: (
    item: T,
    rovingProps: RovingItemProps,
    index: number,
  ) => ReactNode;
  loading?: boolean;
  renderSkeleton?: (index: number) => ReactNode;
  skeletonCount?: number;
  emptyMessage?: string;
  className?: string;
}

/**
 * A titled, horizontally scrolling row with D-pad navigation. MediaRow and
 * PersonRow are thin wrappers around it so the focus/scroll logic lives here.
 */
export function Row<T>({
  title,
  items,
  getKey,
  renderItem,
  loading = false,
  renderSkeleton,
  skeletonCount = 6,
  emptyMessage = "Nothing to show here yet.",
  className,
}: RowProps<T>) {
  const headingId = useId();
  const { getItemProps } = useRovingRow(loading ? 0 : items.length);
  const showEmpty = !loading && items.length === 0;

  return (
    <section
      {...{ [NAV_SECTION_ATTR]: "" }}
      aria-labelledby={headingId}
      aria-busy={loading || undefined}
      // scroll-margin leaves breathing room when the page scrolls to the row.
      className={cx("flex scroll-my-12 flex-col gap-2", className)}
    >
      <h2 id={headingId} className="text-heading font-semibold text-fg">
        {title}
      </h2>
      {showEmpty ? (
        <p className="py-6 text-body text-fg-muted">{emptyMessage}</p>
      ) : (
        <ul
          {...{ [NAV_SCROLLER_ATTR]: "" }}
          role="list"
          className={cx(
            // Padding leaves room for the focus scale + ring, which would
            // otherwise be clipped by the horizontal scroll container.
            "-mx-6 flex gap-6 overflow-x-auto px-6 py-6 [scrollbar-width:none]",
            "scroll-px-12 [&::-webkit-scrollbar]:hidden",
          )}
        >
          {loading
            ? Array.from({ length: skeletonCount }, (_, i) => (
                <li key={i} aria-hidden className="shrink-0">
                  {renderSkeleton?.(i)}
                </li>
              ))
            : items.map((item, i) => (
                <li key={getKey(item)} className="shrink-0">
                  {renderItem(item, getItemProps(i), i)}
                </li>
              ))}
        </ul>
      )}
    </section>
  );
}
