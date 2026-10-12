import type { MediaDetailData, MediaSummary } from "@repo/ui";
import { backdrop, poster, profile } from "./images";

/** "Find me the most popular movies of all time" */
export const popularMovies: MediaSummary[] = [
  {
    id: "movie:278",
    type: "movie",
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 8.7,
    posterUrl: poster("/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"),
  },
  {
    id: "movie:238",
    type: "movie",
    title: "The Godfather",
    year: 1972,
    rating: 8.7,
    posterUrl: poster("/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"),
  },
  {
    id: "movie:155",
    type: "movie",
    title: "The Dark Knight",
    year: 2008,
    rating: 8.5,
    posterUrl: poster("/qJ2tW6WMUDux911r6m7haRef0WH.jpg"),
  },
  {
    id: "movie:680",
    type: "movie",
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.5,
    posterUrl: poster("/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"),
  },
  {
    id: "movie:550",
    type: "movie",
    title: "Fight Club",
    year: 1999,
    rating: 8.4,
    posterUrl: poster("/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"),
  },
  {
    id: "movie:13",
    type: "movie",
    title: "Forrest Gump",
    year: 1994,
    rating: 8.5,
    posterUrl: poster("/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg"),
  },
  {
    id: "movie:27205",
    type: "movie",
    title: "Inception",
    year: 2010,
    rating: 8.4,
    posterUrl: poster("/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg"),
  },
  {
    id: "movie:157336",
    type: "movie",
    title: "Interstellar",
    year: 2014,
    rating: 8.5,
    posterUrl: poster("/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"),
  },
  {
    id: "movie:807",
    type: "movie",
    title: "Se7en",
    year: 1995,
    rating: 8.4,
    posterUrl: poster("/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg"),
  },
  // Missing poster: renders the fallback tile.
  {
    id: "movie:129",
    type: "movie",
    title: "Spirited Away",
    year: 2001,
    rating: 8.5,
  },
];

/** "What movies are coming out soon?" Posters aren't out yet for most. */
export const upcomingMovies: MediaSummary[] = [
  {
    id: "movie:9001",
    type: "movie",
    title: "The Batman Part II",
    year: 2027,
    releaseDate: "2027-10-01",
  },
  {
    id: "movie:9002",
    type: "movie",
    title: "Avengers: Secret Wars",
    year: 2027,
    releaseDate: "2027-12-17",
  },
  {
    id: "movie:9003",
    type: "movie",
    title: "Shrek 5",
    year: 2027,
    releaseDate: "2027-06-30",
  },
  {
    id: "movie:9004",
    type: "movie",
    title: "The Lord of the Rings: The Hunt for Gollum",
    year: 2027,
    releaseDate: "2027-12-17",
  },
];

/** "What movies has Brad Pitt been in?" */
export const bradPittMovies: MediaSummary[] = [
  {
    id: "movie:550",
    type: "movie",
    title: "Fight Club",
    year: 1999,
    rating: 8.4,
    posterUrl: poster("/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"),
  },
  {
    id: "movie:807",
    type: "movie",
    title: "Se7en",
    year: 1995,
    rating: 8.4,
    posterUrl: poster("/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg"),
  },
  {
    id: "movie:16869",
    type: "movie",
    title: "Inglourious Basterds",
    year: 2009,
    rating: 8.2,
    posterUrl: poster("/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg"),
  },
  {
    id: "movie:466272",
    type: "movie",
    title: "Once Upon a Time… in Hollywood",
    year: 2019,
    rating: 7.4,
    posterUrl: poster("/8j58iEBw9pOXFD2L0nt0ZXeHviB.jpg"),
  },
  {
    id: "movie:161",
    type: "movie",
    title: "Ocean's Eleven",
    year: 2001,
    rating: 7.4,
    posterUrl: poster("/hQQCdZrsHtZyR6NbKH2YyCqd2fR.jpg"),
  },
  {
    id: "movie:60308",
    type: "movie",
    title: "Moneyball",
    year: 2011,
    rating: 7.2,
    posterUrl: poster("/4yIQq1e6iOcaZ5rLDG3lZBP3j7a.jpg"),
  },
  {
    id: "movie:652",
    type: "movie",
    title: "Troy",
    year: 2004,
    rating: 7.1,
    posterUrl: poster("/a07wLy4ONfpsjnBqMwhlWTJTcm.jpg"),
  },
];

export const fightClub: MediaDetailData = {
  id: "movie:550",
  type: "movie",
  title: "Fight Club",
  posterUrl: poster("/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"),
  backdropUrl: backdrop("/hZkgoQYus5vegHoetLkCJzb17zJ.jpg"),
  year: 1999,
  releaseDate: "1999-10-15",
  rating: 8.4,
  tagline: "Mischief. Mayhem. Soap.",
  overview:
    'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion. What begins as a way to feel something soon becomes a movement with rules of its own, and the narrator realises he no longer knows where Tyler ends and he begins.',
  genres: ["Drama", "Thriller"],
  runtimeMinutes: 139,
  status: "Released",
  certification: "R",
  credits: [
    {
      label: "Director",
      people: [
        {
          id: "person:7467",
          name: "David Fincher",
          profileUrl: profile("/tpEczFclQZeKAiCeKZZ0adRvtfz.jpg"),
          role: "Director",
        },
      ],
    },
    {
      label: "Screenplay",
      people: [{ id: "person:7468", name: "Jim Uhls", role: "Screenplay" }],
    },
    {
      label: "Novel",
      people: [{ id: "person:7469", name: "Chuck Palahniuk", role: "Novel" }],
    },
  ],
  cast: [
    {
      id: "person:287",
      name: "Brad Pitt",
      role: "Tyler Durden",
      profileUrl: profile("/cckcYc2v0yh1tc9QjRelptcOBko.jpg"),
    },
    {
      id: "person:819",
      name: "Edward Norton",
      role: "Narrator",
      profileUrl: profile("/8nytsqL59SFJTVYVrN72k6qkGgJ.jpg"),
    },
    {
      id: "person:1283",
      name: "Helena Bonham Carter",
      role: "Marla Singer",
      profileUrl: profile("/DDeITcCpnBd0CkAIRPhggy9bt5.jpg"),
    },
    {
      id: "person:7470",
      name: "Meat Loaf",
      role: 'Robert "Bob" Paulson',
      profileUrl: profile("/7gKLR1u46OB8WJ6m06LemNBCMx6.jpg"),
    },
    { id: "person:7499", name: "Jared Leto", role: "Angel Face" },
    { id: "person:7471", name: "Zach Grenier", role: "Richard Chesler" },
  ],
  similar: popularMovies.filter((m) => m.id !== "movie:550"),
};

export const upcomingMovie: MediaDetailData = {
  id: "movie:9001",
  type: "movie",
  title: "The Batman Part II",
  year: 2027,
  releaseDate: "2027-10-01",
  tagline: "The sequel to The Batman.",
  overview:
    "Bruce Wayne returns to the streets of Gotham as the city reckons with the fallout of the Riddler's attack.",
  genres: ["Crime", "Mystery", "Action"],
  status: "In Production",
  credits: [
    {
      label: "Director",
      people: [{ id: "person:9101", name: "Matt Reeves", role: "Director" }],
    },
  ],
  cast: [
    {
      id: "person:11288",
      name: "Robert Pattinson",
      role: "Bruce Wayne / The Batman",
    },
  ],
  similar: upcomingMovies.filter((m) => m.id !== "movie:9001"),
};

/** TMDB data is often incomplete: no backdrop, overview, cast or credits. */
export const sparseMovie: MediaDetailData = {
  id: "movie:9999",
  type: "movie",
  title: "An Obscure Short Film With Almost No Metadata",
  genres: [],
  credits: [],
  cast: [],
  similar: [],
};
