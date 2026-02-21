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
    `${ENDPOINTS.CUSTOMERS}/${companyId}/orders/${orderId}`)

};
