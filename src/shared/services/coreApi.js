import api from "../services/apiService";
import { ENDPOINTS } from "../../config/apiEndpoints";

export const coreApi = {
  login: (data) => api.post(ENDPOINTS.LOGIN, data),
  register: (data) => api.post(ENDPOINTS.REGISTER, data),
  refresh: (data) => api.post(ENDPOINTS.REFRESH, data),
  verify_otp: (data) => api.post(ENDPOINTS.VERIFY_OTP, data),
  resend_otp: (data) => api.post(ENDPOINTS.RESEND_OTP, data),
  getMyCompanies: () => api.get(ENDPOINTS.GET_COMPANY),

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
    api.put(`${ENDPOINTS.CUSTOMERS}/${companyId}/sales/orders/${orderId}`, data),

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
    api.get(`${ENDPOINTS.DASHBOARD_KPI}/${companyId}/analytics/dashboard/kpi?startDate=${startDate}&endDate=${endDate}`),

  getDashboardCashFlow: (companyId, startDate, endDate) =>
    api.get(`${ENDPOINTS.DASHBOARD_CASH_FLOW}/${companyId}/analytics/dashboard/cash-flow?startDate=${startDate}&endDate=${endDate}`),

  getDashboardRevenueExpense: (companyId, startDate, endDate) =>
    api.get(`${ENDPOINTS.DASHBOARD_REVENUE_EXPENSE}/${companyId}/analytics/dashboard/revenue-expense?startDate=${startDate}&endDate=${endDate}`),
};
