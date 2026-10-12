import { Link } from "react-router";

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <p>Trending movies, TV shows and people will go here.</p>
      <ul>
        <li>
          <Link to="/search?list=trending&type=movie">Trending movies</Link>
        </li>
        <li>
          <Link to="/search?list=popular&type=tv">Popular TV</Link>
        </li>
        <li>
          <Link to="/detail/movie/550">Fight Club</Link>
        </li>
        <li>
          <Link to="/detail/tv/1396">Breaking Bad</Link>
        </li>
        <li>
          <Link to="/detail/person/287">Brad Pitt</Link>
        </li>
      </ul>
    </>
  );
}
