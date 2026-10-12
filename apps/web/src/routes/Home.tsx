import type { HomeResponse, MediaCard } from "@repo/contracts";
import { MediaRow } from "@repo/ui";
import { useRef } from "react";
import { api, useApi } from "../api.ts";
import { CardRow, ErrorMessage } from "../components/CardRow.tsx";
import { useAutoFocus } from "../useAutoFocus.ts";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const { data, error, loading } = useApi<HomeResponse>(api.home());
  useAutoFocus(ref, !!data, "home");

  const featured = data?.rows
    .flatMap((row) => row.items)
    .find((card) => card.mediaType !== "person" && card.backdropUrl);

  return (
    <>
      <Featured card={featured} />
      <div
        ref={ref}
        className="relative -mt-[20vh] flex flex-col gap-6 px-safe-x pb-safe-y"
      >
        {error && <ErrorMessage error={error} />}
        {loading &&
          ["Trending", "Popular", "Top rated"].map((title) => (
            <MediaRow key={title} title={title} items={[]} loading />
          ))}
        {data?.rows.map((row) => (
          <CardRow key={row.title} title={row.title} items={row.items} />
        ))}
      </div>
    </>
  );
}

/** A decorative backdrop for the top trending title, behind the first row. */
function Featured({ card }: { card?: MediaCard }) {
  return (
    <div aria-hidden className="relative h-[60vh] overflow-hidden">
      {card?.backdropUrl && (
        <img
          src={card.backdropUrl}
          alt=""
          className="absolute inset-0 size-full object-cover object-top"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-r from-canvas via-canvas/70 via-40% to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-canvas via-canvas/30 via-40% to-transparent" />
      {card && (
        <div className="absolute bottom-[24vh] left-[5vw] flex max-w-[50%] flex-col gap-2">
          <span className="text-caption font-semibold tracking-widest text-accent uppercase">
            Trending now
          </span>
          <span className="text-display text-balance text-fg">
            {card.title}
          </span>
        </div>
      )}
    </div>
  );
}
