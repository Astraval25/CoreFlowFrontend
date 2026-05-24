import api from "../services/apiService";
import { ENDPOINTS } from "../../config/apiEndpoints";

const withDateRange = (path, startDate, endDate) =>
  `${path}?startDate=${startDate}&endDate=${endDate}`;

const withDateRangeAndFilters = (path, startDate, endDate, filters = {}) => {
  const params = new URLSearchParams({ startDate, endDate });
  Object.entries(filters).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(","));
      return;
    }
    params.set(key, value);
  });
  return `${path}?${params.toString()}`;
};

const normalizeAdPlacement = (placement) => {
  if (!placement) return null;
  const value = String(placement).trim().toUpperCase();
  if (value === "DASHBOARD" || value === "DASHBOARD_ADS") return "DASHBOARD_ADS";
  if (value === "ORDER_PAGE" || value === "ORDER_PAGE_ADS" || value === "ORDER") return "ORDER_PAGE_ADS";
  return null;
};

export const coreApi = {
  login: (data) => api.post(ENDPOINTS.LOGIN, data),
  employeeLogin: (data) => api.post("/auth/employee/login", data),
  register: (data) => api.post(ENDPOINTS.REGISTER, data),
  refresh: (data) => api.post(ENDPOINTS.REFRESH, data),
  verify_otp: (data) => api.post(ENDPOINTS.VERIFY_OTP, data),
  resend_otp: (data) => api.post(ENDPOINTS.RESEND_OTP, data),
  getAllCompanies: () => api.get("/companies"),
  getMyCompaniesAll: () => api.get("/companies/my-companies"),
  getMyCompanies: () => api.get(ENDPOINTS.GET_COMPANY),
  createCompany: (data) => api.post("/companies", data),

  getCompanyById: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}`),

  updateCompany: (companyId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}`, data),

  deactivateCompany: (companyId) =>
    api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/deactivate`),

  activateCompany: (companyId) =>
    api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/activate`),

  deleteCompany: (companyId) =>
    api.delete(`${ENDPOINTS.CUSTOMERS}/${companyId}`),

  uploadCompanyLogo: (companyId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Marketplace
  getMarketplaceCompanies: () =>
    api.get("/marketplace/companies"),

  getMarketplaceCompanyDetail: (companyId) =>
    api.get(`/marketplace/companies/${companyId}`),

  getMarketplaceCompanyItems: (companyId) =>
    api.get(`/marketplace/companies/${companyId}/items`),

  // Customer
  getCustomers: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/active`),

  getCustomerDetail: (companyId, customerId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}`),

  createCustomer: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers`, data),

  editCustomer: (companyId, customerId, data) =>
    api.put(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}`,
      data
    ),

  deactivateCustomer: (companyId, customerId) =>
    api.patch(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/deactivate`
    ),

  activateCustomer: (companyId, customerId) =>
    api.patch(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/activate`
    ),

  getAllCustomerByCompanyId: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers`),

  getAllCustomersGlobal: () =>
    api.get(`${ENDPOINTS.CUSTOMERS}/customers`),

  getUnlinkedCustomers: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/unlinked`),

  getCustomerOrdersPayments: (companyId, customerId, params = {}) =>
    api.get(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/orders-payments`,
      { params }
    ),

  deleteCustomer: (companyId, customerId) =>
    api.delete(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}`),

  // Vendor
  getVendors: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/active`),

  getVendorDetail: (companyId, vendorId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}`),

  createVendor: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors`, data),

  editVendor: (companyId, vendorId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}`, data),

  deactivateVendor: (companyId, vendorId) =>
    api.patch(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/deactivate`
    ),

  activateVendor: (companyId, vendorId) =>
    api.patch(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/activate`
    ),

  getAllVendorByCompanyId: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors`),

  getAllVendorsGlobal: () =>
    api.get(`${ENDPOINTS.CUSTOMERS}/vendors`),

  getUnlinkedVendors: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/unlinked`),

  getVendorOrdersPayments: (companyId, vendorId, params = {}) =>
    api.get(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/orders-payments`,
      { params }
    ),

  deleteVendor: (companyId, vendorId) =>
    api.delete(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}`),

  // Expense Accounts
  getExpenseAccounts: (companyId, activeOnly = false) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/expense-accounts?activeOnly=${activeOnly}`),

  getExpenseAccountTypes: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/expense-accounts/account-types`),

  getExpenseAccountDetail: (companyId, expenseAccountId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/expense-accounts/${expenseAccountId}`),

  createExpenseAccount: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/expense-accounts`, data),

  updateExpenseAccount: (companyId, expenseAccountId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/expense-accounts/${expenseAccountId}`, data),

  deactivateExpenseAccount: (companyId, expenseAccountId) =>
    api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/expense-accounts/${expenseAccountId}/deactivate`),

  activateExpenseAccount: (companyId, expenseAccountId) =>
    api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/expense-accounts/${expenseAccountId}/activate`),

  // Expenses
  getExpenses: (companyId, activeOnly = true) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/expenses?activeOnly=${activeOnly}`),

  getExpenseDetail: (companyId, expenseId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/expenses/${expenseId}`),

  createExpense: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/expenses`, data),

  updateExpense: (companyId, expenseId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/expenses/${expenseId}`, data),

  deactivateExpense: (companyId, expenseId) =>
    api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/expenses/${expenseId}/deactivate`),

  activateExpense: (companyId, expenseId) =>
    api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/expenses/${expenseId}/activate`),

  // Items (matches backend ItemController under /api/companies)
  getAllItemsGlobal: () =>
    api.get(`${ENDPOINTS.CUSTOMERS}/items`),

  getItems: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/items`),

  getActiveItems: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/items/active`),

  getItemDetail: (companyId, itemId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/items/${itemId}`),

  createItems: (companyId, formData) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/items`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  editItem: (companyId, itemId, formData) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/items/${itemId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  downloadFile: (fsId) => api.get(`${ENDPOINTS.FILE_DOWNLOAD}?fsId=${fsId}`, {
    responseType: "blob",
  }),

  deactivateItem: (companyId, itemId) =>
    api.patch(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/items/${itemId}/deactivate`
    ),

  activateItem: (companyId, itemId) =>
    api.patch(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/items/${itemId}/activate`
    ),

  deleteItem: (companyId, itemId) =>
    api.delete(`${ENDPOINTS.CUSTOMERS}/${companyId}/items/${itemId}`),

  // Purchase
  getAllPurchase: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/purchase/orders`),

  getPurchaseOrderSnapshots: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/purchase/orders/snapshot`),

  getPurchaseDetail: (companyId, orderId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}`),

  createPurchase: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/purchase/orders`, data),

  editPurchase: (companyId, orderId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/purchase/orders/${orderId}`, data),

  deactivatePurchase: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/deactivate`),

  activatePurchase: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/activate`),

  // sales
  getAllSales: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/sales/orders`),

  getSalesOrderSnapshots: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/sales/orders/snapshot`),

  deactivateSales: (companyId, orderId) => api.put(
    `${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/deactivate`),

  activateSales: (companyId, orderId) => api.put(
    `${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/activate`),

  getSalesDetails: (companyId, orderId) => api.get(
    `${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}`),
  
  createSales: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/sales/orders`, data),

  editSales: (companyId, orderId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/sales/orders/${orderId}`, data),

  // Order status transitions (shared by sales & purchase)
  updateOrderStatusQuotation: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/quotation`),

  updateOrderStatusQuotationViewed: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/quotation-viewed`),

  updateOrderStatusQuotationAccepted: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/quotation-accepted`),

  updateOrderStatusQuotationDeclined: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/quotation-declined`),

  updateOrderStatusSalesOrder: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/sales-order`),

  updateOrderStatusInvoiced: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/invoiced`),

  updateOrderStatusPaid: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/paid`),

  markOrderViewed: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/viewed`),

  cancelOrder: (companyId, orderId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/cancel-order`),

  getOrderSnapshotById: (companyId, orderId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/snapshot/${orderId}`),

  getOrderSnapshot: (companyId, orderReference, status) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/snapshot`, {
      params: { orderReference, status },
    }),

  deleteOrder: (companyId, orderId) =>
    api.delete(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}`),

  getOrderPaymentDetails: (companyId, orderId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/payment-details`),

  // Company refs for internal tracking
  getOrderRef: (companyId, orderId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/ref`),

  updateOrderRef: (companyId, orderId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}/ref`, data),

  getPaymentRef: (companyId, paymentId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/${paymentId}/ref`),

  updatePaymentRef: (companyId, paymentId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/${paymentId}/ref`, data),

  // Sellable / Purchasable items (used for order creation)
  getSellableItems: (companyId, customerId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/sellable`),

  getPurchasableItems: (companyId, vendorId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items/purchasable`),

  // Customer Items
  getAllCustomerItems: (companyId, customerId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items`),

  getCustomerItems: (companyId, customerId) => api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/active`),

  getCustomerMappedItems: (companyId, customerId) => api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/mapped`),

  getCustomerItemDetail: (companyId, customerId, itemId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/${itemId}`),

  createcustomerItem: (companyId, customerId, data) => api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items`, data),

  deactivateCustomerItem: (companyId, customerId, itemId) => api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/${itemId}/deactivate`),

  activateCustomerItem: (companyId, customerId, itemId) => api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/${itemId}/activate`),

  editCustomerItem: (companyId, customerId, itemId, data) => api.put(
    `${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/${itemId}`, data),

  // Vendor Items

  getAllVendorItems: (companyId, vendorId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items`),

  getVendorItems: (companyId, vendorId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items/active`),

  getVendorMappedItems: (companyId, vendorId) => api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items/mapped`),

  getVendorItemDetail: (companyId, vendorId, itemId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items/${itemId}`),

  createVendorItem: (companyId, vendorId, data) => api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items`, data),

  deactivateVendorItem: (companyId, vendorId, itemId) => api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items/${itemId}/deactivate`),

  activateVendorItem: (companyId, vendorId, itemId) => api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items/${itemId}/activate`),

  editVendorItem: (companyId, vendorId, itemId, data) => api.put(
    `${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items/${itemId}`, data),

  // Payment Made (payments-sent)
  getPaymentsSentSummary: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments-sent/summary`),

  getPaymentDetail: (companyId, paymentId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/${paymentId}`),

  createPaymentSent: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments-sent`, data),

  updatePaymentSent: (companyId, paymentId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments-sent/${paymentId}`, data),

  getVendorUnpaidOrders: (companyId, vendorId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendor/${vendorId}/unpaid-orders`),

  deletePaymentSentAllocation: (companyId, paymentId, allocationId) =>
    api.delete(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/payments-sent/${paymentId}/allocations/${allocationId}`
    ),

  updatePaymentStatusPaid: (companyId, paymentId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/${paymentId}/paid`),

  updatePaymentStatusViewed: (companyId, paymentId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/${paymentId}/viewed`),

  updatePaymentStatusFailed: (companyId, paymentId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/${paymentId}/failed`),

  updatePaymentStatusRefund: (companyId, paymentId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/${paymentId}/refund`),

  updatePaymentStatusPartiallyPaid: (companyId, paymentId) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/${paymentId}/partially-paid`),

  // Payment Received (payments-received)
  getPaymentsReceivedSummary: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments-received/summary`),

  createPaymentReceived: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments-received`, data),

  updatePaymentReceived: (companyId, paymentId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments-received/${paymentId}`, data),

  getCustomerUnpaidOrders: (companyId, customerId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customer/${customerId}/unpaid-orders`),

  // Advertisements
  getActiveAds: (placement) =>
    api.get(
      (() => {
        const normalizedPlacement = normalizeAdPlacement(placement);
        return `/ads${normalizedPlacement ? `?placement=${normalizedPlacement}` : ""}`;
      })()
    ),

  getAllAdsAdmin: (page = 0) =>
    api.get(`/admin/ads?page=${page}`),

  createAd: (ad, file) => {
    const formData = new FormData();
    formData.append("ad", typeof ad === "string" ? ad : JSON.stringify(ad));
    formData.append("file", file);
    return api.post("/admin/ads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  activateAd: (adId) =>
    api.patch(`/admin/ads/${adId}/activate`),

  deactivateAd: (adId) =>
    api.patch(`/admin/ads/${adId}/deactivate`),

  deleteAd: (adId) =>
    api.delete(`/admin/ads/${adId}`),

  // Payment Proof
  uploadPaymentProof: (companyId, formData) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/payment-proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  uploadPaymentSentProof: (companyId, paymentId, formData) =>
    api.post(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/payments-sent/${paymentId}/payment-proof`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    ),

  uploadPaymentReceivedProof: (companyId, paymentId, formData) =>
    api.post(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/payments-received/${paymentId}/payment-proof`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    ),

  // Invitations (company linking)
  getCustomerInvitationCode: (companyId, customerId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/invitations/customers/${customerId}/code`),

  createCustomerInvitation: (companyId, customerId) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/invitations/customers/${customerId}`),

  getVendorInvitationCode: (companyId, vendorId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/invitations/vendors/${vendorId}/code`),

  createVendorInvitation: (companyId, vendorId) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/invitations/vendors/${vendorId}`),

  acceptInvitation: (companyId, invitationCode, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/invitations/${invitationCode}/accept`, data),

  rejectInvitation: (companyId, invitationCode) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/invitations/${invitationCode}/reject`),

  getInvitationByCode: (companyId, invitationCode) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/invitations/${invitationCode}`),

  // Dashboard Analytics
  getDashboardKpi: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.DASHBOARD_KPI}/${companyId}/analytics/dashboard/kpi`, startDate, endDate)),

  getDashboardCashFlow: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.DASHBOARD_CASH_FLOW}/${companyId}/analytics/dashboard/cash-flow`, startDate, endDate)),

  getDashboardRevenueExpense: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.DASHBOARD_REVENUE_EXPENSE}/${companyId}/analytics/dashboard/revenue-expense`, startDate, endDate)),

  // Notifications
  getNotifications: (companyId, page = 0) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/notifications?page=${page}`),

  getUnreadNotificationCount: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/notifications/unread-count`),

  markNotificationRead: (companyId, notificationId) =>
    api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/notifications/${notificationId}/read`),

  markAllNotificationsRead: (companyId) =>
    api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/notifications/read-all`),

  openNotification: (companyId, notificationId) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/notifications/${notificationId}/open`),

  createNotification: (data) =>
    api.post("/notifications", data),

  // Announcements
  getCurrentAnnouncement: () =>
    api.get("/announcements/current", { suppressGlobalError: true }),

  dismissAnnouncement: (announcementId) =>
    api.post(`/announcements/${announcementId}/dismiss`, null, {
      suppressGlobalError: true,
    }),

  // Report Analytics
  getSalesSummary: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/sales/summary`, startDate, endDate)),

  getPurchaseSummary: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/purchase/summary`, startDate, endDate)),

  getSalesOrderFrequency: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/sales/order-frequency`, startDate, endDate)),

  getPurchaseOrderFrequency: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/purchase/order-frequency`, startDate, endDate)),

  getSalesPaymentFrequency: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/sales/payment-frequency`, startDate, endDate)),

  getPurchasePaymentFrequency: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/purchase/payment-frequency`, startDate, endDate)),

  getSalesItemFrequency: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/sales/item-frequency`, startDate, endDate)),

  getPurchaseItemFrequency: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/purchase/item-frequency`, startDate, endDate)),

  getSalesRunningOrderAmount: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/sales/running-order-amount`, startDate, endDate)),

  getPurchaseRunningOrderAmount: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/purchase/running-order-amount`, startDate, endDate)),

  getSalesRunningPaymentAmount: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/sales/running-payment-amount`, startDate, endDate)),

  getPurchaseRunningPaymentAmount: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/purchase/running-payment-amount`, startDate, endDate)),

  getSalesByCustomer: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/sales/by-customer`, startDate, endDate)),

  getPurchaseByVendor: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/purchase/by-vendor`, startDate, endDate)),

  getSalesByItem: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/sales/by-item`, startDate, endDate)),

  getPurchaseByItem: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/purchase/by-item`, startDate, endDate)),

  getProfitByItem: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/profit/by-item`, startDate, endDate)),

  getTopSellingItems: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/dashboard/top-selling-items`, startDate, endDate)),

  getTopProfitableItems: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/dashboard/top-profitable-items`, startDate, endDate)),

  getPaymentModeDistribution: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/dashboard/payment-mode-distribution`, startDate, endDate)),

  getMonthlyTrend: (companyId, startDate, endDate) =>
    api.get(withDateRange(`${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/dashboard/monthly-trend`, startDate, endDate)),

  getOrderHistory: (companyId, startDate, endDate, filters = {}) =>
    api.get(
      withDateRangeAndFilters(
        `${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/history/orders`,
        startDate,
        endDate,
        filters
      )
    ),

  getPaymentHistory: (companyId, startDate, endDate, filters = {}) =>
    api.get(
      withDateRangeAndFilters(
        `${ENDPOINTS.CUSTOMERS}/${companyId}/analytics/history/payments`,
        startDate,
        endDate,
        filters
      )
    ),

  // ── Employee Module (Admin) ──
  // Employees
  getEmployees: (companyId, activeOnly = true) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees?activeOnly=${activeOnly}`),

  getEmployeeDetail: (companyId, employeeId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}`),

  getEmployeeActivityLogs: (companyId, employeeId, from, to) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/activity-logs`, {
      params: { from, to },
    }),

  createEmployee: (companyId, data) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees`, data),

  updateEmployee: (companyId, employeeId, data) =>
    api.put(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}`, data),

  deactivateEmployee: (companyId, employeeId) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/deactivate`),

  activateEmployee: (companyId, employeeId) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/activate`),

  // Salary Config
  createSalaryConfig: (companyId, employeeId, data) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/salary-config`, data),

  getActiveSalaryConfig: (companyId, employeeId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/salary-config`),

  getSalaryConfigHistory: (companyId, employeeId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/salary-config/history`),

  // Portal User
  createPortalUser: (companyId, employeeId, data) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/portal-user`, data),

  getPortalUser: (companyId, employeeId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/portal-user`),

  resetPortalUserPassword: (companyId, employeeId, data) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/portal-user/reset-password`, data),

  deactivatePortalUser: (companyId, employeeId) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/portal-user/deactivate`),

  activatePortalUser: (companyId, employeeId) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/portal-user/activate`),

  // Work Definitions
  getWorkDefinitions: (companyId, activeOnly = true) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-definitions?activeOnly=${activeOnly}`),

  getWorkDefinitionDetail: (companyId, workDefId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-definitions/${workDefId}`),

  createWorkDefinition: (companyId, data) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-definitions`, data),

  updateWorkDefinition: (companyId, workDefId, data) =>
    api.put(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-definitions/${workDefId}`, data),

  deactivateWorkDefinition: (companyId, workDefId) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-definitions/${workDefId}/deactivate`),

  activateWorkDefinition: (companyId, workDefId) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-definitions/${workDefId}/activate`),

  getWorkDefRateHistory: (companyId, workDefId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-definitions/${workDefId}/rate-history`),

  // Work Logs (Admin)
  createWorkLog: (companyId, data) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-logs`, data),

  getWorkLogs: (companyId, from, to) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-logs?from=${from}&to=${to}`),

  getWorkLogsByEmployee: (companyId, employeeId, from, to) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-logs/employee/${employeeId}?from=${from}&to=${to}`),

  getPendingWorkLogs: (companyId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-logs/pending`),

  reviewWorkLog: (companyId, logId, data) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-logs/${logId}/review`, data),

  updateWorkLogByAdmin: (companyId, logId, data) =>
    api.put(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-logs/${logId}`, data),

  deleteWorkLog: (companyId, logId) =>
    api.delete(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-logs/${logId}`),

  // Leave Logs (Admin)
  createLeaveLog: (companyId, data) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/leave-logs`, data),

  getLeaveLogs: (companyId, from, to) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/leave-logs?from=${from}&to=${to}`),

  getLeaveLogsByEmployee: (companyId, employeeId, from, to) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/leave-logs/employee/${employeeId}?from=${from}&to=${to}`),

  getPendingLeaveLogs: (companyId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/leave-logs/pending`),

  reviewLeaveLog: (companyId, leaveId, data) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/leave-logs/${leaveId}/review`, data),

  updateLeaveLogByAdmin: (companyId, leaveId, data) =>
    api.put(`${ENDPOINTS.MODEMP}/${companyId}/modemp/leave-logs/${leaveId}`, data),

  deleteLeaveLog: (companyId, leaveId) =>
    api.delete(`${ENDPOINTS.MODEMP}/${companyId}/modemp/leave-logs/${leaveId}`),

  // Salary (Admin)
  calculateSalary: (companyId, data) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/salary/calculate`, data),

  getSalaryPeriods: (companyId, period) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/salary/periods?period=${period}`),

  getSalaryPeriodDetail: (companyId, salaryPeriodId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/salary/periods/${salaryPeriodId}`),

  approveSalaryPeriod: (companyId, salaryPeriodId) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/salary/periods/${salaryPeriodId}/approve`),

  markSalaryPaid: (companyId, salaryPeriodId, data) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/salary/periods/${salaryPeriodId}/mark-paid`, data),

  getSalaryReport: (companyId, from, to) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/salary/report?from=${from}&to=${to}`),

  downloadSalarySlip: (companyId, salaryPeriodId) =>
    api.get(`${ENDPOINTS.MODEMP}/${companyId}/modemp/salary/periods/${salaryPeriodId}/slip`, {
      responseType: "blob",
    }),

  downloadOrderBill: (companyId, orderId) =>
    api.get(`/companies/${companyId}/orders/${orderId}/bill`, {
      responseType: "blob",
    }),

  // ── Employee Portal (self-service) ──
  getMyProfile: () =>
    api.get(`${ENDPOINTS.EMP}/me`),

  getMyWorkLogs: (from, to) =>
    api.get(`${ENDPOINTS.EMP}/work-logs?from=${from}&to=${to}`),

  updateWorkLogEmployee: (companyId, data) =>
    api.put(`${ENDPOINTS.MODEMP}/${companyId}/modemp/work-logs/employee`, data),

  getMyLeaveLogs: (from, to) =>
    api.get(`${ENDPOINTS.EMP}/leave-logs?from=${from}&to=${to}`),

  updateLeaveLogEmployee: (companyId, data) =>
    api.put(`${ENDPOINTS.MODEMP}/${companyId}/modemp/leave-logs/employee`, data),

  getMySalaryPeriods: (period) =>
    api.get(`${ENDPOINTS.EMP}/salary/periods?period=${period}`),

  getMySalaryDetail: (salaryPeriodId) =>
    api.get(`${ENDPOINTS.EMP}/salary/periods/${salaryPeriodId}`),

  downloadMySalarySlip: (salaryPeriodId) =>
    api.get(`${ENDPOINTS.EMP}/salary/periods/${salaryPeriodId}/slip`, {
      responseType: "blob",
    }),

  // Company config
  getCompanyConfigs: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/config`),

  setCompanyConfig: (companyId, configKey, configValue) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/config/${configKey}`, { configValue }),

  resetCompanyConfig: (companyId, configKey) =>
    api.delete(`${ENDPOINTS.CUSTOMERS}/${companyId}/config/${configKey}`),

  // Common utilities
  getAddressById: (addressId) =>
    api.get(`/common/addresses/addressId/${addressId}`),

  updateAddressById: (addressId, data) =>
    api.put(`/common/addresses/addressId/${addressId}`, data),

  deleteAddressById: (addressId) =>
    api.delete(`/common/addresses/addressId/${addressId}`),

  registerDeviceToken: (data) =>
    api.post("/device-tokens", data),

  deregisterDeviceToken: (token) =>
    api.delete("/device-tokens", { params: { token } }),

  getOcrHealth: () =>
    api.get("/health/ocr"),
};
