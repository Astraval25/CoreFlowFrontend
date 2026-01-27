import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./features/Login/LoginPage";
import { Dashboard } from "./features/dashboard/dashboard";
import ProtectedRoute from "./features/Login/routes/ProtectedRoute";
import RedirectIfLoggedIn from "./features/Login/routes/RedirectIfLoggedIn";
import RegisterPage from "./features/Register/RegisterPage";
import VerifyOtpPage from "./features/verifyUser/VerifyOtpPage";
import MainLayout from "./shared/layouts/MainLayout";
import CustomerPage from "./features/customer/pages/CustomerPage";
import CreateCustomerPage from "./features/customer/pages/CreateCustomerPage";
import ViewCustomer from "./features/customer/pages/ViewCustomer";
import ProductLandingPage from "./pages/ProductLandingPage";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import VendorPage from "./features/vendors/pages/VendorPage";
import CreateVendorPage from "./features/vendors/pages/CreateVendorPage";
import ViewVendor from "./features/vendors/pages/ViewVendor";
import ItemsPage from "./features/Items/pages/ItemsPage";
import CreateItemPage from "./features/Items/pages/CreateItemPage";
import ViewItemPage from "./features/Items/pages/ViewItemPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductLandingPage />,
  },
  {
    path: "/features",
    element: <FeaturesPage />,
  },
  {
    path: "/pricing",
    element: <PricingPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/login",
    element: (
      <RedirectIfLoggedIn>
        <LoginPage />
      </RedirectIfLoggedIn>
    ),
  },
  {
    path: "/signup",
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
    path: "/admin",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },

      { path: "customers", element: <CustomerPage /> },
      { path: "create/customer", element: <CreateCustomerPage /> },
      { path: "view/customer", element: <ViewCustomer /> },

      { path: "vendors", element: <VendorPage /> },
      { path: "create/vendor", element: <CreateVendorPage /> },
      { path: "view/vendor", element: <ViewVendor /> },

      { path: "items", element: <ItemsPage /> },
      { path: "create/item", element: <CreateItemPage /> },
      { path: "view/item", element: <ViewItemPage /> },
    ],
  },
]);
