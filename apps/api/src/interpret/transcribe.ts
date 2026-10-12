import { toFile } from "openai";
import { config, getOpenAI } from "../env.js";

export async function transcribe(
  audio: Buffer,
  filename: string,
  mimeType: string,
): Promise<string> {
  const transcription = await getOpenAI().audio.transcriptions.create({
    file: await toFile(audio, filename, { type: mimeType }),
    model: config.transcribeModel,
    // Biases recognition towards the domain vocabulary.
    prompt:
      "Requests about movies, TV shows and actors, e.g. 'Find me a show similar to Breaking Bad', 'Go back'.",
  });
  return transcription.text.trim();
}
