import { InterpretRequest } from "@repo/contracts";
import { Router } from "express";
import multer from "multer";
import { HttpError } from "../http-error.js";
import { ERROR_REASON, interpret } from "../interpret/pipeline.js";
import { transcribe } from "../interpret/transcribe.js";

export const interpretRouter = Router();

interpretRouter.post("/interpret", async (req, res) => {
  const { text } = InterpretRequest.parse(req.body);
  res.json(await interpret(text));
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    // Chrome/Firefox record audio/webm; Safari records audio/mp4.
    if (file.mimetype.startsWith("audio/") || file.mimetype === "video/webm") {
      cb(null, true);
    } else {
      cb(new HttpError(415, `Unsupported audio type: ${file.mimetype}`));
    }
  },
});

/** multipart/form-data with the recording in an `audio` field. */
interpretRouter.post("/voice", upload.single("audio"), async (req, res) => {
  if (!req.file) throw new HttpError(400, "Missing `audio` file");

  let transcript: string;
  try {
    transcript = await transcribe(
      req.file.buffer,
      req.file.originalname || "audio.webm",
      req.file.mimetype,
    );
  } catch (error) {
    console.error("transcription failed", error);
    res.json({
      transcript: "",
      intent: { type: "unknown" },
      action: { kind: "none", reason: ERROR_REASON },
      resolved: null,
      answer: null,
    });
    return;
  }

  res.json(await interpret(transcript));
});
