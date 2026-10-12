import { createBrowserRouter, redirect } from "react-router";
import Detail from "./routes/Detail.tsx";
import Home from "./routes/Home.tsx";
import NotFound from "./routes/NotFound.tsx";
import Root from "./routes/Root.tsx";
import Search from "./routes/Search.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, loader: () => redirect("/home") },
      { path: "home", Component: Home },
      { path: "search", Component: Search },
      { path: "detail/:mediaType/:id", Component: Detail },
      { path: "*", Component: NotFound },
    ],
  },
]);
