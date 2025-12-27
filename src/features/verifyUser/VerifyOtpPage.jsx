import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import VerifyOtpForm from "./VerifyOtpForm";
import { useVerifyOtp } from "./useVerifyOtp";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, resendOtp  } = useVerifyOtp();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const prefilledEmail = location.state?.email || "";

  const handleVerify = async (data) => {
    try {
      setError("");
      setMessage("");
      const result = await verifyOtp(data);

      // Check if verification was successful
      if (result.responseStatus) {
        const landingUrl = result.responseData?.landingUrl || "/";
        navigate(landingUrl);
      } else {
        setError(result.responseMessage || "Verification failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResend = async (email) => {
    try {
      setError("");
      setMessage("");
      const res = await resendOtp(email);

      if (res.responseStatus) {
        setMessage(res.responseMessage || "OTP sent successfully");
      } else {
        setError(res.responseMessage || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-1">Verify OTP</h1>

        <p className="text-center text-gray-500 mb-6">
          Enter the OTP sent to your email
        </p>

        <VerifyOtpForm
          onSubmit={handleVerify}
          onResend={handleResend}
          prefilledEmail={prefilledEmail} 
          error={error}
        />

        {message && (
          <div className="mt-4 text-green-600 text-center">{message}</div>
        )}

        <p className="text-center mt-5 text-sm">
          Back to{" "}
          <span
            onClick={() => navigate("/")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
