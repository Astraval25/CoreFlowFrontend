import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./features/Login/LoginPage";
import { DashboardPage as Dashboard } from "./features/dashboard/DashboardPage";
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
import PurchasePage from "./features/purchase/pages/PurchasePage";
import ViewPurchasePage from "./features/purchase/pages/ViewPurchasePage";
import CreatePurchasePage from "./features/purchase/pages/CreatePurchasePage";
import SalesPage from "./features/sales/pages/SalesPage";
import ViewSalesPage from "./features/sales/pages/ViewSalesPage";
import CreateSalesPage from "./features/sales/pages/CreateSalesPage";
import CustomerItems from "./features/CustomerItems/pages/CustomerItems";

export const router = createBrowserRouter([
  // ── Public pages ──
  { path: "/", element: <ProductLandingPage /> },
  { path: "/features", element: <FeaturesPage /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },
  {
    path: "/login",
    element: <RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>,
  },
  {
    path: "/register",
    element: <RedirectIfLoggedIn><RegisterPage /></RedirectIfLoggedIn>,
  },
  {
    path: "/verify/:userPath",
    element: <RedirectIfLoggedIn><VerifyOtpPage /></RedirectIfLoggedIn>,
  },

  // ── Shell (ProtectedRoute + MainLayout) ──
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },

      // Sales  (/sales/:companyId/create  |  /sales/:companyId/:orderId  |  …/edit)
      { path: "/sales",                                 element: <SalesPage /> },
      { path: "/sales/:companyId/create",               element: <CreateSalesPage /> },
      { path: "/sales/:companyId/:orderId",             element: <ViewSalesPage /> },
      { path: "/sales/:companyId/:orderId/edit",        element: <CreateSalesPage /> },

      // Purchase
      { path: "/purchase",                              element: <PurchasePage /> },
      { path: "/purchase/:companyId/create",            element: <CreatePurchasePage /> },
      { path: "/purchase/:companyId/:orderId",          element: <ViewPurchasePage /> },
      { path: "/purchase/:companyId/:orderId/edit",     element: <CreatePurchasePage /> },

      // Customers  (/customers/:companyId  |  …/add  |  …/:customerId  |  …/edit  |  …/items)
      { path: "/customers/:companyId",                         element: <CustomerPage /> },
      { path: "/customers/:companyId/add",                     element: <CreateCustomerPage /> },
      { path: "/customers/:companyId/:customerId",             element: <ViewCustomer /> },
      { path: "/customers/:companyId/:customerId/edit",        element: <CreateCustomerPage /> },
      { path: "/customers/:companyId/:customerId/items",       element: <CustomerItems /> },

      // Vendors
      { path: "/vendors/:companyId",                    element: <VendorPage /> },
      { path: "/vendors/:companyId/add",                element: <CreateVendorPage /> },
      { path: "/vendors/:companyId/:vendorId",          element: <ViewVendor /> },
      { path: "/vendors/:companyId/:vendorId/edit",     element: <CreateVendorPage /> },

      // Items
      { path: "/items/:companyId",                      element: <ItemsPage /> },
      { path: "/items/:companyId/add",                  element: <CreateItemPage /> },
      { path: "/items/:companyId/:itemId",              element: <ViewItemPage /> },
      { path: "/items/:companyId/:itemId/edit",         element: <CreateItemPage /> },
    ],
  },
]);
