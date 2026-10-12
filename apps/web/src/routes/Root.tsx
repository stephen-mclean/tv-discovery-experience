import { NavLink, Outlet } from "react-router";

export default function Root() {
  return (
    <>
      <header>
        <nav>
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/search">Search</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
