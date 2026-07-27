import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RegisterForm from "./RegisterForm";
import { useRegister } from "./useRegister";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useRegister();
  const [error, setError] = useState("");

  const handleRegister = async (formData) => {
    try {
      setError("");
      const res = await register({
        companyName: formData.companyName.trim(),
        countryCode: formData.countryCode.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
      });
      if (res.responseStatus) {
        const responseData = res.responseData;
        if (responseData?.emailVerificationRequired && responseData?.email) {
          navigate("/cf/auth/verify", {
            state: {
              email: responseData.email,
            },
          });
        } else {
          navigate("/cf/auth/login");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-1">Create Account</h1>

        <p className="text-center text-gray-500 mb-6">
          Register to get started
        </p>

        <RegisterForm onSubmit={handleRegister} error={error} />

        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/cf/auth/login")}
            className="text-blue-600 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
