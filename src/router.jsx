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
import PlaceholderPage from "./shared/components/PlaceholderPage";
import PaymentMadePage from "./features/paymentMade/pages/PaymentMadePage";
import CreatePaymentMadePage from "./features/paymentMade/pages/CreatePaymentMadePage";
import ViewPaymentMadePage from "./features/paymentMade/pages/ViewPaymentMadePage";
import PaymentReceivedPage from "./features/paymentReceived/pages/PaymentReceivedPage";
import CreatePaymentReceivedPage from "./features/paymentReceived/pages/CreatePaymentReceivedPage";
import ViewPaymentReceivedPage from "./features/paymentReceived/pages/ViewPaymentReceivedPage";

export const router = createBrowserRouter([
  // ── Public pages ──
  { path: "/", element: <ProductLandingPage /> },
  { path: "/features", element: <FeaturesPage /> },
  { path: "/pricing", element: <PricingPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/contact", element: <ContactPage /> },

  // ── Legal ──
  { path: "cf/legal/privacy-policy", element: <PlaceholderPage title="Privacy Policy" /> },
  { path: "cf/legal/terms-of-service", element: <PlaceholderPage title="Terms of Service" /> },

  // ── Auth ──
  {
    path: "cf/auth/login",
    element: <RedirectIfLoggedIn><LoginPage /></RedirectIfLoggedIn>,
  },
  {
    path: "cf/auth/register",
    element: <RedirectIfLoggedIn><RegisterPage /></RedirectIfLoggedIn>,
  },
  {
    path: "cf/auth/verify",
    element: <RedirectIfLoggedIn><VerifyOtpPage /></RedirectIfLoggedIn>,
  },
  {
    path: "cf/auth/resend-otp",
    element: <RedirectIfLoggedIn><PlaceholderPage title="Resend OTP" /></RedirectIfLoggedIn>,
  },

  // ── Protected Shell (ProtectedRoute + MainLayout) ──
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Dashboard
      { path: "cf/company/:companyId/dashboard", element: <Dashboard /> },

      // Notifications
      { path: "cf/company/:companyId/notifications", element: <PlaceholderPage title="Notifications" /> },

      // Company
      { path: "cf/company/list", element: <PlaceholderPage title="Company List" /> },
      { path: "cf/company/create", element: <PlaceholderPage title="Create Company" /> },
      { path: "cf/company/:companyId/detail", element: <PlaceholderPage title="Company Detail" /> },
      { path: "cf/company/:companyId/update", element: <PlaceholderPage title="Update Company" /> },

      // User
      { path: "cf/user/:userId/profile", element: <PlaceholderPage title="User Profile" /> },
      { path: "cf/user/:userId/settings", element: <PlaceholderPage title="User Settings" /> },

      // Customers
      { path: "cf/company/:companyId/customers", element: <CustomerPage /> },
      { path: "cf/company/:companyId/customers/create", element: <CreateCustomerPage /> },
      { path: "cf/company/:companyId/customers/:customerId/detail", element: <ViewCustomer /> },
      { path: "cf/company/:companyId/customers/:customerId/update", element: <CreateCustomerPage /> },

      // Vendors
      { path: "cf/company/:companyId/vendors", element: <VendorPage /> },
      { path: "cf/company/:companyId/vendors/create", element: <CreateVendorPage /> },
      { path: "cf/company/:companyId/vendors/:vendorId/detail", element: <ViewVendor /> },
      { path: "cf/company/:companyId/vendors/:vendorId/update", element: <CreateVendorPage /> },

      // Items
      { path: "cf/company/:companyId/items", element: <ItemsPage /> },
      { path: "cf/company/:companyId/items/create", element: <CreateItemPage /> },
      { path: "cf/company/:companyId/items/:itemId/detail", element: <ViewItemPage /> },
      { path: "cf/company/:companyId/items/:itemId/update", element: <CreateItemPage /> },

      // Sales
      { path: "cf/company/:companyId/sales", element: <SalesPage /> },
      { path: "cf/company/:companyId/sales/create", element: <CreateSalesPage /> },
      { path: "cf/company/:companyId/sales/:salesId/detail", element: <ViewSalesPage /> },
      { path: "cf/company/:companyId/sales/:salesId/update", element: <CreateSalesPage /> },

      // Purchase
      { path: "cf/company/:companyId/purchase/list", element: <PurchasePage /> },
      { path: "cf/company/:companyId/purchase/create", element: <CreatePurchasePage /> },
      { path: "cf/company/:companyId/purchase/:purchaseId/detail", element: <ViewPurchasePage /> },
      { path: "cf/company/:companyId/purchase/:purchaseId/update", element: <CreatePurchasePage /> },

      // Payment Received
      { path: "cf/company/:companyId/payment-received/list", element: <PaymentReceivedPage /> },
      { path: "cf/company/:companyId/payment-received/create", element: <CreatePaymentReceivedPage /> },
      { path: "cf/company/:companyId/payment-received/:paymentReceivedId/detail", element: <ViewPaymentReceivedPage /> },
      { path: "cf/company/:companyId/payment-received/:paymentReceivedId/update", element: <CreatePaymentReceivedPage /> },

      // Payment Made
      { path: "cf/company/:companyId/payment-made/list", element: <PaymentMadePage /> },
      { path: "cf/company/:companyId/payment-made/create", element: <CreatePaymentMadePage /> },
      { path: "cf/company/:companyId/payment-made/:paymentMadeId/detail", element: <ViewPaymentMadePage /> },
      { path: "cf/company/:companyId/payment-made/:paymentMadeId/update", element: <CreatePaymentMadePage /> },

      // Reports
      { path: "cf/company/:companyId/report/customers", element: <PlaceholderPage title="Customers Report" /> },
      { path: "cf/company/:companyId/report/vendors", element: <PlaceholderPage title="Vendors Report" /> },
      { path: "cf/company/:companyId/report/items", element: <PlaceholderPage title="Items Report" /> },
      { path: "cf/company/:companyId/report/sales", element: <PlaceholderPage title="Sales Report" /> },
      { path: "cf/company/:companyId/report/purchase", element: <PlaceholderPage title="Purchase Report" /> },
      { path: "cf/company/:companyId/report/payment-received", element: <PlaceholderPage title="Payment Received Report" /> },
      { path: "cf/company/:companyId/report/payment-made", element: <PlaceholderPage title="Payment Made Report" /> },
    ],
  },
]);
