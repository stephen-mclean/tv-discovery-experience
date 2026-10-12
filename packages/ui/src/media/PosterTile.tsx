import { useState, type ReactNode } from "react";
import { cx, formatRating, isUpcoming } from "../format";
import type { RovingItemProps } from "../nav/useRovingRow";
import type { MediaSummary } from "../types";

export type TileSize = "md" | "lg";

const widths: Record<TileSize, string> = {
  md: "w-tile-md",
  lg: "w-tile-lg",
};

export interface PosterTileProps extends Partial<RovingItemProps> {
  item: MediaSummary;
  onSelect?: (item: MediaSummary) => void;
  /** Force the focused look. For stories and screenshots only. */
  focused?: boolean;
  size?: TileSize;
}

/** A portrait (2:3) poster button. The title appears below it when focused. */
export function PosterTile({
  item,
  onSelect,
  focused,
  size = "md",
  ...rovingProps
}: PosterTileProps) {
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const [failedSrc, setFailedSrc] = useState<string>();
  const src =
    item.posterUrl && item.posterUrl !== failedSrc ? item.posterUrl : undefined;
  const loaded = src !== undefined && loadedSrc === src;
  const upcoming = isUpcoming(item.releaseDate);
  const label = item.year ? `${item.title} (${item.year})` : item.title;

  return (
    <button
      type="button"
      {...rovingProps}
      data-focused={focused || undefined}
      aria-label={label}
      onClick={() => onSelect?.(item)}
      // gap-6 clears the focus scale + ring offset, so the scaled poster
      // doesn't cover the title that appears beneath it on focus.
      className={cx(
        "group flex flex-col gap-6 text-left outline-none",
        widths[size],
      )}
    >
      <div
        className={cx(
          "focus-ring relative aspect-2/3 w-full overflow-hidden rounded-xl bg-surface",
          "group-tv-focus:focus-ring-on group-tv-focus:focus-lift",
        )}
      >
        {src ? (
          <>
            {!loaded && <TileSkeleton className="absolute inset-0" />}
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              onLoad={() => setLoadedSrc(src)}
              onError={() => setFailedSrc(src)}
              className={cx(
                "size-full object-cover transition-opacity duration-(--duration-enter)",
                loaded ? "opacity-100" : "opacity-0",
              )}
            />
          </>
        ) : (
          <PosterFallback item={item} />
        )}
        <div className="absolute inset-x-2 top-2 flex flex-wrap justify-between gap-2">
          {upcoming && <Badge tone="accent">Coming soon</Badge>}
          {item.rating !== undefined && item.rating > 0 && (
            <Badge className="ml-auto">★ {formatRating(item.rating)}</Badge>
          )}
        </div>
      </div>
      <span
        aria-hidden
        className={cx(
          "line-clamp-2 h-[2lh] text-caption font-medium text-fg opacity-0",
          "transition-opacity duration-(--duration-focus) group-tv-focus:opacity-100",
        )}
      >
        {item.title}
      </span>
    </button>
  );
}

function PosterFallback({ item }: { item: MediaSummary }) {
  return (
    <div
      className="flex size-full flex-col justify-end gap-2 p-5"
      style={{ backgroundImage: fallbackGradient(item.title) }}
    >
      <span className="text-caption font-medium tracking-widest text-fg-muted uppercase">
        {item.type === "tv" ? "TV" : "Movie"}
      </span>
      <span className="line-clamp-4 text-heading font-bold break-words text-fg">
        {item.title}
      </span>
      {item.year && (
        <span className="text-caption text-fg-muted">{item.year}</span>
      )}
    </div>
  );
}

function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
  className?: string;
}) {
  return (
    <span
      className={cx(
        "rounded-md px-2 py-0.5 text-caption font-semibold shadow-md",
        tone === "accent" ? "bg-accent text-canvas" : "bg-canvas/85 text-fg",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TileSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "rounded-xl bg-surface-raised motion-safe:animate-pulse",
        className,
      )}
    />
  );
}

/** Poster-shaped placeholder used by rows while loading. */
export function PosterTileSkeleton({ size = "md" }: { size?: TileSize }) {
  return (
    <div className={cx("flex flex-col gap-6", widths[size])}>
      <TileSkeleton className="aspect-2/3 w-full" />
      <div className="h-[2lh] text-caption" />
    </div>
  );
}

/** A stable, title-derived gradient so fallback tiles aren't all identical. */
function fallbackGradient(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  const hue = Math.abs(hash) % 360;
  return `linear-gradient(160deg, hsl(${hue} 45% 28%), hsl(${(hue + 40) % 360} 50% 12%))`;
}
