import { action, type Story, type StoryDefault } from "@ladle/react";
import { VoiceBar, type VoiceBarHandle, type VoiceStatus } from "@repo/ui";
import { useEffect, useRef, useState } from "react";

export default { title: "Voice / VoiceBar" } satisfies StoryDefault;

const onActivate = action("onActivate");
const QUERY = "Find me a show similar to Breaking Bad";

export const Idle = () => <VoiceBar status="idle" onActivate={onActivate} />;

export const Listening = () => (
  <VoiceBar
    status="listening"
    transcript="Find me a show similar to"
    onActivate={onActivate}
  />
);

export const ListeningNoTranscript = () => (
  <VoiceBar status="listening" onActivate={onActivate} />
);

export const Processing = () => (
  <VoiceBar status="processing" transcript={QUERY} onActivate={onActivate} />
);

export const Result = () => (
  <VoiceBar
    status="result"
    transcript={QUERY}
    message="Here are 6 shows like Breaking Bad"
    onActivate={onActivate}
  />
);

export const ErrorState = () => (
  <VoiceBar
    status="error"
    transcript="Find me a sho—"
    message="Sorry, I didn't catch that. Press / and try again."
    onActivate={onActivate}
  />
);

export const LongTranscript = () => (
  <VoiceBar
    status="result"
    transcript="Find me a really long and specific list of nineties crime thrillers with twist endings that are under two hours and streaming somewhere"
    message="Here are 12 crime thrillers from the 1990s with twist endings, all under two hours"
    onActivate={onActivate}
  />
);

type PlaygroundArgs = {
  status: VoiceStatus;
  transcript: string;
  message: string;
};

/** Switch status, transcript and message from the controls panel. */
export const Playground: Story<PlaygroundArgs> = (args) => (
  <VoiceBar {...args} onActivate={onActivate} />
);
Playground.args = {
  status: "processing",
  transcript: QUERY,
  message: "Here are 6 shows like Breaking Bad",
};
Playground.argTypes = {
  status: {
    options: ["idle", "listening", "processing", "result", "error"],
    control: { type: "radio" },
  },
};

const SCRIPT: { status: VoiceStatus; transcript?: string; ms: number }[] = [
  { status: "listening", ms: 600 },
  { status: "listening", transcript: "Find me a show", ms: 700 },
  { status: "listening", transcript: QUERY, ms: 900 },
  { status: "processing", transcript: QUERY, ms: 2200 },
  { status: "result", transcript: QUERY, ms: 0 },
];

/**
 * Press the mic (or the "/" hotkey) to run through
 * idle → listening → processing → result.
 */
export const Interactive = () => {
  const [step, setStep] = useState(-1);
  const current = SCRIPT[step];

  useEffect(() => {
    if (!current || current.ms === 0) return;
    const timer = setTimeout(() => setStep((s) => s + 1), current.ms);
    return () => clearTimeout(timer);
  }, [current]);

  return (
    <VoiceBar
      status={current?.status ?? "idle"}
      transcript={current?.transcript}
      message="Here are 6 shows like Breaking Bad"
      onActivate={() => {
        onActivate();
        setStep(0);
      }}
    />
  );
};

type HotkeyArgs = { keys: string; enabled: boolean };

/**
 * Change the keys (comma separated) and toggle the hotkey from the controls.
 * The hint text follows, and typing in the input below never triggers it.
 */
export const Hotkey: Story<HotkeyArgs> = ({ keys, enabled }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<VoiceBarHandle>(null);
  const keyList = keys
    .split(",")
    .map((k) => (k.trim() === "" && k.length > 0 ? " " : k.trim()))
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-8">
      <VoiceBar
        ref={ref}
        status="idle"
        hotkey={{ keys: keyList, enabled }}
        onActivate={() => {
          onActivate();
          setCount((c) => c + 1);
        }}
      />
      <p className="text-body">
        Activated <span className="font-bold text-accent">{count}</span> times
      </p>
      <label className="flex max-w-xl flex-col gap-2 text-caption text-fg-muted">
        Typing here must not trigger the hotkey
        <input className="rounded-lg bg-surface-raised px-4 py-3 text-body text-fg" />
      </label>
      <button
        type="button"
        onClick={() => ref.current?.activate()}
        className="focus-ring self-start rounded-full bg-surface-raised px-6 py-3 text-body tv-focus:focus-ring-on"
      >
        Call ref.activate() (remote mic button)
      </button>
    </div>
  );
};
Hotkey.args = { keys: "/, m", enabled: true };
