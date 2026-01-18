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
};
