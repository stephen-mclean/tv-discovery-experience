import { useEffect, useRef } from "react";
import { cx } from "../format";
import { getFocusTarget } from "../nav/focus";
import { useSectionNav } from "../nav/useSectionNav";
import { PersonRow } from "../people/PersonRow";
import type { MediaDetailData, MediaSummary, PersonSummary } from "../types";
import { DetailHero } from "./DetailHero";
import { MediaRow } from "./MediaRow";

export interface MediaDetailProps {
  media: MediaDetailData;
  onSelectMedia?: (item: MediaSummary) => void;
  onSelectPerson?: (person: PersonSummary) => void;
  /** Move focus into the page when it opens so the D-pad works immediately. */
  autoFocus?: boolean;
  className?: string;
}

/**
 * The detail page for a movie or TV show: hero, cast, then similar titles.
 * Each block is a nav section, so up/down moves between them.
 */
export function MediaDetail({
  media,
  onSelectMedia,
  onSelectPerson,
  autoFocus = true,
  className,
}: MediaDetailProps) {
  const ref = useRef<HTMLElement>(null);
  useSectionNav(ref);

  useEffect(() => {
    if (!autoFocus) return;
    // Wait two frames: the overview's "Read more" button only appears after
    // its ResizeObserver has measured the clamped text, and it should be the
    // first stop when it exists.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        if (ref.current)
          getFocusTarget(ref.current)?.focus({ preventScroll: true });
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [autoFocus, media.id]);

  return (
    <article
      ref={ref}
      aria-label={media.title}
      className={cx("min-h-screen bg-canvas text-fg", className)}
    >
      <DetailHero media={media} onSelectPerson={onSelectPerson} />
      <div className="flex flex-col gap-6 px-safe-x pb-safe-y">
        {media.cast.length > 0 && (
          <PersonRow
            title="Cast"
            people={media.cast}
            onSelect={onSelectPerson}
          />
        )}
        {media.similar.length > 0 && (
          <MediaRow
            title="More like this"
            items={media.similar}
            onSelect={onSelectMedia}
          />
        )}
      </div>
    </article>
  );
}
