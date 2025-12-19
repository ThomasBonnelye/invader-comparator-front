import { type RouteObject } from "react-router-dom";
import Root from "./root";
import Landing from "../src/pages/Home";
import Comparator from "../src/pages/Comparator";
import { ProtectedRoute } from "../src/components/ProtectedRoute";

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
        path: "comparator",
        element: (
          <ProtectedRoute>
            <Comparator />
          </ProtectedRoute>
        ),
      },
    ],
  },
];

export default routes;
