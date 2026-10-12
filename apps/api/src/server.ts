import express, { type ErrorRequestHandler, type Express } from "express";
import multer from "multer";
import { z } from "zod";
import { HttpError } from "./http-error.js";
import { interpretRouter } from "./routes/interpret.js";
import { mediaRouter } from "./routes/media.js";

// Every error becomes a JSON `{ error }` body (see ErrorResponse in contracts).
// Express identifies error handlers by arity, so all four params are needed.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({ error: z.prettifyError(err) });
  } else if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
  } else if (err instanceof multer.MulterError) {
    res
      .status(err.code === "LIMIT_FILE_SIZE" ? 413 : 400)
      .json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createServer = (): Express => {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api", mediaRouter);
  app.use("/api", interpretRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
  app.use(errorHandler);

  return app;
};
