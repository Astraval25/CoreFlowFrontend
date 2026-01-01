export const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_OTP: "/auth/verify-otp",
  RESEND_OTP: "/auth/send-otp",
  GET_COMPANY: "/companies/my-companies/active",
  GET_CUSTOMERS: (companyId) => `/companies/${companyId}/customers/active`,
};
