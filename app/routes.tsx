import { type RouteObject } from "react-router-dom";
import Root from "./root";
import Landing from "../src/pages/Landing";
import Home from "../src/pages/Home";
import Comparator from "../src/pages/Comparator";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "comparator",
        element: <Comparator />,
      },
    ],
  },
];

export default routes;
