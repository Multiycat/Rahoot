import AuthLayout from "@rahoot/web/pages/game/auth/layout"
import PlayerAuthPage from "@rahoot/web/pages/game/auth/page"
import { GameLayout } from "@rahoot/web/pages/game/layout"
import LandingPage from "@rahoot/web/pages/landing/page"
import { createBrowserRouter, RouterProvider } from "react-router"
import AuthManagerPage from "./pages/game/auth/manager/page"
import ManagerGamePage from "./pages/game/party/manager/page"
import PlayerGamePage from "./pages/game/party/page"

const router = createBrowserRouter([
  {
    path: "/",
    element: <GameLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/play",
        element: <AuthLayout />,
        children: [
          {
            path: "/play",
            element: <PlayerAuthPage />,
          },
        ],
      },
      {
        path: "/manager",
        element: <AuthLayout />,
        children: [
          {
            path: "/manager",
            element: <AuthManagerPage />,
          },
        ],
      },
      {
        path: "/party/:gameId",
        element: <PlayerGamePage />,
      },
      {
        path: "/party/manager/:gameId",
        element: <ManagerGamePage />,
      },
    ],
  },
])

const Router = () => <RouterProvider router={router} />

export default Router
