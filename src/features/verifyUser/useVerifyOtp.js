import { coreApi } from "../../shared/services/coreApi";

export const useVerifyOtp = () => {
  const verifyOtp = async (data) => {
    try {
      const res = await coreApi.verify_otp(data);
      // console.log(res)
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.responseMessage || "OTP verification failed"
      );
    }
  };

  const resendOtp = async (email) => {
    try {
      const res = await coreApi.resend_otp({ email });
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.responseMessage || "Failed to resend OTP"
      );
    }
  };

  return { verifyOtp, resendOtp };
};
