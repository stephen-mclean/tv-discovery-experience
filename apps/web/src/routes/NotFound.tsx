import { Link } from "react-router";

export default function NotFound() {
  return (
    <>
      <h1>Not found</h1>
      <Link to="/home">Back to home</Link>
    </>
  );
}
