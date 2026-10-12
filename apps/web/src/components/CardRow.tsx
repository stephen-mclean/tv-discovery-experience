import type { MediaCard } from "@repo/contracts";
import { MediaRow, PersonRow } from "@repo/ui";
import { useNavigate } from "react-router";
import {
  detailRoute,
  personRoute,
  toMediaSummary,
  toPersonSummary,
} from "../api.ts";

/** A row of API cards: people get round headshots, titles get posters. */
export function CardRow({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: MediaCard[];
  emptyMessage?: string;
}) {
  const navigate = useNavigate();
  const people =
    items.length > 0 && items.every((c) => c.mediaType === "person");

  return people ? (
    <PersonRow
      title={title}
      people={items.map(toPersonSummary)}
      onSelect={(person) => void navigate(personRoute(person))}
    />
  ) : (
    <MediaRow
      title={title}
      items={items.map(toMediaSummary)}
      emptyMessage={emptyMessage}
      onSelect={(item) => void navigate(detailRoute(item.id))}
    />
  );
}

export function ErrorMessage({ error }: { error: string }) {
  return (
    <p role="alert" className="text-body text-danger">
      Something went wrong: {error}
    </p>
  );
}
