import { Navigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default RedirectIfLoggedIn;