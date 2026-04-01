import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const RedirectIfLoggedIn = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    let companyId = "";
    try {
      const decode = jwtDecode(token);
      companyId = decode?.defaultComp?.[0] ?? "";
    } catch {
      companyId = "";
    }
    const target = companyId ? `/cf/company/${companyId}/dashboard` : "/cf/company/list";
    return <Navigate to={target} replace />;
  }

  return children;
};

export default RedirectIfLoggedIn;
