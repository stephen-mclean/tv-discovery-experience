import { action, type StoryDefault } from "@ladle/react";
import { MediaDetail } from "@repo/ui";
import { fightClub, sparseMovie, upcomingMovie } from "./fixtures/movies";
import { breakingBad } from "./fixtures/tv";

// The detail page owns its layout (full-bleed backdrop + safe-area padding).
export default {
  title: "Media / MediaDetail",
  meta: { fullBleed: true },
} satisfies StoryDefault;

const handlers = {
  onSelectMedia: action("onSelectMedia"),
  onSelectPerson: action("onSelectPerson"),
};

export const Movie = () => <MediaDetail media={fightClub} {...handlers} />;

export const TvShow = () => <MediaDetail media={breakingBad} {...handlers} />;

export const UpcomingMovie = () => (
  <MediaDetail media={upcomingMovie} {...handlers} />
);

export const SparseData = () => (
  <MediaDetail media={sparseMovie} {...handlers} />
);
