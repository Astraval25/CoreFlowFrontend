import api from "../services/apiService";
import { ENDPOINTS } from "../../config/apiEndpoints";
import { data } from "react-router-dom";

export const coreApi = {
  login: (data) => api.post(ENDPOINTS.LOGIN, data),
  register: (data) => api.post(ENDPOINTS.REGISTER, data),
  verify_otp: (data) => api.post(ENDPOINTS.VERIFY_OTP, data),
  resend_otp: (data) => api.post(ENDPOINTS.RESEND_OTP, data),
  getMyCompanies: () => api.get(ENDPOINTS.GET_COMPANY),
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
};
