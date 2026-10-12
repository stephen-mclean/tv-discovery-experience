import { Fragment, type ReactNode } from "react";
import { cx, formatRating, formatRuntime, plural } from "../format";
import type { MediaDetailData } from "../types";

export interface MetaLineProps {
  media: MediaDetailData;
  className?: string;
}

/**
 * year · certification · runtime (or seasons/episodes) · ★ rating · status.
 * The only place the movie and TV detail layouts differ.
 */
export function MetaLine({ media, className }: MetaLineProps) {
  const parts: { key: string; node: ReactNode }[] = [];

  if (media.year) parts.push({ key: "year", node: media.year });
  if (media.certification) {
    parts.push({
      key: "cert",
      node: (
        <span className="rounded-md border-2 border-fg-muted px-2 text-caption font-semibold">
          {media.certification}
        </span>
      ),
    });
  }
  if (media.type === "movie" && media.runtimeMinutes) {
    parts.push({ key: "runtime", node: formatRuntime(media.runtimeMinutes) });
  }
  if (media.type === "tv") {
    const tv = [
      media.seasons ? plural(media.seasons, "season") : undefined,
      media.episodes ? plural(media.episodes, "episode") : undefined,
    ].filter(Boolean);
    if (tv.length > 0) parts.push({ key: "tv", node: tv.join(" · ") });
  }
  if (media.rating !== undefined && media.rating > 0) {
    parts.push({
      key: "rating",
      node: (
        <span>
          <span aria-hidden className="text-accent">
            ★{" "}
          </span>
          <span className="sr-only">Rated </span>
          {formatRating(media.rating)}
          <span className="text-fg-muted">/10</span>
        </span>
      ),
    });
  }
  if (media.status) parts.push({ key: "status", node: media.status });

  if (parts.length === 0) return null;

  return (
    <p
      className={cx(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-body text-fg",
        className,
      )}
    >
      {parts.map((part, i) => (
        <Fragment key={part.key}>
          {i > 0 && (
            <span aria-hidden className="text-fg-muted">
              ·
            </span>
          )}
          {part.node}
        </Fragment>
      ))}
    </p>
  );
}
