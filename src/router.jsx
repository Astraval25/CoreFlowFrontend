import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./features/Login/LoginPage";
import { Dashboard } from "./features/dashboard/dashboard";
import ProtectedRoute from "./features/Login/routes/ProtectedRoute";
import RedirectIfLoggedIn from "./features/Login/routes/RedirectIfLoggedIn";
import RegisterPage from "./features/Register/RegisterPage";
import VerifyOtpPage from "./features/verifyUser/VerifyOtpPage";

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
    path: "/register",
    element: (
      <RedirectIfLoggedIn>
        <RegisterPage />
      </RedirectIfLoggedIn>
    ),
  },
  {
    path: "/verify/user",
    element: (
      <RedirectIfLoggedIn>
        <VerifyOtpPage />
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
