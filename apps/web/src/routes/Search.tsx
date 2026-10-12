import type { MediaCard, SearchResponse } from "@repo/contracts";
import { MediaRow, NAV_SECTION_ATTR } from "@repo/ui";
import { useRef, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { api, useApi } from "../api.ts";
import { CardRow, ErrorMessage } from "../components/CardRow.tsx";
import { useAutoFocus } from "../useAutoFocus.ts";

// /search is the generic list page. Which list it shows is driven by query
// params, so voice responses can navigate straight to a result set:
//   ?q=heist+movies                 free-text search
//   ?list=popular&type=movie        curated list
//   ?similarTo=tv:1396              titles similar to a given title
const GROUPS: { type: MediaCard["mediaType"]; label: string }[] = [
  { type: "movie", label: "Movies" },
  { type: "tv", label: "TV shows" },
  { type: "person", label: "People" },
];

export default function Search() {
  const [params] = useSearchParams();
  const hasQuery = ["q", "list", "similarTo"].some((key) => params.has(key));

  return (
    <div className="flex flex-col gap-8 px-safe-x pt-40 pb-safe-y">
      <SearchForm initial={params.get("q") ?? ""} autoFocus={!hasQuery} />
      {hasQuery && <Results params={params} />}
    </div>
  );
}

function Results({ params }: { params: URLSearchParams }) {
  const ref = useRef<HTMLDivElement>(null);
  const url = api.search(params);
  const { data, error, loading } = useApi<SearchResponse>(url);
  useAutoFocus(ref, !!data && data.items.length > 0, url);

  // Free-text results mix types, so split them into a row per type.
  const rows = params.has("q")
    ? GROUPS.map((g) => ({
        title: g.label,
        items: data?.items.filter((c) => c.mediaType === g.type) ?? [],
      })).filter((row) => row.items.length > 0)
    : [{ title: "Results", items: data?.items ?? [] }];

  return (
    <div ref={ref} className="flex flex-col gap-6">
      <h1 className="text-title font-bold text-fg">
        {data?.title ?? "Searching…"}
      </h1>
      {error && <ErrorMessage error={error} />}
      {loading && <MediaRow title="Results" items={[]} loading />}
      {data && data.items.length === 0 && (
        <p className="text-body text-fg-muted">
          No results. Try saying something like “Find me a show like Breaking
          Bad”.
        </p>
      )}
      {data && rows.map((row) => <CardRow key={row.title} {...row} />)}
    </div>
  );
}

function SearchForm({
  initial,
  autoFocus,
}: {
  initial: string;
  autoFocus: boolean;
}) {
  const navigate = useNavigate();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    if (q) void navigate(`/search?${new URLSearchParams({ q }).toString()}`);
  }

  return (
    <form
      {...{ [NAV_SECTION_ATTR]: "" }}
      role="search"
      onSubmit={onSubmit}
      className="flex max-w-4xl"
    >
      <input
        key={initial}
        name="q"
        type="search"
        // Explicit tabIndex so section nav (ArrowUp from the results) lands here.
        tabIndex={0}
        defaultValue={initial}
        autoFocus={autoFocus}
        placeholder="Search movies, TV shows and people"
        aria-label="Search"
        className="focus-ring w-full rounded-full border-2 border-surface-raised bg-surface px-8 py-4 text-body text-fg placeholder:text-fg-muted tv-focus:focus-ring-on"
      />
    </form>
  );
}
