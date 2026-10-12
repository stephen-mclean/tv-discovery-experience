import { useState } from "react";
import { cx, initials } from "../format";
import type { RovingItemProps } from "../nav/useRovingRow";
import type { PersonSummary } from "../types";

export interface PersonTileProps extends Partial<RovingItemProps> {
  person: PersonSummary;
  onSelect?: (person: PersonSummary) => void;
  /** Force the focused look. For stories and screenshots only. */
  focused?: boolean;
}

/** A round headshot with the person's name and role. */
export function PersonTile({
  person,
  onSelect,
  focused,
  ...rovingProps
}: PersonTileProps) {
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const [failedSrc, setFailedSrc] = useState<string>();
  const src =
    person.profileUrl && person.profileUrl !== failedSrc
      ? person.profileUrl
      : undefined;
  const loaded = src !== undefined && loadedSrc === src;

  return (
    <button
      type="button"
      {...rovingProps}
      data-focused={focused || undefined}
      aria-label={person.role ? `${person.name}, ${person.role}` : person.name}
      onClick={() => onSelect?.(person)}
      className="group flex w-person flex-col items-center gap-5 text-center outline-none"
    >
      <div
        className={cx(
          "focus-ring relative aspect-square w-full overflow-hidden rounded-full bg-surface-raised",
          "group-tv-focus:focus-ring-on group-tv-focus:focus-lift",
        )}
      >
        {src ? (
          <>
            {!loaded && (
              <div className="absolute inset-0 bg-surface-raised motion-safe:animate-pulse" />
            )}
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
          <span className="flex size-full items-center justify-center bg-linear-to-br from-surface-raised to-surface text-title font-bold text-fg-muted">
            {initials(person.name)}
          </span>
        )}
      </div>
      <span aria-hidden className="flex flex-col">
        <span className="line-clamp-2 text-caption font-semibold text-fg">
          {person.name}
        </span>
        {person.role && (
          <span className="line-clamp-2 text-caption text-fg-muted">
            {person.role}
          </span>
        )}
      </span>
    </button>
  );
}

export function PersonTileSkeleton() {
  return (
    <div className="flex w-person flex-col items-center gap-5">
      <div className="aspect-square w-full rounded-full bg-surface-raised motion-safe:animate-pulse" />
      <div className="h-5 w-3/4 rounded bg-surface-raised motion-safe:animate-pulse" />
    </div>
  );
}
