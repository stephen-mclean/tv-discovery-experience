import type { PersonSummary } from "@repo/ui";
import { profile } from "./images";
import { fightClub } from "./movies";

export const bradPitt: PersonSummary = {
  id: "person:287",
  name: "Brad Pitt",
  role: "Actor",
  profileUrl: profile("/cckcYc2v0yh1tc9QjRelptcOBko.jpg"),
};

export const fightClubCast = fightClub.cast;

export const noPhotoCast: PersonSummary[] = [
  { id: "person:1", name: "Jared Leto", role: "Angel Face" },
  { id: "person:2", name: "Zach Grenier", role: "Richard Chesler" },
  { id: "person:3", name: "Cher", role: "Herself" },
  { id: "person:4", name: "Holt McCallany", role: "The Mechanic" },
];

export const longNameCast: PersonSummary[] = [
  {
    id: "person:10",
    name: "Maximilian Alexander Featherstonehaugh-Montgomery",
    role: "The Very Long Character Name Who Appears In Every Scene",
  },
  {
    id: "person:11",
    name: "Florence Kasumba-Oyelowo",
    role: "Detective Inspector Imogen Wolstenholme-Carrington",
  },
  { id: "person:12", name: "Mahershala Ali", role: "Himself" },
  {
    id: "person:13",
    name: "Daniel Kaluuya",
    profileUrl: "https://image.tmdb.org/t/p/w185/does-not-exist.jpg",
    role: "Broken image falls back to initials",
  },
];
