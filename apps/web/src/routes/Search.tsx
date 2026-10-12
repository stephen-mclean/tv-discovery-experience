import { Link, useSearchParams } from "react-router";

// /search is the generic list page. Which list it shows is driven by query
// params, so voice responses can navigate straight to a result set:
//   ?q=heist+movies                 free-text search
//   ?list=popular&type=movie        curated list
//   ?similarTo=tv:1396              titles similar to a given title
function describe(params: URLSearchParams): string {
  const q = params.get("q");
  if (q) return `Results for "${q}"`;

  const list = params.get("list");
  if (list) return `${list} ${params.get("type") ?? "movie"}`;

  const similarTo = params.get("similarTo");
  if (similarTo) return `Similar to ${similarTo}`;

  return "Search";
}

export default function Search() {
  const [params] = useSearchParams();

  return (
    <>
      <h1>{describe(params)}</h1>
      <p>A list of results will go here.</p>
      <ul>
        <li>
          <Link to="/search?q=heist+movies">?q=heist+movies</Link>
        </li>
        <li>
          <Link to="/search?list=upcoming&type=movie">
            ?list=upcoming&amp;type=movie
          </Link>
        </li>
        <li>
          <Link to="/search?similarTo=tv:1396">?similarTo=tv:1396</Link>
        </li>
      </ul>
    </>
  );
}
