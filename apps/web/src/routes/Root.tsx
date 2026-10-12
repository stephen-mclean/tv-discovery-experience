import type { InterpretResponse } from "@repo/contracts";
import { NAV_SECTION_ATTR, useSectionNav, VoiceBar } from "@repo/ui";
import { MotionConfig } from "motion/react";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { useVoice } from "../useVoice.ts";

function isEditable(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

export default function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  useSectionNav(ref);

  function goBack() {
    // React Router keeps the history index in state; at 0 there's nowhere in
    // the app to go back to, so go home instead of leaving the app.
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
    if (idx > 0) void navigate(-1);
    else void navigate("/home");
  }

  const voice = useVoice((res: InterpretResponse) => {
    if (res.action.kind === "back") goBack();
    else if (res.action.kind === "navigate") void navigate(res.action.route);
    return res.answer ?? (res.resolved ? `Showing ${res.resolved.title}` : "");
  });

  // Back with one key from anywhere: Escape, or Backspace outside text fields.
  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (
        e.key === "Escape" ||
        (e.key === "Backspace" && !isEditable(e.target))
      ) {
        e.preventDefault();
        goBack();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  // Left/right between the header controls (nav links and the mic).
  function onHeaderKeyDown(e: KeyboardEvent<HTMLElement>) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;
    const controls = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>("a[href], button"),
    );
    const index = controls.indexOf(document.activeElement as HTMLElement);
    if (index === -1) return;
    e.preventDefault();
    controls[index + step]?.focus();
  }

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="min-h-screen bg-canvas font-sans text-fg">
        <header
          {...{ [NAV_SECTION_ATTR]: "" }}
          onKeyDown={onHeaderKeyDown}
          className="absolute inset-x-0 top-0 z-10 flex items-center gap-8 px-safe-x pt-safe-y"
        >
          <nav className="flex shrink-0 items-center gap-2">
            <HeaderLink to="/home">Home</HeaderLink>
            <HeaderLink to="/search">Search</HeaderLink>
          </nav>
          <VoiceBar
            status={voice.status}
            transcript={voice.transcript}
            message={voice.message}
            onActivate={() => void voice.activate()}
            className="max-w-5xl flex-1"
          />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </MotionConfig>
  );
}

function HeaderLink({ to, children }: { to: string; children: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "focus-ring rounded-full px-6 py-3 text-body font-semibold tv-focus:focus-ring-on",
          isActive ? "bg-surface-raised text-fg" : "text-fg-muted",
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}
