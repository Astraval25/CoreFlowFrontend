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

export const coreApi = {
  login: (data) => api.post(ENDPOINTS.LOGIN, data),
  register: (data) => api.post(ENDPOINTS.REGISTER, data),
  refresh: (data) => api.post(ENDPOINTS.REFRESH, data),
  verify_otp: (data) => api.post(ENDPOINTS.VERIFY_OTP, data),
  resend_otp: (data) => api.post(ENDPOINTS.RESEND_OTP, data),
  getMyCompanies: () => api.get(ENDPOINTS.GET_COMPANY),

  getCompanyById: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}`),

  uploadCompanyLogo: (companyId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

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

  // items
  getItems: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/items`),

  getActiveItems: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/items/active`),

  getItemDetail: (companyId, itemId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/items/${itemId}`),

  createItems: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/items`, data),

  editItem: (companyId, itemId, data) =>
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/items/${itemId}`, data),

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

  // Purchase
  getAllPurchase: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/purchase/orders`),

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

  // Sellable / Purchasable items (used for order creation)
  getSellableItems: (companyId, customerId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/sellable`),

  getPurchasableItems: (companyId, vendorId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items/purchasable`),

  // Customer Items
  getCustomerItems: (companyId, customerId) => api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/active`),

  getCustomerMappedItems: (companyId, customerId) => api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/mapped`),

  createcustomerItem: (companyId, customerId, data) => api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items`, data),

  deactivateCustomerItem: (companyId, customerId, itemId) => api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/${itemId}/deactivate`),

  activateCustomerItem: (companyId, customerId, itemId) => api.patch(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/${itemId}/activate`),

  editCustomerItem: (companyId, customerId, itemId, data) => api.put(
    `${ENDPOINTS.CUSTOMERS}/${companyId}/customers/${customerId}/items/${itemId}`, data),

  // Vendor Items

  getVendorMappedItems: (companyId, vendorId) => api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/vendors/${vendorId}/items/mapped`),

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

  deletePaymentReceivedAllocation: (companyId, paymentId, allocationId) =>
    api.delete(
      `${ENDPOINTS.CUSTOMERS}/${companyId}/payments-received/${paymentId}/allocations/${allocationId}`
    ),

  // Advertisements
  getActiveAds: (placement) =>
    api.get(`/ads${placement ? `?placement=${placement}` : ""}`),

  // Payment Proof
  uploadPaymentProof: (companyId, formData) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/payments/payment-proof`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

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

  createEmployee: (companyId, data) =>
    api.post(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees`, data),

  updateEmployee: (companyId, employeeId, data) =>
    api.put(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}`, data),

  deactivateEmployee: (companyId, employeeId) =>
    api.patch(`${ENDPOINTS.MODEMP}/${companyId}/modemp/employees/${employeeId}/deactivate`),

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
};
