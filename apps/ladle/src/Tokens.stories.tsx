import type { StoryDefault } from "@ladle/react";

export default { title: "Foundation / Tokens" } satisfies StoryDefault;

const type = [
  ["text-display", "Display 64px"],
  ["text-title", "Title 48px"],
  ["text-heading", "Heading 32px"],
  ["text-body", "Body 24px: the minimum for running text at 10 feet."],
  ["text-caption", "Caption 20px: the smallest text we ever render."],
] as const;

const colors = [
  ["bg-canvas", "canvas"],
  ["bg-surface", "surface"],
  ["bg-surface-raised", "surface-raised"],
  ["bg-fg", "fg"],
  ["bg-fg-muted", "fg-muted"],
  ["bg-accent", "accent"],
  ["bg-danger", "danger"],
] as const;

export const Tokens = () => (
  <div className="flex flex-col gap-12">
    <section className="flex flex-col gap-4">
      <h2 className="text-caption tracking-widest text-fg-muted uppercase">
        Type scale
      </h2>
      {type.map(([className, label]) => (
        <p key={className} className={className}>
          {label}
        </p>
      ))}
    </section>

    <section className="flex flex-col gap-4">
      <h2 className="text-caption tracking-widest text-fg-muted uppercase">
        Colour
      </h2>
      <div className="flex flex-wrap gap-6">
        {colors.map(([className, label]) => (
          <div key={label} className="flex flex-col gap-2">
            <div
              className={`size-24 rounded-xl border border-surface-raised ${className}`}
            />
            <span className="text-caption text-fg-muted">{label}</span>
          </div>
        ))}
      </div>
    </section>

    <section className="flex flex-col gap-4">
      <h2 className="text-caption tracking-widest text-fg-muted uppercase">
        Focus (Tab between the samples)
      </h2>
      <div className="flex gap-10 py-6">
        <button
          type="button"
          className="focus-ring size-40 rounded-xl bg-surface-raised text-body tv-focus:focus-ring-on tv-focus:focus-lift"
        >
          Unfocused
        </button>
        <button
          type="button"
          data-focused
          className="focus-ring size-40 rounded-xl bg-surface-raised text-body tv-focus:focus-ring-on tv-focus:focus-lift"
        >
          Focused
        </button>
      </div>
    </section>
  </div>
);
