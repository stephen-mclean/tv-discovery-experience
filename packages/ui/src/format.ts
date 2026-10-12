// Release dates are date-only ISO strings, so format and compare them in UTC
// to avoid them shifting a day in timezones west of UTC.
const longDate = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
  timeZone: "UTC",
});

export function parseDate(iso: string | undefined): Date | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function formatDate(iso: string | undefined): string | undefined {
  const date = parseDate(iso);
  return date ? longDate.format(date) : undefined;
}

export function isUpcoming(iso: string | undefined, now = new Date()): boolean {
  const date = parseDate(iso);
  return date !== undefined && date.getTime() > now.getTime();
}

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
