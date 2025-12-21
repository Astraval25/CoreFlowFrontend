import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./features/Login/LoginPage";
import { Dashboard } from "./features/dashboard/dashboard";
import ProtectedRoute from "./features/Login/routes/ProtectedRoute";
import RedirectIfLoggedIn from "./features/Login/routes/RedirectIfLoggedIn";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RedirectIfLoggedIn>
        <LoginPage />
      </RedirectIfLoggedIn>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);
