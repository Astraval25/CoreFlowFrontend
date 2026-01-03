import api from "../services/apiService";
import { ENDPOINTS } from "../../config/apiEndpoints";

export const coreApi = {
  login: (data) => api.post(ENDPOINTS.LOGIN, data),
  register: (data) => api.post(ENDPOINTS.REGISTER, data),
  verify_otp: (data) => api.post(ENDPOINTS.VERIFY_OTP, data),
  resend_otp: (data) => api.post(ENDPOINTS.RESEND_OTP, data),
  getMyCompanies: () => api.get(ENDPOINTS.GET_COMPANY),
  getCustomers: (companyId) =>
    api.get(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers/active`),
  createCustomer: (companyId, data) =>
    api.post(`${ENDPOINTS.CUSTOMERS}/${companyId}/customers`, data),
};
