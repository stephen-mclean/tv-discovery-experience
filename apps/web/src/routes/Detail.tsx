import { Link, useParams } from "react-router";
import NotFound from "./NotFound.tsx";

// TMDB ids collide across media types, so the type is part of the route.
const mediaTypes = ["movie", "tv", "person"] as const;
type MediaType = (typeof mediaTypes)[number];

function isMediaType(value: string | undefined): value is MediaType {
  return mediaTypes.includes(value as MediaType);
}

export default function Detail() {
  const { mediaType, id } = useParams();

  if (!isMediaType(mediaType) || !id) return <NotFound />;

  return (
    <>
      <h1>
        {mediaType} {id}
      </h1>
      {mediaType === "person" ? (
        <p>Biography and credits will go here.</p>
      ) : (
        <>
          <p>Title details and cast will go here.</p>
          <Link to={`/search?similarTo=${mediaType}:${id}`}>
            More like this
          </Link>
        </>
      )}
    </>
  );
}
