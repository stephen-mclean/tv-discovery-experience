import { ListName, MediaType, TitleMediaType } from "@repo/contracts";
import { Router } from "express";
import { z } from "zod";
import { HttpError } from "../http-error.js";
import {
  getDetail,
  getHome,
  getList,
  getSimilar,
  searchByQuery,
} from "../tmdb/media.js";

export const mediaRouter = Router();

mediaRouter.get("/home", async (_req, res) => {
  res.json(await getHome());
});

// Mirrors the /search page params (see apps/web/src/routes/Search.tsx).
const SearchQuery = z.object({
  q: z.string().trim().min(1).optional(),
  list: ListName.optional(),
  type: MediaType.optional(),
  similarTo: z
    .string()
    .regex(/^(movie|tv):\d+$/, "expected movie:<id> or tv:<id>")
    .optional(),
  page: z.coerce.number().int().min(1).max(500).default(1),
});

mediaRouter.get("/search", async (req, res) => {
  const { q, list, type, similarTo, page } = SearchQuery.parse(req.query);

  if (q) {
    res.json(await searchByQuery(q, type ?? null, page));
  } else if (list) {
    res.json(await getList(list, TitleMediaType.parse(type ?? "movie"), page));
  } else if (similarTo) {
    const [similarType, id] = similarTo.split(":");
    res.json(
      await getSimilar(TitleMediaType.parse(similarType), Number(id), page),
    );
  } else {
    throw new HttpError(400, "Provide one of q, list or similarTo");
  }
});

const DetailParams = z.object({
  mediaType: MediaType,
  id: z.coerce.number().int().positive(),
});

mediaRouter.get("/detail/:mediaType/:id", async (req, res) => {
  const { mediaType, id } = DetailParams.parse(req.params);
  res.json(await getDetail(mediaType, id));
});
