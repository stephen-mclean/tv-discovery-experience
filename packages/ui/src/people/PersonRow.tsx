import { Row } from "../Row";
import type { PersonSummary } from "../types";
import { PersonTile, PersonTileSkeleton } from "./PersonTile";

export interface PersonRowProps {
  title: string;
  people: PersonSummary[];
  onSelect?: (person: PersonSummary) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

/** A titled row of people, e.g. the cast on a detail page. */
export function PersonRow({ people, onSelect, ...rowProps }: PersonRowProps) {
  return (
    <Row
      {...rowProps}
      items={people}
      // The same person can appear twice (e.g. two roles), so include the role.
      getKey={(person) => `${person.id}:${person.role ?? ""}`}
      renderSkeleton={() => <PersonTileSkeleton />}
      renderItem={(person, rovingProps) => (
        <PersonTile person={person} onSelect={onSelect} {...rovingProps} />
      )}
    />
  );
}
