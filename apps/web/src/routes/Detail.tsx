import type { DetailResponse, PersonDetail } from "@repo/contracts";
import { formatDate, MediaDetail } from "@repo/ui";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router";
import {
  api,
  detailRoute,
  personRoute,
  toMediaDetail,
  useApi,
} from "../api.ts";
import { CardRow, ErrorMessage } from "../components/CardRow.tsx";
import { useAutoFocus } from "../useAutoFocus.ts";
import NotFound from "./NotFound.tsx";

// TMDB ids collide across media types, so the type is part of the route.
const mediaTypes = ["movie", "tv", "person"] as const;
type MediaType = (typeof mediaTypes)[number];

function isMediaType(value: string | undefined): value is MediaType {
  return mediaTypes.includes(value as MediaType);
}

export default function Detail() {
  const { mediaType, id } = useParams();

  if (!isMediaType(mediaType) || !id || !/^\d+$/.test(id)) return <NotFound />;

  return <DetailPage mediaType={mediaType} id={id} />;
}

function DetailPage({ mediaType, id }: { mediaType: MediaType; id: string }) {
  const navigate = useNavigate();
  const { data, error } = useApi<DetailResponse>(api.detail(mediaType, id));

  if (error) {
    return (
      <div className="px-safe-x pt-40">
        <ErrorMessage error={error} />
      </div>
    );
  }
  if (!data) return <DetailSkeleton />;

  if (data.mediaType === "person") return <PersonPage person={data} />;

  return (
    <MediaDetail
      media={toMediaDetail(data)}
      onSelectMedia={(item) => void navigate(detailRoute(item.id))}
      onSelectPerson={(person) => void navigate(personRoute(person))}
    />
  );
}

function PersonPage({ person }: { person: PersonDetail }) {
  const ref = useRef<HTMLDivElement>(null);
  useAutoFocus(ref, true, String(person.id));

  const born = formatDate(person.birthday ?? undefined);
  const died = formatDate(person.deathday ?? undefined);
  const facts = [
    person.knownFor,
    born &&
      `Born ${born}${person.placeOfBirth ? ` in ${person.placeOfBirth}` : ""}`,
    died && `Died ${died}`,
  ].filter(Boolean);

  return (
    <div ref={ref} className="flex flex-col gap-10 px-safe-x pt-48 pb-safe-y">
      <section className="flex gap-12">
        <div className="aspect-2/3 w-72 shrink-0 overflow-hidden rounded-2xl bg-surface-raised">
          {person.profileUrl && (
            <img
              src={person.profileUrl}
              alt=""
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="flex max-w-[70ch] flex-col gap-4">
          <h1 className="text-display text-fg">{person.name}</h1>
          {facts.length > 0 && (
            <p className="text-body text-fg-muted">{facts.join(" · ")}</p>
          )}
          {person.biography && (
            <p className="line-clamp-8 text-body text-fg">{person.biography}</p>
          )}
        </div>
      </section>
      <CardRow
        title="Known for"
        items={person.credits}
        emptyMessage="No credits found."
      />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div aria-busy className="flex flex-col gap-6 px-safe-x pt-[40vh]">
      <div className="h-16 w-1/3 rounded-lg bg-surface-raised motion-safe:animate-pulse" />
      <div className="h-8 w-1/4 rounded-lg bg-surface-raised motion-safe:animate-pulse" />
      <div className="h-32 w-1/2 rounded-lg bg-surface-raised motion-safe:animate-pulse" />
    </div>
  );
}
