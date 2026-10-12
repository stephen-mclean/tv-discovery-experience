import { useEffect, useId, useRef, useState } from "react";
import { cx, formatDate, isUpcoming } from "../format";
import { NAV_SECTION_ATTR } from "../nav/focus";
import { useRovingRow } from "../nav/useRovingRow";
import type { MediaDetailData, PersonSummary } from "../types";
import { MetaLine } from "./MetaLine";

export interface DetailHeroProps {
  media: MediaDetailData;
  onSelectPerson?: (person: PersonSummary) => void;
}

const navSection = { [NAV_SECTION_ATTR]: "" };

/** Backdrop, title and key facts at the top of the detail page. */
export function DetailHero({ media, onSelectPerson }: DetailHeroProps) {
  const upcoming = isUpcoming(media.releaseDate);
  const releaseDate = formatDate(media.releaseDate);
  const releaseLabel =
    media.type === "tv" ? "First aired" : upcoming ? "Releases" : "Released";

  return (
    <header className="relative isolate flex min-h-[75vh] flex-col justify-end px-safe-x pt-safe-y pb-8">
      <Backdrop url={media.backdropUrl} />
      <div className="flex max-w-[60%] flex-col gap-5">
        {upcoming && (
          <span className="self-start rounded-md bg-accent px-3 py-1 text-caption font-bold text-canvas">
            Coming soon
          </span>
        )}
        <h1 className="text-display text-fg text-balance">{media.title}</h1>
        {media.tagline && (
          <p className="text-heading text-fg-muted italic">{media.tagline}</p>
        )}
        <MetaLine media={media} />
        {media.genres.length > 0 && (
          <ul role="list" aria-label="Genres" className="flex flex-wrap gap-2">
            {media.genres.map((genre) => (
              <li
                key={genre}
                className="rounded-full bg-surface-raised/80 px-4 py-1 text-caption text-fg"
              >
                {genre}
              </li>
            ))}
          </ul>
        )}
        {media.overview && <Overview text={media.overview} />}
        <Credits credits={media.credits} onSelectPerson={onSelectPerson} />
        {releaseDate && (
          <p className="text-body text-fg-muted">
            {releaseLabel} <span className="text-fg">{releaseDate}</span>
          </p>
        )}
      </div>
    </header>
  );
}

function Backdrop({ url }: { url?: string }) {
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const [failedSrc, setFailedSrc] = useState<string>();
  const src = url && url !== failedSrc ? url : undefined;

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {src ? (
        <img
          src={src}
          alt=""
          decoding="async"
          onLoad={() => setLoadedSrc(src)}
          onError={() => setFailedSrc(src)}
          className={cx(
            "absolute inset-0 size-full object-cover object-top transition-opacity duration-(--duration-enter)",
            loadedSrc === src ? "opacity-100" : "opacity-0",
          )}
        />
      ) : (
        <div className="absolute inset-0 bg-radial-[at_70%_20%] from-surface-raised to-canvas" />
      )}
      {/* Scrims keep text readable over bright backdrops. */}
      <div className="absolute inset-0 bg-linear-to-r from-canvas via-canvas/80 via-40% to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/30 via-30% to-transparent" />
    </div>
  );
}

/** Clamped to four lines, with a "Read more" toggle only when it overflows. */
function Overview({ text }: { text: string }) {
  const id = useId();
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      // Only measure while clamped; once expanded nothing overflows.
      if (!el.classList.contains("line-clamp-4")) return;
      setOverflows(el.scrollHeight > el.clientHeight + 1);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div className="flex flex-col items-start gap-3">
      <p
        id={id}
        ref={ref}
        className={cx(
          "max-w-[60ch] text-body text-fg",
          !expanded && "line-clamp-4",
        )}
      >
        {text}
      </p>
      {(overflows || expanded) && (
        <div {...navSection}>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded((v) => !v)}
            className={cx(
              "focus-ring rounded-full bg-surface-raised px-5 py-2 text-caption font-semibold text-fg",
              "tv-focus:focus-ring-on",
            )}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        </div>
      )}
    </div>
  );
}

/** "Director David Fincher · Screenplay Jim Uhls". Names open the person. */
function Credits({
  credits,
  onSelectPerson,
}: {
  credits: MediaDetailData["credits"];
  onSelectPerson?: (person: PersonSummary) => void;
}) {
  const groups = credits.filter((group) => group.people.length > 0);
  const people = groups.flatMap((group) => group.people);
  const { getItemProps } = useRovingRow(people.length);
  if (groups.length === 0) return null;

  let index = 0;
  return (
    <dl
      {...navSection}
      className="flex flex-wrap items-center gap-x-8 gap-y-3 text-body"
    >
      {groups.map((group) => (
        <div
          key={group.label}
          className="flex flex-wrap items-center gap-x-3 gap-y-2"
        >
          <dt className="text-fg-muted">{group.label}</dt>
          {group.people.map((person) => {
            const rovingProps = getItemProps(index++);
            return (
              <dd key={person.id}>
                <button
                  type="button"
                  {...rovingProps}
                  onClick={() => onSelectPerson?.(person)}
                  className={cx(
                    "focus-ring rounded-md px-2 py-0.5 font-semibold text-fg",
                    "hover:bg-surface-raised tv-focus:bg-surface-raised tv-focus:focus-ring-on",
                  )}
                >
                  {person.name}
                </button>
              </dd>
            );
          })}
        </div>
      ))}
    </dl>
  );
}
