import type { InterpretResponse } from "@repo/contracts";
import type { VoiceStatus } from "@repo/ui";
import { useRef, useState } from "react";
import { interpretText, interpretVoice } from "./api.ts";

/** Recording stops on its own after this long if the user doesn't stop it. */
const MAX_RECORDING_MS = 8000;

interface VoiceState {
  status: VoiceStatus;
  transcript?: string;
  message?: string;
}

/**
 * Owns the voice flow behind the VoiceBar: press once to record, press again
 * (or wait) to send. The interpreted response goes to `onResponse`. Without a
 * microphone it falls back to a typed prompt so the flow still works.
 */
export function useVoice(onResponse: (res: InterpretResponse) => string) {
  const [state, setState] = useState<VoiceState>({ status: "idle" });
  const recorder = useRef<MediaRecorder | null>(null);

  async function submit(call: () => Promise<InterpretResponse>) {
    setState((s) => ({ status: "processing", transcript: s.transcript }));
    try {
      const res = await call();
      if (res.action.kind === "none") {
        setState({
          status: "error",
          transcript: res.transcript,
          message: res.action.reason,
        });
      } else {
        setState({
          status: "result",
          transcript: res.transcript,
          message: onResponse(res),
        });
      }
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async function activate() {
    if (state.status === "processing") return;
    if (recorder.current?.state === "recording") {
      recorder.current.stop();
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      const text = window.prompt("What would you like to watch?")?.trim();
      if (text) {
        setState({ status: "processing", transcript: text });
        void submit(() => interpretText(text));
      }
      return;
    }

    const rec = new MediaRecorder(stream);
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    rec.onstop = () => {
      clearTimeout(timeout);
      stream.getTracks().forEach((track) => track.stop());
      recorder.current = null;
      const audio = new Blob(chunks, { type: rec.mimeType });
      void submit(() => interpretVoice(audio));
    };
    const timeout = setTimeout(() => {
      if (rec.state === "recording") rec.stop();
    }, MAX_RECORDING_MS);

    recorder.current = rec;
    rec.start();
    setState({ status: "listening" });
  }

  return { ...state, activate };
}
