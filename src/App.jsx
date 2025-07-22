import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import MainLayout from "./layouts/MainLayout";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

export default function App() {
  const { user } = useSelector((state) => state.auth);
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <MainLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: user ? <Navigate to={"/"} /> : <Login />,
    },
    {
      path: "/register",
      element: user ? <Navigate to={"/"} /> : <Register />,
    },
  ]);
  return <RouterProvider router={routes} />;
}
