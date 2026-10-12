import { action, type StoryDefault } from "@ladle/react";
import { MediaRow, PersonRow, PersonTile, useSectionNav } from "@repo/ui";
import { useRef } from "react";
import { bradPittMovies } from "./fixtures/movies";
import {
  bradPitt,
  fightClubCast,
  longNameCast,
  noPhotoCast,
} from "./fixtures/people";

export default {
  title: "People / PersonRow",
} satisfies StoryDefault;

const onSelect = action("onSelect");

export const Tile = () => (
  <div className="flex gap-10 p-6">
    <PersonTile person={bradPitt} onSelect={onSelect} />
    <PersonTile person={bradPitt} onSelect={onSelect} focused />
  </div>
);

export const CastRow = () => (
  <PersonRow title="Cast" people={fightClubCast} onSelect={onSelect} />
);

export const NoPhoto = () => (
  <PersonRow
    title="Cast (no photos)"
    people={noPhotoCast}
    onSelect={onSelect}
  />
);

export const LongNames = () => (
  <PersonRow
    title="Cast (long names)"
    people={longNameCast}
    onSelect={onSelect}
  />
);

export const Loading = () => <PersonRow title="Cast" people={[]} loading />;

export const Empty = () => (
  <PersonRow
    title="Cast"
    people={[]}
    emptyMessage="No cast information available."
  />
);

/** "What movies has Brad Pitt been in?" */
export const PersonWithFilmography = () => {
  const ref = useRef<HTMLDivElement>(null);
  useSectionNav(ref);

  return (
    <div ref={ref} className="flex flex-col gap-8">
      <div data-nav-section className="flex items-center gap-8">
        <PersonTile person={bradPitt} onSelect={onSelect} />
        <div>
          <h1 className="text-title font-bold">{bradPitt.name}</h1>
          <p className="text-body text-fg-muted">
            {bradPittMovies.length} movies
          </p>
        </div>
      </div>
      <MediaRow
        title="Known for"
        items={bradPittMovies}
        onSelect={action("onSelectMedia")}
      />
    </div>
  );
};
