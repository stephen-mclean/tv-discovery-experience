import { Row } from "../Row";
import type { MediaSummary } from "../types";
import { PosterTile, PosterTileSkeleton, type TileSize } from "./PosterTile";

export interface MediaRowProps {
  title: string;
  items: MediaSummary[];
  onSelect?: (item: MediaSummary) => void;
  loading?: boolean;
  emptyMessage?: string;
  size?: TileSize;
  className?: string;
}

/** A titled row of poster tiles: the "list display" on browse screens. */
export function MediaRow({ onSelect, size, ...rowProps }: MediaRowProps) {
  return (
    <Row
      {...rowProps}
      getKey={(item) => item.id}
      renderSkeleton={() => <PosterTileSkeleton size={size} />}
      renderItem={(item, rovingProps) => (
        <PosterTile
          item={item}
          onSelect={onSelect}
          size={size}
          {...rovingProps}
        />
      )}
    />
  );
}
