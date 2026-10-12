import { action, type StoryDefault } from "@ladle/react";
import { PosterTile, PosterTileSkeleton } from "@repo/ui";
import { popularMovies, upcomingMovies } from "./fixtures/movies";

export default { title: "Media / PosterTile" } satisfies StoryDefault;

const fightClub = popularMovies.find((m) => m.id === "movie:550")!;
const onSelect = action("onSelect");

// Extra vertical room so the focus scale and title aren't cramped.
const Stage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-10 p-6">{children}</div>
);

export const Default = () => (
  <Stage>
    <PosterTile item={fightClub} onSelect={onSelect} />
  </Stage>
);

export const Focused = () => (
  <Stage>
    <PosterTile item={fightClub} onSelect={onSelect} />
    <PosterTile item={fightClub} onSelect={onSelect} focused />
  </Stage>
);

export const NoPoster = () => (
  <Stage>
    <PosterTile
      item={{ id: "a", type: "movie", title: "Spirited Away", year: 2001 }}
    />
    <PosterTile
      item={{
        id: "b",
        type: "tv",
        title: "Peaky Blinders",
        year: 2013,
        rating: 8.5,
      }}
    />
    <PosterTile
      item={{
        id: "c",
        type: "movie",
        title: "Broken image URL",
        posterUrl: "https://image.tmdb.org/t/p/w342/does-not-exist.jpg",
      }}
    />
  </Stage>
);

export const LongTitle = () => (
  <Stage>
    <PosterTile
      focused
      item={{
        ...fightClub,
        id: "long",
        title:
          "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
        year: 1964,
      }}
    />
    <PosterTile
      item={{
        id: "long-fallback",
        type: "movie",
        title:
          "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
        year: 1964,
      }}
    />
  </Stage>
);

export const ComingSoon = () => (
  <Stage>
    <PosterTile item={upcomingMovies[0]!} />
    <PosterTile
      item={{ ...fightClub, id: "soon", releaseDate: "2099-01-01" }}
    />
  </Stage>
);

export const Loading = () => (
  <Stage>
    <PosterTileSkeleton />
    <PosterTileSkeleton size="lg" />
  </Stage>
);

export const Large = () => (
  <Stage>
    <PosterTile item={fightClub} size="lg" onSelect={onSelect} />
    <PosterTile item={fightClub} size="lg" onSelect={onSelect} focused />
  </Stage>
);
