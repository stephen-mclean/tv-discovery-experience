import { action, type Story, type StoryDefault } from "@ladle/react";
import {
  MediaRow,
  useSectionNav,
  VoiceBar,
  type MediaRowProps,
} from "@repo/ui";
import { useRef } from "react";
import {
  bradPittMovies,
  popularMovies,
  upcomingMovies,
} from "./fixtures/movies";
import { tvShows } from "./fixtures/tv";

export default { title: "Media / MediaRow" } satisfies StoryDefault;

const onSelect = action("onSelect");

export const PopularMovies: Story<Pick<MediaRowProps, "loading" | "size">> = (
  args,
) => (
  <MediaRow
    title="Most popular of all time"
    items={popularMovies}
    onSelect={onSelect}
    {...args}
  />
);
PopularMovies.args = { loading: false, size: "md" };
PopularMovies.argTypes = {
  size: { options: ["md", "lg"], control: { type: "radio" } },
};

export const TvShows = () => (
  <MediaRow title="TV shows" items={tvShows} onSelect={onSelect} />
);

export const ComingSoon = () => (
  <MediaRow title="Coming soon" items={upcomingMovies} onSelect={onSelect} />
);

export const Loading = () => (
  <MediaRow title="Trending now" items={[]} loading />
);

export const Empty = () => (
  <MediaRow
    title="Because you watched Fight Club"
    items={[]}
    emptyMessage="We couldn't find anything similar. Try asking for something else."
  />
);

export const SingleItem = () => (
  <MediaRow
    title="Top result"
    items={popularMovies.slice(4, 5)}
    onSelect={onSelect}
  />
);

/**
 * End-to-end D-pad check: up/down moves between the voice bar and rows,
 * left/right moves within a row, and each row remembers its last tile.
 * Click a tile (or press Tab) first so the page has keyboard focus.
 */
export const KeyboardPlayground = () => {
  const ref = useRef<HTMLDivElement>(null);
  useSectionNav(ref);

  return (
    <div ref={ref} className="flex flex-col gap-8">
      <div data-nav-section>
        <VoiceBar status="idle" onActivate={action("onActivate")} />
      </div>
      <MediaRow
        title="Most popular of all time"
        items={popularMovies}
        onSelect={onSelect}
      />
      <MediaRow title="Loading row (skipped)" items={[]} loading />
      <MediaRow title="Brad Pitt" items={bradPittMovies} onSelect={onSelect} />
      <MediaRow
        title="Coming soon"
        items={upcomingMovies}
        onSelect={onSelect}
      />
    </div>
  );
};
