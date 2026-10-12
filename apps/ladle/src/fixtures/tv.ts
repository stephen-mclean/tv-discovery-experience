import type { MediaDetailData, MediaSummary } from "@repo/ui";
import { backdrop, poster, profile } from "./images";

/** "Find me a show similar to Breaking Bad" */
export const similarToBreakingBad: MediaSummary[] = [
  {
    id: "tv:60059",
    type: "tv",
    title: "Better Call Saul",
    year: 2015,
    rating: 8.7,
    posterUrl: poster("/fC2HDm5t0kHl7mTm7jxMR31b7by.jpg"),
  },
  {
    id: "tv:69740",
    type: "tv",
    title: "Ozark",
    year: 2017,
    rating: 8.2,
    posterUrl: poster("/pCGyPVrI9Fzw6rE1Pvi4BIXF6ET.jpg"),
  },
  {
    id: "tv:63351",
    type: "tv",
    title: "Narcos",
    year: 2015,
    rating: 8.1,
    posterUrl: poster("/rTmal9fDbwh5F0waol2hq35U4ah.jpg"),
  },
  {
    id: "tv:1398",
    type: "tv",
    title: "The Sopranos",
    year: 1999,
    rating: 8.6,
    posterUrl: poster("/rTc7ZXdroqjkKivFPvCPX0Ru7uw.jpg"),
  },
  {
    id: "tv:1438",
    type: "tv",
    title: "The Wire",
    year: 2002,
    rating: 8.6,
    posterUrl: poster("/4lbclFySvugI51fwsyxBTOm4DqK.jpg"),
  },
  {
    id: "tv:60574",
    type: "tv",
    title: "Peaky Blinders",
    year: 2013,
    rating: 8.5,
  },
];

export const tvShows: MediaSummary[] = [
  {
    id: "tv:1396",
    type: "tv",
    title: "Breaking Bad",
    year: 2008,
    rating: 8.9,
    posterUrl: poster("/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"),
  },
  ...similarToBreakingBad,
];

export const breakingBad: MediaDetailData = {
  id: "tv:1396",
  type: "tv",
  title: "Breaking Bad",
  posterUrl: poster("/ggFHVNu6YYI5L9pCfOacjizRGt.jpg"),
  backdropUrl: backdrop("/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg"),
  year: 2008,
  releaseDate: "2008-01-20",
  rating: 8.9,
  tagline: "Change the equation.",
  overview:
    "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.",
  genres: ["Drama", "Crime"],
  seasons: 5,
  episodes: 62,
  status: "Ended",
  certification: "TV-MA",
  credits: [
    {
      label: "Created by",
      people: [
        {
          id: "person:66633",
          name: "Vince Gilligan",
          profileUrl: profile("/uFh3OrBvkwKSU3N5y0XnXOhqBJz.jpg"),
          role: "Creator",
        },
      ],
    },
  ],
  cast: [
    {
      id: "person:17419",
      name: "Bryan Cranston",
      role: "Walter White",
      profileUrl: profile("/7Jahy5LZX2Fo8fGJltMreAI49hC.jpg"),
    },
    {
      id: "person:84497",
      name: "Aaron Paul",
      role: "Jesse Pinkman",
      profileUrl: profile("/8Ac9uuoYwZoYVAIJfRLzzLsGGJn.jpg"),
    },
    {
      id: "person:134531",
      name: "Anna Gunn",
      role: "Skyler White",
      profileUrl: profile("/adppyeu1a4REN3khtgmXusrapFi.jpg"),
    },
    { id: "person:14329", name: "Dean Norris", role: "Hank Schrader" },
    { id: "person:209674", name: "Betsy Brandt", role: "Marie Schrader" },
    { id: "person:1217934", name: "RJ Mitte", role: "Walter White Jr." },
  ],
  similar: similarToBreakingBad,
};
