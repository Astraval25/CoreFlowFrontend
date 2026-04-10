import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { useLogin } from "./useLogin";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useLogin();
  const [error, setError] = useState("");

  const handleLogin = async (credentials) => {
    try {
      setError("");
      const data = await login(credentials);

      const token = data?.responseData?.token || localStorage.getItem("token");
      let companyId = "";

      if (token) {
        try {
          const decoded = jwtDecode(token);
          companyId = decoded?.defaultComp?.[0] ?? "";
        } catch {
          companyId = "";
        }
      }

      const targetPath =
        companyId
          ? `/cf/company/${companyId}/dashboard`
          : data?.responseData?.landingUrl || "/cf/company/list";

      navigate(targetPath);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white w-full max-w-sm p-6 rounded-3xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-1">Welcome Back</h1>

        <p className="text-center text-gray-500 mb-6">
          Login to access your account
        </p>

        <LoginForm onSubmit={handleLogin} />

        {error && <div className="mt-4  text-red-500 text-center">{error}</div>}

        <p className="text-center mt-5 text-sm">
          Don’t have an account?{" "}
          <span className="text-blue-600 cursor-pointer font-medium" onClick={() => navigate("/cf/auth/register")}>
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
